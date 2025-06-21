"use client";

import { useEffect } from "react";

export default function CivicCallback() {
  useEffect(() => {
    if (window.opener) {
      window.opener.location.reload();
      window.close();
    }
  }, []);

  return (
    <div>
      <h1>Logging you in...</h1>
    </div>
  );
} 