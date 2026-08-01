"use client";

import { useState, type FormEvent } from "react";
import { submitRegistration } from "@/lib/api";

type FormState = {
  studentName: string;
  studentAge: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  schoolNameRaw: string;
  grade: string;
  emergencyContact: string;
  medicalNotes: string;
};

const INITIAL: FormState = {
  studentName: "",
  studentAge: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  schoolNameRaw: "",
  grade: "",
  emergencyContact: "",
  medicalNotes: "",
};

const STEPS = ["Student Details", "School & Guardian", "Review & Submit"];

export default function Registration() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      await submitRegistration({
        studentName: form.studentName,
        studentAge: Number(form.studentAge),
        guardianName: form.guardianName,
        guardianPhone: form.guardianPhone,
        guardianEmail: form.guardianEmail,
        schoolNameRaw: form.schoolNameRaw,
        grade: form.grade || undefined,
        emergencyContact: form.emergencyContact,
        medicalNotes: form.medicalNotes || undefined,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <section id="register" className="bg-off-white py-24">
        <div className="mx-auto max-w-lg px-6 text-center">
          <div className="rounded-2xl border border-emerald/30 bg-emerald/10 p-10">
            <h2 className="font-heading text-2xl font-bold text-charcoal">You&apos;re on the list!</h2>
            <p className="mt-3 text-charcoal/70">
              We&apos;ve received your details. Next, you&apos;ll get an email to complete payment and confirm
              your seat.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="bg-off-white py-24">
      <div className="mx-auto max-w-xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-charcoal sm:text-4xl">
          Register for the Yaan
        </h2>

        {/* Step indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-numeric text-sm font-bold ${
                  i <= step ? "bg-saffron text-off-white" : "bg-charcoal/10 text-charcoal/50"
                }`}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && <div className="h-0.5 w-8 bg-charcoal/10" />}
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-sm font-semibold text-saffron">{STEPS[step]}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {step === 0 && (
            <>
              <Field label="Student full name" value={form.studentName} onChange={update("studentName")} required />
              <Field
                label="Student age"
                type="number"
                value={form.studentAge}
                onChange={update("studentAge")}
                required
                min={10}
                max={25}
              />
              <Field label="Grade / class" value={form.grade} onChange={update("grade")} />
            </>
          )}

          {step === 1 && (
            <>
              <Field label="School / college name" value={form.schoolNameRaw} onChange={update("schoolNameRaw")} required />
              <Field label="Guardian name" value={form.guardianName} onChange={update("guardianName")} required />
              <Field
                label="Guardian phone"
                type="tel"
                value={form.guardianPhone}
                onChange={update("guardianPhone")}
                required
              />
              <Field
                label="Guardian email"
                type="email"
                value={form.guardianEmail}
                onChange={update("guardianEmail")}
                required
              />
              <Field
                label="Emergency contact"
                type="tel"
                value={form.emergencyContact}
                onChange={update("emergencyContact")}
                required
              />
              <TextArea label="Medical notes (optional)" value={form.medicalNotes} onChange={update("medicalNotes")} />
            </>
          )}

          {step === 2 && (
            <div className="rounded-xl border border-charcoal/10 bg-white p-5 text-sm">
              <p><strong>Student:</strong> {form.studentName}, age {form.studentAge}</p>
              <p><strong>School:</strong> {form.schoolNameRaw}</p>
              <p><strong>Guardian:</strong> {form.guardianName} · {form.guardianPhone} · {form.guardianEmail}</p>
              <p><strong>Emergency contact:</strong> {form.emergencyContact}</p>
              <p className="mt-3 text-charcoal/60">
                Payment (QR / UPI) is collected on the next step after submission.
              </p>
            </div>
          )}

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={`rounded-full px-6 py-2 font-heading text-sm font-semibold ${
                step === 0 ? "invisible" : "border border-charcoal/20 text-charcoal"
              }`}
            >
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="rounded-full bg-saffron px-6 py-2 font-heading text-sm font-semibold text-off-white hover:bg-golden hover:text-deep-blue"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full bg-emerald px-6 py-2 font-heading text-sm font-semibold text-off-white hover:opacity-90 disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting..." : "Submit Registration"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-charcoal">
      {label}
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2 text-charcoal outline-none focus:border-saffron"
      />
    </label>
  );
}

function TextArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block text-sm font-medium text-charcoal">
      {label}
      <textarea
        {...props}
        rows={3}
        className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2 text-charcoal outline-none focus:border-saffron"
      />
    </label>
  );
}
