/** Returns the maximum byte size a varint can occupy (always 8). */
export declare function MAX_VARINT_SIZE(): number;

/**
 * Encodes an integer value as a varint into `buf` at `offset`.
 * @param buf - The target buffer.
 * @param value - The integer value to encode. Values > 1 073 741 823 must be passed as `bigint`.
 * @param offset - Byte offset within the buffer (default: 0).
 * @returns The number of bytes written: 1, 2, 4, or 8.
 */
export declare function encodeTo(
  buf: Uint8Array,
  value: number | bigint,
  offset?: number,
): number;

/**
 * Decodes a varint from `buf` at `offset`.
 * @param buf - The source buffer.
 * @param offset - Byte offset within the buffer (default: 0).
 * @param len - An object whose `.length` property is set to the number of bytes consumed.
 * @returns A `number` for 1–4 byte varints, or a `bigint` for 8-byte varints.
 */
export declare function decodeFrom(
  buf: Uint8Array,
  offset?: number,
  len?: { length: number },
): number | bigint;

declare const _default: {
  MAX_VARINT_SIZE: typeof MAX_VARINT_SIZE;
  encodeTo: typeof encodeTo;
  decodeFrom: typeof decodeFrom;
};

export default _default;
