class TxnVerifer{
    constructor(){

    }
    verifyTxn(txn){
        const Required = ["type", "snd", "fee", "fv", "lv", "gh"];
        const Optional = ["gen", "grp", "lx", "note", "rekey"];
        const validGH = [];
        const validGEN = []; 
        for(requirement of Required){
            if(!txn[requirement]){
                //throw();
            }
            
        }
        for(option of Optional){
            if(txn.hasOwnProperty(option)){
                if(option === "gen"){
    
                }
            }
        }
        
        if(txn.type === "pay"){
    
        }
        else if(txn.type === "keyreg"){
    
        }
        else if(txn.type === "acfg"){
    
        }
        else if(txn.type === "axfer"){}
        else if(txn.type === "afrz"){}
        else if(txn.type === "appl"){}
        else{
            //throw();
        }
    
    }
}
