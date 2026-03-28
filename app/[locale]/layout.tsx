import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { Pridi } from "next/font/google"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import Layouts from "@/layouts"
import "@/styles/globals.css"

const pridiSans = Pridi({
	weight: ["200", "300", "400", "500", "600", "700"],
	subsets: ["thai"],
	display: "swap",
	variable: "--font-pridi",
})

export const metadata: Metadata = {
	title: "We Together",
	description: "We Together",
}

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }))
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params

	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	return (
		<html lang={locale}>
			<body
				className={`${pridiSans.className} antialiased`}
				suppressHydrationWarning
			>
				<NextIntlClientProvider>
					<Layouts>
						{children}
						<div id="portal"></div>
					</Layouts>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
