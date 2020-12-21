const Mock = require("mockjs");

let ServiceDeptsListData = function(options) {
	console.log(options)
	return {
	"code": 0,
    "msg": "查询全部部门信息成功",
    "data": [
        {
            "id": 1,
            // 新建必传字段
            "name": "我的部门",                     // 部门名称
            "leaderId": 0,                         // 负责人用户id
            "remark": "重要的部门",                         // 备注信息
            "phone": "18309098778",                            // 电话联络
            "parentId": 2,                        // 父级部门id
            // 系统自动生成（代入缺省值）
            "status": 1,
            "createTime": 121221212112,           // 创建时间
            "lastModify": 231412312312,           // 更新时间
            // 系统自动关联补齐
            "leaderName": "ceshi",                      // 负责人姓名
            "parentName": "级联中心",                      // 父级部门名称
            // 后期部分更新
            "tagIds": [                             // 职能id列表
                5,1
            ],
            "tagNames": "销售,运营",                  // 职能名称集合
            "roleIds": [                            // 角色id列表
                80066616
            ],
            "roleNames": "销售角色,运营角色"           // 角色名称集合
        },{
            "id": 2,
            // 新建必传字段
            "name": "销1售",                     // 部门名称
            "leaderId": 0,                         // 负责人用户id
            "remark": "不重要的部门",                         // 备注信息
            "phone": "18309098998",                            // 电话联络
            "parentId": 3,                        // 父级部门id
            // 系统自动生成（代入缺省值）
            "status": 1,
            "createTime": 231221212112,           // 创建时间
            "lastModify": 431412312312,           // 更新时间
            // 系统自动关联补齐
            "leaderName": "ceshi",                      // 负责人姓名
            "parentName": "级联中心",                      // 父级部门名称
            // 后期部分更新
            "tagIds": [                             // 职能id列表
                5,1
            ],
            "tagNames": "销售,运营",                  // 职能名称集合
            "roleIds": [                            // 角色id列表
                80066616
            ],
            "roleNames": "销售角色,运营角色"           // 角色名称集合
        }, {
            "id": 3,
            "name": "北京修理厂销售三组",
            "leaderId": 0,
            "remark": "",
            "phone": "",
            "parentId": 2,
            "status": 1,
            "createTime": 231221212112,           // 创建时间
                "lastModify": 431412312312,           // 更新时间
            "roleIds": null,
            "tagIds": null,
            "tagNames": null
          }, {
            "id": 14,
            "name": "北京保险销售部",
            "leaderId": 0,
            "remark": "",
            "phone": "",
            "parentId": 0,
            "status": 1,
            "roleIds": null,
            "tagIds": null,
            "tagNames": null
          }, {
            "id": 15,
            "name": "北京保险销售一部",
            "leaderId": 0,
            "remark": "",
            "phone": "",
            "parentId": 0,
            "status": 1,
            "roleIds": null,
            "tagIds": null,
            "tagNames": null
          }, {
            "id": 16,
            "name": "北京保险销售二部",
            "leaderId": 0,
            "remark": "",
            "phone": "",
            "parentId": 0,
            "status": 1,
            "roleIds": null,
            "tagIds": null,
            "tagNames": null
          }, {
            "id": 17,
            "name": "北京保险销售三部",
            "leaderId": 0,
            "remark": "",
            "phone": "",
            "parentId": 0,
            "status": 1,
            "roleIds": null,
            "tagIds": null,
            "tagNames": null
          }, {
            "id": 18,
            "name": "北京保险销售四部",
            "leaderId": 0,
            "remark": "",
            "phone": "",
            "parentId": 0,
            "status": 1,
            "roleIds": null,
            "tagIds": null,
            "tagNames": null
          }, {
            "id": 19,
            "name": "cveshi1",
            "leaderId": 0,
            "remark": "beizhu hahah",
            "phone": "18790543267",
            "parentId": 0,
            "status": 1,
            "roleIds": null,
            "tagIds": null,
            "tagNames": null
          }, {
            "id": 20,
            "name": "wwwwwww",
            "leaderId": 0,
            "remark": "",
            "phone": "10101010",
            "parentId": 0,
            "status": 0,
            "roleIds": null,
            "tagIds": null,
            "tagNames": null
          }
        ],
        "count": 30
    }
}
let ServiceDeptsById = function(options) {
  console.log(options)
	return {
	"code": 0,
    "msg": "查询全部部门信息成功",
    "data": {
            "id": 1,
            // 新建必传字段
            "name": "我的部门",                     // 部门名称
            "leaderId": 1,                         // 负责人用户id
            "remark": "重要的部门",                         // 备注信息
            "phone": "18309098778",                            // 电话联络
            "parentId": 18,                        // 父级部门id
            // 系统自动生成（代入缺省值）
            "status": 0,
            "createTime": 121221212112,           // 创建时间
            "lastModify": 231412312312,           // 更新时间
            // 系统自动关联补齐
            "leaderName": "ceshi",                      // 负责人姓名
            "parentName": "级联中心",                      // 父级部门名称
            // 后期部分更新
            "tagIds": [                             // 职能id列表
                5,1
            ],
            "tagNames": "销售,运营",                  // 职能名称集合
            "roleIds": [                            // 角色id列表
                1,2
            ],
            "roleNames": "销售角色,运营角色"           // 角色名称集合
        }
	}
}
let ServiceDeptsRole = function(options) {
  console.log(options)
	return {
    "code": 0,
    "msg": "更新部门角色成功",
  }
}
let ServiceUpdateDeptsTags = function(options) {
  console.log(options)
  return {
    "code": 0,
    "msg": "变更部门职能成功",
  }
}
let ServiceDeptsUpdate = function(options) {
  console.log(options)
  return {
    "code": 0,
    "msg": "修改内部部门信息成功",
  }
}
let ServiceDeptsAdd = function(options) {
  return {
    "code": 0,
    "msg": "添加内部部门成功",
    "data": 1
  }
}
let ServiceDeptsStatus = function(options) {
  return {
   "code": 0,
    "msg": "修改部门状态成功",
  }
}
let ServiceDeptsList = function(options) {
  return {
    "code": 0,
    "msg": "更新部门成员成功",

  }
}
let ServiceDeptsTags = function(options) {
  console.log(options)
  return {
    "msg": "查询成功",
    "code": 0,
    "data": [
      {
        "id": 1,                        // Tag-ID
        "name": "物流",                  // 标签名称
        "status": 1,                     // 状态：0-禁用，1-启用
        "createTime": 1490630400000     // 创建时间
      }, {
        "id": 2,                        // Tag-ID
        "name": "客服",                  // 标签名称
        "status": 1,                     // 状态：0-禁用，1-启用
        "createTime": 1490630400000     // 创建时间
      }, {
        "id": 3,                        // Tag-ID
        "name": "财务",                  // 标签名称
        "status": 1,                     // 状态：0-禁用，1-启用
        "createTime": 1490630400000     // 创建时间
      }, {
        "id": 4,                        // Tag-ID
        "name": "运营",                  // 标签名称
        "status": 1,                     // 状态：0-禁用，1-启用
        "createTime": 1490630400000     // 创建时间
      }, {
        "id": 5,                        // Tag-ID
        "name": "销售",                  // 标签名称
        "status": 1,                     // 状态：0-禁用，1-启用
        "createTime": 1490630400000     // 创建时间
      }
    ]
  }
}
// /ServiceDepts
//查询某个部门
Mock.mock("/nxp-admin/ServiceDepts/1", 'get', ServiceDeptsById);
//更新内部部门
Mock.mock("/nxp-admin/ServiceDepts/1", 'put', ServiceDeptsUpdate);
//添加部门
Mock.mock("/nxp-admin/ServiceDepts", 'put', ServiceDeptsAdd);
//更新角色
Mock.mock("/nxp-admin/ServiceDepts/1/updateDeptRoles", 'patch', ServiceDeptsRole);
//更新标签
Mock.mock("/nxp-admin/ServiceDepts/1/updateDeptTags", 'patch', ServiceUpdateDeptsTags);
//查询所有部门信息
Mock.mock(/nxp-admin\/ServiceDepts\?/, 'get', ServiceDeptsListData);
//更新状态
Mock.mock("/nxp-admin/ServiceDepts/1/updateStatus", 'patch', ServiceDeptsStatus);
//更新部门成员列表
Mock.mock("/nxp-admin/ServiceDepts/1/updateDeptMembers", 'patch', ServiceDeptsList);
//更新部门标签
Mock.mock("/nxp-admin/Tags", 'get', ServiceDeptsTags);

