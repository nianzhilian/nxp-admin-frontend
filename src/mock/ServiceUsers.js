const Mock = require("mockjs");

let ServiceUsersListData = function(options) {
	return {
		"code": 0,
		"msg": "查询组织信息成功",
		"count": 83,
		"data": [{
			"id": 1,
			// 新建必填字段
			"loginName": "tianshiadmin", // 登录名
			"passWord": "698D51A19D8A121CE581499D7B701668", // MD5化的密码
			"name": "系统管理员", // 姓名
			"telephone": null, // 固定电话
			"phone": "17000000000", // 手机
			"email": "admin@air-x.com.cn", // 邮箱
			// 系统自动生成
			"status": 0, // 状态： 1-启用，0-禁用            
			"createTime": null, // 新建时间
			"lastModify": 1533722430000, // 最后更新时间
			// 后期部分更新
			"agentId": 26, // 代理客服
			"agentName": "曹俊全", // 代理客服姓名
			// 系统实时计算
			"orderCount": 0,
			"orderRunCount": 2,
			// 系统实时获取
			"deptIds": [ // 部门id列表
				4,
				5,
				9,
				19
			],
			"deptNames": "客服,采购,财务部,cveshi1", // 部门名称集合
			"tagIds": [ // 职能id列表
				2,
				6,
				4,
				3
			],
			"tagNames": "客服,采购,财务,物流", // 职能名称集合
			"roleIds": [ // 角色id列表
				2,
				6,
				4,
				3
			],
			"roleNames": "客服,采购,财务,物流" // 角色名称集合
				//已废弃不用
				//"type": 1,                                          // 已废弃不用
				//"parentId": null,                                   // 已废弃不用
				//"parentName": null,                                 // 已废弃不用
				//"typeName": "运营",                                  // 已废弃不用
				//"departments": []
		}],
	}
}
let ServiceUsersById = function(options) {
	console.log(options);
	return {
		"code": 0,
		"msg": "查询成功",
		"data": {
			"id": 1,
			// 新建必填字段
			"loginName": "tianshiadmin", // 登录名
			"passWord": "698D51A19D8A121CE581499D7B701668", // MD5化的密码
			"name": "系统管理员", // 姓名
			"telephone": null, // 固定电话
			"phone": "17000000000", // 手机
			"email": "admin@air-x.com.cn", // 邮箱
			// 系统自动生成
			"status": 0, // 状态： 1-启用，0-禁用            
			"createTime": null, // 新建时间
			"lastModify": 1533722430000, // 最后更新时间
			// 后期部分更新
			"agentId": 26, // 代理客服
			"agentName": "曹俊全", // 代理客服姓名
			// 系统实时计算
			"orderCount": 0,
			"orderRunCount": 2,
			// 系统实时获取
			"deptIds": [ // 部门id列表
				4,
				5,
				9,
				19
			],
			"deptNames": "客服,采购,财务部,cveshi1", // 部门名称集合
			"tagIds": [ // 职能id列表
				2,
				6,
				4,
				3
			],
			"tagNames": "客服,采购,财务,物流", // 职能名称集合
			"roleIds": [ // 角色id列表
				2,
				6,
				4,
				3
			],
			"roleNames": "客服,采购,财务,物流" // 角色名称集合
				//已废弃不用
				//"type": 1,                                          // 已废弃不用
				//"parentId": null,                                   // 已废弃不用
				//"parentName": null,                                 // 已废弃不用
				//"typeName": "运营",                                  // 已废弃不用
				//"departments": []
		}

	}
}

//新建内部用户
let NewServiceUsers = function(options) {
		return {
			"code": 0,
			"msg": "内部用户新增成功",
			"data": 121211221 // 新建用户的id
		}
	}
	//更新用户
let UpdateServiceUsers = function(options) {
		return {
			"code": 0,
			"msg": "更新内部用户成功"
		}
	}
	//更新角色
let UpdateUsersRole = function(options) {
	console.log(options);
	return {
		"code": 0,
		"msg": "更新内部用户角色成功"
	}
}

//禁用用户
let DelUsers = function(options) {
	return {
		"code": 0,
		"msg": "内部用户禁用成功"
	}
}

//更新所属部门信息
let UpdateDepts = function(options) {
		return {
			"code": 0,
			"msg": "更新内部用户所属部门成功"
		}
	}
	//重置密码
let resetPwd = function(options) {
		console.log(options);
		return {
			"code": 0,
			"msg": "内部用户重置密码成功"
		}
	}
	//用户角色
let userRoles = function(options) {
		return {
			"msg": "查询成功",
			"code": 0,
			"data": [{
				"id": 1, // 角色id
				"name": "下单员", // 角色名称
				"description": "修理厂下单员", // 角色描述
				"status": 0, // 状态： 1-启用，0-禁用
				"type": "C_R", // 角色类型：C_R=修理厂角色，C_I=保险公司角色，C_A=配件商角色，A=后台管理角色
				"typeName": "交易系统用户-修理厂", // 角色描述
				"functions": [12, 23, 34] // 功能数组：权限code列表
			}, {
				"id": 2, // 角色id
				"name": "核价员", // 角色名称
				"description": "修理厂下单员", // 角色描述
				"status": 0, // 状态： 1-启用，0-禁用
				"type": "C_R", // 角色类型：C_R=修理厂角色，C_I=保险公司角色，C_A=配件商角色，A=后台管理角色
				"typeName": "交易系统用户-修理厂", // 角色描述
				"functions": [12, 23, 34] // 功能数组：权限code列表
			}, {
				"id": 3, // 角色id
				"name": "收账人", // 角色名称
				"description": "修理厂下单员", // 角色描述
				"status": 0, // 状态： 1-启用，0-禁用
				"type": "C_R", // 角色类型：C_R=修理厂角色，C_I=保险公司角色，C_A=配件商角色，A=后台管理角色
				"typeName": "交易系统用户-修理厂", // 角色描述
				"functions": [12, 23, 34] // 功能数组：权限code列表
			}],
			"count": 43
		}

	}
	//获取部门
let getDepts = function(options) {
		return {
			"msg": "查询全部部门信息成功",
			"code": 0,
			"data": [{
				"id": 1,
				// 新建必传字段
				"name": "我的部门", // 部门名称
				"leaderId": 0, // 负责人用户id
				"remark": "", // 备注信息
				"phone": "", // 电话联络
				"parentId": 0, // 父级部门id
				// 系统自动生成（代入缺省值）
				"status": 0,
				"createTime": 121221212112, // 创建时间
				"lastModify": 231412312312, // 更新时间
				// 系统自动关联补齐
				"leaderName": "", // 负责人姓名
				"parentName": "", // 父级部门名称
				// 后期部分更新
				"tagIds": [ // 职能id列表
					5, 1
				],
				"tagNames": "销售,运营", // 职能名称集合
				"roleIds": [ // 角色id列表
					80066616
				],
				"roleNames": "销售角色,运营角色" // 角色名称集合
			}, {
				"id": 4,
				// 新建必传字段
				"name": "财务部", // 部门名称
				"leaderId": 0, // 负责人用户id
				"remark": "", // 备注信息
				"phone": "", // 电话联络
				"parentId": 0, // 父级部门id
				// 系统自动生成（代入缺省值）
				"status": 0,
				"createTime": 121221212112, // 创建时间
				"lastModify": 231412312312, // 更新时间
				// 系统自动关联补齐
				"leaderName": "", // 负责人姓名
				"parentName": "", // 父级部门名称
				// 后期部分更新
				"tagIds": [ // 职能id列表
					5, 1
				],
				"tagNames": "销售,运营", // 职能名称集合
				"roleIds": [ // 角色id列表
					80066616
				],
				"roleNames": "销售角色,运营角色" // 角色名称集合
			}],
			"count": 20
		}
	}
	//修改客服代理
let updateAgent = function(options) {
	console.log(options);
		return {
			"code": 0,
			"msg": "更新内部用户代理人成功"
		}
	}
	//查询所有客服
let getAgent = function(options) {
	return {
		"msg": "查询全部部门信息成功",
		"code": 0,
		"data": [{
			"id": 1,
			// 新建必传字段
			"name": "我的部门", // 部门名称
			"leaderId": 0, // 负责人用户id
			"remark": "", // 备注信息
			"phone": "", // 电话联络
			"parentId": 0, // 父级部门id
			// 系统自动生成（代入缺省值）
			"status": 0,
			"createTime": 121221212112, // 创建时间
			"lastModify": 231412312312, // 更新时间
			// 系统自动关联补齐
			"leaderName": "", // 负责人姓名
			"parentName": "", // 父级部门名称
			// 后期部分更新
			"tagIds": [ // 职能id列表
				5, 1
			],
			"tagNames": "销售,运营", // 职能名称集合
			"roleIds": [ // 角色id列表
				80066616
			],
			"roleNames": "销售角色,运营角色" // 角色名称集合
		}, {
			"id": 26,
			// 新建必传字段
			"name": "曹俊全", // 部门名称
			"leaderId": 0, // 负责人用户id
			"remark": "", // 备注信息
			"phone": "", // 电话联络
			"parentId": 0, // 父级部门id
			// 系统自动生成（代入缺省值）
			"status": 0,
			"createTime": 121221212112, // 创建时间
			"lastModify": 231412312312, // 更新时间
			// 系统自动关联补齐
			"leaderName": "", // 负责人姓名
			"parentName": "", // 父级部门名称
			// 后期部分更新
			"tagIds": [ // 职能id列表
				5, 1
			],
			"tagNames": "销售,运营", // 职能名称集合
			"roleIds": [ // 角色id列表
				80066616
			],
			"roleNames": "销售角色,运营角色" // 角色名称集合
		}, {
			"id": 28,
			// 新建必传字段
			"name": "张飞", // 部门名称
			"leaderId": 0, // 负责人用户id
			"remark": "", // 备注信息
			"phone": "", // 电话联络
			"parentId": 0, // 父级部门id
			// 系统自动生成（代入缺省值）
			"status": 0,
			"createTime": 121221212112, // 创建时间
			"lastModify": 231412312312, // 更新时间
			// 系统自动关联补齐
			"leaderName": "", // 负责人姓名
			"parentName": "", // 父级部门名称
			// 后期部分更新
			"tagIds": [ // 职能id列表
				5, 1
			],
			"tagNames": "销售,运营", // 职能名称集合
			"roleIds": [ // 角色id列表
				80066616
			],
			"roleNames": "销售角色,运营角色" // 角色名称集合
		}],
		"count": 20

	}
}

// /ServiceUsers
Mock.mock("/nxp-admin/ServiceUsers/1", 'get', ServiceUsersById);
// /ServiceUsers?parameter1={value1}&parameter2={value2}...
Mock.mock(/nxp-admin\/ServiceUsers\?/, 'get', ServiceUsersListData);
Mock.mock("/nxp-admin/ServiceUsers", 'post', NewServiceUsers);
Mock.mock("/nxp-admin/ServiceUsers/1", 'put', UpdateServiceUsers);
Mock.mock("/nxp-admin/ServiceUsers/1/updateRoles", 'patch', UpdateUsersRole);
Mock.mock("/nxp-admin/ServiceUsers/1", 'delete', DelUsers);
Mock.mock("/nxp-admin/ServiceDepts", 'get', getDepts); // 所有部门
Mock.mock("/nxp-admin/ServiceUsers/1/updateDepts", 'patch', UpdateDepts); // 更新部门
Mock.mock("/nxp-admin/ServiceUsers/1/resetPassword", 'patch', resetPwd); // 重置密码
Mock.mock(/nxp-admin\/ServiceDepts\?/, 'get', getAgent); //所有客服
Mock.mock("/nxp-admin/ServiceUsers/1/updateAgent", 'patch', updateAgent); //修改代理
Mock.mock("/nxp-admin/Roles", 'get', userRoles); //用户角色