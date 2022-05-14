/*
* @Author: zyc
* @Date:   2016-09-11 23:36:23
* @Last Modified by:   unrealce
* @Last Modified time: 2016-09-13 01:51:11
*/
'use strict'

const base58check = require('./index')
const { encode, decode } = base58check

let data = 'f5f2d624cfb5c3f66d06123d0829d1c9cebf770e'
let string = encode(data)
console.log(string) // => 1PRTTaJesdNovgne6Ehcdu1fpEdX7913CK
console.log(decode(string, 'hex')) // => { prefix: '00', data: 'f5f2d624cfb5c3f66d06123d0829d1c9cebf770e' }

const prefix = '80'

data = '1E99423A4ED27608A15A2616A2B0E9E52CED330AC530EDCC32C8FFC6A526AEDD'
string = encode(data , prefix)
console.log(string) // => 5J3mBbAH58CpQ3Y5RNJpUKPE62SQ5tfcvU2JpbnkeyhfsYB1Jcn
console.log(decode(string, 'hex')) // => { prefix: '80', data: '1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd' }

const encoding = 'hex'

data = '1E99423A4ED27608A15A2616A2B0E9E52CED330AC530EDCC32C8FFC6A526AEDD01'
string = encode(data , prefix, encoding)
console.log(string) // => KxFC1jmwwCoACiCAWZ3eXa96mBM6tb3TYzGmf6YwgdGWZgawvrtJ
console.log(decode(string, 'hex')) // => { prefix: '80', data: '1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd01' }

data = new Buffer('27b5891b01da2db74cde1689a97a2acbe23d5fb1', encoding)
string = encode(data)
console.log(string) // => 14cxpo3MBCYYWCgF74SWTdcmxipnGUsPw3
console.log(decode(string, 'hex')) // => { prefix: '00', data: '27b5891b01da2db74cde1689a97a2acbe23d5fb1' }

data = new Buffer('3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6', encoding)
string = encode(data , prefix)
console.log(string) // => 5JG9hT3beGTJuUAmCQEmNaxAuMacCTfXuw1R3FCXig23RQHMr4K
console.log(decode(string, 'hex')) // => { prefix: '80', data: '3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6' }

data = new Buffer('3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa601', encoding)
string = encode(data , prefix, encoding)
console.log(string) // => KyBsPXxTuVD82av65KZkrGrWi5qLMah5SdNq6uftawDbgKa2wv6S
console.log(decode(string, 'hex')) // => { prefix: '80', data: '3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa601' }

data = '086eaa677895f92d4a6c5ef740c168932b5e3f44'
console.log(encode(data)) // => 1mayif3H2JDC62S4N3rLNtBNRAiUUP99k

const address = '1mayif3H2JDC62S4N3rLNtBNRAiUUP99k'
console.log(decode(address))
// => { prefix: <Buffer 00>, data: <Buffer 08 6e aa 67 78 95 f9 2d 4a 6c 5e f7 40 c1 68 93 2b 5e 3f 44> }

console.log(decode(address, 'hex'))
// => { prefix: '00', data: '086eaa677895f92d4a6c5ef740c168932b5e3f44' }

const privateKeyHex = 'eddbdc1168f1daeadbd3e44c1e3f8f5a284c2029f78ad26af98583a499de5b19'
console.log(encode(privateKeyHex, prefix)) // => 5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr

const privateKeyWIF = '5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr'
console.log(decode(privateKeyWIF))
// => { prefix: <Buffer 80>, data: <Buffer ed db dc 11 68 f1 da ea db d3 e4 4c 1e 3f 8f 5a 28 4c 20 29 f7 8a d2 6a f9 85 83 a4 99 de 5b 19> }

console.log(decode(privateKeyWIF, 'hex'))
// => { prefix: '80', data: 'eddbdc1168f1daeadbd3e44c1e3f8f5a284c2029f78ad26af98583a499de5b19' }