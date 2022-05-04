const algo =  require('algosdk/dist/cjs');
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import nacl from 'tweetnacl';
import SnapAlgo from './SnapAlgo';


async function getAccount(path){
  const entropy = await wallet.request({
    method: 'snap_getBip44Entropy_283',
  });

  //dirive private key using metamask key tree
  const algoDiriver = getBIP44AddressKeyDeriver(entropy);
  
  //generate an extended private key then grab the first 32 bytes
  //this coresponds to the private key portion of the extended private key
  
  const privateKey = algoDiriver(path).slice(0, 32);

  //algosdk requires keysPairs to be dirived by nacl so we can use the private key as 32 bytes of entropy
  const keys = nacl.sign.keyPair.fromSeed(privateKey);
  const Account = {}
  Account.addr = algo.encodeAddress(keys.publicKey);
  Account.sk = keys.secretKey;
  return Account;

}

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  let account = await getAccount(2);
  let snapAlgo = new SnapAlgo(wallet, account);
  if(requestObject.hasOwnProperty('testnet')){
    snapAlgo.setTestnet(requestObject.testnet);
  }
  switch (requestObject.method) {
    
    case 'isValidAddress':
      return snapAlgo.isValidAddress(requestObject.address);
    
      case 'getTransactions':
      return snapAlgo.getTransactions();
    
    case 'getBalance': 
      return snapAlgo.getBalance();
    
    //display balance in metamask window
    case 'displayBalance': 
      return await snapAlgo.sendConfirmation(
        "your balance is",
        snapAlgo.getAddress(),
        (await snapAlgo.getBalance()).toString()+" Algos"
      );
    
    case 'signData':
      let pk = account.sk;
      console.log("request data");
      console.log(requestObject.data);
      let out = nacl.sign(new Uint8Array(requestObject.data), account.sk);
      return out;
    
    case 'getAddress':
      return snapAlgo.getAddress();
    
    case 'displayMnemonic':
      return await snapAlgo.displayMnemonic();
    
    case 'transfer':
      return snapAlgo.Transfer(requestObject.to, requestObject.amount);
    
    case 'getAccount':
      return await getAccount();
    
    default:
      throw new Error('Method not found.');
  }
});