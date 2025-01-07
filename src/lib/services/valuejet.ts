// lib/services/valuejet.ts
import { format } from "date-fns";
import { load } from "cheerio";
import { valueJetDataType } from "@/types/valuejet";

interface ValueJetSearchParams {
  dep: string;
  arr: string;
  departure: Date;
  adults: number;
  children: number;
  infants: number;
}

interface ValueJetFlight {
  departureTime: string;
  arrivalTime: string;
  departurePort: string;
  arrivalPort: string;
  flightNumber: string;
  duration: string;
  price: string;
  fareTypes: {
    name: string;
    price: string;
  }[];
  seatsRemaining?: string;
}

export class ValueJetService {
  private readonly BASE_URL = "https://api.flyvaluejet.com";
  private readonly API_URL = `${this.BASE_URL}/ibe/flight/search/dates`;

  async searchFlights(params: ValueJetSearchParams): Promise<ValueJetFlight[]> {
    try {
      const searchParams = new URLSearchParams({
        on: format(params.departure, "yyyy-MM-dd"),
        to: params.arr,
        from: params.dep,
        adult: params.adults.toString(),
        child: params.children.toString(),
        infant: params.infants.toString(),
      });

      const response = await fetch(
        `${this.API_URL}/?${searchParams.toString()}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }

      const data = await response.json();
      console.log(data);
      return this.parseFlights(data, params);
    } catch (error) {
      console.error("ValueJet API Error:", error);
      throw error;
    }
  }

  private parseFlights(
    data: any,
    params: ValueJetSearchParams
  ): ValueJetFlight[] {
    if (!data.data?._ || !data.data.bounds) {
      return [];
    }

    return data.data._.map((combination: any) => ({
      date: combination.combinations[0].date,
      departurePort: params.dep,
      arrivalPort: params.arr,
      price: combination.amount.value.toString(),
    }));
  }
}
