import GearList from "../components/GearList";
import HostList from "../components/HostList";
import AdSlot from "../components/AdSlot";

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
        <HostList />
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
