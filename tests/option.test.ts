import fc from "fast-check";
import { describe, it, expect, jest } from "@jest/globals";
import type { Some, None, Option } from "../src/option.js";
import { OptionExtractError, some, none } from "../src/option.js";

const id = <A>(a: A): A => a;

const genSome = <A>(genValue: fc.Arbitrary<A>): fc.Arbitrary<Some<A>> =>
  genValue.map(some);

const genNone: fc.Arbitrary<None> = fc.constant(none);

const genOption = <A>(genValue: fc.Arbitrary<A>): fc.Arbitrary<Option<A>> =>
  fc.oneof(genSome(genValue), genNone);

describe("option", () => {
  describe("map", () => {
    it("should preserve identity morphisms", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genOption(fc.anything()), <A>(m: Option<A>) => {
          expect(m.map(id)).toStrictEqual(m);
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
            expect(some(a).flatMap(k)).toStrictEqual(k(a));
          }
        )
      );
    });

    it("should have a right identity", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genOption(fc.anything()), <A>(m: Option<A>) => {
          expect(m.flatMap(some)).toStrictEqual(m);
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
            expect(m.flatMap((x) => k(x).flatMap(h))).toStrictEqual(
              m.flatMap(k).flatMap(h)
            );
          }
        )
      );
    });
  });

  describe("filter", () => {
    it("should be distributive", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          genOption(fc.anything()),
          fc.func(fc.boolean()),
          fc.func(fc.boolean()),
          <A>(m: Option<A>, p: (a: A) => boolean, q: (a: A) => boolean) => {
            expect(m.filter(p).filter(q)).toStrictEqual(
              m.filter((x) => p(x) && q(x))
            );
          }
        )
      );
    });

    it("should have an identity input", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genOption(fc.anything()), <A>(m: Option<A>) => {
          expect(m.filter(() => true)).toStrictEqual(m);
        })
      );
    });

    it("should have an annihilating input", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genOption(fc.anything()), <A>(m: Option<A>) => {
          expect(m.filter(() => false)).toStrictEqual(none);
        })
      );
    });
  });

  describe("safeExtract", () => {
    it("should extract the value from some", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.anything(), fc.anything(), <A>(a: A, b: A) => {
          expect(some(a).safeExtract(b)).toStrictEqual(a);
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

  describe("safeExtractFrom", () => {
    it("should extract the value from some", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          fc.anything(),
          fc.func(fc.anything()),
          <A>(a: A, f: () => A) => {
            expect(some(a).safeExtractFrom(f)).toStrictEqual(a);
          }
        )
      );
    });

    it("should return the default value for none", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.func(fc.anything()), <A>(f: () => A) => {
          const option: Option<A> = none;
          expect(option.safeExtractFrom(f)).toStrictEqual(f());
        })
      );
    });
  });

  describe("unsafeExtract", () => {
    it("should extract the value from some", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(fc.anything(), fc.string(), <A>(a: A, m: string) => {
          expect(some(a).unsafeExtract(m)).toStrictEqual(a);
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

  describe("tap", () => {
    it("should apply the callback to the input option", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genOption(fc.anything()), <A>(m: Option<A>) => {
          const callback = jest.fn<(m: Option<A>) => void>();
          m.tap(callback);
          expect(callback).toHaveBeenCalledWith(m);
        })
      );
    });
  });

  describe("forEach", () => {
    it("should apply the callback to the contained value", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genSome(fc.anything()), <A>(m: Some<A>) => {
          const callback = jest.fn<(a: A) => void>();
          m.forEach(callback);
          expect(callback).toHaveBeenCalledWith(m.value);
        })
      );
    });
  });

  describe("ifEmpty", () => {
    it("should call the callback function", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(genNone, (m: None) => {
          const callback = jest.fn<() => void>();
          m.ifEmpty(callback);
          expect(callback).toHaveBeenCalledWith();
        })
      );
    });
  });
});
