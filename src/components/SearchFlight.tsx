"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AirportSelector } from "@/components/AirportSelector";
import { AirlineResponses, SearchParams } from "@/types/airport";
import { useMultiFlightQueries } from "@/hooks/useMultiFlightQueries";
import { DATE_FORMAT } from "@/lib/config";

import { Plane, Loader2 } from "lucide-react";
import CustomCalender from "./CustomCalender";
import FlightAggregateDisplay from "./FlightAggregateDisplay";
import DisplayAllFlightsCard from "./DisplayAllFlightsCard";

export function SearchFlight() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    date: null,
    tripType: "ONE_WAY",
    adult: "1",
    child: "0",
    infant: "0",
    depPort: "",
    arrPort: "",
  });
  const [error, setError] = useState<string | null>(null);

  const {
    results,
    isLoading,
    refetchAll,
    // errors,
    // error: errorState,
  } =
    useMultiFlightQueries<AirlineResponses[keyof AirlineResponses]>(
      searchParams
    );

  const handleSearch = () => {
    if (!searchParams.date || !searchParams.depPort || !searchParams.arrPort) {
      setError("Please fill in all fields");
      return;
    }
    if (searchParams.arrPort === searchParams.depPort) {
      setError("Departure and Arrival ports cannot be the same");
      return;
    }
    setError(null);
    refetchAll();
  };

  const updateSearchParam = (key: keyof SearchParams, value: string) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  };


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-slate-300">From</Label>
          <AirportSelector
            value={searchParams.depPort}
            onChange={(value) => updateSearchParam("depPort", value)}
            placeholder="Select departure airport"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">To</Label>
          <AirportSelector
            value={searchParams.arrPort}
            onChange={(value) => updateSearchParam("arrPort", value)}
            placeholder="Select arrival airport"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Date</Label>
          <CustomCalender
            date={searchParams.date}
            onDateChange={(value) =>
              updateSearchParam(
                "date",
                format(value as Date, DATE_FORMAT.STANDARD)
              )
            }
          />
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Plane className="mr-2 h-4 w-4" />
            Search Flights
          </>
        )}
      </Button>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-900/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}
      <FlightAggregateDisplay results={results} />

      <DisplayAllFlightsCard results={results} />
    </div>
  );
}
