// types/unitednigeria.ts
export interface UnitedNigeriaPassengers {
  adult: number;
  child: number;
  infant: number;
}

export interface UnitedNigeriaSearchParams {
  tripType: "ONE_WAY" | "ROUND_TRIP";
  depPort: string;
  arrPort: string;
  date: string;
  passengers: UnitedNigeriaPassengers;
}

export interface UnitedNigeriaFormData {
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

export interface UnitedNigeriaFlight {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  departurePort: string;
  arrivalPort: string;
  price: string;
  seatsRemaining?: string;
  duration?: string;
}

export type UnitedNigeriaFlightData = UnitedNigeriaFlight[];

export interface UnitedNigeriaResponse {
  provider: string;
  flights: UnitedNigeriaFlightData;
  url: string;
  searchParams: UnitedNigeriaSearchParams;
}
