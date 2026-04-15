"use strict";

function MAX_VARINT_SIZE() {
  return 8;
}

function encodeTo(buf, value, offset) {
  if (offset === undefined) offset = 0;
  if (value <= 63) return encode1(buf, offset, value);
  if (value <= 16383) return encode2(buf, offset, value);
  if (value <= 1073741823) return encode4(buf, offset, value);
  return encode8(buf, offset, value);
}

function decodeFrom(buf, offset, len) {
  if (offset === undefined) offset = 0;
  if (len === undefined) len = { length: 0 };
  if (buf[offset] >>> 6 === 0) {
    len.length = 1;
    return decode1(buf, offset);
  }
  if (buf[offset] >>> 6 === 1) {
    len.length = 2;
    return decode2(buf, offset);
  }
  if (buf[offset] >>> 6 === 2) {
    len.length = 4;
    return decode4(buf, offset);
  }
  len.length = 8;
  return decode8(buf, offset);
}

function decode1(buf, offset) {
  return buf[offset] & 0x3f;
}

function decode2(buf, offset) {
  return ((buf[offset] & 0x3f) << 8) | buf[offset + 1];
}

function decode4(buf, offset) {
  return (
    ((buf[offset] & 0x3f) * 2 ** 24) |
    (buf[offset + 1] << 16) |
    (buf[offset + 2] << 8) |
    buf[offset + 3]
  );
}

function decode8(buf, offset) {
  return (
    (BigInt(
      (((buf[offset] & 0x3f) * 2 ** 24) |
        (buf[offset + 1] << 16) |
        (buf[offset + 2] << 8) |
        buf[offset + 3]) >>>
        0,
    ) <<
      32n) |
    BigInt(
      ((buf[offset + 4] * 2 ** 24) |
        (buf[offset + 5] << 16) |
        (buf[offset + 6] << 8) |
        buf[offset + 7]) >>>
        0,
    )
  );
}

function encode1(buf, offset, value) {
  buf[offset] = value;
  return 1;
}

function encode2(buf, offset, value) {
  buf[offset] = 64 | (value >> 8);
  buf[offset + 1] = value & 0xff;
  return 2;
}

function encode4(buf, offset, value) {
  buf[offset] = 128 | (value >>> 24);
  buf[offset + 1] = (value >>> 16) & 0xff;
  buf[offset + 2] = (value >>> 8) & 0xff;
  buf[offset + 3] = value & 0xff;
  return 4;
}

function encode8(buf, offset, value) {
  value = BigInt(value);
  const hi = Number((value >> 32n) & 0xffffffffn);
  const lo = Number(value & 0xffffffffn);
  buf[offset] = 192 | (hi >>> 24);
  buf[offset + 1] = (hi >>> 16) & 0xff;
  buf[offset + 2] = (hi >>> 8) & 0xff;
  buf[offset + 3] = hi & 0xff;
  buf[offset + 4] = (lo >>> 24) & 0xff;
  buf[offset + 5] = (lo >>> 16) & 0xff;
  buf[offset + 6] = (lo >>> 8) & 0xff;
  buf[offset + 7] = lo & 0xff;
  return 8;
}

module.exports = { MAX_VARINT_SIZE, encodeTo, decodeFrom };
module.exports.default = module.exports;
