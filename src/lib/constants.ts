// Common color palettes
export const COLOR_PALETTES = {
  primary: [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ],
  pastel: [
    "#fecaca",
    "#fed7aa",
    "#fef3c7",
    "#d1fae5",
    "#a7f3d0",
    "#bfdbfe",
    "#ddd6fe",
    "#f9a8d4",
  ],
  dark: [
    "#7f1d1d",
    "#9a3412",
    "#a16207",
    "#14532d",
    "#164e63",
    "#1e3a8a",
    "#581c87",
    "#be185d",
  ],
} as const;

// Common gradients
export const GRADIENTS = {
  blue: "from-blue-600 to-purple-600",
  green: "from-green-600 to-emerald-600",
  purple: "from-purple-600 to-pink-600",
  orange: "from-orange-600 to-red-600",
  cyan: "from-cyan-600 to-blue-600",
  rainbow: "from-blue-600 via-purple-600 to-pink-600",
  sunset: "from-orange-500 via-red-500 to-pink-500",
  ocean: "from-blue-500 via-teal-500 to-green-500",
} as const;

// Animation configurations
export const ANIMATION_CONFIG = {
  fast: "duration-200",
  normal: "duration-300",
  slow: "duration-500",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
} as const;

// Common breakpoints for responsive design
export const BREAKPOINTS = {
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
  "2xl": "2xl:",
} as const;
