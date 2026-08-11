"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth/useMe";
import { ApiClientError } from "../../../lib/api/client";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "student" | "">("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!role) {
      setError("Please select whether you're a parent or a student.");
      return;
    }
    setSubmitting(true);
    try {
      await register({ fullName, email, password, role });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-24">
      <h1 className="font-display text-3xl font-bold text-deep-blue">Create your account</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-md border border-soft-blue px-4 py-2"
        />
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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-soft-blue px-4 py-2"
        />

        <div>
          <p className="mb-2 text-sm font-medium text-deep-blue">I am a...</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 rounded-md border px-4 py-2.5 text-sm font-medium ${
                role === "student"
                  ? "border-sage-green bg-sage-green text-white"
                  : "border-soft-blue text-deep-blue"
              }`}
            >
              Student (I'm booking for myself)
            </button>
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={`flex-1 rounded-md border px-4 py-2.5 text-sm font-medium ${
                role === "parent"
                  ? "border-sage-green bg-sage-green text-white"
                  : "border-soft-blue text-deep-blue"
              }`}
            >
              Parent (I'm booking for my child)
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="text-sm">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-deep-blue underline">
          Log in
        </a>
      </p>
    </main>
  );
}
