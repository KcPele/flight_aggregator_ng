// lib/services/airpeace.ts
import {
  AirPeaceFare,
  AirPeaceFlightData,
  AirPeaceSearchParams,
} from "@/types/airpeace";
import { load } from "cheerio";

export class AirPeaceService {
  private readonly BASE_URL =
    "https://book-airpeace.crane.aero/ibe/availability";

  private buildUrl(params: AirPeaceSearchParams): string {
    const searchParams = new URLSearchParams({
      tripType: params.tripType,
      depPort: params.depPort,
      arrPort: params.arrPort,
      departureDate: params.departureDate,
      adult: (params.adult ?? 1).toString(),
      child: (params.child ?? 0).toString(),
      infant: (params.infant ?? 0).toString(),
      lang: params.lang ?? "en",
    });

    return `${this.BASE_URL}?${searchParams.toString()}`;
  }

  private parseHTML(html: string): AirPeaceFlightData {
    const $ = load(html);
    const flights: AirPeaceFlightData = [];

    $(".js-scheduled-flight").each((_, element) => {
      const departureTime = $(element)
        .find(".left-info-block .time")
        .text()
        .trim();
      const departureAirport = $(element)
        .find(".left-info-block .port")
        .text()
        .trim();
      const departureDate = $(element)
        .find(".left-info-block .date")
        .text()
        .trim();

      const arrivalTime = $(element)
        .find(".right-info-block .time")
        .text()
        .trim();
      const arrivalAirport = $(element)
        .find(".right-info-block .port")
        .text()
        .trim();
      const arrivalDate = $(element)
        .find(".right-info-block .date")
        .text()
        .trim();

      const flightNumber = $(element)
        .find(".middle-block .flight-no")
        .text()
        .trim();
      const duration = $(element)
        .find(".middle-block .flight-duration")
        .text()
        .trim();
      const stops = $(element).find(".middle-block .total-stop").text().trim();

      const fares: AirPeaceFare[] = [];
      $(element)
        .find(".fare-container .fare-item")
        .each((_, fareElement) => {
          const priceText = $(fareElement)
            .find(".price-text-single-line")
            .text()
            .replace("₦", "")
            .replace(/,/g, "")
            .trim();
          const price = parseFloat(priceText); // Convert price text to a number

          // Only add the fare if the price is a valid number
          if (!isNaN(price)) {
            const fareType = $(fareElement)
              .find(".mobile-cabin-info")
              .text()
              .trim();
            const bestOffer =
              $(fareElement).find(".badge-primary label").text().trim() || null;

            fares.push({ fareType, price: priceText, bestOffer });
          }
        });

      // Only add the flight if it has at least one valid fare
      if (fares.length > 0) {
        flights.push({
          departure: {
            time: departureTime,
            airport: departureAirport,
            date: departureDate,
          },
          arrival: {
            time: arrivalTime,
            airport: arrivalAirport,
            date: arrivalDate,
          },
          flightNumber,
          duration,
          stops,
          fares,
        });
      }
    });

    return flights;
  }

  async searchFlights(
    params: AirPeaceSearchParams
  ): Promise<{ flightsData: AirPeaceFlightData; url: string }> {
    try {
      const url = this.buildUrl(params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      return { flightsData: this.parseHTML(html), url: response.url };
    } catch (error) {
      // console.error("Error fetching Air Peace flights:", error);
      throw error;
    }
  }
}
