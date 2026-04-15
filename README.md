# fast-varint-codec

High-performance variable-length integer codec. Uses fixed sizes of **1, 2, 4, or 8 bytes** — the first 2 bits of each encoded value indicate the byte length, enabling fast and branch-efficient decoding without scanning byte-by-byte.

## Features

- Fixed widths: 1, 2, 4, or 8 bytes — no loops, pure bitwise ops
- 64-bit support via `BigInt`
- Dual package: ESM + CommonJS
- TypeScript types included
- Zero dependencies

## Encoding scheme

| Value range            | Bytes | Leading bits |
| ---------------------- | ----- | ------------ |
| 0 – 63                 | 1     | `00`         |
| 64 – 16 383            | 2     | `01`         |
| 16 384 – 1 073 741 823 | 4     | `10`         |
| 1 073 741 824 – 2⁶⁴−1  | 8     | `11`         |

## Installation

```bash
npm install fast-varint-codec
```

## Usage

### ESM

```js
import { encodeTo, decodeFrom, MAX_VARINT_SIZE } from "fast-varint-codec";
```

### CommonJS

```js
const { encodeTo, decodeFrom, MAX_VARINT_SIZE } = require("fast-varint-codec");
```

## API

### `encodeTo(buf, value, offset?): number`

Encodes `value` into `buf` at `offset` (default `0`). Returns the number of bytes written (1, 2, 4, or 8).

- `buf` — `Uint8Array` or any array-like buffer
- `value` — `number` for values ≤ 1 073 741 823, or `bigint` for larger values
- `offset` — byte offset (default: `0`)

```js
const buf = new Uint8Array(8);

encodeTo(buf, 42); // 1 byte
encodeTo(buf, 1000); // 2 bytes
encodeTo(buf, 500000); // 4 bytes
encodeTo(buf, 5000000000n); // 8 bytes, pass as BigInt
```

### `decodeFrom(buf, offset?, len?): number | bigint`

Decodes a varint from `buf` at `offset` (default `0`). Returns a `number` for 1–4 byte values, or a `bigint` for 8-byte values.

- `len` — optional object; after the call, `len.length` contains the number of bytes consumed

```js
const buf = new Uint8Array(8);
encodeTo(buf, 1000);

const len = { length: 0 };
const value = decodeFrom(buf, 0, len);
console.log(value); // 1000
console.log(len.length); // 2
```

### `MAX_VARINT_SIZE(): number`

Returns `8` — the maximum number of bytes a single encoded value can occupy. Useful for pre-allocating buffers.

```js
const buf = new Uint8Array(MAX_VARINT_SIZE());
```

## License

ISC
