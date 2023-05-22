/* eslint-disable unicorn/prevent-abbreviations */
const $2 =
  <A, B, C>(morphism: (a: A, b: B) => C) =>
  (values: [A, B]): C => {
    const [a, b] = values;
    return morphism(a, b);
  };

const $3 =
  <A, B, C, D>(morphism: (a: A, b: B, c: C) => D) =>
  (values: [[A, B], C]): D => {
    const [[a, b], c] = values;
    return morphism(a, b, c);
  };

const $4 =
  <A, B, C, D, E>(morphism: (a: A, b: B, c: C, d: D) => E) =>
  (values: [[[A, B], C], D]): E => {
    const [[[a, b], c], d] = values;
    return morphism(a, b, c, d);
  };

const $5 =
  <A, B, C, D, E, F>(morphism: (a: A, b: B, c: C, d: D, e: E) => F) =>
  (values: [[[[A, B], C], D], E]): F => {
    const [[[[a, b], c], d], e] = values;
    return morphism(a, b, c, d, e);
  };

const $6 =
  <A, B, C, D, E, F, G>(morphism: (a: A, b: B, c: C, d: D, e: E, f: F) => G) =>
  (values: [[[[[A, B], C], D], E], F]): G => {
    const [[[[[a, b], c], d], e], f] = values;
    return morphism(a, b, c, d, e, f);
  };

const $7 =
  <A, B, C, D, E, F, G, H>(
    morphism: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H
  ) =>
  (values: [[[[[[A, B], C], D], E], F], G]): H => {
    const [[[[[[a, b], c], d], e], f], g] = values;
    return morphism(a, b, c, d, e, f, g);
  };

const $8 =
  <A, B, C, D, E, F, G, H, I>(
    morphism: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I
  ) =>
  (values: [[[[[[[A, B], C], D], E], F], G], H]): I => {
    const [[[[[[[a, b], c], d], e], f], g], h] = values;
    return morphism(a, b, c, d, e, f, g, h);
  };

const $9 =
  <A, B, C, D, E, F, G, H, I, J>(
    morphism: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => J
  ) =>
  (values: [[[[[[[[A, B], C], D], E], F], G], H], I]): J => {
    const [[[[[[[[a, b], c], d], e], f], g], h], i] = values;
    return morphism(a, b, c, d, e, f, g, h, i);
  };
/* eslint-enable unicorn/prevent-abbreviations */

export { $2, $3, $4, $5, $6, $7, $8, $9 };
