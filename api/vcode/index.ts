import config from "../../static/ts/conf/";
import {request} from "../../static/ts/utils/request";

//发送短信验证码
export function sendCodeData(data:any){
    return request(config.baseApi+"/v1/vcode/send_code","post",data);
}