import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { api } from "../lib/api";

const CATEGORY_LABEL = {
  cultura: "Cultura",
  musica: "Música",
  humor: "Humor",
  entrevistas: "Entrevistas",
  negocios: "Negócios",
};

export default function EpisodeCard({ ep, onPlay, isPlaying }) {
  const [hover, setHover] = useState(false);

  const handlePlay = async () => {
    onPlay(ep);
    try { await api.post(`/episodes/${ep.id}/play`); } catch {}
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grain-card neon-border rounded-2xl overflow-hidden group"
      data-testid={`episode-card-${ep.episode_number}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0B100C]">
        {ep.cover_url ? (
          <img src={ep.cover_url} alt={ep.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#141C15] to-[#0B100C]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A07] via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-[rgba(74,222,128,0.15)] text-[#4ade80] border border-[rgba(74,222,128,0.3)] uppercase tracking-wider">
            {CATEGORY_LABEL[ep.category] || ep.category}
          </span>
          <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-black/60 text-white backdrop-blur">
            EP #{String(ep.episode_number).padStart(2, "0")}
          </span>
        </div>
        <button
          onClick={handlePlay}
          data-testid={`episode-play-button-${ep.episode_number}`}
          className="absolute bottom-3 right-3 w-12 h-12 rounded-full btn-neon flex items-center justify-center opacity-90 hover:opacity-100"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs font-mono text-[#6EE7B7] mb-2">
          <span>{ep.duration}</span>
          <span className="w-1 h-1 rounded-full bg-[#6EE7B7]" />
          <span>{ep.plays.toLocaleString("pt-BR")} plays</span>
        </div>
        <h3 className="font-display font-bold text-white text-lg leading-tight mb-2">{ep.title}</h3>
        <p className="text-sm text-[#A7F3D0]/80 leading-relaxed line-clamp-2">{ep.description}</p>
      </div>
    </div>
  );
}
