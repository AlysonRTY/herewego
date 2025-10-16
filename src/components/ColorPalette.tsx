interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
}

export default function ColorPalette({
  colors,
  selectedColor,
  onColorSelect,
  className = "",
}: ColorPaletteProps) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
            selectedColor === color
              ? "border-white scale-110"
              : "border-white/30"
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
}
