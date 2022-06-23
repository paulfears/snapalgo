class SignTxnsError extends Error {
  
    constructor(code, data){
      
      const msg = {
        4001:"User Rejected Request",
        4100:"The requested operation and/or account has not been authorized by the user.",
        4200: "The wallet does not support the requested operation.",
        4201: "to many transactions",
        4202: "The wallet was not initialized properly beforehand.",
        4300: "The input provided is invalid."
      }
      
      super(msg[code]);
      this.code = code;
      if(!data){
        this.data = msg[code];
      }
      else{
        this.data = data; 
      }
      this.error = true;
    }
  }
  
  export default function verify(walletTransaction, first){
    let error = false
    let errorCode = 0
    let errorMsd = ""
    let sign = true
    let message = ""
    let groupMessage = ""
    
    if(walletTransaction.hasOwnProperty("groupMessage")){
      if(first === true){
        groupMessage = walletTransaction.groupMessage;
      }
      else{
        return new SignTxnsError(4300, "groupMessage is only allowed to be specified on the first Transaction")
      }
    }
    
    if(walletTransaction.hasOwnProperty("msig")){
      return new SignTxnsError(4200)
    }
    if(walletTransaction.hasOwnProperty("message")){
      message = walletTransaction.message;
    }
    if(walletTransaction.hasOwnProperty("addrs")){
      return new SignTxnsError(4200)
    }
    if(walletTransaction.hasOwnProperty("signers")){
      if(isArray(walletTransaction.signers)){
        if(walletTransaction.signer.length < 1){
          sign = false
        }
        else{
          //reject
          return new SignTxnsError(
            4300, 
            "The Wallet does not support non-empty signers array"
          )
        }
      }
      else{
        return new SignTxnsError(
          4300, 
          "wallet Signers must be undefined or if the transaction is not to be signed an empty array"
        )
      }
    }
    return {sign:sign, error:false, message:message, groupMessage:groupMessage}
  }