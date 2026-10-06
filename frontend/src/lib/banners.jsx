import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";

const BannersContext = createContext({ banners: {}, refresh: () => {} });

export function BannersProvider({ children }) {
  const [banners, setBanners] = useState({});

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/banners");
      const map = {};
      data.forEach((b) => { map[b.name] = b; });
      setBanners(map);
    } catch {
      /* fail silently */
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <BannersContext.Provider value={{ banners, refresh }}>
      {children}
    </BannersContext.Provider>
  );
}

export const useBanners = () => useContext(BannersContext);
