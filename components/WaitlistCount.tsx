"use client";

import { useEffect, useState } from "react";

export default function WaitlistCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  if (count === null || count === 0) return null;

  const display = count < 10 ? 10 : count;

  return (
    <div className="inline-flex items-center gap-2 bg-[#FFF8EC] border border-[#F5A623] rounded-full px-4 py-2 text-sm font-semibold text-[#F5A623]">
      🔥 <span>{display} people already joined</span>
    </div>
  );
}
