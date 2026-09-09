import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, X, Calendar, Mic, MessageSquare, PlayCircle, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { api, formatApiErrorDetail } from "../lib/api";

export default function AdminDashboard() {
  const { user, logout, checking } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("bookings");
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showEpModal, setShowEpModal] = useState(false);

  useEffect(() => {
    if (checking) return;
    if (!user) nav("/admin", { replace: true });
  }, [user, checking, nav]);

  const load = async () => {
    try {
      const [s, b, e, m] = await Promise.all([
        api.get("/stats"),
        api.get("/bookings"),
        api.get("/episodes"),
        api.get("/contact"),
      ]);
      setStats(s.data); setBookings(b.data); setEpisodes(e.data); setMessages(m.data);
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Calendar} label="Reservas ativas" value={stats.confirmed_bookings} />
          <StatCard icon={Mic} label="Episódios" value={stats.total_episodes} />
          <StatCard icon={PlayCircle} label="Total plays" value={stats.total_plays.toLocaleString("pt-BR")} />
          <StatCard icon={MessageSquare} label="Mensagens" value={stats.total_messages} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[rgba(74,222,128,0.15)]">
        <TabBtn active={tab === "bookings"} onClick={() => setTab("bookings")} tid="admin-tab-bookings">Agendamentos</TabBtn>
        <TabBtn active={tab === "episodes"} onClick={() => setTab("episodes")} tid="admin-tab-episodes">Episódios</TabBtn>
        <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} tid="admin-tab-messages">Mensagens</TabBtn>
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

      {showEpModal && <EpisodeModal onClose={() => setShowEpModal(false)} onSaved={() => { setShowEpModal(false); load(); }} />}
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
