"use client";

import { useState, useEffect } from "react";

const PHONE_BREAKPOINT = 640;

export function useIsPhoneWidth() {
  const [isPhoneWidth, setIsPhoneWidth] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${PHONE_BREAKPOINT - 1}px)`,
    );

    const update = () => setIsPhoneWidth(mediaQuery.matches);
    update();

    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isPhoneWidth;
}
