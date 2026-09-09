import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Episodes from "@/pages/Episodes";
import About from "@/pages/About";
import Booking from "@/pages/Booking";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { AuthProvider } from "@/lib/auth";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/episodios" element={<Episodes />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/agendar" element={<Booking />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: "#0B100C", border: "1px solid rgba(74, 222, 128, 0.3)", color: "#F0FDF4" } }} />
      </AuthProvider>
    </div>
  );
}

export default App;
