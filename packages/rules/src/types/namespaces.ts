import type { Rule } from '../rule'
import type {
  RulesMap,
  RulesDuration,
  RulesNumber,
  RulesPath,
  RulesInteger,
  RulesBoolean,
  RulesBytes,
  RulesFloat,
  RulesLatLng,
  RulesTimestamp,
  RulesString,
} from './interfaces'

export interface NamespaceAuth extends RulesMap<{}> {
  uid: RulesString
  token: RulesMap<{
    /** The email address associated with the account, if present. */
    email: RulesString
    /** `true` if the user has verified they have access to the `email` address. */
    email_verified: RulesString
    /** The phone number associated with the account, if present. */
    phone_number: RulesString
    /** The user's display name, if set. */
    name: RulesString
    /** The user's Firebase UID. This is unique within a project. */
    sub: RulesString
    firebase: RulesMap<{
      identities: RulesMap<
        Record<`email` | `phone` | `google.com` | `facebook.com` | `github.com` | `twitter.com`, RulesString>
      >
      sign_in_provider: RulesString<SigninProviders>
      tenant?: RulesString
    }>
  }>
}

/**
 * The incoming request context.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.firestore.Request}
 * */
export interface NamespaceFirestoreRequest<T extends RulesMap> extends Rule {
  /**
   * Request authentication context.
   * uid - the UID of the requesting user.
   * token - a map of JWT token claims.
   *
   * The token map contains the following values:
   */
  auth: NamespaceAuth
  /** The request method. One of. */
  method: RulesString<'get' | 'list' | 'create' | 'update' | 'delete'>
  /** Path of the affected resource. */
  query: RulesMap<{ limit: RulesInteger; offset: RulesInteger; orderBy: RulesString }>
  /** The new resource value, present on write requests only. */
  resource: NamespaceFirestoreResource<T>
  /**
   * When the request was received by the service.
   * For Firestore write operations that include server-side timestamps, this time will be equal to the server timestamp.
   * */
  time: RulesTimestamp
}

/**
 * The firestore document being read or written.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.firestore.Resource}
 * */
export interface NamespaceFirestoreResource<T extends RulesMap> extends RulesMap {
  /** The full document name, as a path. */
  __name__: RulesPath
  /** Map of the document data. */
  data: T
  /** String of the document's key */
  id: RulesString
}

export interface NamespaceDebug {
  /**
   * A basic debug function that prints Security Rules language objects, variables and statement results as they are being evaluated by the Security Rules engine. The outputs of debug are written to firestore-debug.log.
   * The debug function can only be called inside Rules conditions
   * debug function blocks are only executed by the Security Rules engine in the Firestore emulator, part of the Firebase Emulator Suite. The debug function has no effect in production
   * Debug logfile entries are prepended by a string identifying the Rules language data type of the log output (for example, string_value, map_value)
   * Calls to debug can be nested
   * Currently, the debug feature does not support the concept of logging levels (for example, INFO, WARN, ERROR).
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.debug}
   */
  debug: <R extends any>(rule: R) => R
}

/**
 * Globally available duration functions. These functions are accessed using the duration. prefix.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.duration_}
 * */
export interface NamespaceDuration {
  /** Absolute value of a duration. */
  abs: (duration: RulesDuration) => RulesDuration
  /**
   * Create a duration from a numeric magnitude and string unit.
   * w	Weeks
   * d	Days
   * h	Hours
   * m	Minutes
   * s	Seconds
   * ms	Milliseconds
   * ns	Nanoseconds
   *
   */
  time: (
    hours: RulesInteger | number,
    mins: RulesInteger | number,
    secs: RulesInteger | number,
    nanos: RulesInteger | number,
  ) => RulesDuration
  value: (
    magnitude: RulesInteger | number,
    unit: RulesString<'w' | 'd' | 'h' | 'm' | 's' | 'ms' | 'ns'> | 'w' | 'd' | 'h' | 'm' | 's' | 'ms' | 'ns',
  ) => RulesDuration
}

/**
 * Context specific variables and methods for Cloud Firestore security rules.
 * Functions in this namespace are only available inside service cloud.firestore { ... }
 * blocks and do not need to be prefixed when used (get() not firestore.get()).
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.firestore}
 */
export interface NamespaceFirestore<T extends RulesMap> extends Rule {
  /** TThe request context, including authentication information and pending data. */
  request: NamespaceFirestoreRequest<T>
  /** The resource being read or written. */
  resource: NamespaceFirestoreResource<T>
  /** Check if a document exists. */
  exists: (path: string | RulesPath | RulesString) => RulesBoolean
  /** Check if a document exists, assuming the current request succeeds. Equivalent to getAfter(path) != null. */
  existsAfter: (path: string | RulesPath | RulesString) => RulesBoolean
  /** Get the contents of a firestore document. */
  get: <T extends Record<string, any>>(path: string | RulesPath | RulesString) => RulesMap<T>
  /** Get the projected contents of a document. The document is returned as if the current request had succeeded. Useful for validating documents that are part of a batched write or transaction. */
  getAfter: <T extends Record<string, any>>(path: string | RulesPath | RulesString) => RulesMap<T>
}

/**
 * Globally available hashing functions. These functions are accessed using the hashing. prefix.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.hashing}
 * */
export interface NamespaceHashing {
  /** Compute a hash using the CRC32 algorithm. */
  crc32: (bytes_or_string: string | RulesBytes | RulesString) => RulesBytes
  /** Compute a hash using the CRC32C algorithm. */
  crc32c: (bytes_or_string: string | RulesBytes | RulesString) => RulesBytes
  /** Compute a hash using the MD5 algorithm. */
  md5: (bytes_or_string: string | RulesBytes | RulesString) => RulesBytes
  /** Compute a hash using the SHA256 algorithm. */
  sha256: (bytes_or_string: string | RulesBytes | RulesString) => RulesBytes
}

/**
 * Globally available latitude-longitude functions. These functions are accessed using the latlng. prefix.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.latlng_}
 * */
export interface NamespaceLatlng {
  /**
   * Create a LatLng from floating point coordinates.
   *
   * {@link https://firebase.google.com/docs/reference/rules/rules.latlng_#.value}
   * */
  value: (lat: number | RulesFloat, lng: number | RulesFloat) => RulesLatLng
}

/**
 * Globally available mathematical functions. These functions are accessed using the math. prefix and operate on numerical values.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.math}
 * */
export interface NamespaceMath {
  /** Absolute value of a numeric value. */
  abs: (num: number | RulesNumber) => RulesNumber
  /** Ceiling of the numeric value. */
  ceil: (num: number | RulesNumber) => RulesInteger
  /** Floor of the numeric value. */
  floor: (num: number | RulesNumber) => RulesInteger
  /** Test whether the value is ±∞. */
  isInfinite: (num: number | RulesNumber) => RulesBoolean
  /** Test whether the value is ±∞. */
  isNaN: (num: number | RulesNumber) => RulesBoolean
  /** Return the value of the first argument raised to the power of the second argument. */
  pow: (num: number | RulesNumber) => RulesFloat
  /** Round the input value to the nearest int. */
  round: (num: number | RulesNumber) => RulesInteger
  /** Square root of the input value. */
  sqrt: (num: number | RulesNumber) => RulesFloat
}

/**
 * Globally available timestamp functions. These functions are accessed using the timestamp. prefix.
 *
 * {@link https://firebase.google.com/docs/reference/rules/rules.timestamp_}
 * */
export interface NamespaceTimestamp {
  /** Make a timestamp from a year, month, and day. */
  date: (year: number | RulesInteger, month: number | RulesInteger, day: number | RulesInteger) => RulesTimestamp
  /** Make a timestamp from an epoch time in milliseconds. */
  value: (epochMillis: number | RulesInteger) => RulesTimestamp
}

type SigninProviders =
  | `custom`
  | `password`
  | `phone`
  | `anonymous`
  | `google.com`
  | `facebook.com`
  | `github.com`
  | `twitter.com`

type PathParams<T, A extends Record<string, any> = {}> = T extends `${string}{${infer N}}${infer R}`
  ? PathParams<R, { [K in keyof A | N]: string }>
  : A

export type ContextFirestore<T extends RulesMap, P extends string> = NamespaceFirestore<T> &
  NamespaceDebug &
  PathParams<P> & {
    duration: NamespaceDuration
    hashing: NamespaceHashing
    latlng: NamespaceLatlng
    math: NamespaceMath
    timestamp: NamespaceTimestamp
  }
