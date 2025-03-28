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
    }
  },
  actions:{
    // 显示首页商家列表
    getShop(conText, payload:any) {
      getShopData(payload).then((res:any) => {
        console.log(res);
        if (res.code == 200) {
          conText.commit("SET_SHOPS", {shops: res.data});
        } else {
          conText.commit("SET_SHOPS", {shops: []});
        }
      });
    }
  }
}
