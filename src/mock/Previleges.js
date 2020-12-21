const Mock = require("mockjs");

let PrevilegeData = function(options) {
	return {
		"code": 0, // errorcode：0-正常  1-错误
		"msg": "查询成功", //返回查询说明
		"data": [ //返回数据列表
			{
				"id": "110100", // 权限id - 精确查找
				"name": "修改后台用户信息", // 权限描述
				"url": "/serviceUser/update", // api URL
				"level": 2, // 权限列表层级
				"type": "A", // 系统分类 A-后台, CRM_C-CRM后台，CRM_A-CRM客户用，LST=后台物流，FIN_A-后台财务，FIN_C-客户财务，C-客户交易系统
				"parentId": "110199", // 父级权限
				"description": null, // 权限说明
				"status": 0, // 权限状态：1-启用，0-禁用
				"typeName": "管理后台用户", // 系统分类描述
				"expand": "N", // 是否可展开：N-不可展开，Y-可展开（由此会有子节点列表）
				"childNodes": null, // 子节点，子级节点列表
				"selected": null, // 已选中，未启用
				"code": 100, // 权限编码，依赖于此做权限判断
				"group": "后台用户管理组", // 系统分组名称
				"icon": null // 图标，未启用
			}
		],
		"count": 381

	}
}
let PrevilegeId = function(options) {
	return {
		"code": 0, // errorcode：0-正常  1-错误
		"msg": "查询成功", //返回查询说明
		"data": //返回数据列表
		{
			"id": "110100", // 权限id - 精确查找
			"name": "修改后台用户信息", // 权限描述
			"url": "/serviceUser/update", // api URL
			"level": 2, // 权限列表层级
			"type": "A", // 系统分类 A-后台, CRM_C-CRM后台，CRM_A-CRM客户用，LST=后台物流，FIN_A-后台财务，FIN_C-客户财务，C-客户交易系统
			"parentId": "110199", // 父级权限
			"description": null, // 权限说明
			"status": 0, // 权限状态：1-启用，0-禁用
			"typeName": "管理后台用户", // 系统分类描述
			"expand": "N", // 是否可展开：N-不可展开，Y-可展开（由此会有子节点列表）
			"childNodes": null, // 子节点，子级节点列表
			"selected": null, // 已选中，未启用
			"code": 100, // 权限编码，依赖于此做权限判断
			"group": "后台用户管理组", // 系统分组名称
			"icon": null // 图标，未启用
		},
		"count": 381
	}
}

let UpdatePrevilege = function(options) {
	return {
		"code": 200,
		"msg": "更新权限状态成功"
	}
}

// /ServiceDepts
//过滤功能权限列表
Mock.mock(/nxp-admin\/Previleges\?/, 'get', PrevilegeData);
//按权限id获取权限详情
Mock.mock("/nxp-admin/Previleges/1", 'get', PrevilegeId);
//更改权限
Mock.mock("/nxp-admin/Previleges/1/updateStatus", 'patch', UpdatePrevilege);