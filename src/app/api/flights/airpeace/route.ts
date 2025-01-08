// app/api/flights/airpeace/route.ts
import { NextResponse } from "next/server";
import { AirPeaceService } from "@/lib/services/airpeace";
import { AirPeaceSearchParams } from "@/types/airpeace";
import { parse, format } from "date-fns";
import { DATE_FORMAT } from "@/lib/config";

export const runtime = "edge";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params: AirPeaceSearchParams = {
      tripType:
        (searchParams.get("tripType") as "ONE_WAY" | "ROUND_TRIP") || "ONE_WAY",
      depPort: searchParams.get("depPort") || "",
      arrPort: searchParams.get("arrPort") || "",
      departureDate: format(
        parse(searchParams.get("date") || "", DATE_FORMAT.STANDARD, new Date()),
        DATE_FORMAT.AIRPEACE
      ),
      adult: Number(searchParams.get("adult")) || 1,
      child: Number(searchParams.get("child")) || 0,
      infant: Number(searchParams.get("infant")) || 0,
      lang: searchParams.get("lang") || "en",
    };

    // Validate required parameters
    if (!params.depPort || !params.arrPort || !params.departureDate) {
      return NextResponse.json(
        { error: "Missing required parameters", provider: "arikair" },
        { status: 400 }
      );
    }

    const airPeaceService = new AirPeaceService();
    const flights = await airPeaceService.searchFlights(params);

    return NextResponse.json({
      provider: "airpeace",
      flights: flights.flightsData,
      url: flights.url,
      searchParams: params,
    });
  } catch (error) {
    // console.error("Error in Air Peace API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        provider: "airpeace",
      },
      { status: 500 }
    );
  }
}
