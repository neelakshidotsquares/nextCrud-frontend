"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { tokenStorage, userStorage } from "@/utils/storage";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { getUserId } from "@/services/endpoints";

const AuthContext = createContext(null);

/**
 * AuthProvider centralizes everything related to the logged-in user:
 *   - token + user persistence
 *   - login / register / logout
 *   - "refresh" to re-fetch the profile from the server
 *
 * It is mounted once at the root layout so any component can call useAuth().
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const t = tokenStorage.get();
    const u = userStorage.get();
    if (t) setToken(t);
    if (u) setUser(u);
    setInitializing(false);
  }, []);

  const persist = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      tokenStorage.set(nextToken);
      setToken(nextToken);
    }
    if (nextUser) {
      userStorage.set(nextUser);
      setUser(nextUser);
    }
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { token: t, user: u } = await authService.login(credentials);
      persist(t, u);
      return { token: t, user: u };
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      const { token: t, user: u } = await authService.register(payload);
      // Some APIs auto-login on register. If we got a token, persist it.
      if (t) persist(t, u);
      return { token: t, user: u };
    },
    [persist]
  );

  const refreshProfile = useCallback(async () => {
    const id = getUserId(user);
    if (!id) return null;
    const profile = await userService.getProfile(id);
    if (profile) {
      userStorage.set(profile);
      setUser(profile);
    }
    return profile;
  }, [user]);

  const updateUser = useCallback((nextUser) => {
    if (!nextUser) return;
    userStorage.set(nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    userStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      initializing,
      login,
      register,
      logout,
      refreshProfile,
      updateUser,
    }),
    [user, token, initializing, login, register, logout, refreshProfile, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
