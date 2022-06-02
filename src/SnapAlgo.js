const algosdk =  require('algosdk/dist/cjs');

import HTTPClient from './HTTPClient';
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
    getIndexer(){
        if(this.testnet){
            this.network = "testnet";
        }
        else{
            this.network = "mainnet";
        }
        let indexerBaseClient = new HTTPClient().get("index", this.network);
        return new algosdk.Indexer(indexerBaseClient);
    }
    getAlgod(){
        if(this.testnet){
            this.network = "testnet";
        }
        else{
            this.network = "mainnet";
        }
        let algodBaseClient = new HTTPClient().get("algod", this.network);
        return new algosdk.Algodv2(algodBaseClient)
    }
    setTestnet(bool){
        this.testnet = bool;
    }
    async getTransactions(){
        const indexerClient = this.getIndexer();
        const transactions =  await indexerClient.lookupAccountTransactions(this.account.addr).do();
        console.log(await transactions)
        return transactions;
    }
    async getBalance(){
        const algodClient = this.getAlgod();
        const output = (await algodClient.accountInformation(this.account.addr).do()).amount;
        return output;
    }
    isValidAddress(address){
        return algosdk.isValidAddress(address);
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
                algosdk.secretKeyToMnemonic(this.account.sk)
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
        const algodClient = this.getAlgod();
        const suggestedParams = await algodClient.getTransactionParams().do();
        return suggestedParams;
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
    async Transfer(receiver, amount){
        let params = await this.getParams();
        amount = BigInt(amount);
        //create a payment transaction
        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: this.account.addr, 
            to: receiver, 
            amount: amount, 
            suggestedParams: params
        });
        //user confirmation
        const confirm = await this.sendConfirmation("confirm Spend", "send"+amount+" ALGO to "+receiver+"?");
        if(!confirm){
            return "user rejected Transaction: error 4001";
        }
        
        //sign the transaction locally
        let sig = txn.signTxn(this.account.sk);
        //send signed transaction over the wire
        const algodClient = this.getAlgod();
        const txId = txn.txID().toString();
        await algodClient.sendRawTransaction(sig).do();
        algosdk.waitForConfirmation(algodClient, txId, 4).then((result)=>{
            console.log(result);
            this.notify("Transaction Successful", result['confirmed-round']);
        })
        return txId;
        
    }
    async signTxns(txns){
        console.log(txns);
        let signedTxns = [];
        let txnBuffer = Buffer.from(txns, 'base64');
        let txn = algosdk.decodeUnsignedTransaction(txnBuffer);
        console.log(txn);
        return true;
    }
    

    Uint8ArrayToBase64(uint8ArrayObject){
        let array = []
        for(let i =0; i<Object.keys(uint8ArrayObject).length; i++){
          array.push(uint8ArrayObject[i]);
        }
        let output = new Uint8Array(array);
        output = Buffer.from(output).toString('base64');
        console.log(output)
        return output;
    }

    encodeUnsignedTransaction(unsignedTxn){
        console.log("encoding transaction");
        console.log(unsignedTxn);

        let encodedTxn = algosdk.encodeUnsignedTransaction(unsignedTxn);
        console.log(encodedTxn);
        return encodedTxn;
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