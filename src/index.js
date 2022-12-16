
import Accounts from './Accounts';
import AlgoWallet from './AlgoWallet';
import WalletFuncs from './WalletFuncs';
import Arcs from './Arcs';
import Utils from './Utils';
import Swapper from './Swapper';
import Scan from './Scan.js';

/*
Gloabals:
wallet - defined by metamask and is used for interacting with the metamask internal apis
Buffer - used for node.js style buffer
*/
globalThis.Buffer = require('buffer/').Buffer;
module.exports.onRpcRequest = async ({origin, request}) => {
  
  const VERSION = "5.5.0"
  const WarningURL = "http://snapalgo.com/warnings/"
  //scan for known vulnerabilities, and take action depending on the case
  const safe = await Scan(VERSION, WarningURL)
  if(!safe){
    return Utils.throwError(4001, "Wallet is not operational");
  }
  //extract parameters and orgin string from request
  const params = request.params
  const originString = origin;
  // initalize the accounts libary
  const accountLibary = new Accounts(wallet);
  //get a list of all accounts
  await accountLibary.init();
  //get and unlock the current account returns a keypair
  let currentAccount = await accountLibary.getCurrentAccount();
  //Initalize other local classes
  const algoWallet = new AlgoWallet(currentAccount); //keeps track of wallet infomation
  const walletFuncs = new WalletFuncs(algoWallet); //provides wallet functions and side effects
  const arcs = new Arcs(algoWallet, walletFuncs); //defines functions for arc complience
  const swapper = new Swapper(wallet, algoWallet, walletFuncs); //defines the functions that interact with change now
  
  //checks if the testnet parameter is provided and if it is sets the request to perform on the testnet
  if(params && params.hasOwnProperty('testnet')){
    algoWallet.setTestnet(params.testnet);
  }

  //defines all methods
  switch (request.method) {
    
    //get user accounts
    case 'getAccounts':
      return accountLibary.getNeuteredAccounts();

    //returns the name, address, type, swapdata, and path of the current account
    case 'getCurrentAccount':
      return accountLibary.getCurrentNeuteredAccount();

    //generates a new user account and keypair
    case 'createAccount':
      const result = await accountLibary.createNewAccount(params.name);
      const newAccount = result.Account;
      const mnemonic = await accountLibary.getMnemonic(newAccount);
      const mnemonicConfirmation = await Utils.sendConfirmation("Display Mnemonic", "Do you want to display Your mnemonic", "Your mnemonic is used to recover your account, you can choose to display it now, or later from the account tab in the wallet");
      if(mnemonicConfirmation){
        await Utils.sendConfirmation("mnemonic", newAccount.addr, mnemonic);
      }
      await Utils.notify("account created");
      return true
    
    //import an Account can only be done from snapalgo.com
    case 'importAccount':
      if(originString === "https://snapalgo.com"){
        return await accountLibary.importAccount( params.name, params.mnemonic);
      }
      return Utils.throwError(4300, "importAccount can only be called from https://snapalgo.com")
    
    //sets the users current account
    case 'setAccount':
      return await accountLibary.setCurrentAccount(params.address);
    
    //returns an objects representing all of the current accounts assets
    case 'getAssets':
      return await walletFuncs.getAssets();
    
    //returns a boolean describing if the address is valid or not
    case 'isValidAddress':
      return walletFuncs.isValidAddress(params.address);
    
    //returns an object representing the current accounts transaction history
    case 'getTransactions':
      return walletFuncs.getTransactions();
    
    //returns the current accounts balance
    case 'getBalance': 
      return walletFuncs.getBalance();
    
    //returns the current accounts spendable balance
    case 'getSpendable':
      return (await walletFuncs.getSpendable()).toString();
    
    //clear all acount data
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
    
    //securly reveal the users address can only be done from snapalgo.com
    case 'secureReceive':
      if(originString === "https://snapalgo.com"){
        let confirm = await Utils.sendConfirmation("Do you want to display your address?", currentAccount.addr);
        if(confirm){
          return currentAccount.addr;
        }
        else{
          return Utils.throwError(4001, "user Rejected Request");
        }
        
      }
    return Utils.throwError(4300, "this method can only be called from https://snapalgo.com")

        
    //returns the users current address
    case 'getAddress':
      return algoWallet.getAddress();
    
    //displays the current accounts Mnemonic
    case 'displayMnemonic':
      return await walletFuncs.displayMnemonic();
    
    //send algos from the current account to a specified address
    case 'transfer':
      return await walletFuncs.transfer(params.to, params.amount, params.note);
    
    //convers a Uint8ArrayToBase64 used as a helper function for arc complience
    case 'Uint8ArrayToBase64':
        return walletFuncs.Uint8ArrayToBase64(params.data);

    //arc complient sign transaction function
    //https://arc.algorand.foundation/ARCs/arc-0001 
    case 'signTxns':
      return await arcs.signTxns(params.txns, originString);
    
    //arc complient post a transaction to the algorand blockchain
    //https://arc.algorand.foundation/ARCs/arc-0007 
    case 'postTxns':
      return await arcs.postTxns(params.stxns);
    
    //opt into an algorand smart contract
    case 'appOptIn':
      return await walletFuncs.AppOptIn(params.appIndex);
    
    //opt into and algorand asset
    case 'assetOptIn':
      return await walletFuncs.AssetOptIn(params.assetIndex);
    
    //opt out of an algorand asset
    case 'assetOptOut':
      return await walletFuncs.assetOptOut(params.assetIndex);
    
    //send an algorand asset
    case 'transferAsset':
      return await walletFuncs.TransferAsset( params.assetIndex, params.to, params.amount);

    //get infomation about an asset by asset-ID
    case 'getAssetById':
      return await walletFuncs.getAssetById(params.assetIndex);
    
    //arc complient sign and post a transaction
    //https://arc.algorand.foundation/ARCs/arc-0008 
    case 'signAndPostTxns':
      return await arcs.signAndPostTxns(params.txns, originString);
    
    //used to sign a logic signature
    case 'signLogicSig':
      return await walletFuncs.signLogicSig(params.logicSigAccount, params.sender);
    
    //These functions are used to interact with the changenow api
    //and can be used to swap between eth, bsc, and algo

    //this function performs a swap
    case 'swap':
      return await swapper.swap(params.from, params.to, params.amount, params.email);
    
    //gets the minium swap amount between a currency pair
    case 'getMin':
      return await swapper.getMin(params.from, params.to);
    
    //gets infomation about the swap before swapping
    case 'preSwap':
        return await swapper.preSwap(params.from, params.to, params.amount);
    
    //returns the current accounts swap history
    case 'swapHistory':
      let history = await swapper.getSwapHistory()
      if(history === undefined){
        history = [];
      }
      return history;
    
    //get the status of a changenow swap by id
    case 'getSwapStatus':
      return await swapper.getStatus(params.id);
      

    default:
      throw new Error('Method not found.');
  }
  


};