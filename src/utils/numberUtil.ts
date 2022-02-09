import { DECIMAL_FIXED_SIZE } from "./constants";

export function fixedNumber(num: number): number {
    return Number(num.toFixed(DECIMAL_FIXED_SIZE));
}