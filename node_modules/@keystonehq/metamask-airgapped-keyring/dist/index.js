
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./metamask-airgapped-keyring.cjs.production.min.js')
} else {
  module.exports = require('./metamask-airgapped-keyring.cjs.development.js')
}
