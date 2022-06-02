
const querystring = require('querystring');

export default class HTTPClient{
  constructor(){
      
      this.urlTable = {
          "algod":{
              "mainnet": "https://mainnet-api.algonode.cloud",
              "testnet": "https://testnet-api.algonode.cloud",
              "betanet": "https://betanet-api.algonode.cloud"
          },
          "index":{
              "mainnet": "https://mainnet-idx.algonode.cloud",
              "testnet": "https://testnet-idx.algonode.cloud",
              "betanet": "https://betanet-idx.algonode.cloud"
          }
      }

  }
  get(type, network){
      const baseHTTPClient = {}
      baseHTTPClient.get = (relativePath, query, requestHeaders) => {
          if(query){
            query = querystring.stringify(query);
            if(query.length > 0){
              query = "?"+query;
            }
            
          }
          else{
            query = ''
          }
          if(!requestHeaders){
            requestHeaders = {}
          }
          return fetch(this.urlTable[type][network]+relativePath+query, {
            method: "get",
            headers: requestHeaders,
          })
          .then(async (res)=>{
            let output = {};
            
            output.status = await res.status
            output.body = new Uint8Array(await res.arrayBuffer());
            output.headers = await res.headers
            return output;
          })
          
      }
    baseHTTPClient.post = (relativePath, data, query, requestHeaders) => {
        if(!requestHeaders){
          requestHeaders = {}
        }
        if(!data){
          let data = {}
        }
        if(query){
          query = querystring.stringify(query);
          if(query.length > 0){
            query = "?"+query;
          }  
        }
        else{
          query = ''
        }
        return fetch(this.urlTable[type][network]+relativePath+query, {
          method: "post",
          headers: requestHeaders,
          body: new Uint8Array(data)
        })
        .then(async (res)=>{
          let output = {}
          output.status = await res.status
          output.body = new Uint8Array(await res.arrayBuffer());
          output.headers = await res.headers
          return output
        })
    }
    console.log(baseHTTPClient)
    return baseHTTPClient;
  }

}