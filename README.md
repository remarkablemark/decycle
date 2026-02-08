# decycle

[![NPM](https://nodei.co/npm/decycle.svg)](https://nodei.co/npm/decycle/)

[![NPM version](https://img.shields.io/npm/v/decycle.svg)](https://www.npmjs.com/package/decycle)
[![build](https://github.com/remarkablemark/decycle/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablemark/decycle/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/remarkablemark/decycle/graph/badge.svg?token=XCMG4hmYbs)](https://codecov.io/gh/remarkablemark/decycle)

JSON decycle replaces circular references with `{"$ref": PATH}`, where PATH is the [JSONPath](https://wikipedia.org/wiki/JSONPath) of the first occurrence.

Inspired by [cycle.js](https://github.com/douglascrockford/JSON-js/blob/master/cycle.js).

## Quick Start

```ts
import { decycle } from 'decycle';

const obj = { a: 1 };
obj.self = obj;

JSON.stringify(decycle(obj));
// '{"a":1,"self":{"$ref":"$"}}'
```

## Install

[NPM](https://www.npmjs.com/package/decycle):

```sh
npm install decycle
```

[Yarn](https://yarnpkg.com/package/decycle):

```sh
yarn add decycle
```

[CDN](https://unpkg.com/browse/decycle/):

```html
<script src="https://unpkg.com/decycle@latest/dist/index.umd.js"></script>
```

## Usage

ES Modules:

```ts
import { decycle } from 'decycle';
```

CommonJS:

```ts
const { decycle } = require('decycle');
```

UMD:

```html
<script src="https://unpkg.com/decycle@latest/dist/index.umd.js"></script>
<script>
  const { decycle } = window.decycle;
</script>
```

### decycle(value, replacer?)

Returns a deep copy of `object` or `array` with circular references replaced by `{"$ref": PATH}`.

#### value

Type: `unknown`

The object or array to decycle.

#### replacer

Type: `(value: unknown) => unknown`

Optional replacer function called for each value. It receives a value and returns a replacement value.

### Examples

Circular array:

```ts
const array = [];
array[0] = array;
JSON.stringify(decycle(array)); // '[{"$ref":"$"}]'
```

With replacer:

```ts
const obj = { date: new Date('2026-02-07') };
const result = decycle(obj, (value) =>
  value instanceof Date ? value.toISOString() : value,
);
// { date: '2026-02-07T00:00:00.000Z' }
```

## Release

Release is automated with [Release Please](https://github.com/googleapis/release-please).

## License

[MIT](https://github.com/remarkablemark/decycle/blob/master/LICENSE)
