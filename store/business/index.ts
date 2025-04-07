import {getShopData,getShopInfoData,getHotelAreaData} from "../../api/business";

export default {
  namespaced:true,
  state:{
    shops: [],
    shopInfo:{},//显示商铺信息
    hotelArea:""//饭店区域
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
    },
    //设置商铺信息
    ["SET_SHOP_INFO"](state:any,payload:{shopInfo:object}){
      state.shopInfo=payload.shopInfo;
    },
    //设置饭店区域
    ["SET_HOTEL_AREA"](state:any,payload:any){
        state.hotelArea=payload.hotelArea;
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
    },
    //显示商铺信息
    showShopInfo(conText:any,payload:{branch_shop_id:string,success?:Function}){
      getShopInfoData(payload.branch_shop_id).then((res:any)=>{
          if(res.code==200){
              conText.commit("SET_SHOP_INFO",{shopInfo:res.data});
              if(payload.success){
                  payload.success(res.data);
              }
          }
      })
    },
    //获取饭店区域
    getHotelArea(conText:any,payload:any){
        getHotelAreaData(payload).then((res:any)=>{
            if(res.code==200){
                conText.commit("SET_HOTEL_AREA",{hotelArea:res.data.title});
            }
        })
    }
  }
}
