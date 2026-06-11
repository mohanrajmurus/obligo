"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/components/AnalyticsTracker";

const OCCUPATIONS = ["Salaried", "Self-employed", "Student", "Other"] as const;

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobileNumber: z
    .string()
    .min(10, "Enter a valid WhatsApp number")
    .regex(/^\+?[\d\s\-()]{10,}$/, "Enter a valid WhatsApp number"),
  occupation: z.enum(OCCUPATIONS).optional(),
});

type FormData = z.infer<typeof formSchema>;

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-[#9BA1AD] flex items-center gap-1.5">
        {label}
        {optional && <span className="text-[#6C7280] font-normal normal-case tracking-normal">(Optional)</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#FF5A5F]">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-[#252932] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#6C7280] outline-none focus:border-[#4F8CFF]/40 focus:ring-2 focus:ring-[#4F8CFF]/15 transition-all disabled:opacity-50";

export default function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to submit. Please try again.");
      setIsSuccess(true);
      trackEvent("waitlist_submitted", { occupation: data.occupation });
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">You're on the waitlist.</h3>
        <p className="text-sm text-[#9BA1AD] mb-1">Thank you for joining Obligo.</p>
        <p className="text-xs text-[#6C7280]">We'll reach out when early access becomes available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#1A1D24] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="Mohan"
            disabled={isSubmitting}
            className={inputClass}
          />
        </Field>

        <Field label="WhatsApp Number" error={errors.mobileNumber?.message}>
          <input
            {...register("mobileNumber")}
            type="tel"
            placeholder="7845941621"
            disabled={isSubmitting}
            className={inputClass}
          />
        </Field>

        <Field label="Occupation" optional error={errors.occupation?.message}>
          <select
            {...register("occupation")}
            disabled={isSubmitting}
            className={inputClass + " appearance-none cursor-pointer"}
            defaultValue=""
          >
            <option value="" disabled className="bg-[#252932] text-[#6C7280]">Select your occupation</option>
            {OCCUPATIONS.map((o) => (
              <option key={o} value={o} className="bg-[#252932] text-white">{o}</option>
            ))}
          </select>
        </Field>

        {errorMessage && (
          <p className="text-xs text-[#FF5A5F] bg-[#FF5A5F]/10 border border-[#FF5A5F]/30 px-4 py-3 rounded-lg">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#4F8CFF] text-white font-semibold text-sm rounded-lg px-6 py-3.5 hover:bg-[#3b6bd1] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Joining…
            </>
          ) : (
            "Get Early Access"
          )}
        </button>
      </form>
    </div>
  );
}
