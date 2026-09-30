"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
export default function Nav() {
  const { user, logout } = useAuth();
  return (<nav><div className="w"><b>SDM Mobile</b>
    <Link href="/">Home</Link><Link href="/repair">Book a repair</Link><Link href="/track">Track repair</Link><Link href="/accessories">Accessories</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
    {user ? (<><Link href="/account">Hi, {user.name.split(" ")[0]}</Link><a href="/" onClick={logout}>Log out</a></>) : (<><Link href="/login">Log in</Link><Link className="btn" href="/signup">Sign up</Link></>)}
  </div></nav>);
}
