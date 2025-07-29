import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Palette, Zap, Database } from "lucide-react";

export default function FeaturedSection() {
  const features = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Frontend Development",
      description:
        "Building responsive and interactive user interfaces with React, TypeScript, and modern CSS.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Backend Development",
      description:
        "Creating robust APIs and server-side applications with Node.js and modern databases.",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Full Stack Solutions",
      description:
        "End-to-end development from concept to deployment with modern tools and practices.",
      skills: ["Git", "Docker", "AWS", "CI/CD"],
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "UI/UX Design",
      description:
        "Creating beautiful and intuitive user experiences with modern design principles.",
      skills: ["Figma", "Responsive Design", "Accessibility", "Performance"],
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            What I Do
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            I specialize in creating modern web applications with a focus on
            performance, accessibility, and user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-slate-50 dark:bg-slate-800"
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs px-2 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
