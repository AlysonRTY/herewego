import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Mail } from "lucide-react";

export default function HeroSection() {
  const skills = ["React", "TypeScript", "Node.js", "Full Stack"];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        {/* <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
         Available for new opportunities
        </Badge> */}

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
          Hi, I'm{" "}
          <span className="text-slate-700 dark:text-slate-300">Max</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          A passionate{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Full Stack Developer
          </span>{" "}
          who loves creating modern web experiences and turning ideas into
          reality.
        </p>

        {/* Skills badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="px-4 py-2 text-sm border-slate-300 dark:border-slate-600"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="px-8 py-3 text-lg">
            View My Work
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg border-2"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Resume
          </Button>
        </div>

        {/* Contact info */}
        <div className="mt-12 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-600 dark:text-slate-400"
          >
            <Mail className="mr-2 h-4 w-4" />
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  );
}
