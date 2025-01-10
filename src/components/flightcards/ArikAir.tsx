import { motion } from "framer-motion";
import { ArikAirResponse, ArikAirFlight } from "@/types/arikair";
import { Clock, Plane } from "lucide-react";

const FlightCard = ({ flight }: { flight: ArikAirFlight }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-lg overflow-hidden"
  >
    <div className="h-2 bg-gradient-to-r from-red-500 to-red-600" />
    <div className="p-3 sm:p-6">
      <div className="flex flex-col xs:flex-row justify-between xs:items-center mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"
          >
            <Plane className="text-red-500" />
          </motion.div>
          <div>
            <p className="font-bold text-red-900">{flight.flightNumber}</p>
            <div className="flex items-center text-red-600 text-sm">
              <Clock size={14} className="mr-1" />
              {flight.flightDuration}
            </div>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-right flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full"
        >
          <p className="text-red-600 text-sm">Seats Left</p>
          <p className="font-bold text-red-700">{flight.seatsRemaining}</p>
        </motion.div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-gray-900">
            {flight.departureTime}
          </p>
          <p className="text-red-600">{flight.departurePort}</p>
        </motion.div>

        <motion.div
          className="flex-1 mx-8 relative h-px bg-red-200"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
        >
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-1"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-gray-900">
            {flight.arrivalTime}
          </p>
          <p className="text-red-600">{flight.arrivalPort}</p>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-medium"
      >
        Book for {flight.price}
      </motion.button>
    </div>
  </motion.div>
);

const ArikAir: React.FC<{ data: ArikAirResponse }> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      <h2 className="text-2xl font-bold text-red-900">ArikAir Flights</h2>
      <p className="text-red-600">
        {data.searchParams.depPort} to {data.searchParams.arrPort}
      </p>
    </motion.div>

    <div className="space-y-4">
      {data.flights.map((flight, index) => (
        <motion.div
          key={flight.flightNumber}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <FlightCard flight={flight} />
        </motion.div>
      ))}
    </div>
  </div>
);

export default ArikAir;
