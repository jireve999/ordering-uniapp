export default {
  namespaced: true,
  state: {
    isIpx: false, // 是否iPhoneX
    platform: 1, // 1:微信小程序，2：微信公众号
  },
  mutations: {
    // 设置isIpx的值
    ["SET_IPX"](state: any, payload: {isIpx: boolean}) {
      state.isIpx = payload.isIpx;
    }
  }
}