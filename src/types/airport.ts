import { AirPeaceResponse } from "./airpeace";
import { ArikAirResponse } from "./arikair";
import { GreenAfricaResponse } from "./greenafrica";
import { IbomAirResponse } from "./ibomair";
import { OverlandResponse } from "./overland";
import { ValueJetResponse } from "./valuejet";

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

export interface SearchParams {
  date: Date | null;
  tripType: string;
  adult: string;
  child: string;
  infant: string;
  depPort: string;
  arrPort: string;
}

export type AirlineResponses = {
  airpeace: AirPeaceResponse;
  arikair: ArikAirResponse;
  greenafrica: GreenAfricaResponse;
  ibomair: IbomAirResponse;
  overland: OverlandResponse;
  valuejet: ValueJetResponse;
};
