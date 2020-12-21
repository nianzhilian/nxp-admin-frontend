import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import user from './modules/user.js'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    permission
  },
  getters,
  state: {
    sourceInfo: {}
  },
  mutations: mutations
})
