// app/api/flights/arikair/route.ts
import { NextResponse } from "next/server";
import { ArikAirService } from "@/lib/services/arikair";

export async function GET(request: Request) {
  try {
    const service = new ArikAirService();
    await service.initSession();
    const { searchParams } = new URL(request.url);

    const tripType = searchParams.get("tripType");
    const depPort = searchParams.get("depPort");
    const arrPort = searchParams.get("arrPort");
    const dateStr = searchParams.get("date");
    const adult = searchParams.get("adult") || "1";
    const child = searchParams.get("child") || "0";
    const infant = searchParams.get("infant") || "0";
    // Early validation
    if (!tripType || !depPort || !arrPort || !dateStr) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Type guard for tripType
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

    // const service = new ArikAirService();
    const flights = await service.searchFlights({
      tripType,
      depPort,
      arrPort,
      date: date.toISOString(),
      inlineRadioOptions: "on",
      passengers: {
        adult: parseInt(adult),
        child: parseInt(child),
        infant: parseInt(infant),
      },
    });

    return NextResponse.json({
      provider: "arikair",
      flights: flights.flightsData,
      url: flights.url,
      searchParams: {
        tripType,
        depPort,
        arrPort,
        date: dateStr,
        adult,
        child,
        infant,
      },
    });
  } catch (error) {
    // console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        provider: "arikair",
      },
      { status: 500 }
    );
  }
}
