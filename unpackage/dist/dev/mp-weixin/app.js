"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
const static_ts_utils_index = require("./static/ts/utils/index.js");
if (!Math) {
  "./pages/main/main.js";
  "./pages/search/index.js";
  "./pages/goods/index.js";
  "./pages/goods/meal.js";
  "./pages/business_map/index.js";
  "./pages/main/focus.js";
  "./pages/login/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    let store = common_vendor.useStore();
    common_vendor.index.getSystemInfo({
      success: (res) => {
        let name = "iPhone X";
        if (res.deviceModel.indexOf(name) > -1) {
          store.commit("system/SET_IPX", { isIpx: true });
        }
      }
    });
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$utils = static_ts_utils_index.utils;
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
