import {createStore} from "vuex";
import system from "./system";
import business from "./business";
import search from "./search";

export default createStore({
  modules:{
    system,
    business,
    search
  }
})