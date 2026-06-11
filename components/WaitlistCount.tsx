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

  return (
    <p className="text-sm text-[#4F8CFF] font-medium">
      {count} {count === 1 ? "person" : "people"} already on the waitlist
    </p>
  );
}
