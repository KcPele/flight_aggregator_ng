export interface Airport {
  city: string;
  code: string;
  country: string;
  cityName: string;
  countryName: string;
  portName: string;
  timeZone: string | null;
  image: string | null;
  displayText: string;
}

export interface AirportData {
  Nigeria: Airport[];
}
