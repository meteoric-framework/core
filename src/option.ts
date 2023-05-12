/**
 * Type {@link Option} represents an optional value. Every {@link Option} is
 * either {@link Some} and contains a value, or {@link None} and doesn't contain
 * a value. {@link Option} types are very common as they have a number of uses.
 * For example, they can be used as:
 *
 * - Initial values of loop accumulators.
 * - Return values of partial functions.
 * - Optional function arguments.
 * - Optional object properties.
 * - Nullable values.
 *
 * @remarks
 * {@link Option}s are commonly discriminated by querying the
 * {@link OptionMethods.isSome | isSome} or
 * {@link OptionMethods.isNone | isNone} properties to safely extract the value
 * from {@link Some} while always accounting for {@link None}.
 *
 * ```ts
 * const divide = (numerator: number, denominator: number): Option<number> =>
 *   denominator === 0 ? none : some(numerator / denominator);
 *
 * const result = divide(2, 3);
 *
 * if (result.isSome) {
 *   console.log(`Result: ${result.value}`);
 * } else {
 *   console.log("Cannot divide by 0");
 * }
 * ```
 *
 * ### Method overview
 *
 * In addition to providing the {@link OptionMethods.isSome | isSome} and
 * {@link OptionMethods.isNone | isNone} properties for discriminating
 * {@link Option}s, the {@link OptionMethods} class provides several utility
 * methods.
 *
 * #### Extracting the contained value
 *
 * These methods extract the contained value in an {@link Option} when it is the
 * {@link Some} variant. If the {@link Option} is {@link None}:
 *
 * - {@link OptionMethods.safeExtract | safeExtract} returns the provided
 *   default value.
 * - {@link OptionMethods.safeExtractThunk | safeExtractThunk} returns the
 *   result of evaluating the provided function.
 * - {@link OptionMethods.unsafeExtract | unsafeExtract} throws an
 *   {@link OptionExtractError} with the provided custom message.
 *
 * #### Transforming contained values
 *
 * These methods transform the {@link Some} variant, and return {@link None}
 * values unchanged:
 *
 * - {@link OptionMethods.map | map} applies the provided function to the value
 *   contained in {@link Some} and puts the result in a new {@link Some}.
 * - {@link OptionMethods.flatMap | flatMap} returns the {@link Option} obtained
 *   by applying the provided function to the contained value of {@link Some}.
 * - {@link OptionMethods.filter | filter} returns the input {@link Some} if the
 *   contained value satisfies the predicate, or else it returns {@link None}.
 *
 * @example
 * Discriminating an {@link Option}:
 *
 * ```ts
 * const message: Option<string> = Math.random() < 0.5 ? some("howdy") : none;
 *
 * if (message.isSome) {
 *   console.log(message.value);
 * }
 *
 * const extractedMessage = message.safeExtract("default message");
 *
 * console.log(extractedMessage);
 * ```
 *
 * Initialize a result to {@link None} before a loop:
 *
 * ```ts
 * interface LivingThing {
 *   kingdom: "plant" | "animal";
 *   size: number;
 *   name: string;
 * }
 *
 * const allTheBigThings: LivingThing[] = [
 *   { kingdom: "plant", size: 250, name: "redwood" },
 *   { kingdom: "plant", size: 230, name: "noble fir" },
 *   { kingdom: "plant", size: 229, name: "sugar pine" },
 *   { kingdom: "animal", size: 25, name: "blue whale" },
 *   { kingdom: "animal", size: 19, name: "fin whale" },
 *   { kingdom: "animal", size: 15, name: "north pacific right whale" },
 * ];
 *
 * let sizeOfBiggestAnimal = 0;
 * let nameOfBiggestAnimal: Option<string> = none;
 *
 * for (const bigThing of allTheBigThings) {
 *   const { kingdom, size, name } = bigThing;
 *   if (kingdom === "animal" && size > sizeOfBiggestAnimal) {
 *     sizeOfBiggestAnimal = size;
 *     nameOfBiggestAnimal = some(name);
 *   }
 * }
 *
 * if (nameOfBiggestAnimal.isSome) {
 *   console.log(`The biggest animal is ${nameOfBiggestAnimal.value}`);
 * } else {
 *   console.log("There are no animals :(");
 * }
 * ```
 *
 * @typeParam A - The type to make optional.
 */
type Option<A> = Some<A> | None;

/**
 * The {@link OptionMethods} abstract class lists all the methods implemented by
 * {@link Option}.
 */
abstract class OptionMethods {
  /**
   * The value of {@link OptionMethods.isSome | isSome} is `true` when the
   * {@link Option} is {@link Some}, and it's `false` when the {@link Option} is
   * {@link None}.
   *
   * @category Discriminating an option
   *
   * @example
   * The {@link OptionMethods.isSome | isSome} property is used for
   * discriminating an {@link Option}:
   *
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const message = getMessage();
   *
   * if (message.isSome) {
   *   console.log(message.value);
   * } else {
   *   console.log("Did not receive a message");
   * }
   * ```
   */
  public abstract readonly isSome: boolean;

  /**
   * The value of {@link OptionMethods.isNone | isNone} is `true` when the
   * {@link Option} is {@link None}, and it's `false` when the {@link Option} is
   * {@link Some}.
   *
   * @category Discriminating an option
   *
   * @example
   * The {@link OptionMethods.isNone | isNone} property is used for
   * discriminating an {@link Option}:
   *
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const message = getMessage();
   *
   * if (message.isNone) {
   *   console.log("Did not receive a message");
   * } else {
   *   console.log(message.value);
   * }
   * ```
   */
  public abstract readonly isNone: boolean;

  /**
   * Returns {@link None} if the {@link Option} is {@link None}. Otherwise,
   * returns a new {@link Some} containing the result of applying the `morphism`
   * to the value contained in the input {@link Some}.
   *
   * @category Transforming contained values
   *
   * @example
   * Calculating the length of an optional string to get an optional length:
   *
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const length = getMessage().map((string) => string.length);
   *
   * if (length.isSome) {
   *   console.log(`The length of the message is ${length.value}`);
   * } else {
   *   console.log("Did not receive a message");
   * }
   * ```
   *
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @typeParam B - The type of the resultant {@link Option}'s value.
   * @param this - The input {@link Option}.
   * @param morphism - The function to transform the {@link Option}'s value.
   * @returns A new {@link Option} containing the transformed value.
   */
  public map<A, B>(this: Option<A>, morphism: (value: A) => B): Option<B> {
    return this.isSome ? new Some(morphism(this.value)) : none;
  }

  /**
   * Returns {@link None} if the {@link Option} is {@link None}. Otherwise,
   * returns the result of applying `arrow` to the value contained in the
   * {@link Some}.
   *
   * @category Transforming contained values
   *
   * @example
   * Often used to compose functions that return {@link Option}s.
   *
   * ```ts
   * const get = <A>(array: A[], index: number): Option<A> => {
   *   const value = array[index];
   *   return value === undefined ? none : some(value);
   * };
   *
   * const get2d = <A>(matrix: A[][], row: number, col: number) =>
   *   get(matrix, row).flatMap((array) => get(array, col));
   *
   * const matrix = [[1, 1/2, 1/3], [1/2, 1/3, 1/4], [1/3, 1/4, 1/5]];
   *
   * const element = get2d(matrix, 1, 1);
   *
   * if (element.isSome) {
   *   console.log(`The element at position (1, 1) is ${element.value}`);
   * } else {
   *   console.log("There's no element at position (1, 1)");
   * }
   * ```
   *
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @typeParam B - The type of the resultant {@link Option}'s value.
   * @param this - The input {@link Option}.
   * @param arrow - The function to transform the {@link Option}'s value.
   * @returns The result of applying `arrow` to the contained value, or
   * {@link None}.
   */
  public flatMap<A, B>(
    this: Option<A>,
    arrow: (value: A) => Option<B>
  ): Option<B> {
    return this.isSome ? arrow(this.value) : none;
  }

  /**
   * Returns {@link None} if the {@link Option} is {@link None} or if the
   * contained {@link Some} value fails the `predicate` check. Otherwise,
   * returns the input {@link Some}.
   *
   * @category Transforming contained values
   *
   * @example
   * ```ts
   * const random = (max: number): number =>
   *   Math.floor(max * Math.random());
   *
   * const isOdd = (n: number): boolean => n % 2 === 1;
   *
   * const isSquare = (n: number): boolean => Math.sqrt(n) % 1 === 0;
   *
   * const number = some(random(10)).filter(isOdd).filter(isSquare);
   *
   * if (number.isSome) {
   *   console.log(`${number.value} is an odd square`);
   * } else {
   *   console.log("Did not see an odd square");
   * }
   * ```
   *
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @param this - The input {@link Option}.
   * @param predicate - The function to test the {@link Option}'s value.
   * @returns A input {@link Some} if the contained value passed the `predicate`
   * check, or {@link None}.
   */
  public filter<A>(
    this: Option<A>,
    predicate: (value: A) => boolean
  ): Option<A> {
    return this.isSome && predicate(this.value) ? this : none;
  }

  /**
   * Returns the contained {@link Some} value, or `defaultValue` when
   * {@link Option} is {@link None}.
   *
   * @category Extracting the contained value
   *
   * @remarks
   * If an expensive computation is required to obtain `defaultValue` then use
   * the {@link OptionMethods.safeExtractThunk | safeExtractThunk} method to
   * lazily compute `defaultValue`.
   *
   * @example
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const message = getMessage().safeExtract("default message");
   *
   * console.log(message);
   * ```
   *
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @param this - The input {@link Option}.
   * @param defaultValue - The value to return when the input {@link Option} is
   * {@link None}.
   * @returns The contained {@link Some} value, or `defaultValue`.
   */
  public safeExtract<A>(this: Option<A>, defaultValue: A): A {
    return this.isSome ? this.value : defaultValue;
  }

  /**
   * Returns the contained {@link Some} value, or the result of applying
   * `getDefaultValue` when {@link Option} is {@link None}.
   *
   * @category Extracting the contained value
   *
   * @example
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const message = getMessage().safeExtractThunk(() => {
   *   const time = new Date().toLocaleTimeString();
   *   return `[${time}] default message`;
   * });
   *
   * console.log(message);
   * ```
   *
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @param this - The input {@link Option}.
   * @param getDefaultValue - The thunk to evaluate and return when the input
   * {@link Option} is {@link None}.
   * @returns The contained {@link Some} value, or the result of applying
   * `getDefaultValue`.
   */
  public safeExtractThunk<A>(this: Option<A>, getDefaultValue: () => A): A {
    return this.isSome ? this.value : getDefaultValue();
  }

  /**
   * Returns the contained {@link Some} value, or throws an
   * {@link OptionExtractError} when extracting from {@link None}.
   *
   * @category Extracting the contained value
   *
   * @remarks
   * We recommend that `message` describes the reason why the {@link Option}
   * should be {@link Some} and not {@link None}. As a rule of thumb, focus on
   * the word "should". For example, the `message` could be "environment
   * variable SOME_PATH should be set by some_script.sh".
   *
   * @example
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const message = getMessage()
   *   .unsafeExtract("message should not be random");
   *
   * console.log(message);
   * ```
   *
   * @throws An {@link OptionExtractError} when extracting from {@link None}.
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @param this - The input {@link Option}.
   * @param message - A descriptive error message to display when trying to
   * extract from {@link None}.
   * @returns The contained {@link Some} value.
   */
  public unsafeExtract<A>(this: Option<A>, message: string): A {
    if (this.isSome) return this.value;
    throw new OptionExtractError(message);
  }

  /**
   * Applies the `callback` to the input {@link Option}, and then returns the
   * input {@link Option}.
   *
   * @category Tapping into the method chain
   *
   * @example
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const message = getMessage()
   *   .tap((option) => console.log("Got an option", option))
   *   .safeExtract("default message");
   *
   * console.log(message);
   * ```
   *
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @param this - The input {@link Option}.
   * @param callback - The function that taps the input {@link Option}.
   * @returns - The input {@link Option}.
   */
  public tap<A>(
    this: Option<A>,
    callback: (option: Option<A>) => void
  ): Option<A> {
    callback(this);
    return this;
  }

  /**
   * Applies the callback to the contained {@link Some} value, and then returns
   * the input {@link Option}.
   *
   * @category Tapping into the method chain
   *
   * @example
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const message = getMessage()
   *   .forEach((value) => console.log("Got some value:", value))
   *   .safeExtract("default message");
   *
   * console.log(message);
   * ```
   *
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @param this - The input {@link Option}.
   * @param callback - The function that taps the contained {@link Some} value.
   * @returns - The input {@link Option}.
   */
  public forEach<A>(this: Option<A>, callback: (value: A) => void): Option<A> {
    if (this.isSome) callback(this.value);
    return this;
  }

  /**
   * Calls the callback when the input {@link Option} is {@link None}, and then
   * returns the input {@link Option}.
   *
   * @category Tapping into the method chain
   *
   * @example
   * ```ts
   * const getMessage = (): Option<string> =>
   *   Math.random() < 0.5 ? some("Hello World!") : none;
   *
   * const message = getMessage()
   *   .tapNone(() => console.log("Got no value"))
   *   .safeExtract("default message");
   *
   * console.log(message);
   * ```
   *
   * @typeParam A - The type of the value contained in the input {@link Option}.
   * @param this - The input {@link Option}.
   * @param callback - The function that taps the {@link None} case.
   * @returns - The input {@link Option}.
   */
  public tapNone<A>(this: Option<A>, callback: () => void): Option<A> {
    if (this.isNone) callback();
    return this;
  }
}

/**
 * The {@link Some} class is the variant for {@link Option}s that contain some
 * value.
 *
 * @group Option Classes
 *
 * @typeParam A - The type of the value in the {@link Some}.
 */
class Some<out A> extends OptionMethods {
  public override readonly isSome = true;

  public override readonly isNone = false;

  /**
   * Constructs a new {@link Some} with the provided `value`.
   *
   * @typeParam A - The type of `value`.
   * @param value - The value stored in the {@link Some}.
   * @returns A new {@link Some} containing the provided `value`.
   */
  public constructor(public readonly value: A) {
    super();
  }
}

/**
 * The {@link None} class is the variant for {@link Option}s that contain no
 * value.
 *
 * @group Option Classes
 */
class None extends OptionMethods {
  public override readonly isSome = false;

  public override readonly isNone = true;
}

/**
 * An {@link OptionExtractError} is thrown when you call the
 * {@link OptionMethods.unsafeExtract | unsafeExtract} method of {@link None}.
 *
 * @group Errors
 */
class OptionExtractError extends Error {
  /**
   * Constructs a new {@link OptionExtractError} object with the provided
   * message. You shouldn't need to create an {@link OptionExtractError}
   * manually. It will be automatically created when you call the
   * {@link OptionMethods.unsafeExtract | unsafeExtract} method of {@link None}.
   *
   * @param message - A descriptive error message.
   * @returns A new {@link OptionExtractError} object.
   */
  public constructor(message: string) {
    super(message);

    Object.defineProperty(this, "name", {
      value: "OptionExtractError",
      enumerable: false,
      configurable: true,
    });

    Object.setPrototypeOf(this, OptionExtractError.prototype);

    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, OptionExtractError);
    }
  }
}

/**
 * Constructs a new {@link Some} with the provided `value`.
 *
 * @group Option Constructors
 *
 * @typeParam A - The type of `value`.
 * @param value - The value to store in the {@link Some}.
 * @returns A new {@link Some} containing the provided `value`.
 */
const some = <A>(value: A): Some<A> => new Some(value);

/**
 * The singleton {@link None} instance.
 *
 * @group Option Constructors
 */
const none = new None();

export type { Option, OptionMethods, Some, None };
export { OptionExtractError, some, none };
