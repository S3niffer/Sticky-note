import EnNumTranslatorToFa from "../Utils/EnNumTranslatorToFa";

const Fa_30Day = `ماه (${EnNumTranslatorToFa(30)} روز)` as const;
const Fa_365Day = `سال (${EnNumTranslatorToFa(365)} روز)` as const;

export const _1min = 60 * 1000;

export const Times = [
    {
        id: crypto.randomUUID(),
        unit: "دقیقه",
        milliseconds: _1min,
    },
    {
        id: crypto.randomUUID(),
        unit: "ساعت",
        milliseconds: _1min * 60,
    },
    {
        id: crypto.randomUUID(),
        unit: "روز",
        milliseconds: _1min * 60 * 24,
    },
    {
        id: crypto.randomUUID(),
        unit: "هفته",
        milliseconds: _1min * 60 * 24 * 7,
    },
    {
        id: crypto.randomUUID(),
        unit: Fa_30Day,
        milliseconds: _1min * 60 * 24 * 30,
    },
    {
        id: crypto.randomUUID(),
        unit: Fa_365Day,
        milliseconds: _1min * 60 * 24 * 365,
    },
] as const;

export type TimesUnit = (typeof Times)[number]['unit']
