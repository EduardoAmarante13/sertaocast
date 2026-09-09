import { useState } from "react";
import { Mail, Instagram, Phone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "../lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "Parceria", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Preencha nome, email e mensagem"); return; }
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Mensagem enviada! Vamos responder em breve.");
      setForm({ name: "", email: "", subject: "Parceria", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Erro ao enviar");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5">
        <div className="font-mono text-xs uppercase tracking-widest text-[#4ade80] mb-3">// Fala com a gente</div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight">Contato</h1>
        <p className="mt-4 text-[#A7F3D0] leading-relaxed">Parcerias, convidados, imprensa ou só um oi — a caixa tá aberta.</p>

        <div className="mt-10 space-y-4">
          <ContactItem icon={Mail} label="Email" value="contato@sertaocast.com.br" />
          <ContactItem icon={Instagram} label="Instagram" value="@sertaocast" />
          <ContactItem icon={Phone} label="WhatsApp" value="+55 (88) 9 8888-8888" />
        </div>
      </div>

      <form onSubmit={submit} className="lg:col-span-7 grain-card neon-border rounded-2xl p-6 lg:p-8 space-y-4">
        <FormField label="Nome" testid="contact-name-input" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <FormField label="Email" type="email" testid="contact-email-input" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#6EE7B7] mb-2">Assunto</div>
          <select
            data-testid="contact-subject-select"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none"
          >
            {["Parceria", "Ser convidado", "Imprensa", "Publicidade", "Outros"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#6EE7B7] mb-2">Mensagem</div>
          <textarea
            data-testid="contact-message-input"
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none resize-none"
            placeholder="Conta pra gente..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          data-testid="contact-submit-button"
          className="btn-neon w-full py-4 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Enviar mensagem</>}
        </button>
      </form>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl neon-border bg-[#0B100C]/60">
      <div className="w-10 h-10 rounded-lg bg-[rgba(74,222,128,0.1)] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#4ade80]" />
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase text-[#6EE7B7]">{label}</div>
        <div className="text-white text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text", testid }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-[#6EE7B7] mb-2">{label}</div>
      <input
        data-testid={testid}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none"
      />
    </div>
  );
}
