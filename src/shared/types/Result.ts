type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

const Ok = <T>(value: T): Result<T> => ({
  ok: true,
  value,
});

const Err = <E = Error>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

export { Ok, Err };
export type { Result };