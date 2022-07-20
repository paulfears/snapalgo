
import nacl from 'tweetnacl';
import SnapAlgo from './SnapAlgo';
import Accounts from './Accounts';
import { bufferToBase64String } from '@metamask/key-tree/dist/utils';


module.exports.onRpcRequest = async ({origin, request}) => {
  const accountLibary = new Accounts(wallet);
  console.log(request);
  console.log(origin);
  const requestObject = request;
  const originString = origin;
  let accounts = await accountLibary.getAccounts();
  let currentAccount = await accountLibary.getCurrentAccount();
  
  let snapAlgo = new SnapAlgo(wallet, currentAccount);
  if(requestObject.hasOwnProperty('testnet')){
    snapAlgo.setTestnet(requestObject.testnet);
  }
  switch (requestObject.method) {
    
    case 'getAccounts':
      return accounts

    case 'getCurrentAccount':
      return currentAccount

    case 'createAccount':
      const result = await accountLibary.createNewAccount(requestObject.name);
      const newAccount = result.Account;
      console.log(newAccount);
      const mnemonic = await accountLibary.getMnemonic(newAccount);
      const mnemonicConfirmation = await snapAlgo.sendConfirmation("Display Mnemonic", "Do you want to display Your mnemonic", "Your mnemonic is used to recover your account, you can choose to display it now, or later from the account tab in the wallet");
      if(mnemonicConfirmation){
        snapAlgo.sendConfirmation("mnemonic", newAccount.addr, mnemonic);
      }
      snapAlgo.notify("account created");
      return true
      
    
    case 'importAccount':
      console.log("originString : " + originString);
      
      return await accountLibary.importAccount( requestObject.name, requestObject.mnemonic);

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
    
      case 'secureReceive':
        console.log(originString);
        if(originString === "https://snapalgo.com"){
          let confirm = await snapAlgo.sendConfirmation("Do you want to display your address?", currentAccount.addr);
          if(confirm){
            return currentAccount.addr;
          }
          else{
            return 4001;
          }
          
        }

        
    
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
      return snapAlgo.signTxns(requestObject.txns, originString);
    case 'postTxns':
      return snapAlgo.postTxns(requestObject.stxns);
    case 'AppOptIn':
      return snapAlgo.AppOptIn(requestObject.appIndex);
    case 'AssetOptIn':
      return snapAlgo.AssetOptIn(requestObject.assetIndex);
    case 'AssetOptOut':
      return snapAlgo.assetOptOut(requestObject.assetIndex);
    case 'transferAsset':
      return snapAlgo.TransferAsset( requestObject.assetIndex, requestObject.to, requestObject.amount);
    case 'getAssetById':
      return snapAlgo.getAssetById(requestObject.assetIndex);
    case 'signAndPostTxns':
      return snapAlgo.signAndPostTxns(requestObject.txns, originString);
    case 'signLogicSig':
      return snapAlgo.signLogicSig(requestObject.logicSigAccount, requestObject.sender);
    default:
      throw new Error('Method not found.');
  }
};