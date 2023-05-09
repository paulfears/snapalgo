
/*
Class for utility functions

wallet is a global in the metamask context
*/
import { panel, text, heading, divider, copyable } from '@metamask/snaps-ui';
export default class Utils {
    
    static throwError(code, msg){
        if(code === undefined){
            code = 0
        }
        //metamask overrides Error codes
        //This function encodes an arc complient error code
        //into the error message, and is then seperated by the SDK
        throw new Error(`${code}\n${msg}`);
    }

    static async notify(message){
        try{
            await snap.request({
                method: 'snap_notify',
                params: {
                  type: 'inApp',
                  message: message,
                },
            });
            
            const result = await snap.request({
                method: 'snap_notify',
                params: {
                  type: 'native',
                  message: message,
                },
              });
            return true;
        }
        catch(e){
            console.log("error - ")
            console.log(e);
            await Utils.sendConfirmation("alert", "notifcation", message);
            return false;
        }

        
    }

    static async sendConfirmation(prompt, description, textAreaContent){
        if(!textAreaContent){
            textAreaContent = ""
        }
        const confirm= await snap.request({
        method: 'snap_dialog',
        params: {
            type: 'confirmation',
            content: panel([
            heading(prompt),
            divider(),
            text(description),
            divider(),
            text(textAreaContent),
            ]),
        },
        });
        
        return confirm;
    }

    static async sendAlert(title, info){
        const alert = await snap.request({
            method: 'snap_dialog',
            params:{
                type: 'alert',
                content: panel([
                    heading(title),
                    divider(),
                    text(info)
                ])
            }
        })
        return alert;
    }

    static async balanceDisplay(address, balance){
        const alert = await snap.request({
            method: 'snap_dialog',
            params:{
                type: 'alert',
                content: panel([
                    heading("Account"),
                    copyable(address),
                    divider(),
                    heading("Balance"),
                    text(balance+" Algos")
                ])
            }
        })
        return alert;
    }

    static async displayPanel(panel, type="confirmation"){
        const disp = await snap.request({
            method: 'snap_dialog',
            params:{
                type: type,
                content: panel
            }
        })
        return disp
    }

    
}