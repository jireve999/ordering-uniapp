import config from "../../static/ts/conf";
import {request} from "../../static/ts/utils/request";

//添加购物车
export function addCartData(data:any){
    return request(config.baseApi+"/v1/user/cart/add","post",data);
}

//显示购物车
export function getCartData(data:any){
    return request(config.baseApi+"/v1/user/cart/show","post",data);
}

//更新购物车数量
export function setAmountData(data:any){
    return request(config.baseApi+"/v1/user/cart/set_amount","post",data);
}

//删除购物车单个菜品
export function delData(data:any){
    return request(config.baseApi+"/v1/user/cart/del","post",data);
}

//清空购物车所有菜品
export function clearCartData(data:any){
    return request(config.baseApi+"/v1/user/cart/clear","post",data);
}