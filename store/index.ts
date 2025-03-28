import {createStore} from "vuex";
import system from "./system";
import business from "./business";

export default createStore({
  modules:{
    system,
    business
  }
})