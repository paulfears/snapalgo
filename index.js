const algo =  require('algosdk/dist/cjs');
import nacl from 'tweetnacl';

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
  console.log(algo);
  let account = AccountFromSeed(_base64ToArrayBuffer(JSON.stringify(await getPrivateKey())));
  let account_mnemonic = algo.secretKeyToMnemonic(account.sk);

  switch (requestObject.method) {
    case 'getBalance': {
      let balance = await fetch('https://algorand-api-node.paulfears.repl.co/balance?address='+account.addr);
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
    default:
      throw new Error('Method not found.');
  }
});
