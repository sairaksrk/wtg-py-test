import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
	locales: ["th", "en"],
	defaultLocale: "th",
	alternateLinks: false,
	localeDetection: false,
	localePrefix: "as-needed",
})
