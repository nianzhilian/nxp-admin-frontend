const Mock = require("mockjs");

let regionData = function(options) {
	console.log(options)
	return {
		"code": 0,
		"msg": "地区列表查询成功",
		"data": [{
			"id": "140000", // 邮编式id
			"name": "山西", // 地区名称
			"group": "L-S", // 拼音首字母
			"level": 1, // 地区层级
			"parentId": "", // 父级地区id
			"pinyin": "sx" // 拼音首字母
		}, {
			"id": "140000", // 邮编式id
			"name": "陕西", // 地区名称
			"group": "L-S", // 拼音首字母
			"level": 1, // 地区层级
			"parentId": "", // 父级地区id
			"pinyin": "sx" // 拼音首字母
		}]

	}
}
//地区表-列表模型
Mock.mock(/nxp-admin\/Regions\?/, 'get', regionData);