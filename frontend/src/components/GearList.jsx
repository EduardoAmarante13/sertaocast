import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { api } from "../lib/api";

// icon id -> lucide-react component
const ICON_MAP = {
  mic2: Icons.Mic2,
  radio: Icons.Radio,
  camera: Icons.Camera,
  sliders: Icons.Sliders,
  music: Icons.Music,
  sparkles: Icons.Sparkles,
  zap: Icons.Zap,
  headphones: Icons.Headphones,
  speaker: Icons.Speaker,
};

export const GEAR_ICON_OPTIONS = Object.keys(ICON_MAP);

export function GearIcon({ name, className = "w-5 h-5 text-[#4ade80]" }) {
  const Cmp = ICON_MAP[name] || Icons.Mic2;
  return <Cmp className={className} />;
}

export default function GearList({ emptyLabel }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/gear").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="grain-card neon-border rounded-2xl p-10 text-center" data-testid="gear-empty">
        <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-2">// Em breve</div>
        <div className="font-display font-bold text-white text-lg">{emptyLabel || "Equipamentos serão divulgados em breve"}</div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((g) => (
        <div key={g.id} className="grain-card neon-border rounded-2xl p-6 flex items-start gap-4" data-testid={`gear-item-${g.id}`}>
          <div className="w-11 h-11 rounded-xl bg-[rgba(74,222,128,0.1)] flex items-center justify-center flex-shrink-0">
            <GearIcon name={g.icon} />
          </div>
          <div>
            <div className="font-display font-bold text-white">{g.name}</div>
            {g.note && <div className="text-xs font-mono text-[#6EE7B7] mt-1">{g.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
