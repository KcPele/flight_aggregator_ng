import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
type FlightType =
  | "valuejet"
  | "arikair"
  | "airpeace"
  | "overland"
  | "greenafrica";
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
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
    headless: true,
  });

  const page = await browser.newPage();

  // Set user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Add request interception
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "stylesheet", "font"].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  // Add additional headers
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
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
