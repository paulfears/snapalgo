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
  let baseUrl = "https://algorand-api-node.paulfears.repl.co"
  if(!requestObject.hasOwnProperty('testnet')){
    requestObject.testnet = false;
  }
  if(requestObject.testnet){
    baseUrl+="/test";
  }
  switch (requestObject.method) {
    case 'getTransactions':
      let transactions = await fetch(baseUrl+"/transactions?address="+account.addr);
      return await transactions.json();
    case 'getBalance': 
      let balance = await fetch(baseUrl+"/balance?address="+account.addr);
      return Number(await balance.text());
    
    case 'displayBalance': {
      let balance = await fetch(baseUrl+"/balance?address="+account.addr);
      balance = Number(await balance.text());
      wallet.request({
        method: 'snap_confirm',
        params:[
          {
            prompt: " balance",
            description: Number(balance/1000000).toString() + " ALGO",
            
          }
        ]
      })
      return balance
    }
    case 'getAddress':
      return account.addr;
    case 'displayMnemonic':
      const confirm = await wallet.request({
        method: 'snap_confirm',
        params:[{
          prompt: "Confirm", 
          description: "Are you sure you want to display your mnemonic?",
          textAreaContent: "anyone with this mnemonic can spend your funds"}]
      })
      if(!confirm){
        return "cancelled"
      }
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: "your mnemonic",
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
      let confirm_send = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: "Confirm Spend",
            description: "Send " + Number(amount)/1000000 + " ALGO to " + receiver,
          }
        ]
      })
      if(confirm_send === false){
        return "cancelled";
      }
      let tx_obj = await payer.pay(account.addr, requestObject.to, requestObject.amount, false, account.sk, params);
      fetch(baseUrl+"/broadcast", {
        method: 'POST',
        headers: {                              
          "Content-Type": "application/json"    
        },   
        body: JSON.stringify(tx_obj)
      }).then(res => {
        res.text().then((text) => {
          wallet.request({
            method: 'snap_confirm',
            params: [
              {
                prompt: "Transaction Confirmed",
                description: text,
              }
            ]
          })
        });

      })
      
      
      
      return  tx_obj.txId;
    default:
      throw new Error('Method not found.');
  }
});