// app/api/flights/maxair/route.ts
import { NextResponse } from "next/server";
import { MaxAirService } from "@/lib/services/maxair";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tripType = searchParams.get("tripType");
    const depPort = searchParams.get("depPort");
    const arrPort = searchParams.get("arrPort");
    const dateStr = searchParams.get("date");
    const adult = searchParams.get("adult") || "1";
    const child = searchParams.get("child") || "0";
    const infant = searchParams.get("infant") || "0";

    if (!tripType || !depPort || !arrPort || !dateStr) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (tripType !== "ONE_WAY" && tripType !== "ROUND_TRIP") {
      return NextResponse.json({ error: "Invalid trip type" }, { status: 400 });
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const service = new MaxAirService();
    const flights = await service.searchFlights({
      tripType,
      depPort,
      arrPort,
      date: date.toISOString(),
      passengers: {
        adult: parseInt(adult),
        child: parseInt(child),
        infant: parseInt(infant),
      },
    });

    return NextResponse.json({
      provider: "maxair",
      flights: flights.flightsData,
      url: flights.url,
      searchParams: {
        tripType,
        depPort,
        arrPort,
        date: dateStr,
        passengers: {
          adult,
          child,
          infant,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        provider: "maxair",
      },
      { status: 500 }
    );
  }
}
