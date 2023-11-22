import { type IFieldPrimitive } from '../index.js'
import { type Rule } from './base.js'

export type InferRules<T> = T extends Array<infer R>
  ? RulesList<R>
  : T extends Record<any, any>
  ? RulesMap<T>
  : T extends string
  ? RulesString<T>
  : T extends number
  ? RulesNumber
  : T extends boolean
  ? RulesBoolean
  : never

export interface In {}
export interface Eq {}
export interface Neq {}
export interface Gt {}
export interface Lt {}
export interface Gte {}
export interface Lte {}
export interface Add {}
export interface Sub {}
export interface Div {}
export interface Mult {}
export interface Mod {}
export interface Operators {
  /** Check that a value is of some primitive type */
  is: (a: Rule, type: IFieldPrimitive) => RulesBoolean
  and: (...args: (RulesBoolean | string)[]) => RulesBoolean
  or: (...args: (RulesBoolean | string)[]) => RulesBoolean
  in: In
  eq: Eq
  neq: Neq
  gt: Gt
  lt: Lt
  gte: Gte
  lte: Lte
  add: Add
  sub: Sub
  div: Div
  mult: Mult
  mod: Mod
}

// Interfaces
// ----------------------------------------------------------------------
/**
 * Primitive type representing a boolean value, true or false.
 * Boolean values can be compared using the == and != operators.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Boolean}
 * */
export interface RulesBoolean extends Rule<boolean> {}
export interface Eq {
  /** True if a is equal to b */
  (a: RulesBoolean, b: boolean | RulesBoolean | null): RulesBoolean
}
export interface Neq {
  /** True if a is not equal to b */
  (a: RulesBoolean, b: boolean | RulesBoolean | null): RulesBoolean
}
/**
 * Primitive type representing a boolean value, true or false.
 * Boolean values can be compared using the == and != operators.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Bytes}
 * */
export interface RulesBytes extends Rule {
  /** Returns the number of bytes in a Bytes sequence. */
  size: () => RulesInteger
  /** Returns the Base64-encoded string corresponding to the provided Bytes sequence. */
  toBase64: () => RulesString
  /** Returns the hexadecimal-encoded string corresponding to the provided Bytes sequence. */
  toHexString: () => RulesString
}

/**
 * Primitive type representing a boolean value, true or false.
 * Boolean values can be compared using the == and != operators.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Duration}
 * */
export interface RulesDuration extends Rule {
  /** Get the nanoseconds portion (signed) of the duration from -999,999,999 to +999,999,999 inclusive. */
  nanos: () => RulesInteger
  /** Get the seconds portion (signed) of the duration from -315,576,000,000 to +315,576,000,000 inclusive. */
  seconds: () => RulesInteger
}

/**
 * Primitive type representing a 64-bit IEEE floating point number.
 * Floats can be compared using the ==, !=, >, <, >= and <= operators.
 * Floats support the arithmetic operators +, -, /, *, and %.
 * Floats can be negated using the - prefix.
 * String and integer values can be converted to float values using the float() function:
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Float}
 * */
export interface RulesFloat extends Rule<number> {}
export interface Eq {
  /** True if a is equal to b */
  (a: RulesNumber, b: number | RulesNumber | null): RulesBoolean
}
export interface Neq {
  /** True if a is not equal to b */
  (a: RulesNumber, b: number | RulesNumber | null): RulesBoolean
}
export interface Gt {
  /** True if a is greater than b */
  (a: RulesNumber, b: number | RulesNumber | null): RulesBoolean
}
export interface Lt {
  /** True if a is less than b */
  (a: RulesNumber, b: number | RulesNumber | null): RulesBoolean
}
export interface Gte {
  /** True if a is greater than or equal to b */
  (a: RulesNumber, b: number | RulesNumber | null): RulesBoolean
}
export interface Lte {
  /** True if a is less than or equal to b */
  (a: RulesNumber, b: number | RulesNumber | null): RulesBoolean
}
export interface Add {
  /** Add b to a */
  (a: RulesFloat, b: number | RulesNumber | null): RulesFloat
}
export interface Sub {
  /** Subtract b from a */
  (a: RulesFloat, b: number | RulesNumber | null): RulesFloat
}
export interface Div {
  /** Divide a by b */
  (a: RulesFloat, b: number | RulesNumber | null): RulesFloat
}
export interface Mult {
  /** Multiply a by b */
  (a: RulesFloat, b: number | RulesNumber | null): RulesFloat
}
export interface Mod {
  /** Modulas a by b */
  (a: RulesFloat, b: number | RulesNumber | null): RulesFloat
}

/**
 * Primitive type representing a signed 64-bit integer value.
 * Integers can be compared using the ==, !=, >, <, >= and <= operators.
 * Integers support the arithmetic operators +, -, /, *, and %.
 * Integers can be negated using the - prefix.
 * Integer values will be coerced to type rules.Float when used in comparison or arithmetic operations with a float value.
 * String and float values can be converted to integers using the int() function:
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Integer}
 */
export interface RulesInteger extends RulesFloat {}

/**
 * Type representing a geopoint. Used in rules as latlng.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.LatLng}
 * */
export interface RulesLatLng {
  /** Calculate distance between two LatLng points in distance (meters). */
  distance: (other: RulesLatLng) => RulesFloat
  /** Get the latitude value in the range [-90.0, 90.0]. */
  latitude: () => RulesFloat
  /** Get the longitude value in the range [-180.0, 180.0]. */
  longitude: () => RulesFloat
}

/**
 * List type. Items are not necessarily homogenous.
 *
 * In addition to the methods listed below, lists have the following operators:
 * Operator	Usage
 * x == y	Compare lists x and y
 * x[i]	Index operator, get value index i
 * x[i:j]	Range operator, get sublist from index i to j
 * v in x
 * Check if value v exists in list x.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.List}
 */
export interface RulesList<T> extends Rule<T[]> {
  [x: number]: InferRules<T>
  [x: `${number}:${number}`]: RulesList<T>
  /** Create a new list by adding the elements of another list to the end of this list. */
  concat: (list: T[] | RulesList<T>) => RulesList<T>
  /** Determine whether the list contains all elements in another list. */
  hasAll: (list: T[] | RulesList<T>) => RulesBoolean
  /** Determine whether the list contains any element in another list. */
  hasAny: (list: T[] | RulesList<T>) => RulesBoolean
  /** Determine whether all elements in the list are present in another list. */
  hasOnly: (list: T[] | RulesList<T>) => RulesBoolean
  /** Join the elements in the list into a string, with a separator. */
  join: (sep: string | RulesString) => RulesString
  /** Create a new list by removing the elements of another list from this list. */
  removeAll: (list: T[] | RulesList<T>) => RulesList<T>
  /** Get the number of values in the list. */
  size: () => RulesInteger
  /**
   * Returns a set containing all unique elements in the list.
   * In case that two or more elements are equal but non-identical, the result set will only contain the first element in the list. The remaining elements are discarded.
   * */
  toSet: () => RulesSet<T>
}

export interface Eq {
  <T>(list: RulesList<T>, v: T[] | RulesList<T>): RulesBoolean
}

export interface In {
  <T>(list: RulesList<T>, v: T | InferRules<T>): RulesBoolean
}

/**
 * Map type, used for simple key-value mappings.
 * Keys must be of type rules.String.
 * In addition to the methods listed below, maps have the following operators:
 *
 * Operator	Usage
 * x == y	Compare maps x and y
 * x[k]	Index operator, get value at key name k
 * x.k	Get value at key name k
 * k in x	Check if key k exists in map x
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Map}
 */
export type RulesMap<T extends Record<string, any> = {}> = Rule<T> & {
  /** Return a rules.MapDiff representing the result of comparing the current Map to a comparison Map. */
  diff: (m: Partial<T>) => RulesMapDiff<T>
  /**
   * Returns the value associated with a given search key string.
   * For nested Maps, involving keys and sub-keys, returns the value associated with a given sub-key string.
   * The sub-key is identified using a list, the first item of which is a top-level key and the last item the sub-key whose value is to be looked up and returned. See the nested Map example below.
   * The function requires a default value to return if no match to the given search key is found.
   */
  get: {
    <K extends keyof T>(key: K, default_value: T[K] | null): InferRules<T[K]>
    // TODO key list
  }
  /** Get the list of keys in the map. */
  keys: () => RulesList<string>
  /** Get the number of entries in the map. */
  size: () => RulesInteger
  /** Get the list of values in the map. */
  values: () => RulesList<T[keyof T]>
} & { [K in keyof T]: InferRules<T[K]> }

export interface Eq {
  <T extends Record<string, any> = {}>(list: RulesMap<T>, v: T | RulesMap<T>): RulesBoolean
}

export interface In {
  <T extends Record<string, any> = {}>(list: RulesMap<T>, v: string | RulesString): RulesBoolean
}

/**
 * MapDiff type.
 * The MapDiff type represents the result of comparing two rules.Map objects.
 * There is no MapDiff literal for use in creating diffs. MapDiff objects are returned by calls to the rules.Map#diff function.
 * The MapDiff functions described below are called by chaining with rules.Map#diff. All MapDiff functions return rules.Set objects listing keys compared between Map objects.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.MapDiff}
 * */
export type RulesMapDiff<T extends Record<string, any> = {}> = Rule & {
  /** Returns a rules.Set, which lists any keys that the Map calling diff() contains that the Map passed to diff() does not. */
  addedKeys: () => RulesSet<string>
  /** Returns a rules.Set, which lists any keys that have been added to, removed from or modified from the Map calling diff() compared to the Map passed to diff(). This function returns the set equivalent to the combined results of MapDiff.addedKeys(), MapDiff.removedKeys() and MapDiff.changedKeys(). */
  affectedKeys: () => RulesSet<string>
  /** Returns a rules.Set, which lists any keys that appear in both the Map calling diff() and the Map passed to diff(), but whose values are not equal. */
  changedKeys: () => RulesSet<string>
  /** Returns a rules.Set, which lists any keys that the Map calling diff() does not contain compared to the Map passed to diff(). */
  removedKeys: () => RulesSet<string>
  /** Returns a rules.Set, which lists any keys that appear in both the Map calling diff() and the Map passed to diff(), and whose values are equal. */
  unchangedKeys: () => RulesSet<string>
} & { [K in keyof T]: InferRules<T[K]> }

/** A value of type Integer or type Float */
export type RulesNumber = RulesFloat | RulesInteger

/**
 * Directory-like pattern for the location of a resource. Paths can be created in two ways.
 *
 * The first is in the "raw" form beginning with a forward slash /:
 * /path/to/resource
 *
 * The second is by converting from a string using the path() function:
 * path("path/to/resource")
 *
 * In addition to the methods listed below, paths have the following operators:
 * Operator	Usage
 * x == y	Compare paths x and y
 * x[f]	Index operator, get value at binding field name f
 * x[i]	Index operator, get value at numeric index i
 * x.f	Value at binding field name f
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Path}
 */
export type RulesPath<T extends Record<string, any> = Record<string, any>> = Rule & {
  /** Bind key-value pairs in a map to a path. */
  bind: <A extends Record<string, any>>(value: A) => RulesMap<T & A>
} & { [K in keyof T]: InferRules<T[K]> }
export interface Eq {
  <T extends Record<string, any> = Record<string, any>>(r: RulesPath<T>, v: string | RulesPath<T>): RulesBoolean
}

/**
 * A set is an unordered collection. A set cannot contain duplicate items.
 * There is no set literal for use in creating sets.
 * Instead, create sets from lists using List.toSet(). See rules.List.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Set}
 */
export interface RulesSet<T> extends Rule {
  /**
   * Returns a set that is the difference between the set calling difference() and the set passed to difference(). That is, returns a set containing the elements in the comparison set that are not in the specified set.
   * If the sets are identical, returns an empty set (size() == 0).
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Set#difference}
   */
  difference: (value: RulesSet<T>) => RulesSet<T>
  /**
   * Test whether the set calling hasAll() contains all of the items in the comparison set passed to hasAll().
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Set#hasAll}
   */
  hasAll: (list: T[] | RulesList<T> | RulesSet<T>) => RulesBoolean
  /**
   * Test whether the set calling hasAny() contains any of the items in the set or list passed to hasAny().
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Set#hasAny}
   */
  hasAny: (list: T[] | RulesList<T> | RulesSet<T>) => RulesBoolean
  /**
   * Test whether the set calling hasOnly() contains only the items in the comparison set or list passed to hasOnly().
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Set#hasOnly}
   */
  hasOnly: (list: T[] | RulesList<T> | RulesSet<T>) => RulesBoolean
  /**
   * Returns a set that is the intersection between the set calling intersection() and the set passed to intersection(). That is, returns a set containing the elements the sets have in common.
   * If the sets have no elements in common, returns an empty set (size() == 0).
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Set#intersection}
   */
  intersection: (list: RulesSet<T>) => RulesSet<T>
  /**
   * Returns the size of the set.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Set#size}
   */
  size: () => RulesInteger
  /**
   * Returns a set that is the union of the set calling union() and the set passed to union(). That is, returns a set that contains all elements from both sets.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Set#union}
   * */
  union: (list: RulesSet<T>) => RulesSet<T>
}
export interface Eq {
  /** True if a is equal to b */
  <T>(a: RulesSet<T>, b: T[] | RulesSet<T>): RulesBoolean
}

export interface In {
  /** True if b is a member of a */
  <T>(a: RulesSet<T>, b: T | InferRules<T>): RulesBoolean
}

/**
 * Primitive type representing a string value.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.String}
 */
export interface RulesString<K extends string = string> extends Rule<K> {
  /**
   * Returns a lowercase version of the input string.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.String#lower}
   */
  lower: () => RulesString
  /**
   * Performs a regular expression match on the whole string.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.String#matches}
   */
  matches: (re: string) => RulesString
  /**
   * Replaces all occurrences of substrings matching a regular expression with a user-supplied string.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.String#replace}
   */
  replace: (re: string, sub: string) => RulesString
  /**
   * Returns the number of characters in the string.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.String#size}
   */
  size: () => RulesInteger
  /**
   * Splits a string according to a regular expression.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.String#split}
   */
  split: (re: string) => RulesList<string>
  /**
   * Returns the UTF-8 byte encoding of a string.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.String#toUtf8}
   */
  toUtf8: () => RulesString
  /**
   * Returns a version of the string with leading and trailing spaces removed.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.String#trim}
   */
  trim: () => RulesString
  /**
   * Returns an uppercase version of the input string.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.String#upper}
   */
  upper: () => RulesString
}
export interface Eq {
  /** True if a is equal to b */
  (a: RulesString, b: string | RulesString | null): RulesBoolean
}
export interface Neq {
  /** True if a is not equal to b */
  (a: RulesString, b: string | RulesString | null): RulesBoolean
}
export interface Gt {
  /** True if a is greater than b */
  (a: RulesString, b: string | RulesString | null): RulesBoolean
}
export interface Lt {
  /** True if a is less than b */
  (a: RulesString, b: string | RulesString | null): RulesBoolean
}
export interface Gte {
  /** True if a is greater than or equal to b */
  (a: RulesString, b: string | RulesString | null): RulesBoolean
}
export interface Lte {
  /** True if a is less than or equal to b */
  (a: RulesString, b: string | RulesString | null): RulesBoolean
}

/**
 * A timestamp in UTC with nanosecond accuracy.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp}
 */
export interface RulesTimestamp extends Rule {
  /**
   * Timestamp value containing year, month, and day only.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#date}
   */
  date: () => RulesTimestamp
  /**
   * Get the day value of the timestamp.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#day}
   */
  day: () => RulesInteger
  /**
   * Get the day of the week as a value from 1 to 7.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#dayOfWeek}
   */
  dayOfWeek: () => RulesInteger
  /**
   * Get the day of the year as a value from 1 to 366.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#dayOfYear}
   */
  dayOfYear: () => RulesInteger
  /**
   * Get the hours value of the timestamp.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#hours}
   */
  hours: () => RulesInteger
  /**
   * Get the minutes value of the timestamp.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#minutes}
   */
  minutes: () => RulesInteger
  /**
   * Get the month value of the timestamp.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#month}
   */
  month: () => RulesInteger
  /**
   * Get the nanos value of the timestamp.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#nanos}
   */
  nanos: () => RulesInteger
  /**
   * Get the seconds value of the timestamp.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#seconds}
   */
  seconds: () => RulesInteger
  /**
   * Get the duration value from the time portion of the timestamp.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#time}
   */
  time: () => RulesDuration
  /**
   * Get the time in milliseconds since the epoch.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#time}
   */
  toMillis: () => RulesInteger
  /**
   * Get the year value of the timestamp.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.Timestamp#year}
   */
  year: () => RulesInteger
}
