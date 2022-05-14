base58check
===========

[![build status](https://secure.travis-ci.org/cryptocoinjs/bs58.png)](http://travis-ci.org/cryptocoinjs/bs58)

JavaScript component to compute base 58 check encoding. This encoding is typically used for crypto currencies such as Bitcoin.

Install
-------

    npm i --save base58check

API
---

### string encode(data, prefix = '00', encoding = 'hex')

`data` must be a [Buffer](http://nodejs.org/api/buffer.html) or a `string`. It returns a `string`.

**example**:

```js
const base58check = require('base58check')

const data = '086eaa677895f92d4a6c5ef740c168932b5e3f44'
console.log(base58check.encode(data)) // => 1mayif3H2JDC62S4N3rLNtBNRAiUUP99k
```

### { prefix, data } decode(string[, encoding])

`string` must be a base 58 check encoded string. Returns a `Object` for prefix & data.

**example**:

```js
const base58check = require('base58check')

const address = '1mayif3H2JDC62S4N3rLNtBNRAiUUP99k'
console.log(base58check.decode(address))
// => { prefix: <Buffer 00>, data: <Buffer 08 6e aa 67 78 95 f9 2d 4a 6c 5e f7 40 c1 68 93 2b 5e 3f 44> }

// if using encoding
console.log(base58check.decode(address, 'hex'))
// => { prefix: '00', data: '086eaa677895f92d4a6c5ef740c168932b5e3f44' }
```

Hack / Test
-----------

Uses JavaScript standard style. Read more:

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Credits
-------
- [unrealce](https://github.com/wzbg) for original JavaScript implementation

Related
-------

- [`bs58`](https://www.npmjs.com/package/bs58) - JavaScript component to compute base 58 encoding. This encoding is typically used for crypto currencies such as Bitcoin.

License
-------

The MIT License (MIT)

Copyright (c) 2016