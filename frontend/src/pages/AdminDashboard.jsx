import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, X, Calendar, Mic, MessageSquare, PlayCircle, TrendingUp, Loader2, Newspaper, ExternalLink, Wrench, Megaphone, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { api, formatApiErrorDetail } from "../lib/api";
import { useBanners } from "../lib/banners";
import { GEAR_ICON_OPTIONS, GearIcon } from "../components/GearList";

export default function AdminDashboard() {
  const { user, logout, checking } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("news");
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [news, setNews] = useState([]);
  const [gear, setGear] = useState([]);
  const { banners, refresh: refreshBanners } = useBanners();
  const [showEpModal, setShowEpModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showGearModal, setShowGearModal] = useState(false);

  useEffect(() => {
    if (checking) return;
    if (!user) nav("/admin", { replace: true });
  }, [user, checking, nav]);

  const load = async () => {
    try {
      const [s, b, e, m, n, g] = await Promise.all([
        api.get("/stats"),
        api.get("/bookings"),
        api.get("/episodes"),
        api.get("/contact"),
        api.get("/news"),
        api.get("/gear"),
      ]);
      setStats(s.data); setBookings(b.data); setEpisodes(e.data); setMessages(m.data); setNews(n.data); setGear(g.data);
      refreshBanners();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Erro ao carregar");
    }
  };
  useEffect(() => { if (user) load(); }, [user]);

  const cancelBooking = async (id) => {
    try { await api.patch(`/bookings/${id}/cancel`); toast.success("Cancelada"); load(); }
    catch { toast.error("Erro ao cancelar"); }
  };
  const deleteBooking = async (id) => {
    try { await api.delete(`/bookings/${id}`); toast.success("Excluída"); load(); }
    catch { toast.error("Erro ao excluir"); }
  };
  const deleteEpisode = async (id) => {
    if (!confirm("Excluir este episódio?")) return;
    try { await api.delete(`/episodes/${id}`); toast.success("Episódio excluído"); load(); }
    catch { toast.error("Erro ao excluir"); }
  };
  const deleteNews = async (id) => {
    if (!confirm("Excluir esta notícia?")) return;
    try { await api.delete(`/news/${id}`); toast.success("Notícia excluída"); load(); }
    catch { toast.error("Erro ao excluir"); }
  };
  const deleteGear = async (id) => {
    if (!confirm("Excluir este equipamento?")) return;
    try { await api.delete(`/gear/${id}`); toast.success("Equipamento excluído"); load(); }
    catch { toast.error("Erro ao excluir"); }
  };
  const saveBanner = async (name, slot_id, enabled) => {
    try {
      await api.put(`/banners/${name}`, { slot_id: slot_id || "", enabled });
      toast.success("Banner salvo");
      refreshBanners();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Erro ao salvar");
    }
  };

  if (checking || !user) return <div className="p-20 text-center text-[#4ade80]"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-2">// Command Center</div>
          <h1 className="font-display font-black text-3xl lg:text-4xl text-white">Painel Admin</h1>
          <p className="text-sm text-[#6EE7B7] mt-1">Logado como {user.email}</p>
        </div>
        <button onClick={() => { logout(); nav("/admin"); }} data-testid="admin-logout-button" className="btn-ghost-neon px-5 py-2.5 rounded-xl inline-flex items-center gap-2 self-start">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Newspaper} label="Notícias" value={stats.total_news ?? 0} />
          <StatCard icon={Mic} label="Episódios" value={stats.total_episodes} />
          <StatCard icon={Wrench} label="Equipamentos" value={stats.total_gear ?? 0} />
          <StatCard icon={Calendar} label="Reservas (leads)" value={stats.confirmed_bookings} />
          <StatCard icon={MessageSquare} label="Mensagens" value={stats.total_messages} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[rgba(74,222,128,0.15)] overflow-x-auto scrollbar-neon">
        <TabBtn active={tab === "news"} onClick={() => setTab("news")} tid="admin-tab-news">Notícias</TabBtn>
        <TabBtn active={tab === "episodes"} onClick={() => setTab("episodes")} tid="admin-tab-episodes">Episódios</TabBtn>
        <TabBtn active={tab === "gear"} onClick={() => setTab("gear")} tid="admin-tab-gear">Equipamentos</TabBtn>
        <TabBtn active={tab === "bookings"} onClick={() => setTab("bookings")} tid="admin-tab-bookings">Reservas</TabBtn>
        <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} tid="admin-tab-messages">Mensagens</TabBtn>
        <TabBtn active={tab === "banners"} onClick={() => setTab("banners")} tid="admin-tab-banners">Banners</TabBtn>
      </div>

      {/* Content */}
      {tab === "bookings" && (
        <div className="grain-card neon-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#0B100C] text-left">
              <tr className="text-[#6EE7B7] font-mono text-[11px] uppercase">
                <th className="px-4 py-3">Podcast</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Data / Hora</th>
                <th className="px-4 py-3">Duração</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#6EE7B7]" data-testid="bookings-empty">Nenhuma reserva ainda</td></tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-[rgba(74,222,128,0.1)] hover:bg-[rgba(74,222,128,0.03)]" data-testid={`booking-row-${b.id}`}>
                  <td className="px-4 py-3 text-white font-medium">{b.podcast_name}</td>
                  <td className="px-4 py-3 text-[#A7F3D0]"><div>{b.name}</div><div className="text-xs text-[#6EE7B7]">{b.email}</div></td>
                  <td className="px-4 py-3 text-[#A7F3D0] font-mono text-xs">{new Date(b.date + 'T12:00').toLocaleDateString("pt-BR")} • {b.time_slot}</td>
                  <td className="px-4 py-3 text-[#A7F3D0]">{b.duration_hours}h</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase ${b.status === "confirmed" ? "bg-[rgba(74,222,128,0.15)] text-[#4ade80]" : "bg-[rgba(245,158,11,0.15)] text-[#f59e0b]"}`}>{b.status === "confirmed" ? "confirmada" : "cancelada"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {b.status === "confirmed" && (
                      <button onClick={() => cancelBooking(b.id)} data-testid={`admin-cancel-booking-${b.id}`} className="text-xs text-[#f59e0b] hover:underline mr-3">Cancelar</button>
                    )}
                    <button onClick={() => deleteBooking(b.id)} data-testid={`admin-delete-booking-${b.id}`} className="text-[#ef4444] hover:text-red-400">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "episodes" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowEpModal(true)} data-testid="admin-add-episode-button" className="btn-neon px-5 py-2.5 rounded-xl inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Novo Episódio
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((e) => (
              <div key={e.id} className="grain-card neon-border rounded-2xl p-5" data-testid={`admin-episode-${e.episode_number}`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[10px] px-2 py-1 rounded bg-[rgba(74,222,128,0.15)] text-[#4ade80] uppercase">EP #{e.episode_number}</span>
                  <button onClick={() => deleteEpisode(e.id)} data-testid={`admin-delete-episode-${e.id}`} className="text-[#ef4444] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <h4 className="font-display font-bold text-white mb-2">{e.title}</h4>
                <div className="text-xs font-mono text-[#6EE7B7]">{e.category} • {e.duration} • {e.plays} plays</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="grain-card neon-border rounded-2xl divide-y divide-[rgba(74,222,128,0.1)]">
          {messages.length === 0 ? (
            <div className="p-12 text-center text-[#6EE7B7]" data-testid="messages-empty">Nenhuma mensagem</div>
          ) : messages.map((m) => (
            <div key={m.id} className="p-5" data-testid={`admin-message-${m.id}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-white">{m.name}</div>
                  <div className="text-xs text-[#6EE7B7]">{m.email} • {m.subject}</div>
                </div>
                <span className="font-mono text-[10px] text-[#34D399]">{new Date(m.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
              <p className="text-sm text-[#A7F3D0] mt-2 whitespace-pre-line">{m.message}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "news" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowNewsModal(true)} data-testid="admin-add-news-button" className="btn-neon px-5 py-2.5 rounded-xl inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nova Notícia
            </button>
          </div>
          {news.length === 0 ? (
            <div className="grain-card neon-border rounded-2xl p-12 text-center text-[#6EE7B7]" data-testid="admin-news-empty">
              <Newspaper className="w-10 h-10 text-[#4ade80] mx-auto mb-3" />
              Cadastre a primeira notícia do SertãoCast.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((n) => (
                <div key={n.id} className="grain-card neon-border rounded-2xl overflow-hidden" data-testid={`admin-news-${n.id}`}>
                  <div className="relative aspect-[16/9] bg-[#0B100C]">
                    {n.image_url ? (
                      <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-[#4ade80]/40" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 font-mono text-[9px] px-2 py-0.5 rounded bg-[rgba(74,222,128,0.15)] text-[#4ade80] uppercase">{n.category}</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-bold text-white mb-1 text-sm leading-snug line-clamp-2">{n.title}</h4>
                    <div className="text-[11px] font-mono text-[#6EE7B7] mb-3">{new Date(n.published_at).toLocaleDateString("pt-BR")}{n.source_name ? ` • ${n.source_name}` : ""}</div>
                    <div className="flex justify-between items-center">
                      {n.source_url ? (
                        <a href={n.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4ade80] hover:text-white inline-flex items-center gap-1">
                          Abrir link <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span />}
                      <button onClick={() => deleteNews(n.id)} data-testid={`admin-delete-news-${n.id}`} className="text-[#ef4444] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showEpModal && <EpisodeModal onClose={() => setShowEpModal(false)} onSaved={() => { setShowEpModal(false); load(); }} />}
      {showNewsModal && <NewsModal onClose={() => setShowNewsModal(false)} onSaved={() => { setShowNewsModal(false); load(); }} />}
      {showGearModal && <GearModal onClose={() => setShowGearModal(false)} onSaved={() => { setShowGearModal(false); load(); }} />}

      {tab === "gear" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowGearModal(true)} data-testid="admin-add-gear-button" className="btn-neon px-5 py-2.5 rounded-xl inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Novo Equipamento
            </button>
          </div>
          {gear.length === 0 ? (
            <div className="grain-card neon-border rounded-2xl p-12 text-center" data-testid="admin-gear-empty">
              <Wrench className="w-10 h-10 text-[#4ade80] mx-auto mb-3" />
              <div className="text-[#A7F3D0]">Cadastre os microfones, câmeras, mesas e luzes do estúdio.</div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gear.map((g) => (
                <div key={g.id} className="grain-card neon-border rounded-2xl p-5 flex items-start gap-4" data-testid={`admin-gear-${g.id}`}>
                  <div className="w-10 h-10 rounded-xl bg-[rgba(74,222,128,0.1)] flex items-center justify-center flex-shrink-0">
                    <GearIcon name={g.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-white truncate">{g.name}</div>
                    {g.note && <div className="text-xs font-mono text-[#6EE7B7] mt-1">{g.note}</div>}
                  </div>
                  <button onClick={() => deleteGear(g.id)} data-testid={`admin-delete-gear-${g.id}`} className="text-[#ef4444] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "banners" && (
        <div className="space-y-4">
          <div className="grain-card neon-border rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Megaphone className="w-5 h-5 text-[#4ade80] mt-1 flex-shrink-0" />
              <div className="text-sm text-[#A7F3D0] leading-relaxed">
                Configure o <b>Slot ID</b> de cada placement do Google AdSense. Deixe o campo vazio para mostrar um espaço reservado neutro no site. Enquanto não aprovado, o Google ainda registra impressões para avaliação. Para máximo retorno automático, ative <b className="text-white">Auto Ads</b> no painel do AdSense.
              </div>
            </div>
          </div>
          {Object.values(banners).map((b) => (
            <BannerRow key={b.name} banner={b} onSave={saveBanner} />
          ))}
        </div>
      )}
    </div>
  );
}

function BannerRow({ banner, onSave }) {
  const [slotId, setSlotId] = useState(banner.slot_id || "");
  const [enabled, setEnabled] = useState(banner.enabled !== false);

  return (
    <div className="grain-card neon-border rounded-2xl p-5 grid md:grid-cols-12 gap-3 items-end" data-testid={`admin-banner-${banner.name}`}>
      <div className="md:col-span-5">
        <div className="font-mono text-[10px] uppercase text-[#4ade80] mb-1">{banner.name}</div>
        <div className="font-display font-bold text-white">{banner.description}</div>
      </div>
      <div className="md:col-span-4">
        <label className="text-xs font-mono uppercase text-[#6EE7B7] mb-1 block">Slot ID</label>
        <input
          value={slotId}
          onChange={(e) => setSlotId(e.target.value)}
          placeholder="ex: 1234567890"
          data-testid={`admin-banner-slot-${banner.name}`}
          className="w-full px-3 py-2.5 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white font-mono text-sm focus:border-[#4ade80] focus:outline-none"
        />
      </div>
      <div className="md:col-span-1 flex items-center gap-2">
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} data-testid={`admin-banner-enabled-${banner.name}`} className="sr-only peer" />
          <div className="w-11 h-6 bg-[#141C15] rounded-full peer-checked:bg-[#4ade80] relative transition-colors">
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? "translate-x-5" : ""}`} />
          </div>
        </label>
      </div>
      <div className="md:col-span-2">
        <button
          onClick={() => onSave(banner.name, slotId, enabled)}
          data-testid={`admin-banner-save-${banner.name}`}
          className="btn-neon w-full py-2.5 rounded-xl inline-flex items-center justify-center gap-2 text-sm"
        >
          <Save className="w-4 h-4" /> Salvar
        </button>
      </div>
    </div>
  );
}

function GearModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", note: "", icon: "mic2" });
  const [loading, setLoading] = useState(false);
  const save = async () => {
    if (!form.name) { toast.error("Preencha o nome"); return; }
    setLoading(true);
    try { await api.post("/gear", form); toast.success("Equipamento cadastrado"); onSaved(); }
    catch (err) { toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Erro"); }
    finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="grain-card neon-border rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-bold text-xl text-white">Novo Equipamento</h3>
          <button onClick={onClose} className="text-[#6EE7B7]"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <ModalField label="Nome *" placeholder="Ex: Microfone Shure SM7B" testid="gear-name-input" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <ModalField label="Observação" placeholder="Ex: 4 unidades" testid="gear-note-input" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
          <div>
            <label className="text-xs font-mono uppercase text-[#6EE7B7] mb-1 block">Ícone</label>
            <div className="grid grid-cols-5 gap-2">
              {GEAR_ICON_OPTIONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setForm({ ...form, icon: ic })}
                  data-testid={`gear-icon-${ic}`}
                  className={`aspect-square rounded-lg flex items-center justify-center border transition-colors ${form.icon === ic ? "bg-[rgba(74,222,128,0.15)] border-[#4ade80]" : "border-[rgba(74,222,128,0.2)] hover:border-[#4ade80]"}`}
                >
                  <GearIcon name={ic} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={save} disabled={loading} data-testid="gear-save-button" className="btn-neon w-full mt-6 py-3 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Cadastrar</>}
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="grain-card neon-border rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[rgba(74,222,128,0.1)] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#4ade80]" />
        </div>
        <div className="font-mono text-[10px] uppercase text-[#6EE7B7]">{label}</div>
      </div>
      <div className="font-display font-black text-3xl text-white">{value}</div>
    </div>
  );
}

function TabBtn({ children, active, onClick, tid }) {
  return (
    <button
      onClick={onClick}
      data-testid={tid}
      className={`px-5 py-3 font-medium text-sm -mb-px border-b-2 transition-colors ${
        active ? "border-[#4ade80] text-[#4ade80]" : "border-transparent text-[#A7F3D0] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function EpisodeModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: "", description: "", category: "cultura", duration: "", cover_url: "", host: "SertãoCast" });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!form.title || !form.description || !form.duration) { toast.error("Preencha todos os campos obrigatórios"); return; }
    setLoading(true);
    try {
      await api.post("/episodes", form);
      toast.success("Episódio criado!");
      onSaved();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Erro ao criar");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="grain-card neon-border rounded-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-bold text-xl text-white">Novo Episódio</h3>
          <button onClick={onClose} className="text-[#6EE7B7]"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <ModalField label="Título *" testid="ep-title-input" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div>
            <label className="text-xs font-mono uppercase text-[#6EE7B7] mb-1 block">Descrição *</label>
            <textarea data-testid="ep-desc-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase text-[#6EE7B7] mb-1 block">Categoria</label>
              <select data-testid="ep-cat-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none">
                {["cultura", "musica", "humor", "entrevistas", "negocios"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <ModalField label="Duração *" placeholder="48:12" testid="ep-duration-input" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
          </div>
          <ModalField label="URL da capa" testid="ep-cover-input" value={form.cover_url} onChange={(v) => setForm({ ...form, cover_url: v })} />
        </div>
        <button onClick={save} disabled={loading} data-testid="ep-save-button" className="btn-neon w-full mt-6 py-3 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Criar Episódio</>}
        </button>
      </div>
    </div>
  );
}

function ModalField({ label, value, onChange, testid, placeholder }) {
  return (
    <div>
      <label className="text-xs font-mono uppercase text-[#6EE7B7] mb-1 block">{label}</label>
      <input data-testid={testid} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none" />
    </div>
  );
}

function NewsModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: "", summary: "", image_url: "", source_url: "", source_name: "", category: "geral" });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!form.title || !form.summary) { toast.error("Preencha título e resumo"); return; }
    setLoading(true);
    try {
      await api.post("/news", form);
      toast.success("Notícia cadastrada!");
      onSaved();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Erro ao cadastrar");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="grain-card neon-border rounded-2xl p-6 max-w-lg w-full my-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-bold text-xl text-white">Nova Notícia</h3>
          <button onClick={onClose} className="text-[#6EE7B7]"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <ModalField label="Título *" testid="news-title-input" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div>
            <label className="text-xs font-mono uppercase text-[#6EE7B7] mb-1 block">Resumo *</label>
            <textarea data-testid="news-summary-input" rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none resize-none" />
          </div>
          <ModalField label="URL da imagem" placeholder="https://..." testid="news-image-input" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Fonte (nome)" placeholder="G1, Folha..." testid="news-source-name-input" value={form.source_name} onChange={(v) => setForm({ ...form, source_name: v })} />
            <div>
              <label className="text-xs font-mono uppercase text-[#6EE7B7] mb-1 block">Categoria</label>
              <select data-testid="news-cat-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none">
                {["geral", "cultura", "musica", "humor", "entrevistas", "negocios"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <ModalField label="Link de postagem (URL)" placeholder="https://..." testid="news-source-url-input" value={form.source_url} onChange={(v) => setForm({ ...form, source_url: v })} />
        </div>
        <button onClick={save} disabled={loading} data-testid="news-save-button" className="btn-neon w-full mt-6 py-3 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Publicar Notícia</>}
        </button>
      </div>
    </div>
  );
}
