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

export { OptionExtractError };
