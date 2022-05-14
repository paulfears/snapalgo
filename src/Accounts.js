import nacl from 'tweetnacl';
const algo =  require('algosdk/dist/cjs');
import { getBIP44AddressKeyDeriver} from '@metamask/key-tree';

export default class Accounts{
    constructor(wallet){
        console.log("begin Constructing")
        this.wallet = wallet;
        this.accounts = {};
        this.currentAccountId = null;
        this.currentAccount = null;
        this.loaded = false;
        console.log("end Constructing")
    }

    async load(){
        //load acount Data
        console.log("data is now loading");
        const storedAccounts = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
  
  
        if(storedAccounts === null){
            console.log("no stored Accounts");
            let extendedAccount = {};
            const Account = await this.generateAccount(2);
            extendedAccount.type = 'generated';
            extendedAccount.addr = Account.addr;
            const address = Account.addr;
            extendedAccount.path = 2;
            const accounts = {}
            accounts[address] = extendedAccount;
            await this.wallet.request({
              method: 'snap_manageState',
              params: ['update', {"currentAccountId": address, "Accounts": accounts}],
            })
            this.currentAccountId = addr;
            this.accounts = accounts;
            this.loaded = true;
            console.log("account generated no errors");
            return {"currentAccountId": address, "Accounts": accounts};
          }
          else{
            console.log("accounts found");
            this.accounts = storedAccounts.Accounts;
            this.currentAccountId = storedAccounts.currentAccountId;
            return storedAccounts;
          }
    }
    
    async unlockAccount(addr){
        console.log("unlocking account");
        if(!this.loaded){
            await this.load();
        }
        if(this.accounts.hasOwnProperty(addr)){
            const tempAccount = this.accounts[addr];
            if(tempAccount.type === 'generated'){
                const Account = await this.generateAccount(tempAccount.path);
                console.log("account unlocked");
                return Account;
            }
        }
    }

    async getCurrentAccount(){
        if(!this.loaded){
            await this.load();
        }
        if(this.currentAccount !== null){
            return this.currentAccount
        }
        this.currentAccount = await this.unlockAccount(this.currentAccountId);
        return this.currentAccount;
    }

    async setCurrentAccount(addr){
        if(!this.loaded){
            await this.load();
        }
        if(this.accounts.hasOwnProperty(addr)){
            this.currentAccountId = addr;
            this.currentAccount = await this.unlockAccount(addr);
            await this.wallet.request({
                method: 'snap_manageState',
                params: ['update', {"currentAccountId": addr, "Accounts": this.accounts}],
            })
            return {"currentAccountId": addr, "Accounts": this.accounts};
        }
        else{
            return {"error": "account not found"};
        }
    }

    async getAccounts(){
        if(!this.loaded){
            await this.load(); 
        }    
        return this.accounts;
    }

    async createNewAccount(){
        if(!this.loaded){
            await this.load();
        }
        const Account = await this.generateAccount(this.accounts.length + 2);
        const address = Account.addr;
        const path = this.accounts.length+2;
        this.accounts[address] = {type: 'generated', path: path};
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', {"currentAccountId": this.currentAccountId, "Accounts": this.accounts}],
        })
        return {"currentAccountId": address, "Accounts": this.accounts};
    }
    
    async generateAccount(path){
        console.log("generating account");
        const entropy = await this.wallet.request({
          method: 'snap_getBip44Entropy_283',
        });
      
        //dirive private key using metamask key tree
        const algoDiriver = getBIP44AddressKeyDeriver(entropy);
        
        //generate an extended private key then grab the first 32 bytes
        //this coresponds to the private key portion of the extended private key
        
        const privateKey = algoDiriver(path).slice(0, 32);
      
        //algosdk requires keysPairs to be dirived by nacl so we can use the private key as 32 bytes of entropy
        const keys = nacl.sign.keyPair.fromSeed(privateKey);
        const Account = {}
        Account.addr = algo.encodeAddress(keys.publicKey);
        Account.sk = keys.secretKey;
        console.log("account generated");
        return Account;
      
    }
    


}