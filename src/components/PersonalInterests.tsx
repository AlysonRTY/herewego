import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

export default function PersonalInterests() {
  return (
    <AnimatedSection delay={0.15}>
      <Card className="mb-8 border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
            Personal Interests & Hobbies
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            What I enjoy when I'm not coding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  🦆
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Duck Conversations
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    My favorite pastime - chatting with our feathered friends
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  📚
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Reading
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    The Holy Bible
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  🎮
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Gaming
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Strategy games and indie titles
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  🚶
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Nature Walks
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Exploring parks and finding more ducks to talk to
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
