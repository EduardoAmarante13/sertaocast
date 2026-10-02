import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const CLIENT_ID = "ca-pub-8008965155132653";

/**
 * AdSlot — Google AdSense display unit.
 *
 * Usage:
 *   <AdSlot slot="1234567890" />                         // responsive
 *   <AdSlot slot="1234567890" format="fluid" layout="in-article" />
 *   <AdSlot slot="1234567890" format="fluid" layout="in-feed" layoutKey="-6t+ed+2i-1n-4w" />
 *
 * NOTE:
 *   - Enable "Auto Ads" in your AdSense dashboard for maximum automatic earnings
 *     (no slot id needed — Google chooses placements automatically because the
 *     adsbygoogle.js script is already loaded in index.html).
 *   - For higher control & better CPM, create ad units in AdSense and pass their
 *     slot IDs via the `slot` prop below.
 */
export default function AdSlot({
  slot,
  format = "auto",
  layout,
  layoutKey,
  responsive = true,
  className = "",
  style,
  testid,
}) {
  const insRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!slot) return;
    try {
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Script might not have loaded yet (dev / blocker) — fail silently.
    }
  }, [slot, location.pathname]);

  // When no slot is configured, render a soft placeholder so the layout stays
  // consistent during development without triggering AdSense policy violations.
  if (!slot) {
    return (
      <div
        data-testid={testid || "ad-placeholder"}
        className={`relative rounded-2xl neon-border grain-card p-6 text-center ${className}`}
        style={style}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#4ade80] mb-1">
          // Espaço publicitário
        </div>
        <div className="text-sm text-[#A7F3D0]">
          Habilite <b>Auto Ads</b> no painel do Google AdSense para ocupar este slot automaticamente.
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style} data-testid={testid || `ad-slot-${slot}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", ...(style || {}) }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
