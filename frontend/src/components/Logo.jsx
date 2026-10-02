export default function Logo({ size = 40, showText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative rounded-xl overflow-hidden shadow-[0_0_25px_rgba(74,222,128,0.45)]"
        style={{ width: size, height: size }}
      >
        <img src="/logo.png" alt="SertãoCast" className="w-full h-full object-cover" />
      </div>
      {showText && (
        <div className="leading-none">
          <div className="font-display font-black text-lg tracking-tight text-white">
            SERTÃO<span className="neon-text">CAST</span>
          </div>
          <div className="font-mono text-[10px] text-[#6EE7B7] mt-0.5 flex items-center gap-1.5">
            <span className="pulse-dot"></span> NO AR
          </div>
        </div>
      )}
    </div>
  );
}
