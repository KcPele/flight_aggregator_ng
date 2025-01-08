import { SearchParams } from "@/types/airport";
import { format } from "date-fns";

export const DATE_FORMAT = {
  STANDARD: "yyyy-MM-dd",
  AIRPEACE: "dd.MM.yyyy",
};

export const AIRLINES_CONFIG = {
  ibomair: {
    endpoint: "/api/flights/ibomair",
    formatParams: (params: SearchParams) => ({
      tripType: params.tripType,
      depPort: params.depPort,
      arrPort: params.arrPort,
      date: params.date,
      adult: params.adult,
      child: params.child,
      infant: params.infant,
      accountCode: "",
    }),
  },
  arikair: {
    endpoint: "/api/flights/arikair",
    formatParams: (params: SearchParams) => ({
      tripType: params.tripType,
      depPort: params.depPort,
      arrPort: params.arrPort,
      date: params.date,
      adult: params.adult,
      child: params.child,
      infant: params.infant,
    }),
  },
  greenafrica: {
    endpoint: "/api/flights/greenafrica",
    formatParams: (params: SearchParams) => ({
      tripType: params.tripType,
      origin: params.depPort,
      destination: params.arrPort,
      date: params.date,
      adult: params.adult,
      child: params.child,
      infant: params.infant,
    }),
  },
  airpeace: {
    endpoint: "/api/flights/airpeace",
    formatParams: (params: SearchParams) => ({
      ...params,
    }),
  },
  overland: {
    endpoint: "/api/flights/overland",
    formatParams: (params: SearchParams) => ({
      tripType: params.tripType === "ONE_WAY" ? "OW" : "RT",
      depPort: params.depPort,
      arrPort: params.arrPort,
      date: params.date,
      adult: params.adult,
      child: params.child,
      infant: params.infant,
    }),
  },
  valuejet: {
    endpoint: "/api/flights/valuejet",
    formatParams: (params: SearchParams) => ({
      tripType: params.tripType === "ONE_WAY" ? "OW" : "RT",
      origin: params.depPort,
      destination: params.arrPort,
      date: params.date,
      adult: params.adult,
      child: params.child,
      infant: params.infant,
    }),
  },
};
