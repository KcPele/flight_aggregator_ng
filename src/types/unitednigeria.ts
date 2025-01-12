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

export type UnitedNigeriaFlightData = UnitedNigeriaFlight[];

export interface UnitedNigeriaResponse {
  provider: string;
  flights: UnitedNigeriaFlightData;
  url: string;
  searchParams: UnitedNigeriaSearchParams;
}
