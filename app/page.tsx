"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Lock, EyeOff, Trash2 } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import WaitlistCount from "@/components/WaitlistCount";
import Link from "next/link";
import { trackEvent } from "@/components/AnalyticsTracker";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function DashboardMockup() {
  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[#4F8CFF]/30 via-transparent to-[#A855F7]/20">
      <div className="relative rounded-2xl bg-[#1A1D24] overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.9)]">
        {/* Chrome bar */}
        <div className="flex items-center px-4 py-3 border-b border-[rgba(255,255,255,0.08)] bg-[#252932]">
          <div className="flex gap-1.5 mr-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
          </div>
          <span className="text-[11px] text-[#6C7280] font-semibold tracking-widest uppercase">obligo</span>
        </div>

        <div className="p-5 space-y-5">
          {/* Balance + runway */}
          <div>
            <p className="text-[10px] text-[#6C7280] uppercase tracking-[0.15em] mb-1">Current Balance</p>
            <p className="text-[28px] font-bold font-mono tabular-nums text-white leading-none mb-4">₹50,000</p>

            <div className="h-1.5 rounded-full bg-[#252932] overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#FF5A5F] via-[#F97316] to-[#22C55E]"
                initial={{ width: 0 }}
                animate={{ width: "59.3%" }}
                transition={{ duration: 1.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="flex justify-between text-[11px] tabular-nums">
              <span className="text-[#FF5A5F] font-medium font-mono">₹29,649 committed</span>
              <span className="text-[#22C55E] font-medium font-mono">₹20,351 free</span>
            </div>
          </div>

          {/* Metric row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#252932] border border-[rgba(255,255,255,0.08)] rounded-xl p-3">
              <p className="text-[10px] text-[#6C7280] uppercase tracking-[0.12em] mb-1">Obligations</p>
              <p className="text-lg font-bold font-mono tabular-nums text-[#FF5A5F]">₹29,649</p>
            </div>
            <div className="bg-[#252932] border border-[#22C55E]/20 rounded-xl p-3">
              <p className="text-[10px] text-[#22C55E]/70 uppercase tracking-[0.12em] mb-1">Safe to Spend</p>
              <p className="text-lg font-bold font-mono tabular-nums text-[#22C55E]">₹20,351</p>
            </div>
          </div>

          {/* Upcoming items */}
          <div>
            <p className="text-[10px] text-[#6C7280] uppercase tracking-[0.15em] mb-3">Upcoming</p>
            <div className="space-y-0">
              {[
                { name: "Rent", amount: "₹15,000", days: "2d", dot: "#FF5A5F" },
                { name: "Bike EMI", amount: "₹8,000", days: "5d", dot: "#F97316" },
                { name: "Internet", amount: "₹999", days: "8d", dot: "#6C7280" },
                { name: "Netflix", amount: "₹649", days: "12d", dot: "#6C7280" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.06)] last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                    <span className="text-[13px] text-white">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#6C7280] font-mono tabular-nums">{item.days}</span>
                    <span className="text-[13px] font-semibold font-mono tabular-nums text-white">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RunwayBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const committedPercent = 59.3;

  return (
    <div ref={ref} className="max-w-2xl mx-auto">
      {/* Balance */}
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.18em] text-[#6C7280] mb-3">Current Balance</p>
        <p className="text-7xl md:text-8xl font-extrabold font-mono tabular-nums text-white">₹50,000</p>
      </div>

      {/* Commitments breakdown */}
      <div className="bg-[#1A1D24] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 mb-5">
        <p className="text-xs uppercase tracking-[0.15em] text-[#6C7280] mb-4">Upcoming Commitments</p>
        <div className="space-y-3">
          {[
            { name: "Rent", amount: "₹15,000" },
            { name: "Insurance", amount: "₹5,000" },
            { name: "EMI", amount: "₹8,000" },
            { name: "Internet", amount: "₹1,000" },
            { name: "Netflix", amount: "₹649" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm text-[#9BA1AD]">{item.name}</span>
              <span className="text-sm font-mono tabular-nums text-white">{item.amount}</span>
            </div>
          ))}
          <div className="border-t border-[rgba(255,255,255,0.08)] pt-3 mt-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-[#FF5A5F]">Total Obligations</span>
            <span className="text-base font-bold font-mono tabular-nums text-[#FF5A5F]">₹29,649</span>
          </div>
        </div>
      </div>

      {/* The runway bar */}
      <div className="relative h-16 rounded-lg bg-[#252932] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full flex items-center justify-center border-r border-[#FF5A5F]/30"
          style={{ background: "rgba(255,90,95,0.15)" }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${committedPercent}%` } : { width: 0 }}
          transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="text-xs font-bold font-mono text-[#FF5A5F] tabular-nums px-2 truncate"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.9 }}
          >
            ₹29,649 committed
          </motion.span>
        </motion.div>
        <motion.div
          className="absolute right-0 top-0 h-full flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.15)" }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${100 - committedPercent}%` } : { width: 0 }}
          transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="text-xs font-bold font-mono text-[#22C55E] tabular-nums px-2 truncate"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.9 }}
          >
            ₹20,351 free
          </motion.span>
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-2.5 text-[11px] text-[#6C7280]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF5A5F]" />
          Already committed
        </span>
        <span className="flex items-center gap-1.5">
          Safe to spend
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
        </span>
      </div>

      {/* Safe to spend highlight */}
      <motion.div
        className="mt-6 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-6 flex items-center justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <span className="text-base font-semibold text-[#22C55E]">Safe To Spend</span>
        <span className="text-4xl font-extrabold font-mono tabular-nums text-[#22C55E]">₹20,351</span>
      </motion.div>
    </div>
  );
}

const steps = [
  {
    num: "01",
    title: "Add your commitments",
    desc: "Rent, EMIs, insurance, subscriptions — anything that recurs.",
  },
  {
    num: "02",
    title: "See what's due",
    desc: "Next 7 days. Next 30 days. Always one step ahead.",
  },
  {
    num: "03",
    title: "Get timely reminders",
    desc: "Never miss a due date or get caught off guard.",
  },
  {
    num: "04",
    title: "Know what to protect",
    desc: "Your safe-to-spend balance — calculated automatically.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden bg-[#0F1115]">
        {/* Colored glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#4F8CFF]/8 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#A855F7]/6 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center max-w-6xl mx-auto">

            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-xl"
            >
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-[#4F8CFF] mb-6">
                Early Access
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.0] mb-6"
              >
                Stop getting surprised by bills and EMIs.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg text-[#9BA1AD] leading-relaxed mb-4"
              >
                Know exactly how much money you need to keep ready for upcoming
                commitments before you spend it.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-sm text-[#6C7280] leading-relaxed mb-10"
              >
                Track rent, EMIs, subscriptions, insurance, school fees, and other
                recurring obligations — all in one place.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 items-start">
                <Link
                  href="#waitlist"
                  onClick={() => trackEvent("hero_cta_clicked", { button: "get_early_access" })}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F8CFF] text-white font-semibold text-sm px-6 py-3.5 hover:bg-[#3b6bd1] transition-colors"
                >
                  Get Early Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={() => trackEvent("hero_cta_clicked", { button: "how_it_works" })}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.15)] text-[#9BA1AD] font-medium text-sm px-6 py-3.5 hover:border-[rgba(255,255,255,0.3)] hover:text-white transition-colors"
                >
                  See How It Works
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full lg:w-[360px] xl:w-[400px]"
            >
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROBLEM ──────────────────────────────────────── */}
      <section className="py-24 bg-[#1A1D24]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-5"
            >
              Your bills don't live in one place.
              <br />
              <span className="text-[#6C7280] font-normal">Neither does the stress.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#9BA1AD] text-base leading-relaxed">
              Most people track recurring commitments across 4–5 different places.
              Nothing gives you the full picture.
            </motion.p>
          </motion.div>

          {/* Comparison — border-left editorial */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_48px_1fr] gap-8 md:gap-0 items-stretch">
            {/* Banking apps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border-l-2 border-[rgba(255,255,255,0.08)] pl-8 py-4"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6C7280] mb-6">How most people manage today</p>
              <ul className="space-y-4">
                {[
                  { emoji: "📅", label: "Calendar reminders" },
                  { emoji: "🗒️", label: "Notes app for amounts" },
                  { emoji: "🧠", label: "Mental memory for due dates" },
                  { emoji: "📧", label: "Email for renewal notices" },
                  { emoji: "🏦", label: "Bank app for balances" },
                ].map(({ emoji, label }) => (
                  <li key={label} className="flex items-center gap-3 text-[#6C7280]">
                    <span className="text-base leading-none flex-shrink-0 w-4 text-center">{emoji}</span>
                    <span className="text-sm">{label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* VS divider */}
            <div className="flex md:flex-col items-center justify-center">
              <span className="text-xs font-bold text-[rgba(255,255,255,0.1)] tracking-widest md:[writing-mode:vertical-rl] md:rotate-180 px-4 py-2">VS</span>
            </div>

            {/* Obligo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="border-l-2 border-[#22C55E] pl-8 py-4"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#22C55E] mb-6">Obligo</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#22C55E]" />
                  <span className="text-sm font-medium">Upcoming Obligations</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#22C55E]" />
                  <span className="text-sm font-medium">Future Commitments</span>
                </li>
                <li className="flex items-center gap-3 text-[#22C55E]">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-bold">Safe-to-Spend Amount</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#22C55E]" />
                  <span className="text-sm font-medium">Weekly Summary</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#22C55E]" />
                  <span className="text-sm font-medium">Recurring Tracking</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm text-[#9BA1AD] mt-10"
          >
            One place. No more context-switching.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 3: SCENARIO ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#0F1115]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
            >
              Your balance says ₹50,000.
              <br />
              <span className="text-[#6C7280] font-normal">But can you actually spend all of it?</span>
            </motion.h2>
          </motion.div>

          <RunwayBar />
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-[#1A1D24]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Stay ahead of your commitments.
            </motion.h2>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Desktop */}
            <div className="hidden md:grid md:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-[80px] font-extrabold text-white/5 leading-none mb-4 select-none">{step.num}</p>
                  <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-[#9BA1AD] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="border-l-2 border-[rgba(255,255,255,0.08)] pl-5"
                >
                  <p className="text-4xl font-extrabold text-white/10 leading-none mb-2">{step.num}</p>
                  <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-[#9BA1AD] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: WEEKLY SUMMARY ───────────────────────────────── */}
      <section className="py-24 bg-[#0F1115]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              A weekly summary you'll actually read.
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xs mx-auto"
          >
            {/* WhatsApp light mode card */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.08)]" style={{ background: "#E5DDD5" }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#128C7E]">
                <div className="w-9 h-9 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  O
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">Obligo</p>
                  <p className="text-[11px] text-white/70">Official Account</p>
                </div>
              </div>

              {/* Chat body */}
              <div className="p-4 min-h-[200px] flex flex-col justify-end">
                <div className="bg-[#DCF8C6] p-4 rounded-xl rounded-tr-none max-w-full shadow text-sm">
                  <p className="font-semibold text-[13px] text-[#111B21] mb-3">Upcoming obligations this week</p>
                  <div className="space-y-1.5 mb-4 text-[13px]">
                    <div className="flex justify-between gap-6">
                      <span className="text-[#075E54]">Rent</span>
                      <span className="tabular-nums font-medium text-[#111B21]">₹15,000</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-[#075E54]">Internet</span>
                      <span className="tabular-nums font-medium text-[#111B21]">₹999</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-[#075E54]">Netflix</span>
                      <span className="tabular-nums font-medium text-[#111B21]">₹649</span>
                    </div>
                  </div>
                  <div className="border-t border-[#111B21]/10 pt-3">
                    <div className="flex justify-between text-[13px] font-bold text-[#111B21]">
                      <span>Total Required</span>
                      <span className="tabular-nums">₹16,648</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#667781] mt-2">Keep sufficient balance ready.</p>
                  <div className="text-[10px] text-[#667781] text-right mt-1">09:41 AM ✓✓</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 6: TRUST ───────────────────────────────────────── */}
      <section className="py-20 bg-[#1A1D24]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-[#4F8CFF] mb-3">
              Your Privacy
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-white">
              Your data stays yours.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              {
                icon: Shield,
                title: "We never connect to your bank",
                desc: "Obligo has no access to your accounts, passwords, or transactions. You enter only what you choose.",
              },
              {
                icon: Lock,
                title: "Encrypted at rest and in transit",
                desc: "All data is encrypted in transit (HTTPS) and at rest on MongoDB Atlas. We use no plain-text storage.",
              },
              {
                icon: EyeOff,
                title: "Your data is never sold",
                desc: "We don't sell, share, or monetise your personal information. No ads, no third-party profiling.",
              },
              {
                icon: Trash2,
                title: "Delete your account anytime",
                desc: "Request full deletion of your data at any time. No hoops, no waiting period.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex gap-4 bg-[#0F1115] border border-[rgba(255,255,255,0.06)] rounded-xl p-5"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#4F8CFF]/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#4F8CFF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{title}</p>
                  <p className="text-xs text-[#6C7280] leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 7: WAITLIST ─────────────────────────────────────── */}
      <section id="waitlist" className="py-24 bg-[#0F1115]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center max-w-lg mx-auto mb-10"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
            >
              Get Early Access
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#9BA1AD] text-base leading-relaxed mb-4">
              Be among the first to use Obligo and never get caught off guard by
              a bill again.
            </motion.p>
            <motion.div variants={fadeUp}>
              <WaitlistCount />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <WaitlistForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
