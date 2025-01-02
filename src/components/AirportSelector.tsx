// components/AirportSelector.tsx
"use client";

import { useState } from "react";
import { Plane } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAirports } from "@/lib/airport-data";

interface AirportSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function AirportSelector({
  value,
  onChange,
  placeholder,
}: AirportSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const airports = getAirports();
  const filteredAirports = airports.filter(
    (airport) =>
      airport.displayText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.portName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {value ? (
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              {airports.find((airport) => airport.code === value)?.displayText}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              {placeholder}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder="Search airports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
        </div>
        <SelectGroup>
          <ScrollArea className="h-72">
            {filteredAirports.map((airport) => (
              <SelectItem
                key={airport.code}
                value={airport.code}
                className="cursor-pointer"
              >
                <div className="flex flex-col py-1">
                  <span className="font-medium">{airport.displayText}</span>
                  <span className="text-sm text-muted-foreground">
                    {airport.portName}
                  </span>
                </div>
              </SelectItem>
            ))}
            {filteredAirports.length === 0 && (
              <div className="py-2 px-2 text-sm text-muted-foreground">
                No airports found
              </div>
            )}
          </ScrollArea>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
