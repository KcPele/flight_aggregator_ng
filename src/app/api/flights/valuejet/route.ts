// app/api/flights/valuejet/route.ts
import { NextResponse } from "next/server";
import { ValueJetService } from "@/lib/services/valuejet";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      dep: searchParams.get("origin") || "LOS",
      arr: searchParams.get("destination") || "ABV",
      departure: new Date(searchParams.get("departure") || ""),
      adults: parseInt(searchParams.get("adult") || "1"),
      children: parseInt(searchParams.get("child") || "0"),
      infants: parseInt(searchParams.get("infant") || "0"),
    };

    if (!params.dep || !params.arr || isNaN(params.departure.getTime())) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const service = new ValueJetService();
    const flights = await service.searchFlights(params);

    return NextResponse.json({
      provider: "ValueJet",
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
