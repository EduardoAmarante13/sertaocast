import { useEffect, useState } from "react";
import { ExternalLink, Newspaper, Calendar } from "lucide-react";
import { api } from "../lib/api";

const CATS = [
  { id: "todos", label: "Todas" },
  { id: "geral", label: "Geral" },
  { id: "cultura", label: "Cultura" },
  { id: "musica", label: "Música" },
  { id: "humor", label: "Humor" },
  { id: "entrevistas", label: "Entrevistas" },
  { id: "negocios", label: "Negócios" },
];

export default function News() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState("todos");

  useEffect(() => {
    const params = {};
    if (cat !== "todos") params.category = cat;
    api.get("/news", { params }).then((r) => setItems(r.data)).catch(() => {});
  }, [cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Direto da redação</div>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white">Notícias</h1>
        <p className="mt-4 text-[#A7F3D0] max-w-2xl">
          Fique por dentro de tudo que rola no SertãoCast — bastidores, novos episódios, parceiros e cultura do sertão.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            data-testid={`news-filter-${c.id}`}
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

      {items.length === 0 ? (
        <div className="grain-card neon-border rounded-2xl p-16 text-center" data-testid="news-empty">
          <Newspaper className="w-10 h-10 text-[#4ade80] mx-auto mb-4" />
          <div className="font-display font-bold text-xl text-white mb-2">Ainda sem notícias por aqui</div>
          <p className="text-sm text-[#6EE7B7]">Logo logo o admin publica a primeira matéria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((n) => (
            <article
              key={n.id}
              data-testid={`news-card-${n.id}`}
              className="grain-card neon-border rounded-2xl overflow-hidden group flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-[#0B100C] overflow-hidden">
                {n.image_url ? (
                  <img src={n.image_url} alt={n.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="w-10 h-10 text-[#4ade80]/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070A07] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 font-mono text-[10px] px-2 py-1 rounded-md bg-[rgba(74,222,128,0.15)] text-[#4ade80] border border-[rgba(74,222,128,0.3)] uppercase tracking-wider">
                  {n.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-mono text-[#6EE7B7] mb-3">
                  <Calendar className="w-3 h-3" />
                  {new Date(n.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  {n.source_name && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[#6EE7B7]" />
                      <span>{n.source_name}</span>
                    </>
                  )}
                </div>
                <h3 className="font-display font-bold text-white text-lg leading-tight mb-2">{n.title}</h3>
                <p className="text-sm text-[#A7F3D0]/80 leading-relaxed line-clamp-3 flex-1">{n.summary}</p>
                {n.source_url && (
                  <a
                    href={n.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`news-link-${n.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#4ade80] font-medium hover:text-white"
                  >
                    Ler matéria completa <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
