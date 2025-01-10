export interface OverlandCalendarDay {
  daynumber: string;
  fullDate: string;
  fare: number | false;
  highlight: boolean;
  farebackup: boolean;
  flight: boolean;
}

export interface OverlandCalendarMonth {
  year: string;
  monthname: string;
  monthnumber: string;
  days: OverlandCalendarDay[];
}

//temporal
export interface CalendarDay {
  daynumber: string;
  fullDate: string;
  fare: number | false;
  highlight: boolean;
  farebackup: boolean;
  flight: boolean;
}

export interface CalendarMonth {
  year: string;
  monthname: string;
  monthnumber: string;
  days: CalendarDay[];
}

export interface CalendarResponse {
  hasResults: boolean;
  calendar: CalendarMonth[];
}

export interface OverlandSearchParams {
  tripType: "OW" | "RT"; // One-way or Round-trip
  fromDst: string; // Departure airport code
  toDst: string; // Arrival airport code
  adults: number;
  children: number;
  infants: number;
}

export interface OverlandFlightClassInfo {
  flightNumber: string;
  fareClass: string;
  price: number;
  available: boolean;
  duration: string;
  baggageAllowance: string;
  fareRules: string;
}

export interface OverlandFlightDetails {
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  arrivalDate: string;
  departureAirport: string;
  arrivalAirport: string;
  flightNumber: string;
  operatingAirline: string;
  duration: string;
  stops: string[];
  via: string[];
  fareClasses: OverlandFlightClassInfo[];
}

export interface OverlandFlightData {
  hasResults: boolean;
  flights: OverlandFlightDetails[];
}

export interface OverlandResponse {
  provider: string;
  flights: OverlandFlightDetails[];
  url: string;
  searchParams: {
    type: "OW" | "RT";
    fromDst: string;
    toDst: string;
    date: string;
    passengers: {
      adults: number;
      children: number;
      infants: number;
    };
  };
}
