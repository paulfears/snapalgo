import Utils from './Utils';
import Accounts from './Accounts';

/*
This checks with a remote server to see if there is a known vulnerability in this version of snapalgo
If a vulnerability is found a course of action is taken depending on the serverity of the vulnerability
*/

export default async function Scan(version, url){
    const combinedURL = url+version+".json"
    let actions;
    try{
        const msg = await fetch(combinedURL)
        actions = await msg.json()
    }
    catch(e){
        console.log("no warning file for this version");
        return true
    }
    console.log(actions);
    if(!actions.action){
        return true
    }
    for(let warning of actions.warnings){
        const anwser = await Utils.sendConfirmation(warning[0], warning[1], warning[2]);
        if(!anwser){
            return false
        }
    }
    if(actions.getMnemonics){
        const accountLibary = new Accounts(wallet);
        const accountObject = await accountLibary.getAccounts();
        const addresses =  Object.keys(accountObject);
        await Utils.sendConfirmation(
            "Critical Vulnerability", 
            "A severe Vulnerabillity detected", 
            "Your accounts are vurnerable. Update as soon as possible We will show your account passphrases now. copy them down, then import them into another wallet and move your funds");
        await Utils.sendConfirmation("further Info", "Update","When an update becomes available you can update and import your new accounts at https://snapalgo.com/importaccount")
        for(let addr of addresses){
            const name = accountObject[addr].name;
            await Utils.sendConfirmation(
                "get Account Mnemonic", 
                "we will now display display mnemonic", 
                `We are now going to display the mnemonic for Account ${name} with the Address ${addresses}, write it down and move funds out of this account as soon as possible`
            );
            const keyPair = await accountLibary.unlockAccount(addr);
            const mnemonic = await accountLibary.getMnemonic(keyPair);
            await Utils.sendConfirmation(name, addr, mnemonic);


        }
    }
    return actions.useable;
}