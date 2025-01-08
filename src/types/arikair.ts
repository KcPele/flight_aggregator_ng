// types/arikair.ts

export interface ArikAirPassengers {
  adult: number;
  child: number;
  infant: number;
}

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
  inlineRadioOptions: "on";
  depPort: string;
  arrPort: string;
  date: string;
  passengers: ArikAirPassengers;
  _sid?: string;
  _cid?: string;
}

export type ArikAirFlightData = ArikAirFlight[];

export interface ArikAirResponse {
  flights: ArikAirFlightData;
  url: string;
  provider: string;
  searchParams: {
    tripType: string;
    depPort: string;
    arrPort: string;
    date: string;
    adult: string;
    child: string;
    infant: string;
  };
}
