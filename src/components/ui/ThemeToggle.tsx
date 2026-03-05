import { useTheme, type Theme } from "../../context/ThemeContext";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex bg-surface rounded-xl p-1 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            theme === opt.value
              ? "bg-card shadow-card text-text"
              : "text-text-secondary hover:text-text"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
