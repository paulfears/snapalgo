const algosdk =  require('algosdk/dist/cjs');
import HTTPClient from './HTTPClient';
import TxnVerifer from "./TxnVerifier";
import verify from './verifier.js';
export default class SnapAlgo{
    constructor(wallet, account){
        this.wallet = wallet;
        this.account = account;
        this.baseUrl = "https://algorand-api-node.paulfears.repl.co";
        this.testnet = false;
        this.IdTable = {
            "mainnet-v1.0":"wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
            "testnet-v1.0":	"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
            "betanet-v1.0":	"mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0="
          };
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
    async getAssets(){
        const indexerClient = this.getIndexer()
        console.log(Object.getOwnPropertyNames(indexerClient))
        const accountAssets = await indexerClient.lookupAccountByID(this.account.addr).do();
        console.log(accountAssets);
        
        let assets = accountAssets.account.assets;
        for(let asset of assets){
            asset['asset'] = (await indexerClient.searchForAssets()
            .index(asset['asset-id']).do()).assets;
        }
        return assets;
    }
    
    async getAssetById(id){
        console.log(id);
        const indexerClient = this.getIndexer();
        return (await (indexerClient.searchForAssets()
            .index(id).do())).assets[0];
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
        algosdk.waitForConfirmation(algodClient, txId, 4)
        .then((result)=>{
            console.log(result);
            this.notify("Transaction Successful", result['confirmed-round']);
        })
        .catch((err)=>{
            console.log(err);
            this.notify("Transaction Failed");
        })
        return txId;
        
    }
    async optOut(appIndex){
        const algod = this.getAlgod();
        const suggestedParams = await algod.getTransactionParams().do();
        const txn = algosdk.makeApplicationOptOutTxnFromObject({
            from: this.account.addr,
            appIndex: appIndex,
            suggestedParams: suggestedParams
        });
        const confirm = await this.sendConfirmation("confirm OptOut", "opt out of app "+appIndex+"?");
        if(!confirm){
            return "user rejected Transaction: error 4001";
        }
        
        const sig = txn.signTxn(this.account.sk);
        const txId = txn.txID().toString();
        algod.sendRawTransaction(sig).do();
        algosdk.waitForConfirmation(algod, txId, 4)
        .then((result)=>{
            console.log(result);
            this.notify("opt out Succeeded: ", result['confirmed-round']);
        })
        .catch((err)=>{
            console.log(err);
            this.notify("opt out Failed");
        })
        return txId;
    }

    async AssetOptIn(assetIndex){
        const algod = this.getAlgod();
        const suggestedParams = await algod.getTransactionParams().do();
        console.log("new")
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.account.addr,
            assetIndex: assetIndex,
            to: this.account.addr,
            amount: 0,
            suggestedParams: suggestedParams
        });
        const confirm = await this.sendConfirmation("confirm OptIn", "opt in to asset "+assetIndex+"?");
        if(!confirm){
            return "user rejected Transaction: error 4001";
        }
        const sig = txn.signTxn(this.account.sk);
        const txId = txn.txID().toString();
        await algod.sendRawTransaction(sig).do();
        return algosdk.waitForConfirmation(algod, txId, 4)
        .then((result)=>{
            console.log(result);
            this.notify("opt in Succeeded: ", result['confirmed-round']);
        })
        .catch((err)=>{
            console.log(err);
            this.notify("opt in Failed");
        })
    }

    async assetOptOut(assetIndex){
        const confirm = await this.sendConfirmation("confirm OptOut", "opt out of asset "+assetIndex+"?\n you will lose all of this asset");
        if(!confirm){
            return "user rejected Transaction: error 4001";
        }
        const algod = this.getAlgod();
        const suggestedParams = await algod.getTransactionParams().do();
        let closeAddress = (await this.getAssetById(assetIndex)).params.creator;
        console.log("new")
        console.log("closeAddress: "+closeAddress);
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.account.addr,
            assetIndex: assetIndex,
            to: closeAddress,
            amount: 0,
            suggestedParams: suggestedParams,
            closeRemainderTo: closeAddress
        });
        
        console.log(txn);

        const sig = txn.signTxn(this.account.sk);
        const txId = txn.txID().toString();
        let out = await algod.sendRawTransaction(sig).do();
        console.log("out is this");
        console.log(out);
        return algosdk.waitForConfirmation(algod, txId, 4)
        .then((result)=>{
            console.log(result);
            this.notify("opt out Succeeded: ", result['confirmed-round']);
        })
        .catch((err)=>{
            console.log(err);
            this.notify("opt out Failed");
        })
          
    }
    
    async TransferAsset(assetIndex, receiver, amount){
        const algod = this.getAlgod();
        const suggestedParams = await algod.getTransactionParams().do();
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.account.addr,
            assetIndex: assetIndex,
            to: receiver,
            amount: amount,
            suggestedParams: suggestedParams
        });
        const confirm = await this.sendConfirmation("confirm Transfer", "send "+amount+"? of : "+assetIndex+" to "+receiver+"?");
        if(!confirm){
            return "user rejected Transaction: error 4001";
        }
        const sig = txn.signTxn(this.account.sk);
        const txId = txn.txID().toString();
        algod.sendRawTransaction(sig).do();
        algosdk.waitForConfirmation(algod, txId, 4)
        .then((result)=>{
            console.log(result);
            this.notify("Transfer Successful: ", result['confirmed-round']);
        })
        .catch((err)=>{
            console.log(err);
            this.notify("Transfer Failed");
        })
        return txId;           
    }

    async AppOptIn(appIndex){
        console.log("here")
        const algod = this.getAlgod();
        const suggestedParams = await algod.getTransactionParams().do();
        console.log("suggestParams");
        console.log(this.account.addr);
        const txn = algosdk.makeApplicationOptInTxnFromObject({
            from: this.account.addr,
            appIndex: appIndex,
            suggestedParams: suggestedParams
        });
        console.log(txn);

        const confirm = await this.sendConfirmation("confirm OptIn", "opt in to app "+appIndex+"?");
        if(!confirm){
            return "user rejected Transaction: error 4001";
        }

        const sig = txn.signTxn(this.account.sk);
        const txId = txn.txID().toString();
        await algod.sendRawTransaction(sig).do();
        return await algosdk.waitForConfirmation(algod, txId, 4)
        
        .then((result)=>{
            console.log(err);
            this.notify("Opt In Successful", result['confirmed-round']);
        })
        .catch((err)=>{
            console.log(err);
            this.notify("Opt In Failed");
        })
        
    }
    async signTxns(TxnObjs, originString){
        //txObject defined in Algorand Arc 1
        //https://arc.algorand.foundation/ARCs/arc-0001
        
        
        const Txn_Verifer = new TxnVerifer();
        let msg = "Do you want to sign a transaction from "+originString+"?"
        let index = 0;
        let signedTxns = [];
        console.log("txnObject is")
        console.log(TxnObjs)
        for(let txn of TxnObjs){
            txn = txn.txn
            let verifyObj = {};
            if(index == 0){
                verifyObj = verify(txn, true);
            }
            
            else{
                verifyObj = verify(txn);
            }
            console.log("first check verification complete")
            if(verifyObj.error){
                this.notify("Error: "+verifyObj.code);
                throw verifyObj;
            }
            if(verifyObj.message){
                msg = verifyObj.message;
            }
            console.log("here");
            let txnBuffer = Buffer.from(txn, 'base64');
            console.log(txnBuffer)
            console.log("buffer got")
            let decoded_txn = algosdk.decodeUnsignedTransaction(txnBuffer);
            console.log("decoded transaction");
            console.log(decoded_txn);
            const verifiedObj = Txn_Verifer.verifyTxn(decoded_txn);
            console.log(verifiedObj);
            console.log("lets fucking go");
            if(verifiedObj.valid === true){
                
                for(let warning of verifiedObj.warnings){
                    let confirmWarning = this.sendConfirmation("warning", "", warning);
                    if(!confirmWarning){
                        throw {code: 4001, message: "User Rejected Request"}
                    }
                }
                let signedTxn = decoded_txn.signTxn(this.account.sk)
                signedTxns.push(signedTxn);
            }
            else{
                throw verifiedObj.error[0];
            }
            
            index += 1;
        }
        console.log(done);
        return signedTxn;
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