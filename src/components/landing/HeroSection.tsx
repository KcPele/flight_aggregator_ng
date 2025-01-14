import React from "react";
import { motion } from "framer-motion";
import { Clock, CreditCard, Map, Plane, PlaneLanding } from "lucide-react";
import FeatureCard from "./FeatureCard";
import RouteCard from "./RouteCard";
const HeroSection = () => {
  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-Time Prices",
      description: "Compare live prices across all Nigerian airlines",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Best Deals",
      description: "Find the cheapest flights and exclusive offers",
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Popular Routes",
      description: "Lagos ↔ Abuja, Port Harcourt ↔ Lagos, Kano ↔ Abuja",
    },
  ];

  const popularRoutes = [
    { from: "Lagos", to: "Abuja", price: "₦66,000" },
    { from: "Port Harcourt", to: "Lagos", price: "₦85,000" },
    { from: "Kano", to: "Lagos", price: "₦85,000" },
    { from: "Enugu", to: "Abuja", price: "₦88,000" },
  ];

  return (
    <div className="relative min-h-screen ">
      <div className="container mx-auto px-4 pt-20 lg:pt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PlaneLanding className="w-12 h-12 text-white/90" />
              <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
                CheapSearch
              </h1>
              <Plane className="w-12 h-12 text-white/90" />
            </div>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Find the best flight deals across multiple airlines in Nigeria.
              Compare prices and book your next journey with ease.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        <div className="relative p-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-center mb-6 text-white font-[Poppins]">
              Popular Routes
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularRoutes.map((route, index) => (
                <RouteCard key={index} route={route} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
