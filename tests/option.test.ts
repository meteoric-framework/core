import fc from "fast-check";
import { describe, it, expect } from "@jest/globals";
import { OptionExtractError } from "../src/errors.js";
import type { Some, None, Option } from "../src/option.js";
import { some, none, optionPredicate } from "../src/option.js";

const genSome = <A>(genValue: fc.Arbitrary<A>): fc.Arbitrary<Some<A>> =>
  genValue.map((value) => some(value));

const genNone = <A>(): fc.Arbitrary<None<A>> => fc.constant(none);

const genOption = <A>(genValue: fc.Arbitrary<A>): fc.Arbitrary<Option<A>> =>
  fc.oneof(genSome(genValue), genNone<A>());

describe("option", () => {
  describe("map", () => {
    it("should preserve identity morphisms", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genOption(fc.anything()), <A>(m: Option<A>) => {
          expect(m.map((x) => x)).toStrictEqual(m);
        })
      );
    });
  });

  describe("flatMap", () => {
    it("should have a left identity", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          fc.anything(),
          fc.func(genOption(fc.anything())),
          <A, B>(a: A, k: (a: A) => Option<B>) => {
            expect(some(a).flatMap((x) => k(x))).toStrictEqual(k(a));
          }
        )
      );
    });

    it("should have a right identity", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genOption(fc.anything()), <A>(m: Option<A>) => {
          expect(m.flatMap((x) => some(x))).toStrictEqual(m);
        })
      );
    });

    it("should be associative", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          genOption(fc.anything()),
          fc.func(genOption(fc.anything())),
          fc.func(genOption(fc.anything())),
          <A, B, C>(
            m: Option<A>,
            k: (a: A) => Option<B>,
            h: (b: B) => Option<C>
          ) => {
            expect(m.flatMap((x) => k(x).flatMap((y) => h(y)))).toStrictEqual(
              m.flatMap((x) => k(x)).flatMap((y) => h(y))
            );
          }
        )
      );
    });
  });

  describe("safeExtract", () => {
    it("should extract the value from some", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.anything(), <A>(a: A) => {
          expect(some(a).safeExtract()).toStrictEqual(a);
        })
      );
    });

    it("should return the default value for none", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.anything(), <A>(a: A) => {
          const option: Option<A> = none;
          expect(option.safeExtract(a)).toStrictEqual(a);
        })
      );
    });
  });

  describe("safeExtractThunk", () => {
    it("should extract the value from some", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.anything(), <A>(a: A) => {
          expect(some(a).safeExtractThunk()).toStrictEqual(a);
        })
      );
    });

    it("should return the default value for none", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.func(fc.anything()), <A>(f: () => A) => {
          const option: Option<A> = none;
          expect(option.safeExtractThunk(f)).toStrictEqual(f());
        })
      );
    });
  });

  describe("unsafeExtract", () => {
    it("should extract the value from some", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.anything(), <A>(a: A) => {
          expect(some(a).unsafeExtract()).toStrictEqual(a);
        })
      );
    });

    it("should throw an OptionExtractError for none", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.string(), (m) => {
          expect(() => none.unsafeExtract(m)).toThrow(OptionExtractError);
        })
      );
    });

    it("should throw an error with the given message for none", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.string(), (m) => {
          expect(() => none.unsafeExtract(m)).toThrow(
            new OptionExtractError(m)
          );
        })
      );
    });
  });

  describe("optionPredicate", () => {
    it("should commute with flatMap", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          fc.anything(),
          fc.func(fc.boolean()),
          <A>(a: A, p: (a: A) => boolean) => {
            expect(some(a).flatMap(optionPredicate(p)).some).toStrictEqual(
              p(a)
            );
          }
        )
      );
    });
  });
});
