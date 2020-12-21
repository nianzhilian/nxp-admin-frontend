const Mock = require("mockjs");

let FeaturesData = function(options) {
		return {
			"code": 0, //errorcode：0-正常  1-错误
			"msg": "成功", //返回查询说明
			"data": [ //返回数据列表
				{
					"id": "8716d824-f1e2-4cee-91bd-a36b67af6d98", // 特性id：      精确查找
					// 新建必填字段
					"name": "精友车型体验", // 特性名称：      模糊查找
					"type": 1, // 特性受众范围类型：    1-公开，2-选定组织
					"permFunctionExtend": [ // 特性对应组织列表：数组[perm_function_extend表所有字段]
						{
							"id": "f4a4054a-57d7-45c0-a131-e785838f1a77",
							"functionOrgId": "daa4b48a-52f2-4954-a75d-bfbf116ec42a",
							"orgId": 80066621, // 组织id
							"orgName": "天津市宝坻区众旺汽车修理厂", // 组织名称
							"orgAddress": "天津市宝坻区周良街道原农贸市场超市区4号房屋",
							"status": 1, // 状态：    0-禁用，1-启用
							"createTime": null // 创建时间
						}
					],
					"permFunctionPack": [ // 特性和权限对应关系列表：数组[]
						{
							"id": "903b655c-c0bc-4d66-8210-8fb2adaba701",
							"permFunction": "48", // 权限code
							"permFunctionName": "支付", // 权限名称
							"status": 1, // 状态： 0-禁用，1-启用
							"functionOrgId": "daa4b48a-52f2-4954-a75d-bfbf116ec42a",
							"packName": null, // 未启用
							"createTime": null // 创建时间
						}
					],
					// 自带缺省值
					"status": 1, // 特性状态：    0-禁用，1-启用
					// 未启用
					"startTime": null, // 生效时间 - 未启用
				}
			]

		}
	}
	//按feature-id获取特性信息
let FeaturesId = function(options) {
	return {
		"code": 0, //errorcode：0-正常  1-错误
		"msg": "成功", //返回查询说明
		"data": //返回数据列表
		{
			"id": "8716d824-f1e2-4cee-91bd-a36b67af6d98", // 特性id：      精确查找
			// 新建必填字段
			"name": "精友车型体验", // 特性名称：      模糊查找
			"type": 1, // 特性受众范围类型：    1-公开，2-选定组织
			"permFunctionExtend": [ // 特性对应组织列表：数组[perm_function_extend表所有字段]
				{
					"id": "f4a4054a-57d7-45c0-a131-e785838f1a77",
					"functionOrgId": "daa4b48a-52f2-4954-a75d-bfbf116ec42a",
					"orgId": 80066621, // 组织id
					"orgName": "天津市宝坻区众旺汽车修理厂", // 组织名称
					"orgAddress": "天津市宝坻区周良街道原农贸市场超市区4号房屋",
					"status": 1, // 状态：    0-禁用，1-启用
					"createTime": null // 创建时间
				}
			],
			"permFunctionPack": [ // 特性和权限对应关系列表：数组[]
				{
					"id": "903b655c-c0bc-4d66-8210-8fb2adaba701",
					"permFunction": "48", // 权限code
					"permFunctionName": "支付", // 权限名称
					"status": 1, // 状态： 0-禁用，1-启用
					"functionOrgId": "daa4b48a-52f2-4954-a75d-bfbf116ec42a",
					"packName": null, // 未启用
					"createTime": null // 创建时间
				}
			],
			// 自带缺省值
			"status": 1, // 特性状态：    0-禁用，1-启用
			// 未启用
			"startTime": null, // 生效时间 - 未启用
		}
	}
}

let addFeatures = function(options) {
	return {
		"code": 0,
		"msg": "添加特性成功",
		"data": 2000000041
	}
}
let updateFeatures = function(options) {
	return {
		"code": 0,
		"msg": "修改特性成功",
	}
}

//变更特性的权限列表
let updatePrevileges = function(options) {
	return {
		"code": 0,
		"msg": "修改权限列表成功",
	}
}
//变更特性的选定组织列表
let updateAppliedOrgs = function(options) {
	return {
		"code": 0,
		"msg": "修改选定组织列表成功",
	}
}
//删除
let delFeatures = function(options) {
	return {
		"code": 0,
		"msg": "特性删除成功",
	}
}
Mock.mock(/nxp-admin\/Features\?/, 'get', FeaturesData);
Mock.mock("/nxp-admin/Features/1", 'get', FeaturesId); //按feature-id获取特性信息
Mock.mock("/nxp-admin/Features", 'post', addFeatures); //新建特性
Mock.mock("/nxp-admin/Features/1", 'put', updateFeatures); //修改特性
Mock.mock("/nxp-admin/Features/1/updatePrevileges", 'patch', updatePrevileges); //变更特性的权限列表
Mock.mock("/nxp-admin/Features/1/updateAppliedOrgs", 'patch', updateAppliedOrgs); //变更特性的选定组织列表
Mock.mock("/nxp-admin/Features/1", 'delete', delFeatures); //删除特性