"use client";

import { useEffect, useRef } from "react";

// Generic event tracking function that can be exported and hooked up to actual analytics later
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Replace this with actual analytics provider (e.g., PostHog, Vercel Analytics)
  console.log(`[Analytics Event] ${eventName}`, properties || {});
};

export default function AnalyticsTracker() {
  const tracked50 = useRef(false);
  const tracked90 = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percent = (scrolled / scrollHeight) * 100;

      if (percent >= 50 && !tracked50.current) {
        tracked50.current = true;
        trackEvent("scroll_50");
      }

      if (percent >= 90 && !tracked90.current) {
        tracked90.current = true;
        trackEvent("scroll_90");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null; // This is a logic-only component
}
