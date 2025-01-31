// lib/services/azman.ts
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import {
  AzmanAirSearchParams,
  AzmanAirFormData,
  AzmanAirFlightData,
} from "@/types/azmanair";
import { extractFlightData } from "../utils";
export class AzmanService {
  private readonly BASE_URL =
    "https://booking.airazman.com/VARS/Public/WebServices/AvailabilityWS.asmx/GetFlightAvailability";
  private sessionId: string;

  constructor() {
    this.sessionId = uuidv4();
  }

  private buildRequestBody(params: AzmanAirSearchParams): string {
    const formData: AzmanAirFormData = {
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

  private async getFlightsFromRecap(url: string): Promise<AzmanAirFlightData> {
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
      return extractFlightData(html);
    } catch (error) {
      console.error("Failed to fetch recap page:", error);
      return [];
    }
  }

  

  async searchFlights(params: AzmanAirSearchParams): Promise<{
    flightsData: AzmanAirFlightData;
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
          Origin: "https://booking.airazman.com",
          Referer:
            "https://booking.airazman.com/VARS/Public/SearchEngine/SearchFlight",
        },
        body: this.buildRequestBody(params),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch flights: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      // console.log(data);
      if (data?.d?.Result === "OK" && data?.d?.NextURL) {
        const flights = await this.getFlightsFromRecap(data.d.NextURL);
        return {
          flightsData: flights,
          url: data.d.NextURL,
        };
      }

      return {
        flightsData: [],
        url: response.url,
      };
    } catch (error) {
      console.error("Flight search failed:", error);
      throw error;
    }
  }
}
