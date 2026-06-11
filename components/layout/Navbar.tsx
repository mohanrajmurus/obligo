import Link from "next/link";

function ObligoMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="5" height="12" rx="1.5" fill="#4F8CFF" />
      <rect x="10" y="4" width="5" height="16" rx="1.5" fill="#4F8CFF" opacity="0.45" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#0F1115]/95 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <ObligoMark />
          <span className="font-bold text-[15px] tracking-tight text-white">Obligo</span>
        </Link>

      </div>
    </header>
  );
}
