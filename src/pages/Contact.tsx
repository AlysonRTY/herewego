import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "-",
      description: "Send me an email anytime",
      href: "mailto:hello@maxdev.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "-",
      description: "Call me during business hours",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Berlin, Germany",
      description: "Available for remote work",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      title: "GitHub",
      href: "https://github.com/AlysonRTY",
      description: "Check out my code",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/20 to-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/20 to-sky-400/20 blur-3xl" />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <AnimatedSection className="text-center mb-12" initialY={20}>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-emerald-600 dark:from-white dark:via-sky-400 dark:to-emerald-400 mb-4">
            Let's Work Together
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            I'm always looking for new opportunities and collaborations. Whether
            you have a project in mind or just want to chat about tech, I'd love
            to hear from you.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <AnimatedSection delay={0.1}>
            <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                  Send me a message
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Fill out the form below and I'll get back to you as soon as
                  possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-vertical"
                      placeholder="Tell me about your project or just say hello!"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md">
                      <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                        ✅ Message sent successfully! I'll get back to you soon.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-lg"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Contact Information */}
          <div className="space-y-6">
            <AnimatedSection delay={0.2}>
              <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                    Get in touch
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Prefer a more direct approach? Here are other ways to reach
                    me
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const IconComponent = method.icon;
                    return (
                      <a
                        key={index}
                        href={method.href}
                        className="flex items-center p-4 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-md group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors">
                          <IconComponent className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {method.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium">
                            {method.value}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-500">
                            {method.description}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                    Follow me
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Connect with me on social platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-md group"
                        >
                          <IconComponent className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
                          <div className="ml-3">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {social.title}
                            </span>
                            <p className="text-sm text-slate-500 dark:text-slate-500">
                              {social.description}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>

        <Separator className="my-10 bg-gradient-to-r from-transparent via-slate-300/70 to-transparent dark:via-slate-700/70" />
      </div>

      <Footer />
    </div>
  );
}
