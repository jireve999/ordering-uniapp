"use strict";
const common_vendor = require("../../common/vendor.js");
const Search = () => "../../components/search/index.js";
const _sfc_main = common_vendor.defineComponent({
  name: "main-component",
  //支持分享小程序
  onShareAppMessage(res) {
    if (res.from === "menu") {
      return {
        title: "点餐系统",
        path: "/pages/main/main"
      };
    }
  },
  //引入组件
  components: {
    Search
  },
  setup() {
    let store = common_vendor.useStore();
    let isIpx = common_vendor.computed(() => store.state.system.isIpx);
    let shops = common_vendor.computed(() => store.state.business.shops);
    let maxPage = 0;
    let curPage = 1;
    let lng = 0;
    let lat = 0;
    let isShow = common_vendor.ref(false);
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
          } });
        }
      });
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
    let goPage = (url) => {
      common_vendor.index.redirectTo({
        url
      });
    };
    return {
      isIpx,
      shops,
      goPage,
      isShow
    };
  }
});
if (!Array) {
  const _component_Search = common_vendor.resolveComponent("Search");
  _component_Search();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _ctx.isIpx ? 1 : "",
    b: common_vendor.o(($event) => _ctx.isShow = true),
    c: common_vendor.f(_ctx.shops, (item, index, i0) => {
      return {
        a: item.logo,
        b: common_vendor.t(item.branch_shop_name),
        c: common_vendor.t(item.distance),
        d: common_vendor.t(item.address),
        e: index,
        f: common_vendor.o(($event) => _ctx.goPage("/pages/goods/index?branch_shop_id=" + item.branch_shop_id), index)
      };
    }),
    d: _ctx.isIpx ? 1 : "",
    e: common_vendor.o(($event) => _ctx.isShow = false),
    f: common_vendor.p({
      show: _ctx.isShow
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/main/main.js.map
