interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: number;
  className?: string;
}

export default function FeatureGrid({
  features,
  columns = 3,
  className = "",
}: FeatureGridProps) {
  const gridClass = `grid gap-4 ${
    columns === 2
      ? "md:grid-cols-2"
      : columns === 3
      ? "md:grid-cols-3"
      : columns === 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : "md:grid-cols-3"
  }`;

  return (
    <div className={`${gridClass} ${className}`}>
      {features.map((feature, index) => (
        <div
          key={index}
          className="text-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="text-3xl mb-2">{feature.icon}</div>
          <h3 className="text-white font-bold mb-1">{feature.title}</h3>
          <p className="text-white/70 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
