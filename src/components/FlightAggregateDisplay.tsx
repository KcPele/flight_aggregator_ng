"use client";
import { useEffect, useState } from "react";
import { AirlineResponses } from "@/types/airport";
import {
  transformedAirPeaceFlights,
  transformedArikAirFlights,
  transformedGreenAfricaFlights,
  transformedIbomAirFlights,
  transformedMaxAirFlights,
  transformedOverlandFlights,
  transformedUnitedNigeriaFlights,
  transformedValueJetFlights,
} from "@/lib/helper/transform";
import { AirPeaceResponse } from "@/types/airpeace";
import { ArikAirResponse } from "@/types/arikair";
import { GreenAfricaResponse } from "@/types/greenafrica";
import { IbomAirResponse } from "@/types/ibomair";
import { OverlandResponse } from "@/types/overland";
import { ValueJetResponse } from "@/types/valuejet";
import { MaxAirResponse } from "@/types/maxair";
import { UnitedNigeriaResponse } from "@/types/unitednigeria";
import { formatToNaira } from "@/lib/helper";
interface FlightAggregateDisplayProps {
  results: AirlineResponses[keyof AirlineResponses][];
}

interface CommonFlight {
  departureTime: string;
  arrivalTime: string;
  type: string;
  price: string | number;
  url: string;
  provider: string;
}

export default function FlightAggregateDisplay({
  results,
}: FlightAggregateDisplayProps) {
  const [allFlights, setAllFlights] = useState<CommonFlight[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleViewMore = () => setShowAll(!showAll);
  useEffect(() => {
    const newFlights: CommonFlight[] = results.reduce((acc, data) => {
      if (!data) return acc;

      let transformedFlights: CommonFlight[] = [];

      switch (data.provider) {
        case "airpeace": {
          transformedFlights = transformedAirPeaceFlights(
            data as AirPeaceResponse
          );
          break;
        }
        case "arikair": {
          transformedFlights = transformedArikAirFlights(
            data as ArikAirResponse
          );
          break;
        }
        case "overland": {
          transformedFlights = transformedOverlandFlights(
            data as OverlandResponse
          );
          break;
        }
        case "valuejet": {
          transformedFlights = transformedValueJetFlights(
            data as ValueJetResponse
          );
          break;
        }
        case "greenafrica": {
          transformedFlights = transformedGreenAfricaFlights(
            data as GreenAfricaResponse
          );
          break;
        }
        case "ibomair": {
          transformedFlights = transformedIbomAirFlights(
            data as IbomAirResponse
          );
          break;
        }
        case "maxair": {
          transformedFlights = transformedMaxAirFlights(data as MaxAirResponse);
          break;
        }
        case "unitednigeria": {
          transformedFlights = transformedUnitedNigeriaFlights(
            data as UnitedNigeriaResponse
          );
          break;
        }
        case "azmanair": {
          // transformedFlights = transformedAzmanAirFlights(data as AzmanAirResponse);
          break;
        }
        default:
          break;
      }

      // Filter out flights with NaN prices
      const validFlights = transformedFlights.filter(
        (flight) => !isNaN(parseFloat(flight.price.toString()))
      );

      return [...acc, ...validFlights];
    }, [] as CommonFlight[]);

    setAllFlights(newFlights);
  }, [results]);

  // Sort flights by price
  const sortedFlights = [...allFlights].sort(
    (a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString())
  );
  const displayedFlights = showAll ? sortedFlights : sortedFlights.slice(0, 4);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  console.log(sortedFlights);

  return (
    <div className="w-full p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
      <h1 className="mb-4 text-center text-2xl font-bold text-white">
        Available Flights
      </h1>
      {sortedFlights.length === 0 ? (
        <p className="text-center text-white">No flights available</p>
      ) : (
        <div className="space-y-4">
          {displayedFlights.map((flight, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full p-4 bg-gray-700 text-left text-white flex justify-between items-center"
              >
                <span>
                  {flight.departureTime} -{" "}
                  {formatToNaira(flight.price.toString())}
                </span>
                <span>{expandedIndex === index ? "−" : "+"}</span>
              </button>

              {/* Accordion Content */}
              {expandedIndex === index && (
                <div className="p-4 bg-gray-900 text-gray-300">
                  <p>
                    <strong>Type:</strong> {flight.type}
                  </p>
                  <p>
                    <strong>Departure:</strong> {flight.departureTime}
                  </p>
                  <p>
                    <strong>Arrival:</strong> {flight.arrivalTime}
                  </p>
                  <a
                    href={
                      flight.provider === "greenafrica"
                        ? "https://www.greenafrica.com/"
                        : flight.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Book Now
                  </a>
                </div>
              )}
            </div>
          ))}

          {/* View More Button */}
          {sortedFlights.length > 4 && (
            <button
              onClick={handleViewMore}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              {showAll ? "View Less" : "View More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
