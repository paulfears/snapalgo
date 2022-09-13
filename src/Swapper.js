
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
      chainId:"0x38",
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
      return BigInt(amount)*(BigInt(10)**BigInt(chains[ticker].data.nativeCurrency.decimals))
    }

    async sendEvm(to, wei, ticker){
      await this.switchChain(ticker);
      const amount = '0x'+wei.toString(16);
      const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        to: to, // Required except during contract publications.
        from: ethereum.selectedAddress, // must match user's active address.
        value: amount, // Only required to send ether to the recipient from the initiating external account.
        chainId: chains[ticker].data.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

    }

    async sendSnap(to, amount, ticker){
      console.log("changenow address is ...");
      console.log(to);
      if(ticker === "algo"){
        this.walletFuncs.transfer(to, amount);
      }
    }

    async switchChain(symbol){

      if(chains[symbol].type === "imported"){
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            chains[symbol].data
          ],
        });
      }
      await this.wallet.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chains[symbol].data.chainId }],
      });
      return true;
    }

    async getMin(from, to){
      let data = await postData(this.url, {
        "action":"getMin",
        "from":chains[from].changeNowName,
        "to":chains[to].changeNowName,
      })
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
        return await data.json();
    }

    async swap(from, to, amount, email){
      if(!(from in chains)){
        throw("unsupported Ticker");
      }
      if(!(to in chains)){
          throw("unsupported Ticker");
      }
      const ethAccounts = await this.wallet.request({ method: 'eth_requestAccounts' });
      const ethAccount = ethAccounts[0];
      const swapData = await postData(this.url, {
        "action":"swap",
        "from":chains[from].changeNowName,
        "to":chains[to].changeNowName,
        "amount":amount,
        "addr": ethAccount,
        "email": email?email:""
      })
      console.log("swap data is");
      console.log(swapData);
      if(swapData.body.error){
        throw(swapData.body.error);
      }
      const sendAmount = Swapper.toSmallestUnit(amount, from);
      if(chains[from].type === "imported" || chains[from].type === "native"){
        
        await this.sendEvm(swapData.body.payinAddress, sendAmount, from);
      }
      if(chains[from].type === "snap"){
        await this.sendSnap(swapData.body.payinAddress, sendAmount, from);
      }
      
      return swapData;
    }

}