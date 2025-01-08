import { motion } from "framer-motion";
import { GreenAfricaResponse, GreenAfricaFlight } from "@/types/greenafrica";
import { Leaf, Clock, Users, Check } from "lucide-react";

interface Props {
  data: GreenAfricaResponse;
}

const FlightCard = ({ flight }: { flight: GreenAfricaFlight }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const leafVariants = {
    hidden: { opacity: 0, rotate: -45 },
    visible: {
      opacity: [0, 1, 0],
      rotate: [-45, 0, 45],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg p-6 mb-6 border border-green-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <motion.div
            variants={leafVariants}
            animate="visible"
            className="text-green-500"
          >
            <Leaf size={24} />
          </motion.div>
          <div>
            <p className="text-lg font-bold text-green-800">
              {flight.flightNumber}
            </p>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-green-600" />
              <p className="text-sm text-green-600">{flight.duration}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-green-600">Available Seats</p>
          <p className="text-lg font-bold text-green-800">
            {flight.seatsAvailable}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-green-900">
            {flight.departureTime}
          </p>
          <p className="text-sm text-green-700">{flight.departurePort}</p>
        </motion.div>

        <motion.div
          className="flex-1 mx-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="h-1 bg-gradient-to-r from-green-300 via-green-500 to-green-300 rounded-full" />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-green-900">
            {flight.arrivalTime}
          </p>
          <p className="text-sm text-green-700">{flight.arrivalPort}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {flight.fareTypes.map((fare, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <p className="font-medium text-green-800 mb-2">{fare.name}</p>
            <p className="text-xl font-bold text-green-900 mb-3">
              {fare.price}
            </p>
            <div className="space-y-2">
              {fare.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <p className="text-sm text-green-700">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const GreenAfrica: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="text-green-500" />
          <h2 className="text-2xl font-bold text-green-900">
            GreenAfrica Flights
          </h2>
        </div>
        <p className="text-green-700">
          {data.searchParams.origin} → {data.searchParams.destination}
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

export default GreenAfrica;
