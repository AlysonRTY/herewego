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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center">
            <span className="text-4xl font-bold text-white dark:text-slate-900">
              M
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Hello, I'm Max
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            A passionate developer who loves creating beautiful and functional
            web experiences. I specialize in modern web technologies and enjoy
            solving complex problems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8 py-3 text-lg">
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg border-2"
            >
              Contact Me
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        {/* About Section */}
        <Card className="mb-8 border-0 bg-slate-50 dark:bg-slate-800 hover:shadow-lg transition-all duration-300">
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

        {/* Skills Section */}
        <Card className="mb-8 border-0 bg-slate-50 dark:bg-slate-800 hover:shadow-lg transition-all duration-300">
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

        {/* Experience Section */}
        <Card className="mb-8 border-0 bg-slate-50 dark:bg-slate-800 hover:shadow-lg transition-all duration-300">
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

        {/* Contact Section */}
        <Card className="border-0 bg-slate-50 dark:bg-slate-800 hover:shadow-lg transition-all duration-300">
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
              <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                <div className="text-2xl mb-2">📧</div>
                <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">
                  Email
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  email
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
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
      </div>
    </div>
  );
}

export default AboutMe;
