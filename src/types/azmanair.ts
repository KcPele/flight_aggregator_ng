export interface AzmanAirPassengers {
  adult: number;
  child: number;
  infant: number;
}

export interface AzmanAirSearchParams {
  tripType: "ONE_WAY" | "ROUND_TRIP";
  depPort: string;
  arrPort: string;
  date: string;
  passengers: AzmanAirPassengers;
}

export interface AzmanAirFormData {
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

export interface AzmanAirFlight {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  departurePort: string;
  arrivalPort: string;
  price: string;
  seatsRemaining?: string;
  duration?: string;
}

export type AzmanAirFlightData = AzmanAirFlight[];

export interface AzmanAirResponse {
  flights: AzmanAirFlightData;
  url: string;
  searchParams: AzmanAirSearchParams;
  provider: string;
}
