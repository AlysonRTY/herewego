import SkillCategory from "../components/SkillCategory";

export default function Skills() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
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
    </div>
  );
}
