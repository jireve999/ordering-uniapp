import config from "../../static/ts/conf";
import {request} from "../../static/utils/request";

//显示首页商铺
export function getShopData(data:{}){
    return request(config.baseApi+"/v1/business/shop","get",data);
}

//显示商铺信息
export function getShopInfoData(branch_shop_id:string){
    return request(config.baseApi+"/v1/business/info","get",{branch_shop_id:branch_shop_id});
}

//获取饭店区域
export function getHotelAreaData(data:any){
    return request(config.baseApi+"/v1/business/hotel_area","get",data);
}