"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // already /api pe khatam hota hai
const token = () => localStorage.getItem("token") || "";

async function call(path: string, method: string, body?: any, isForm = false) {
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      Authorization: "Bearer " + token(),
      ...(isForm ? {} : { "Content-Type": "application/json" }),
    },
    body: isForm ? body : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

type Msg = { ok: boolean; text: string } | null;

export default function Profile() {
  const auth: any = useAuth();
  const { user, ready, setUser } = auth;
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Record<string, Msg>>({});

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!user) return <div className="w" style={{ padding: "40px 20px" }}>Loading...</div>;

  const a = user.address || {};
  const say = (k: string, ok: boolean, text: string) =>
    setMsg((m) => ({ ...m, [k]: { ok, text } }));

  // Context update. Agar useAuth me setUser nahi hai to page reload ho jayega.
  const sync = (patch: any) =>
    setUser ? setUser({ ...user, ...patch }) : window.location.reload();

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    try {
      const u = await call("/auth/profile", "PATCH", {
        name: d.name,
        address: { line1: d.line1, line2: d.line2, landmark: d.landmark, pincode: d.pincode },
      });
      sync(u);
      setEditing(false);
      say("profile", true, "Profile updated.");
    } catch (x: any) {
      say("profile", false, x.message);
    }
    setBusy(false);
  }

  async function changePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return say("photo", false, "Photo must be under 3 MB.");
    const fd = new FormData();
    fd.append("image", file);
    try {
      const r = await call("/auth/profile-image", "POST", fd, true);
      sync({ profileImage: r.profileImage });
      say("photo", true, "Photo updated.");
    } catch (x: any) {
      say("photo", false, x.message);
    }
  }

  const Note = ({ k }: { k: string }) =>
    msg[k] ? (
      <div className={msg[k]!.ok ? "ok" : "err"} role="alert">{msg[k]!.text}</div>
    ) : null;

  return (
    <div className="w" style={{ padding: "40px 20px", maxWidth: 560 }}>
      <h1 style={{ fontSize: "2.2rem" }}>My profile</h1>

      {/* PHOTO */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "16px 0" }}>
        {user.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.profileImage} alt="" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <span className="avatar avatar-letter" style={{ width: 80, height: 80, fontSize: 32 }}>
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
        <label className="btn" style={{ cursor: "pointer" }}>
          Change photo
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={changePhoto} hidden />
        </label>
      </div>
      <Note k="photo" />

      {/* DETAILS */}
      <form className="f" onSubmit={save} key={String(editing) + user.name}>
        <label>
          Name
          <input name="name" defaultValue={user.name} disabled={!editing} required minLength={2} />
        </label>

        <label>
          Email
          <input value={user.email} disabled readOnly />
        </label>
        <label>
          Mobile number
          <input value={user.phone} disabled readOnly />
        </label>
        <p className="text-sm text-mute">
          Email and mobile number cannot be changed. Contact the shop if they need updating.
        </p>

        <label>
          Address line 1
          <input name="line1" defaultValue={a.line1 || ""} disabled={!editing} required minLength={5} />
        </label>
        <label>
          Address line 2 (optional)
          <input name="line2" defaultValue={a.line2 || ""} disabled={!editing} />
        </label>
        <label>
          Landmark (optional)
          <input name="landmark" defaultValue={a.landmark || ""} disabled={!editing} />
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
            defaultValue={a.pincode || ""}
            disabled={!editing}
            required
          />
        </label>

        <Note k="profile" />

        {editing ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
            <button type="button" className="btn" onClick={() => { setEditing(false); setMsg({}); }}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="btn" onClick={() => { setEditing(true); setMsg({}); }}>
            Edit profile
          </button>
        )}
      </form>

      <p style={{ marginTop: 24 }}>
        <Link href="/profile/password">Change password →</Link>
      </p>
    </div>
  );
}