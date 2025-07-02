"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Logo = ({ height = 200, width = 200 }) => {
    var logoUrl = '/images/logo.png'
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Image src={logoUrl} alt="Logo" width={width} height={height} className="mr-2" />
    </motion.div>
  );
};

const LogoFill = ({ height = 150, width = 150 }) => {
     var logoUrl = '/images/color-logo.png'
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Image src={logoUrl} alt="Logo" width={width} height={height} className="mr-2" />
    </motion.div>
  );
};

// Exporting both Logo and LogoFill components
export { LogoFill };
export default Logo;