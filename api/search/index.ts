import config from "../../static/ts/conf";
import {request} from "../../static/ts/utils/request";

//获取热门搜索关键词
export function getHotKeywordsData(data:{}){
    return request(config.baseApi+"/v1/search/hotkeywords","get",data);
}

//搜索菜品
export function getSearchGoodsData(data:object) {
    return request(config.baseApi+"/v1/search/goods","get",data);
}