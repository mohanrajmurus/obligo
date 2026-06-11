export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#0F1115] py-10">
      <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-start gap-6">
        <div>
          <p className="font-bold text-[15px] text-white tracking-tight mb-1">Obligo</p>
          <p className="text-sm text-[#9BA1AD]">Know what's due. Keep money ready.</p>
          <p className="text-xs text-[#6C7280] mt-1">Built for working professionals.</p>
        </div>
        <p className="text-xs text-[#6C7280] sm:self-end">
          &copy; {new Date().getFullYear()} Obligo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
