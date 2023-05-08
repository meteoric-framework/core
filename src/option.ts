type Option<A> = Some<A> | None<A>;

interface OptionMethods<out A> {
  readonly some: boolean;

  readonly map: <B>(morphism: (value: A) => B) => Option<B>;

  readonly flatMap: <B>(arrow: (value: A) => Option<B>) => Option<B>;

  readonly safeExtract: <B extends A>(defaultValue: B) => A;

  readonly safeExtractThunk: <B extends A>(getDefaultValue: () => B) => A;

  readonly unsafeExtract: (message: string) => A;
}

class Some<out A> implements OptionMethods<A> {
  public readonly some: true;

  public constructor(public readonly value: A) {
    this.some = true;
  }

  public map<B>(morphism: (value: A) => B): Some<B> {
    return new Some(morphism(this.value));
  }

  public flatMap<B>(arrow: (value: A) => Option<B>): Option<B> {
    return arrow(this.value);
  }

  public safeExtract(): A {
    return this.value;
  }

  public safeExtractThunk(): A {
    return this.value;
  }

  public unsafeExtract(): A {
    return this.value;
  }
}

class None<out A> implements OptionMethods<A> {
  public readonly some: false;

  public constructor() {
    this.some = false;
  }

  public map<B>(): None<B> {
    return none;
  }

  public flatMap<B>(): None<B> {
    return none;
  }

  public safeExtract<B extends A>(defaultValue: B): A {
    return defaultValue;
  }

  public safeExtractThunk<B extends A>(getDefaultValue: () => B): A {
    return getDefaultValue();
  }

  public unsafeExtract(message: string): A {
    throw new OptionExtractError(message);
  }
}

class OptionExtractError extends Error {
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

const some = <A>(value: A): Some<A> => new Some(value);

const none = new None<never>();

const optionPredicate =
  <A>(predicate: (value: A) => boolean) =>
  (value: A): Option<A> =>
    predicate(value) ? new Some(value) : none;

export type { OptionMethods, Some, None, Option };
export { OptionExtractError, some, none, optionPredicate };
