// types/ibomair.ts

export interface FlightTimeLocation {
  time: string;
  airport: string;
  date: string;
}

export interface IbomAirFare {
  fareType: string;
  price: string;
}

export interface IbomAirFlight {
  departure: FlightTimeLocation;
  arrival: FlightTimeLocation;
  flightNumber: string;
  duration: string;
  stops: string;
  fares: IbomAirFare[];
}

export interface PassengerCount {
  adult: number;
  child: number;
  infant: number;
}

export interface IbomAirSearchParams {
  tripType: "ONE_WAY" | "ROUND_TRIP";
  depPort: string;
  arrPort: string;
  date: string; // DD MMM YYYY format
  passengers: PassengerCount;
  _sid?: string;
  _cid?: string;
  accountCode?: string;
}

export type IbomAirFlightData = IbomAirFlight[];

export interface IbomAirResponse {
  provider: string;
  url: string;
  flights: IbomAirFlightData;
  searchParams: {
    tripType: "ONE_WAY" | "ROUND_TRIP";
    depPort: string;
    arrPort: string;
    date: string;
    passengers: {
      adult: number;
      child: number;
      infant: number;
    };
    accountCode: string | null;
  };
}
