'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AuthRole = 'tenant' | 'landlord' | 'admin';
export type AuthUser = { id: string; name: string; email: string; role: AuthRole };

type Ctx = {
	user: AuthUser | null;
	token: string | null;
	login: (payload: { token: string; user: AuthUser }) => void;
	logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);
const LS_KEY = 'rentp.token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		try {
			const t = localStorage.getItem(LS_KEY);
			if (t) setToken(t);
		} catch {
			// ignore
		}
	}, []);

	useEffect(() => {
		(async () => {
			if (!token) {
				setUser(null);
				return;
			}
			try {
				// keep middleware cookie in sync (httpOnly not possible here; use normal cookie)
				document.cookie = `rentp.token=${token}; path=/; SameSite=Lax`;
				const res = await fetch('/api/auth/me', { headers: { authorization: `Bearer ${token}` } });
				if (!res.ok) {
					setUser(null);
					return;
				}
				const data = await res.json();
				setUser(data.user);
			} catch {
				setUser(null);
			}
		})();
	}, [token]);

	const api = useMemo<Ctx>(
		() => ({
			user,
			token,
			login: ({ token: t, user: u }) => {
				setToken(t);
				setUser(u);
				try {
					localStorage.setItem(LS_KEY, t);
				} catch {
					// ignore
				}
				document.cookie = `rentp.token=${t}; path=/; SameSite=Lax`;
			},
			logout: () => {
				setToken(null);
				setUser(null);
				try {
					localStorage.removeItem(LS_KEY);
				} catch {
					// ignore
				}
				document.cookie = 'rentp.token=; path=/; Max-Age=0';
			},
		}),
		[user, token]
	);

	return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
	return ctx;
}
