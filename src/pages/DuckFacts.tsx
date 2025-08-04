import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function DuckFacts() {
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
        </div>

        <Separator className="my-8" />

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-2xl text-green-800">
                Did You Know?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Ducks have been around for millions of years and are found on
                every continent except Antarctica. There are over 120 different
                species of ducks worldwide, each with their own unique
                characteristics and behaviors. From the tiny Green-winged Teal
                to the majestic Mallard, ducks continue to fascinate scientists
                and nature lovers alike!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
