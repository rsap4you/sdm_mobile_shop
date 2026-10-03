"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/repair", label: "Book a repair" },
  { href: "/track", label: "Track repair" },
  { href: "/accessories", label: "Accessories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false); // profile dropdown
  const [mobile, setMobile] = useState(false); // hamburger menu
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close menus on outside click / Escape
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t)) setOpen(false);
      if (navRef.current && !navRef.current.contains(t)) setMobile(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setMobile(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function handleLogout() {
    setOpen(false);
    setMobile(false);
    logout();
    router.push("/");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="nav" ref={navRef}>
      <div className="w nav-bar">
        {/* Logo */}
        <Link href="/" className="nav-logo" onClick={() => setMobile(false)}>
          <Image
            src="/logo_1.png"
            alt="SDM Mobile Logo"
            width={100}
            height={55}
            priority
          />
        </Link>

        {/* Links (desktop: row, mobile: dropdown panel) */}
        <div className="nav-links" data-open={mobile}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobile(false)}
              className={`nav-link${isActive(l.href) ? " active" : ""}`}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/login"
              onClick={() => setMobile(false)}
              className="nav-link md:hidden"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="nav-right">
          {user ? (
            <div ref={menuRef} className="profile">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label="Profile menu"
                aria-haspopup="menu"
                aria-expanded={open}
                className="profile-btn"
              >
                {user.profileImage ? (
                  // Plain <img> so Cloudinary URLs work without extra Next config
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="avatar"
                  />
                ) : (
                  <span className="avatar avatar-letter">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>

              {open && (
                <div role="menu" className="menu">
                  <div className="menu-head">
                    Hi, {user.name.split(" ")[0]}
                  </div>
                  <Link
                    href="/account"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="menu-item"
                  >
                    My account
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="menu-item danger"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-login">
                Log in
              </Link>
              <Link className="btn" href="/signup">
                Sign up
              </Link>
            </>
          )}

          {/* Hamburger (only on mobile) */}
          <button
            type="button"
            className="burger"
            aria-label="Toggle menu"
            aria-expanded={mobile}
            onClick={() => setMobile((m) => !m)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}