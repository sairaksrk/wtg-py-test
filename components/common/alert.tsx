import { Icon } from "@iconify/react"
import { AnimatePresence, motion } from "framer-motion"
import { uniqueId } from "lodash"
import { useTranslations } from "next-intl"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useEffect } from "react"
import { cn } from "@/utils/helpers"
import { Button } from "../ui/button"

type AlertType = "success" | "error" | "warning" | "delete"

interface AlertButtonConfig {
	label?: string
	onClick?: () => void
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
	className?: string
	show?: boolean
}

interface AlertProps {
	open: boolean
	type: AlertType
	title: string
	description?: string
	onClose?: () => void
	// Fixed button configurations
	confirmButton?: AlertButtonConfig
	cancelButton?: AlertButtonConfig
	closeButton?: AlertButtonConfig
}

const alertConfig = {
	success: {
		icon: "solar:check-circle-outline",
		iconColor: "text-success",
	},
	error: {
		icon: "solar:danger-circle-outline",
		iconColor: "text-destructive",
	},
	warning: {
		icon: "solar:danger-circle-outline",
		iconColor: "text-warning",
	},
	delete: {
		icon: "solar:trash-bin-trash-outline",
		iconColor: "text-destructive",
	},
}

export default function Alert({
	open,
	type,
	title,
	description,
	onClose,
	confirmButton,
	cancelButton,
	closeButton,
}: AlertProps) {
	const t = useTranslations("common")

	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				document.body.style.pointerEvents = ""
			}, 0)
			return () => clearTimeout(timer)
		}
		else {
			document.body.style.pointerEvents = "auto"
		}
	}, [open])

	const avoidDefaultDomBehavior = (e: Event) => {
		e.preventDefault()
	}

	const config = alertConfig[type]

	// Merge default button configs with provided configs
	const finalConfirmButton = {
		label: t("button.close"),
		variant: "default" as const,
		show: true,
		...confirmButton,
	}

	const finalCancelButton = {
		label: t("button.cancel"),
		variant: "outline" as const,
		show: false,
		...cancelButton,
	}

	const finalCloseButton = {
		show: true,
		...closeButton,
	}

	// Determine which action buttons to show
	const actionButtons = [
		finalCancelButton.show && finalCancelButton,
		finalConfirmButton.show && finalConfirmButton,
	].filter(Boolean) as AlertButtonConfig[]

	return (
		<DialogPrimitive.Root
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen && onClose)
					onClose()
			}}
		>
			<AnimatePresence>
				{open && (
					<DialogPrimitive.Portal forceMount>
						<DialogPrimitive.Overlay
							forceMount
							asChild
							className="absolute inset-0 z-9000 h-full w-screen bg-black/40"
						>
							<motion.div
								className="backdrop"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							/>
						</DialogPrimitive.Overlay>
						<DialogPrimitive.Content
							asChild
							forceMount
							onPointerDownOutside={avoidDefaultDomBehavior}
							onInteractOutside={avoidDefaultDomBehavior}
							className="borderfocus:outline-none fixed top-[50%] left-[50%] z-9001 w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-white"
						>
							<motion.div
								initial={{ scale: 0.8, opacity: 0, y: 20 }}
								animate={{ scale: 1, opacity: 1, y: 0 }}
								exit={{ scale: 0.8, opacity: 0, y: 20 }}
								transition={{
									type: "spring",
									duration: 0.4,
									bounce: 0.3,
								}}
								className="dialog-body"
							>
								<DialogPrimitive.Title />
								<DialogPrimitive.Description />

								{/* Close Button (X icon) */}
								{finalCloseButton.show && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}
										className="absolute top-6 right-6"
									>
										<Button
											variant="linkBlack"
											size="icon"
											onClick={finalCloseButton.onClick || onClose}
											className={cn("size-4 rounded-full", finalCloseButton.className)}
										>
											<Icon icon="lucide:x" className="size-4" />
										</Button>
									</motion.div>
								)}

								{/* Content */}
								<div className="flex flex-col items-start px-6 py-6">
									{/* Icon with animation */}
									<motion.div
										initial={{ scale: 0, rotate: -180 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{
											type: "spring",
											delay: 0.1,
											duration: 0.6,
											bounce: 0.5,
										}}
										className={cn(
											"mb-4 flex size-10 border items-center justify-center rounded-full",
										)}
									>
										<Icon
											icon={config.icon}
											className={cn("size-4", config.iconColor)}
										/>
									</motion.div>

									{/* Title */}
									<motion.h2
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className="text-foreground mb-2 text-xl font-semibold"
									>
										{title}
									</motion.h2>

									{/* Description */}
									{description && (
										<motion.p
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.25 }}
											className="text-subdude mb-5 text-base"
										>
											{description}
										</motion.p>
									)}

									{/* Action Buttons (Cancel & Confirm) */}
									{actionButtons.length > 0 && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
											className={cn(
												"flex items-start w-full gap-3",
												actionButtons.length === 1 ? "justify-center" : "justify-between",
											)}
										>
											{actionButtons.map((button, _) => (
												<Button
													key={uniqueId()}
													variant={button.variant || "default"}
													onClick={button.onClick || onClose}
													className={cn(
														actionButtons.length === 1 ? "w-full" : "w-1/2",
														button.className,
													)}
												>
													{button.label}
												</Button>
											))}
										</motion.div>
									)}
								</div>
							</motion.div>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				)}
			</AnimatePresence>
		</DialogPrimitive.Root>
	)
}
