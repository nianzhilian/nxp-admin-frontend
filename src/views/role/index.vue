<template>
	<div class="example-case">
		<div class="air-title h3">角色/权限</div>
		<Row>
			<Col span="12">
			<Button type="primary" icon="plus-round" @click="addUserRole('')">新增</Button>
			</Col>
		</Row>
		<Tabs :animated="false" @on-click="tag" style='padding: 20px 0 20px 0;'>
			<TabPane label="全部" name="-1"></TabPane>
			<TabPane label="已启用" name="1"></TabPane>
			<TabPane label="已禁用" name="0"></TabPane>
		</Tabs>
		<Table border :columns="columns7" :data="roleData"></Table>
		<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
		<!--添加/编辑角色-->
		<Modal width='1200' v-model="userRoleData.theModal.show" :title="userRoleData.theModal.title" :mask-closable="false">
			<Form ref="userRoleData.theForm" :label-width="80" :model="userRoleData.theForm" :rules="userRoleData.theRule">
				<FormItem label="角色名称" prop="name">
					<Input v-model="userRoleData.theForm.name"></Input>
				</FormItem>
				<FormItem label="角色说明" prop="description">
					<Input v-model="userRoleData.theForm.description"></Input>
				</FormItem>
				<FormItem label="角色类型" prop='type'>
					<p v-show="userRoleData.theForm.id !=''">{{userRoleData.theForm.typeName}}</p>
					<Select v-model="userRoleData.theForm.type" @on-change="userType" filterable clearable v-show="userRoleData.theForm.id ==''">
						<Option v-for="item in typeRoles" :value="item.value" :key="item.id">{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="权限">
					<div class="role-list" v-for="val in groupArray">
						<Row>
							<Col class="air-space" span='24'>{{val.name}}</Col>
						</Row>
						<div v-for="info in val.childNodes" :key="info.id" style="margin-left: 10px;">
							<Row class="row role-content">
								<Col span="12">
								<CheckboxGroup v-model="userRoleData.theForm.subFunids">
									<Checkbox :label="info.id">{{info.code}} {{info.name}}</Checkbox>
								</CheckboxGroup>
								</Col>
							</Row>
							<Row>
								<Col span="11" v-for="item in info.childNodes" :key="item.id" style="margin-left: 20px;">
								<CheckboxGroup v-model="userRoleData.theForm.subFunids">
									<Checkbox :label="item.id">{{item.code}} {{item.name}}</Checkbox>
								</CheckboxGroup>
								</Col>
							</Row>
						</div>
					</div>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="subRole">提交</Button>
				</FormItem>
			</Form>
			<div slot="footer">
				<!--<Button type="ghost" size="large" long @click="userRoleData.theModal.show = false">关闭</Button>-->
			</div>
		</Modal>
	</div>
</template>

<script>
	import {
		md5,
		logHttp
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet
	} from '../../utils/requestHttp.js'
	import Ajax from '../../utils/ajax.js'
	export default {
		data() {
				return {
					loading: false,
					btnLoading: false,
					statuType: -1,
					name: '',
					page: {
						total: 0,
						current: 1,
						pageSize: 15
					},
					typeRoles: [{
						'name': '后台权限',
						'value': 'A'
					}, {
						'name': '前台用户_配件商',
						'value': 'C_A'
					}, {
						'name': '前台用户_保险公司',
						'value': 'C_I'
					}, {
						'name': '前台用户_修理厂',
						'value': 'C_R'
					}],
					//添加/编辑角色权限
					userRoleData: {
						theModal: {
							show: false,
							title: ''
						},
						theForm: {
							id: '',
							roleId: '',
							type: 'A',
							name: '',
							typeName: '',
							status: 0,
							description: '',
							funids: [], //存放权限数据
							subFunids: [] // 最后选中ID
						},
						theRule: {
							name: [{
								required: true,
								message: '角色名称不能为空',
								trigger: 'blur'
							}],
							description: [{
								required: true,
								message: '角色说明不能为空',
								trigger: 'blur'
							}],
							type: [{
									required: true,
									message: '角色类型不能为空',
									trigger: 'blur'
								}]
								/*,
								subFunids: [{
									required: true,
									message: '权限不能为空',
									trigger: 'blur'
								}]*/
						}
					},
					groupName: [],
					groupArray: [],
					columns7: [{
						title: '状态',
						width: 60,
						align: 'center',
						render: (h, params) => {
							if(params.row.status == 1) {
								return h('span', {
									style: {
										background: '#19be6b',
										overflow: 'hidden',
										color: '#19be6b',
										width: '10px',
										height: '10px',
										display: 'inline-block',
										'border-radius': '100px'
									}
								}, 'ok')
							} else {
								return h('span', {
									style: {
										background: '#ed3f14',
										overflow: 'hidden',
										color: '#ed3f14',
										width: '10px',
										height: '10px',
										display: 'inline-block',
										'border-radius': '100px'
									}
								}, 'no')
							}
						}
					}, {
						title: 'ID',
						key: 'id',
						width: 100
					}, {
						title: '名称',
						key: 'name'
					}, {
						title: '说明',
						key: 'description'
					}, {
						title: '角色类型',
						key: 'typeName'
					}, {
						title: '操作',
						key: 'action',
						align: 'center',
						render: (h, params) => {
							if(params.row.status == 1) {
								return h('div', [
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.changeStatus(params.row.id, 0)
											}
										}
									}, '禁用'),
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.addUserRole(params.row.id)
											}
										}
									}, '编辑')
								]);
							} else {
								return h('div', [
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.changeStatus(params.row.id, 1)
											}
										}
									}, '启用'),
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.addUserRole(params.row.id)
											}
										}
									}, '编辑')
								]);
							}
						},
					}],
					roleData: [],
					previlegesData: []
				}
			},
			created() {},
			watch: {},
			mounted() {
				this.getRole();
				logHttp(this.$store.state.sourceInfo, '角色/权限', fetchPostUrlencoded);
			},
			methods: {
				//角色类型选择
				userType() {
					this.groupArray = [];
					this.groupName = []; //每次选择时质空
					let obj = {
						"type": this.userRoleData.theForm.type == 'A' ? this.userRoleData.theForm.type : 'C',
						"status": 1
					}
					Ajax.get("/nxp-admin/Previleges", obj).then((res) => {
						this.btnLoading = false;
						if(res.code == 200) {
							for(var i = 0; i < res.data.length; i++) {
								var index = this.groupName.indexOf(res.data[i]['group']);
								if(index == -1) {
									this.groupName.push(res.data[i]['group']);
									this.groupArray.push({
										'name': res.data[i]['group'],
										'childNodes': [res.data[i]]
									});
								} else {
									this.groupArray[index]['childNodes'].push(res.data[i]);
								}
							}
						} else {
							this.$Message.error(res.msg);
						}
					});
				},
				//选中父级 勾选子级
				/*checkChild:function (id) {
					for(var i = 0; i < this.groupArray.length; i++) {
						for(var j = 0; j < this.groupArray[i]['childNodes'].length; j++) {
							if(this.groupArray[i]['childNodes'][j]['id'] == id) {
								for(var k = 0; k < this.groupArray[i]['childNodes'][j]['childNodes'].length; k++) {
									if(this.userRoleData.theForm.subFunids.indexOf(this.groupArray[i]['childNodes'][j]['childNodes'][k]['id']) == -1) {
										this.userRoleData.theForm.subFunids.push(this.groupArray[i]['childNodes'][j]['childNodes'][k]['id']);
									}
								}
							}
						}
					}
				},*/
				addUserRole: function(id) {
					this.userRoleData.theModal.show = true;
					this.groupArray = [];
					this.groupName = [];
					this.userRoleData.theForm.name = '';
					this.userRoleData.theForm.typeName = '';
					this.userRoleData.theForm.description = '';
					this.userRoleData.theForm.id = id;
					this.userRoleData.theForm.funids = [];
					this.userRoleData.theForm.subFunids = [];
					this.userType();
					if(id) {
						/*this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/roles/eidtRole',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo, '编辑角色 - 角色名称', fetchPostUrlencoded);*/
						this.userRoleData.theModal.title = "编辑角色 - 角色名称";
						let obj = {
							"type": this.userRoleData.theForm.type == 'A' ? this.userRoleData.theForm.type : 'C',
							"status": 1
						};
						Ajax.get("/nxp-admin/Previleges", obj).then((res) => {
							this.btnLoading = false;
							if(res.code == 200) {
								this.previlegesData = [];
								for(var i = 0; i < res.data.length; i++) {
									this.previlegesData.push(res.data[i]);
									if(res.data[i]['childNodes']) {
										for(var j = 0; j < res.data[i]['childNodes'].length; j++) {
											this.previlegesData.push(res.data[i]['childNodes'][j]);
										}
									}
								}
								Ajax.get('/nxp-admin/Roles/' + id).then((res) => {
									if(res.code == 200) {
										this.userRoleData.theForm.name = res.data.name;
										this.userRoleData.theForm.typeName = res.data.typeName;
										this.userRoleData.theForm.type = res.data.type;
										this.userRoleData.theForm.description = res.data.description;
										for(var i = 0; i < this.previlegesData.length; i++) {
											for(var k = 0; k < res.data.functions.length; k++) {
												if(this.previlegesData[i]['code'] == res.data.functions[k]) {
													this.userRoleData.theForm.subFunids.push(this.previlegesData[i]['id']);
												}
											}
										}
										/*for(var i = 0; i < res.data.functions.length; i++) {
											if(res.data.functions[i]['selected'] == 'Y') {
												this.userRoleData.theForm.subFunids.push(res.data.functions[i]['id']);
											}
											if(res.data.functions[i]['childNodes'] != null) {
												for(var j = 0; j < res.data.functions[i]['childNodes'].length; j++) {
													if(res.data.functions[i]['childNodes'][j]['selected'] == 'Y') {
														this.userRoleData.theForm.subFunids.push(res.data.functions[i]['childNodes'][j]['id']);
													}
												}
											}
											var index = this.groupName.indexOf(res.data.functions[i]['group']);
											if(index == -1) {
												this.groupName.push(res.data.functions[i]['group']);
												this.groupArray.push({
													'name': res.data.functions[i]['group'],
													'childNodes': [res.data.functions[i]]
												});
											} else {
												this.groupArray[index]['childNodes'].push(res.data.functions[i]);
											}
										}*/
									} else {
										this.$Message.error(res.msg);
									}
								});
							} else {
								this.$Message.error(res.msg);
							}
						});
					} else {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/roles/addRole',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo, '添加角色', fetchPostUrlencoded);
						this.userRoleData.theModal.title = "添加角色";
					}
				},
				subRole() {
					this.loading = true;
					let obj = {
						'name': this.userRoleData.theForm.name,
						'type': this.userRoleData.theForm.type,
						'description': this.userRoleData.theForm.description,
						/*'funids': this.userRoleData.theForm.subFunids.join(','),*/
						'funIds': this.userRoleData.theForm.subFunids,
						/*'status': this.userRoleData.theForm.status*/
					};
					this.$refs["userRoleData.theForm"].validate((valid) => {
						if(valid) {
							if(this.userRoleData.theForm.id) {
								Ajax.put("/nxp-admin/Roles/" + this.userRoleData.theForm.id, obj).then((res) => {
									if(res.code == 200) {
										this.$Message.success(res.msg);
										this.userRoleData.theModal.show = false;
										this.getRole();
									} else {
										this.$Message.error(res.msg);
									}
									this.loading = false;
								});
							} else {
								Ajax.post("/nxp-admin/Roles", obj).then((res) => {
									if(res.code == 200) {
										this.$Message.success(res.msg);
										this.userRoleData.theModal.show = false;
										this.getRole();
									} else {
										this.$Message.error(res.msg);
									}
									this.loading = false;
								});
							}
						} else {
							this.$Message.error('表单验证失败!');
						}
					})
				},
				//查询角色列表
				getRole() {
					this.loading = true;
					let obj = {
						'name': this.name,
						'status': this.statuType,
						'page': this.page.current,
						'per_page': this.page.pageSize
					};
					Ajax.get('/nxp-admin/Roles', obj).then((res) => {
						if(res.code == 200) {
							if(res.data.length > 0) {
								this.roleData = res.data;
								this.page.total = res.count;
							} else {
								this.roleData = [];
							}
							this.$Message.success(res.msg);
							// 改变状态后如果数据结果小于1页则跳回到第1页
							if(res.count <= this.page.pageSize && this.page.current != 1) {
								this.changePage(1);
							}
						} else {
							this.$Message.error(res.msg);
						}
					});
				},
				//禁用启用
				changeStatus(id, status) {
					var str = status == 1 ? '启用' : '禁用';
					let roleStatus = {
						'status': status
					};
					this.$Modal.confirm({
						title: '提示',
						content: '<p>是否要' + str + '</p>',
						onOk: () => {
							Ajax.patch("/nxp-admin/Roles/" + id + "/updateStatus", roleStatus).then((res) => {
								if(res.code == 200) {
									this.$Message.success(res.msg);
									this.getRole();
								} else {
									this.$Message.error(res.msg);
								}
							});
						}
					});
				},
				//分页
				changePage(e) {
					this.page.current = e;
					this.getRole();
				},
				tag: function(status) {
					this.page.current = 1;
					this.statuType = status;
					this.getRole();
				},
			}
	}
</script>