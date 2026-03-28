"use client"

import type { ToasterProps } from "sonner"
import { Icon } from "@iconify/react"
import { Toaster as Sonner } from "sonner"

function Toaster({ ...props }: ToasterProps) {
	return (
		<Sonner
			className="toaster group"
			position="top-center"

			icons={{
				success: <Icon icon="solar:check-circle-outline" className="text-primary size-4" />,
				info: <Icon icon="iconamoon:information-circle" className="text-primary size-4" />,
				warning: <Icon icon="gravity-ui:circle-exclamation" className="text-warning size-4" />,
				error: <Icon icon="bx:x-circle" className="text-destructive size-4" />,
				loading: <Icon icon="mdi:loading" className="text-primary size-4 animate-spin" />,
			}}
			{...props}
		/>
	)
}

export { Toaster }
