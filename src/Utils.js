
/*
Class for utility functions

wallet is a global in the metamask context
*/
export default class Utils {
    
    static throwError(code, msg){
        //metamask overrides Error codes
        //This function encodes an arc complient error code
        //into the error message, and is then seperated by the SDK
        throw {message:`${code}\n${msg}`};
    }

    static async notify(message){
        wallet.request({
            method: 'snap_notify',
            params: [
              {
                type: 'native',
                message: `${message}`,
              },
            ],
        });
    }

    static async sendConfirmation(prompt, description, textAreaContent){
        
        //turnicate strings that are too long
        if(typeof prompt === 'string'){
            prompt = prompt.substring(0,40);
        }
        if(typeof description === 'string'){
            description = description.substring(0, 140);
        }
        if(typeof textAreaContent === 'string'){
            textAreaContent = textAreaContent.substring(0, 1800);
        }


        const confirm = await wallet.request({
            method: 'snap_confirm',
            params:[
                {
                    prompt: prompt,
                    description: description,
                    textAreaContent: textAreaContent
                }
            ]
        });
        
        return confirm;
    }

    
}