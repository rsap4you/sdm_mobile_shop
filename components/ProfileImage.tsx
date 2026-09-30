"use client";
import { useRef, useState } from "react";
import { API } from "@/lib/api";
import { useAuth } from "@/lib/auth";

// Drop this into the account page: <ProfileImage />
// Assumes useAuth() exposes `user` the same way AuthForm.tsx / Repair.tsx already use it.
// If your auth context has a way to update the cached user (e.g. setUser / refreshUser),
// call it inside onUploaded below so the new picture shows up everywhere without a reload.
export default function ProfileImage() {
  const { user } = useAuth() || {};
  const [img, setImg] = useState(user?.profileImage || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");

    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setErr("Please choose a JPG, PNG or WEBP image."); return; }
    if (file.size > 3 * 1024 * 1024) { setErr("Image must be under 3MB."); return; }

    setBusy(true);
    const tk = localStorage.getItem("tk");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(API + "/api/auth/profile-image", {
        method: "POST",
        headers: tk ? { Authorization: "Bearer " + tk } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setImg(data.profileImage);
      // If your auth context can update the cached user, do it here, e.g.:
      // updateUser({ profileImage: data.profileImage });
    } catch (x: any) {
      setErr(x.message || "Network error. Please try again.");
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <div
        style={{
          width: 84, height: 84, borderRadius: "50%", overflow: "hidden",
          background: "#eee", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, color: "#888", flexShrink: 0,
        }}
      >
        {img
          ? <img src={img} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : (user?.name?.[0]?.toUpperCase() || "?")}
      </div>

      <div>
        <label className="btn" style={{ cursor: busy ? "wait" : "pointer", display: "inline-block" }}>
          {busy ? "Uploading..." : img ? "Change photo" : "Add photo"}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            disabled={busy}
            style={{ display: "none" }}
          />
        </label>
        {err && <div className="err" role="alert" style={{ marginTop: 6 }}>{err}</div>}
      </div>
    </div>
  );
}