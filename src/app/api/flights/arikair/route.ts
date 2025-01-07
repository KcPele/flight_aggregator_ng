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
        adult: parseInt(searchParams.get("adult") || "1"),
        child: parseInt(searchParams.get("child") || "0"),
        infant: parseInt(searchParams.get("infant") || "0"),
      },
    });

    return NextResponse.json({ flights, provider: "arikair", searchParams });
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
