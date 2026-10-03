"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside or pressing Escape
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
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
    logout();
    router.push("/");
  }

  return (
    <nav>
      <div className="w">
        {/* Website Logo */}
        <Link href="/" className="logo">
          <Image
            src="/logo_1.png"
            alt="SDM Mobile Logo"
            width={100}
            height={55}
            priority
          />
        </Link>

        <Link href="/">Home</Link>
        <Link href="/repair">Book a repair</Link>
        <Link href="/track">Track repair</Link>
        <Link href="/accessories">Accessories</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>

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
            <Link href="/login">Log in</Link>
            <Link className="btn" href="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}