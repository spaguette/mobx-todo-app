export function* toGenerator<T>(
  promise: Promise<T>
): Generator<Promise<T>, T, T> {
  return yield promise;
}
