const algo =  require('algosdk/dist/esm');
import nacl from 'tweetnacl';

async function getPrivateKey(){
  const pk = await wallet.request({
    method: 'snap_getBip44Entropy_283',
  });
  return pk.key;
}

function AccountFromSeed(seed) {
  console.log(seed)
  console.log(seed.length)
  seed = seed.slice(0, 32);
  let keys = nacl.sign.keyPair.fromSeed(seed);
  const Account = {}
  Account.addr = algo.encodeAddress(keys.publicKey);
  Account.sk = keys.secretKey;
  console.log(Account);
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
      let api_endPoint = 'https://mainnet-algorand.api.purestake.io/idx2';
      let api_port = '';
      const token = {
        'X-API-Key': 'XNV9sGh5c32IRG3pmnYc2ce4bFHX4wC3JWO4Oird'
      }
      const algodClient = new algo.Algodv2(token, api_endPoint, api_port);
      let accountInfo = await algodClient.accountInformation(account.addr).do();
      return wallet.request({
        method: 'snap_confirm',
        params:[
          {
            prompt: "balance",
            description: account.addr,
            textAreaContent: accountInfo 
          }
        ]
      })
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
