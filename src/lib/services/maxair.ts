// lib/services/maxair.ts
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import * as cheerio from "cheerio";
import {
  MaxAirSearchParams,
  MaxAirFormData,
  MaxAirFlightData,
  MaxAirFlight,
} from "@/types/maxair";

export class MaxAirService {
  private readonly BASE_URL =
    "https://customer2.videcom.com/MaxAir/VARS/Public/WebServices/AvailabilityWS.asmx/GetFlightAvailability";
  private sessionId: string;

  constructor() {
    this.sessionId = uuidv4();
  }

  private buildRequestBody(params: MaxAirSearchParams): string {
    const formData: MaxAirFormData = {
      x: 52,
      y: 283,
      rqtm: Date.now().toString(),
      Origin: [params.depPort],
      VarsSessionID: this.sessionId,
      Destination: [params.arrPort],
      DepartureDate: [format(new Date(params.date), "dd-MMM-yyyy")],
      ReturnDate: null,
      Currency: "",
      DisplayCurrency: "",
      Adults: params.passengers.adult.toString(),
      Children: params.passengers.child.toString(),
      SmallChildren: 0,
      Seniors: 0,
      Students: 0,
      Infants: params.passengers.infant.toString(),
      Youths: 0,
      Teachers: 0,
      SeatedInfants: 0,
      EVoucher: "",
      recaptcha: "SHOW",
      SearchUser: "PUBLIC",
      SearchSource: "requirementsBS",
    };

    return JSON.stringify({
      FormData: formData,
      IsMMBChangeFlightMode: false,
      IsRefineSerach: false,
    });
  }

  private extractFlightData(html: string): MaxAirFlightData {
    const $ = cheerio.load(html);
    const flights: MaxAirFlightData = [];

    // Iterate over each flight panel
    $(".flt-panel").each((_, panel) => {
      const flight: MaxAirFlight = {
        departureTime: $(panel).find(".cal-Depart-time .time").text().trim(),
        arrivalTime: $(panel).find(".cal-Arrive-time .time").text().trim(),
        departureCity: $(panel).find(".cal-Depart-time .city").text().trim(),
        arrivalCity: $(panel).find(".cal-Arrive-time .city").text().trim(),
        flightDate: $(panel).find(".cal-Depart-time .flightDate").text().trim(),
        flightNumber: $(panel).find(".flightnumber").text().trim(),
        flightDuration: $(panel).find(".flightDuration").text().trim(),
        price: $(panel).find(".fare-price, .fare-price-small").text().trim(),
        class: "",
        seatsRemaining: "",
      };

      // Extract class and seat availability
      $(panel)
        .find(".flt-class")
        .each((_, classPanel) => {
          const classType = $(classPanel)
            .find(".class-band-name")
            .text()
            .trim();
          const seats = $(classPanel)
            .find(".seats-count, .seats-none")
            .text()
            .trim();
          if (classType && seats) {
            flight.class = classType;
            flight.seatsRemaining = seats;
          }
        });

      flights.push(flight);
    });

    return flights;
  }
  private async getFlightsFromRecap(url: string): Promise<MaxAirFlightData> {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: this.BASE_URL,
        },
        cache: "no-store",
      });

      if (!response.ok) return [];

      const html = await response.text();
      console.log(html);
      return this.extractFlightData(html);
    } catch (error) {
      console.error("Failed to fetch recap page:", error);
      return [];
    }
  }

  async searchFlights(params: MaxAirSearchParams): Promise<{
    flightsData: MaxAirFlightData;
    url: string;
  }> {
    try {
      const url = `${this.BASE_URL}?VarsSessionID=${this.sessionId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Origin: "https://customer2.videcom.com",
          Referer:
            "https://customer2.videcom.com/MaxAir/VARS/Public/SearchEngine/SearchFlight",
        },
        body: this.buildRequestBody(params),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch flights: ${response.status} ${response.statusText}`
        );
      }
      let flightsData: MaxAirFlightData = [];
      const data = await response.json();
      if (data?.d?.Result === "OK" && data?.d?.Data2) {
        flightsData = this.extractFlightData(data.d.Data2);
      } else if (data?.d?.Result === "OK" && data?.d?.NextURL) {
        flightsData = await this.getFlightsFromRecap(data.d.NextURL);
      }

      return {
        flightsData,
        url,
      };
    } catch (error) {
      console.error("Flight search failed:", error);
      throw error;
    }
  }
}
