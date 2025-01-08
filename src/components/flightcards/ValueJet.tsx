import { motion } from "framer-motion";
import { ValueJetResponse, ValueJetFlight } from "@/types/valuejet";
import { Plane } from "lucide-react";

interface Props {
  data: ValueJetResponse;
}

const FlightCard = ({ flight }: { flight: ValueJetFlight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-4"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-lg font-bold">ValueJet</p>
          <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
        </div>
        {flight.flightInfo && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-1 rounded-full text-sm ${
              flight.flightInfo.status === "On Time"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {flight.flightInfo.status}
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="text-2xl font-bold">
            {flight.departure.time}
            <span className="text-sm text-gray-500 ml-1">
              {flight.departure.period}
            </span>
          </div>
          <p className="text-sm text-gray-600">{flight.departure.location}</p>
          {flight.departure.airport && (
            <p className="text-xs text-gray-500">{flight.departure.airport}</p>
          )}
        </div>

        <div className="flex-1 flex justify-center items-center px-4">
          <div className="w-full relative flex items-center">
            <div className="text-xs text-gray-500 absolute -top-4 w-full text-center">
              {flight.duration}
            </div>
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
          <div className="text-2xl font-bold">
            {flight.arrival.time}
            <span className="text-sm text-gray-500 ml-1">
              {flight.arrival.period}
            </span>
          </div>
          <p className="text-sm text-gray-600">{flight.arrival.location}</p>
          {flight.arrival.airport && (
            <p className="text-xs text-gray-500">{flight.arrival.airport}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium"
        >
          Book for {flight.basePrice}
        </motion.button>

        {flight.otherDates && flight.otherDates.length > 0 && (
          <div className="flex gap-2">
            {flight.otherDates.map((date, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center bg-gray-50 p-2 rounded"
              >
                <span className="text-xs text-gray-500">{date.date}</span>
                <span className="text-sm font-medium">{date.price}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ValueJet: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2">ValueJet Flights</h2>
        <p className="text-gray-600">
          {data.searchParams.dep} to {data.searchParams.arr}
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

export default ValueJet;
