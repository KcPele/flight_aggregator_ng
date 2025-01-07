// app/api/flights/greenafrica/route.ts
import { NextResponse } from "next/server";
import { GreenAfricaService } from "@/lib/services/greenafrica";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      origin: searchParams.get("origin") || "LOS",
      destination: searchParams.get("destination") || "ABV",
      departure: new Date(searchParams.get("departure") || ""),
      adults: parseInt(searchParams.get("adult") || "1"),
      children: parseInt(searchParams.get("child") || "0"),
      infants: parseInt(searchParams.get("infant") || "0"),
    };

    if (!params.origin || !params.destination || !params.departure) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const service = new GreenAfricaService();
    const flights = await service.searchFlights(params);

    return NextResponse.json({
      provider: "Green Africa",
      flights,
      searchParams: params,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
