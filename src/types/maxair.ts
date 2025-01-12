// types/maxair.ts
export interface MaxAirPassengers {
  adult: number;
  child: number;
  infant: number;
}

export interface MaxAirSearchParams {
  tripType: "ONE_WAY" | "ROUND_TRIP";
  depPort: string;
  arrPort: string;
  date: string;
  passengers: MaxAirPassengers;
}

export interface MaxAirFormData {
  x: number;
  y: number;
  rqtm: string;
  Origin: string[];
  VarsSessionID: string;
  Destination: string[];
  DepartureDate: string[];
  ReturnDate: null;
  Currency: string;
  DisplayCurrency: string;
  Adults: string;
  Children: string;
  SmallChildren: number;
  Seniors: number;
  Students: number;
  Infants: string;
  Youths: number;
  Teachers: number;
  SeatedInfants: number;
  EVoucher: string;
  recaptcha: string;
  SearchUser: string;
  SearchSource: string;
}

export interface MaxAirFlight {
  departureTime: string;
  arrivalTime: string;
  departureCity: string;
  arrivalCity: string;
  flightDate: string;
  flightNumber: string;
  flightDuration: string;
  price: string;
  class: string;
  seatsRemaining?: string;
  duration?: string;
}

export type MaxAirFlightData = MaxAirFlight[];

export interface MaxAirResponse {
  provider: string;
  flights: MaxAirFlightData;
  url: string;
  searchParams: MaxAirSearchParams;
}
