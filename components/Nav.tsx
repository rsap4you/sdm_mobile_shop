"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const SIZE = 40;

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

  const avatarStyle: React.CSSProperties = {
    width: SIZE,
    height: SIZE,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ec407a",
    cursor: "pointer",
    display: "block",
  };

  return (
    <nav>
      <div className="w">
        {/* Website Logo */}
        <Link href="/" className="logo">
          <Image
            src="/logo_1.png"
            alt="SDM Mobile Logo"
            width={100}
            height={75}
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
          <div
            ref={menuRef}
            style={{ marginLeft: "auto", position: "relative" }}
          >
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Profile menu"
              aria-haspopup="menu"
              aria-expanded={open}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              {user.profileImage ? (
                // Plain <img> so Cloudinary URLs work without extra Next config
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profileImage}
                  alt={user.name}
                  style={avatarStyle}
                />
              ) : (
                <span
                  style={{
                    ...avatarStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ec407a",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </button>

            {open && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: SIZE + 10,
                  minWidth: 180,
                  background: "#2a1a4a",
                  border: "1px solid #4a3a6a",
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  zIndex: 1000,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    fontSize: "0.85rem",
                    opacity: 0.8,
                    borderBottom: "1px solid #4a3a6a",
                    marginBottom: 4,
                  }}
                >
                  Hi, {user.name.split(" ")[0]}
                </div>

                <Link
                  href="/account"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  style={{ padding: "8px 10px", borderRadius: 8 }}
                >
                  My account
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: "none",
                    border: "none",
                    color: "#ff6b8b",
                    textAlign: "left",
                    cursor: "pointer",
                    font: "inherit",
                  }}
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