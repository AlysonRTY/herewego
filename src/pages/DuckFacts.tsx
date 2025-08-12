import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useState } from "react";

export default function DuckFacts() {
  const [selectedFact, setSelectedFact] = useState<number | null>(null);

  const duckFacts = [
    {
      id: 1,
      title: "Did You Know?",
      content:
        "Ducks have been around for millions of years and are found on every continent except Antarctica. There are over 120 different species of ducks worldwide, each with their own unique characteristics and behaviors. From the tiny Green-winged Teal to the majestic Mallard, ducks continue to fascinate scientists and nature lovers alike!",
      color: "from-green-50 to-blue-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      emoji: "🌍",
    },
    {
      id: 2,
      title: "Amazing Duck Superpowers!",
      content:
        "Ducks have incredible waterproof feathers thanks to a special oil gland near their tail called the uropygial gland. They spread this oil over their feathers to keep them dry and buoyant. Plus, ducks can sleep with one eye open and half their brain awake - a skill called unihemispheric slow-wave sleep - allowing them to stay alert for predators while resting!",
      color: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-800",
      emoji: "🦸‍♂️",
    },
    {
      id: 3,
      title: "Quack-tastic Communication",
      content:
        "Ducks are excellent communicators! They use different types of quacks for different situations - alarm calls, mating calls, and even 'contact calls' to keep their ducklings close. Female ducks are the ones who typically quack, while male ducks make softer, raspier sounds. Some species can even mimic other animals!",
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      emoji: "🗣️",
    },
    {
      id: 4,
      title: "Migration Masters",
      content:
        "Many duck species are incredible migrators, traveling thousands of miles between their breeding and wintering grounds. They can fly at speeds of up to 60 mph and reach altitudes of 20,000 feet! Some ducks even use the Earth's magnetic field to navigate during their long journeys.",
      color: "from-indigo-50 to-cyan-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-800",
      emoji: "✈️",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🦆 Amazing Duck Facts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the fascinating world of ducks with these incredible facts
            about these amazing waterfowl!
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {/* <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {duckFacts.length} Facts
            </Badge> */}
            <Badge
              variant="outline"
              className="border-green-300 text-green-700"
            >
              Interactive
            </Badge>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="mt-12 space-y-8">
          {duckFacts.map((fact) => (
            <Card
              key={fact.id}
              className={`max-w-2xl mx-auto bg-gradient-to-r ${fact.color} ${
                fact.borderColor
              } cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedFact === fact.id ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() =>
                setSelectedFact(selectedFact === fact.id ? null : fact.id)
              }
            >
              <CardHeader>
                <CardTitle
                  className={`text-2xl ${fact.textColor} flex items-center gap-2`}
                >
                  <span>{fact.emoji}</span>
                  {fact.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{fact.content}</p>
                {selectedFact === fact.id && (
                  <div className="mt-4 p-3 bg-white/50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-blue-700 font-medium">
                      💡 Fun tip: Click any fact card to highlight it!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-md mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="pt-6">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Bonus Fact:</span> Ducks have
                three eyelids! They have an upper and lower eyelid, plus a third
                transparent eyelid called a nictitating membrane that protects
                their eyes underwater.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
