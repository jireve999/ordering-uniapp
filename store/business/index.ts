import {getShopData} from "../../api/business";

export default {
  namespaced:true,
  state:{
    shops: []
  },
  mutations:{
    // 设置商铺数据
    ["SET_SHOPS"](state: any, payload: any) {
      state.shops = payload.shops;
    },
    // 设置商铺分页数据
    ["SET_SHOP_PAGE"](state: any, payload: any) {
      // console.log(...payload.shops)
      state.shops.push(...payload.shops);
    }
  },
  actions:{
    // 显示首页商家列表
    getShop(conText, payload:any) {
      getShopData(payload).then((res:any) => {
        // console.log(res);
        if (res.code == 200) {
          conText.commit("SET_SHOPS", {shops: res.data});
          if (payload.success) {
            payload.success(res.pageinfo.pagenum);
          }
        } else {
          conText.commit("SET_SHOPS", {shops: []});
        }
        if(payload.complete) {
          payload.complete();
        }
      });
    },
    // 获取首页商家分页数据
    getShopPage(conText:any, payload:any) {
      getShopData(payload).then((res:any) => {
        if (res.code == 200) {
          conText.commit("SET_SHOP_PAGE", {shops: res.data});
        }
      });
    }
  }
}
