import config from "../../static/ts/conf/";
import {request} from "../../static/ts/utils/request";

//获取微信小程序登录的openid和unionid
export function getWeChatOpenIdData(data:any){
    return request(config.baseApi+"/v1/wechat_openid","post",data);
}

//微信小程序会员登录后保存到数据库
export function setWeChatUserData(data:any){
    return request(config.baseApi+"/v1/wechat_login_save","post",data);
}

//微信小程序解密获取手机号和用户信息
export function getDewxbizdataData(data:any){
    return request(config.baseApi+"/v1/dewxbizdata","post",data);
}

//微信小程序登录后绑定手机号
export function bindWechatLoginBindPhoneNumberData(data:any){
    return request(config.baseApi+"/v1/user/wechat_login_bindcellphone","post",data);
}

//检测会员登录获取的token是否合法
export function safeUserData(data:any){
    return request(config.baseApi+"/v1/safe_user","post",data);
}

//获取用户信息
export function getUserInfoData(data:any){
    return request(config.baseApi+"/v1/user/userinfo","post",data);
}

//安全退出
export function outLoginData(data:any){
    return request(config.baseApi+"/v1/outlogin","post",data);
}

//修改用户信息
export function updateUserData(data:any){
    return request(config.baseApi+"/v1/user/update","post",data);
}

//绑定手机号
export function bindCellphoneData(data:any){
    return request(config.baseApi+"/v1/user/wechat_bind_mobile","post",data);
}

//是否绑定过手机号
export function existCellphoneData(data:any){
    return request(config.baseApi+"/v1/exist_cellphone","post",data);
}