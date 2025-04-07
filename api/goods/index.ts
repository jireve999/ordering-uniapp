import config from "../../static/ts/conf";
import {request} from "../../static/ts/utils/request";

//菜品分类
export function getClassifyData(branch_shop_id:string){
    return request(config.baseApi+"/v1/goods/classify","post",{branch_shop_id:branch_shop_id});
}

//菜品展示
export function getGoodsData(branch_shop_id:string){
    return request(config.baseApi+"/v1/goods/show","post",{branch_shop_id:branch_shop_id});
}

//菜品详情
export function getGoodsDetailsData(data:object){
    return request(config.baseApi+"/v1/goods/details","post",data);
}

//显示套餐里可替换菜品数据
export function getMealData(data:object){
    return request(config.baseApi+"/v1/meal/replace","post",data);
}

//显示套餐详情
export function getMealDetailsData(data:object){
    return request(config.baseApi+"/v1/meal/details","post",data);
}