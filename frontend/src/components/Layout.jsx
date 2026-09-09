import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PlayerBar from "./PlayerBar";
import { createContext, useContext, useState } from "react";

const PlayerCtx = createContext(null);
export const usePlayer = () => useContext(PlayerCtx);

export default function Layout() {
  const [current, setCurrent] = useState(null);
  return (
    <PlayerCtx.Provider value={{ current, play: setCurrent, stop: () => setCurrent(null) }}>
      <Navbar />
      <main className="pb-24">
        <Outlet />
      </main>
      <Footer />
      <PlayerBar episode={current} onClose={() => setCurrent(null)} />
    </PlayerCtx.Provider>
  );
}
