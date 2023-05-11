import fc from "fast-check";
import { describe, it, expect } from "@jest/globals";
import type { Result, Success, Failure } from "../src/result.js";
import { success, failure } from "../src/result.js";

const genSuccess = <A>(genValue: fc.Arbitrary<A>): fc.Arbitrary<Success<A>> =>
  genValue.map((value) => success(value));

const genFailure = <E>(genError: fc.Arbitrary<E>): fc.Arbitrary<Failure<E>> =>
  genError.map((error) => failure(error));

const genResult = <E, A>(
  genValue: fc.Arbitrary<A>,
  genError: fc.Arbitrary<E>
): fc.Arbitrary<Result<E, A>> =>
  fc.oneof(genSuccess(genValue), genFailure(genError));

describe("result", () => {
  describe("map", () => {
    it("should preserve identity morphisms", () => {
      expect.assertions(100);
      fc.assert(
        fc.property(
          genResult(fc.anything(), fc.anything()),
          <E, A>(m: Result<E, A>) => {
            expect(m.map((x) => x)).toStrictEqual(m);
          }
        )
      );
    });
  });
});
