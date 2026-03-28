import { useCallback, useEffect, useState } from "react"

export function useTableState<T>(storageKey: string, initialState: T) {
	// 1. Simple Initialization (No performance API checks needed)
	const [state, setState] = useState<T>(() => {
		if (typeof window !== "undefined") {
			try {
				const saved = sessionStorage.getItem(storageKey)
				if (saved)
					return JSON.parse(saved)
			}
			catch (error) {
				console.warn(`Error reading storage key "${storageKey}":`, error)
			}
		}
		return initialState
	})

	// 2. Sync state to sessionStorage whenever it changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			sessionStorage.setItem(storageKey, JSON.stringify(state))
		}
	}, [storageKey, state])

	// 3. THE FIX: Only wipe the memory on a physical browser refresh or tab close
	useEffect(() => {
		const handleHardRefresh = () => {
			sessionStorage.removeItem(storageKey)
		}

		// Attach the listener
		window.addEventListener("beforeunload", handleHardRefresh)

		// If Next.js routes to the Edit page, the table unmounts, and we safely
		// remove this listener so it doesn't accidentally trigger later.
		return () => {
			window.removeEventListener("beforeunload", handleHardRefresh)
		}
	}, [storageKey])

	// 4. Manual reset utility
	const resetState = useCallback(() => {
		setState(initialState)
		if (typeof window !== "undefined") {
			sessionStorage.removeItem(storageKey)
		}
	}, [initialState, storageKey])

	return [state, setState, resetState] as const
}
