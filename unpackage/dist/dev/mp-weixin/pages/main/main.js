"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  onShareAppMessage(res) {
    return {
      title: "点餐小程序",
      path: "/pages/main/main"
    };
  },
  setup() {
    let store = common_vendor.useStore();
    let isIpx = common_vendor.computed(() => store.state.system.isIpx);
    let shops = common_vendor.computed(() => store.state.business.shops);
    let lng = 0;
    let lat = 0;
    let maxPage = 0;
    let curPage = 1;
    common_vendor.onShow(() => {
      common_vendor.index.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.userLocation"]) {
            common_vendor.index.showModal({
              title: "开启获取地理位置",
              content: "请设置”位置信息“权限，找到附近的店铺",
              success: (res2) => {
                if (res2.confirm) {
                  common_vendor.index.openSetting({
                    success(res3) {
                    }
                  });
                } else if (res2.cancel)
                  ;
              }
            });
          }
        }
      });
      common_vendor.index.getLocation({
        type: "gcj02",
        complete: (res) => {
          lng = res.longitude;
          lat = res.latitude;
          store.dispatch("business/getShop", { page: 1, lng: lng ? lng : 0, lat: lat ? lat : 0, success: (pageNum) => {
            maxPage = pageNum;
            common_vendor.index.__f__("log", "at pages/main/main.vue:91", "maxPage", maxPage);
          } });
        }
      });
      common_vendor.onPullDownRefresh(() => {
        curPage = 1;
        store.dispatch("business/getShop", {
          page: curPage,
          lng: lng ? lng : 0,
          lat: lat ? lat : 0,
          success: (pageNum) => {
            maxPage = pageNum;
          },
          complete: () => {
            common_vendor.index.stopPullDownRefresh();
          }
        });
      });
      common_vendor.onReachBottom(() => {
        if (curPage < maxPage) {
          curPage++;
          store.dispatch("business/getShopPage", { page: curPage, lng: lng ? lng : 0, lat: lat ? lat : 0 });
        }
      });
    });
    return {
      isIpx,
      shops
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _ctx.isIpx ? 1 : "",
    b: common_vendor.f(_ctx.shops, (item, k0, i0) => {
      return {
        a: item.logo,
        b: common_vendor.t(item.branch_shop_name),
        c: common_vendor.t(item.distance),
        d: common_vendor.t(item.address),
        e: item.branch_shop_id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4f50ca8f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/main/main.js.map
