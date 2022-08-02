import Utils from "./Utils";
import HTTPClient from "./HTTPClient";
const algosdk =  require('algosdk/dist/cjs');

export default class AlgoWallet{
    constructor(Account){
        this.testnet = false;
        this.IdTable = {
            "mainnet-v1.0":"wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
            "testnet-v1.0":	"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
            "betanet-v1.0":	"mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0="
        };
        this.network = "mainnet-v1.0";
        this.genisisHash = "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=";
        this.Account = Account;
        this.sk = this.Account.sk;
        this.addr = this.Account.addr;
        
    }
    
/*

------------------------------------------ Getters -------------------------------------------------------

*/
    getGenesisId(){
        return this.network;
    }
    getGenesisHash(){
        return this.genisisHash;
    }
    getAccount(){
        return this.Account;
    }
    getTestnet(){
        return this.testnet;
    }

    getAddress(){
        return this.Account.addr;
    }

    getSK(){
        return this.Account.sk;
    }

    getIndexer(){
        let indexerBaseClient = new HTTPClient().get("index", this.network);
        return new algosdk.Indexer(indexerBaseClient);
    }

    getAlgod(){
        let algodBaseClient = new HTTPClient().get("algod", this.network);
        return new algosdk.Algodv2(algodBaseClient)
    }

/*

------------------------------------------ Setters -------------------------------------------------------

*/

    setTestnet(testnet){
        this.testnet = testnet;
        if(testnet){
            this.network = "testnet-v1.0";
            this.genisisHash = "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=";
        }
    }
    setGenesisId(genesisId){
        //check for validity
        if(!(genesisId in this.IdTable)){
            Utils.throwError("Unsupported genesis id", 4200);
        }
        //set GenesisHash and GenesisId
        this.network = genesisId;
        this.genisisHash = this.IdTable[genesisId];
        //setTestnet
        if(this.network === "testnet-v1.0"){
            this.testnet = true;
        }
        else{
            this.testnet = false;
        }
    }
    setGenesisHash(genesisHash){
        this.genisisHash = genesisHash;

        //check for validity
        if(!Object.values(this.IdTable).includes(genesisHash)){
            Utils.throwError("Unsupported genesis hash", 4200);
        }

        //set GenesisId
        const network = Object.keys(this.IdTable).find(key => this.IdTable[key] === genesisHash);
        this.network = network;

        //set Testnet
        if(genesisHash === "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="){
            this.testnet = true;
        }
        else{
            this.testnet = false;
        }
        
    }
}