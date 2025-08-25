export default function Skills() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Skills & Technologies
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Front-end Stack */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Front-end Stack
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  JavaScript (ES6+)
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  TypeScript
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  React
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Next.js 15 (App Router)
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Tailwind CSS
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Shadcn/UI
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Radix UI
                </span>
              </div>
            </div>
          </div>

          {/* Back-end Stack */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Back-end Stack
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Node.js (Express)
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  RESTful APIs
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  NextAuth.js
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Next.js Server Actions
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  JWT
                </span>
              </div>
            </div>
          </div>

          {/* Databases */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Databases
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  MongoDB (MERN Stack)
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Firebase
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  SQLite
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  PostgreSQL (Prisma)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
