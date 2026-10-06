import { useEffect, useState } from "react";
import { api } from "../lib/api";

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function HostList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/hosts").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="grain-card neon-border rounded-2xl p-10 text-center" data-testid="hosts-empty">
        <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-2">// Em breve</div>
        <div className="font-display font-bold text-white text-lg">Em breve apresentamos quem comanda os microfones.</div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((h) => (
        <div key={h.id} className="grain-card neon-border rounded-2xl p-7 flex flex-col" data-testid={`host-${h.id}`}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4ade80] to-[#06b6d4] flex items-center justify-center font-display font-black text-2xl text-[#052e16] mb-5">
            {initials(h.name)}
          </div>
          <div className="font-display font-bold text-xl text-white">{h.name}</div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mt-1 mb-4">{h.role}</div>
          <p className="text-sm text-[#A7F3D0]/85 leading-relaxed">{h.bio}</p>
        </div>
      ))}
    </div>
  );
}
