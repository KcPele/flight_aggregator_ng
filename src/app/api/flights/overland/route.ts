// app/api/flights/overland/route.ts
import { NextResponse } from "next/server";
import { OverlandService } from "@/lib/services/overland";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") as "OW" | "RT";
    const fromDst = searchParams.get("fromDst");
    const toDst = searchParams.get("toDst");
    const adults = parseInt(searchParams.get("adults") || "1");
    const children = parseInt(searchParams.get("children") || "0");
    const infants = parseInt(searchParams.get("infants") || "0");

    // Validate required parameters
    if (!type || !fromDst || !toDst) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate passenger counts
    if (isNaN(adults) || isNaN(children) || isNaN(infants)) {
      return NextResponse.json(
        { error: "Invalid passenger count" },
        { status: 400 }
      );
    }

    const overlandService = new OverlandService();
    const flightData = await overlandService.searchFlights({
      type,
      fromDst,
      toDst,
      adults,
      children,
      infants,
    });

    const availableFlights = overlandService.getAvailableFlights(flightData);

    return NextResponse.json({
      provider: "Overland Airways",
      flights: availableFlights,
      searchParams: {
        type,
        fromDst,
        toDst,
        passengers: { adults, children, infants },
      },
    });
  } catch (error) {
    console.error("Error in Overland Airways API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight data" },
      { status: 500 }
    );
  }
}
