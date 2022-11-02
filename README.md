# SNAPALGO

## ALGORAND on MetaMask
SnapAlgo is an Algorand wallet built on metamask developmental snaps feature which allows code to be run in a secure execution enviroment inside the metamask extension itself. Because the feature is so new it is currently only available on Metamask Flask which can be found here
[https://metamask.io/flask/](https://metamask.io/flask/)

## Demo
[snapalgo.com](https://snapalgo.com)
## example apps
#### simple wallet
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
### sdk
It is possible to use an sdk to simplify using snapalgo.
[repository](https://github.com/Kyraview/SnapAlgoSDK)
This creates a floating wallet on the dapp for better user experence.
As well as creating an easier developer experence by not requiring the
developer to call raw rpc functions.

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
		params:{
			testnet:  false,
			to:  address,
			amount:  1000
		}
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
		params:{
			testnet: false
		}
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
		parms:{
			testnet:  false
		}
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
		params:{
			testnet:  false,
			to:  address,
			amount:  1000
			?note: "string"
		}
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
		params:{
			testnet: false
		}
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
		params:{
			data: new Uint8Array()
		}
	}]
})
```
***
## Asset Functions
the functions are used to interact with algorand assets
***
### assetOptIn
opts into an algorand asset
```javascript
await window.ethereum.request({
	method: 'wallet_invokeSnap',
	params: ['npm:algorand', {
		method: 'assetOptIn'
		params:{
			assetIndex: int
		}
	}]
})
```

### assetOptOut
opts out of an algorand asset
```javascript
await window.ethereum.request({
	method: 'wallet_invokeSnap',
	params: ['npm:algorand', {
		method: 'assetOptOut'
		params:{
			assetIndex: int
		}
	}]
})
```
### transferAsset
sends an algorand asset to another wallet that is opted into the given asset
```javascript
await window.ethereum.request({
	method: 'wallet_invokeSnap',
	params: ['npm:algorand', {
		method: 'assetOptOut'
		params:{
			assetIndex: int
			to: "algorandAddress"
			amount: string
		}
	}]
})
```


***
## swapping functions
These functions are used to swap crypto between
Algorand, Etherum, and Binance Smart Chain
The ticker values are
algo | eth | bsc

***

### get Minimum
get minimum input amount for a specific swap
```javascript
    async function getMin(){
      const result = await ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          'npm:algorand', {
            method: 'getMin',
			params:{
            	from: 'eth' | 'bsc' | 'algo',
            	to: 'eth' | 'bsc' | 'algo',
			}
          }
        ]
      })
      return result;
    }
```
### preSwap
Get infomation about a swap without actually swapping
```javascript
	async function preSwap(){
		const result = await ethereum.request({
			method: 'wallet_invokeSnap',
			params: [
			'npm:algorand', {
				method: 'preSwap',
				params:{
					from: 'eth' | 'bsc' | 'algo',
					to: 'eth' | 'bsc' | 'algo',
					amount: Number(amount) //done in base units i.e. eth not wei
				}
			}
			]
		})
		return result
	}
```

### swap
swap currencies
this will automatically send send the required currency to the exchange and use the selected address to receive the cash
uses changenow
```javascript
	async function swap(){
		const result = await ethereum.request({
			method: 'wallet_invokeSnap',
			params: [
			'npm:algorand', {
				method: 'swap',
				params:{
					from: 'eth' | 'bsc' | 'algo',
					to: 'eth' | 'bsc' | 'algo',
					amount: Number(amount) //done in base units i.e. eth not wei
					email: String("emailAddress@example.com") //completely optional
				}
			}
			]
		})
		return result
	}

```

### swapHistory
the method returns an array of swap objects that give info about a swap performed by a given wallet.
```javascript
	async function swapHistory(){
		const result = await ethereum.request({
			method: 'wallet_invokeSnap',
			params: [
			'npm:algorand', {
				method: 'swapHistory',
			}
			]
		})
		return result
	}

```

### getSwapStatus
this method returns a status object of swap given the swaps id that can be obtained from swap history
```javascript
	async function swapHistory(){
		const result = await ethereum.request({
			method: 'wallet_invokeSnap',
			params: [
			'npm:algorand', {
				method: 'getSwapStatus',
				params:{
					id: 'changenowSwapID'
				}
			}
			]
		})
		return result
	}
```

More RPC methods to come