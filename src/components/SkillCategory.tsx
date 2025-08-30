interface SkillCategoryProps {
  title: string;
  accentColor?: "blue" | "green" | "purple" | "rose" | "amber";
  items: string[];
}

const accentMap: Record<
  NonNullable<SkillCategoryProps["accentColor"]>,
  string
> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

export default function SkillCategory({
  title,
  accentColor = "blue",
  items,
}: SkillCategoryProps) {
  const accentClass = accentMap[accentColor] ?? accentMap.blue;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <span className={`w-2 h-2 ${accentClass} rounded-full mr-3`}></span>
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
