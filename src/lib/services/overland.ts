// lib/services/overland.ts
import {
  CalendarDay,
  CalendarResponse,
  OverlandFlightDetails,
  OverlandSearchParams,
} from "@/types/overland";

export class OverlandService {
  private readonly BASE_URL = "https://www.overlandairways.com";
  private readonly SEARCH_URL = `${this.BASE_URL}/controllers/bookingProcess/searchCalendar.php`;

  private buildSearchUrl(params: OverlandSearchParams): string {
    const searchParams = new URLSearchParams({
      type: params.type,
      adults: params.adults.toString(),
      children: params.children.toString(),
      infants: params.infants.toString(),
      fromDst: params.fromDst,
      toDst: params.toDst,
    });

    return `${this.SEARCH_URL}?${searchParams.toString()}`;
  }

  async searchFlights(params: OverlandSearchParams): Promise<CalendarDay[]> {
    try {
      const url = this.buildSearchUrl(params);
      console.log(url);
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Referer: this.BASE_URL,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const res = await response.json();
        return Array.isArray(res.calendar[0].days)
          ? res.calendar[0].days.filter(
              (day: CalendarDay) => day.flight && day.fare !== false
            )
          : [];
      } else {
        const textResponse = await response.text();
        console.error("Unexpected response:", textResponse);
        throw new Error("API did not return JSON");
      }
    } catch (error) {
      console.error("Error fetching Overland Airways flights:", error);
      throw error;
    }
  }
}
