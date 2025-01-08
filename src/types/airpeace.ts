// types/airpeace.ts

export interface AirPeaceFare {
  fareType: string;
  price: string;
  bestOffer: string | null;
}

export interface FlightTimeDetails {
  time: string;
  airport: string;
  date: string;
}

export interface AirPeaceFlight {
  departure: FlightTimeDetails;
  arrival: FlightTimeDetails;
  flightNumber: string;
  duration: string;
  stops: string;
  fares: AirPeaceFare[];
}

export interface AirPeaceSearchParams {
  tripType: "ONE_WAY" | "ROUND_TRIP";
  depPort: string;
  arrPort: string;
  departureDate: string; // format: DD.MM.YYYY
  adult?: number;
  child?: number;
  infant?: number;
  lang?: string;
}

export type AirPeaceFlightData = AirPeaceFlight[];

export interface AirPeaceResponse {
  flights: AirPeaceFlightData;
  url: string;
  provider: string;
  searchParams: AirPeaceSearchParams;
}
