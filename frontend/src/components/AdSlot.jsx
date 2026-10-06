import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useBanners } from "../lib/banners";

const CLIENT_ID = "ca-pub-8008965155132653";

/**
 * AdSlot — Google AdSense display unit.
 *
 * Usage:
 *   <AdSlot name="home-in-article" />                           // uses backend config
 *   <AdSlot name="news-in-feed" layout="in-feed" layoutKey="..." format="fluid" />
 *   <AdSlot slot="1234567890" />                                // hardcoded slot (fallback)
 *
 * Admin can edit each named placement's slot_id from /admin/dashboard → Banners.
 */
export default function AdSlot({
  name,
  slot: slotOverride,
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
  const { banners } = useBanners();

  const banner = name ? banners[name] : null;
  const resolvedSlot = slotOverride || banner?.slot_id || "";
  const enabled = slotOverride ? true : banner ? banner.enabled !== false : true;

  useEffect(() => {
    if (!resolvedSlot || !enabled) return;
    try {
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) { /* adblock or script not loaded */ }
  }, [resolvedSlot, enabled, location.pathname]);

  if (!enabled) return null;

  if (!resolvedSlot) {
    return (
      <div
        data-testid={testid || `ad-placeholder-${name || "generic"}`}
        className={`relative rounded-2xl neon-border grain-card p-6 text-center ${className}`}
        style={style}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#4ade80] mb-1">
          // Espaço publicitário{banner?.description ? ` — ${banner.description}` : ""}
        </div>
        <div className="text-sm text-[#A7F3D0]">
          {name
            ? <>Configure o <b>slot ID</b> deste banner em <b>Admin → Banners</b>.</>
            : "Habilite Auto Ads no painel do AdSense para preencher automaticamente."}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style} data-testid={testid || `ad-slot-${resolvedSlot}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", ...(style || {}) }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
