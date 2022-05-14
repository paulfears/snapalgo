import nacl from 'tweetnacl';
const algo =  require('algosdk/dist/cjs');
import { getBIP44AddressKeyDeriver} from '@metamask/key-tree';

export default class Accounts{
    constructor(wallet){
        
        this.wallet = wallet;
        this.accounts = {};
        this.currentAccountId = null;
        this.currentAccount = null;
        this.loaded = false;
        
    }

    async load(){
        //load acount Data
        console.log("load function called")
        const storedAccounts = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
       
  
        if(storedAccounts === null || Object.keys(storedAccounts).length === 0){
            
            const Account = await this.generateAccount(2);
            let extendedAccount = {};
            extendedAccount.type = 'generated';
            extendedAccount.addr = Account.addr;
            extendedAccount.path = 2;
            extendedAccount.name = 'Account 1';
            const address = Account.addr;
            const accounts = {}
            accounts[address] = extendedAccount;
            await this.wallet.request({
              method: 'snap_manageState',
              params: ['update', {"currentAccountId": address, "Accounts": accounts}],
            })
            this.currentAccountId = address;
            this.accounts = accounts;
            this.loaded = true;
            
            return {"currentAccountId": address, "Accounts": accounts};
          }
          else{
            this.accounts = storedAccounts.Accounts;
            this.currentAccountId = storedAccounts.currentAccountId;
            this.loaded = true;
            return storedAccounts;
          }
    }
    
    async unlockAccount(addr){
        
        if(!this.loaded){
            await this.load();
        }
        if(this.accounts.hasOwnProperty(addr)){
            const tempAccount = this.accounts[addr];
            if(tempAccount.type === 'generated'){
                const Account = await this.generateAccount(tempAccount.path);
                
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
    async clearAccounts(){
        
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', {}],
          });
        const state = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });       
        
        return true
    }
    async createNewAccount(name){
        if(!this.loaded){
            await this.load();
        }
        if(!name){
            name = 'Account ' + (Object.keys(this.accounts).length+1);
        }

        const Account = await this.generateAccount(this.accounts.length + 2);
        const address = Account.addr;
        const path = this.accounts.length+2;
        this.accounts[address] = {type: 'generated', path: path, name: name};
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', {"currentAccountId": this.currentAccountId, "Accounts": this.accounts}],
        })
        return {"currentAccountId": address, "Accounts": this.accounts};
    }
    
    async generateAccount(path){
        
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
       
        return Account;
      
    }
    


}