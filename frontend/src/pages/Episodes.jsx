import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "../lib/api";
import EpisodeCard from "../components/EpisodeCard";
import AdSlot from "../components/AdSlot";
import { usePlayer } from "../components/Layout";

const CATS = [
  { id: "todos", label: "Todos" },
  { id: "cultura", label: "Cultura" },
  { id: "musica", label: "Música" },
  { id: "humor", label: "Humor" },
  { id: "entrevistas", label: "Entrevistas" },
  { id: "negocios", label: "Negócios" },
];

export default function Episodes() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState("todos");
  const [q, setQ] = useState("");
  const player = usePlayer();

  useEffect(() => {
    const params = {};
    if (cat !== "todos") params.category = cat;
    if (q) params.q = q;
    const t = setTimeout(() => {
      api.get("/episodes", { params }).then((r) => setItems(r.data)).catch(() => {});
    }, 200);
    return () => clearTimeout(t);
  }, [cat, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Biblioteca completa</div>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white">Episódios</h1>
        <p className="mt-4 text-[#A7F3D0] max-w-2xl">Explore toda a biblioteca do SertãoCast — filtre por categoria ou busque por título.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6EE7B7]" />
          <input
            data-testid="episode-search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar episódio..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] focus:border-[#4ade80] focus:outline-none text-white placeholder:text-[#34D399]/60"
          />
        </div>
        <div className="flex flex-wrap gap-2 scrollbar-neon">
          {CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              data-testid={`episode-filter-${c.id}`}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider border transition-all ${
                cat === c.id
                  ? "bg-[#4ade80] text-[#052e16] border-[#4ade80] shadow-[0_0_25px_rgba(74,222,128,0.4)]"
                  : "text-[#A7F3D0] border-[rgba(74,222,128,0.25)] hover:border-[#4ade80]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 text-[#6EE7B7] font-mono text-sm" data-testid="episodes-empty">
          Nenhum episódio encontrado.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 3).map((ep) => (
              <EpisodeCard key={ep.id} ep={ep} onPlay={player.play} isPlaying={player.current?.id === ep.id} />
            ))}
          </div>
          {items.length > 3 && (
            <div className="my-10">
              <AdSlot name="episodes-mid" format="fluid" layout="in-article" testid="ad-episodes-mid" />
            </div>
          )}
          {items.length > 3 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.slice(3).map((ep) => (
                <EpisodeCard key={ep.id} ep={ep} onPlay={player.play} isPlaying={player.current?.id === ep.id} />
              ))}
            </div>
          )}
          <div className="mt-14">
            <AdSlot name="episodes-mid" testid="ad-episodes-bottom" />
          </div>
        </>
      )}
    </div>
  );
}
