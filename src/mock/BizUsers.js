const Mock = require("mockjs");

let BizUsersData = function(options) {
	return {
		"msg": "查询成功",
		"code": 0,
		"data": [{
			"id": 1000000087,
			// 新建必填字段
			"loginName": "ysbx", // 用户登录名
			"passWord": "698D51A19D8A121CE581499D7B701668", // 密码MD5化
			"name": "保险公司", // 姓名
			"sex": 0, // 性别：0-男，1-女
			"type": 2, // 组织类型：1-配件商，2-保险公司，3-修理厂
			"birthDay": "123", // 生日
			"phone": "19988388889", // 手机
			"email": "", // 邮件
			"qq": "123", // QQ
			"orgId": 2000000039, // 组织id
			"position": "经理", // 在组织中的职位
			// 系统自动生成
			"orgName": "演示保险", // 所属组织名称
			"createTime": 1526356316000, // 创建时间
			"lastModify": 1533722946000, // 更新时间
			"status": 0, // 状态：1-启用，0-禁用
			// 后期部分更新
			"isAdvisor": 1, // 是否为修理厂维修顾问：1-是，0-否
			"isConsignee": 1, // 是否为修理厂收货人：1-是，0-否
			"isDamage": 0, // 是否为保险公司定损员：1-是，0-否
			"userRoleIds": [], // 用户角色id数组
			"userRoleNames": "", // 用户角色集合
			"wechat": null
		}, {
			"id": 1000000085,
			// 新建必填字段
			"loginName": "ysbx", // 用户登录名
			"passWord": "698D51A19D8A121CE581499D7B701668", // 密码MD5化
			"name": "保险公司", // 姓名
			"sex": 0, // 性别：0-男，1-女
			"type": 2, // 组织类型：1-配件商，2-保险公司，3-修理厂
			"birthDay": "123", // 生日
			"phone": "19988388889", // 手机
			"email": "", // 邮件
			"qq": "123", // QQ
			"orgId": 2000000039, // 组织id
			"position": "经理", // 在组织中的职位
			// 系统自动生成
			"orgName": "演示保险", // 所属组织名称
			"createTime": 1526356316000, // 创建时间
			"lastModify": 1533722946000, // 更新时间
			"status": 0, // 状态：1-启用，0-禁用
			// 后期部分更新
			"isAdvisor": 1, // 是否为修理厂维修顾问：1-是，0-否
			"isConsignee": 1, // 是否为修理厂收货人：1-是，0-否
			"isDamage": 0, // 是否为保险公司定损员：1-是，0-否
			"userRoleIds": [], // 用户角色id数组
			"userRoleNames": "", // 用户角色集合
			"wechat": null
		}],
		"count": 1

	}
}
let BizUsersId = function(options) {
	return {
		"code": 0, // errorcode：0-正常  1-错误
		"msg": "查询成功", //返回查询说明
		"data": //返回数据列表
		{
			"id": 1000000087,
			// 新建必填字段
			"loginName": "ysbx", // 用户登录名
			"passWord": "698D51A19D8A121CE581499D7B701668", // 密码MD5化
			"name": "保险公司", // 姓名
			"sex": 0, // 性别：0-男，1-女
			"type": 2, // 组织类型：1-配件商，2-保险公司，3-修理厂
			"birthDay": "123", // 生日
			"phone": "19988388889", // 手机
			"email": "", // 邮件
			"qq": "123", // QQ
			"orgId": 2000000039, // 组织id
			"position": "经理", // 在组织中的职位
			// 系统自动生成
			"orgName": "演示保险", // 所属组织名称
			"createTime": 1526356316000, // 创建时间
			"lastModify": 1533722946000, // 更新时间
			"status": 0, // 状态：1-启用，0-禁用
			// 后期部分更新
			"isAdvisor": 1, // 是否为修理厂维修顾问：1-是，0-否
			"isConsignee": 1, // 是否为修理厂收货人：1-是，0-否
			"isDamage": 0, // 是否为保险公司定损员：1-是，0-否
			"userRoleIds": [], // 用户角色id数组
			"userRoleNames": "", // 用户角色集合
			"wechat": null
		},
		"count": 1
	}
}

let addBizUsers = function(options) {
	return {
		"code": 0,
		"msg": "商业用户新增成功",
		"data": 121211221 // 新建用户的id
	}
}
let updateBizUsers = function(options) {
	return {
		"code": 0,
		"msg": "更新商业用户成功"
	}
}

let updateBizUsersRole = function(options) {
		return {
			"code": 0,
			"msg": "更新商业用户角色成功"

		}
	}
	//根据定损员更新合作修理厂
let updateCoRepairers = function(options) {
	return {
		"code": 0,
		"msg": "修改定损员修理厂合作关系成功",
	}
}
let updateXlcSAnGR = function(options) {
	return {
		"code": 0,
		"msg":"更新修理厂维修顾问/收货人选项成功"
	}
}
let delBizUsers = function(options) {
	return {
		"code": 0,
		"msg": "商业用户禁用成功"
	}
}
//过滤商业用户列表
Mock.mock(/nxp-admin\/BizUsers\?/, 'get', BizUsersData);
Mock.mock("/nxp-admin/BizUsers/1", 'get', BizUsersId);
Mock.mock("/nxp-admin/BizUsers", 'post', addBizUsers); //新增商业用户
Mock.mock("/nxp-admin/BizUsers/1", 'put', updateBizUsers); //更新商业用户
Mock.mock("/nxp-admin/BizUsers/1/updateRoles", 'patch', updateBizUsersRole); //更新商业用户角色

Mock.mock("/nxp-admin/BizUsers/1/updateCoRepairers", 'patch', updateCoRepairers); //修改定损员修理厂合作关系成功

Mock.mock("/nxp-admin/BizUsers/1/updateSAnGR", 'patch', updateXlcSAnGR); //更新修理厂维修顾问/收货人选项

Mock.mock("/nxp-admin/BizUsers/1", 'delete', delBizUsers); //禁用商业用户