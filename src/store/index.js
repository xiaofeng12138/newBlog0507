import Vue from "vue";
import Vuex from "vuex";
import Login from './module/login.js'
import Permission from './module/permission'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Login,
    Permission
  }
});



