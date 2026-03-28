"use client"

import React, { createContext, use, useCallback, useState } from "react"
import Alert from "./alert"

type AlertType = "success" | "error" | "warning" | "delete"

interface AlertButtonConfig {
	label?: string
	onClick?: () => void
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
	className?: string
	show?: boolean
}

interface AlertOptions {
	type: AlertType
	title: string
	description?: string
	confirmButton?: AlertButtonConfig
	cancelButton?: AlertButtonConfig
	closeButton?: AlertButtonConfig
	onClose?: () => void
}

interface AlertContextType {
	fire: (options: AlertOptions) => void
	close: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false)
	const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null)

	const fire = useCallback((options: AlertOptions) => {
		setAlertOptions(options)
		setIsOpen(true)
	}, [])

	const close = useCallback(() => {
		setIsOpen(false)
		if (alertOptions?.onClose) {
			alertOptions.onClose()
		}
	}, [alertOptions])

	const wrapButtonClick = (buttonConfig?: AlertButtonConfig) => {
		if (!buttonConfig)
			return undefined

		return {
			...buttonConfig,
			onClick: () => {
				if (buttonConfig.onClick) {
					buttonConfig.onClick()
				}
				close()
			},
		}
	}

	return (
		<AlertContext value={{ fire, close }}>
			{children}
			{alertOptions && (
				<Alert
					open={isOpen}
					type={alertOptions.type}
					title={alertOptions.title}
					description={alertOptions.description}
					confirmButton={wrapButtonClick(alertOptions.confirmButton)}
					cancelButton={wrapButtonClick(alertOptions.cancelButton)}
					closeButton={alertOptions.closeButton
						? {
								...alertOptions.closeButton,
								onClick: alertOptions.closeButton.onClick
									? () => {
											alertOptions.closeButton!.onClick!()
											close()
										}
									: close,
							}
						: undefined}
					onClose={close}
				/>
			)}
		</AlertContext>
	)
}

export function useAlert() {
	const context = use(AlertContext)
	if (!context) {
		throw new Error("useAlert must be used within an AlertProvider")
	}
	return context
}
