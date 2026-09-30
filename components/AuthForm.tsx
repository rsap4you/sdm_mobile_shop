"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { auth } = useAuth(); const router = useRouter(); const s = mode === "signup";
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    try { await auth(mode, Object.fromEntries(new FormData(e.currentTarget))); router.push("/account"); } catch (x: any) { setErr(x.message); }
    setBusy(false);
  }
  return (<div className="w" style={{ padding: "40px 20px" }}><h1 style={{ fontSize: "2.2rem" }}>{s ? "Create account" : "Log in"}</h1>
    <form className="f" onSubmit={submit}>
      {s && <label>Name<input name="name" required /></label>}
      <label>Email<input name="email" type="email" required /></label>
      {s && <label>Phone number<input name="phone" inputMode="numeric" pattern="\d{10}" placeholder="10 digits" required /></label>}
      <label>Password{s && " (8 or more characters)"}<input name="password" type="password" minLength={s ? 8 : 1} required /></label>
      {err && <div className="err" role="alert">{err}</div>}
      <button className="btn" disabled={busy}>{busy ? "Please wait..." : s ? "Sign up" : "Log in"}</button>
    </form>
    <p className="sub">{s ? <>Already have an account? <Link href="/login">Log in</Link></> : <>New here? <Link href="/signup">Create an account</Link></>}</p></div>);
}
