const Mock = require("mockjs");

let Login = function(options) {
	return {
		"code": 0,
		"msg": "系统登录成功",
		"data": {
			"token": "zyPThn9dGDnTj8K2zPSpkVQbO2trpJ97dtB33El6YOFsNq8surUx/Q=="
		}
	}
}

//获取用户信息
let UserInfo = function(options) {
		return {
			"code": 0,
			"msg": "获取用户信息成功",
			"data": {
				"id": 77,
				"loginName": "demokf",
				"passWord": "698D51A19D8A121CE581499D7B701668",
				"name": "DEMO客服",
				"telephone": "",
				"phone": "123",
				"email": "123@123c.om",
				"status": 0, // 0-禁用，1-启用
				"type": 0,
				"parentId": null,
				"parentName": null,
				"typeName": null,
				"orderCount": 0,
				"orderRunCount": 1991,
				"agentId": null,
				"agentName": null,
				"deptIds": null,
				"deptNames": null,
				"tagIds": null,
				"tagNames": null,
				"createTime": 1526352050000,
				"lastModify": 1533286105000
			}
		}
	}
	//获取用户部门
let UserDepts = function(options) {
		return {
			"code": 0,
			"msg": "获取用户部门成功",
			"data": [{
				"id": 1,
				"name": "我的部门",
				"leaderId": 0,
				"remark": "",
				"phone": "",
				"parentId": 0,
				"status": 0, // 0-禁用，1-启用
				"roleIds": null,
				"tagIds": null,
				"tagNames": null
			}],
		}
	}
	//获取用户所属集货点信息
let UserDCs = function(options) {
		return {
			"code": 0,
			"msg": "获取用户所属集货点",
			"data": [{
				"id": 1,
				"name": "我的物流点",
				"address": "我的物流点地址",
				"remark": "备注1111",
				"deptId": 2,
				"region": "310000-310100-310101",
				"regionName": "上海-上海-黄浦",
				"phone": "18909999900",
				"status": 0 // 0-禁用，1-启用
			}]

		}
	}
	//获取用户权限列表
let UserPermCodes = function(options) {
		return {
			"code": 0,
			"msg": "获取用户所属集货点",
			"data": [{
				"id": 1,
				"name": "我的物流点",
				"address": "我的物流点地址",
				"remark": "备注1111",
				"deptId": 2,
				"region": "310000-310100-310101",
				"regionName": "上海-上海-黄浦",
				"phone": "18909999900",
				"status": 0 // 0-禁用，1-启用
			}]

		}
	}
	//登出
let Logout = function(options) {
	return {
		"code": 0,
		"msg": "成功登出"
	}
}
Mock.mock("/nxp-admin/Auth/Login", 'post', Login);
Mock.mock("/nxp-admin/Auth/UserInfo", 'get', UserInfo);
Mock.mock("/nxp-admin/Auth/UserDepts", 'get', UserDepts);
Mock.mock("/nxp-admin/Auth/UserDCs", 'get', UserDCs);
Mock.mock("/nxp-admin/Auth/UserPermCodes", 'get', UserPermCodes);
Mock.mock("/nxp-admin/Auth/Logout", 'get', Logout);