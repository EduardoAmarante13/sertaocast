import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Radio } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { formatApiErrorDetail } from "../lib/api";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) nav("/admin/dashboard", { replace: true });
  }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bem-vindo de volta!");
      nav("/admin/dashboard");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Falha no login");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto bg-gradient-to-br from-[#4ade80] to-[#06b6d4] flex items-center justify-center mb-4 shadow-[0_0_35px_rgba(74,222,128,0.5)]">
            <Radio className="w-7 h-7 text-[#052e16]" strokeWidth={2.5} />
          </div>
          <h1 className="font-display font-black text-3xl text-white">Painel Admin</h1>
          <p className="text-sm text-[#6EE7B7] mt-2 font-mono">// Acesso restrito</p>
        </div>

        <form onSubmit={submit} className="grain-card neon-border rounded-2xl p-8 space-y-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#6EE7B7] mb-2">Email</div>
            <input
              data-testid="admin-login-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none"
              required
            />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#6EE7B7] mb-2">Senha</div>
            <input
              data-testid="admin-login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0B100C] border border-[rgba(74,222,128,0.2)] text-white focus:border-[#4ade80] focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit-button"
            className="btn-neon w-full py-3.5 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4" /> Entrar</>}
          </button>
        </form>
      </div>
    </div>
  );
}
