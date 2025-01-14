import { motion } from "framer-motion";
import { MaxAirResponse, MaxAirFlight } from "@/types/maxair";
import { Plane, Clock, MapPin, Ticket } from "lucide-react";
import Link from "next/link";

interface Props {
  data: MaxAirResponse;
}

const FlightCard = ({ flight, url }: { flight: MaxAirFlight; url: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 mb-6 text-white overflow-hidden relative"
    >
      {/* Animated background circle */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      {/* Flight header */}
      <div className="flex flex-col xs:flex-row justify-between items-center mb-8">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="flex items-center gap-3"
        >
          <Plane className="text-purple-300" size={24} />
          <div>
            <p className="text-xl font-bold">{flight.flightNumber}</p>
            <div className="flex items-center gap-2 text-purple-300">
              <Clock size={14} />
              <span className="text-sm">{flight.flightDuration}</span>
            </div>
          </div>
        </motion.div>

        {/* Seats remaining */}
        {flight.seatsRemaining && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-300 text-sm"
          >
            <Ticket className="inline mr-2" size={14} />
            {flight.seatsRemaining} seats left
          </motion.div>
        )}
      </div>

      {/* Flight details */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Departure */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-3xl font-bold">{flight.departureTime}</p>
          <p className="text-purple-300">{flight.departureCity}</p>
          <p className="text-sm text-purple-400">{flight.flightDate}</p>
        </motion.div>

        {/* Flight path */}
        <div className="flex items-center justify-center">
          <motion.div
            className="w-full h-[2px] bg-purple-500 relative"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          >
            <motion.div className="absolute top-1/2 transform -translate-y-1/2">
              <Plane
                className="text-purple-300 transform rotate-[40deg]"
                size={16}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Arrival */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-right"
        >
          <p className="text-3xl font-bold">{flight.arrivalTime}</p>
          <p className="text-purple-300">{flight.arrivalCity}</p>
          <p className="text-sm text-purple-400">{flight.flightDate}</p>
        </motion.div>
      </div>

      {/* Price and booking button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center"
      >
        <div>
          <p className="text-sm text-purple-300">Starting from</p>
          <p className="text-2xl font-bold">{flight.price}</p>
        </div>
        <Link href={url}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-xl text-white font-semibold"
          >
            Book Now
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

const MaxAir = ({ data }: Props) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-purple-900">MaxAir Flights</h2>
        <p className="text-purple-600">
          {data.searchParams.depPort} → {data.searchParams.arrPort}
        </p>
      </motion.div>

      {/* Flight cards */}
      {data.flights.map((flight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <FlightCard
            flight={flight}
            url={data.url || "https://www.maxair.com/"}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MaxAir;
