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
    constructor(wallet, algoWallet, walletFuncs){
       this.wallet = wallet;
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
      if(this.wallet.selectedAddress === null){
        await this.wallet.request({ method: 'eth_requestAccounts' });
      }
      const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        to: to, // Required except during contract publications.
        from: this.wallet.selectedAddress, // must match user's active address.
        value: amount, // Only required to send ether to the recipient from the initiating external account.
        chainId: chains[ticker].data.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };
      const txHash = await this.wallet.request({
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
      if(ticker === "algo"){
        this.walletFuncs.transfer(to, amount);
      }
    }

    async switchChain(symbol){
      try{
        await this.wallet.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chains[symbol].data.chainId }],
        });
        return true;
      }
      catch(e){
        if (error.code === 4902) {
          if(chains[symbol].type === "imported"){
            await this.wallet.request({
              method: 'wallet_addEthereumChain',
              params: [
                chains[symbol].data
              ],
            });
            await this.wallet.request({
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
      let data = await postData(this.url, {
        "action":"getMin",
        "from":chains[from].changeNowName,
        "to":chains[to].changeNowName,
      })
      return data.body;
    }
      

    async preSwap(from, to, amount){
        if(!(from in chains)){
            throw("unsupported Ticker");
        }
        if(!(to in chains)){
            throw("unsupported Ticker");
        }
        let data = await postData(this.url, {
            "action":"preSwap",
            "from":chains[from].changeNowName,
            "to":chains[to].changeNowName,
            "amount":amount
        })
        console.log(data);
        return data;
    }

    async swap(from, to, amount, email){
      if(!(from in chains)){
        throw("unsupported Ticker");
      }
      if(!(to in chains)){
          throw("unsupported Ticker");
      }
      
      console.log("email is:", email);
      let outputAddress =  null;
      console.log("from", from);
      console.log("to", to);
      console.log("to currency and type");
      console.log(chains[to]);
      console.log(chains[to].type);
      if(chains[to].type === "snap"){
        outputAddress = this.algoWallet.getAddress()
      }
      else if(chains[to].type === "imported" || chains[to].type === "native"){
        console.log("to currency and type");
        console.log(chains[to]);
        console.log(chains[to].type);
        if(chains[to].type === "imported"){
          this.switchChain(to);
        }
        const ethAccounts = await this.wallet.request({ method: 'eth_requestAccounts' });
        const ethAccount = ethAccounts[0];
        console.log("eth account is:");
        console.log(ethAccount);
        outputAddress = ethAccount
      }
      console.log("email is");
      console.log(email);
      console.log("output address is");
      console.log(outputAddress);
      const swapData = await postData(this.url, {
        "action":"swap",
        "from":chains[from].changeNowName,
        "to":chains[to].changeNowName,
        "amount":amount,
        "addr": outputAddress,
        "email": email?email:""
      })
      console.log("swap data is");
      console.log(swapData);
      for(let item in swapData.body){
        console.log(item);
        console.log(swapData.body[item]);
      }
      if(swapData.body.error){
        console.log("there is an error");
        throw(swapData.body.error);
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
        await this.sendSnap(swapData.body.payinAddress, sendAmount, from);
      }
      
      return swapData;
    }

}