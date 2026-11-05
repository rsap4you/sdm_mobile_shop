"use client";
import { useState } from "react";
import { SHOP } from "@/lib/shop";
import { API } from "@/lib/api";
export default function Contact() {
  const [done, setDone] = useState(false); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await fetch(API + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
    const d = await res.json(); setBusy(false); res.ok ? setDone(true) : setErr(d.error);
  }
  return (<div className="w" style={{ padding: "40px 20px" }}><h1 style={{ fontSize: "2.2rem" }}>Contact us</h1>
    <div className="two"><div>
      {done ? <div className="ok"><h2>Message sent</h2><p>Thanks, we will reply soon. For a faster answer, WhatsApp us on {SHOP.phone}.</p></div> :
        <form className="f" onSubmit={send}>
          <label>Your name<input name="name" required /></label>
          <label>Email<input name="email" type="email" /></label>
          <label>Phone number<input name="phone" inputMode="numeric" pattern="\d{10}" placeholder="10 digits" /></label>
          <label>Message<textarea name="message" rows={5} required /></label>
          {err && <div className="err" role="alert">{err}</div>}
          <button className="btn" disabled={busy}>{busy ? "Sending..." : "Send message"}</button></form>}
    </div><div>
      <h2>Shop details</h2><p>{SHOP.address}</p><p>{SHOP.owner}: <a href={"tel:" + SHOP.phone}>{SHOP.phone}</a></p>
      <div className="row" style={{ marginTop: 0 }}><a className="btn alt" href={SHOP.wa}>WhatsApp</a><a className="btn alt" href={SHOP.insta}>Instagram</a></div>
      <iframe title="Shop location map" loading="lazy" src={"https://maps.google.com/maps?q=" + encodeURIComponent(SHOP.name + " Vatva Ahmedabad") + "&output=embed"} />
    </div></div></div>);
}
