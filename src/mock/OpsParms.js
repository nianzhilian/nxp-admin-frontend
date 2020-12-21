const Mock = require("mockjs");

//精确过滤运营参数
let OpsParmsData = function(options) {
	return {
		"msg": "查询运营参数信息成功",
		"code": 0,
		"data": [{
			"id": "SQM_QUOTE_TIMEOUT", // 运营参数id   ，精确匹配条件
			"type-id": "SQM_QUOTE", // 参数分类id，新添，精确匹配条件
			"type": "供应商报价", // 参数分类名称
			"parameterName": "报价缺省时间（客服用-邀请报价）", // 参数显示名称
			"parameterType": "INT", // 参数数据类型（INT-数字，BOOL-布尔，LIST-列表）
			"maxNum": 1200, // INT用：最大值
			"minNum": 1, // INT用：最小值
			"value": "1200", // 参数值
			"parameterUnit": "分钟", // 参数单位显示
			"parameterInstructions": "在邀请供应商报价时，在报价时间栏导入此参数值作为默认时间，客服可以修改报价时间。", // 参数提示信息
			"status": "0", // 参数状态：0-启用 1-禁用，未启用此字段，可精确匹配条件
			"paramArray": null // 参数数组，未启用此字段
		}],
		"count": 107 //返回数据总数量（不是返回列表的总数）

	}
}
let OpsParmsId = function(options) {
	return {
		"msg": "查询运营参数信息成功",
		"code": 0,
		"data": {
			"id": "SQM_QUOTE_TIMEOUT", // 运营参数id   ，精确匹配条件
			"type-id": "SQM_QUOTE", // 参数分类id，新添，精确匹配条件
			"type": "供应商报价", // 参数分类名称
			"parameterName": "报价缺省时间（客服用-邀请报价）", // 参数显示名称
			"parameterType": "INT", // 参数数据类型（INT-数字，BOOL-布尔，LIST-列表）
			"maxNum": 1200, // INT用：最大值
			"minNum": 1, // INT用：最小值
			"value": "1200", // 参数值
			"parameterUnit": "分钟", // 参数单位显示
			"parameterInstructions": "在邀请供应商报价时，在报价时间栏导入此参数值作为默认时间，客服可以修改报价时间。", // 参数提示信息
			"status": "0", // 参数状态：0-启用 1-禁用，未启用此字段，可精确匹配条件
			"paramArray": null // 参数数组，未启用此字段
		},
		"count": 107 //返回数据总数量（不是返回列表的总数）
	}
}
let updateOpsParms = function(options) {
	return {
		"code": 0,
		"msg": "修改组织信息成功",
	}
}

Mock.mock(/nxp-admin\/OpsParms\?/, 'get', OpsParmsData); //精确过滤运营参数
Mock.mock("/nxp-admin/OpsParms/1", 'get', OpsParmsId);
Mock.mock("/nxp-admin/OpsParms/1", 'put', updateOpsParms);