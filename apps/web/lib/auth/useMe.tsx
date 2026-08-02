"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Role, LoginInput, RegisterInput } from "@learnova/shared-types";
import { apiFetch } from "../api/client";

interface CurrentUser {
  _id: string;
  email: string;
  fullName: string;
  role: Role;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: CurrentUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "learnova.auth";

function readStoredTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthTokens) : null;
}

function writeStoredTokens(tokens: AuthTokens | null) {
  if (typeof window === "undefined") return;
  if (tokens) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  else window.localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async (token: string) => {
    const me = await apiFetch<CurrentUser>("/api/auth/me", { token });
    setUser(me);
  }, []);

  useEffect(() => {
    const stored = readStoredTokens();
    if (!stored) {
      setLoading(false);
      return;
    }
    setAccessToken(stored.accessToken);
    loadMe(stored.accessToken)
      .catch(() => {
        writeStoredTokens(null);
        setAccessToken(null);
      })
      .finally(() => setLoading(false));
  }, [loadMe]);

  const login = useCallback(
    async (input: LoginInput) => {
      const tokens = await apiFetch<AuthTokens>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      });
      writeStoredTokens(tokens);
      setAccessToken(tokens.accessToken);
      await loadMe(tokens.accessToken);
    },
    [loadMe],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const tokens = await apiFetch<AuthTokens>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });
      writeStoredTokens(tokens);
      setAccessToken(tokens.accessToken);
      await loadMe(tokens.accessToken);
    },
    [loadMe],
  );

  const logout = useCallback(() => {
    writeStoredTokens(null);
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, loading, login, register, logout }),
    [user, accessToken, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
