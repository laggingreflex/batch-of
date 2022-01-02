/**
 * Batch an iterable into smaller iterables
 * @param {Iterable} input Input iterable
 * @param {object} [opts]
 * @param {number} [opts.size=10] Batch size
 * @param {number} [opts.inputSize=input.size|length] Specify input iterable's size manually
 * Example:
 * ```js
 * for(const batch of batchOf(input)) ...
 * ```
 */
export default function batchOf(input, opts) {
  if (typeof opts === 'number') opts = { size: opts };
  const batchSize = opts?.size ?? 10;
  const inputSize = input.length ?? input.size;
  const outputSize = (inputSize && isFinite(inputSize)) ? Math.ceil(inputSize / batchSize) : NaN;

  const output = batch(input, batchSize);
  output.size = output.length = outputSize;
  return output;

  function* batch(input, size) {
    let next, done, async, iteratorSymbol;
    const batch = [];

    if (input[Symbol.asyncIterator]) {
      iteratorSymbol = Symbol.asyncIterator
      async = true;
    } else {
      iteratorSymbol = Symbol.iterator
    }

    const inputIterator = input[iteratorSymbol]();

    const flush = () => {
      const flushed = batch.splice(0, Infinity);
      if (!flushed.length) return;
      if (async) return Promise.all(flushed).then(i => i.filter(i => !i.done).map(i => i.value));
      else return flushed;
    };

    do {
      next = inputIterator.next();
      if (async) {
        batch.push(next.then(next => {
          done = next.done;
          return next
        }));
      } else if (!(done = next.done)) {
        batch.push(next.value);
      }
      if (batch.length >= size) {
        const flushed = flush();
        if (flushed) yield flushed;
      }
    } while (!done)

    const flushed = flush();
    if (flushed) yield flushed;
  }
}
