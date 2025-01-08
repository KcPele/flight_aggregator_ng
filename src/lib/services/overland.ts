// lib/services/overland.ts
import * as cheerio from "cheerio";
import { OverlandFlightDetails, OverlandSearchParams } from "@/types/overland";
import { scrapper } from "../helper";

export class OverlandService {
  private readonly BASE_URL = "https://www.overlandairways.com";
  private readonly SEARCH_URL = `${this.BASE_URL}/flight-results`;

  private buildSearchUrl(params: OverlandSearchParams, date: string): string {
    return `${this.SEARCH_URL}/${params.fromDst}-${params.toDst}/${date}/NA/${params.adults}/${params.children}/${params.infants}`;
  }

  private parseDuration(text: string): string {
    const matches = text.match(/(\d+):(\d+)/);
    if (!matches) return text;
    return `${matches[1]}h ${matches[2]}m`;
  }

  private parsePrice(text: string): number {
    const matches = text.match(/₦\s*([\d,]+)/);
    if (!matches) return 0;
    return Number(matches[1].replace(/,/g, ""));
  }

  private async scrapeFlightDetails(
    html: string
  ): Promise<OverlandFlightDetails[]> {
    const $ = cheerio.load(html);
    const flights: OverlandFlightDetails[] = [];

    $(".flightItem.flightHolder").each((_, flightEl) => {
      const departure = $(flightEl)
        .find(".flightItem_titleLeft .flightItem_titleTime")
        .first();
      const arrival = $(flightEl)
        .find(".flightItem_titleLeft .flightItem_titleTime")
        .last();
      const flightInfo = $(flightEl).find(".flightItem_titleRight");
      const duration = $(flightEl).find(".flightItem__duration").text();
      const viaText = $(flightEl).find(".flightChoice_tooltipToggle").text();

      const fareClasses: OverlandFlightDetails["fareClasses"] = [];
      $(flightEl)
        .find(".flight-class__box")
        .each((_, fareEl) => {
          const $fare = $(fareEl);
          const fareClass = $fare
            .find(".flight-class__heading--primary")
            .text()
            .trim();
          const priceText = $fare.find(".btn-class").text().trim();
          const available = !$fare.find(".maxBookingClass").length;
          const rules = $fare.find(".flightChoice_tooltipNote").text().trim();

          fareClasses.push({
            flightNumber: flightInfo.find("strong").text().trim(),
            fareClass,
            price: this.parsePrice(priceText),
            available,
            duration: this.parseDuration(duration),
            baggageAllowance:
              rules.match(/Baggage Allowance: ([^.]+)/)?.[1] || "",
            fareRules: rules,
          });
        });

      const flight: OverlandFlightDetails = {
        departureTime: departure.find("strong").first().text().trim(),
        arrivalTime: arrival.find("strong").first().text().trim(),
        departureDate: departure.find("span").text().split("|")[0].trim(),
        arrivalDate: arrival.find("span").text().split("|")[0].trim(),
        departureAirport: departure.find("span").text().split("|")[1].trim(),
        arrivalAirport: arrival.find("span").text().split("|")[1].trim(),
        flightNumber: flightInfo.find("strong").text().trim(),
        operatingAirline: flightInfo.find("span").text().trim(),
        duration: this.parseDuration(duration),
        stops: viaText.includes("Non stop") ? [] : viaText.split(","),
        via: viaText.includes("Via") ? [viaText.replace("Via ", "")] : [],
        fareClasses,
      };

      flights.push(flight);
    });

    return flights;
  }

  async searchFlights(
    params: OverlandSearchParams,
    date: string
  ): Promise<{ flightsData: OverlandFlightDetails[]; url: string }> {
    try {
      const url = this.buildSearchUrl(params, date);
      console.log(url);
      const response = await scrapper({
        url,
        flightType: "overland",
      });

      // console.log(response);
      return {
        flightsData: await this.scrapeFlightDetails(response),
        url,
      };
    } catch (error) {
      // console.error("Error fetching Overland Airways flights:", error);
      throw error;
    }
  }
}
