import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, Clock, Check, Mic2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "../lib/api";

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
const EQUIPMENT = [
  { id: "mics_extra", label: "Mics extras (Shure SM7B)" },
  { id: "cam_4k", label: "Câmeras 4K (video podcast)" },
  { id: "streaming", label: "Streaming ao vivo (RTMP)" },
  { id: "mixing", label: "Mixagem multi-track" },
  { id: "lighting", label: "Iluminação cênica neon" },
];

function nextDays(count = 21) {
  const arr = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    arr.push(d);
  }
  return arr;
}

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Booking() {
  const days = useMemo(() => nextDays(21), []);
  const [selectedDate, setSelectedDate] = useState(fmtDate(days[0]));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booked, setBooked] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", podcast_name: "", duration_hours: 2, notes: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    api.get(`/bookings/availability`, { params: { date: selectedDate } })
      .then((r) => setBooked(r.data.booked_slots || []))
      .catch(() => setBooked([]));
    setSelectedSlot(null);
  }, [selectedDate]);

  const toggleEq = (id) => setEquipment((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const submit = async () => {
    if (!selectedSlot) { toast.error("Escolha um horário disponível"); return; }
    if (!form.name || !form.email || !form.phone || !form.podcast_name) { toast.error("Preencha os campos obrigatórios"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/bookings", {
        ...form,
        date: selectedDate,
        time_slot: selectedSlot,
        duration_hours: Number(form.duration_hours),
        equipment,
      });
      setSuccess(data);
      toast.success("Reserva confirmada! 🎙️");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Erro ao reservar");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="grain-card neon-border rounded-3xl p-10 text-center" data-testid="booking-success-message">
          <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-br from-[#4ade80] to-[#06b6d4] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(74,222,128,0.5)]">
            <Check className="w-10 h-10 text-[#052e16]" strokeWidth={3} />
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Reserva confirmada automaticamente</div>
          <h2 className="font-display font-black text-3xl text-white mb-3">Cabine reservada, {success.name.split(" ")[0]}! 🎙️</h2>
          <p className="text-[#A7F3D0] mb-6">Estamos te esperando no dia <b className="text-white">{new Date(success.date + 'T12:00').toLocaleDateString("pt-BR")}</b> às <b className="text-white">{success.time_slot}</b>.</p>
          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            <InfoBox label="Podcast" value={success.podcast_name} />
            <InfoBox label="Duração" value={`${success.duration_hours}h`} />
            <InfoBox label="ID" value={success.id.slice(-6).toUpperCase()} />
          </div>
          <button onClick={() => { setSuccess(null); setSelectedSlot(null); setEquipment([]); setForm({ name: "", email: "", phone: "", podcast_name: "", duration_hours: 2, notes: "" }); }} className="mt-8 btn-ghost-neon px-6 py-3 rounded-xl" data-testid="booking-new-button">
            Fazer nova reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Reserva instantânea</div>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white">Agende sua <span className="neon-text">cabine</span></h1>
        <p className="mt-4 text-[#A7F3D0] max-w-2xl">Escolha data, horário e equipamentos. Confirmação automática — sem espera.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Date */}
          <Section icon={CalendarIcon} title="1. Escolha a data">
            <div className="flex gap-2 overflow-x-auto scrollbar-neon pb-2" data-testid="booking-date-picker">
              {days.map((d) => {
                const iso = fmtDate(d);
                const active = iso === selectedDate;
                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedDate(iso)}
                    data-testid={`booking-date-${iso}`}
                    className={`flex-shrink-0 w-20 py-3 rounded-xl border transition-all ${
                      active ? "bg-[#4ade80] text-[#052e16] border-[#4ade80] shadow-[0_0_25px_rgba(74,222,128,0.4)]" : "bg-[#0B100C] text-[#A7F3D0] border-[rgba(74,222,128,0.2)] hover:border-[#4ade80]"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase">{d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}</div>
                    <div className="font-display font-black text-2xl">{d.getDate()}</div>
                    <div className="font-mono text-[10px] uppercase">{d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Time */}
          <Section icon={Clock} title="2. Selecione o horário">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {TIME_SLOTS.map((t) => {
                const isBooked = booked.includes(t);
                const active = selectedSlot === t;
                return (
                  <button
                    key={t}
                    onClick={() => !isBooked && setSelectedSlot(t)}
                    disabled={isBooked}
                    data-testid={`booking-time-slot-${t.replace(":", "")}`}
                    className={`py-3 rounded-lg font-mono text-sm border transition-all ${
                      isBooked
                        ? "bg-[#141C15]/50 text-[#34D399]/40 border-[rgba(74,222,128,0.1)] line-through cursor-not-allowed"
                        : active
                        ? "bg-[#4ade80] text-[#052e16] border-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.4)]"
                        : "bg-[#0B100C] text-[#A7F3D0] border-[rgba(74,222,128,0.25)] hover:border-[#4ade80]"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Equipment */}
          <Section icon={Mic2} title="3. Equipamentos extras">
            <div className="grid sm:grid-cols-2 gap-2">
              {EQUIPMENT.map((e) => {
                const active = equipment.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => toggleEq(e.id)}
                    data-testid={`booking-equipment-${e.id}`}
                    className={`text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                      active ? "border-[#4ade80] bg-[rgba(74,222,128,0.08)]" : "border-[rgba(74,222,128,0.2)] hover:border-[rgba(74,222,128,0.5)]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${active ? "bg-[#4ade80] border-[#4ade80]" : "border-[#6EE7B7]"}`}>
                      {active && <Check className="w-3 h-3 text-[#052e16]" strokeWidth={3} />}
                    </div>
                    <span className="text-sm text-white">{e.label}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Contact */}
          <Section icon={Sparkles} title="4. Seus dados">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nome completo *" testid="booking-name-input" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Email *" type="email" testid="booking-email-input" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Telefone *" testid="booking-phone-input" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Nome do podcast *" testid="booking-podcast-input" value={form.podcast_name} onChange={(v) => setForm({ ...form, podcast_name: v })} />
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#6EE7B7] mb-2">Duração (horas)</div>
                <select
                  data-testid="booking-duration-select"
                  value={form.duration_hours}
                  onChange={(e) => setForm({ ...form, duration_hours: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none"
                >
                  {[1, 2, 3, 4].map((h) => <option key={h} value={h}>{h}h</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#6EE7B7] mb-2">Observações</div>
                <textarea
                  data-testid="booking-notes-input"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none resize-none"
                  placeholder="Convidados, formato, referências..."
                />
              </div>
            </div>
          </Section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 grain-card neon-border rounded-2xl p-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-4">// Resumo</div>
            <SummaryRow label="Data" value={new Date(selectedDate + 'T12:00').toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} />
            <SummaryRow label="Horário" value={selectedSlot || "—"} />
            <SummaryRow label="Duração" value={`${form.duration_hours}h`} />
            <SummaryRow label="Equipamentos" value={equipment.length ? `${equipment.length} extras` : "Padrão"} />
            <div className="border-t border-[rgba(74,222,128,0.15)] my-4" />
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-[#A7F3D0]">Total</span>
              <span className="font-display font-black text-2xl neon-text">Grátis*</span>
            </div>
            <button
              onClick={submit}
              disabled={loading}
              data-testid="booking-submit-button"
              className="btn-neon w-full py-4 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Confirmar Reserva</>}
            </button>
            <div className="text-[10px] text-center font-mono text-[#6EE7B7] mt-4">*Demonstração — aprovação automática</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="grain-card neon-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[rgba(74,222,128,0.1)] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#4ade80]" />
        </div>
        <h3 className="font-display font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", testid }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-[#6EE7B7] mb-2">{label}</div>
      <input
        data-testid={testid}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none placeholder:text-[#34D399]/50"
      />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-mono uppercase text-[#6EE7B7]">{label}</span>
      <span className="text-sm text-white font-medium text-right">{value}</span>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="neon-border rounded-xl py-3 px-4 bg-[#0B100C]">
      <div className="font-mono text-[10px] uppercase text-[#6EE7B7]">{label}</div>
      <div className="text-white font-bold text-sm mt-1">{value}</div>
    </div>
  );
}
