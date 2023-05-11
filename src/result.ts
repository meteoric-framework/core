/**
 * Type {@link Result} represents computations that can either result in a value
 * or an error. Every {@link Result} is either {@link Success} and contains a
 * value, or {@link Failure} and contains an error.
 *
 * @remarks
 * {@link Result}s are commonly discriminated by querying the
 * {@link ResultMethods.isSuccess | isSuccess} or
 * {@link ResultMethods.isFailure | isFailure} properties to safely extract the
 * value from {@link Success} while always accounting for {@link Failure}.
 *
 * ```ts
 * const divide = (n: number, d: number): Result<string, number> =>
 *   d === 0 ? failure("division by zero") : success(n / d);
 *
 * const result = divide(2, 3);
 *
 * if (result.isSuccess) {
 *   console.log(`Success: ${result.value}`);
 * } else {
 *   console.log(`Failure: ${result.error}`);
 * }
 * ```
 *
 * ### Method overview
 *
 * In addition to providing the {@link ResultMethods.isSuccess | isSuccess} and
 * {@link ResultMethods.isFailure | isFailure} properties for discriminating
 * {@link Result}s, the {@link ResultMethods} class provides several utility
 * methods.
 *
 * #### Transforming contained values
 *
 * These methods transform the {@link Success} variant, and return
 * {@link Failure} values unchanged:
 *
 * - {@link ResultMethods.map | map} applies the provided function to the value
 *   contained in {@link Success} and puts the result in a new {@link Success}.
 *
 * @typeParam E - The type of the {@link Failure} error.
 * @typeParam A - The type of the {@link Success} value.
 */
type Result<E, A> = Success<A> | Failure<E>;

/**
 * The {@link ResultMethods} abstract class lists all the methods implemented by
 * {@link Result}.
 */
abstract class ResultMethods {
  /**
   * The value of {@link ResultMethods.isSuccess | isSuccess} is `true` when the
   * {@link Result} is {@link Success}, and it's `false` when the {@link Result}
   * is {@link Failure}.
   *
   * @category Discriminating a result
   *
   * @example
   * ```ts
   * const getAnswer = (): Result<string, number> =>
   *   Math.random() < 0.5 ? success(42) : failure("No answer to life");
   *
   * const answer = getAnswer();
   *
   * if (answer.isSuccess) {
   *   console.log(`The answer to life is ${answer.value}`);
   * } else {
   *   console.log(answer.error);
   * }
   * ```
   */
  public abstract readonly isSuccess: boolean;

  /**
   * The value of {@link ResultMethods.isFailure | isFailure} is `true` when the
   * {@link Result} is {@link Failure}, and it's `false` when the {@link Result}
   * is {@link Success}.
   *
   * @category Discriminating a result
   *
   * @example
   * ```ts
   * const getAnswer = (): Result<string, number> =>
   *   Math.random() < 0.5 ? success(42) : failure("No answer to life");
   *
   * const answer = getAnswer();
   *
   * if (answer.isFailure) {
   *   console.log(answer.error);
   * } else {
   *   console.log(`The answer to life is ${answer.value}`);
   * }
   * ```
   */
  public abstract readonly isFailure: boolean;

  /**
   * Returns the input {@link Failure}, or returns a new {@link Success}
   * containing the result of applying the `morphism` to the value contained in
   * the input {@link Success}.
   *
   * @category Transforming contained values
   *
   * @example
   * ```ts
   * const getAnswer = (): Result<string, number> =>
   *   Math.random() < 0.5 ? success(42) : failure("No answer to life");
   *
   * const isEven = getAnswer().map((n) => n % 2 === 0);
   *
   * if (isEven.isSuccess) {
   *   console.log(`The answer is ${isEven.value ? "even" : "odd"}`);
   * } else {
   *   console.log(isEven.error);
   * }
   * ```
   *
   * @typeParam E - The type of the input and output {@link Result}'s error.
   * @typeParam A - The type of the input {@link Result}'s value.
   * @typeParam B - The type of the output {@link Result}'s value.
   * @param this - The input {@link Result}.
   * @param morphism - The function to transform the {@link Result}'s value.
   * @returns A new {@link Success} containing the transformed value, or the
   * input {@link Failure}.
   */
  public map<E, A, B>(
    this: Result<E, A>,
    morphism: (value: A) => B
  ): Result<E, B> {
    return this.isSuccess ? new Success(morphism(this.value)) : this;
  }
}

/**
 * The {@link Success} class is the variant for {@link Result}s that contain a
 * value.
 *
 * @group Result Classes
 *
 * @typeParam A - The type of the value in the {@link Success}.
 */
class Success<out A> extends ResultMethods {
  public override readonly isSuccess = true;

  public override readonly isFailure = false;

  /**
   * Constructs a new {@link Success} with the provided `value`.
   *
   * @typeParam A - The type of `value`.
   * @param value - The value stored in the {@link Success}.
   * @returns A new {@link Success} containing the provided `value`.
   */
  public constructor(public readonly value: A) {
    super();
  }
}

/**
 * The {@link Failure} class is the variant for {@link Result}s that contain an
 * error.
 *
 * @group Result Classes
 *
 * @typeParam E - The type of the error in the {@link Failure}.
 */
class Failure<out E> extends ResultMethods {
  public override readonly isSuccess = false;

  public override readonly isFailure = true;

  /**
   * Constructs a new {@link Failure} with the provided `value`.
   *
   * @typeParam E - The type of `error`.
   * @param error - The error stored in the {@link Failure}.
   * @returns A new {@link Failure} containing the provided `error`.
   */
  public constructor(public readonly error: E) {
    super();
  }
}

/**
 * Constructs a new {@link Success} with the provided `value`.
 *
 * @group Result Constructors
 *
 * @typeParam A - The type of `value`.
 * @param value - The value to store in the {@link Success}.
 * @returns A new {@link Success} containing the provided `value`.
 */
const success = <A>(value: A): Success<A> => new Success(value);

/**
 * Constructs a new {@link Failure} with the provided `error`.
 *
 * @group Result Constructors
 *
 * @typeParam E - The type of `error`.
 * @param error - The error to store in the {@link Failure}.
 * @returns A new {@link Failure} containing the provided `error`.
 */
const failure = <E>(error: E): Failure<E> => new Failure(error);

export type { Result, ResultMethods, Success, Failure };
export { success, failure };
