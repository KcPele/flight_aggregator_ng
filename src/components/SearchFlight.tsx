"use client";
import { useCallback, useState } from "react";
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
    <div className="space-y-8 w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-slate-300 font-medium">From</Label>
          <AirportSelector
            value={searchParams.depPort}
            onChange={(value) => updateSearchParam("depPort", value)}
            placeholder="Select departure airport"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300 font-medium">To</Label>
          <AirportSelector
            value={searchParams.arrPort}
            onChange={(value) => updateSearchParam("arrPort", value)}
            placeholder="Select arrival airport"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300 font-medium">Date</Label>
          <CustomCalender
            date={searchParams.date}
            onDateChange={useCallback(
              (value: Date) =>
                updateSearchParam("date", format(value, DATE_FORMAT.STANDARD)),
              [updateSearchParam]
            )}
          />
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/20"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Finding best flights...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Plane className="h-5 w-5" />
            <span>Search Flights</span>
          </div>
        )}
      </Button>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      <FlightAggregateDisplay results={results} />

      <DisplayAllFlightsCard results={results} />
    </div>
  );
}
