const Mock = require("mockjs");

//获取所有精友车型品牌列表
let JYBrandsData = function(options) {
		return {
			"code": 0,
			"msg": "查询标签列表成功",
			"data": [{
				"id": "0052b52a-82be-43f2-9010-399f3a9c92ee",
				"brandId": "6740ce12c057ffc8000000008f178c62",
				"brandCode": "XFC1",
				"brandName": "先锋摩托",
				"importFlag": "D",
				"brandInitial": "X",
				"createTime": 1527748952000,
				"isEffective": 1
			}]
		}
	}
	//精友车型-车系列表-模型
let JYBrandFamiliesData = function(options) {
	return {
		"msg": "查询车系成功",
		"code": 0,
		"data": [{
			"id": "b1f564c4-43a1-4391-9871-1b40ff4f4d7d",
			"brandId": "I0000000000000000200000000000220",
			"familyId": "I0000000000000000210000000000857",
			"familyCode": "",
			"familyName": "傲虎OUTBACK",
			"createTime": 1533884632437,
			"isEffective": ""
		}]
	}
}
let brandId = function(options) {
	return {
		"msg": "查询车系成功",
		"code": 0,
		"data": [{
			"id": "b1f564c4-43a1-4391-9871-1b40ff4f4d7d",
			"brandId": "I0000000000000000200000000000220",
			"familyId": "I0000000000000000210000000000857",
			"familyCode": "",
			"familyName": "傲虎OUTBACK",
			"createTime": 1533884632437,
			"isEffective": ""
		}]
	}
}

//根据精友车型品牌id查询车系列表
Mock.mock("/nxp-admin/JYBrands", 'get', JYBrandsData);
Mock.mock("/nxp-admin/JYBrand-Families", 'get', JYBrandFamiliesData);
Mock.mock("/nxp-admin/JYBrand-Families/1", 'get', brandId);