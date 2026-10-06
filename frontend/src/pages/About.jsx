import GearList from "../components/GearList";
import AdSlot from "../components/AdSlot";

const HOSTS = [
  { name: "Eduardo Guenov", role: "Host & Idealizador", bio: "Curador cultural, produtor e apaixonado pelo Nordeste. Comanda o SertãoCast desde o primeiro episódio." },
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
          <div className="grain-card neon-border rounded-2xl overflow-hidden aspect-[4/5] flex items-center justify-center p-10 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.18),transparent_70%)]">
            <img src="/logo.png" alt="SertãoCast" className="w-full max-w-[300px] drop-shadow-[0_0_40px_rgba(74,222,128,0.5)]" />
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

      <div className="mb-20">
        <AdSlot name="about-mid" format="fluid" layout="in-article" />
      </div>

      <div>
        <h2 className="font-display font-black text-3xl lg:text-4xl text-white mb-8">Setup do <span className="neon-text">estúdio</span></h2>
        <GearList emptyLabel="Em breve divulgaremos todos os equipamentos do estúdio" />
      </div>
    </div>
  );
}
