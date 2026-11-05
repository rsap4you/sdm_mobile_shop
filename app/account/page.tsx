"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { STATUSES } from "@/lib/shop";

export default function Account() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [list, setList] = useState<any[] | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my/repairs`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, [ready, user, router]);

  if (!user) return <div className="w" style={{ padding: "40px 20px" }}>Loading...</div>;

  return (
    <div className="w" style={{ padding: "40px 20px" }}>
      <h1 style={{ fontSize: "2.2rem" }}>My repairs</h1>
      <p className="sub">{user.name}, {user.email}, {user.phone}</p>
      {list === null ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>No repairs yet. <Link href="/repair">Book your first repair</Link>.</p>
      ) : (
        list.map((r) => (
          <div className="card" key={r._id} style={{ marginBottom: 14 }}>
            <b>{r.ticket}</b>: {r.brand} {r.model}, {r.issue}
            {r.estimate ? `. Estimate ₹${r.estimate}` : ""}
            <div className="steps">
              {STATUSES.map((s) => (
                <span key={s} className={s === r.status ? "on" : ""}>{s}</span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}