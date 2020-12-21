<template>
	<div v-show="count > 0">
		<div class="air-title h3">管理后台用户搜索</div>
		<Table border :columns="columns" :data="data"></Table>
		<br />
		<Row>
			<Col span="12">
			<h2>搜索到：{{count}} 条</h2>
			</Col>
			<Col span="12">
			<div style="float: right;">
				<Button type="ghost" v-if="count > 0" @click="moreInfo">查看更多</Button>
			</div>
			</Col>
		</Row>
		<orderDetail ref="orderDetail" @closedetail="closedetail"></orderDetail>
		<!--后台用户 编辑-->
		<index v-show="false" ref='index'></index>
		<userPeople ref="userPeople"></userPeople>
	</div>
</template>

<script>
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam,
		fetchPostJson
	} from '../../../utils/requestHttp.js'

	import orderDetail from '../../../airxComponents/orderDetail'
	import index from '../../adminUser/index.vue'
	import userPeople from '../../../airxComponents/com/popup/userPeople'
	export default {
		props: ['queryStr'],
		components: {
			orderDetail,
			index,
			userPeople
		},
		data() {
			return {
				page: {
					page: 1,
					size: 10,
				},
				userPerCode: [],
				isUser: -1,
				isUserDel: -1,
				systemSettingData: {
					theModal: {
						show: false,
						title: ''
					}
				},
				columns: [{
					title: '状态',
					align: 'center',
					width: 80,
					render: (h, params) => {
						if(params.row.status == 0) {
							return h('div', {
								'class': {
									stsContainer: true
								}
							}, [
								h('span', {
									'class': {
										green: true,
									}
								}, '')
							])
						} else {
							return h('div', {
								'class': {
									stsContainer: true
								}
							}, [
								h('span', {
									'class': {
										red: true,
									}
								}, '')
							])
						}
					}
				}, {
					title: '#',
					width: 80,
					render: (h, params) => {
						return(params.index + 1) * this.page.page
					}
				}, {
					title: '登录名',
					key: 'loginName',
					width: 150,
				}, {
					title: '名称',
					key: 'name',
					width: 100,
				}, {
					title: '电话',
					key: 'phone',
					width: 150,
				}, {
					title: '邮箱',
					key: 'email',
				}, {
					title: '所属部门',
					key: 'deptNames',
				}, {
					title: '职能',
					key: 'tagNames'
				}, {
					title: '操作',
					align: 'center',
					render: (h, params) => {
						if(this.isUser == -1) {
							if(this.isUserDel == -1) {
								return [h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.userPeople.initData(params.row.id);
										}
									}
								}, '查看')]
							} else {
								return [h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.changeStatus(params.row.id, 1);
										}
									}
								}, '禁用'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.userPeople.initData(params.row.id);
										}
									}
								}, '查看')]
							}
						} else {
							if(this.isUserDel == -1) {
								return [h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.index.aeSystemSetting(params.row.id);
										}
									}
								}, '编辑'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.index.editRole(params.row.id);
										}
									}
								}, '编辑角色'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.index.updAgent(params.row.id, params.row.loginName, params.row.name, params.row.agentId);
										}
									}
								}, '修改代理'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.index.restPwd(params.row.id, params.row.loginName, params.row.name);
										}
									}
								}, '重置密码')]
							} else {
								return [h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.changeStatus(params.row.id, 1);
										}
									}
								}, '禁用'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.index.aeSystemSetting(params.row.id);
										}
									}
								}, '编辑'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.index.editRole(params.row.id);
										}
									}
								}, '编辑角色'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.index.updAgent(params.row.id, params.row.loginName, params.row.name, params.row.agentId);
										}
									}
								}, '修改代理'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.index.restPwd(params.row.id, params.row.loginName, params.row.name);
										}
									}
								}, '重置密码')]
							}
						}

					}
				}],
				data: [],
				count: 0,
			}
		},
		watch: {
			queryStr() {
				this.initData();
			}
		},
		methods: {
			servicUser() {
				let _self = this;
				let userInfo = JSON.parse(window.localStorage['user'])['permInfo'];
				for(var i = 0; i < userInfo.length; i++) {
					if(userInfo[i]['childNodes'] != null && userInfo[i]['childNodes'] != '' && userInfo[i]['childNodes'] != undefined) {
						for(var j = 0; j < userInfo[i]['childNodes'].length; j++) {
							if(userInfo[i]['childNodes'][j]['childNodes'] != null && userInfo[i]['childNodes'][j]['childNodes'] != '' && userInfo[i]['childNodes'][j]['childNodes'] != undefined) {
								for(var k = 0; k < userInfo[i]['childNodes'][j]['childNodes'].length; k++) {
									_self.userPerCode.push(userInfo[i]['childNodes'][j]['childNodes'][k]['code']);
								}
							} else {
								_self.userPerCode.push(userInfo[i]['childNodes'][j]['code']);
							}
						}
					} else {
						_self.userPerCode.push(userInfo[i]['code']);
					}
				}
				_self.isUser = _self.userPerCode.indexOf(1409);
				_self.isUserDel = _self.userPerCode.indexOf(101);
			},
			initData() {
				let _self = this;
				_self.data = [];
				_self.count = 0;
				fetchPostUrlencoded('/nxp-admin/serviceUser/get', {
					page: _self.page.page,
					size: _self.page.size,
					loginName: _self.queryStr,
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						//this.$Message.success(res.msg);
						_self.data = res.data;
						_self.count = res.count;
					}
				});
			},
			closedetail() {
				this.initData();
			},
			//禁用
			changeStatus: function(id, status) {
				this.$Modal.confirm({
					title: '提示',
					content: '<p>是否要禁用' + '</p>',
					onOk: () => {
						this.loading = true;
						fetchPostUrlencoded('/nxp-admin/serviceUser/del', {
							'id': id,
							'status': status
						}).then((res) => {
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.success(res.msg);
							}
							this.initData();
						});
					}
				});
			},
			moreInfo() {
				this.$router.push({
					path: '/adminUser/index',
					query: {
						str: this.queryStr
					}
				})
			},
		},
		mounted() {
			this.initData();
			this.servicUser();
		},
	}
</script>

<style>

</style>