// types/arikair.ts

export interface ArikAirFlight {
  departureTime: string;
  arrivalTime: string;
  departurePort: string;
  arrivalPort: string;
  flightNumber: string;
  flightDuration: string;
  price: string;
  seatsRemaining: string;
}

export interface ArikAirSearchParams {
  tripType: "ONE_WAY" | "ROUND_TRIP";
  depPort: string;
  arrPort: string;
  date: string; // DD MMM YYYY format
  cabinClass?: string;
  _sid?: string;
  _cid?: string;
}

export type ArikAirFlightData = ArikAirFlight[];
