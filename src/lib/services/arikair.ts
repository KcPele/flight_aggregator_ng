// lib/services/arikair.ts
import { load } from "cheerio";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { ArikAirSearchParams, ArikAirFlightData } from "@/types/arikair";

export class ArikAirService {
  private readonly BASE_URL =
    "https://arikair.crane.aero/ibe/availability/create";

  private generateSessionId(): string {
    return uuidv4();
  }

  private generateClientId(): string {
    return uuidv4();
  }

  private formatDate(date: Date): string {
    return format(date, "dd MMM yyyy");
  }

  private buildUrl(params: ArikAirSearchParams): string {
    const searchParams = new URLSearchParams({
      _sid: params._sid || this.generateSessionId(),
      _cid: params._cid || this.generateClientId(),
      tripType: params.tripType,
      depPort: params.depPort,
      arrPort: params.arrPort,
      date: params.date,
      cabinClass: params.cabinClass || "",
    });

    return `${this.BASE_URL}?${searchParams.toString()}`;
  }

  private parseHTML(html: string): ArikAirFlightData {
    const $ = load(html);
    const flights: ArikAirFlightData = [];

    $(".js-journey").each((_, element) => {
      const departureTime = $(element)
        .find(".left-info-block .time")
        .first()
        .text()
        .trim();
      const arrivalTime = $(element)
        .find(".right-info-block .time")
        .first()
        .text()
        .trim();
      const departurePort = $(element)
        .find(".left-info-block .port")
        .text()
        .trim();
      const arrivalPort = $(element)
        .find(".right-info-block .port")
        .text()
        .trim();
      const flightNumber = $(element)
        .find(".middle-block .flight-no")
        .text()
        .trim();
      const flightDuration = $(element)
        .find(".middle-block .flight-duration")
        .text()
        .trim();

      const price = $(element)
        .find(".price-best-offer, .price")
        .first()
        .text()
        .replace("₦", "")
        .replace(/,/g, "")
        .trim();

      const seatsRemaining = $(element)
        .find(".remain-seat .count")
        .text()
        .trim();

      if (departureTime && arrivalTime) {
        flights.push({
          departureTime,
          arrivalTime,
          departurePort,
          arrivalPort,
          flightNumber,
          flightDuration,
          price,
          seatsRemaining,
        });
      }
    });

    return flights;
  }

  async searchFlights(
    params: Omit<ArikAirSearchParams, "_sid" | "_cid"> & { date: Date }
  ): Promise<ArikAirFlightData> {
    try {
      const formattedParams: ArikAirSearchParams = {
        ...params,
        date: this.formatDate(params.date),
        _sid: this.generateSessionId(),
        _cid: this.generateClientId(),
      };

      const url = this.buildUrl(formattedParams);
      console.log(url);
      const response = await fetch(url, {
        headers: {
          Accept: "text/html",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      return this.parseHTML(html);
    } catch (error) {
      console.error("Error fetching Arik Air flights:", error);
      throw error;
    }
  }
}
