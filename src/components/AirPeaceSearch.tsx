"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AirPeaceFlightData } from "@/types/airpeace";
import { AirportSelector } from "@/components/AirportSelector";
import { getAirports } from "@/lib/airport-data";

export function AirPeaceSearch() {
  const [date, setDate] = useState<Date>();
  const [depPort, setDepPort] = useState("");
  const [arrPort, setArrPort] = useState("");
  const [flights, setFlights] = useState<AirPeaceFlightData>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!date || !depPort || !arrPort) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedDate = format(date, "dd.MM.yyyy");
      const params = new URLSearchParams({
        tripType: "ONE_WAY",
        depPort,
        arrPort,
        departureDate: formattedDate,
      });

      const response = await fetch(`/api/flights/airpeace?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch flights");
      }

      setFlights(data.flights);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>From</Label>
          <AirportSelector
            value={depPort}
            onChange={setDepPort}
            placeholder="Select departure airport"
          />
        </div>

        <div className="space-y-2">
          <Label>To</Label>
          <AirportSelector
            value={arrPort}
            onChange={setArrPort}
            placeholder="Select arrival airport"
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={handleSearch} disabled={loading} className="w-full">
        {loading ? "Searching..." : "Search Flights"}
      </Button>

      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="space-y-4">
        {flights.map((flight, index) => (
          <Card key={`${flight.flightNumber}-${index}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="font-semibold">{flight.departure.time}</div>
                  <div className="text-sm text-gray-600">
                    {flight.departure.airport}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">{flight.duration}</div>
                  <div className="font-medium">{flight.flightNumber}</div>
                  <div className="text-sm text-gray-600">{flight.stops}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{flight.arrival.time}</div>
                  <div className="text-sm text-gray-600">
                    {flight.arrival.airport}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {flight.fares.map((fare, fareIndex) => (
                  <div
                    key={fareIndex}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-medium">{fare.fareType}</span>
                    <span className="font-semibold">
                      ₦{parseInt(fare.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
