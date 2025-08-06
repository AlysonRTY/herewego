import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/AlysonRTY",
      label: "GitHub",
    },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              {/* <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
                <span className="text-sm font-bold text-white dark:text-slate-900">
                  M
                </span>
              </div> */}
              <span className="font-bold text-xl text-slate-900 dark:text-white">
                Max
              </span>
            </div>
            <p className="text-sm">
              Building modern web experiences with passion and precision.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  asChild
                >
                  <a href={link.href} aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Get in touch
            </Button>
          </div>
        </div>

        <div className="border-t border-slate-300 dark:border-slate-700 mt-8 pt-8 text-center">
          <p className="text-sm">
            © 2024 Max. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
