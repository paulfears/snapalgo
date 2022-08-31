const algosdk =  require('algosdk/dist/cjs');

export default class TxnVerifer{
  constructor(){
    this.errorCheck = {};
    this.max64 = (2**64)-1;
    this.idTable= {"mainnet-v1.0": "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
        "testnet-v1.0":	"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
        "betanet-v1.0":	"mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0="};
  }
  verifyTxn(txn, balance){
    this.errorCheck = 
    {   
      valid:true,
      error:[],
      warnings:[]
    };

    const Required = ["type", "from", "fee", "firstRound", "lastRound", "genesisHash"];
    const Optional = ["genesisId", "group", "lease", "note", "reKeyTo"];
    for(var requirement of Required){
      if(!txn[requirement]){
        this.throw(4300, 'Required field missing: '+requirement);
      } else {
        if(requirement === "fee"){
          const fee = requirement
          if(!this.checkInt({value:txn[fee],min:1000})){
            this.throw(4300,'fee must be a uint64 between 1000 and 18446744073709551615');
          }
          else{
            if(txn[fee] > 1000000){
              this.errorCheck.warnings.push('fee is very high: '+txn[fee]+' microalgos');
            }
          }
        }
        if(requirement === "firstRound"){
          if(!this.checkInt({value:txn[requirement],min:1})){
            this.throw(4300, 'firstRound must be a uint64 between 1 and 18446744073709551615')
          }
        }
        if(requirement === "genesisHash"){
          if(txn[requirement] instanceof Uint32Array){
            this.throw(4300, 'genesisHash must be Uint32Array');
          }
          let hashString = this.buf264(txn[requirement]);
          if(!Object.values(this.idTable).includes(hashString)){
            this.throw(4300, 'genesisHash must be valid network hash');
          }
        }
        if(requirement === "lastRound"){
          if(!this.checkInt({value:txn[requirement],min:1})){
            this.throw(4300, 'lastRound must be uint64 between 1 and 18446744073709551615');
          }
          if(txn[requirement]<txn["firstRound"]){
            this.throw(4300, 'lastRound must be greater or equal to firstRound');
          }
        }
        if(requirement === "from"){
          if(!this.checkAddress(txn[requirement])){
            this.throw(4300, 'from must be a valid sender address');
          }
        }
        if(requirement === "type"){
          if(!this.checkString({value:txn[requirement]})){
            this.throw(4300, 'type must be a string');
          }
        }
      }
    }
    if(this.errorCheck.valid===true){
      for(var option of Optional){
        if(txn.hasOwnProperty(option)){
          if(option === "genesisId"){
            if(!this.checkString({value:txn[option]})){
              this.throw(4300, 'genesisId must be a string');
            }
            if(this.idTable[txn[option]] !== this.buf264(txn["genesisHash"])){
              this.throw(4300, 'genesisId must match the same network as genesisHash');
            }
          }
          if(option === "group" && typeof txn.group !== 'undefined'){
            if(!this.checkUint8({value:txn[option]})){
              this.throw(4300, 'group must be a Uint8Array');
            }
          }
          if(option === "lease"){
            if(!this.checkUint8({value:txn[option]})){
              this.throw(4300, 'lease must be a Uint8Array');
            }
          }
          if(option === "note"){
            if(!this.checkUint8({value:txn[option], max:1000})){
              this.throw(4300, 'note must be a UintArray with the amount of bytes less than or equal to 1000');
            }
          }
          if(option === "reKeyTo"){
            if(!this.checkAddress(txn[option])){
              this.throw(4300, 'reKeyTo must be a valid authorized address');
            } else {
              this.errorCheck.warnings.push('this transaction involves rekeying');
            }
          }
        }
      }
    }
    if(this.errorCheck.valid===true){
      if(txn.type === "pay"){
        if(txn.hasOwnProperty('to') && txn.hasOwnProperty('amount')){
          if(!this.checkAddress(txn.to)){
            this.throw(4300, 'to must be a valid address');
          }
          if(!this.checkInt({value:txn.amount})){
            this.throw(4300, 'amount must be a uint64 between 0 and 18446744073709551615');
          }
        } else {
          this.throw(4300, 'to and amount fields are required in Payment Transaction');
        }
        if(txn.hasOwnProperty('closeRemainderTo') && !this.checkAddress(txn.closeRemainderTo)){
          this.throw(4300, 'closeRemainderTo must be a valid CloseRemainderTo address');
        }
      }
      else if(txn.type === "keyreg"){
        this.throw(4200, 'this wallet does not support a Key Registration Txn');
      }
      else if(txn.type === "acfg"){
        if(txn.hasOwnProperty('assetIndex')){
          if(!this.checkInt({value:txn.assetIndex})){
            this.throw(4300, 'assetIndex must be a uint64 between 0 and 18446744073709551615');
          }
        }
        else if(txn.hasOwnProperty('assetDecimals') && txn.hasOwnProperty('assetDefaultFrozen') && txn.hasOwnProperty('assetTotal')){
          if(!this.checkInt({value:txn.assetDecimals,max:19})){
            this.throw(4300, 'assetDecimals must be a uint32 between 0 and 19');
          }
          if(!this.checkBoolean(txn.assetDefaultFrozen)){
            this.throw(4300, 'assetDefaultFrozen must be a boolean or undefined');
          }
          if(!this.checkInt({value:txn.assetTotal,min:1})){
            this.throw(4300, 'assetTotal must be a uint64 between 1 and 18446744073709551615');
          }
        } else {
          this.throw(4300, 'required fields need to be filled for Asset Config, Create, or Destroy txn');
        }
        if(txn.hasOwnProperty('assetClawback') && !this.checkAddress(txn.assetClawback)){
          this.throw(4300, 'assetClawback must be a valid address');
        }
        if(txn.hasOwnProperty('assetFreeze') && !this.checkAddress(txn.assetFreeze)){
          this.throw(4300, 'assetFreeze must be a valid address');
        }
        if(txn.hasOwnProperty('assetManager') && !this.checkAddress(txn.assetManager)){
          this.throw(4300, 'assetManager must be a valid address');
        }
        if(txn.hasOwnProperty('assetReserve') && !this.checkAddress(txn.assetReserve)){
          this.throw(4300, 'assetReserve must be a valid address');
        }
        if(txn.hasOwnProperty('assetMetadataHash') && !(this.checkString({value:txn.assetMetadataHash,min:32,max:32}) || this.checkUint8({value:txn.assetMetadataHash,min:32,max:32}))){
          this.throw(4300, 'assetMetadataHash must be a valid string or Uint8Array that is 32 bytes in length');
        }
        if(txn.hasOwnProperty('assetName') && !this.checkString({value:txn.assetName, max:32})){
          this.throw(4300, 'assetName must be a string with a max length of 32 bytes');
        }
        if(txn.hasOwnProperty('assetURL') && !this.checkString({value:txn.assetURL, max:96})){
          this.throw(4300, 'assetURL must be a string with a max length of 96 bytes');
        }
        if(txn.hasOwnProperty('assetUnitName') && !this.checkString({value:txn.assetUnitName, max:8})){
          this.throw(4300, 'assetUnitName must be a string with a max length of 8 bytes');
        }
      }
      else if(txn.type === "axfer"){
        if(txn.hasOwnProperty('amount') && txn.hasOwnProperty('assetIndex') && txn.hasOwnProperty('to')){
          if(!this.checkInt({value:txn.amount})){
            this.throw(4300, 'amount must be a uint64 between 0 and 18446744073709551615');
          }
          if(!this.checkInt({value:txn.assetIndex})){
            this.throw(4300, 'assetIndex must be a uint64 between 0 and 18446744073709551615');
          }
          if(!this.checkAddress(txn.to)){
            this.throw(4300, 'to must be a valid address');
          }
        } else {
          this.throw(4300, 'amount, assetIndex, and to fields are required in Asset Transfer Txn');
        }
        if(txn.hasOwnProperty('closeRemainderTo') && !this.checkAddress(txn.closeRemainderTo)){
          this.throw(4300, 'closeRemainderTo must be a valid address');
        }
        if(txn.hasOwnProperty('assetRevocationTarget') && !this.checkAddress(txn.assetRevocationTarget)){
          this.throw(4300, 'assetRevocationTarget must be a valid address');
        }
      }
      else if(txn.type === "afrz"){
        if(txn.hasOwnProperty('assetIndex') && txn.hasOwnProperty('freezeAccount')){
          if(!this.checkInt({value:txn.assetIndex})){
            this.throw(4300, 'assetIndex must be a uint64 between 0 and 18446744073709551615');
          }
          if(!this.checkAddress(txn.freezeAccount)){
            this.throw(4300, 'freezeAccount must be a valid address')
          }
          if(txn.hasOwnProperty('freezeState') && !this.checkBoolean(txn.freezeState)){
            this.throw(4300, 'freezeState must be a boolean');
          }
        } else {
          this.throw(4300, 'assetIndex and freezeAccount are required in Asset Freeze Txn');
        }
      }
      else if(txn.type === "appl"){
        //appl create
        if(txn.hasOwnProperty('appApprovalProgram') && txn.hasOwnProperty('appClearProgram') && txn.hasOwnProperty('appGlobalByteSlices') && txn.hasOwnProperty('appGlobalInts') && txn.hasOwnProperty('appLocalByteSlices') && txn.hasOwnProperty('appLocalInts')){
          console.log('appl create');
        }
        //appl call
        else if(txn.hasOwnProperty('appIndex') && txn.hasOwnProperty('appOnComplete')){
          console.log('appl call');
        }
        //appl update
        else if(txn.hasOwnProperty('appIndex') && txn.hasOwnProperty('appApprovalProgram') && txn.hasOwnProperty('appClearProgram')){
            console.log('appl update');
        }
        //appl clearState, closeOut, delete, noOp, optIn
        else if(txn.hasOwnProperty('appIndex')){
          console.log('appl clearState, closeOut, delete, noOp, or optIn txn');
        } else{
          this.throw(4300, 'all required fields need to be filled depending on the target ApplicationTxn');
        }
        //optional appl params
        if(txn.hasOwnProperty('accounts') && !this.arrayAddressCheck(txn.appAccounts)){
          this.throw(4300, 'account must be an array of valid addresses');
        }
        if(txn.hasOwnProperty('appArgs') && !this.arrayUint8Check(txn.appArgs)){
          this.throw(4300, 'appArgs must be an array of Uint8Arrays');
        }
        if(txn.hasOwnProperty('appApprovalProgram') && !this.checkUint8({value:txn.appApprovalProgram,max:2048})){
          this.throw(4300,'appApprovalProgram must be a Uint8Array that is less than 2048 bytes');
        }
        if(txn.hasOwnProperty('appClearProgram') && !this.checkUint8({value:txn.appClearProgram,max:2048})){
          this.throw(4300,'appClearProgram must be a Uint8Array that is less than 2048 bytes');
        }
        if(txn.hasOwnProperty('appGlobalByteSlices') && !this.checkInt({value:txn.appGlobalByteSlices})){
          this.throw(4300, 'appGlobalByteSlices must be a uint64 between 0 and 18446744073709551615');
        }
        if(txn.hasOwnProperty('appGlobalInts') && !this.checkInt({value:txn.appGlobalInts})){
          this.throw(4300, 'appGlobalInts must be a uint64 between 0 and 18446744073709551615');
        }
        if(txn.hasOwnProperty('appIndex') && !this.checkInt({value:txn.appIndex})){
          this.throw(4300, 'appIndex must be a uint64 between 0 and 18446744073709551615');
        }
        if(txn.hasOwnProperty('appLocalByteSlices') && !this.checkInt({value:txn.appLocalByteSlices})){
          this.throw(4300, 'appLocalByteSlices must be a uint64 between 0 and 18446744073709551615');
        }
        if(txn.hasOwnProperty('appLocalInts') && !this.checkInt({value:txn.appLocalInts})){
          this.throw(4300, 'appLocalInts must be a uint64 between 0 and 18446744073709551615');
        }
        if(txn.hasOwnProperty('appOnComplete') && !this.checkInt({value:txn.appOnComplete,max:5})){
          this.throw(4300, 'appOnComplete must be a uint64 between 0 and 5');
        }
        if(txn.hasOwnProperty('extraPages') && !this.checkInt({value:txn.extraPages,max:3})){
          this.throw(4300, 'extraPages must be a uint64 between 0 and 3');
        }
        if(txn.hasOwnProperty('appForeignApps') && !this.checkIntArray(txn.appForeignApps)){
          this.throw(4300, 'appForeignApps must be an array of uint64s between 0 and 18446744073709551615');
        }
        if(txn.hasOwnProperty('appForeignAssets') && !this.checkIntArray(txn.appForeignAssets)){
          this.throw(4300, 'appForeignAssets must be an array of uint64s between 0 and 18446744073709551615');
        }
      }
      else{
        this.throw(4300, 'must specify the type of transaction');
      }
    }

    return this.errorCheck;
  }
  
  buf264(buf){
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
  }
  checkInt(intObj){
    if(!intObj.hasOwnProperty('min')){
      intObj.min = 0;
    }
    if(!intObj.hasOwnProperty('max')){
      intObj.max = this.max64;
    }
    if(Number.isInteger(intObj.value) && intObj.value>=intObj.min && intObj.value<=intObj.max){
      return true;
    } return false;
  }
  checkBoolean(value){
    if(typeof value === 'boolean' || typeof value === 'undefined'){
      return true;
    } return false;
  }
  checkString(strObj){
    if(!strObj.hasOwnProperty('min')){
      strObj.min = 0;
    }
    if(!strObj.hasOwnProperty('max')){
      strObj.max = this.max64;
    }
    if(typeof strObj.value === 'string' && strObj.value.length>=strObj.min && strObj.value.length<=strObj.max){
      return true;
    } return false;
  }
  checkUint8(uintObj){
    if(!uintObj.hasOwnProperty('min')){
      uintObj.min = 0;
    }
    if(!uintObj.hasOwnProperty('max')){
      uintObj.max = this.max64;
    }
    if(uintObj.value.byteLength !== 'undefined' && uintObj.value.byteLength>=uintObj.min && uintObj.value.byteLength<=uintObj.max){
      return true;
    } return false;
  }
  checkAddress(addr){
    try{
      addr = algosdk.encodeAddress(addr.publicKey);
    } catch {}
    return algosdk.isValidAddress(addr);
  }
  arrayAddressCheck(array){
    if(Object.prototype.toString.call(array) === '[object Array]') {
      for(var address of array){
        if(!this.checkAddress(address)){
          return false;
        }
      }
      return true;
    }
    return false;
  }
  arrayUint8Check(array){
    if(Object.prototype.toString.call(array) === '[object Array]') {
      for(var arg of array){
        if(arg.byteLength === 'undefined'){
          return false;
        }
      }
      return true;
    }
    return false;
  }
  checkIntArray(array){
    if(Object.prototype.toString.call(array) === '[object Array]') {
      for(var value of array){
        if(!Number.isInteger(value) || value<0 || value>this.max64){
          return false;
        }
      }
      return true;
    }
    return false;
  }
  throw(code, message){
    this.errorCheck.valid=false;
    this.errorCheck.error.push({code:code,message:message});
  }
}
