import {sendCodeData} from "../../api/vcode";
export default {
    namespaced:true,
    actions:{
        //发送短信验证码
        sendCode(conText:any,payload:any){
            return sendCodeData(payload).then((res:any)=>{
                return res;
            })
        }
    }
}