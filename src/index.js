
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
  const params = requestObject.params
  console.log(params);
  const originString = origin;
  let accounts = await accountLibary.getAccounts();
  let currentAccount = await accountLibary.getCurrentAccount();
  const algoWallet = new AlgoWallet(currentAccount);
  const walletFuncs = new WalletFuncs(algoWallet);
  const arcs = new Arcs(algoWallet);
  const swapper = new Swapper(wallet, algoWallet, walletFuncs);
  console.log(origin);
  
  if(requestObject.hasOwnProperty('testnet')){
    algoWallet.setTestnet(params.testnet);
  }
  switch (requestObject.method) {
    
    case 'getAccounts':
      return accounts

    case 'getCurrentAccount':
      return currentAccount

    case 'createAccount':
      const result = await accountLibary.createNewAccount(params.name);
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
      
      return await accountLibary.importAccount( params.name, params.mnemonic);

    case 'setAccount':
      return await accountLibary.setCurrentAccount(params.address);

    case 'getAssets':
      return walletFuncs.getAssets();
      
    case 'isValidAddress':
      return walletFuncs.isValidAddress(params.address);
    
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
      let out = nacl.sign(new Uint8Array(params.data), currentAccount.sk);
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
      return await walletFuncs.transfer(params.to, params.amount);
    
    case 'getAccount':
      return await getAccount();
    case 'Uint8ArrayToBase64':
        return walletFuncs.Uint8ArrayToBase64(params.data);
    case 'signTxns':
      return arcs.signTxns(params.txns, originString);
    case 'postTxns':
      return arcs.postTxns(params.stxns);
    case 'AppOptIn':
      return walletFuncs.AppOptIn(params.appIndex);
    case 'AssetOptIn':
      return walletFuncs.AssetOptIn(params.assetIndex);
    case 'AssetOptOut':
      return walletFuncs.assetOptOut(params.assetIndex);
    case 'transferAsset':
      return walletFuncs.TransferAsset( params.assetIndex, params.to, params.amount);
    case 'getAssetById':
      return walletFuncs.getAssetById(params.assetIndex);
    case 'signAndPostTxns':
      return arcs.signAndPostTxns(params.txns, originString);
    case 'signLogicSig':
      return walletFuncs.signLogicSig(params.logicSigAccount, params.sender);
    case 'swap':
      //by putting this code inside its own function be prevent the swapper object from being defined multple times
      return await swapper.swap(params.from, params.to, params.amount, params.email);
      
    case 'getMin':
      return await swapper.getMin(params.from, params.to);

    case 'preSwap':
        return await swapper.preSwap(params.from, params.to, params.amount);
    
    case 'swapHistory':
      let history = await swapper.getSwapHistory()
      if(history === undefined){
        history = [];
      }
      return history;
    
    case 'getStatus':
      return await swapper.getStatus(params.id);
      

    default:
      throw new Error('Method not found.');
  }
  


};