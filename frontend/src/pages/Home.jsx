import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play, Calendar, Mic2, Radio, Zap, Headphones, ArrowRight, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import EpisodeCard from "../components/EpisodeCard";
import AdSlot from "../components/AdSlot";
import { usePlayer } from "../components/Layout";

export default function Home() {
  const [episodes, setEpisodes] = useState([]);
  const player = usePlayer();

  useEffect(() => {
    api.get("/episodes").then((r) => setEpisodes(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#4ade80] opacity-10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#06b6d4] opacity-10 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 lg:pt-24 pb-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.05)] mb-8">
              <span className="pulse-dot"></span>
              <span className="font-mono text-[11px] tracking-wider text-[#4ade80] uppercase">Episódio 06 • No Ar Agora</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-tight text-white">
              A voz do<br />
              <span className="neon-text">Sertão</span> na<br />
              velocidade do <span className="bg-gradient-to-r from-[#4ade80] to-[#06b6d4] bg-clip-text text-transparent">streaming</span>.
            </h1>
            <p className="mt-6 text-lg text-[#A7F3D0] leading-relaxed max-w-xl">
              Cultura, humor, música e entrevistas sem filtro. Um podcast que respira o Nordeste e conversa com o mundo. Reserve nossa sala e grave o seu próprio.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/agendar" data-testid="hero-book-studio-button" className="btn-neon px-7 py-4 rounded-xl inline-flex items-center gap-2 justify-center">
                <Calendar className="w-5 h-5" /> Agendar a Sala
              </Link>
              <button
                data-testid="hero-play-latest-button"
                onClick={() => episodes[0] && player.play(episodes[0])}
                className="btn-ghost-neon px-7 py-4 rounded-xl inline-flex items-center gap-2 justify-center"
              >
                <Play className="w-5 h-5" /> Ouvir último episódio
              </button>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
              <Stat n="120K+" label="Plays / mês" />
              <Stat n="+50" label="Episódios" />
              <Stat n="4.9★" label="Avaliação" />
            </div>
          </div>

          {/* Right: Bento visual with logo */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 grain-card neon-border rounded-2xl p-6 aspect-square relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.25),transparent_60%)]" />
                <img src="/logo.png" alt="SertãoCast" className="relative z-10 w-full max-w-[380px] drop-shadow-[0_0_40px_rgba(74,222,128,0.6)]" />
                <div className="absolute bottom-4 left-6 right-6 flex items-end gap-1 h-10 z-10">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="wave-bar w-1 flex-1" style={{ animationDelay: `${i * 0.04}s`, height: `${25 + (i % 7) * 10}%` }} />
                  ))}
                </div>
              </div>
              <div className="grain-card neon-border rounded-2xl p-5">
                <Mic2 className="w-6 h-6 text-[#4ade80] mb-3" />
                <div className="text-xs font-mono text-[#6EE7B7] mb-1">EQUIPAMENTO</div>
                <div className="font-display font-bold text-white">Shure SM7B</div>
              </div>
              <div className="grain-card neon-border rounded-2xl p-5">
                <Zap className="w-6 h-6 text-[#06b6d4] mb-3" />
                <div className="text-xs font-mono text-[#6EE7B7] mb-1">RESERVAS</div>
                <div className="font-display font-bold text-white">Confirmação instantânea</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES STRIP */}
      <section className="border-y border-[rgba(74,222,128,0.15)] py-8 bg-[#0B100C]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-between gap-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#6EE7B7]">Categorias</div>
          {["Cultura", "Música", "Humor", "Entrevistas", "Negócios"].map((c) => (
            <div key={c} className="font-display font-bold text-xl lg:text-2xl text-white/70 hover:text-[#4ade80] transition-colors cursor-default">
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* LATEST EPISODES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Últimos episódios</div>
            <h2 className="font-display font-black text-3xl lg:text-5xl text-white">Onda fresca no ar</h2>
          </div>
          <Link to="/episodios" className="hidden md:inline-flex items-center gap-2 text-[#4ade80] hover:text-white font-medium text-sm" data-testid="home-all-episodes-link">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.id} ep={ep} onPlay={player.play} isPlaying={player.current?.id === ep.id} />
          ))}
        </div>

        {/* In-article ad — high engagement spot between content & CTA */}
        <div className="mt-14">
          <AdSlot format="fluid" layout="in-article" testid="ad-home-in-article" />
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grain-card neon-border rounded-3xl p-8 lg:p-14 grid lg:grid-cols-2 gap-10 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#4ade80] opacity-10 blur-[100px]" />
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 text-[#4ade80] mb-4" />
            <h3 className="font-display font-black text-3xl lg:text-4xl text-white leading-tight mb-4">
              Sua voz merece uma <span className="neon-text">cabine neon</span>.
            </h3>
            <p className="text-[#A7F3D0] leading-relaxed mb-6">
              Grave seu próprio podcast em nossa sala equipada com microfones Shure SM7B, câmeras 4K e mesa Rødecaster. Reserva com confirmação automática.
            </p>
            <Link to="/agendar" className="btn-neon inline-flex items-center gap-2 px-6 py-3 rounded-xl" data-testid="home-cta-book">
              <Headphones className="w-5 h-5" /> Reservar horário
            </Link>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-3">
            {[
              { icon: Mic2, label: "4 mics profissionais" },
              { icon: Radio, label: "Transmissão ao vivo" },
              { icon: Zap, label: "Aprovação instantânea" },
              { icon: Sparkles, label: "Iluminação cênica" },
            ].map((it, i) => (
              <div key={i} className="neon-border rounded-xl p-4 bg-[#0B100C]/50">
                <it.icon className="w-5 h-5 text-[#4ade80] mb-2" />
                <div className="text-sm text-white font-medium">{it.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="font-display font-black text-3xl text-white">{n}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-[#6EE7B7] mt-1">{label}</div>
    </div>
  );
}
