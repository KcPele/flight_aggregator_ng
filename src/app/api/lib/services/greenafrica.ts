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
  ): Promise<{ flightData: greenAfricaDataType; url: string }> {
    const searchParams = new URLSearchParams({
      from: params.origin,
      to: params.destination,
      start: format(params.departure, "yyyy/MM/dd"),
      adults: params.adults.toString(),
      child: params.children.toString(),
      session_id: Math.random().toString(36).substring(9),
      infant: params.infants.toString(),
      currency: "NGN",
      cabinCode: "ECO",
    });

    const url = `${API_BASE_URL}/booking/getDeepLink?${searchParams.toString()}`;
    const response = await fetch(`${url}`, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch flight data");
    }

    return { flightData: await response.json(), url };
  }

  async searchFlights(params: GreenAfricaSearchParams): Promise<{
    flightsData: GreenAfricaFlight[];
    url: string;
  }> {
    try {
      const res = await this.getDeepLink(params);
      const data = res.flightData;

      // Return early if no flights are found
      if (!data.data.flights.flight?.length) {
        return {
          flightsData: [],
          url: res.url,
        };
      }

      // Map and filter flights
      const flightsData = data.data.flights.flight
        .map((flight) => {
          const journey = flight.journey?.[0];
          if (!journey) return null;

          // Find the lowest fare class
          const lowestClass = Object.values(journey.classes || {}).reduce(
            (min, curr) =>
              !min || curr.totalfare < min.totalfare ? curr : min,
            Object.values(journey.classes || {})[0]
          );

          // Only proceed if the lowest fare class has a valid price
          if (
            !lowestClass ||
            isNaN(parseFloat(lowestClass.totalfare.toString()))
          ) {
            return null;
          }

          return {
            departureTime: journey.STD || "",
            arrivalTime: journey.STA || "",
            departurePort: journey.fromcode,
            arrivalPort: journey.tocode,
            flightNumber: journey.fltnum,
            duration: "", // Calculate from STD and STA if needed
            price: lowestClass.totalfare.toString(),
            fareTypes: Object.entries(journey.classes || {}).map(
              ([, classData]) => ({
                name: classData.type,
                price: classData.totalfare.toString(),
                freeseats: classData.freeseats,
                benefits: Object.entries(classData.services || {})
                  .filter(([, service]) => service.active)
                  .map(([, service]) => service.text),
              })
            ),
          };
        })
        .filter((flight): flight is GreenAfricaFlight => flight !== null);

      return { flightsData, url: res.url };
    } catch (error) {
      // console.error("Green Africa API Error:", error);
      throw error;
    }
  }
}
