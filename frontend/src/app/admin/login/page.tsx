"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-deep-blue px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-off-white/10 bg-off-white/5 p-8 backdrop-blur-sm"
      >
        <h1 className="font-heading text-2xl font-bold text-off-white">Admin Sign In</h1>
        <p className="mt-1 text-sm text-off-white/60">Jignasayaan operations dashboard</p>

        <label className="mt-6 block text-sm font-medium text-off-white/80">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-off-white/20 bg-transparent px-3 py-2 text-off-white outline-none focus:border-golden"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-off-white/80">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-off-white/20 bg-transparent px-3 py-2 text-off-white outline-none focus:border-golden"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-saffron py-2 font-heading font-semibold text-off-white transition hover:bg-golden hover:text-deep-blue disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
