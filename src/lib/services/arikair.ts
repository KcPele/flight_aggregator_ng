// lib/services/arikair.ts
import { load } from "cheerio";
import { format } from "date-fns";
import {
  ArikAirSearchParams,
  ArikAirFlightData,
  ArikAirPassengers,
} from "@/types/arikair";

export class ArikAirService {
  private readonly BASE_URL = "https://arikair.crane.aero";
  private readonly SESSION_URL = `${this.BASE_URL}/ibe/home`;
  private readonly SEARCH_URL = `${this.BASE_URL}/ibe/availability/create`;

  private async initializeSession(): Promise<{
    cookies: string;
    sid: string;
    cid: string;
  }> {
    try {
      const response = await fetch(this.SESSION_URL, {
        method: "GET",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to initialize session");
      }

      const cookies = response.headers.get("set-cookie") || "";
      const html = await response.text();
      const $ = load(html);

      // Extract session and client IDs from the page
      const sid = $('input[name="_sid"]').val() as string;
      const cid = $('input[name="_cid"]').val() as string;

      if (!sid || !cid) {
        throw new Error("Failed to extract session or client ID");
      }

      return { cookies, sid, cid };
    } catch (error) {
      console.error("Error initializing session:", error);
      throw error;
    }
  }

  private formatDate(date: Date): string {
    return format(date, "dd MMM yyyy");
  }

  private buildSearchUrl(params: ArikAirSearchParams): string {
    // Start with base parameters
    const baseParams = new URLSearchParams({
      _sid: params._sid!,
      _cid: params._cid!,
      tripType: params.tripType,
      inlineRadioOptions: "on",
      depPort: params.depPort,
      arrPort: params.arrPort,
      date: params.date,
    });

    // Add passenger parameters
    baseParams.append("passengerType", "ADLT");
    baseParams.append("quantity", params.passengers.adult.toString());
    baseParams.append("passengerType", "CHLD");
    baseParams.append("quantity", params.passengers.child.toString());
    baseParams.append("passengerType", "INFT");
    baseParams.append("quantity", params.passengers.infant.toString());

    return `${this.SEARCH_URL}?${baseParams.toString()}`;
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
      // Initialize session first
      const { cookies, sid, cid } = await this.initializeSession();

      // Prepare search parameters with valid session
      const formattedParams: ArikAirSearchParams = {
        ...params,
        date: this.formatDate(params.date),
        _sid: sid,
        _cid: cid,
        inlineRadioOptions: "on",
        passengers: {
          adult: params.passengers.adult || 1,
          child: params.passengers.child || 0,
          infant: params.passengers.infant || 0,
        },
      };

      // Make the search request with session cookies
      const searchUrl = this.buildSearchUrl(formattedParams);
      console.log("Search URL:", searchUrl);

      const response = await fetch(searchUrl, {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Cookie: cookies,
          Referer: this.SESSION_URL,
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
