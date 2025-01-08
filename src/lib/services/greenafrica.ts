//@ts-ignore i did not make use of _
import {
  greenAfricaDataType,
  GreenAfricaSearchParams,
  GreenAfricaFlight,
} from "@/types/greenafrica";
import { format } from "date-fns";

const API_BASE_URL = "https://middleware.greenafrica.com/api";

export class GreenAfricaService {
  private async getDeepLink(
    params: GreenAfricaSearchParams
  ): Promise<greenAfricaDataType> {
    const url = `${API_BASE_URL}/booking/getDeepLink`;
    const searchParams = new URLSearchParams({
      from: params.origin,
      to: params.destination,
      start: format(params.departure, "yyyy/MM/dd"),
      adults: params.adults.toString(),
      child: params.children.toString(),
      infant: params.infants.toString(),
      currency: "NGN",
      cabinCode: "ECO",
      session_id: Math.random().toString(36).substring(7),
    });

    const response = await fetch(`${url}?${searchParams.toString()}`, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch flight data");
    }

    return response.json();
  }

  async searchFlights(
    params: GreenAfricaSearchParams
  ): Promise<GreenAfricaFlight[]> {
    try {
      const data = await this.getDeepLink(params);

      if (!data.data.flights.flight?.length) {
        return [];
      }

      return data.data.flights.flight
        .map((flight) => {
          const journey = flight.journey?.[0];
          if (!journey) return null;

          const lowestClass = Object.values(journey.classes || {}).reduce(
            (min, curr) =>
              !min || curr.totalfare < min.totalfare ? curr : min,
            Object.values(journey.classes || {})[0]
          );
          return {
            departureTime: journey.STD || "",
            arrivalTime: journey.STA || "",
            departurePort: journey.fromcode,
            arrivalPort: journey.tocode,
            flightNumber: journey.fltnum,
            duration: "", // Calculate from STD and STA if needed
            price: lowestClass?.totalfare.toString() || "N/A",
            fareTypes: Object.entries(journey.classes || {}).map(
              ([, classData]) => ({
                name: classData.type,
                price: classData.totalfare.toString(),
                benefits: Object.entries(classData.services || {})

                  .filter(([, service]) => service.active)

                  .map(([, service]) => service.text),
              })
            ),
          };
        })
        .filter((flight): flight is GreenAfricaFlight => flight !== null);
    } catch (error) {
      // console.error("Green Africa API Error:", error);
      throw error;
    }
  }
}
