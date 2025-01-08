"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AirportSelector } from "@/components/AirportSelector";
import { AirlineResponses, SearchParams } from "@/types/airport";
import { useMultiFlightQueries } from "@/hooks/useMultiFlightQueries";
import { DATE_FORMAT } from "@/lib/config";
import AirPeace from "./flightcards/AirPeace";
import ArikAir from "./flightcards/ArikAir";
import Overland from "./flightcards/Overland";
import ValueJet from "./flightcards/ValueJet";
import GreenAfrica from "./flightcards/GreenAfrica";
import IbomAir from "./flightcards/IbomAir";
import { GreenAfricaResponse } from "@/types/greenafrica";
import { ValueJetResponse } from "@/types/valuejet";
import { OverlandResponse } from "@/types/overland";
import { ArikAirResponse } from "@/types/arikair";
import { IbomAirResponse } from "@/types/ibomair";
import { AirPeaceResponse } from "@/types/airpeace";
import { CalendarIcon, Plane } from "lucide-react";
import { Loader2 } from "lucide-react";
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
    errors,
    error: errorState,
  } = useMultiFlightQueries<AirlineResponses[keyof AirlineResponses]>(
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

  if (errorState) {
    console.log(errors);
  }

  const updateSearchParam = (key: keyof SearchParams, value: string) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  };

  const renderFlightCards = () => {
    return results.map((result, index) => {
      if (result === undefined) return;
      if (result.flights && !result.flights.length) return;
      switch (result?.provider) {
        case "airpeace":
          return <AirPeace key={index} data={result as AirPeaceResponse} />;
        case "arikair":
          return <ArikAir key={index} data={result as ArikAirResponse} />;
        case "overland":
          return <Overland key={index} data={result as OverlandResponse} />;
        case "valuejet":
          return <ValueJet key={index} data={result as ValueJetResponse} />;
        case "greenafrica":
          return (
            <GreenAfrica key={index} data={result as GreenAfricaResponse} />
          );
        case "ibomair":
          return <IbomAir key={index} data={result as IbomAirResponse} />;
        default:
          return null;
      }
    });
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchParams.date
                  ? format(searchParams.date, "PPP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={searchParams.date || undefined}
                onSelect={(value) =>
                  updateSearchParam(
                    "date",
                    format(value as Date, DATE_FORMAT.STANDARD)
                  )
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
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

      <div className="space-y-6">{renderFlightCards()}</div>
    </div>
  );
}
