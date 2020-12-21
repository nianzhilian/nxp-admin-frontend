import {
  fetchPostUrlencoded,
  fetchGet
}
from '../../utils/requestHttp.js'
import Ajax from '../../utils/ajax.js'
const state = {
  info: {},
  token: '',
  UserInfo: {},
  UserDepts: [],
  UserDCs: [],
  roles: [],
}

const mutations = {
  setToken(state, res) {
      state.token = res;
    },
    setRoles: (state, roles) => {
      state.roles = roles
    },
    setUser(state, res) {
      state.info = res;
    }
}

const actions = {
  LoginByUsername({
      commit, rootState
    }, obj) {
      return Ajax.post(obj.url, obj.params).then(res => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // rootState.loading = 0;
            commit('setToken', res.data ? res.data.token :
              '');
            commit('setUser', res);
            resolve()
          }, 500)
        })
      })
    },
    // 获取用户信息
    GetUserUserPermCodes({
      commit, state
    }, obj) {
      return new Promise((resolve, reject) => {
        Ajax.get(obj.url).then(res => {
          if (!res.data) {
            reject('error')
          }
          commit('setRoles', res.data ? res.data : []);
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    LogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('setToken', '')
        localStorage.removeItem('user');
        resolve()
      })
    }
}

export default {
  state,
  mutations,
  actions
}
