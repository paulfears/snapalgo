
import nacl from 'tweetnacl';
import Accounts from './Accounts';
import AlgoWallet from './AlgoWallet';
import WalletFuncs from './walletFuncs';
import Arcs from './Arcs';
import Utils from './Utils';
import Swapper from './Swapper';

module.exports.onRpcRequest = async ({origin, request}) => {
  const accountLibary = new Accounts(wallet);
  const requestObject = request;
  const originString = origin;
  let accounts = await accountLibary.getAccounts();
  let currentAccount = await accountLibary.getCurrentAccount();
  const algoWallet = new AlgoWallet(currentAccount);
  const walletFuncs = new WalletFuncs(algoWallet);
  const arcs = new Arcs(algoWallet);

  if(requestObject.hasOwnProperty('testnet')){
    algoWallet.setTestnet(requestObject.testnet);
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
      const mnemonicConfirmation = await Utils.sendConfirmation("Display Mnemonic", "Do you want to display Your mnemonic", "Your mnemonic is used to recover your account, you can choose to display it now, or later from the account tab in the wallet");
      if(mnemonicConfirmation){
        Utils.sendConfirmation("mnemonic", newAccount.addr, mnemonic);
      }
      Utils.notify("account created");
      return true
      
    case 'pairs':
      Swapper.pairs()
    case 'importAccount':
      console.log("originString : " + originString);
      
      return await accountLibary.importAccount( requestObject.name, requestObject.mnemonic);

    case 'setAccount':
      return await accountLibary.setCurrentAccount(requestObject.address);

    case 'getAssets':
      return walletFuncs.getAssets();
      
    case 'isValidAddress':
      return walletFuncs.isValidAddress(requestObject.address);
    
    case 'getTransactions':
      return walletFuncs.getTransactions();
    
    case 'getBalance': 
      return walletFuncs.getBalance();
    
    case 'getSpendable':
      return walletFuncs.getSpendable();

    case 'clearAccounts':
      const clearAccountConfirm = await Utils.sendConfirmation(
        'Clear all accounts?',
        'imported Accounts will be gone forever',
      );
      if(clearAccountConfirm){
        await accountLibary.clearAccounts();
        Utils.notify('Accounts cleared');
        return 'true';
      }
      return false;
      
    
    //display balance in metamask window
    case 'displayBalance': 
      return await Utils.sendConfirmation(
        "your balance is",
        algoWallet.getAddress(),
        (await walletFuncs.getBalance()).toString()+" Algos"
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
          let confirm = await Utils.sendConfirmation("Do you want to display your address?", currentAccount.addr);
          if(confirm){
            return currentAccount.addr;
          }
          else{
            return Utils.throwError(4001, "user Rejected Request");
          }
          
        }

        
    
    case 'getAddress':
      return algoWallet.getAddress();
    
    case 'displayMnemonic':
      return await walletFuncs.displayMnemonic();
    
    case 'transfer':
      return walletFuncs.transfer(requestObject.to, requestObject.amount);
    
    case 'getAccount':
      return await getAccount();
    case 'Uint8ArrayToBase64':
        return walletFuncs.Uint8ArrayToBase64(requestObject.data);
    case 'signTxns':
      return arcs.signTxns(requestObject.txns, originString);
    case 'postTxns':
      return arcs.postTxns(requestObject.stxns);
    case 'AppOptIn':
      return walletFuncs.AppOptIn(requestObject.appIndex);
    case 'AssetOptIn':
      return walletFuncs.AssetOptIn(requestObject.assetIndex);
    case 'AssetOptOut':
      return walletFuncs.assetOptOut(requestObject.assetIndex);
    case 'transferAsset':
      return walletFuncs.TransferAsset( requestObject.assetIndex, requestObject.to, requestObject.amount);
    case 'getAssetById':
      return walletFuncs.getAssetById(requestObject.assetIndex);
    case 'signAndPostTxns':
      return arcs.signAndPostTxns(requestObject.txns, originString);
    case 'signLogicSig':
      return walletFuncs.signLogicSig(requestObject.logicSigAccount, requestObject.sender);
    case 'swap':
      return await (async ()=>{
      const swapper = new Swapper(wallet, algoWallet, walletFuncs)
      return await swapper.swap(requestObject.from, requestObject.to, requestObject.amount, requestObject.email);
      })();
      
    case 'getMin':
      return await (async ()=>{
      const swapper = new Swapper(wallet, algoWallet, walletFuncs);
      const result = await swapper.getMin(requestObject.from, requestObject.to);
      console.log(result);
      return result;
      })()

    case 'preSwap':
      return await (async ()=>{
        const swapper = new Swapper(wallet, algoWallet, walletFuncs);
        return await swapper.preSwap(requestObject.from, requestObject.to, requestObject.amount);
      })()

    default:
      throw new Error('Method not found.');
  }
};