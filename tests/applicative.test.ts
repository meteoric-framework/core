import fc from "fast-check";
import { describe, it, expect } from "@jest/globals";
import { $2, $3, $4, $5, $6, $7, $8, $9 } from "../src/applicative.js";

/* eslint-disable unicorn/prevent-abbreviations */
describe("applicative", () => {
  describe("$2", () => {
    it("should commute with function application", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          fc.func(fc.anything()),
          fc.anything(),
          fc.anything(),
          <A, B, C>(fn: (a: A, b: B) => C, a: A, b: B) => {
            expect($2(fn)([a, b])).toStrictEqual(fn(a, b));
          }
        )
      );
    });
  });

  describe("$3", () => {
    it("should commute with $2", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          fc.func(fc.anything()),
          fc.anything(),
          fc.anything(),
          fc.anything(),
          <A, B, C, D>(fn: (a: A, b: B, c: C) => D, a: A, b: B, c: C) => {
            expect($3(fn)([[a, b], c])).toStrictEqual(
              $2((a: A, b: B) => fn(a, b, c))([a, b])
            );
          }
        )
      );
    });
  });

  describe("$4", () => {
    it("should commute with $3", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          fc.func(fc.anything()),
          fc.anything(),
          fc.anything(),
          fc.anything(),
          fc.anything(),
          <A, B, C, D, E>(
            fn: (a: A, b: B, c: C, d: D) => E,
            a: A,
            b: B,
            c: C,
            d: D
          ) => {
            expect($4(fn)([[[a, b], c], d])).toStrictEqual(
              $3((a: A, b: B, c: C) => fn(a, b, c, d))([[a, b], c])
            );
          }
        )
      );
    });
  });

  describe("$5", () => {
    it("should commute with $4", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          fc.func(fc.anything()),
          fc.anything(),
          fc.anything(),
          fc.anything(),
          fc.anything(),
          fc.anything(),
          <A, B, C, D, E, F>(
            fn: (a: A, b: B, c: C, d: D, e: E) => F,
            a: A,
            b: B,
            c: C,
            d: D,
            e: E
          ) => {
            expect($5(fn)([[[[a, b], c], d], e])).toStrictEqual(
              $4((a: A, b: B, c: C, d: D) => fn(a, b, c, d, e))([
                [[a, b], c],
                d,
              ])
            );
          }
        )
      );
    });
  });
});

describe("$6", () => {
  it("should commute with $5", () => {
    expect.assertions(100);
    fc.assert(
      fc.property(
        fc.func(fc.anything()),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        <A, B, C, D, E, F, G>(
          fn: (a: A, b: B, c: C, d: D, e: E, f: F) => G,
          a: A,
          b: B,
          c: C,
          d: D,
          e: E,
          f: F
        ) => {
          expect($6(fn)([[[[[a, b], c], d], e], f])).toStrictEqual(
            $5((a: A, b: B, c: C, d: D, e: E) => fn(a, b, c, d, e, f))([
              [[[a, b], c], d],
              e,
            ])
          );
        }
      )
    );
  });
});

describe("$7", () => {
  it("should commute with $6", () => {
    expect.assertions(100);
    fc.assert(
      fc.property(
        fc.func(fc.anything()),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        <A, B, C, D, E, F, G, H>(
          fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H,
          a: A,
          b: B,
          c: C,
          d: D,
          e: E,
          f: F,
          g: G
        ) => {
          expect($7(fn)([[[[[[a, b], c], d], e], f], g])).toStrictEqual(
            $6((a: A, b: B, c: C, d: D, e: E, f: F) => fn(a, b, c, d, e, f, g))(
              [[[[[a, b], c], d], e], f]
            )
          );
        }
      )
    );
  });
});

describe("$8", () => {
  it("should commute with $7", () => {
    expect.assertions(100);
    fc.assert(
      fc.property(
        fc.func(fc.anything()),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        <A, B, C, D, E, F, G, H, I>(
          fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I,
          a: A,
          b: B,
          c: C,
          d: D,
          e: E,
          f: F,
          g: G,
          h: H
        ) => {
          expect($8(fn)([[[[[[[a, b], c], d], e], f], g], h])).toStrictEqual(
            $7((a: A, b: B, c: C, d: D, e: E, f: F, g: G) =>
              fn(a, b, c, d, e, f, g, h)
            )([[[[[[a, b], c], d], e], f], g])
          );
        }
      )
    );
  });
});

describe("$9", () => {
  it("should commute with $8", () => {
    expect.assertions(100);
    fc.assert(
      fc.property(
        fc.func(fc.anything()),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        fc.anything(),
        <A, B, C, D, E, F, G, H, I, J>(
          fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => J,
          a: A,
          b: B,
          c: C,
          d: D,
          e: E,
          f: F,
          g: G,
          h: H,
          i: I
        ) => {
          expect(
            $9(fn)([[[[[[[[a, b], c], d], e], f], g], h], i])
          ).toStrictEqual(
            $8((a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) =>
              fn(a, b, c, d, e, f, g, h, i)
            )([[[[[[[a, b], c], d], e], f], g], h])
          );
        }
      )
    );
  });
});
/* eslint-enable unicorn/prevent-abbreviations */
