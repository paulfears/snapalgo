
import nacl from 'tweetnacl';
import SnapAlgo from './SnapAlgo';
import Accounts from './Accounts';
import { bufferToBase64String } from '@metamask/key-tree/dist/utils';


wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  console.log(originString);
  const accountLibary = new Accounts(wallet);
  console.log("getting Accounts")
  let accounts = await accountLibary.getAccounts();
  console.log("accounts got : ")
  console.log(accounts);
  let currentAccount = await accountLibary.getCurrentAccount();
  
  let snapAlgo = new SnapAlgo(wallet, currentAccount);
  if(requestObject.hasOwnProperty('testnet')){
    snapAlgo.setTestnet(requestObject.testnet);
  }
  switch (requestObject.method) {
    
    case 'getAccounts':
      return accounts

    case 'createAccount':
      return await accountLibary.createNewAccount(requestObject.name);
    
    case 'importAccount':
      return await accountLibary.importAccount(requestObject.mnemonic, requestObject.name);

    case 'setAccount':
      return await accountLibary.setCurrentAccount(requestObject.address);

    case 'getAssets':
      return snapAlgo.getAssets();
      
    case 'isValidAddress':
      return snapAlgo.isValidAddress(requestObject.address);
    
    case 'getTransactions':
      return snapAlgo.getTransactions();
    
    case 'getBalance': 
      return snapAlgo.getBalance();

    case 'clearAccounts':
      const clearAccountConfirm = await snapAlgo.sendConfirmation(
        'Clear all accounts?',
        'imported Accounts will be gone forever',
      );
      if(clearAccountConfirm){
        await accountLibary.clearAccounts();
        snapAlgo.notify('Accounts cleared');
        return 'true';
      }
      return false;
      
    
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
    case 'encodeTransaction':
        console.log("encoding transaction");
        return snapAlgo.encodeUnsignedTransaction(requestObject.txn);
    case 'encodeTransactions':
        console.log("encoding transactions");
        return snapAlgo.encodeUnsignedTransactions(requestObject.txns);
    case 'Uint8ArrayToBase64':
        return snapAlgo.Uint8ArrayToBase64(requestObject.data);
    case 'signTxns':
      return snapAlgo.signTxns(requestObject.txns);
    case 'AppOptIn':
      console.log(requestObject);
      console.log("opting in");
      console.log("updated");
      console.log(snapAlgo.optIn);
      return snapAlgo.AppOptIn(requestObject.appIndex);
    case 'AssetOptIn':
      console.log(requestObject);
      console.log("opting in asset");
      console.log("updated");
      return snapAlgo.AssetOptIn(requestObject.assetIndex);
    case 'AssetOptOut':
      console.log(requestObject);
      return snapAlgo.assetOptOut(requestObject.assetIndex);
    case 'transferAsset':
      return snapAlgo.TransferAsset( requestObject.assetIndex, requestObject.to, requestObject.amount);
    case 'getAssetById':
      return snapAlgo.getAssetById(requestObject.assetIndex);
    default:
      throw new Error('Method not found.');
  }
});