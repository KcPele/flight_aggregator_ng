interface ValueJetSearchParams {
  dep: string;
  arr: string;
  departure: Date;
  adults: number;
  children: number;
  infants: number;
}

interface FlightFare {
  type: string;
  price: string;
}

interface ValueJetFlight {
  flightNumber: string;
  departure: {
    time: string;
    period: string;
    location: string;
    airport?: string;
  };
  arrival: {
    time: string;
    period: string;
    location: string;
    airport?: string;
  };
  duration: string;
  basePrice: string;
  flightInfo?: {
    status: string;
    statusUrl?: string;
  };
  selectedDate?: {
    date: string;
    price: string;
  };
  otherDates?: Array<{
    date: string;
    price: string;
  }>;
}
