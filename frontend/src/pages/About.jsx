import { Mic2, Radio, Sparkles, Camera, Sliders, Music } from "lucide-react";

const HOSTS = [
  { name: "Eduardo Guenov", role: "Host & Idealizador", bio: "Curador cultural, produtor musical e apaixonado pelo Nordeste. Comanda o SertãoCast desde o primeiro episódio." },
  { name: "Chico Violeiro", role: "Cohost & Cantador", bio: "Poeta, cantador e engenheiro de som. Traz a viola e a raiz das rimas para dentro do estúdio." },
];

const GEAR = [
  { icon: Mic2, name: "Shure SM7B", note: "4 unidades" },
  { icon: Sliders, name: "Rødecaster Pro II", note: "Mixer multitrack" },
  { icon: Camera, name: "Sony Alpha 4K", note: "3 câmeras" },
  { icon: Sparkles, name: "Iluminação Neon", note: "Painéis LED programáveis" },
  { icon: Music, name: "Ableton Live 12", note: "Trilhas ao vivo" },
  { icon: Radio, name: "Transmissão RTMP", note: "YouTube / Twitch" },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="grid lg:grid-cols-12 gap-10 mb-20">
        <div className="lg:col-span-7">
          <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Sobre o projeto</div>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Cultura, tecnologia e um <span className="neon-text">pé no chão</span>.
          </h1>
          <p className="mt-6 text-lg text-[#A7F3D0] leading-relaxed">
            O SertãoCast nasceu para dar voz ao que pulsa no interior do Brasil e conectar essa energia ao mundo digital. Somos um estúdio, um podcast e um ponto de encontro para quem quer contar, ouvir e criar histórias que fazem sentido.
          </p>
          <p className="mt-4 text-[#A7F3D0]/80 leading-relaxed">
            Da literatura de cordel ao lo-fi eletrônico, do causo de boteco ao debate cultural — trazemos convidados que refletem a diversidade do sertão contemporâneo.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="grain-card neon-border rounded-2xl overflow-hidden aspect-[4/5]">
            <img src="https://images.unsplash.com/photo-1668537338628-85b9970bf17f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwc3R1ZGlvJTIwbWljcm9waG9uZSUyMG5lb24lMjBuZW9uJTIwZ3JlZW4lMjBsaWdodGluZyUyMHJhZGlvJTIwYnJvYWRjYXN0JTIwaG9zdCUyMG1pY3JvcGhvbmV8ZW58MHx8fHwxNzg4OTc4MzcxfDA&ixlib=rb-4.1.0&q=85" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-display font-black text-3xl lg:text-4xl text-white mb-8">Quem tá no <span className="neon-text">microfone</span></h2>
        <div className="grid md:grid-cols-2 gap-6">
          {HOSTS.map((h) => (
            <div key={h.name} className="grain-card neon-border rounded-2xl p-8" data-testid={`host-${h.name.split(' ')[0].toLowerCase()}`}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4ade80] to-[#06b6d4] flex items-center justify-center font-display font-black text-2xl text-[#052e16] mb-5">
                {h.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="font-display font-bold text-xl text-white">{h.name}</div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mt-1 mb-4">{h.role}</div>
              <p className="text-sm text-[#A7F3D0]/85 leading-relaxed">{h.bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display font-black text-3xl lg:text-4xl text-white mb-8">Setup do <span className="neon-text">estúdio</span></h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GEAR.map((g) => (
            <div key={g.name} className="grain-card neon-border rounded-2xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[rgba(74,222,128,0.1)] flex items-center justify-center flex-shrink-0">
                <g.icon className="w-5 h-5 text-[#4ade80]" />
              </div>
              <div>
                <div className="font-display font-bold text-white">{g.name}</div>
                <div className="text-xs font-mono text-[#6EE7B7] mt-1">{g.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
