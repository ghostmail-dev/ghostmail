/**
 * Represents a successful result containing a value of type `T`.
 */
export type Ok<T> = {
  ok: true
  value: T
}

/**
 * Represents a failed result containing an error of type `E`.
 */
export type Err<E> = {
  ok: false
  error: E
}

/**
 * A discriminated union representing either a success (`Ok<T>`) or a failure (`Err<E>`).
 * Use `r.ok` to narrow the type before accessing `r.value` or `r.error`.
 */
export type Result<T, E> = Ok<T> | Err<E>

/**
 * Constructs a successful `Ok` result wrapping the given value.
 *
 * @example
 * const result = Ok(42) // { ok: true, value: 42 }
 */
export const Ok = <T>(value: T): Ok<T> => ({
  ok: true,
  value,
})

/**
 * Constructs a failed `Err` result wrapping the given error.
 *
 * @example
 * const result = Err("something went wrong") // { ok: false, error: "something went wrong" }
 */
export const Err = <E>(error: E): Err<E> => ({
  ok: false,
  error,
})

/**
 * Type guard that returns `true` if the result is `Ok`.
 * Narrows the type to `Ok<T>` in the true branch.
 */
export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.ok

/**
 * Type guard that returns `true` if the result is `Err`.
 * Narrows the type to `Err<E>` in the true branch.
 */
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => !r.ok

/**
 * Transforms the success value of a result using the provided function.
 * If the result is `Err`, it is passed through unchanged.
 *
 * @example
 * map(Ok(2), x => x * 3) // Ok(6)
 * map(Err("oops"), x => x * 3) // Err("oops")
 */
export const map = <T, E, U>(
  r: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => (r.ok ? Ok(fn(r.value)) : r)

/**
 * Transforms the error value of a result using the provided function.
 * If the result is `Ok`, it is passed through unchanged.
 *
 * @example
 * mapErr(Err(404), code => `HTTP ${code}`) // Err("HTTP 404")
 * mapErr(Ok("data"), code => `HTTP ${code}`) // Ok("data")
 */
export const mapErr = <T, E, F>(
  r: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> => (r.ok ? r : Err(fn(r.error)))

/**
 * Chains a result-returning function onto a success value (flatMap / bind).
 * If the result is `Err`, it is passed through unchanged without calling `fn`.
 * Use this to sequence operations that each return a `Result`.
 *
 * @example
 * andThen(Ok(2), x => (x > 0 ? Ok(x * 10) : Err("non-positive"))) // Ok(20)
 * andThen(Err("oops"), x => Ok(x * 10)) // Err("oops")
 */
export const andThen = <T, E, U>(
  r: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => (r.ok ? fn(r.value) : r)

/**
 * Extracts the success value from a result, throwing if the result is `Err`.
 * Prefer `unwrapOr` or pattern-matching on `r.ok` for recoverable cases.
 *
 * @throws {Error} if the result is `Err`
 */
export const unwrap = <T, E>(r: Result<T, E>): T => {
  if (r.ok) return r.value
  throw new Error(`Tried to unwrap Err: ${String(r.error)}`)
}

/**
 * Extracts the success value from a result, returning the `fallback` if the result is `Err`.
 *
 * @example
 * unwrapOr(Ok(42), 0)   // 42
 * unwrapOr(Err("no"), 0) // 0
 */
export const unwrapOr = <T, E>(r: Result<T, E>, fallback: T): T =>
  r.ok ? r.value : fallback

/**
 * A `Promise` that resolves to a `Result<T, E>`.
 * Useful as a return type for async functions that want to signal errors
 * without throwing exceptions.
 */
export type ResultAsync<T, E> = Promise<Result<T, E>>

/**
 * Runs an async function and wraps its outcome in a `Result`.
 * Resolves to `Ok(value)` on success or `Err(error)` if the promise rejects.
 * Eliminates the need for try/catch at the call site.
 *
 * @example
 * const result = await tryCatch(() => fetch("/api/data").then(r => r.json()))
 * if (result.ok) console.log(result.value)
 * else console.error(result.error)
 */
export const tryCatch = async <T, E = unknown>(
  fn: () => Promise<T>,
  ErrorClass?: new (error?: unknown) => E,
): Promise<Result<T, E>> => {
  try {
    return Ok(await fn())
  } catch (err) {
    return Err(ErrorClass ? new ErrorClass(err) : (err as E))
  }
}
