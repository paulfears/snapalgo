  import Utils from "./Utils"
  export default function verifyArgs(walletTransaction, first){
    let sign = true
    let message = ""
    let groupMessage = ""
    
    if(walletTransaction.hasOwnProperty("groupMessage")){
      if(first === true){
        groupMessage = walletTransaction.groupMessage;
      }
      else{
        return Utils.throwError(4300, "groupMessage is only allowed to be specified on the first Transaction")
      }
    }
    
    if(walletTransaction.hasOwnProperty("msig")){
      return Utils.throwError(4300, "msig is not supported by snapAlgo")
    }
    if(walletTransaction.hasOwnProperty("message")){
      message = walletTransaction.message;
    }
    if(walletTransaction.hasOwnProperty("addrs")){
      return Utils.throwError(4300, "opperation unsupported by snapAlgo");
    }
    if(walletTransaction.hasOwnProperty("signers")){
      if(isArray(walletTransaction.signers)){
        if(walletTransaction.signer.length < 1){
          sign = false
        }
        else{
          //reject
          return Utils.throwError(
            4300, 
            "The Wallet does not support non-empty signers array"
          )
        }
      }
      else{
        return Utils.throwError(4300, "wallet Signers must be undefined or if the transaction is not to be signed an empty array")
      }
    }
    return {sign:sign, error:false, message:message, groupMessage:groupMessage}
  }