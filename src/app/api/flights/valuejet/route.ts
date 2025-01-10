// app/api/flights/valuejet/route.ts
import { NextResponse } from "next/server";
import { ValueJetService } from "@/lib/services/valuejet";

export const maxDuration = 30; // Or whatever timeout you want

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      tripType: searchParams.get("tripType"),
      dep: searchParams.get("depPort"),
      arr: searchParams.get("arrPort"),
      departure: new Date(searchParams.get("date")),
      adults: parseInt(searchParams.get("adult")),
      children: parseInt(searchParams.get("child")),
      infants: parseInt(searchParams.get("infant")),
    };

    if (!params.dep || !params.arr || isNaN(params.departure.getTime())) {
      return NextResponse.json(
        { error: "Invalid parameters", provider: "valuejet" },
        { status: 400 }
      );
    }

    const service = new ValueJetService();
    const flights = await service.searchFlights(params);

    return NextResponse.json({
      provider: "valuejet",
      url: flights.url,
      flights: flights.flightsData,
      searchParams: params,
    });
  } catch (error) {
    // console.error("API Error:", error.message);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        provider: "valuejet",
      },
      { status: 500 }
    );
  }
}
