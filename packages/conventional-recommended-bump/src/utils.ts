import type { Logger } from './types.js'

/**
 * Test if a value is an iterable
 * @param value
 * @returns `true` if value is an iterable, `false` otherwise
 */
export function isIterable<T>(value: unknown): value is Iterable<T> | AsyncIterable<T> {
  return value !== null && (
    typeof (value as Iterable<T>)[Symbol.iterator] === 'function'
    || typeof (value as AsyncIterable<T>)[Symbol.asyncIterator] === 'function'
  )
}

export function bindLogNamespace(namespace: string, logger: Logger) {
  return (messages: string | string[]) => logger(namespace, messages)
}
