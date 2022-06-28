
import HTTPClient from './HTTPClient';
import TxnVerifer from "./TxnVerifier";
import verify from './verifier.js';


export default class Arcs{
    constructor(snapAlgoInstance){
        this.snapAlgo = snapAlgoInstance;
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
    async sendConfirmation(prompt, description, textAreaContent){
        const confirm = await this.wallet.request({
            method: 'snap_confirm',
            params:[
                {
                    prompt: prompt.substr(0,40),
                    description: description.substr(0,140),
                    textAreaContent: textAreaContent.substr(0,1800)
                }
            ]
        });
        return confirm;
    }
}