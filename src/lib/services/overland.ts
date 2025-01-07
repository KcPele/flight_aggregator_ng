// lib/services/overland.ts
import { OverlandSearchParams, OverlandFlightData } from "@/types/overland";

export class OverlandService {
  private readonly BASE_URL = "https://www.overlandairways.com";
  private readonly SEARCH_URL = `${this.BASE_URL}/controllers/bookingProcess/searchCalendar.php`;

  private buildUrl(params: OverlandSearchParams): string {
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

  private validateResponse(data: any): data is OverlandFlightData {
    if (typeof data !== "object" || data === null) return false;
    if (typeof data.hasResults !== "boolean") return false;
    if (!Array.isArray(data.calendar)) return false;

    return data.calendar.every((month: any) => {
      if (typeof month !== "object") return false;
      if (typeof month.year !== "string") return false;
      if (typeof month.monthname !== "string") return false;
      if (typeof month.monthnumber !== "string") return false;
      if (!Array.isArray(month.days)) return false;

      return month.days.every((day: any) => {
        if (typeof day !== "object") return false;
        if (typeof day.daynumber !== "string") return false;
        if (typeof day.fullDate !== "string") return false;
        if (!(typeof day.fare === "number" || day.fare === false)) return false;
        if (typeof day.highlight !== "boolean") return false;
        if (typeof day.farebackup !== "boolean") return false;
        if (typeof day.flight !== "boolean") return false;
        return true;
      });
    });
  }

  async searchFlights(
    params: OverlandSearchParams
  ): Promise<OverlandFlightData> {
    try {
      const url = this.buildUrl(params);
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

      const data = await response.json();

      if (!this.validateResponse(data)) {
        throw new Error("Invalid response format from Overland Airways API");
      }

      return data;
    } catch (error) {
      console.error("Error fetching Overland Airways flights:", error);
      throw error;
    }
  }

  getAvailableFlights(data: OverlandFlightData): Array<{
    date: string;
    fare: number;
  }> {
    const availableFlights: Array<{ date: string; fare: number }> = [];

    data.calendar.forEach((month) => {
      month.days.forEach((day) => {
        if (day.flight && typeof day.fare === "number") {
          availableFlights.push({
            date: day.fullDate,
            fare: day.fare,
          });
        }
      });
    });

    return availableFlights.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }
}
