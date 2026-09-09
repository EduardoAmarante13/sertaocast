import { Play, Pause, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function PlayerBar({ episode, onClose }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(12);

  useEffect(() => { setPlaying(true); setProgress(12); }, [episode?.id]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.3)), 250);
    return () => clearInterval(t);
  }, [playing]);

  if (!episode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[rgba(74,222,128,0.3)]" data-testid="player-bar">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#141C15] flex-shrink-0">
          {episode.cover_url && <img src={episode.cover_url} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate">{episode.title}</div>
          <div className="text-xs font-mono text-[#6EE7B7]">SERTÃOCAST • {episode.duration}</div>
        </div>
        <div className="hidden md:flex items-end gap-0.5 h-8 w-24">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="wave-bar w-1" style={{ animationDelay: `${i * 0.05}s`, height: `${20 + (i % 5) * 8}%`, animationPlayState: playing ? 'running' : 'paused' }} />
          ))}
        </div>
        <button
          onClick={() => setPlaying(!playing)}
          data-testid="player-play-toggle"
          className="w-11 h-11 rounded-full btn-neon flex items-center justify-center"
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button onClick={onClose} data-testid="player-close" className="w-10 h-10 rounded-lg btn-ghost-neon flex items-center justify-center">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-1 bg-[rgba(74,222,128,0.1)]">
        <div className="h-full bg-gradient-to-r from-[#4ade80] to-[#06b6d4]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
