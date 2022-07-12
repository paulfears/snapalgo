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
        return transactions;
    }
    async getAssets(){
        const indexerClient = this.getIndexer()
        const accountAssets = await indexerClient.lookupAccountByID(this.account.addr).do();
        if(accountAssets.account === undefined){
            return [];
        }
        if(accountAssets.account.assets === undefined){
            //no assets
            return [];
        }
        let assets = accountAssets.account.assets;
        for(let asset of assets){
            asset['asset'] = (await indexerClient.searchForAssets()
            .index(asset['asset-id']).do()).assets;
        }
        return assets;
    }
    
    async getAssetById(id){
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
        console.log("notify called");
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
        const confirm = await this.sendConfirmation("confirm Spend", `send ${Number(amount)/1000000} ALGO to ${receiver}?`);
        if(!confirm){
            return "user rejected Transaction: error 4001";
        }
        
        //sign the transaction locally
        let sig = txn.signTxn(this.account.sk);
        //send signed transaction over the wire
        const algodClient = this.getAlgod();
        const txId = txn.txID().toString();
        await algodClient.sendRawTransaction(sig).do();
        return await algosdk.waitForConfirmation(algodClient, txId, 4)
        .then((result)=>{
            console.log(result);
            this.notify("Transaction Successful", result['confirmed-round']);
            return result;
        })
        .catch((err)=>{
            console.log(err);
            this.notify("Transaction Failed");
            return err;
        })
        
        
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
            this.notify(`opt out Succeeded: ${appIndex}`);
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
            this.notify("opt in Succeeded: "+assetIndex);
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
            this.notify("opt out Succeeded: "+assetIndex);
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
            this.notify(`Opt In Successful: ${appIndex}`);
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
        let msg = "Do you want to sign transactions from "+originString+"?"
        const confirm = await this.sendConfirmation("sign TXNS?", "This can result in spending of funds", msg);
        if(!confirm){
            throw {code: 4001, message: "User Rejected Request"}
        }
        let index = 0;
        let signedTxns = [];
        console.log("txnObject is")
        console.log(TxnObjs)
        
        for(let txn of TxnObjs){

            if(txn.message){
                const msgConfirmation = await this.sendConfirmation("Untrusted Message", originString+" says:", txn.message)
                if(!msgConfirmation){
                    throw {code: 4001, message: "User Rejected Request"}
                }
            }
            if(txn.signers){
                if(Array.isArray(txn.signers) && txn.signers.length === 0){
                    signedTxns.push(null);
                }
            }
            txn = txn.txn
            console.log("txn group is");
            console.log(txn.group);
            console.log(txn);
            let firstGroup = null;
            let verifyObj = {};
            if(index == 0){
                firstGroup = txn.group;
                verifyObj = verify(txn, true);
            }
            
            else{
                if(txn.group !== undefined){
                    for(let i = 0; i<txn.group.length; i++){
                        if(txn.group[i] !== firstGroup[i]){
                            throw {code: 4001, message: "Transaction Groups do not match"}
                        }
                    }
                    verifyObj = verify(txn);
                }
                else{
                    if(firstGroup !== null || firstGroup !== undefined){
                        throw {code: 4001, message: "Transaction Groups do not match"}
                    }
                }
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
                    let confirmWarning = await this.sendConfirmation("warning", "txn Warning", warning);
                    if(!confirmWarning){
                        throw {code: 4001, message: "User Rejected Request"}
                    }
                }
                let signedTxn = decoded_txn.signTxn(this.account.sk)
                
                const b64signedTxn = Buffer.from(signedTxn).toString('base64');
                signedTxns.push(b64signedTxn);
            }
            else{
                throw verifiedObj.error[0];
            }
            
            index += 1;
        }
        console.log("done");
        console.log("signedTxns is: ");
        console.log(signedTxns);
        return signedTxns;
    }

    async postTxns(stxns){
        console.log(stxns);
        stxns = stxns.map(stxB64 => Buffer.from(stxB64, "base64"))
        console.log(stxns);
        const ogTxn = algosdk.decodeSignedTransaction(stxns[0]);
        console.log(ogTxn);
        console.log(ogTxn.txn);
        const algod = this.getAlgod()
        const txId = await algod.sendRawTransaction(stxns).do()
        console.log(txId);
        console.log("txId is: ");
        console.log(txId);
        algosdk.waitForConfirmation(algod, txId, 4)
        .then((result)=>{
            console.log(result);
            this.notify("transaction was successful ", result['confirmed-round']);
        })
        .catch((err)=>{
            console.log(err);
            this.notify("transaction submission failed");
        })
        return txId;
    }
    
    async signAndPostTxns(txns){
        const signedTxns = await this.signTxns(txns);
        let txId = await this.postTxns(signedTxns);
        console.log("txId is: ");
        console.log(txId);
        return txId;
    }

    async signLogicSig(logicSigAccount){
        let confirm = await this.sendConfirmation("sign logic sig?", "Are you sure", "Signing a logic signature gives a smart contract the ability to sign transactions on your behalf. This can result in the loss of funds");
        if(!confirm){
            throw {code: 4001, message: "User Rejected Request"}
        }
        const logicBytes = new Uint8Array(Buffer.from(logicSigAccount, 'base64'));
        logicSigAccount = algosdk.LogicSigAccount.fromByte(logicBytes)
        logicSigAccount.sign(this.account.sk);
        const signedAccount = Buffer.from(logicSigAccount.toByte()).toString('base64')
        return signedAccount;
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
        if(typeof prompt === 'string'){
            prompt = prompt.substring(0,40);
        }
        if(typeof description === 'string'){
            description = description.substring(0, 140);
        }
        if(typeof textAreaContent === 'string'){
            textAreaContent = textAreaContent.substring(0, 1800);
        }
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