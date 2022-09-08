async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data) 
    });

    return await response.json()
  }

export default class Swapper{
    static tickers =  {'algo':'algo', 'bsc':'bnbbsc', 'eth':'eth'}
    constructor(){
       
    }

    static async preSwap(from, to, amount){
        if(!(from in Swapper.tickers)){
            throw("unsupported Ticker");
        }
        if(!(to in Swapper.tickers)){
            throw("unsupported Ticker");
        }
        let data = await postData("https://y6ha2w3noelczmwztfidtarc3q0lrrgi.lambda-url.us-east-2.on.aws/s", {
            "action":"preSwap",
            "from":tickers[from],
            "to":tickers[to],
            "amount":amount
        })
        return await data.json();
    }

    static async swap(from, to, amount){
        
    }

}