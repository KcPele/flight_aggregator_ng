import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const RouteCard = ({
  route,
  index,
}: {
  route: {
    from: string;
    to: string;
    price: string;
  };
  index: number;
}) => {
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

export default RouteCard;
