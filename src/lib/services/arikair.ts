// lib/services/arikair.ts
import { load } from "cheerio";
import { format } from "date-fns";
import { ArikAirSearchParams, ArikAirFlightData } from "@/types/arikair";

export class ArikAirService {
  private readonly BASE_URL = "https://arikair.crane.aero";
  private readonly SESSION_URL = `${this.BASE_URL}/ibe/home`;
  private readonly SEARCH_URL = `${this.BASE_URL}/ibe/availability/create`;

  private async getCookiesAndTokens(): Promise<{
    cookies: string[];
    sid: string;
    cid: string;
  }> {
    try {
      const response = await fetch(this.SESSION_URL, {
        method: "GET",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to get session");

      const html = await response.text();
      const $ = load(html);

      const cookies = response.headers.getSetCookie() || [];
      const sid = $('input[name="_sid"]').val() || "";
      const cid = $('input[name="_cid"]').val() || "";

      if (!sid || !cid) throw new Error("Failed to extract session tokens");

      return { cookies, sid, cid };
    } catch (error) {
      console.error("Session initialization failed:", error);
      throw error;
    }
  }

  private buildSearchParams(
    params: ArikAirSearchParams & { _sid: string; _cid: string }
  ): string {
    const searchParams = new URLSearchParams();

    searchParams.append("_sid", params._sid);
    searchParams.append("_cid", params._cid);
    searchParams.append("tripType", params.tripType);
    searchParams.append("inlineRadioOptions", "on");
    searchParams.append("flightRequestList[0].depPort", params.depPort);
    searchParams.append("flightRequestList[0].arrPort", params.arrPort);
    searchParams.append(
      "flightRequestList[0].date",
      format(params.date, "dd MMM yyyy")
    );
    searchParams.append("passengerQuantities[0].passengerType", "ADLT");
    searchParams.append(
      "passengerQuantities[0].quantity",
      params.passengers.adult.toString()
    );
    searchParams.append("passengerQuantities[1].passengerType", "CHLD");
    searchParams.append(
      "passengerQuantities[1].quantity",
      params.passengers.child.toString()
    );
    searchParams.append("passengerQuantities[2].passengerType", "INFT");
    searchParams.append(
      "passengerQuantities[2].quantity",
      params.passengers.infant.toString()
    );

    return searchParams.toString();
  }

  private parseFlights(html: string): ArikAirFlightData {
    const $ = load(html);
    const flights: ArikAirFlightData = [];

    $(".js-journey").each((_, element) => {
      const flight = {
        departureTime: $(element)
          .find(".left-info-block .time")
          .first()
          .text()
          .trim(),
        arrivalTime: $(element)
          .find(".right-info-block .time")
          .first()
          .text()
          .trim(),
        departurePort: $(element).find(".left-info-block .port").text().trim(),
        arrivalPort: $(element).find(".right-info-block .port").text().trim(),
        flightNumber: $(element).find(".middle-block .flight-no").text().trim(),
        flightDuration: $(element)
          .find(".middle-block .flight-duration")
          .text()
          .trim(),
        price: $(element)
          .find(".price-best-offer, .price")
          .first()
          .text()
          .replace("₦", "")
          .replace(/,/g, "")
          .trim(),
        seatsRemaining: $(element).find(".remain-seat .count").text().trim(),
      };

      if (flight.departureTime && flight.arrivalTime) {
        flights.push(flight);
      }
    });

    return flights;
  }

  async searchFlights(
    params: Omit<ArikAirSearchParams, "_sid" | "_cid">
  ): Promise<ArikAirFlightData> {
    try {
      const { cookies, sid, cid } = await this.getCookiesAndTokens();
      const searchParams = this.buildSearchParams({
        ...params,
        _sid: sid,
        _cid: cid,
      });

      const response = await fetch(`${this.SEARCH_URL}?${searchParams}`, {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Cookie: cookies.join("; "),
          Referer: this.SESSION_URL,
        },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch flights");

      const html = await response.text();
      return this.parseFlights(html);
    } catch (error) {
      console.error("Flight search failed:", error);
      throw error;
    }
  }
}
