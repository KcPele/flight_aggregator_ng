// app/api/flights/overland/route.ts
import { NextResponse } from "next/server";
import { OverlandService } from "@/lib/services/overland";
// export const maxDuration = 20; // Or whatever timeout you want

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tripType = searchParams.get("tripType") as "OW" | "RT";
    const fromDst = searchParams.get("depPort");
    const toDst = searchParams.get("arrPort");
    const date = searchParams.get("date");
    const adults = parseInt(searchParams.get("adult") || "1");
    const children = parseInt(searchParams.get("childn") || "0");
    const infants = parseInt(searchParams.get("infant") || "0");

    // Validate required parameters
    if (!tripType || !fromDst || !toDst || !date) {
      return NextResponse.json(
        { error: "Missing required parameters", provider: "overland" },
        { status: 400 }
      );
    }

    // Validate passenger counts
    if (isNaN(adults) || isNaN(children) || isNaN(infants)) {
      return NextResponse.json(
        { error: "Invalid passenger count", provider: "overland" },
        { status: 400 }
      );
    }

    const overlandService = new OverlandService();
    const flights = await overlandService.searchFlights(
      { tripType, fromDst, toDst, adults, children, infants },
      date
    );

    return NextResponse.json({
      provider: "Overland Airways",
      flights: flights.flightsData,
      url: flights.url,
      searchParams: {
        tripType,
        fromDst,
        toDst,
        date,
        passengers: { adults, children, infants },
      },
    });
  } catch (error) {
    console.error("Error in Overland Airways API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        provider: "overland",
      },
      { status: 500 }
    );
  }
}
