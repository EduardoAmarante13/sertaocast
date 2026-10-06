import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play, Calendar, Zap, Headphones, ArrowRight, Sparkles, Newspaper, ExternalLink, MessageCircle } from "lucide-react";
import { api } from "../lib/api";
import EpisodeCard from "../components/EpisodeCard";
import AdSlot from "../components/AdSlot";
import { usePlayer } from "../components/Layout";

export default function Home() {
  const [episodes, setEpisodes] = useState([]);
  const [news, setNews] = useState([]);
  const player = usePlayer();

  useEffect(() => {
    api.get("/episodes").then((r) => setEpisodes(r.data.slice(0, 3))).catch(() => {});
    api.get("/news", { params: { limit: 3 } }).then((r) => setNews(r.data.slice(0, 3))).catch(() => {});
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
              <span className="font-mono text-[11px] tracking-wider text-[#4ade80] uppercase">SertãoCast • No Ar</span>
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
              <Link to="/episodios" data-testid="hero-episodes-button" className="btn-ghost-neon px-7 py-4 rounded-xl inline-flex items-center gap-2 justify-center">
                <Play className="w-5 h-5" /> Ver episódios
              </Link>
            </div>
          </div>

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
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE O PROJETO */}
      <section className="relative py-20 border-y border-[rgba(74,222,128,0.15)] bg-[#0B100C]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Sobre o SertãoCast</div>
            <h2 className="font-display font-black text-3xl lg:text-5xl text-white leading-tight">
              Cultura, tecnologia e um <span className="neon-text">pé no chão</span>.
            </h2>
            <p className="mt-6 text-lg text-[#A7F3D0] leading-relaxed">
              O SertãoCast nasceu para dar voz ao que pulsa no interior do Brasil e conectar essa energia ao mundo digital. Somos um estúdio, um podcast e um ponto de encontro para quem quer contar, ouvir e criar histórias que fazem sentido.
            </p>
            <p className="mt-4 text-[#A7F3D0]/80 leading-relaxed">
              Da literatura de cordel ao lo-fi eletrônico, do causo de boteco ao debate cultural — trazemos convidados que refletem a diversidade do sertão contemporâneo.
            </p>
            <Link to="/sobre" className="mt-6 inline-flex items-center gap-2 text-[#4ade80] hover:text-white font-medium text-sm" data-testid="home-about-link">
              Conheça o projeto <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {[
              { icon: Zap, label: "Agendamento rápido via WhatsApp" },
              { icon: Headphones, label: "Episódios variados sem filtro" },
              { icon: Sparkles, label: "Estúdio com iluminação cênica" },
              { icon: Newspaper, label: "Notícias direto da redação" },
            ].map((it, i) => (
              <div key={i} className="neon-border rounded-xl p-4 bg-[#0B100C]/60">
                <it.icon className="w-5 h-5 text-[#4ade80] mb-2" />
                <div className="text-sm text-white font-medium">{it.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÚLTIMAS NOTÍCIAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Da redação</div>
            <h2 className="font-display font-black text-3xl lg:text-5xl text-white">Últimas notícias</h2>
          </div>
          <Link to="/noticias" className="hidden md:inline-flex items-center gap-2 text-[#4ade80] hover:text-white font-medium text-sm" data-testid="home-all-news-link">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="grain-card neon-border rounded-2xl p-12 text-center" data-testid="home-news-empty">
            <Newspaper className="w-10 h-10 text-[#4ade80] mx-auto mb-4" />
            <div className="font-display font-bold text-xl text-white mb-2">Nenhuma notícia publicada ainda</div>
            <p className="text-sm text-[#6EE7B7]">O admin cadastra as notícias direto do painel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n) => (
              <article key={n.id} className="grain-card neon-border rounded-2xl overflow-hidden group flex flex-col" data-testid={`home-news-card-${n.id}`}>
                <div className="relative aspect-[16/10] bg-[#0B100C] overflow-hidden">
                  {n.image_url ? (
                    <img src={n.image_url} alt={n.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-[#4ade80]/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070A07] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 font-mono text-[10px] px-2 py-1 rounded-md bg-[rgba(74,222,128,0.15)] text-[#4ade80] border border-[rgba(74,222,128,0.3)] uppercase tracking-wider">{n.category}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#6EE7B7] mb-3">
                    <Calendar className="w-3 h-3" />
                    {new Date(n.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    {n.source_name && (<><span className="w-1 h-1 rounded-full bg-[#6EE7B7]" /><span>{n.source_name}</span></>)}
                  </div>
                  <h3 className="font-display font-bold text-white text-lg leading-tight mb-2">{n.title}</h3>
                  <p className="text-sm text-[#A7F3D0]/80 leading-relaxed line-clamp-3 flex-1">{n.summary}</p>
                  {n.source_url && (
                    <a href={n.source_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#4ade80] font-medium hover:text-white">
                      Ler matéria <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ÚLTIMOS EPISÓDIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Últimos episódios</div>
            <h2 className="font-display font-black text-3xl lg:text-5xl text-white">Onda fresca no ar</h2>
          </div>
          <Link to="/episodios" className="hidden md:inline-flex items-center gap-2 text-[#4ade80] hover:text-white font-medium text-sm" data-testid="home-all-episodes-link">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {episodes.length === 0 ? (
          <div className="grain-card neon-border rounded-2xl p-12 text-center" data-testid="home-episodes-empty">
            <Headphones className="w-10 h-10 text-[#4ade80] mx-auto mb-4" />
            <div className="font-display font-bold text-xl text-white mb-2">Nenhum episódio ainda</div>
            <p className="text-sm text-[#6EE7B7]">O admin pode cadastrar episódios pelo painel administrativo.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.id} ep={ep} onPlay={player.play} isPlaying={player.current?.id === ep.id} />
            ))}
          </div>
        )}

        <div className="mt-14">
          <AdSlot name="home-in-article" format="fluid" layout="in-article" />
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
              Grave seu próprio podcast no nosso estúdio. Preencha os dados e finalize a reserva direto no WhatsApp — sem burocracia.
            </p>
            <Link to="/agendar" className="btn-neon inline-flex items-center gap-2 px-6 py-3 rounded-xl" data-testid="home-cta-book">
              <MessageCircle className="w-5 h-5" /> Reservar via WhatsApp
            </Link>
          </div>
          <div className="relative z-10 flex items-center justify-center">
            <img src="/logo.png" alt="SertãoCast" className="w-full max-w-[260px] drop-shadow-[0_0_40px_rgba(74,222,128,0.5)]" />
          </div>
        </div>
      </section>
    </div>
  );
}
