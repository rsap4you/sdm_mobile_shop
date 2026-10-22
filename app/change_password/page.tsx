"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChangePassword() {
  const { user, ready }: any = useAuth();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!user) return <div className="w" style={{ padding: "40px 20px" }}>Loading...</div>;
    
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setMsg(null);

    if (d.newPassword !== d.confirm) {
      return setMsg({ ok: false, text: "New passwords do not match." });
    }
    if (d.newPassword === d.currentPassword) {
      return setMsg({ ok: false, text: "New password must be different from the current one." });
    }

    setBusy(true);
    try {
      const res = await fetch(API_URL + "/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        },
        body: JSON.stringify({
          currentPassword: d.currentPassword,
          newPassword: d.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

      form.reset();
      setMsg({ ok: true, text: "Password changed successfully." });
    } catch (x: any) {
      setMsg({ ok: false, text: x.message });
    }
    setBusy(false);
  }

  return (
    <div className="w" style={{ padding: "40px 20px", maxWidth: 560 }}>
      <h1 style={{ fontSize: "2.2rem" }}>Change password</h1>

      <form className="f" onSubmit={submit}>
        <label>
          Current password
          <input name="currentPassword" type="password" autoComplete="current-password" required />
        </label>
        <label>
          New password (8 or more characters)
          <input name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <label>
          Confirm new password
          <input name="confirm" type="password" autoComplete="new-password" minLength={8} required />
        </label>

        {msg && (
          <div className={msg.ok ? "ok" : "err"} role="alert">
            {msg.text}
          </div>
        )}

        <button className="btn" disabled={busy}>
          {busy ? "Saving..." : "Change password"}
        </button>
      </form>

      <p style={{ marginTop: 24 }}>
        <Link href="/profile">← Back to profile</Link>
      </p>
    </div>
  );
}