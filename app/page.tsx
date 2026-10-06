import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { SHOP, ISSUES, ISSUE_ICONS, BRANDS, BRAND_ICONS } from "@/lib/shop";

export default function Home() {
  return (
    <div className="w">
      <div className="hero">
        <div>
          <h1>Cracked screen? Dead battery? We fix it.</h1>
          <p className="sub">
            Repairs for every major phone brand, plus cases, chargers and glass, at {SHOP.name} in Vatva.
          </p>
          <div className="row">
            <Link className="btn" href="/repair">🛠️ Book a repair</Link>
            <a className="btn alt" href={SHOP.wa}>💬 WhatsApp {SHOP.phone}</a>
          </div>
        </div>
        <img src="/logo.png" alt="SDM Mobile Repair logo" />
      </div>

      <section>
        <h2>All types trusted repair work here</h2>
        <div className="grid">
          {ISSUES.filter((i) => i !== "Other").map((i) => (
            <div className="card" key={i}>
              <span style={{ marginRight: 8 }}>{ISSUE_ICONS[i]}</span>
              {i}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Brands we service</h2>
        <div className="brands">
          {BRANDS.slice(0, 10).map((b) => (
            <span key={b}>
              {BRAND_ICONS[b]} {b}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2>Visit the shop</h2>
        <p>📍 {SHOP.address}</p>
        <div className="row">
          <a
            className="btn alt"
            href={"https://maps.google.com/?q=" + encodeURIComponent(SHOP.name + " Vatva Ahmedabad")}
          >
            🗺️ Open in Maps
          </a>
          <a className="btn alt" href={"tel:" + SHOP.phone}>📞 Call {SHOP.owner}</a>
        </div>
        <h3 style={{ marginTop: 20 }}>Follow us</h3>
        <SocialLinks />
      </section>
    </div>
  );
}