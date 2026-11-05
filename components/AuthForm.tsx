"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const val = (v: FormDataEntryValue | null) => String(v ?? "").trim();

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { auth, setUser } = useAuth();
  const router = useRouter();
  const s = mode === "signup";

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // save before any await
    setBusy(true);
    setErr("");

    try {
      const fd = new FormData(form);

      if (s) {
        // 1) Signup: plain JSON
        await auth("signup", {
          name: val(fd.get("name")),
          email: val(fd.get("email")),
          phone: val(fd.get("phone")),
          password: String(fd.get("password") ?? ""),
          address: {
            line1: val(fd.get("line1")),
            line2: val(fd.get("line2")),
            landmark: val(fd.get("landmark")),
            city: "Ahmedabad",
            pincode: val(fd.get("pincode")),
          },
        });

        // 2) Optional profile image, uploaded after signup using the token
        const file = fd.get("profileImage");
        if (file instanceof File && file.size > 0) {
          try {
            const token = localStorage.getItem("token");
            const up = new FormData();
            up.append("image", file); // backend expects field name "image"

            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/profile-image`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: up, // don't set Content-Type manually
              }
            );
            const d = await res.json().catch(() => ({}));
            if (res.ok && d.profileImage) {
              setUser((prev) =>
                prev ? { ...prev, profileImage: d.profileImage } : prev
              );
            }
          } catch {
            // signup already succeeded; ignore image failure
          }
        }
      } else {
        await auth("login", {
          email: val(fd.get("email")),
          password: String(fd.get("password") ?? ""),
        });
      }

      router.push("/account");
    } catch (x: any) {
      setErr(x.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w" style={{ padding: "40px 20px" }}>
      <h1 style={{ fontSize: "2.2rem" }}>{s ? "Create account" : "Log in"}</h1>

      <form className="f" onSubmit={submit}>
        {s && (
          <label>
            Name
            <input name="name" required />
          </label>
        )}

        <label>
          Email
          <input name="email" type="email" required />
        </label>

        {s && (
          <label>
            Phone number
            <input
              name="phone"
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              placeholder="10 digits"
              required
            />
          </label>
        )}

        {s && (
          <>
            <label>
              Profile Image (optional)
              <input
                name="profileImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
              />
            </label>

            <label>
              Address line 1
              <input
                name="line1"
                placeholder="House no., Society / Building"
                minLength={5}
                required
              />
            </label>

            <label>
              Address line 2 (optional)
              <input name="line2" placeholder="Area, Road" />
            </label>

            <label>
              Landmark (optional)
              <input name="landmark" placeholder="Near..." />
            </label>

            <label>
              City
              <input value="Ahmedabad" disabled readOnly />
            </label>

            <label>
              Pincode
              <input
                name="pincode"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="e.g. 380015 (Ahmedabad only)"
                required
              />
            </label>
          </>
        )}

        <label>
          Password{s && " (8 or more characters)"}
          <input
            name="password"
            type="password"
            minLength={s ? 8 : 1}
            required
          />
        </label>

        {err && (
          <div className="err" role="alert">
            {err}
          </div>
        )}

        <button className="btn" disabled={busy}>
          {busy ? "Please wait..." : s ? "Sign up" : "Log in"}
        </button>
      </form>

      <p className="sub">
        {s ? (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        ) : (
          <>
            New here? <Link href="/signup">Create an account</Link>
          </>
        )}
      </p>
    </div>
  );
}