<template>
	<div class="example-case">
		<div class="air-title h3">后台用户管理 </div>
		<Row>
			<Col span="12">
			<Button type="primary" icon="plus-round" @click="aeSystemSetting('')">新增</Button>
			</Col>
			<Col span="12">
			<span style="float: right;">
					<Input v-model="val" v-on:keyup.13="searchObj">
        					<span slot="append">
        						<Button @click="searchObj" icon="search"></Button>
        					</span>
			</Input>
			</span>
			</Col>
		</Row>
		<br />
		<Tabs :animated="false" @on-click="tag">
			<TabPane label="全部" name="all"></TabPane>
			<TabPane label="已启用" name="1"></TabPane>
			<TabPane label="已禁用" name="0"></TabPane>
		</Tabs>
		<Table border :columns="columns7" :data="data" :row-class-name="rowClassName" highlight-row></Table>
		<br />
		<Row>
			<Col span="24">
			<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
			</Col>
		</Row>
		<!--新增 编辑-->
		<Modal v-model="systemSettingData.theModal.show" width=1200 :title="systemSettingData.theModal.title" @on-close="close">
			<popedit :peopleId='peopleId' v-if="systemSettingData.theModal.show" ref='c1' v-on:close="close"></popedit>
			<div slot="footer"></div>
		</Modal>
		<!--编辑角色-->
		<Modal width='1200' v-model="editRoleData.theModal.show" :title="editRoleData.theModal.title" :mask-closable="false">
			<editRole v-if="editRoleData.theModal.show" :peopleId='peopleId' v-on:closeRoles="closeRoles"></editRole>
			<div slot="footer"></div>
		</Modal>
		<!--修改代理-->
		<Modal width='1200' v-model="agentData.theModal.show" :title="agentData.theModal.title" :mask-closable="false">
			<Form ref="agentData.theForm" :label-width="80">
				<FormItem label="登录名">
					<Input v-model="agentData.theAgent.loginName" disabled></Input>
				</FormItem>
				<FormItem label="名称" prop="name">
					<Input v-model="agentData.theAgent.name" disabled></Input>
				</FormItem>
				<FormItem label="代理人员">
					<Select v-model="agentData.theAgent.info" filterable clearable>
						<Option v-for="item in agentData.theAgent.agentPersionData" :value="item.id" :key="item.id">{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="subAgent">更新</Button>
				</FormItem>
			</Form>
			<div slot="footer"></div>
		</Modal>
		<!--重置密码-->
		<Modal width='1200' v-model="resetPwdData.theModal.show" :title="resetPwdData.theModal.title" :mask-closable="false">
			<Form ref="resetPwdData.theForm" :label-width="80" :model="resetPwdData.theForm" :rules="resetPwdData.theRule">
				<FormItem label="登录名">
					<Input v-model="resetPwdData.theForm.loginName" disabled></Input>
				</FormItem>
				<FormItem label="名称">
					<Input v-model="resetPwdData.theForm.name" disabled></Input>
				</FormItem>
				<FormItem label="密码" prop='pwd'>
					<Input v-model="resetPwdData.theForm.pwd" type='password'></Input>
				</FormItem>
				<FormItem label="重复密码" prop='resPasswd'>
					<Input v-model="resetPwdData.theForm.resPasswd" type='password'></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="subPwd">更新</Button>
				</FormItem>
			</Form>
			<div slot="footer">
			</div>
		</Modal>
	</div>
</template>

<script>
	import popedit from './popedit.vue'
	import editRole from './editRole.vue'
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
		components: {
			popedit,
			editRole
		},
		data() {
			return {
				queryStr: this.$route.query.str,
				userId: '',
				loading: false,
				btnLoading: false,
				peopleId: '',
				page: {
					loginName: '',
					status: -1,
					total: 0,
					current: 1,
					pageSize: 15
				},
				val: this.$route.query.str,
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
					title: '#',
					width: 80,
					render: (h, params) => {
						console.log(params.index);
						return (this.page.current - 1) * this.page.pageSize + params.index + 1
					}
				}, {
					title: '登录名',
					key: 'loginName'
				}, {
					title: '名称',
					key: 'name'
				}, {
					title: '电话',
					key: 'phone'
				}, {
					title: '座机',
					key: 'telephone'
				}, {
					title: '邮箱',
					key: 'email',
					width: 200
				}, {
					title: '所属部门',
					key: 'deptNames'
				}, {
					title: '职能',
					key: 'tagNames'
				}, {
					title: '操作',
					key: 'action',
					width: 400,
					align: 'center',
					render: (h, params) => {
						if(params.row.status == 1) {
							return h('div', [
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
											this.aeSystemSetting(params.row.id)
										}
									}
								}, '编辑'),
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.editRole(params.row.id)
										}
									}
								}, '编辑角色'),
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.updAgent(params.row.id, params.row.loginName, params.row.name, params.row.agentId)
										}
									}
								}, '修改代理'),
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
									on: {
										click: () => {
											this.restPwd(params.row.id, params.row.loginName, params.row.name)
										}
									}
								}, '重置密码')

							]);
						}
					}
				}],
				data: [],
				editRoleObj: [], // 编辑角色变量
				//重置密码
				resetPwdData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						userId: '',
						name: '',
						loginName: '',
						pwd: '',
						resPasswd: ''
					},
					theRule: {
						pwd: [{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						}],
						resPasswd: [{
							required: true,
							message: '重复密码不能为空',
							trigger: 'blur'
						}],
					}
				},
				//编辑角色
				editRoleData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
						roleIds: []
					}
				},
				//修改代理
				agentData: {
					theModal: {
						show: false,
						title: ''
					},
					theAgent: {
						userId: '',
						loginName: '',
						name: '',
						info: '',
						agentPersionData: []
					}
				},
				//新增 编辑
				systemSettingData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
						name: '',
						loginName: '',
						pwd: '',
						resPwd: '',
						deptId: [],
						roleIds: [],
						phone: '',
						telephone: '',
						email: '',
					},
					theRule: {
						name: [{
							required: true,
							message: '名称不能为空',
							trigger: 'blur'
						}],
						loginName: [{
							required: true,
							message: '登录名不能为空',
							trigger: 'blur'
						}],
						email: [{
							required: true,
							message: '邮箱不能为空',
							trigger: 'blur'
						}],
						/*pwd: [{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						}],*/
						resPwd: [{
							required: true,
							message: '重复密码不能为空',
							trigger: 'blur'
						}],
						phone: [{
							required: true,
							message: '电话不能为空',
							trigger: 'blur'
						}]
					}
				},
			}
		},
		created() {
			this.getUser();
		},
		watch: {
			'editRoleData.theModal.show': {
				handler: function(val, oldVal) {
					if(val) {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/adminUser/editRoleData',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo, '编辑角色', fetchPostUrlencoded);
					}
				},
				deep: true
			},
			'agentData.theModal.show': {
				handler: function(val, oldVal) {
					if(val) {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/adminUser/agentUpdate',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo, '修改代理', fetchPostUrlencoded);
					}
				},
				deep: true
			},
			'resetPwdData.theModal.show': {
				handler: function(val, oldVal) {
					if(val) {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/adminUser/resetPwd',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo, '重置密码', fetchPostUrlencoded);
					}
				},
				deep: true
			}
		},
		mounted() {
			logHttp(this.$store.state.sourceInfo, '后台用户管理', fetchPostUrlencoded);
		},
		methods: {
			//编辑角色调用
			closeRoles() {
				let _self = this;
				_self.editRoleData.theModal.show = false;
				this.getUser();
			},
			//重置密码
			restPwd(id, loginName, name) {
				this.resetPwdData.theModal.show = true;
				this.resetPwdData.theModal.title = '修改密码';
				this.resetPwdData.theForm.userId = id;
				this.resetPwdData.theForm.loginName = loginName;
				this.resetPwdData.theForm.name = name;
				this.resetPwdData.theForm.pwd = '';
				this.resetPwdData.theForm.resPasswd = '';
			},
			//提交修改密码数据
			subPwd() {
				this.$refs["resetPwdData.theForm"].validate((valid) => {
					if(valid) {
						if(this.resetPwdData.theForm.pwd == this.resetPwdData.theForm.resPasswd) {
							let passWord = {
								'passWord': (md5(this.resetPwdData.theForm.pwd)).toUpperCase()
							};
							Ajax.patch('/nxp-admin/ServiceUsers/' + this.resetPwdData.theForm.userId + "/resetPassword", passWord).then((res) => {
								if(res.code == 200) {
									this.$Message.success(res.msg);
									this.resetPwdData.theModal.show = false;
									this.getUser();
								} else {
									this.$Message.error(res.msg);
								}
							});
						} else {
							this.$Message.error('两次输入密码不一致');
						}
					} else {
						this.$Message.error('表单验证失败!');
					}
				})
			},
			rowClassName(row, index) {
				if(row.status == 1) {
					return 'demo-table-info-row';
				} else {
					return ''
				}
			},
			//关闭用户编辑
			close(par) {
				this.systemSettingData.theModal.show = par;
				this.getUser();
			},
			//修改代理
			updAgent: function(id, loginName, name, agentId) {
				this.agentData.theModal.show = true;
				this.agentData.theModal.title = "客服代理人员修改";
				this.agentData.theAgent.info = '';
				this.agentData.theAgent.loginName = loginName;
				this.agentData.theAgent.userId = id;
				this.agentData.theAgent.name = name;
				this.agentData.theAgent.info = agentId;
				let obj = {
					'tagId': this.agentData.theAgent.info
				};
				Ajax.get("/nxp-admin/ServiceDepts", obj).then((res) => {
					if(res.code == 200) {
						this.loading = false;
						this.agentData.theAgent.agentPersionData = res.data;
					} else {
						this.$Message.error(res.msg);
					}
				})

			},
			//提交修改代理
			subAgent() {
				if(this.agentData.theAgent.userId == this.agentData.theAgent.info) {
					this.$Message.error('代理人不可以是本人');
				} else {
					let obj = {
						'agentId': this.agentData.theAgent.info
					}
					Ajax.patch("/nxp-admin/ServiceUsers/" + this.agentData.theAgent.userId + "/updateAgent", obj).then((res) => {
						if(res.code == 200) {
							this.$Message.success(res.msg);
							this.agentData.theModal.show = false;
							this.getUser();
						} else {
							this.$Message.error(res.msg);
						}
					})
				}
			},
			//是否新增  或编辑
			aeSystemSetting: function(id) {
				this.peopleId = id;
				this.systemSettingData.theModal.show = true;
				if(this.peopleId == '') {
					this.systemSettingData.theModal.title = '后台人员新增';
				} else {
					this.systemSettingData.theModal.title = '后台人员编辑';
				}
			},
			//编辑角色
			editRole(id) {
				this.peopleId = id;
				this.editRoleData.theModal.show = true;
				this.editRoleData.theModal.title = "编辑用户角色";
			},
			//获取用户列表
			getUser() {
				this.loading = true;
				/*
				fetchPostUrlencoded('/nxp-admin/serviceUser/get', {
					'loginName': this.val,
					'status': this.page.status,
					'page': this.page.current,
					'size': this.page.pageSize
				}).then((res) => {
					if(res.code !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.page.total = res.count;
						this.data = res.data;
						this.$Message.success(res.msg);
						// 改变状态后如果数据结果小于1页则跳回到第1页
						if(res.count <= this.page.pageSize && this.page.current != 1) {
							this.changePage(1);
						}
					}
					this.loading = false;
				});
				*/
				let obj = {
					'searchName': this.val,
					'status': this.page.status,
					'page': this.page.current,
					'per_page': this.page.pageSize
				};
				Ajax.get("/nxp-admin/ServiceUsers", obj).then((res) => {
					if(res.code == 200) {
						this.loading = false;
						this.page.total = res.count;
						this.data = res.data;
					} else {
						this.$Message.error(res.msg);
					}
				})
			},
			tag: function(status) {
				this.val = '';
				this.page.current = 1;
				this.page.status = status;
				this.getUser();
			},
			//搜索
			searchObj() {
				/*
				this.page.current = 1;
				this.getUser();
				*/
				this.$router.push({
					path: '/adminUser/index',
					query: {
						str: this.val
					}
				})
			},
			//分页
			changePage: function(e) {
				this.page.current = e;
				this.getUser();
			},
			//禁用
			changeStatus: function(id, status) {
				let delId = id;
				this.$Modal.confirm({
					title: '提示',
					content: '<p>后台人员禁用后无法启用' + '</p>',
					onOk: () => {
						this.loading = true;
						Ajax.delete('/nxp-admin/ServiceUsers/' + delId, ).then((res) => {
							if(res.code == 200) {
								this.$Message.success(res.msg);
								this.getUser();
							} else {
								this.$Message.error(res.msg);
							}
						});
					}
				});
			},
		}
	}
</script>

<style>
	.i-input {
		display: inline-block;
		width: 180;
		height: 32px;
		line-height: 32px;
		padding: 3px 7px;
		font-size: 12px;
		border: 1px solid #dddee1;
		border-radius: 4px;
		color: #495060;
		background-color: #fff;
		background-image: none;
		position: relative;
		cursor: text;
		transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
	}
	
	.jy-con .ivu-table .demo-table-info-row td {
		background-color: #f7f7f7;
	}
	
	.tooltipContainer .ivu-icon {
		color: red;
	}
</style>