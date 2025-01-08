import React from "react";
import { AirPeaceResponse } from "@/types/airpeace";
import { motion } from "framer-motion";

interface AirPeaceProps {
  data: AirPeaceResponse;
}

const AirPeace: React.FC<AirPeaceProps> = ({ data }) => {
  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Air Peace Flight Results
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.flights.map((flight, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-700">
                {flight.departure.airport} → {flight.arrival.airport}
              </span>
              <span className="text-sm text-gray-500">
                {flight.flightNumber}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <div>
                <span className="font-semibold">Departure:</span>{" "}
                {flight.departure.time}, {flight.departure.date}
              </div>
              <div>
                <span className="font-semibold">Arrival:</span>{" "}
                {flight.arrival.time}, {flight.arrival.date}
              </div>
              <div>
                <span className="font-semibold">Duration:</span>{" "}
                {flight.duration}
              </div>
              <div>
                <span className="font-semibold">Stops:</span> {flight.stops}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-blue-600 mb-2">Fares</h3>
              {flight.fares.map((fare, fareIndex) => (
                <motion.div
                  key={fareIndex}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-md mb-2 hover:bg-blue-100 transition"
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="text-sm text-gray-700">{fare.fareType}</span>
                  <span className="text-sm font-bold text-green-600">
                    {fare.price}
                  </span>
                  {fare.bestOffer && (
                    <span className="text-xs text-yellow-500 font-medium">
                      Best Offer
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AirPeace;
