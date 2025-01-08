// app/api/flights/ibomair/route.ts
import { NextResponse } from "next/server";
import { IbomAirService } from "@/lib/services/ibomair";

export const maxDuration = 30; // Or whatever timeout you want

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tripType = searchParams.get("tripType") as "ONE_WAY" | "ROUND_TRIP";
    const depPort = searchParams.get("depPort");
    const arrPort = searchParams.get("arrPort");
    const dateStr = searchParams.get("date"); // Expects ISO date string
    const accountCode = searchParams.get("accountCode");

    // Parse passenger counts
    const adult = parseInt(searchParams.get("adult") || "1");
    const child = parseInt(searchParams.get("child") || "0");
    const infant = parseInt(searchParams.get("infant") || "0");

    // Validate required parameters
    if (!tripType || !depPort || !arrPort || !dateStr) {
      return NextResponse.json(
        { error: "Missing required parameters", provider: "ibomair" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format", provider: "ibomair" },
        { status: 400 }
      );
    }

    const ibomAirService = new IbomAirService();
    const flights = await ibomAirService.searchFlights({
      tripType,
      depPort,
      arrPort,
      date,
      passengers: { adult, child, infant },
      accountCode: accountCode || undefined,
    });

    return NextResponse.json({
      provider: "ibomair",
      flights,
      url: "",
      searchParams: {
        tripType,
        depPort,
        arrPort,
        date: dateStr,
        passengers: { adult, child, infant },
        accountCode,
      },
    });
  } catch (error) {
    // console.error("Error in Ibom Air API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        provider: "ibomair",
      },
      { status: 500 }
    );
  }
}
