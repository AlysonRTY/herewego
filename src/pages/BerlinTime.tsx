import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const BerlinTime = () => {
  const [berlinTime, setBerlinTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const berlinTime = now.toLocaleString("en-US", {
        timeZone: "Europe/Berlin",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setBerlinTime(berlinTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            🇩🇪 Berlin Time
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-3xl font-mono font-bold text-blue-600 mb-4">
            {berlinTime}
          </div>
          <p className="text-gray-600 text-sm">
            Current time in Berlin, Germany (CET/CEST)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BerlinTime;
