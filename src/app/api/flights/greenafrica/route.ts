// app/api/flights/greenafrica/route.ts
import { NextResponse } from "next/server";
import { GreenAfricaService } from "@/lib/services/greenafrica";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      origin: searchParams.get("depPort"),
      destination: searchParams.get("arrPort"),
      departure: new Date(searchParams.get("date")),
      adults: parseInt(searchParams.get("adult")),
      children: parseInt(searchParams.get("child")),
      infants: parseInt(searchParams.get("infant")),
    };
    if (!params.origin || !params.destination || !params.departure) {
      return NextResponse.json(
        { error: "Invalid parameters", provider: "greenafrica" },
        { status: 400 }
      );
    }

    const service = new GreenAfricaService();
    const flights = await service.searchFlights(params);

    return NextResponse.json({
      provider: "greenafrica",
      flights: flights.flightsData,
      url: flights.url,
      searchParams: params,
    });
  } catch (error) {
    // console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        provider: "greenafrica",
      },
      { status: 500 }
    );
  }
}
