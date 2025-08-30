import AnimatedSection from "@/components/AnimatedSection";
import SkillCategory from "../components/SkillCategory";

export default function Skills() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/20 to-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/20 to-sky-400/20 blur-3xl" />
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              Skills & Technologies
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
              <SkillCategory
                title="Front-end Stack"
                accentColor="blue"
                items={[
                  "JavaScript (ES6+)",
                  "TypeScript",
                  "React",
                  "Next.js 15 (App Router)",
                  "Tailwind CSS",
                  "Shadcn/UI",
                  "Radix UI",
                ]}
              />

              <SkillCategory
                title="Back-end Stack"
                accentColor="green"
                items={[
                  "Node.js (Express)",
                  "RESTful APIs",
                  "NextAuth.js",
                  "Next.js Server Actions",
                  "JWT",
                ]}
              />

              <SkillCategory
                title="Databases"
                accentColor="purple"
                items={[
                  "MongoDB (MERN Stack)",
                  "Firebase",
                  "SQLite",
                  "PostgreSQL (Prisma)",
                ]}
              />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
