var asch = require('./index.js')

var keys = asch.crypto.getKeys('divide cheap guilt mirror soldier citizen fox absorb perfect emotion profit despair')
console.log(asch.crypto.getAddress(keys.publicKey))
