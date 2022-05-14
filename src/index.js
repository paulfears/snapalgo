
import nacl from 'tweetnacl';
import SnapAlgo from './SnapAlgo';
import Accounts from './Accounts';


wallet.registerRpcMessageHandler(async (originString, requestObject) => {
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
      return accountLibary.getAccounts();
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