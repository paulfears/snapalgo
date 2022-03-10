/**
 * A string prefixed with "0x". This usually indicates that the string is a
 * hexadecimal number.
 *
 * Note that this type doesn't ensure the string is a valid hexadecimal value.
 * It only matches the "0x" prefix.
 */
export type HexPrefixed = `0x${string}`;
