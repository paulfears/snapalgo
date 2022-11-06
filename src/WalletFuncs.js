const algosdk =  require('algosdk/dist/cjs');
import Utils from './Utils';
const BigNumber = require('bignumber.js');

export default class WalletFuncs{
    
    //takes an instance of algowallet on construction
    constructor(algoWallet){
        this.wallet = algoWallet;
        
        this.networkStr = this.wallet.testnet?" (Testnet)":" (Mainnet)"
    }

    #signAndPost(txn, algod){
        const sig = txn.signTxn(this.wallet.sk);
        const txId = txn.txID().toString();
        algod.sendRawTransaction(sig).do();
        return txId
    }

    async #getParams(algod){
        const suggestedParams = await algod.getTransactionParams().do();
        return suggestedParams;
    }

    async getTransactions(){
        const indexerClient = this.wallet.getIndexer();
        const addr = this.wallet.getAddress();
        const transactions =  await indexerClient.lookupAccountTransactions(addr).do();
        return transactions;
    }
    async getAssets(){
        const indexerClient = this.wallet.getIndexer()
        const addr = this.wallet.getAddress();
        const accountAssets = await indexerClient.lookupAccountByID(addr).do();
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
        const indexerClient = this.wallet.getIndexer();
        return (await (indexerClient.searchForAssets()
            .index(id).do())).assets[0];
    }

    async getBalance(){
        const algodClient = this.wallet.getAlgod();
        const addr = this.wallet.getAddress();
        const output = (await algodClient.accountInformation(addr).do())
        console.log(output);
        const balance = output.amount;
        return balance;
    }

    async getSpendable(){
        const algodClient = this.wallet.getAlgod();
        const addr = this.wallet.getAddress();
        const output = (await algodClient.accountInformation(addr).do())
        const spendable = BigInt(output["amount-without-pending-rewards"])-BigInt(output['min-balance']);
        console.log(spendable);
        return spendable;
    }

    isValidAddress(address){
        return algosdk.isValidAddress(address);
    }

    async displayMnemonic(){
        const confirm = await Utils.sendConfirmation(
            "confirm", 
            "Are you sure you want to display your mnemonic?",
            "anyone with this mnemonic can spend your funds"
        )

        if(!confirm){
            Utils.throwError(4001, "user rejected Mnemonic Request");
        }

        await Utils.sendConfirmation(
            "mnemonic",
            this.wallet.addr,
            algosdk.secretKeyToMnemonic(this.wallet.sk)
        )
        
        //metamask requires a value to be returned
        return true;
    }

    
    
    
    
    async transfer(receiver, amount, note){
        //user confirmation
        this.networkStr = this.wallet.testnet?" (Testnet)":" (Mainnet)"
        const confirm = await Utils.sendConfirmation(
            "confirm Spend"+this.networkStr, 
            `send ${Number(amount)/1000000} ALGO to ${receiver}?`);
        if(!confirm){
            return Utils.throwError(4001, "user rejected Transaction");
        }
        console.log(note)
        if(note===undefined){
            note = null
        }
        else{
            const enc = new TextEncoder();
            note = enc.encode(note);
        }
        console.log(note);

        const algod = this.wallet.getAlgod();
        amount = BigInt(amount);
        let params = await this.#getParams(algod);
        console.log(params);
        //create a payment transaction
        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: this.wallet.addr, 
            to: receiver, 
            amount: amount, 
            note: note,
            suggestedParams: params
        });
        console.log(txn);


        
        
        let txId;
        try{
            txId = this.#signAndPost(txn, algod);
            await algosdk.waitForConfirmation(algod, txId, 4)
            
            await Utils.notify("Transaction Successful");
            
            return txId;
        }
        catch(e){
            await Utils.notify("Transaction failed");
            return Utils.throwError(e);
        }
           
    }
    
    async AssetOptIn(assetIndex){
        this.networkStr = this.wallet.testnet?" (Testnet)":" (Mainnet)"
        const confirm = await Utils.sendConfirmation(
            "confirm OptIn"+this.networkStr, 
            "opt in to asset "+assetIndex+"?");
        if(!confirm){
            return Utils.throwError(4001, "user rejected Transaction");
        }

        const algod = this.wallet.getAlgod();
        const suggestedParams = await this.#getParams(algod);
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.wallet.addr,
            assetIndex: assetIndex,
            to: this.wallet.addr,
            amount: 0,
            suggestedParams: suggestedParams
        });

        let txId
        try{
            txId = this.#signAndPost(txn, algod);
            await algosdk.waitForConfirmation(algod, txId, 4)
        }
        catch(e){
            await Utils.notify("Opt in failed")
            return Utils.throwError(e);
        }
        await Utils.notify("opt in Succeeded: "+assetIndex);
        return txId;
    }

    async assetOptOut(assetIndex){
        this.networkStr = this.wallet.testnet?" (Testnet)":" (Mainnet)"
        const confirm = await Utils.sendConfirmation("confirm OptOut"+this.networkStr, "opt out of asset "+assetIndex+"?\n you will lose all of this asset");
        if(!confirm){
            Utils.throwError(4001, "user rejected Transaction");
        }
        const algod = this.wallet.getAlgod();
        const suggestedParams = await this.#getParams(algod);
        let closeAddress = (await this.getAssetById(assetIndex)).params.creator;
        
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.wallet.addr,
            assetIndex: assetIndex,
            to: closeAddress,
            amount: 0,
            suggestedParams: suggestedParams,
            closeRemainderTo: closeAddress
        });
        let txId;
        try{
            txId = this.#signAndPost(txn, algod);
            await algosdk.waitForConfirmation(algod, txId, 4)
        }
        catch(e){
            console.log(e);
            await Utils.notify("opt out Failed");
            return Utils.throwError(e);
        }
        await Utils.notify("opt out sucessful");
        return txId;
          
    }
    
    async TransferAsset(assetIndex, receiver, amount){
        this.networkStr = this.wallet.testnet?" (Testnet)":" (Mainnet)"
        const confirm = await Utils.sendConfirmation("confirm Transfer"+this.networkStr, "send "+amount+"? of : "+assetIndex+" to "+receiver+"?");
        if(!confirm){
            return Utils.throwError(4001, "user rejected Transaction");
        }
        const algod = this.wallet.getAlgod();
        const suggestedParams = await this.#getParams(algod);
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.wallet.addr,
            assetIndex: assetIndex,
            to: receiver,
            amount: amount,
            suggestedParams: suggestedParams
        });

        let txId;
        try{
            txId = this.#signAndPost(txn, algod);
            await algosdk.waitForConfirmation(algod, txId, 4)
        }
        catch(e){
            await Utils.notify("Transfer Failed");
            return Utils.trh(err);
            
        }
        await Utils.notify("Transfer Successful: ", result['confirmed-round']);
        
        return txId;           
    }

    async AppOptIn(appIndex){
        this.networkStr = this.wallet.testnet?" (Testnet)":" (Mainnet)"
        const confirm = await Utils.sendConfirmation("confirm OptIn"+this.networkStr, "opt in to app "+appIndex+"?");
        if(!confirm){
            return Utils.throwError(4001, "user rejected Transaction");
        }
        const algod = this.wallet.getAlgod();
        const suggestedParams = await this.#getParams(algod);
        const txn = algosdk.makeApplicationOptInTxnFromObject({
            from: this.wallet.addr,
            appIndex: appIndex,
            suggestedParams: suggestedParams
        });
        



        let txId;
        try{
            txId = this.#signAndPost(txn, algod);
            await algosdk.waitForConfirmation(algod, txId, 4)
        }
        catch(e){
            console.log("failed");
            await Utils.notify("Opt In Failed");
            return Utils.throwError(e);
        }
        await Utils.notify(`Opt In Successful: ${appIndex}`);
        return txId;
        
        
    }
    

    async signLogicSig(logicSigAccount){
        let confirm = await Utils.sendConfirmation("sign logic sig?", "Are you sure", "Signing a logic signature gives a smart contract the ability to sign transactions on your behalf even on the mainnet. This can result in the loss of funds");
        if(!confirm){
            Utils.throwError(4001, "user rejected Request");
        }
        const logicBytes = new Uint8Array(Buffer.from(logicSigAccount, 'base64'));
        logicSigAccount = algosdk.LogicSigAccount.fromByte(logicBytes)
        logicSigAccount.sign(this.wallet.sk);
        const signedAccount = Buffer.from(logicSigAccount.toByte()).toString('base64')
        return signedAccount;
    }

}