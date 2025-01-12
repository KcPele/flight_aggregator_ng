import { memo } from "react";
import type { AirlineResponses } from "../types/airport";
import type { AirPeaceResponse } from "@/types/airpeace";
import type { ArikAirResponse } from "@/types/arikair";
import type { OverlandResponse } from "@/types/overland";
import type { ValueJetResponse } from "@/types/valuejet";
import type { GreenAfricaResponse } from "@/types/greenafrica";
import type { IbomAirResponse } from "@/types/ibomair";
import dynamic from "next/dynamic";
import { AzmanAirResponse } from "@/types/azmanair";
import { UnitedNigeriaResponse } from "@/types/unitednigeria";
import { MaxAirResponse } from "@/types/maxair";

// Define component types
type FlightComponentsMap = {
  airpeace: React.ComponentType<{ data: AirPeaceResponse }>;
  arikair: React.ComponentType<{ data: ArikAirResponse }>;
  overland: React.ComponentType<{ data: OverlandResponse }>;
  valuejet: React.ComponentType<{ data: ValueJetResponse }>;
  greenafrica: React.ComponentType<{ data: GreenAfricaResponse }>;
  ibomair: React.ComponentType<{ data: IbomAirResponse }>;
  maxair: React.ComponentType<{ data: MaxAirResponse }>;
  unitednigeria: React.ComponentType<{ data: UnitedNigeriaResponse }>;
  azmanair: React.ComponentType<{ data: AzmanAirResponse }>;
};

// Dynamic imports with proper typing
const FlightComponents: FlightComponentsMap = {
  airpeace: dynamic(() => import("./flightcards/AirPeace")),
  arikair: dynamic(() => import("./flightcards/ArikAir")),
  overland: dynamic(() => import("./flightcards/Overland")),
  valuejet: dynamic(() => import("./flightcards/ValueJet")),
  greenafrica: dynamic(() => import("./flightcards/GreenAfrica")),
  ibomair: dynamic(() => import("./flightcards/IbomAir")),
  maxair: dynamic(() => import("./flightcards/MaxAir")),
  unitednigeria: dynamic(() => import("./flightcards/UnitedNigeria")),
  azmanair: dynamic(() => import("./flightcards/AzmanAir")),
};

interface FlightAggregateDisplayProps {
  results: AirlineResponses[keyof AirlineResponses][];
}

const DisplayAllFlightsCard = memo(
  ({ results }: FlightAggregateDisplayProps) => {
    return (
      <div>
        {results.map((result, index) => {
          if (!result?.flights?.length || !result.provider) return null;

          const FlightComponent =
            FlightComponents[result.provider as keyof FlightComponentsMap];
          return FlightComponent ? (
            <FlightComponent
              key={`flight-${result.provider}-${index}`}
              data={result as any} // Type assertion needed here due to dynamic nature
            />
          ) : null;
        })}
      </div>
    );
  }
);

DisplayAllFlightsCard.displayName = "DisplayAllFlightsCard";

export default DisplayAllFlightsCard;
