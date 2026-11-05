
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pageLoaded = document.readyState === "complete";
    let minimumTimePassed = false;

    const hideLoader = () => {
      pageLoaded = true;
      checkLoading();
    };

    const checkLoading = () => {
      if (pageLoaded && minimumTimePassed) {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      minimumTimePassed = true;
      checkLoading();
    }, 1500);

    if (!pageLoaded) {
      window.addEventListener("load", hideLoader);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", hideLoader);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="preloader">
      <div className="loader-content">
        <Image
          src="/logo.png"
          alt="SDM Mobile Logo"
          width={250}
          height={140}
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
