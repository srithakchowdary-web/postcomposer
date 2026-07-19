export const PLATFORMS = ["X", "Instagram", "Facebook", "LinkedIn"];
export const LIMITS = { X: 280, Instagram: 2200, LinkedIn: 3000, Facebook: 63000 };
export default function PlatformSelector({ selected, onChange }) {
  const toggle = (p) => {
    if (selected.includes(p)) onChange(selected.filter((x) => x !== p));
    else onChange([...selected, p]);
  };
  return (
    <div>
      <p className="text-sm font-medium mb-2">Platforms</p>
      <div className="flex flex-wrap gap-3">
        {PLATFORMS.map((p) => (
          <label
            key={p}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition ${
              selected.includes(p)
                ? "bg-pink-100 border-pink-300"
                : "bg-white border-pink-100 hover:border-pink-200"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(p)}
              onChange={() => toggle(p)}
              className="accent-pink-400"
            />
            <span className="text-sm">
              {p}{" "}
              <span className="text-gray-400 text-xs">({LIMITS[p]} chars)</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}