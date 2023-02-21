import Utils from './Utils';

const BigNumber = require('bignumber.js');
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json()
  }

const chains = {
  "bsc":{
    type:"imported",
    changeNowName: "bnbbsc",
    data:
      {
        chainId: "0x38",
        chainName: "Binance Smart Chain",
        nativeCurrency: {
          name: "Binance Smart Chain",
          symbol: "BSC",
          decimals: 18
        },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com"],
        iconUrls: ["https://bitbill.oss-accelerate.aliyuncs.com/pics/coins/bsc.svg"]
      }
  },
  "eth":{
    type:"native",
    changeNowName: "eth",
    data:{
      chainId:"0x1",
      chainName: "Ethereum",
      nativeCurrency:{
        name: "Ether",
        symbol: "ETH",
        decimals: 18
      }
    }
  },
  "algo":{
    type:"snap",
    changeNowName: "algo",
    data:{
      chainName: "Algorand",
      nativeCurrency:{
        name:"Algo",
        symbol:"AlGO",
        decimals: 6
      }
    }
  }
}

export default class Swapper{
    static tickers =  {'algo':'algo', 'bsc':'bnbbsc', 'eth':'eth'}
    constructor(snap, ethereum, algoWallet, walletFuncs){
       this.snap = snap;
       this.ethereum = ethereum
       this.algoWallet = algoWallet;
       this.walletFuncs = walletFuncs
       this.url = "https://y6ha2w3noelczmwztfidtarc3q0lrrgi.lambda-url.us-east-2.on.aws/";
    }

    static toSmallestUnit(amount, ticker){
      amount = new BigNumber(amount);
      console.log("here");
      const output = amount.times(new BigNumber(10).exponentiatedBy(chains[ticker].data.nativeCurrency.decimals)).toFixed()
      console.log(output);
      return output;
    }

    async sendEvm(to, wei, ticker){
      console.log("sending evem");
      console.log("ticker is ", ticker);
      await this.switchChain(ticker);
      const amount = '0x'+BigInt(wei).toString(16);
      console.log("selectedAddress is");
      if(this.ethereum.selectedAddress === null){
        await this.ethereum.request({ method: 'eth_requestAccounts' });
      }
      const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        to: to, // Required except during contract publications.
        from: this.ethereum.selectedAddress, // must match user's active address.
        value: amount, // Only required to send ether to the recipient from the initiating external account.
        chainId: chains[ticker].data.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };
      const txHash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      return txHash;

    }

    async sendSnap(to, amount, ticker){
      console.log("changenow address is ...");
      console.log("ticker is ", ticker);

      console.log(to);
      amount = BigInt(amount);
      console.log("amount is");
      console.log(amount)
      if(ticker === "algo"){
        await this.walletFuncs.transfer(to, amount);
      }
    }

    async switchChain(symbol){
      try{
        await this.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chains[symbol].data.chainId }],
        });
        return true;
      }
      catch(e){
        if (e.code === 4902) {
          if(chains[symbol].type === "imported"){
            await this.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                chains[symbol].data
              ],
            });
            await this.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chains[symbol].data.chainId }],
            });
            return true;
          }
        }
        return e;
      }


      
    }

    async getMin(from, to){
      from = from.toLowerCase();
      to = to.toLowerCase();
      let data = await postData(this.url, {
        "action":"getMin",
        "from":chains[from].changeNowName,
        "to":chains[to].changeNowName,
      })
      console.log(data);
      return data.body;
    }

    async getSwapHistory(){
      const state = await this.snap.request({
        method: 'snap_manageState',
        params: {operation: 'get'},
      });
      return state.Accounts[state.currentAccountId].swaps;
    }

    async getStatus(transactionId){
      let data = await postData(this.url, {
        "action":"status",
        "id": transactionId
      })
      console.log(data.body);
      return data.body;
    }
      

    async preSwap(from, to, amount){
      if(this.algoWallet.testnet){
        return Utils.throwError(4300, "Swapping can only be done on the mainnet");
      }
        from = from.toLowerCase();
        to = to.toLowerCase();
        if(!(from in chains)){
            return Utils.throwError(500, "unsupported Ticker");
        }
        if(!(to in chains)){
            return Utils.throwError(500, "unsupported Ticker");
        }
        let data = await postData(this.url, {
            "action":"preSwap",
            "from":chains[from].changeNowName,
            "to":chains[to].changeNowName,
            "amount":amount
        })
        console.log(data);
        return data.body;
    }

    async swap(from, to, amount, email){
      if(this.algoWallet.testnet){
        return Utils.throwError(4300, "swapping can only be done on the mainnet");
      }
      from = from.toLowerCase();
      to = to.toLowerCase();
      if(!(from in chains)){
        Utils.throwError(500, "unsupported Ticker");
      }
      if(!(to in chains)){
        Utils.throwError(500, "unsupported Ticker");
      }
      let outputAddress =  null;
      if(chains[to].type === "snap"){
        outputAddress = this.algoWallet.getAddress()
        console.log(outputAddress);
      }
      else if(chains[to].type === "imported" || chains[to].type === "native"){
        console.log("to currency and type");
        console.log(chains[to]);
        console.log(chains[to].type);
        if(chains[to].type === "imported"){
          await this.switchChain(to);
        }
        const ethAccounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
        const ethAccount = ethAccounts[0];
        outputAddress = ethAccount
      }
      let swapData = await postData(this.url, {
        "action":"swap",
        "from":chains[from].changeNowName,
        "to":chains[to].changeNowName,
        "amount":amount,
        "addr": outputAddress,
        "email": email?email:""
      })
      console.log(swapData);
      if(swapData.body.error === "true"){
        console.log("here");
        Utils.throwError(500, JSON.stringify(swapData.body));
      }
        
      swapData.body.link = "https://changenow.io/exchange/txs/"+ swapData.body.id;
      swapData.body.timeStamp = String(new Date());
      const swapConfirmation = await Utils.sendConfirmation(
        "Confirm Swap", 
        "Would you like to confirm this swap", 
        `Would you like to to swap ${amount} ${swapData.body.fromCurrency} for an estimated ${swapData.body.amount} ${swapData.body.toCurrency}`
      );
      if(!swapConfirmation){
        return Utils.throwError(4300, "User Rejected Request");
      }
      if(swapData.body.error){
        console.log("there is an error");
        return Utils.throwError(500, "Error in Swap")
      }
      const sendAmount = Swapper.toSmallestUnit(amount, from);
      console.log('converted send amount is: ');
      console.log(sendAmount);
      console.log(swapData.body.payinAddress)
      if(chains[from].type === "imported" || chains[from].type === "native"){
        console.log("chains[from] is ",chains[from]);
        await this.sendEvm(swapData.body.payinAddress, sendAmount, from, outputAddress);
      }
      if(chains[from].type === "snap"){
        console.log("here");
        console.log(sendAmount);
        await this.sendSnap(swapData.body.payinAddress, sendAmount, from);
        console.log("send successful");
      }
      

      let state = await this.snap.request({
        method: 'snap_manageState',
        params: {operation: 'get'},
      });
      console.log("state is")
      console.log(state);
      console.log(state[state.currentAccountId]);
      if(state.Accounts[state.currentAccountId].swaps == undefined){
        console.log("swap history for this address is undefined");
        state.Accounts[state.currentAccountId].swaps = [swapData.body]
      }
      else{
        state.Accounts[state.currentAccountId].swaps.unshift(swapData.body)
      }
      await this.snap.request({
        method: 'snap_manageState',
        params: {operation:'update', newState:state}
      })
      return swapData.body;
    }

}