"use client";
import { useState } from "react";
import { STATUSES } from "@/lib/shop";
import { API } from "@/lib/api";
export default function Track() {
  const [r, setR] = useState<any>(null); const [err, setErr] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setR(null);
    const q = new URLSearchParams(Object.fromEntries(new FormData(e.currentTarget)) as any);
    const res = await fetch(API + "/api/repairs?" + q); const d = await res.json();
    res.ok ? setR(d) : setErr(d.error);
  }
  return (<div className="w" style={{ padding: "40px 20px" }}><h1 style={{ fontSize: "2.2rem" }}>Track your repair</h1>
    <form className="f" onSubmit={go}>
      <label>Ticket number<input name="ticket" placeholder="SDM-XXXXX" required /></label>
      <label>Phone number<input name="phone" inputMode="numeric" required /></label>
      <button className="btn">Check status</button></form>
    {err && <p className="err" role="alert">{err}</p>}
    {r && <div style={{ marginTop: 24 }}><p>{r.brand} {r.model}: {r.issue}{r.estimate ? `. Estimate: ₹${r.estimate}` : ""}</p>
      <div className="steps">{STATUSES.map(s => <span key={s} className={s === r.status ? "on" : ""}>{s}</span>)}</div></div>}
  </div>);
}
