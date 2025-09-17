import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Download, Mail, Github, Linkedin } from "lucide-react";
import Footer from "@/components/Footer";
import PersonalInterests from "@/components/PersonalInterests";
import AnimatedSection from "@/components/AnimatedSection";

function AboutMe() {
  const skills = [
    "React",
    "TypeScript",
    "Node.js",
    "JavaScript",
    "CSS",
    "HTML",
    "Git",
  ];

  const experiences = [
    {
      title: "test",
      company: "test",
      period: "test",
      description: "test",
    },
    {
      title: "test",
      company: "test",
      period: "test",
      description: "test",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/20 to-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/20 to-sky-400/20 blur-3xl" />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <AnimatedSection className="text-center mb-12" initialY={20}>
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg shadow-slate-900/10 dark:shadow-white/10">
            <span className="text-4xl font-bold text-white dark:text-slate-900">
              M
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-emerald-600 dark:from-white dark:via-sky-400 dark:to-emerald-400 mb-4">
            Hello, I'm Max
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            A passionate developer who loves creating beautiful and functional
            web experiences. I specialize in modern web technologies and enjoy
            solving complex problems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg border-2"
            >
              Contact Me
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </AnimatedSection>

        <Separator className="my-10 bg-gradient-to-r from-transparent via-slate-300/70 to-transparent dark:via-slate-700/70" />

        {/* About Section */}
        <AnimatedSection delay={0.1}>
          <Card className="mb-8 border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                About Me
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Get to know me better
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I'm a dedicated Full Stack Developer
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                When I'm not coding then i talk to ducks
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Personal Interests & Hobbies Section */}
        <PersonalInterests />

        {/* Skills Section */}
        <AnimatedSection delay={0.2}>
          <Card className="mb-8 border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                Skills & Technologies
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Technologies I work with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-sm px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Experience Section */}
        <AnimatedSection delay={0.25}>
          <Card className="mb-8 border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                Experience
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                My professional journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-slate-900 dark:border-white pl-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {exp.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs border-slate-300 dark:border-slate-600"
                    >
                      {exp.period}
                    </Badge>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">
                    {exp.company}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {exp.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection delay={0.3}>
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                Let's Connect
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                I'm always open to new opportunities and collaborations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="text-2xl mb-2">📧</div>
                  <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">
                    Email
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    email
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="text-2xl mb-2">💼</div>
                  <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">
                    LinkedIn
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    linkedin
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
      <Footer />
    </div>
  );
}

export default AboutMe;
