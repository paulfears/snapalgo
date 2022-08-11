import nacl from 'tweetnacl';
const algo =  require('algosdk/dist/cjs');
import { getBIP44AddressKeyDeriver, JsonBIP44CoinTypeNode} from '@metamask/key-tree';
import {AES, SHA256, enc} from "crypto-js";
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
            else if(tempAccount.type === 'imported'){
                const key = await this.#getencryptionKey();
                let b64Seed = tempAccount.seed;
                b64Seed = AES.decrypt(b64Seed, key).toString(enc.Utf8);
                const seed = new Uint8Array(Buffer.from(b64Seed, 'base64'));
                const keys = nacl.sign.keyPair.fromSeed(seed);
                const Account = {}
                Account.addr = algo.encodeAddress(keys.publicKey);
                Account.sk = keys.secretKey;
                return Account
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
        console.log(name);
        if(!this.loaded){
            console.log("loading")
            await this.load();
        }
        if(!name){
            name = 'Account ' + (Object.keys(this.accounts).length+1);
        }
        const path = Object.keys(this.accounts).length+2;
        const Account = await this.generateAccount(path);
        console.log(Account)
        const address = Account.addr;
        
        
        this.accounts[address] = {type: 'generated', path: path, name: name, addr: address};
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', {"currentAccountId": this.currentAccountId, "Accounts": this.accounts}],
        })
        return {"currentAccountId": address, "Accounts": this.accounts, "Account": Account};
    }

    async #getencryptionKey(){
        const entropy = await this.wallet.request({
            method: 'snap_getBip44Entropy_283',
        });
        
        //dirive private key using metamask key tree
        const coinTypeNode = entropy;
        // Get an address key deriver for the coin_type node.
        // In this case, its path will be: m / 44' / 60' / 0' / 0 / address_index
        // Alternatively you can use an extended key (`xprv`) as well.
        const addressKeyDeriver = await getBIP44AddressKeyDeriver(coinTypeNode);

        
        //generate an extended private key then grab the first 32 bytes
        //this coresponds to the private key portion of the extended private key
        
        const privateKey = (await addressKeyDeriver(0)).privateKeyBuffer;
        return SHA256(privateKey).toString();
    }

    async importAccount(name, mnemonic){
        if(!this.loaded){
            await this.load();
        }
        if(!name){
            name = 'Account ' + (Object.keys(this.accounts).length+1);
        }
        const seed = algo.seedFromMnemonic(mnemonic)
        const keys = nacl.sign.keyPair.fromSeed(seed);
        const address = algo.encodeAddress(keys.publicKey);
        let b64Seed = Buffer.from(seed).toString('base64');
        const key = await this.#getencryptionKey();
        const encryptedSeed = AES.encrypt(b64Seed, key).toString();

        this.accounts[address] = {type: 'imported', seed:encryptedSeed, name:name, addr: address};
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
        const coinTypeNode = entropy;
        // Get an address key deriver for the coin_type node.
        // In this case, its path will be: m / 44' / 60' / 0' / 0 / address_index
        // Alternatively you can use an extended key (`xprv`) as well.
        const addressKeyDeriver = await getBIP44AddressKeyDeriver(coinTypeNode);

        
        //generate an extended private key then grab the first 32 bytes
        //this coresponds to the private key portion of the extended private key
        
        const privateKey = (await addressKeyDeriver(path)).privateKeyBuffer;

      
        //algosdk requires keysPairs to be dirived by nacl so we can use the private key as 32 bytes of entropy
        const keys = nacl.sign.keyPair.fromSeed(privateKey);

        const Account = {}
        Account.addr = algo.encodeAddress(keys.publicKey);
        Account.sk = keys.secretKey;
       
        return Account;
      
    }
    
    async getMnemonic(account){
        return algo.secretKeyToMnemonic(account.sk)
    }

}