// lib/services/ibomair.ts
import { load } from "cheerio";
import { format } from "date-fns";
import {
  IbomAirSearchParams,
  IbomAirFlightData,
  IbomAirFare,
} from "@/types/ibomair";

export class IbomAirService {
  private readonly BASE_URL = "https://book-ibomair.crane.aero";
  private readonly SESSION_URL = `${this.BASE_URL}/ibe/home`;
  private readonly SEARCH_URL = `${this.BASE_URL}/ibe/availability`;

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

      return { cookies, sid, cid };
    } catch (error) {
      console.error("Error initializing session:", error);
      throw error;
    }
  }

  private formatDate(date: Date): string {
    return format(date, "dd.MM.yyyy");
  }

  private buildSearchUrl(params: IbomAirSearchParams): string {
    const searchParams = new URLSearchParams({
      tripType: params.tripType,
      depPort: params.depPort,
      arrPort: params.arrPort,
      departureDate: params.date,
      adult: params.passengers.adult.toString(),
      child: params.passengers.child.toString(),
      infant: params.passengers.infant.toString(),
    });

    return `${this.SEARCH_URL}?${searchParams.toString()}`;
  }

  private parseHTML(html: string): IbomAirFlightData {
    const $ = load(html);
    const flights: IbomAirFlightData = [];

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
        .find(".col-12.middle-block .flight-no")
        .text()
        .trim();
      const flightDuration = $(element)
        .find(".col-12.middle-block .flight-duration")
        .text()
        .trim();
      const stops = $(element)
        .find(".col-12.middle-block .total-stop")
        .text()
        .trim();

      const fares: IbomAirFare[] = [];
      $(element)
        .find(".fare-container .currency-left-side")
        .each((_, fareElement) => {
          const priceText = $(fareElement)
            .text()
            .replace("₦", "")
            .replace(/,/g, "")
            .trim();

          const price = parseFloat(priceText);
          if (!isNaN(price)) {
            const fareType = $(fareElement)
              .closest(".cabin-class-container")
              .find(".cabin-header")
              .text()
              .trim();
            fares.push({ fareType, price: priceText });
          }
        });

      if (departureTime && arrivalTime && fares.length > 0) {
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
          duration: flightDuration,
          stops,
          fares,
        });
      }
    });

    return flights;
  }

  async searchFlights(
    params: Omit<IbomAirSearchParams, "_sid" | "_cid" | "date"> & { date: Date }
  ): Promise<{
    flightsData: IbomAirFlightData;
    url: string;
  }> {
    try {
      // First initialize the session
      const { cookies, sid, cid } = await this.initializeSession();

      // Prepare search parameters
      const formattedParams: IbomAirSearchParams = {
        ...params,
        date: this.formatDate(params.date),
        _sid: sid,
        _cid: cid,
      };

      // Make the search request with session cookies
      const searchUrl = this.buildSearchUrl(formattedParams);
      const response = await fetch(searchUrl, {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Cookie: cookies,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      return {
        flightsData: this.parseHTML(html),
        url: searchUrl,
      };
    } catch (error) {
      // console.error("Error fetching Ibom Air flights:", error);
      throw error;
    }
  }
}
