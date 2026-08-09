"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/useMe";
import { useChangePassword } from "../../features/student/useChangePassword";
import { ApiClientError } from "../../lib/api/client";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <p className="p-10">Loading...</p>;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not change password");
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-24">
      <div>
        <h1 className="font-display text-3xl font-bold text-deep-blue">Set a new password</h1>
        {user.mustChangePassword && (
          <p className="mt-2 text-sm text-deep-blue/80">
            You're logging in with a temporary password. Set a new one to continue.
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Current (temporary) password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="rounded-md border border-soft-blue px-4 py-2"
        />
        <input
          type="password"
          placeholder="New password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="rounded-md border border-soft-blue px-4 py-2"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-md border border-soft-blue px-4 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={changePassword.isPending}
          className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {changePassword.isPending ? "Updating..." : "Update password"}
        </button>
      </form>
    </main>
  );
}
