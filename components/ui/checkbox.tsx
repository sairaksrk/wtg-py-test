"use client"

import { Icon } from "@iconify/react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import * as React from "react"
import { cn } from "@/utils/helpers"

function Checkbox({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { ref?: React.RefObject<React.ComponentRef<typeof CheckboxPrimitive.Root> | null> }) {
	return (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cn(
				"peer h-5 w-5 shrink-0 rounded-sm border ring-success hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
				<Icon icon="lucide:check" className="h-4 w-4" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
