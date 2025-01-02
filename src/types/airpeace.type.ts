interface FlightFare {
  fareType: string; // e.g., "ECONOMY", "BUSINESS", "FIRST CLASS"
  price: string; // e.g., "114400" or "No Seat"
  bestOffer?: string | null; // e.g., "BEST OFFER", or null if not applicable
}

interface FlightDetails {
  time: string; // e.g., "06:30"
  airport: string; // e.g., "Lagos (LOS)"
  date: string; // e.g., "19 Jan 2025"
}

interface Flight {
  departure: FlightDetails; // Details about departure
  arrival: FlightDetails; // Details about arrival
  flightNumber: string; // e.g., "P4-7120"
  duration: string; // e.g., "1h 20m"
  stops: string; // e.g., "Nonstop"
  fares: FlightFare[]; // Array of fare options
}

// Example of the output type
export type airPeaceDataType = Flight[];
