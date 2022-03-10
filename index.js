const algo =  require('algosdk/dist/cjs');
import nacl from 'tweetnacl';
const payer = require('./pay.js');

async function getPrivateKey(){
  const pk = await wallet.request({
    method: 'snap_getBip44Entropy_283',
  });
  return pk.key;
}

function AccountFromSeed(seed) {
  seed = seed.slice(0, 32);
  let keys = nacl.sign.keyPair.fromSeed(seed);
  const Account = {}
  Account.addr = algo.encodeAddress(keys.publicKey);
  Account.sk = keys.secretKey;
  return Account;
}

function _base64ToArrayBuffer(base64) {
  var binary_string = base64;
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  let account = AccountFromSeed(_base64ToArrayBuffer(JSON.stringify(await getPrivateKey())));
  let account_mnemonic = algo.secretKeyToMnemonic(account.sk);
  const baseUrl = "https://algorand-api-node.paulfears.repl.co"
  switch (requestObject.method) {
    case 'getBalance': {
      let balance = await fetch(baseUrl+"/balance?address="+account.addr);
      balance = Number(await balance.text());
      wallet.request({
        method: 'snap_confirm',
        params:[
          {
            prompt: " balance",
            description: Number(balance/100000).toString() + " ALGO",
            
          }
        ]
      })
      return balance
    }
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${originString}!`,
            description: account.addr,
            textAreaContent:
              account_mnemonic
          }
        ],
      });
    case 'transfer':
      console.log("here")
      console.log(baseUrl)
      let params = await fetch(baseUrl+'/suggestedParams')
      params = await params.json();
      console.log("params: ")
      console.log(params)
      
      const receiver = requestObject.to;
      const amount = requestObject.amount;
      console.log("receiver")
      console.log(receiver)
      console.log("amount")
      console.log(amount)
      console.log(typeof params)
      let signedTxn = await payer.pay(account.addr, requestObject.to, requestObject.amount, false, account.sk, params);
      console.log(signedTxn);
      let confirmation = await fetch(baseUrl+"/broadcast", {
        method: 'POST',
        headers: {                              
          "Content-Type": "application/json"    
        },   
        body: JSON.stringify(signedTxn)
      })
      wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: "Confirm Transaction",
            description: "",
            textAreaContent: confirmation
          }
        ]
      })
      return confirmation;
    default:
      throw new Error('Method not found.');
  }
});