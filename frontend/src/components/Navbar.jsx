import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

const NAV = [
  { to: "/", label: "Home", tid: "nav-home-link" },
  { to: "/episodios", label: "Episódios", tid: "nav-episodes-link" },
  { to: "/noticias", label: "Notícias", tid: "nav-news-link" },
  { to: "/sobre", label: "Sobre", tid: "nav-about-link" },
  { to: "/agendar", label: "Agendar Sala", tid: "nav-booking-link" },
  { to: "/contato", label: "Contato", tid: "nav-contact-link" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-40 glass border-b border-[rgba(74,222,128,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo">
          <Logo size={44} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={n.tid}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "text-[#4ade80] bg-[rgba(74,222,128,0.08)]" : "text-[#A7F3D0] hover:text-[#4ade80] hover:bg-[rgba(74,222,128,0.05)]"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/admin" data-testid="nav-admin-link" className={({isActive}) => `ml-2 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${isActive ? 'text-[#4ade80]' : 'text-[#6EE7B7] hover:text-[#4ade80]'}`}>Admin</NavLink>
          <Link to="/agendar" data-testid="nav-cta-book" className="ml-3 btn-neon px-5 py-2.5 rounded-lg text-sm">Agendar Agora</Link>
        </nav>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen(!open)}
          className="lg:hidden text-[#4ade80] p-2"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[rgba(74,222,128,0.15)] px-4 py-4 space-y-1 bg-[#070A07]">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              data-testid={`m-${n.tid}`}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium ${isActive ? "text-[#4ade80] bg-[rgba(74,222,128,0.08)]" : "text-[#A7F3D0]"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/admin" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-[#6EE7B7]">Admin</NavLink>
          <Link to="/agendar" onClick={() => setOpen(false)} className="block btn-neon text-center py-3 rounded-lg mt-3">Agendar Agora</Link>
        </div>
      )}
    </header>
  );
}
