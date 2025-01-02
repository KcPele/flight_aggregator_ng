// app/api/flights/arikair/route.ts
import { NextResponse } from "next/server";
import { ArikAirService } from "@/lib/services/arikair";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tripType = searchParams.get("tripType") as "ONE_WAY" | "ROUND_TRIP";
    const depPort = searchParams.get("depPort");
    const arrPort = searchParams.get("arrPort");
    const dateStr = searchParams.get("date"); // Expects ISO date string
    const cabinClass = searchParams.get("cabinClass");

    // Validate required parameters
    if (!tripType || !depPort || !arrPort || !dateStr) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const arikAirService = new ArikAirService();
    const flights = await arikAirService.searchFlights({
      tripType,
      depPort,
      arrPort,
      date,
      cabinClass,
    });
    console.log(flights);

    return NextResponse.json({
      provider: "Arik Air",
      flights,
      searchParams: { tripType, depPort, arrPort, date: dateStr, cabinClass },
    });
  } catch (error) {
    console.error("Error in Arik Air API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight data" },
      { status: 500 }
    );
  }
}
