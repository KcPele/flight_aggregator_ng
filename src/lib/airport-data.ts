import { Airport } from "@/types/airport";
import airportData from "@/data/flightCodeName.json";
export function getAirports(): Airport[] {
  return airportData.Nigeria || [];
}
