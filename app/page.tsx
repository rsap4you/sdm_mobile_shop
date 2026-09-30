import Link from "next/link";
import { SHOP, ISSUES, BRANDS } from "@/lib/shop";
export default function Home() {
  return (<div className="w">
    <div className="hero"><div>
      <h1>Cracked screen? Dead battery? We fix it.</h1>
      <p className="sub">Repairs for every major phone brand, plus cases, chargers and glass, at {SHOP.name} in Vatva.</p>
      <div className="row"><Link className="btn" href="/repair">Book a repair</Link><a className="btn alt" href={SHOP.wa}>WhatsApp {SHOP.phone}</a></div>
    </div><img src="/logo.png" alt="SDM Mobile Repair logo" /></div>
    <section><h2>What we repair</h2><div className="grid">{ISSUES.slice(0, 4).map(i => <div className="card" key={i}>{i}</div>)}</div></section>
    <section><h2>Brands we service</h2><div className="brands">{BRANDS.slice(0, 6).map(b => <span key={b}>{b}</span>)}</div></section>
    <section><h2>Visit the shop</h2><p>{SHOP.address}</p>
      <div className="row"><a className="btn alt" href={"https://maps.google.com/?q=" + encodeURIComponent(SHOP.name + " Vatva Ahmedabad")}>Open in Maps</a><a className="btn alt" href={SHOP.insta}>Instagram</a><a className="btn alt" href={"tel:" + SHOP.phone}>Call {SHOP.owner}</a></div></section>
  </div>);
}
