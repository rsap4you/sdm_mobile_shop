
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
        <Image
          src="/logo_1.png"
          alt="SDM Mobile Logo"
          width={220}
          height={120}
          priority
          className="loader-logo"
        />

        <p>Loading your experience...</p>

        <div className="loader-bar">
          <div className="loader-progress"></div>
        </div>
      </div>
    </div>
  );
}
