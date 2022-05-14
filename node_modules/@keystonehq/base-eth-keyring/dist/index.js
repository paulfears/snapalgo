
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./base-eth-keyring.cjs.production.min.js')
} else {
  module.exports = require('./base-eth-keyring.cjs.development.js')
}
