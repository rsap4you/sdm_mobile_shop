import Link from "next/link";
import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";
import { SHOP, ISSUES, ISSUE_ICONS, BRANDS, BRAND_ICONS } from "@/lib/shop";
import { FaWhatsapp } from "react-icons/fa6";
import { FaScrewdriverWrench } from "react-icons/fa6";

export default function Home() {
  const mapsUrl =
    "https://maps.google.com/?q=" +
    encodeURIComponent(SHOP.name + " Vatva Ahmedabad");

  return (
    <div className="w">
      {/* HERO */}
      <div className="hero">
        <div>
          <h1>Cracked screen? Dead battery? We fix it.</h1>
          <p className="sub">
            Repairs for every major phone brand, plus cases, chargers and glass,
            at {SHOP.name} in Vatva.
          </p>
          <div className="row">
            <Link className="btn btn-ico" href="/repair">
              <FaScrewdriverWrench size={18} />
              Book a repair
            </Link>
            <a
              className="btn btn-ico btn-wa"
              href={SHOP.wa}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={22} />
              <span className="hidden sm:inline">{SHOP.phone}</span>
            </a>
          </div>
        </div>

        <Image
          className="mx-auto max-w-[280px] md:max-w-full"
          src="/logo.png"
          alt="SDM Mobile Repair logo"
          width={600}
          height={600}
          priority
          sizes="(max-width: 768px) 280px, 40vw"
        />
      </div>

      {/* SERVICES */}
      <section>
        <h2>All types trusted repair work here</h2>
        <div className="grid">
          {ISSUES.filter((i) => i !== "Other").map((i) => (
            <div className="card" key={i}>
              <span className="mr-2">{ISSUE_ICONS[i]}</span>
              {i}
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section>
        <h2>Brands we service</h2>
        <div className="brands">
          {BRANDS.filter((b) => b !== "Other").map((b) => (
            <span key={b}>
              {BRAND_ICONS[b]} {b}
            </span>
          ))}
        </div>
      </section>

      {/* VISIT */}
      <section>
        <h2>Visit the shop</h2>
        <p>📍 {SHOP.address}</p>
        <div className="row">
          <a
            className="btn alt"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            🗺️ Open in Maps
          </a>
          <a className="btn alt" href={"tel:" + SHOP.phone}>
            📞 Call {SHOP.owner}
          </a>
        </div>

        <h3 className="mt-5 mb-3">Follow us</h3>
        <SocialLinks />
      </section>
    </div>
  );
}