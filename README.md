
# batch-of

[Yet another] function to batch an iterable into smaller iterables.

[Yet another]: https://www.npmjs.com/search?q=batch+iterator

Differences:

* Works on **all iterables** - array, set, generators, async generators
* Assigns **`size`** to the output iterable (for use in other consumers like [progress-of])
* Small, no dependencies

## Install

```sh
npm install batch-of
```

## Usage

```js
import batchOf from 'batch-of'

const array = [1,2,3]
function* sync() { yield* array }
async function* async() { yield* sync() }

for(const batch of batchOf(array)) {}
for(const batch of batchOf(sync())) {}
for await(const batch of batchOf(async())) {}
```

## API

```js
const output = batchOf(input, opts)
```

* **`input`** Input iterable
* **`opts.size`** `[number=10]` Batch size
* **`opts.inputSize`** `[number=input.size|length]` Specify input iterable's size manually
* **`output.size`** `[number=input.size÷opts.size]`

## Async Warning

This essentially converts an async iterator to a sync iterator.

Be sure to use the **`await`** keyword to prevent an infinite loop!

```js
    async function* async() { yield* [1,2,3] }
for await (const batch of batchOf(async()))
    ^^^^^ // must
```


[progress-of]: https://github.com/laggingreflex/progress-of
