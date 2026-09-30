import Link from "next/link";
import { SHOP } from "@/lib/shop";
export default function Footer() {
  return (<footer><div className="w cols">
    <div><b>{SHOP.name}</b><p>Mobile repair and accessories in Vatva, Ahmedabad, for Samsung, Oppo, OnePlus, Vivo, Mi and Apple.</p></div>
    <div><b>Pages</b><Link href="/repair">Book a repair</Link><Link href="/track">Track repair</Link><Link href="/accessories">Accessories</Link><Link href="/about">About us</Link><Link href="/contact">Contact us</Link></div>
    <div><b>Visit or call</b><p>{SHOP.address}</p><a href={"tel:" + SHOP.phone}>{SHOP.phone}</a><a href={SHOP.wa}>WhatsApp</a><a href={SHOP.insta}>Instagram</a></div>
  </div><div className="w copy">© {new Date().getFullYear()} {SHOP.name}. All rights reserved.</div></footer>);
}
