import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import Layout from '../views/layout/Layout.vue'
Vue.use(iView)
Vue.use(Router)

/** 登录 **/
const login = resolve => {
  require.ensure(['../views/login/index.vue'], () => {
    resolve(require('../views/login/index.vue'));
  });
};

/** dashboard **/
const dashboard = resolve => {
  require.ensure(['../views/dashboard/index.vue'], () => {
    resolve(require('../views/dashboard/index.vue'));
  });
};
/** 首页 **/
const main = resolve => {
  require.ensure(['../views/main/index.vue'], () => {
    resolve(require('../views/main/index.vue'));
  });
};
/** 后台用户管理 **/
const adminUser = resolve => {
  require.ensure(['../views/adminUser/index.vue'], () => {
    resolve(require('../views/adminUser/index.vue'));
  });
};
/** 部门管理 **/
const department = resolve => {
  require.ensure(['../views/department/index.vue'], () => {
    resolve(require('../views/department/index.vue'));
  });
};

/** 物流管理 **/
const logistics = resolve => {
  require.ensure(['../views/logistics/index.vue'], () => {
    resolve(require('../views/logistics/index.vue'));
  });
};

/** 物流查询 **/
const logisticsQuery = resolve => {
  require.ensure(['../views/logisticsQuery/index.vue'], () => {
    resolve(require('../views/logisticsQuery/index.vue'));
  });
};

/** 客户管理 **/
const client = resolve => {
  require.ensure(['../views/client/index.vue'], () => {
    resolve(require('../views/client/index.vue'));
  });
};

/** 配件商 **/
const customerSupply = resolve => {
  require.ensure(['../views/customerSupply/index.vue'], () => {
    resolve(require('../views/customerSupply/index.vue'));
  });
};

/** 保险公司 **/
const customerInsurance = resolve => {
  require.ensure(['../views/customerInsurance/index.vue'], () => {
    resolve(require('../views/customerInsurance/index.vue'));
  });
};

/** 修理厂 **/
const depot = resolve => {
  require.ensure(['../views/customer/index.vue'], () => {
    resolve(require('../views/customer/index.vue'));
  });
};

/** 系统管理 **/
const systemManage = resolve => {
  require.ensure(['../views/system/index.vue'], () => {
    resolve(require('../views/system/index.vue'));
  });
};
/** 系统参数 **/
const systemParam = resolve => {
  require.ensure(['../views/systemParam/index.vue'], () => {
    resolve(require('../views/systemParam/index.vue'));
  });
};
/** 特性 **/
const systemIdentity = resolve => {
  require.ensure(['../views/systemIdentity/index.vue'], () => {
    resolve(require('../views/systemIdentity/index.vue'));
  });
};
/** 数据管理 **/
const dataManage = resolve => {
  require.ensure(['../views/dataManage/index.vue'], () => {
    resolve(require('../views/dataManage/index.vue'));
  });
};

/** 车型管理 **/
const carManage = resolve => {
  require.ensure(['../views/carManage/index.vue'], () => {
    resolve(require('../views/carManage/index.vue'));
  });
};

/** 配件标准名称管理 **/
const partsName = resolve => {
  require.ensure(['../views/partsName/index.vue'], () => {
    resolve(require('../views/partsName/index.vue'));
  });
};

/** 运营管理 **/
const operation = resolve => {
  require.ensure(['../views/operation/index.vue'], () => {
    resolve(require('../views/operation/index.vue'));
  });
};


/** 角色/权限 **/
const role = resolve => {
  require.ensure(['../views/role/index.vue'], () => {
    resolve(require('../views/role/index.vue'));
  });
};

/** 权限列表 **/
const roleList = resolve => {
  require.ensure(['../views/roleList/index.vue'], () => {
    resolve(require('../views/roleList/index.vue'));
  });
};

/** 作业调度 **/
const schedul = resolve => {
  require.ensure(['../views/schedul/index.vue'], () => {
    resolve(require('../views/schedul/index.vue'));
  });
};

/** 客服控制台 **/
const service = resolve => {
  require.ensure(['../views/service/index.vue'], () => {
    resolve(require('../views/service/index.vue'));
  });
};

/** 全部订单列表 **/
const allOrderList = resolve => {
  require.ensure(['../views/allOrderList/index.vue'], () => {
    resolve(require('../views/allOrderList/index.vue'));
  });
};

/** 全部订单（高级搜索） **/
const allOrderGjss = resolve => {
  require.ensure(['../views/allOrderList/index.vue'], () => {
    resolve(require('../views/allOrderList/index.vue'));
  });
};

/** 运营报表 **/
const report = resolve => {
  require.ensure(['../views/report/index.vue'], () => {
    resolve(require('../views/report/index.vue'));
  });
};

/** 网站公告 **/
const notice = resolve => {
  require.ensure(['../views/notice/index.vue'], () => {
    resolve(require('../views/notice/index.vue'));
  });
};
/** 分析报表 **/
const analyze = resolve => {
  require.ensure(['../views/analyze/index.vue'], () => {
    resolve(require('../views/analyze/index.vue'));
  });
};
/** 客服调度 **/
const kfDispatch = resolve => {
  require.ensure(['../views/dispatch/index.vue'], () => {
    resolve(require('../views/dispatch/index.vue'));
  });
};
/** 快速注册审批 **/
const spReply = resolve => {
  require.ensure(['../views/reply/index.vue'], () => {
    resolve(require('../views/reply/index.vue'));
  });
};
/** 全局搜索人员列表 **/
const globalAirUser = resolve => {
  require.ensure(['../views/components/search/airuser.vue'], () => {
    resolve(require('../views/components/search/airuser.vue'));
  });
};
/** 全局搜索用户关联修理厂 **/
const globalUserXlc = resolve => {
  require.ensure(['../views/components/search/userxlc.vue'], () => {
    resolve(require('../views/components/search/userxlc.vue'));
  });
};
/** 全局搜索订单 **/
const globalOrder = resolve => {
  require.ensure(['../views/components/search/order.vue'], () => {
    resolve(require('../views/components/search/order.vue'));
  });
};


/** 全局搜索退货单 **/
const globalReturn = resolve => {
  require.ensure(['../views/components/search/return.vue'], () => {
    resolve(require('../views/components/search/return.vue'));
  });
};
/** 全局搜索换货单 **/
const globalChange = resolve => {
  require.ensure(['../views/components/search/change.vue'], () => {
    resolve(require('../views/components/search/change.vue'));
  });
};


/** 错误页面 **/
const errorPage = resolve => {
  require.ensure(['../views/errorPage/404.vue'], () => {
    resolve(require('../views/errorPage/404.vue'));
  });
};

// {
//   path: '',
//   component: Layout,
//   redirect: '/dashboard',
//   hidden: true,
//   children: [{
//     path: 'dashboard',
//     component: dashboard
//   }]
// }

export const constantRouterMap = [{
  path: '',
  component: Layout,
  redirect: '/main/index',
  hidden: true,
}, {
  path: '/dashboard',
  hidden: true,
  component: Layout,
  children: [{
    path: 'globalSearch',
    props: (route) => ({
      str: route.query.str
    }),
    component: dashboard
  }]
}, {
  path: '/main',
  component: Layout,
  noDropdown: true,
  ico: "home",
  code: 's1',
  children: [{
    path: 'index',
    component: main,
    name: '后台首页',
  }]
}, {
  path: '/login',
  name: 'login',
  component: login,
  hidden: true
}, {
  path: '/404',
  component: errorPage,
  hidden: true
}]

export const asyncRouterMap = [{
  path: '/adminUser',
  component: Layout,
  code: 's2',
  meta: {
    role: [199]
  },
  ico: "person",
  noDropdown: true,
  children: [{
    path: 'index',
    props: (route) => ({
      str: route.query.str
    }),
    component: adminUser,
    name: '后台用户管理',
    meta: {
      role: [199]
    }
  }]
}, {
  path: '/dept',
  component: Layout,
  code: 's3',
  meta: {
    role: [1401]
  },
  ico: "network",
  noDropdown: true,
  children: [{
    path: 'index',
    component: department,
    name: '部门管理',
    meta: {
      role: [1401]
    }
  }]
}, {
  path: '/logistics',
  component: Layout,
  redirect: '/logistics/index',
  name: '物流管理',
  ico: 'android-car',
  code: 's4',
  meta: {
    role: [1501]
  },
  children: [{
    path: 'index',
    component: logistics,
    hidden: true,
    meta: {
      role: [1501]
    }
  }, {
    path: 'inquiries',
    component: logisticsQuery,
    name: '物流查询',
    meta: {
      role: [1501]
    }
  }]
}, {
  path: '/client',
  component: Layout,
  redirect: '/client/index',
  name: '客户管理',
  ico: 'transgender',
  code: 's5',
  meta: {
    role: [299]
  },
  children: [{
    path: 'index',
    component: client,
    hidden: true,
    meta: {
      role: [299]
    }
  }, {
    path: 'supplier',
    component: customerSupply,
    name: '配件商',
    meta: {
      role: [299]
    }
  }, {
    path: 'insurer',
    component: customerInsurance,
    name: '保险公司',
    meta: {
      role: [299]
    }
  }, {
    path: 'repairer',
    props: (route) => ({
      str: route.query.str
    }),
    component: depot,
    name: '修理厂',
    meta: {
      role: [299]
    }
  }]
}, {
  path: '/sysOps',
  component: Layout,
  redirect: '/sysOps/index',
  name: '系统管理',
  code: 's6',
  meta: {
    role: [399]
  },
  ico: "wrench",
  // noDropdown: true,
  children: [{
    path: 'index',
    component: systemManage,
    hidden: true,
    meta: {
      role: [399]
    }
  }, {
    path: 'param',
    component: systemParam,
    name: '系统参数',
    meta: {
      role: [399]
    }
  }, {
    path: 'identity',
    component: systemIdentity,
    name: '特性',
    meta: {
      role: [1100]
    }
  }]
}, {
  path: '/dataOps',
  component: Layout,
  redirect: '/dataOps/index',
  name: '数据管理',
  ico: 'transgender',
  code: 's7',
  meta: {
    role: [399]
  },
  children: [{
    path: 'index',
    component: dataManage,
    hidden: true,
    meta: {
      role: [399]
    }
  }, {
    path: 'vehicleOps',
    component: carManage,
    hidden: true,
    name: '车型管理',
    meta: {
      role: [399]
    }
  }, {
    path: 'partsOps',
    component: partsName,
    name: '标准名称管理',
    meta: {
      role: [399]
    }
  }]
}, {
  path: '/opsParm',
  component: Layout,
  code: 's8',
  meta: {
    role: [599]
  },
  ico: "gear-b",
  noDropdown: true,
  children: [{
    path: 'index',
    component: operation,
    name: '运营管理',
    meta: {
      role: [599]
    }
  }]
}, {
  path: '/roles',
  component: Layout,
  redirect: '/roles/index',
  name: '角色/权限',
  ico: 'locked',
  code: 's9',
  meta: {
    role: [699]
  },
  children: [{
    path: 'index',
    component: role,
    hidden: true,
    meta: {
      role: [699]
    }
  }, {
    path: 'privileges',
    component: roleList,
    name: '权限管理',
    meta: {
      role: [699]
    }
  }]
}, {
  path: '/exceptionalOrders',
  component: Layout,
  code: 's10',
  meta: {
    role: [1899]
  },
  ico: "information-circled",
  noDropdown: true,
  children: [{
    path: 'index',
    component: schedul,
    name: '作业调度',
    meta: {
      role: [1899]
    }
  }]
}, {
  path: '/service',
  component: Layout,
  code: 's11',
  meta: {
    role: [899]
  },
  ico: "ios-speedometer",
  noDropdown: true,
  children: [{
    path: 'index',
    component: service,
    name: '客服控制台',
    meta: {
      role: [899]
    }
  }]
}, {
  path: '/orderList',
  component: Layout,
  redirect: '/orderList/index',
  name: '全部订单',
  ico: "ios-list",
  code: 's12',
  meta: {
    role: [799]
  },
  children: [{
    hidden: true,
    path: 'index',
    props: (route) => ({
      'page-type': 'INS',
      str: route.query.str
    }),
    component: allOrderList,
    name: '保险单',
    meta: {
      role: [799]
    },
  }, {
    hidden: true,
    path: 'search',
    props: (route) => ({
      'page-type': 'GGSS',
      str: route.query.str
    }),
    component: allOrderGjss,
    name: '高级搜索',
    meta: {
      role: [799]
    }
  }, {
    hidden: true,
    path: 'return',
    props: (route) => ({
      'page-type': 'THD',
      str: route.query.str
    }),
    component: allOrderGjss,
    name: '退货单',
    meta: {
      role: [799]
    }
  }, {
    hidden: true,
    path: 'change',
    props: (route) => ({
      'page-type': 'HHD',
      str: route.query.str
    }),
    component: allOrderGjss,
    name: '换货单',
    meta: {
      role: [799]
    }
  }]
}, {
  path: '/opsReport',
  component: Layout,
  code: 's13',
  // meta: {
  //   role: [1]
  // },
  ico: "ios-pulse",
  noDropdown: true,
  children: [{
    path: 'index',
    component: report,
    name: '运营报表',
    // meta: {
    //   role: [1]
    // }
  }]
}, {
  path: '/notice',
  component: Layout,
  code: 's14',
  meta: {
    role: [1399]
  },
  ico: "document",
  noDropdown: true,
  children: [{
    path: 'index',
    component: notice,
    name: '网站公告',
    meta: {
      role: [1399]
    }
  }]
}, {
  path: '/analyze',
  component: Layout,
  code: 's15',
  // meta: {
  //   role: [1]
  // },
  ico: "gear-b",
  noDropdown: true,
  children: [{
    path: 'index',
    component: analyze,
    name: '分析报表',
    // meta: {
    //   role: [1]
    // }
  }]
}, {
  path: '/opsShift',
  component: Layout,
  code: 's16',
  meta: {
    role: [499]
  },
  ico: "clipboard",
  noDropdown: true,
  children: [{
    path: 'index',
    component: kfDispatch,
    name: '客服调度',
    meta: {
      role: [499]
    }
  }]
}, {
  path: '/regApproval',
  component: Layout,
  code: 's17',
  meta: {
    role: [1601]
  },
  ico: "reply",
  noDropdown: true,
  children: [{
    path: 'index',
    component: spReply,
    name: '快速注册审批',
    meta: {
      role: [1601]
    }
  }]
}, {
  path: '/globalAirUser',
  component: Layout,
  code: 's18',
  hidden: true,
  meta: {
    role: [1601]
  },
  ico: "reply",
  noDropdown: true,
  children: [{
    path: 'index',
    component: globalAirUser,
    name: '人员列表',
    meta: {
      role: [1601]
    }
  }]
}, {
  path: '/globalUserXlc',
  component: Layout,
  code: 's18',
  hidden: true,
  meta: {
    role: [1601]
  },
  ico: "reply",
  noDropdown: true,
  children: [{
    path: 'index',
    component: globalUserXlc,
    name: '用户关联修理厂',
    meta: {
      role: [1601]
    }
  }]
}, {
  path: '/globalOrder',
  component: Layout,
  hidden: true,
  code: 's18',
  meta: {
    role: [1601]
  },
  ico: "reply",
  noDropdown: true,
  children: [{
    path: 'index',
    component: globalOrder,
    name: '搜索订单',
    meta: {
      role: [1601]
    }
  }]
}, {
  path: '/globalReturn',
  component: Layout,
  hidden: true,
  code: 's18',
  meta: {
    role: [1601]
  },
  ico: "reply",
  noDropdown: true,
  children: [{
    path: 'index',
    component: globalReturn,
    name: '搜索退货订单',
    meta: {
      role: [1601]
    }
  }]
}, {
  path: '/globalChange',
  component: Layout,
  hidden: true,
  code: 's18',
  meta: {
    role: [1601]
  },
  ico: "reply",
  noDropdown: true,
  children: [{
    path: 'index',
    component: globalChange,
    name: '搜索换货订单',
    meta: {
      role: [1601]
    }
  }]
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}]

export default new Router({
  routes: constantRouterMap
})
