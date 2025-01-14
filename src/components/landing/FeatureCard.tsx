import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const FeatureCard = ({
  feature,
  index,
}: {
  feature: {
    icon: React.JSX.Element;
    title: string;
    description: string;
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

export default FeatureCard;
