"use client";
import { useState } from "react";
import { ISSUES, BRANDS, SHOP } from "@/lib/shop";
import { API } from "@/lib/api";
export default function Repair() {
  const [ticket, setTicket] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await fetch(API + "/api/repairs", { method: "POST", headers: { "Content-Type": "application/json", ...(localStorage.getItem("tk") ? { Authorization: "Bearer " + localStorage.getItem("tk") } : {}) }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
    const d = await res.json(); setBusy(false);
    res.ok ? setTicket(d.ticket) : setErr(d.error);
  }
  if (ticket) return (<div className="w" style={{ padding: "40px 20px" }}><div className="ok"><h2>Request received</h2><p>Your ticket is <b>{ticket}</b>. Save it and use it with your phone number on the Track repair page. If you are logged in, it also shows under My repairs. Bring the phone to {SHOP.short} or WhatsApp us on {SHOP.phone}.</p></div></div>);
  return (<div className="w" style={{ padding: "40px 20px" }}><h1 style={{ fontSize: "2.2rem" }}>Book a repair</h1>
    <form className="f" onSubmit={submit}>
      <label>Your name<input name="name" required /></label>
      <label>Phone number<input name="phone" inputMode="numeric" pattern="\d{10}" placeholder="10 digits" required /></label>
      <label>Brand<select name="brand">{BRANDS.map(b => <option key={b}>{b}</option>)}</select></label>
      <label>Model<input name="model" placeholder="e.g. Galaxy A54" /></label>
      <label>What is wrong?<select name="issue">{ISSUES.map(i => <option key={i}>{i}</option>)}</select></label>
      <label>Details (optional)<textarea name="notes" rows={3} /></label>
      {err && <div className="err" role="alert">{err}</div>}
      <button className="btn" disabled={busy}>{busy ? "Sending..." : "Book repair"}</button>
    </form></div>);
}
