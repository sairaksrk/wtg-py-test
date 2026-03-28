"use client"

import { Icon } from "@iconify/react"

import { useTranslations } from "next-intl"
import * as React from "react"
import { FieldError } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MasterSelectProps } from "@/types/api"
import { cn } from "@/utils/helpers"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"

interface ComboBoxProps {
	options?: MasterSelectProps[]
	placeholder?: string
	value?: string | number | null
	valueType?: "string" | "number"
	onChange?: (value: string | number) => void
	isError?: FieldError
	disabled?: boolean
	label?: string
	floatingLabel?: boolean
	required?: boolean
	error?: string
}

export function Combobox(props: ComboBoxProps) {
	const c = useTranslations("common")
	const {
		options,
		placeholder,
		value,
		valueType = "number",
		onChange,
		isError = false,
		disabled = false,
		label,
		floatingLabel = false,
		required = false,
		error,
	} = props
	const defaultPlaceholder = placeholder || c("search-placeholder")
	const [open, setOpen] = React.useState(false)
	const [isFocused, setIsFocused] = React.useState(false)
	const triggerRef = React.useRef<HTMLButtonElement>(null)
	const selectedOption = options?.find(option => option.value == value)

	const hasValue = () => {
		return value !== undefined && value !== null && value !== ""
	}

	const isLabelFloating = floatingLabel && (isFocused || hasValue())

	return (
		<div className="relative w-full">
			<div className="relative">
				{floatingLabel && label && (
					<label
						className={cn(
							"absolute left-4 transition-all duration-200 ease-out cursor-pointer pointer-events-none z-10",
							isLabelFloating
								? "top-2 text-sm text-subdude"
								: "top-1/2 -translate-y-1/2 text-base text-foreground",
							disabled ? "opacity-60" : "",
						)}
						onClick={() => triggerRef.current?.click()}
					>
						{label}
						{required && <span className="text-destructive"> *</span>}
					</label>
				)}
				<Popover
					open={open}
					onOpenChange={(isOpen) => {
						setOpen(isOpen)
						setIsFocused(isOpen)
					}}
				>
					<PopoverTrigger asChild>
						<Button
							ref={triggerRef}
							variant="combobox"
							role="combobox"
							aria-expanded={open}
							className={cn(
								"flex w-full h-14 min-w-0 rounded-xl border bg-background px-4 text-base shadow-xs transition-[color,box-shadow] outline-none",
								"hover:bg-background",
								"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
								"disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled",
								floatingLabel && label && isLabelFloating ? "pt-6 pb-2" : "py-2",
								selectedOption ? "text-foreground" : "text-muted-foreground",
								isError || error ? "border-destructive" : "border-input",
							)}
							disabled={disabled}
							onFocus={() => setIsFocused(true)}
							onBlur={() => !open && setIsFocused(false)}
						>
							<div className="flex w-full items-center justify-between">
								<div
									className={cn(
										"truncate text-left",
										floatingLabel && label && isLabelFloating ? "mt-1" : "",
									)}
								>
									{selectedOption !== undefined ? selectedOption?.label : (floatingLabel ? "" : defaultPlaceholder)}
								</div>
								<Icon
									icon="lucide:chevron-down"
									className={cn(
										"ml-2 h-4 w-4 shrink-0 opacity-50",
										floatingLabel && label && isLabelFloating ? "-mt-3" : "",
									)}
								/>
							</div>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
						<Command>
							<CommandInput placeholder={defaultPlaceholder} />
							<CommandList>
								<CommandEmpty>{c("not-found")}</CommandEmpty>
								<CommandGroup>
									{options?.map((option, index) => {
										const uniqueValue = `${option.value}::${option.label}`
										return (
											<CommandItem
												value={uniqueValue}
												key={uniqueValue}
												data-checked={value == option.value ? "true" : undefined}
												onSelect={(currentValue) => {
													const selectedValue = currentValue.split("::")[0]
													onChange?.(valueType == "string" ? selectedValue : Number(selectedValue))
													setOpen(false)
												}}
											>
												{option.label}
											</CommandItem>
										)
									})}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
			{(error || (isError && typeof isError === "object" && "message" in isError)) && (
				<p className="text-destructive mt-1.5 text-sm">
					{error || (typeof isError === "object" && "message" in isError ? isError.message : "")}
				</p>
			)}
		</div>
	)
}
