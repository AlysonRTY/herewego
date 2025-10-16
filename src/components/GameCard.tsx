import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  children: React.ReactNode;
  className?: string;
}

export default function GameCard({
  title,
  description,
  badge,
  badgeVariant = "secondary",
  children,
  className = "",
}: GameCardProps) {
  return (
    <Card className={`h-fit ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
