import { motion } from "framer-motion";
import { OverlandResponse, OverlandFlightDetails } from "@/types/overland";
import { Plane, Luggage, Info } from "lucide-react";

interface Props {
  data: OverlandResponse;
}

const FlightCard = ({ flight }: { flight: OverlandFlightDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-lg font-bold">{flight.operatingAirline}</p>
          <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
        </div>
        <div className="text-right">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {flight.duration}
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <p className="text-2xl font-bold">{flight.departureTime}</p>
          <p className="text-sm text-gray-600">{flight.departureAirport}</p>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="w-full relative flex items-center">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="h-[2px] bg-blue-500"
            />
            <motion.div
              animate={{
                x: [0, 20, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="absolute"
            >
              <Plane className="text-blue-500 transform -rotate-90" size={24} />
            </motion.div>
          </div>
        </div>

        <div className="flex-1 text-right">
          <p className="text-2xl font-bold">{flight.arrivalTime}</p>
          <p className="text-sm text-gray-600">{flight.arrivalAirport}</p>
        </div>
      </div>

      <div className="space-y-3">
        {flight.fareClasses.map((fareClass, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <p className="font-medium">{fareClass.fareClass}</p>
              <div className="flex items-center space-x-1">
                <Luggage size={16} className="text-gray-500" />
                <span className="text-sm text-gray-500">
                  {fareClass.baggageAllowance}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full ${
                fareClass.available
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
              disabled={!fareClass.available}
            >
              {fareClass.available ? `$${fareClass.price}` : "Unavailable"}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {flight.stops.length > 0 && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center space-x-2 text-orange-700">
            <Info size={16} />
            <p className="text-sm">Stops: {flight.stops.join(", ")}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const Overland: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2">Available Flights</h2>
        <p className="text-gray-600">
          {data.searchParams.fromDst} to {data.searchParams.toDst}
        </p>
      </motion.div>

      <div className="space-y-4">
        {data.flights.map((flight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FlightCard flight={flight} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Overland;
