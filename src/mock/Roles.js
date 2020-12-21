const Mock = require("mockjs");

//用户角色列表
let RolesData = function(options) {
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
		}],
		"count": 43
	}
}

let RolesId = function(options) {
	return {
		"msg": "查询成功",
		"code": 0,
		"data": {
			"id": 1, // 角色id
			"name": "下单员", // 角色名称
			"description": "修理厂下单员", // 角色描述
			"status": 0, // 状态： 1-启用，0-禁用
			"type": "C_R", // 角色类型：C_R=修理厂角色，C_I=保险公司角色，C_A=配件商角色，A=后台管理角色
			"typeName": "交易系统用户-修理厂", // 角色描述
			"functions": [12, 23, 34] // 功能数组：权限code列表
		},
		"count": 43
	}
}

//更新状态 （部分更新）
let updateRoleStatus = function(options) {
	return {
		"code": 0,
		"msg": "更新权限状态成功"
	}
}

//新建用户角色
let addRole = function(options) {
	return {
		"code": 0,
		"msg": "角色新增成功",
		"data": 121211221 // 新建角色的id
	}
}
//更新用户角色
let updateRole = function(options) {
	return {
		"code": 0,
		"msg": "角色新增成功",
		"data": 121211221 // 新建角色的id
	}
}
Mock.mock(/nxp-admin\/Roles\?/, 'get', RolesData);
Mock.mock("/nxp-admin/Roles/1", 'get', RolesId);
Mock.mock("/nxp-admin/Roles/1", 'put', updateRole);//更新用户角色
Mock.mock("/nxp-admin/Roles/1/updateStatus", 'patch', updateRoleStatus);
Mock.mock("/nxp-admin/Roles", 'post', addRole);