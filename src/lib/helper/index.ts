import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
type FlightType =
  | "valuejet"
  | "arikair"
  | "airpeace"
  | "overland"
  | "greenafrica";

// Declare chrome property on Window interface
declare global {
  interface Window {
    chrome?: {
      runtime: Record<string, unknown>;
    };
  }
}

export const scrapper = async ({
  url,
  flightType,
}: {
  url: string;
  flightType: FlightType;
}) => {
  const browser = await puppeteer.launch({
    args: [
      ...(isLocal ? puppeteer.defaultArgs() : chromium.args),
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
      )),
    headless: true,
  });

  const page = await browser.newPage();

  // Enhanced browser fingerprinting evasion
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
    (window as any).chrome = { runtime: {} };
  });

  // Set user agent with more realistic browser fingerprint
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Set additional headers to appear more like a real browser
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  });

  // Add request interception
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "stylesheet", "font"].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    // Wait longer for navigation
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    const content = await page.evaluate((flightType) => {
      const targetDiv =
        flightType === "valuejet"
          ? document.querySelector(
              'div[class="flex flex-wrap list-reset focus:shadow-outline p-2 pt-6 lg:p-8 bg-white shadow-lg rounded-lg"]'
            )
          : flightType === "overland"
          ? document.querySelector('div[class="flightList"]')
          : document.body;
      if (!targetDiv) return "";
      targetDiv.querySelectorAll("svg, img").forEach((el) => el.remove());
      return targetDiv.outerHTML;
    }, flightType);

    return content;
  } catch (error) {
    console.error("Navigation error:", error);
    throw error;
  } finally {
    await browser.close();
  }
};
