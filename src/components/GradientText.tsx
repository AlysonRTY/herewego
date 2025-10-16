interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animate?: boolean;
}

export default function GradientText({
  children,
  className = "",
  gradient = "from-blue-600 via-purple-600 to-pink-600",
  animate = false,
}: GradientTextProps) {
  return (
    <h1
      className={`font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${
        animate ? "animate-pulse" : ""
      } ${className}`}
    >
      {children}
    </h1>
  );
}
