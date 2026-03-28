import { customSessionClient, usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`, // Points to NestJS Backend
	fetchOptions: {
		// Required so browser will store/send Better Auth cookies.
		credentials: "include",
		headers: {
			"x-api-key": String(process.env.NEXT_PUBLIC_X_API_KEY) || "",
		},
	},
	plugins: [
		usernameClient(),
		customSessionClient(),
	],
})

export interface CustomSession {
	menu: {
		id: string
		code: string
		nameTh: string
		nameEn: string
		furl: string
		burl: string
		icon: string
		modules: ModulesMenu[]
	}[]// Add the user object so TypeScript knows about it!
	user: {
		id: string
		email: string
		username: string
	}
}
interface ModulesMenu {
	id: string
	parentId: string
	nameTh: string
	nameEn: string
	type: "MENU" | "ACTION"
	url: string
	modules: ModulesMenu[]
}

// You can create a typed hook wrapper
export function useSession() {
	const { data, isPending, isRefetching, error, refetch } = authClient.useSession()

	let mappedData = data as any

	if (mappedData?.user) {
		mappedData = {
			...mappedData,
			user: {
				...mappedData.user,
				email: mappedData.user.realEmail || mappedData.user.email,
				username: mappedData.user.username || mappedData.user.email,
			},
		}
		delete mappedData.user.realEmail
	}

	return {
		data: mappedData as CustomSession | null,
		isPending,
		isRefetching,
		error,
		refetch,
	}
}

export const { signIn, signOut, signUp } = authClient
