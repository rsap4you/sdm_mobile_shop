"use client";
import { useEffect, useMemo, useState } from "react";
import { ISSUES, BRANDS, SHOP } from "@/lib/shop";
import { API } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPE = /^image\/(jpeg|png|webp)$/;

// Browser mein hi resize + JPEG compress (5-8 MB photo -> ~300 KB)
async function compress(file: File, maxSide = 1600, quality = 0.8): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/jpeg", quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function Repair() {
  const { user } = useAuth() || {};
  const [ticket, setTicket] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    setErr("");
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;
    if (files.length + picked.length > MAX_FILES) return setErr("Maximum 5 images allowed.");
    if (picked.some((f) => !OK_TYPE.test(f.type))) {
      return setErr("Only JPG, PNG or WebP images are allowed.");
    }
    const out = await Promise.all(picked.map((f) => compress(f)));
    if (out.some((f) => f.size > MAX_BYTES)) return setErr("Each image must be under 5 MB.");
    setFiles((p) => [...p, ...out]);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    const d: any = Object.fromEntries(new FormData(e.currentTarget));

    const fd = new FormData();
    ["name", "phone", "whatsapp", "email", "brand", "company", "model", "imei", "issue", "notes"].forEach(
      (k) => fd.append(k, d[k] ?? "")
    );
    fd.append("address[line1]", d.line1 ?? "");
    fd.append("address[line2]", d.line2 ?? "");
    fd.append("address[landmark]", d.landmark ?? "");
    fd.append("address[pincode]", d.pincode ?? "");
    files.forEach((f) => fd.append("images", f));

    const tk = localStorage.getItem("tk");
    try {
      // Content-Type mat lagao: browser boundary ke saath khud set karta hai
      const res = await fetch(API + "/api/repairs", {
        method: "POST",
        headers: tk ? { Authorization: "Bearer " + tk } : {},
        body: fd,
      });
      const r = await res.json();
      res.ok ? setTicket(r.ticket) : setErr(r.error || "Something went wrong.");
    } catch {
      setErr("Network error. Please try again.");
    }
    setBusy(false);
  }

  if (ticket)
    return (
      <div className="w" style={{ padding: "40px 20px" }}>
        <div className="ok">
          <h2>Request received</h2>
          <p>
            Your ticket is <b>{ticket}</b>. Save it and use it with your phone number on the Track repair
            page. If you are logged in, it also shows under My repairs. Bring the phone to {SHOP.short} or
            WhatsApp us on {SHOP.phone}.
          </p>
        </div>
      </div>
    );

  const a = user?.address || {};

  return (
    <div className="w" style={{ padding: "40px 20px" }}>
      <h1 style={{ fontSize: "2.2rem" }}>Book a repair</h1>

      <form className="f" onSubmit={submit} key={user?.email || "guest"}>
        <label>
          Your name
          <input name="name" defaultValue={user?.name || ""} required />
        </label>
        <label>
          Phone number
          <input
            name="phone"
            inputMode="numeric"
            pattern="\d{10}"
            maxLength={10}
            placeholder="10 digits"
            defaultValue={user?.phone || ""}
            required
          />
        </label>
        <label>
          WhatsApp number (optional)
          <input
            name="whatsapp"
            inputMode="numeric"
            pattern="\d{10}"
            maxLength={10}
            placeholder="10 digits, if different from phone"
          />
        </label>
        <label>
          Email (optional)
          <input name="email" type="email" placeholder="you@example.com" defaultValue={user?.email || ""} />
        </label>

        <label>
          Brand
          <select name="brand" required>
            {BRANDS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          Mobile company (optional)
          <input name="company" placeholder="e.g. Samsung Electronics" />
        </label>
        <label>
          Model No.
          <input name="model" placeholder="e.g. Galaxy A54 / SM-A546E" required />
        </label>
        <label>
          IMEI number (optional)
          <input
            name="imei"
            inputMode="numeric"
            pattern="\d{15}"
            maxLength={15}
            placeholder="15 digits (dial *#06# to see)"
          />
        </label>

        <label>
          What is wrong?
          <select name="issue">
            {ISSUES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
        <label>
          Details (optional)
          <textarea name="notes" rows={3} />
        </label>

        {/* PHOTOS (input ka name nahi hai, taaki form data me khali file na jaye) */}
        <label>
          Photos of the phone (optional, max 5)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={pick}
            disabled={files.length >= MAX_FILES}
          />
        </label>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="relative">
                <img src={previews[i]} alt="" className="size-16 rounded-md object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => setFiles((p) => p.filter((_, x) => x !== i))}
                  className="absolute -right-1.5 -top-1.5 size-5 cursor-pointer rounded-full bg-pink text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
            <span className="self-center text-sm text-mute">{files.length}/5</span>
          </div>
        )}

        <label>
          Address line 1
          <input
            name="line1"
            placeholder="House no., Society / Building"
            minLength={5}
            defaultValue={a.line1 || ""}
            required
          />
        </label>
        <label>
          Address line 2 (optional)
          <input name="line2" placeholder="Area, Road" defaultValue={a.line2 || ""} />
        </label>
        <label>
          Landmark (optional)
          <input name="landmark" placeholder="Near..." defaultValue={a.landmark || ""} />
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
            defaultValue={a.pincode || ""}
            required
          />
        </label>

        {err && (
          <div className="err" role="alert">
            {err}
          </div>
        )}
        <button className="btn" disabled={busy}>
          {busy ? "Sending..." : "Book repair"}
        </button>
      </form>
    </div>
  );
}