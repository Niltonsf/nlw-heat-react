import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

// Typescript types
interface AuthProviderProps {
	children: ReactNode;
}

// Typescript types
interface UserProps {
	id: string;
	name: string;
	login: string;
	avatar_url: string;
}

// Typescript types
interface AuthContextProps {
	user: UserProps | null;
	signInUrl: string;
	signOut: () => void;
}

// Typescript types
interface AuthResponseProps {
	token: string;
	user: {
		id: string;
		avatar_url: string;
		name: string;
		login: string;
	}
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {

	const [ user, setUser ] = useState<UserProps | null>(null);

	const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=5c2ba68a3072c25eb7ca`

	// Sign In into github
	async function signIn(githubCode: string){
		const response = await api.post<AuthResponseProps>('authenticate', {
			code: githubCode,
		});

		const { token, user } = response.data;

		localStorage.setItem('@dowhile:token', token);

		api.defaults.headers.common.authorization = `Bearer ${token}`;
		
		setUser(user);
	}

	// SignOut of user
	function signOut() {
		setUser(null);
		localStorage.removeItem('@dowhile:token');
	}

	// Get user token through header
	useEffect(() => {
		const url = window.location.href;
		const hasGitHubCode = url.includes('?code=');

		if (hasGitHubCode) {
			const [ urlWhithoutCode, githubCode ] = url.split('?code=');

			window.history.pushState({}, '', urlWhithoutCode);

			signIn(githubCode);
		}
	}, [])

	// Get token if user is already logged in
	useEffect(() => {
		const token = localStorage.getItem('@dowhile:token');

		if (token) {
			api.defaults.headers.common.authorization = `Bearer ${token}`;

			api.get<UserProps>('profile').then(response => {
				setUser(response.data);
			})
		}
	})

	return (
		<AuthContext.Provider value={{ user, signInUrl, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}