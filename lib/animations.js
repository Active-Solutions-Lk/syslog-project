// Logo animations
export const logoVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    }
  }
};

// Container animations for welcome content
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

// Children items animations
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  }
};

// Form container animations
export const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.6,
    }
  }
};

// Form input animations
export const inputVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    }
  }
};

// Page transition animations
export const pageVariants = {
  initial: { opacity: 0 },
  in: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  out: { 
    opacity: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Button hover animations
export const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.03,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};