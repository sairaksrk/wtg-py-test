import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { loadI18nTranslations } from "./loader"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale

	const messages = loadI18nTranslations("/locales/", locale)

	return {
		locale,
		messages,
	}
})
