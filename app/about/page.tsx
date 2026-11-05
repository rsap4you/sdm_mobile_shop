import Link from "next/link";
import { SHOP, BRANDS } from "@/lib/shop";
export default function About() {
  return (<div className="w" style={{ padding: "40px 20px", maxWidth: 760 }}><h1 style={{ fontSize: "2.2rem" }}>About us</h1>
    <p>{SHOP.name} is a mobile repair and accessories shop in Vatva, Ahmedabad, run by {SHOP.owner}. We are a premium service provider for phone repairs, and we sell the accessories you need every day.</p>
    <h2>What we do</h2><p>We fix broken glass and LED screens, replace batteries, repair water damage and unlock phones. We work on {BRANDS.slice(0, 6).join(", ")} phones.</p>
    <h2>How it works</h2><p>Book a repair online, bring your phone to the shop, and follow the progress with your ticket number. If you have an account, all your repairs are in one place.</p>
    <div className="row"><Link className="btn" href="/repair">Book a repair</Link><Link className="btn alt" href="/contact">Contact us</Link></div></div>);
}
