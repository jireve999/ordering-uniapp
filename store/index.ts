import {createStore} from "vuex";
import system from "./system";
import business from "./business";
import search from "./search";
import goods from "./goods";
import cart from "./cart";
import meal from "./meal";
import user from "./user";
import order from "./order";
import vcode from "./vcode";

export default createStore({
  modules:{
    system,
    business,
    search,
    goods,
    cart,
    meal,
    user,
    order,
    vcode
  }
})