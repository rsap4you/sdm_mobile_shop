
"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hideLoader = () => setLoading(false);

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader);
    }

    return () => {
      window.removeEventListener("load", hideLoader);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="preloader">
      <div className="loader-content">
        <div className="loader-icon">📱</div>
        <h2>Shree Dhandai Mata Mobile</h2>
        <p>Loading your experience...</p>
        <div className="loader-bar">
          <div className="loader-progress"></div>
        </div>
      </div>
    </div>
  );
}
