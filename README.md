# SNAPALGO

## ALGORAND on MetaMask
SnapAlgo is an Algorand wallet built on metamask developmental snaps feature which allows code to be run in a secure execution enviroment inside the metamask extension itself. Because the feature is so new it is currently only available on Metamask Flask which can be found here
[https://metamask.io/flask/](https://metamask.io/flask/)

## proof of concept
[https://snapalgo02.paulfears.repl.co](https://snapalgo02.paulfears.repl.co)
## example apps
#### simple wallet
![snap algo wallet ui](https://miro.medium.com/max/1400/0*QXkWMcX5XByVHJxi.png)
[https://snapalgowallet.netlify.app/](https://snapalgowallet.netlify.app/)
#### Simple Swap app
[https://algoswap.netlify.app/](https://algoswap.netlify.app/)

## Useage
### building
> npx mm-snap build

compiles the src folder into a functional version of the snap
### serving
> npx mm-snap serve

Serves index.html on port 3000

### Connect and Install
Add and Call the below function to connect to the wallet.
If the user does not have the snap installed, but has metamask flask installed this code will automaticly install it for them. **This code snippet can be added to any website with 0 depenancies otheer than metamask flask**
```javascript
async  function  connect () {
	await window.ethereum.request({
		method:  'wallet_enable',
		params: [{
			wallet_snap: { 'npm:algorand': {} },
		}]
	})
}
```

### Calling RPC Methods
Below is an example call to the snap that transacts 1000 microalgos to an entered public address. Again this can be run with 0 dependency other than metamask flask
```javascript
const address = prompt("Please enter your name");
const  response = await  window.ethereum.request({
	method:  'wallet_invokeSnap',
	params: ['npm:algorand', {
		method:  'transfer',
		testnet:  false,
		to:  address,
		amount:  1000
	}]
})
```
### Available RPC Methods

#### displayBalance
Displays the users current balance in a metamask flask popup

```javascript
await window.ethereum.request({
	method: 'wallet_invokeSnap',
	params:['npm:algorand',{
		method: 'displayBalance',
		testnet: false
	}]
})
```
#### getBalance
returns the users current balance
```javascript
await window.ethereum.request({
	method:  'wallet_invokeSnap',
	params: ['npm:algorand', {
		method:  'getBalance',
		testnet:  false
	}]
})
```
#### getAddress
returns the public address of the wallet
```javascript
let address = await window.ethereum.request({
	method:  'wallet_invokeSnap',
	params: ['npm:algorand', {
		method:  'getAddress',
	}]
})
```
#### transfer
transfers a number of algos to a specified address
```javascript
const address = prompt("Please enter your name");
const  response = await  window.ethereum.request({
	method:  'wallet_invokeSnap',
	params: ['npm:algorand', {
		method:  'transfer',
		testnet:  false,
		to:  address,
		amount:  1000
	}]
})
```
#### displayMnemonic
displays the wallets algorand mnemonic in a secure metamask window
```javascript
await window.ethereum.request({
	method:  'wallet_invokeSnap',
	params: ['npm:algorand', {
		method:  'displayMnemonic'
	}]
})
```
#### getTransactions
returns a list of javascript objects containing transaction data
```javascript
await window.ethereum.request({
	method: 'wallet_invokeSnap',
	params: ['npm:algorand', {
		method: 'getTransactions',
		testnet: false
	}]
})
```

### signData
takes a Uint8Array and signs it with your privateKey and returs the signature
```javascript
await window.ethereum.request({
	method: 'wallet_invokeSnap',
	params: ['npm:algorand', {
		method: 'signData'
		data: new Uint8Array()
	}]
})
```

More RPC methods to come