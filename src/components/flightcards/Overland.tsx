import { motion } from "framer-motion";
import { OverlandResponse, OverlandFlightDetails } from "@/types/overland";
import { Plane, Clock } from "lucide-react";

interface Props {
  data: OverlandResponse;
}

const FlightCard = ({ flight }: { flight: OverlandFlightDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Plane className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {flight.operatingAirline}
            </h3>
            <p className="text-sm text-gray-500">
              Flight {flight.flightNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {flight.duration}
          </span>
        </div>
      </div>

      {/* Flight Route Section */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">
            {flight.departureTime}
          </p>
          <p className="text-sm font-medium text-gray-600 mt-1">
            {flight.departureAirport}
          </p>
        </div>

        <div className="flex-1 relative px-4">
          <div className="h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 w-full" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              x: [-10, 10, -10],
              y: [-2, 2, -2],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
            }}
          >
            <div className="bg-white p-1 rounded-full">
              <Plane className="text-blue-500 transform rotate-90" size={20} />
            </div>
          </motion.div>
        </div>

        <div className="flex-1 text-right">
          <p className="text-2xl font-bold text-gray-900">
            {flight.arrivalTime}
          </p>
          <p className="text-sm font-medium text-gray-600 mt-1">
            {flight.arrivalAirport}
          </p>
        </div>
      </div>

      {/* Fare Classes Grid */}
      <div className="flex flex-wrap  gap-4">
        {flight.fareClasses.map((fareClass, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 hover:cursor-pointer rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                {fareClass.fareClass}
              </p>
              <p className="text-lg font-bold text-blue-600">
                ₦{fareClass.price.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Overland: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
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
