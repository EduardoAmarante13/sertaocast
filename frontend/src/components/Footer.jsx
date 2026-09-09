import { Instagram, Youtube, Twitter, Radio } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[rgba(74,222,128,0.15)] bg-[#070A07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ade80] to-[#06b6d4] flex items-center justify-center">
              <Radio className="w-5 h-5 text-[#052e16]" strokeWidth={2.5} />
            </div>
            <div className="font-display font-black text-lg text-white">SERTÃO<span className="neon-text">CAST</span></div>
          </div>
          <p className="text-sm text-[#6EE7B7] leading-relaxed">A voz do Sertão na velocidade do streaming. Cultura, humor, música e entrevistas sem filtro.</p>
        </div>
        <div>
          <div className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">Explorar</div>
          <ul className="space-y-2 text-sm text-[#A7F3D0]">
            <li><a href="/episodios" className="hover:text-[#4ade80]">Episódios</a></li>
            <li><a href="/sobre" className="hover:text-[#4ade80]">Sobre</a></li>
            <li><a href="/agendar" className="hover:text-[#4ade80]">Agendar Sala</a></li>
            <li><a href="/contato" className="hover:text-[#4ade80]">Contato</a></li>
          </ul>
        </div>
        <div>
          <div className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">Estúdio</div>
          <ul className="space-y-2 text-sm text-[#A7F3D0]">
            <li>Microfones Shure SM7B</li>
            <li>Rødecaster Pro II</li>
            <li>Câmeras Sony Alpha 4K</li>
            <li>Iluminação neon customizada</li>
          </ul>
        </div>
        <div>
          <div className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">Siga</div>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-lg neon-border flex items-center justify-center text-[#4ade80] hover:text-white"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-lg neon-border flex items-center justify-center text-[#4ade80] hover:text-white"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-lg neon-border flex items-center justify-center text-[#4ade80] hover:text-white"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(74,222,128,0.1)] py-5 text-center text-xs font-mono text-[#34D399]">
        © 2026 SERTÃOCAST — Todos os direitos reservados
      </div>
    </footer>
  );
}
