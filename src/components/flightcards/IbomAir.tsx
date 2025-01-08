import { motion } from "framer-motion";
import { IbomAirResponse, IbomAirFlight } from "@/types/ibomair";
import { Plane, Clock, Map } from "lucide-react";

interface Props {
  data: IbomAirResponse;
}

const FlightCard = ({ flight }: { flight: IbomAirFlight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-3 sm:p-6 mb-6 text-white overflow-hidden relative"
    >
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      <div className="flex justify-between items-center mb-8">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="flex items-center gap-3"
        >
          <Plane className="text-blue-300" size={24} />
          <div>
            <p className="text-xl font-bold">{flight.flightNumber}</p>
            <div className="flex items-center gap-2 text-blue-300">
              <Clock size={14} />
              <span className="text-sm">{flight.duration}</span>
            </div>
          </div>
        </motion.div>

        {flight.stops && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-300 text-sm"
          >
            <Map className="inline mr-2" size={14} />
            {flight.stops} stop(s)
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-3xl font-bold">{flight.departure.time}</p>
          <p className="text-blue-300">{flight.departure.airport}</p>
          <p className="text-sm text-blue-400">{flight.departure.date}</p>
        </motion.div>

        <div className="flex items-center justify-center">
          <motion.div
            className="w-full h-[2px] bg-blue-500 relative"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          >
            <motion.div className="absolute top-1/2 transform -translate-y-1/2">
              <Plane
                className="text-blue-300 transform rotate-[40deg]"
                size={16}
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-right"
        >
          <p className="text-3xl font-bold">{flight.arrival.time}</p>
          <p className="text-blue-300">{flight.arrival.airport}</p>
          <p className="text-sm text-blue-400">{flight.arrival.date}</p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {flight.fares.map((fare, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-xl"
          >
            <p className="text-sm text-blue-200 mb-1">{fare.fareType}</p>
            <p className="text-xl font-bold">{fare.price}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const IbomAir: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-blue-900">IbomAir Flights</h2>
        <p className="text-blue-600">
          {data.searchParams.depPort} → {data.searchParams.arrPort}
        </p>
      </motion.div>

      {data.flights.map((flight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <FlightCard flight={flight} />
        </motion.div>
      ))}
    </div>
  );
};

export default IbomAir;
