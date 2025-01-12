import React from "react";
import { AirlineResponses } from "../types/airport";
import AirPeace from "./flightcards/AirPeace";
import ArikAir from "./flightcards/ArikAir";
import Overland from "./flightcards/Overland";
import ValueJet from "./flightcards/ValueJet";
import GreenAfrica from "./flightcards/GreenAfrica";
import IbomAir from "./flightcards/IbomAir";
import { GreenAfricaResponse } from "@/types/greenafrica";
import { ValueJetResponse } from "@/types/valuejet";
import { OverlandResponse } from "@/types/overland";
import { ArikAirResponse } from "@/types/arikair";
import { IbomAirResponse } from "@/types/ibomair";
import { AirPeaceResponse } from "@/types/airpeace";
interface FlightAggregateDisplayProps {
  results: AirlineResponses[keyof AirlineResponses][];
}
const DisplayAllFlightsCard = ({ results }: FlightAggregateDisplayProps) => {
  const renderFlightCards = () => {
    return results.map((result, index) => {
      if (result === undefined) return;
      if (result.flights && !result.flights.length) return;
      switch (result?.provider) {
        case "airpeace":
          return <AirPeace key={index} data={result as AirPeaceResponse} />;
        case "arikair":
          return <ArikAir key={index} data={result as ArikAirResponse} />;
        case "overland":
          return <Overland key={index} data={result as OverlandResponse} />;
        case "valuejet":
          return <ValueJet key={index} data={result as ValueJetResponse} />;
        case "greenafrica":
          return (
            <GreenAfrica key={index} data={result as GreenAfricaResponse} />
          );
        case "ibomair":
          return <IbomAir key={index} data={result as IbomAirResponse} />;
        default:
          return null;
      }
    });
  };

  return <div>{renderFlightCards()}</div>;
};

export default DisplayAllFlightsCard;
