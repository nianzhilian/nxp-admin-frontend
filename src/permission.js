import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import {
  getStorage
}
from './utils/common.js'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {

  iView.LoadingBar.start() // 开启Progress
  getStorage(store);
  if (store.state.user.token) {
    //增加用户访问记录信息
    store.commit('setSourceInfo', {
      sourceUri: from.path,
      currentUri: to.path,
      tempPath: to.path
    });
    if (to.path === '/login') {
      next({
        path: '/'
      })
      iView.LoadingBar.finish();
    } else {
      if (store.getters.roles.length == 0) {
        store.dispatch('GetUserUserPermCodes', {
          url: '/nxp-sso/Auth/UserPermCodes'
        }).then((res) => {
          const roles = store.getters.roles;
          store.dispatch('GenerateRoutes', {
            roles
          }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          })
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            iView.Message.error('验证失败,请重新登录')
            next({
              path: '/login'
            })
          })
        })
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login')
      iView.LoadingBar.finish();
    }
  }
})

router.afterEach(() => {
  iView.LoadingBar.finish() // 结束Progress
})
