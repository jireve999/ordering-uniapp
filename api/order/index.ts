import config from "../../static/ts/conf/";
import {request} from "../../static/ts/utils/request";

//提交订单
export function addOrderData(data:any){
    return request(config.baseApi+"/v1/user/order/add","post",data);
}

//微信小程序统一下单接口
export function wechatUnifiedorderData(data:any){
    return request(config.baseApi+"/v1/wxpay/wechat_unifiedorder","post",data);
}

//提交订单后返回的信息
export function getLastOrderData(data:any){
    return request(config.baseApi+"/v1/user/order/last","post",data)
}

//直接支付
export function payData(data:any){
    return request(config.baseApi+"/v1/payorder/notify","post",data)
}

//查看已付款订单
export function getOrderData(data:any){
    return request(config.baseApi+"/v1/user/order/show","post",data);
}

//订单详情
export function getOrderDetailsData(data:any){
    return request(config.baseApi+"/v1/user/order/details","post",data);
}

//申请退款
export function applyRefundOrderData(data:any){
    return request(config.baseApi+"/v1/user/order/refund","post",data);
}

//查看已退款订单
export function getRefundOrderData(data:any){
    return request(config.baseApi+"/v1/user/order/show_refund","post",data);
}