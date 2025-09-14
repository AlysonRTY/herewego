import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const BerlinTime = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const berlinTime = currentTime.toLocaleString("en-US", {
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

  const timeOnly = currentTime.toLocaleString("en-US", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateOnly = currentTime.toLocaleString("en-US", {
    timeZone: "Europe/Berlin",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isDaytime = () => {
    const berlinHour = parseInt(
      currentTime.toLocaleString("en-US", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        hour12: false,
      })
    );
    return berlinHour >= 6 && berlinHour < 20;
  };

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        isDaytime()
          ? "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100"
          : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
      } flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 blur-3xl transition-all duration-1000 ${
            isDaytime() ? "bg-yellow-300" : "bg-blue-400"
          }`}
        ></div>
        <div
          className={`absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000 ${
            isDaytime() ? "bg-orange-300" : "bg-purple-400"
          }`}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Main time display */}
        <Card
          className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
            isDaytime()
              ? "bg-white/80 shadow-blue-200/50"
              : "bg-slate-800/80 shadow-blue-900/50"
          }`}
        >
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-4xl">🇩🇪</div>
              <CardTitle
                className={`text-3xl font-light tracking-wide ${
                  isDaytime() ? "text-slate-800" : "text-white"
                }`}
              >
                Berlin
              </CardTitle>
            </div>
            <div
              className={`text-sm font-medium tracking-wider uppercase ${
                isDaytime() ? "text-slate-500" : "text-slate-300"
              }`}
            >
              Germany • Europe/Berlin
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-6 pb-8">
            {/* Digital clock display */}
            <div className="relative">
              <div
                className={`text-6xl md:text-7xl font-mono font-bold tracking-wider transition-colors duration-500 ${
                  isDaytime() ? "text-slate-800" : "text-white"
                }`}
              >
                {timeOnly}
              </div>
              <div
                className={`absolute -top-2 -right-2 w-3 h-3 rounded-full animate-pulse ${
                  isDaytime() ? "bg-green-500" : "bg-green-400"
                }`}
              ></div>
            </div>

            {/* Date display */}
            <div
              className={`text-xl font-medium ${
                isDaytime() ? "text-slate-600" : "text-slate-200"
              }`}
            >
              {dateOnly}
            </div>

            {/* Time zone info */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200/20">
              <div className="text-center">
                <div
                  className={`text-xs uppercase tracking-wide font-semibold ${
                    isDaytime() ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Time Zone
                </div>
                <div
                  className={`text-sm font-medium ${
                    isDaytime() ? "text-slate-700" : "text-slate-200"
                  }`}
                >
                  CET/CEST
                </div>
              </div>
              <div
                className={`w-px h-8 ${
                  isDaytime() ? "bg-slate-300" : "bg-slate-600"
                }`}
              ></div>
              <div className="text-center">
                <div
                  className={`text-xs uppercase tracking-wide font-semibold ${
                    isDaytime() ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Status
                </div>
                <div
                  className={`text-sm font-medium flex items-center justify-center gap-1 ${
                    isDaytime() ? "text-slate-700" : "text-slate-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isDaytime() ? "bg-yellow-500" : "bg-blue-500"
                    }`}
                  ></div>
                  {isDaytime() ? "Day" : "Night"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card
            className={`backdrop-blur-sm border-0 transition-all duration-500 ${
              isDaytime()
                ? "bg-white/60 shadow-lg shadow-blue-200/30"
                : "bg-slate-800/60 shadow-lg shadow-blue-900/30"
            }`}
          >
            <CardContent className="p-4 text-center">
              <div
                className={`text-2xl mb-1 ${
                  isDaytime() ? "text-slate-700" : "text-white"
                }`}
              >
                🌍
              </div>
              <div
                className={`text-xs uppercase tracking-wide font-semibold ${
                  isDaytime() ? "text-slate-500" : "text-slate-400"
                }`}
              >
                UTC Offset
              </div>
              <div
                className={`text-sm font-medium ${
                  isDaytime() ? "text-slate-700" : "text-slate-200"
                }`}
              >
                +1/+2
              </div>
            </CardContent>
          </Card>

          <Card
            className={`backdrop-blur-sm border-0 transition-all duration-500 ${
              isDaytime()
                ? "bg-white/60 shadow-lg shadow-blue-200/30"
                : "bg-slate-800/60 shadow-lg shadow-blue-900/30"
            }`}
          >
            <CardContent className="p-4 text-center">
              <div
                className={`text-2xl mb-1 ${
                  isDaytime() ? "text-slate-700" : "text-white"
                }`}
              >
                ⏰
              </div>
              <div
                className={`text-xs uppercase tracking-wide font-semibold ${
                  isDaytime() ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Live Update
              </div>
              <div
                className={`text-sm font-medium ${
                  isDaytime() ? "text-slate-700" : "text-slate-200"
                }`}
              >
                Real-time
              </div>
            </CardContent>
          </Card>

          <Card
            className={`backdrop-blur-sm border-0 transition-all duration-500 ${
              isDaytime()
                ? "bg-white/60 shadow-lg shadow-blue-200/30"
                : "bg-slate-800/60 shadow-lg shadow-blue-900/30"
            }`}
          >
            <CardContent className="p-4 text-center">
              <div
                className={`text-2xl mb-1 ${
                  isDaytime() ? "text-slate-700" : "text-white"
                }`}
              >
                🏛️
              </div>
              <div
                className={`text-xs uppercase tracking-wide font-semibold ${
                  isDaytime() ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Capital
              </div>
              <div
                className={`text-sm font-medium ${
                  isDaytime() ? "text-slate-700" : "text-slate-200"
                }`}
              >
                Germany
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BerlinTime;
