"use client";
import { useEffect, useState } from "react";
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
    setError(null);
    refetchAll();
  };

  useEffect(() => {
    if (results.length > 0) {
      console.log(results);
    }
  }, [results]);

  if (errorState) {
    console.log(errors);
  }

  const updateSearchParam = (key: keyof SearchParams, value: any) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>From</Label>
          <AirportSelector
            value={searchParams.depPort}
            onChange={(value) => updateSearchParam("depPort", value)}
            placeholder="Select departure airport"
          />
        </div>

        <div className="space-y-2">
          <Label>To</Label>
          <AirportSelector
            value={searchParams.arrPort}
            onChange={(value) => updateSearchParam("arrPort", value)}
            placeholder="Select arrival airport"
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
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
                    format(value || "", DATE_FORMAT.STANDARD)
                  )
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={handleSearch} className="w-full">
        Search Flights
      </Button>

      {error && <p className="text-red-500">{error}</p>}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
