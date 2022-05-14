import Swal from 'sweetalert2'
import networkImage from './images/network.png';
export class Wallet{
    constructor(){
      this.enabled = false;
      this.genisisHash = null;
      this.genisisId = null;
      this.enabledAccounts = [];
      
      window.algorand = {}
      window.algorand.enable = this.enable;
    }
    async enable(opts){

      if(!opts){
        opts = {};
      }

      let IdTable = {
        "mainnet-v1.0":"wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
        "testnet-v1.0":	"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
        "betanet-v1.0":	"mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0="
      };
  
      
      let genisisIdProvided = false;
      let genisisHashProvided = false;
      let accountsProvided = false;
      let matchVerified = false;
      if(opts.hasOwnProperty('genisisID')){
        this.genisisId = opts.genisisId;
        genisisIdProvided = true;
      }
      
      if(opts.hasOwnProperty('genisisHash')){
        this.genisisHash = opts.genisisHash;
        this.genisisHashProvided = true;
      }
      
      if(opts.hasOwnProperty('accounts')){
        this.enabledAccounts = opts.accounts;
        this.accountsProvided = true;
      }
      
      if(genisisHashProvided && genisisIdProvided){
        if(IdTable.hasOwnProperty(this.genisisId)){
          if(IdTable[this.genisisId] == this.genisisHash){
            matchVerified = true;
          }
          if(IdTable[this.genisisId] !== this.genisisHash){
            //revise error later
            throw("error")
          }
        }
        if(Object.values(IdTable).includes(this.genisisHash)){
          //hash is valid for official network but genisis id does not match
          if(!matchVerified){
            throw("error")
          }
        }
      }
      if(genisisIdProvided && !genisisHashProvided){
        if(IdTable.hasOwnProperty(this.genisisId)){
          this.genisisHash = IdTable[this.genisisId]
        }
        else{
          console.log("unknown network")
        }
      }
      if(genisisHashProvided && !genisisHashProvided){
        let keys = Object.keys(IdTable);
        let keyFound = false;
        for(let i = 0; i<keys.length; i++){
          if(IdTable[keys[i]] === this.genisisHash){
            this.genisisId = keys[i];
            keyFound = true;
            break;
          }
        }
        if(!keyFound){
          console.log("unknown network")
        }
      }
      if(!genisisHashProvided && !genisisIdProvided){
        const network = await Swal.fire({
            title: 'Select a Network',
            position: 'top-end',
            width:"300px",
            input: 'select',
            inputOptions: {
              'mainnet-v1.0': 'Mainnet',
              'testnet-v1.0': 'Testnet',
              'betanet-v1.0': 'Betanet'
            },
            imageUrl: networkImage,
            text: 'Which Network Would you like to connect to?',
            showCancelButton: true,
            confirmButtonText: 'Conrirm',
            cancelButtonText: 'Cancel',
          })
        console.log(network)
        if(network.isConfirmed){
          this.genisisId = network.value
          this.genisisHash = IdTable[network.value]
        }
      }
    }
  
    
    signAndPostTxns(){
      if(!this.enable){
        this.#throwEnabledError();
      }
    }
    getAlgorandV2Client(){
      if(!this.enable){
        this.#throwEnabledError();
      }
    }
    getIndexerClient(){
      
    }
    signTxns(){
      
    }
    postTxns(){
      
    }
  
  
    #throwEnabledError(){
      let enableError = new Error(
        "wallet is not enabled, try calling enable"
      );
      enabledError.code = 4202
      throw(enabledError);
    }
  }