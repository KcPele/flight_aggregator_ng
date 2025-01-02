// app/api/flights/airpeace/route.ts
import { NextResponse } from "next/server";
import { AirPeaceService } from "@/lib/services/airpeace";
import { AirPeaceSearchParams } from "@/types/airpeace";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params: AirPeaceSearchParams = {
      tripType:
        (searchParams.get("tripType") as "ONE_WAY" | "ROUND_TRIP") || "ONE_WAY",
      depPort: searchParams.get("depPort") || "",
      arrPort: searchParams.get("arrPort") || "",
      departureDate: searchParams.get("departureDate") || "",
      adult: Number(searchParams.get("adult")) || 1,
      child: Number(searchParams.get("child")) || 0,
      infant: Number(searchParams.get("infant")) || 0,
      lang: searchParams.get("lang") || "en",
    };

    // Validate required parameters
    if (!params.depPort || !params.arrPort || !params.departureDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const airPeaceService = new AirPeaceService();
    const flights = await airPeaceService.searchFlights(params);

    return NextResponse.json({ flights });
  } catch (error) {
    console.error("Error in Air Peace API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight data" },
      { status: 500 }
    );
  }
}
