import { en, type Dictionary } from './en'
import { ru } from './ru'
import { zh } from './zh'

export const dictionaries = { en, ru, zh } satisfies Record<string, Dictionary>
export type Locale = keyof typeof dictionaries
export const locales = Object.keys(dictionaries) as Locale[]
export const defaultLocale: Locale = 'en'
export const hasLocale = (l: string): l is Locale => l in dictionaries
export type { Dictionary }
