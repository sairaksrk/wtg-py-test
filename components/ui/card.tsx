import * as React from "react"

import { cn } from "@/utils/helpers"

function Card({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
	return (
		<div
			ref={ref}
			className={cn("rounded-3xl bg-card text-card-foreground", className)}
			{...props}
		/>
	)
}
Card.displayName = "Card"

function CardHeader({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
	return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}
CardHeader.displayName = "CardHeader"

function CardTitle({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
	return <div ref={ref} className={cn("text-lg leading-none font-semibold tracking-tight", className)} {...props} />
}
CardTitle.displayName = "CardTitle"

function CardDescription({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
	return <div ref={ref} className={cn("text-md text-muted-foreground", className)} {...props} />
}
CardDescription.displayName = "CardDescription"

const CardContent = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
CardContent.displayName = "CardContent"

function CardFooter({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
	return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
}
CardFooter.displayName = "CardFooter"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
