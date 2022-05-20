const algo =  require('algosdk/dist/cjs');
export default class SnapAlgo{
    constructor(wallet, account){
        this.wallet = wallet;
        this.account = account;
        this.baseUrl = "https://algorand-api-node.paulfears.repl.co";
        this.testnet = false;
    }
    getBaseUrl(){
        if(this.testnet){
            return this.baseUrl+"/test";
        }
        return this.baseUrl;
    }
    setTestnet(bool){
        this.testnet = bool;
    }
    async getTransactions(){
        let transactions = await fetch(this.getBaseUrl()+"/transactions?address="+this.account.addr);
        return await transactions.json();
    }
    async getBalance(){
        let balance = await fetch(this.getBaseUrl()+"/balance?address="+this.account.addr);
        return Number(await balance.text());
    }
    isValidAddress(address){
        return algo.isValidAddress(address);
    }
    async displayMnemonic(){
        const confirm = await this.sendConfirmation(
            "confirm", 
            "Are you sure you want to display your mnemonic?",
            "anyone with this mnemonic can spend your funds"
        )
        if(confirm){
            this.sendConfirmation(
                "mnemonic",
                this.account.addr,
                algo.secretKeyToMnemonic(this.account.sk)
            )
            return true;
        }
        else{
            return false;
        }
    }
    getAddress(){
        return this.account.addr;
    }
    async getParams(){
        let request = await fetch(this.getBaseUrl()+"/suggestedParams");
        return await request.json();
    }
    async notify(message){
        wallet.request({
            method: 'snap_notify',
            params: [
              {
                type: 'native',
                message: `${message}`,
              },
            ],
          });
        
    }
    async broadcastTransaction(txn){
        //creates a notifican when the transaction is broadcast
        fetch(this.getBaseUrl()+"/broadcastV2", {
            method: 'POST',
            headers: {                              
              "Content-Type": "application/json"    
            },   
            body: JSON.stringify(txn)
        })
        .then(res => res.text()
            .then(
                (res)=>{
                    this.notify(res);
                }
            
        ))
        return txn.txID;
    }
    async Transfer(receiver, amount){
        let params = await this.getParams();
        amount = BigInt(amount);
        //create a payment transaction
        let txn = algo.makePaymentTxnWithSuggestedParamsFromObject({
            from: this.account.addr, 
            to: receiver, 
            amount: amount, 
            suggestedParams: params
        });
        //user confirmation
        confirm = await this.sendConfirmation("confirm Spend", "send"+amount+" ALGO to "+receiver+"?");
        if(!confirm){
            
            return "user rejected Transaction: error 4001";
        }
        else{
            //sign the transaction locally
            let sig = algo.signTransaction(txn, this.account.sk);
            //send signed transaction over the wire
            this.broadcastTransaction(sig);
            return sig;
        }
    }
    async signTxns(txns){
        
    }
    async queryServer(requestObject){
      //requestObject.relativePath
      //requestObject.requestHeaders
      //requestObject.query
      //requestObject.data
      //requestObject.httpMethod

      const relativePath = requestObject.relativePath;
      let query = '';
      let requestHeaders = {}
      let data = {}
      if(requestObject.hasOwnProperty('data')){
        let data = requestObject.data;
      }
      if(requestObject.hasOwnProperty('query')){
        query = '?' + new URLSearchParams(requestObject.query)
        
      }
      if(requestObject.hasOwnProperty('requestHeaders')){
        requestHeaders = requestObject.requestHeaders;
      }
      if(requestObject.hasOwnProperty('method')){
        const method = requestObject.httpMethod;
      }
      else{
        const method = 'GET';
        data = new URLSearchParams(data).toString();
        console.log(data)
      }
      return fetch(this.getBaseUrl()+relativePath+query, {
        method: method,
        headers: requestHeaders,
        body: JSON.stringify(data)
      })
    }
    GetIndexerClientFunction(snapId){
        console.log("here")
        let baseHTTPClient = {}
        baseHTTPClient.get = function(relativePath, query, requestHeaders){
            console.log("executing get")
            return window.etherium.request({
                method: 'wallet_invokeSnap',
                params:[
                    snapId,
                    {
                        'relativePath': relativePath,
                        'query': query,
                        'requestHeaders': requestHeaders,
                        "httpMethod": "GET"
                    }
                ]
            })
        }
        console.log("added get");
        baseHTTPClient.post = function(relativePath, data, query, requestHeaders){
            return window.etherium.request({
                method: 'wallet_invokeSnap',
                params:[
                    snapId,
                    {
                        'relativePath': relativePath,
                        'data': data,
                        'query': query,
                        'requestHeaders': requestHeaders,
                        "httpMethod": "POST"
                    }
                ]
            });
        }
        console.log("addedPost")
        baseHTTPClient.delete = function(relativePath, data, query, requestHeaders){
            return window.etherium.request({
                method: 'wallet_invokeSnap',
                params:[
                    snapId,
                    {
                        'relativePath': relativePath,
                        'data': data,
                        'query': query,
                        'requestHeaders': requestHeaders,
                        "httpMethod": "DELETE"
                    }
                ]
            })
        }
        baseHTTPClient.get = baseHTTPClient.get.toString();
        baseHTTPClient.post = baseHTTPClient.post.toString();
        baseHTTPClient.delete = baseHTTPClient.delete.toString();
        console.log("added delete")
        console.log(baseHTTPClient)
        console.log(JSON.stringify(baseHTTPClient))
        return JSON.stringify(baseHTTPClient);
    }

    async sendConfirmation(prompt, description, textAreaContent){
        const confirm = await this.wallet.request({
            method: 'snap_confirm',
            params:[
                {
                    prompt: prompt,
                    description: description,
                    textAreaContent: textAreaContent
                }
            ]
        });
        return confirm;
    }
}