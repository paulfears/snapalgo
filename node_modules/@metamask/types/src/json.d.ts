/**
 * Represents valid JSON values.
 *
 * This type is meant to exclude any values that are ignored or converted when
 * they are serialized as JSON. For example, `JSON.stringify` will omit
 * functions and coerce `NaN` to `null` during serialization, so both are
 * excluded from this type.
 *
 * This type is imperfect; there are some invalid JSON values that TypeScript
 * will allow to be assigned this type, and there are some valid JSON values
 * that it won't allow. For example, the `any` type is assignable to `Json`,
 * even though it may be set to an unserialized value. See the test suite for a
 * full list of known edge cases.
 */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json };
