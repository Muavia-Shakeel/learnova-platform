"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth/useMe";
import { ApiClientError } from "../../../lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needsTotp, setNeedsTotp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password, totpCode: totpCode || undefined });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "TOTP_REQUIRED") {
        setNeedsTotp(true);
        setError("Enter your 2FA code");
      } else {
        setError(err instanceof ApiClientError ? err.message : "Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-24">
      <h1 className="font-display text-3xl font-bold text-deep-blue">Log in</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-soft-blue px-4 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-soft-blue px-4 py-2"
        />
        {needsTotp && (
          <input
            type="text"
            placeholder="6-digit 2FA code"
            required
            maxLength={6}
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2"
          />
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="text-sm">
        No account yet?{" "}
        <a href="/register" className="font-medium text-deep-blue underline">
          Sign up
        </a>
      </p>
    </main>
  );
}
