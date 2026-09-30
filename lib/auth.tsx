"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { API } from "./api";
type U = { name: string; email: string; phone: string };
const C = createContext<any>(null);
export const useAuth = () => useContext(C);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<U | null>(null); const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = localStorage.getItem("tk");
    if (!t) { setReady(true); return; }
    fetch(API + "/api/auth/me", { headers: { Authorization: "Bearer " + t } }).then(r => (r.ok ? r.json() : null))
      .then(u => { setUser(u); if (!u) localStorage.removeItem("tk"); }).catch(() => {}).finally(() => setReady(true));
  }, []);
  async function auth(mode: string, body: any) {
    const r = await fetch(API + "/api/auth/" + mode, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json(); if (!r.ok) throw new Error(d.error);
    localStorage.setItem("tk", d.token); setUser(d.user);
  }
  const logout = () => { localStorage.removeItem("tk"); setUser(null); };
  return <C.Provider value={{ user, ready, auth, logout }}>{children}</C.Provider>;
}
