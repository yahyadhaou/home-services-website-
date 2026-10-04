import { en, type Content } from "./en";
import { de } from "./de";
import type { Locale } from "@/data/screens";

export const LOCALES: Locale[] = ["en", "de"];
export const DEFAULT_LOCALE: Locale = "en";

const DICT: Record<Locale, Content> = { en, de };

export const getContent = (locale: Locale): Content => DICT[locale];
export const isLocale = (v: unknown): v is Locale => v === "en" || v === "de";

export const CONTACT_EMAIL = "dhaou.yahya98@gmail.com";
