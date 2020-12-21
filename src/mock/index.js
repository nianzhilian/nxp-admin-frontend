const Mock = require("mockjs")
// 设置所有ajax请求的超时时间，模拟网络传输耗时
Mock.setup({
	timeout: 0 - 300
})

require('./Auth.js')
require('./BizUsers.js')
require('./Features.js')
require('./JYBrands.js')
require('./OpsParms.js')
require('./Previleges.js')
require('./region.js')
require('./Roles.js')
require('./ServiceUsers.js')
require('./ServiceDepts.js')

