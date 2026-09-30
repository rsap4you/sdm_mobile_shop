import { API } from "@/lib/api";
import { SHOP } from "@/lib/shop";
export const dynamic = "force-dynamic";
export default async function Acc() {
  let items: any[] = [];
  try { items = await (await fetch(API + "/api/products", { cache: "no-store" })).json(); } catch {}
  return (<div className="w" style={{ padding: "40px 20px" }}><h1 style={{ fontSize: "2.2rem" }}>Accessories</h1>
    <p className="sub">Prices are for pickup at the shop. WhatsApp us to reserve an item.</p>
    {items.length === 0 ? <p>No accessories listed yet. Ask us on WhatsApp for what is in stock.</p> :
      <div className="grid">{items.map(p => <div className="card p" key={p._id}>
        {p.image && <img src={API + p.image} alt={p.name} style={{ width: "100%", borderRadius: 6 }} />}
        <b>{p.name}</b><div>₹{p.price}</div><small>{p.category}</small><br />
        <a href={SHOP.wa + "?text=" + encodeURIComponent("Hi, is " + p.name + " available?")}>Ask on WhatsApp</a></div>)}</div>}
  </div>);
}
