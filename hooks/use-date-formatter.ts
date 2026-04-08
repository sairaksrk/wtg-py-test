import { addYears, format } from "date-fns";
import { enUS, th } from "date-fns/locale";
import { useLocale } from "next-intl";

const locales = { th, en: enUS };

export function useDateFormatter() {
  const locale = useLocale(); // Grabs 'th' or 'en' automatically from next-intl context

  const formatToBuddhist = (
    epoch: number,
    formatStr = "dd MMM yyyy HH:mm น.",
  ): string => {
    // const formatToBuddhist = (epoch: number, formatStr = "dd MMM yyyy"): string => {
    if (!epoch) return "";
    const date = new Date(Number(epoch));

    if (locale === "en") formatStr = formatStr.replaceAll("น.", "");

    const selectedLocale = locales[locale as keyof typeof locales] || enUS;

    // Add 543 years if the active locale is Thai
    const displayDate = locale === "th" ? addYears(date, 543) : date;

    return format(displayDate, formatStr, { locale: selectedLocale });
  };

  return { formatToBuddhist, locale };
}
