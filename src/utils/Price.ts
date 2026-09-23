/**
 * Turns rendered money ("$14.15", "€1.234,50") into a number.
 * The app is localised, so never compare price strings directly.
 */

import { text } from "stream/iter";

export function parsePrice(text: string): number {
    const cleaned = text.replace(/[^\d.,]/g, '').trim();

    // If both separators appear, the last one is the decimal separator
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    
    let normalised: string;
    if (lastComma > lastDot) {
        normalised = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
        normalised = cleaned.replace(/,/g, '');
    }

    const value = Number(normalised);
    if (Number.isNaN(value)) {
        throw new Error(`Could not parse price from "${text}"`);
    }
    return value;
}

// Guards against float drift when checking line totals
export function roundToCents(value: number): number {
    return Math.round(value * 100) / 100;
}