import { SearchParams } from "@/types/airport";

export const DATE_FORMAT = {
  STANDARD: "yyyy-MM-dd",
  AIRPEACE: "dd.MM.yyyy",
};

export const AIRLINES_CONFIG = {
  ibomair: {
    endpoint: "/api/flights/ibomair",
    formatParams: (params: SearchParams) => ({
      ...params,
      accountCode: "",
    }),
  },
  arikair: {
    endpoint: "/api/flights/arikair",
    formatParams: (params: SearchParams) => ({
      ...params,
    }),
  },
  greenafrica: {
    endpoint: "/api/flights/greenafrica",
    formatParams: (params: SearchParams) => ({
      ...params,
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
      ...params,
    }),
  },
  valuejet: {
    endpoint: "/api/flights/valuejet",
    formatParams: (params: SearchParams) => ({
      tripType: params.tripType === "ONE_WAY" ? "OW" : "RT",
      ...params,
    }),
  },
};
