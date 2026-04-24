'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UserRole = 'tenant' | 'landlord' | 'admin';
export type CurrentUser = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	verified: boolean;
	token: string;
};

type Ctx = {
	currentUser: CurrentUser | null;
	setUser: (u: CurrentUser | null) => void;
	logout: () => void;
};

const UserContext = createContext<Ctx | null>(null);

const LS_KEY = 'rentp.token';

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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
				setCurrentUser(null);
				return;
			}
			try {
				const res = await fetch('/api/auth/me', {
					headers: { authorization: `Bearer ${token}` },
				});
				if (!res.ok) {
					setCurrentUser(null);
					return;
				}
				const data = await res.json();
				setCurrentUser({ ...data.user, token });
			} catch {
				setCurrentUser(null);
			}
		})();
	}, [token]);

	const api = useMemo<Ctx>(
		() => ({
			currentUser,
			setUser: (u) => {
				setCurrentUser(u);
				try {
					if (u?.token) localStorage.setItem(LS_KEY, u.token);
					else localStorage.removeItem(LS_KEY);
				} catch {
					// ignore
				}
				setToken(u?.token ?? null);
			},
			logout: () => {
				setCurrentUser(null);
				setToken(null);
				try {
					localStorage.removeItem(LS_KEY);
				} catch {
					// ignore
				}
			},
		}),
		[currentUser]
	);

	return <UserContext.Provider value={api}>{children}</UserContext.Provider>;
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
	return ctx;
}
