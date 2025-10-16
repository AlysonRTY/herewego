import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  className?: string;
  gradient?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  className = "",
  gradient = "from-blue-600 to-purple-600",
}: StatCardProps) {
  return (
    <Card
      className={`text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 shadow-xl transform transition-all duration-300 hover:scale-105 ${className}`}
    >
      <CardContent className="p-4">
        <div className="text-3xl mb-1">{icon}</div>
        <div
          className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
      </CardContent>
    </Card>
  );
}
