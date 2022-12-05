import nacl from 'tweetnacl';
const algo =  require('algosdk/dist/cjs');
import { getBIP44AddressKeyDeriver, JsonBIP44CoinTypeNode} from '@metamask/key-tree';
import {AES, SHA256, enc} from "crypto-js";
import Utils from './Utils';
/*
This class defines handles storing keys, and all account related code



accounts are stored on the metamask state object.
Which is essentially a javascript {} object
This object is encrypted by metamask.
{
    currentAccountId: account_address,
    Accounts: {
        "0xaddresskjhiuhu": {
            type: string("generated"|"imported"),
            seed: The encrypted Seed for the account if the account type is imported,
            path: A path Integer if the account type is generated,
            name: the Display name of the Account
            addr: //the address of the account the same as the Account Key
            swaps: [ //an array that records swap history for an account
                {}
            ]
            
        },
        ...
    }
}
*/
export default class Accounts{
    constructor(wallet){
        
        this.wallet = wallet;
        this.accounts = {};
        this.currentAccountId = null;
        this.currentAccount = null;
        this.loaded = false;
        
    }
    //must be called before using the Accounts class
    //and esentially loads all the neccerary data
    async init(){

        //load acount Data
        const storedAccounts = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
        
        //checks to see if accounts already exists and if this is not the case
        //creates an account
        if(storedAccounts === null || Object.keys(storedAccounts).length === 0){
            
            const Account = await this.#generateAccount(2);
            let extendedAccount = {};
            extendedAccount.type = 'generated';
            extendedAccount.addr = Account.addr;
            extendedAccount.path = 2;
            extendedAccount.name = 'Account 1';
            extendedAccount.swaps = [];
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
          
          this.accounts = storedAccounts.Accounts;
          this.currentAccountId = storedAccounts.currentAccountId;
          this.loaded = true;
          return this.accounts;
    }
    /*
    this function takes in an address gets an account from 
    */
    async unlockAccount(addr){
        
        if(this.accounts.hasOwnProperty(addr)){
            const tempAccount = this.accounts[addr];
            if(tempAccount.type === 'generated'){
                const Account = await this.#generateAccount(tempAccount.path);
                
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
        if(this.currentAccount !== null){
            return this.currentAccount
        }
        this.currentAccount = await this.unlockAccount(this.currentAccountId);
        return this.currentAccount;
    }

    async getCurrentNeuteredAccount(){
        let output = {}
        const currentAccount = this.accounts[this.currentAccountId];
        if(currentAccount.type === "imported"){
            output.type = String(currentAccount.type)
            output.name = String(currentAccount.name)
            output.swaps = JSON.parse(JSON.stringify(currentAccount.swaps))
            output.addr = String(currentAccount.addr)
            return output
        }
        return JSON.parse(JSON.stringify(currentAccount))
    }

    getNeuteredAccounts(){
        let output = {}
        for(let addr in this.accounts){
            if(this.accounts[addr].type === "imported"){
                output[addr] = {}
                output[addr].type = String(this.accounts[addr].type)
                output[addr].name = String(this.accounts[addr].name)
                output[addr].addr = String(addr)
                output[addr].swaps = JSON.parse(JSON.stringify(this.accounts[addr].swaps))
            }
            else{
                output[addr] = JSON.parse(JSON.stringify(this.accounts[addr]));
            }
        }
        
        return output;
    }

    async setCurrentAccount(addr){
        if(this.accounts.hasOwnProperty(addr)){
            this.currentAccountId = addr;
            this.currentAccount = await this.unlockAccount(addr);
            await this.wallet.request({
                method: 'snap_manageState',
                params: ['update', {"currentAccountId": addr, "Accounts": this.accounts}],
            })
            return true;
        }
        else{
            return Utils.throwError(4300, "account not found")
        }
    }

    //gets all accounts
    async getAccounts(){
        return this.accounts;
    }

    //clears all account data
    async clearAccounts(){
        
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', {}],
          });  
        
        return true
    }

    
    async createNewAccount(name){
        if(!name){
            const accountIndex = (Object.keys(this.accounts).length+1) //generates an account number from the number of accounts
            name = 'Account ' + accountIndex;
        }
        const path = Object.keys(this.accounts).length+2;
        const Account = await this.#generateAccount(path);
        const address = Account.addr;
        
        
        this.accounts[address] = {type: 'generated', path: path, name: name, addr: address, swaps: []};
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', {"currentAccountId": this.currentAccountId, "Accounts": this.accounts}],
        })
        return {"currentAccountId": address, "Accounts": this.accounts, "Account": Account};
    }

    async #getencryptionKey(){
        const entropy = await this.wallet.request({
            method: 'snap_getBip44Entropy',
            params: {
                coinType: 283,
            },
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
        //if name is not specified generate name based on number of accounts
        if(!name){
            name = 'Account ' + (Object.keys(this.accounts).length+1);
        }

        const seed = algo.seedFromMnemonic(mnemonic)
        const keys = nacl.sign.keyPair.fromSeed(seed);

        const address = algo.encodeAddress(keys.publicKey);
        let b64Seed = Buffer.from(seed).toString('base64');
        const key = await this.#getencryptionKey();
        const encryptedSeed = AES.encrypt(b64Seed, key).toString();

        this.accounts[address] = {type: 'imported', seed:encryptedSeed, name:name, addr: address, swaps: []};
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', {"currentAccountId": this.currentAccountId, "Accounts": this.accounts}],
        })
        return {"currentAccountId": address, "Accounts": this.accounts};
    }

    
    async #generateAccount(path){
        
        // Get the node sent from the privileged context.
        // It will have the following shape:
        //   {
        //     privateKey, // A hexadecimal string of the private key
        //     publicKey, // A hexadecimal string of the public key
        //     chainCode, // A hexadecimal string of the chain code
        //     depth, // The number 2, which is the depth of coin_type nodes
        //     parentFingerprint, // The fingerprint of the parent node as number
        //     index, // The index of the node as number
        //     coin_type, // In this case, the number 60
        //     path, // For visualization only. In this case: m / 44' / 60'
        //   }
        const coinTypeNode = await this.wallet.request({
            method: 'snap_getBip44Entropy',
            params: {
                coinType: 283,
            },
        });


        // Get an address key deriver for the coin_type node.
        // In this case, its path will be: m / 44' / 60' / 0' / 0 / address_index
        // Alternatively you can use an extended key (`xprv`) as well.
        console.log("about to derive");
        const addressKeyDeriver = await getBIP44AddressKeyDeriver(coinTypeNode);

        console.log("direvier")
        
        let seed = (await addressKeyDeriver(path)).privateKeyBytes;
        console.log("pre seed")
        console.log(seed);
        //Harden the seed
        seed = nacl.hash(seed).slice(32);
        console.log("hardend seed");
        console.log(seed)
        //algosdk requires keysPairs to be dirived by nacl so we can use the private key as 32 bytes of entropy
        const keys = nacl.sign.keyPair.fromSeed(seed);

        const Account = {}
        Account.addr = algo.encodeAddress(keys.publicKey);
        Account.sk = keys.secretKey;
       
        return Account;
      
    }
    //return a Mnemonic for a given KeyPair
    async getMnemonic(keypair){
        return algo.secretKeyToMnemonic(keypair.sk)
    }

}