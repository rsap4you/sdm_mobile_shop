"use client";
import { useState } from "react";
import { ISSUES, BRANDS, SHOP } from "@/lib/shop";
import { API } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Repair() {
  const { user } = useAuth() || {};
  const [ticket, setTicket] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const d: any = Object.fromEntries(new FormData(e.currentTarget));
    // Backend expects address as a nested object
    const body = {
      name: d.name, phone: d.phone, whatsapp: d.whatsapp, email: d.email, brand: d.brand, company: d.company, model: d.model, imei: d.imei,
      issue: d.issue, notes: d.notes,
      address: { line1: d.line1, line2: d.line2, landmark: d.landmark, pincode: d.pincode },
    };
    const tk = localStorage.getItem("tk");
    try {
      const res = await fetch(API + "/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(tk ? { Authorization: "Bearer " + tk } : {}) },
        body: JSON.stringify(body),
      });
      const r = await res.json();
      res.ok ? setTicket(r.ticket) : setErr(r.error);
    } catch { setErr("Network error. Please try again."); }
    setBusy(false);
  }

  if (ticket) return (<div className="w" style={{ padding: "40px 20px" }}><div className="ok"><h2>Request received</h2><p>Your ticket is <b>{ticket}</b>. Save it and use it with your phone number on the Track repair page. If you are logged in, it also shows under My repairs. Bring the phone to {SHOP.short} or WhatsApp us on {SHOP.phone}.</p></div></div>);

  const a = user?.address || {};
  return (<div className="w" style={{ padding: "40px 20px" }}><h1 style={{ fontSize: "2.2rem" }}>Book a repair</h1>
    {/* key re-mounts the form once the logged-in user loads, so saved details pre-fill */}
    <form className="f" onSubmit={submit} key={user?.email || "guest"}>
      <label>Your name<input name="name" defaultValue={user?.name || ""} required /></label>
      <label>Phone number<input name="phone" inputMode="numeric" pattern="\d{10}" maxLength={10} placeholder="10 digits" defaultValue={user?.phone || ""} required /></label>
      <label>WhatsApp number (optional)<input name="whatsapp" inputMode="numeric" pattern="\d{10}" maxLength={10} placeholder="10 digits, if different from phone" /></label>
      <label>Email (optional)<input name="email" type="email" placeholder="you@example.com" defaultValue={user?.email || ""} /></label>

      <label>Brand<select name="brand" required>{BRANDS.map(b => <option key={b}>{b}</option>)}</select></label>
      <label>Mobile company (optional)<input name="company" placeholder="e.g. Samsung Electronics" /></label>
      <label>Model No.<input name="model" placeholder="e.g. Galaxy A54 / SM-A546E" required /></label>
      <label>IMEI number (optional)<input name="imei" inputMode="numeric" pattern="\d{15}" maxLength={15} placeholder="15 digits (dial *#06# to see)" /></label>

      <label>What is wrong?<select name="issue">{ISSUES.map(i => <option key={i}>{i}</option>)}</select></label>
      <label>Details (optional)<textarea name="notes" rows={3} /></label>

      <label>Address line 1<input name="line1" placeholder="House no., Society / Building" minLength={5} defaultValue={a.line1 || ""} required /></label>
      <label>Address line 2 (optional)<input name="line2" placeholder="Area, Road" defaultValue={a.line2 || ""} /></label>
      <label>Landmark (optional)<input name="landmark" placeholder="Near..." defaultValue={a.landmark || ""} /></label>
      <label>City<input value="Ahmedabad" disabled readOnly /></label>
      <label>Pincode<input name="pincode" inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="e.g. 380015 (Ahmedabad only)" defaultValue={a.pincode || ""} required /></label>

      {err && <div className="err" role="alert">{err}</div>}
      <button className="btn" disabled={busy}>{busy ? "Sending..." : "Book repair"}</button>
    </form></div>);
}