import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Scene from "./Scene";
import { Clock, CreditCard, Map, Plane, PlaneLanding } from "lucide-react";

const FeatureCard = ({ feature, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: index * 0.2 },
        },
      }}
      className="relative p-6 rounded-2xl overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-orange-400/30 backdrop-blur-lg border border-white/20 rounded-2xl transition-all duration-300 group-hover:shadow-[0_0_20px_5px_rgba(255,255,255,0.3)]" />
      <div className="relative flex flex-col items-center text-center">
        <motion.div
          className="mb-4 text-white p-3 rounded-full bg-purple-600/20 backdrop-blur-sm"
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          {feature.icon}
        </motion.div>
        <h3 className="text-lg font-semibold mb-2 text-white">
          {feature.title}
        </h3>
        <p className="text-white/80">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const RouteCard = ({ route, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5, delay: index * 0.1 },
        },
      }}
      className="relative p-6 rounded-xl overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-600/5 backdrop-blur-lg border border-white/20 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_5px_rgba(255,255,255,0.3)]" />
      <div className="relative text-center">
        <div className="font-medium text-white">
          {route.from} → {route.to}
        </div>
        <div className="text-lg font-bold text-white mt-2">
          from {route.price}
        </div>
      </div>
    </motion.div>
  );
};

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
    <>
      <Scene />
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
    </>
  );
};

export default HeroSection;
