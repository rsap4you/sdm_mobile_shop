import { API } from "@/lib/api";
import { SHOP } from "@/lib/shop";
export const dynamic = "force-dynamic";

// Static services list. Put matching image files in /public/services/
// e.g. frontend/public/services/screen-repair.jpg
const SERVICES = [
  { name: "Screen Repair", image: "/our_services", desc: "Cracked or unresponsive display, replaced same day." },
  { name: "Battery Replacement", image: "/services/battery.jpg", desc: "Original-quality batteries, quick swap." },
  { name: "Water Damage Repair", image: "/services/water-damage.jpg", desc: "Cleaning and component-level repair." },
  { name: "Charging Port Repair", image: "/services/charging-port.jpg", desc: "Loose or dead charging port fixed." },
  { name: "Software & Data Recovery", image: "/services/software.jpg", desc: "OS issues, app crashes, data recovery." },
  { name: "Camera Repair", image: "/services/camera.jpg", desc: "Blurry, cracked or non-working camera fixed." },
];

export default async function Acc() {
  let items: any[] = [];
  try { items = await (await fetch(API + "/api/products", { cache: "no-store" })).json(); } catch { }

  return (<div className="w" style={{ padding: "40px 20px" }}>

    {/* ---- Our Services (static) ---- */}
    <h1 style={{ fontSize: "2.2rem" }}>Our Services</h1>
    <p className="sub">Fast, reliable phone repairs at {SHOP.short}.</p>
    <div className="grid">
      {SERVICES.map(s => (
        <div className="card p" key={s.name}>
          <img src={s.image} alt={s.name} style={{ width: "100%", borderRadius: 6, aspectRatio: "4/3", objectFit: "cover" }} />
          <b>{s.name}</b>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>{s.desc}</div>
        </div>
      ))}
    </div>

    {/* ---- Accessories (from backend) ---- */}
    <h1 style={{ fontSize: "2.2rem", marginTop: 48 }}>Accessories</h1>
    <p className="sub">Prices are for pickup at the shop. WhatsApp us to reserve an item.</p>
    {items.length === 0 ? <p>No accessories listed yet. Ask us on WhatsApp for what is in stock.</p> :
      <div className="grid">{items.map(p => <div className="card p" key={p._id}>
        {p.image && <img src={API + p.image} alt={p.name} style={{ width: "100%", borderRadius: 6 }} />}
        <b>{p.name}</b><div>₹{p.price}</div><small>{p.category}</small><br />
        <a href={SHOP.wa + "?text=" + encodeURIComponent("Hi, is " + p.name + " available?")}>Ask on WhatsApp</a></div>)}</div>}

  </div>);
}