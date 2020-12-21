<template>
	<div v-show="page.count > 0">
		<div class="air-title h3">
			<span v-if="isGlobalSearch == 'yes'">人员搜索</span>
			<span v-else>人员列表</span>
		</div>
		<div v-if="isGlobalSearch != 'yes'">
			<Row>
				<Col span="8" offset="16">
				<Input v-model="val" placeholder="搜索姓名..." @on-enter="search">
				<Button slot="append" icon="ios-search" @click="search"></Button>
				</Input>
				</Col>
			</Row>
			<br />
		</div>
		<Table border :columns="columns" :data="data"></Table>
		<br />
		<Row v-if="isGlobalSearch == 'yes'">
			<Col span="12">
			<h2>搜索到：{{page.count}} 条</h2>
			</Col>
			<Col span="12">
			<div style="float: right;">
				<Button type="ghost" v-if="page.count > 0" @click="moreInfo">查看更多</Button>
			</div>
			</Col>
		</Row>
		<br />
		<Row v-if="isGlobalSearch != 'yes'">
			<Col span="24">
			<Page :total="page.count" :current="page.page" :page-size="page.size" @on-change="changePage" show-total style="float: right;"></Page>
			</Col>
		</Row>
		<people :is-global-search="'yes'" ref="people"></people>
		<component @on-change="changeEditIshow" :row-data="rowObj" @on-reload="initData" :type="rowObj.type" :is-show="editIshow" v-bind:is="currentView"></component>

	</div>
</template>

<script>
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam,
		fetchPostJson
	} from '../../../utils/requestHttp.js'
	import {
		logHttp,
		setBodyAtt,
		removeBodyAtt
	} from '../../../utils/common.js'
	import people from '../../../airxComponents/com/popup/people'
	import cusSysUserInfoForm from '../cusSysUserInfoForm'
	import cusSysUserEdit from '../cusSysUserEdit.vue'

	export default {
		props: {
			isGlobalSearch: {
				type: String
			},
			queryStr: String,
			/*opsObj:{
		      type:Object,
		      default:{}
		    }*/
		},
		components: {
			people,
			cusSysUserInfoForm,
			'cus-sys-user-edit': cusSysUserEdit
		},
		data() {
			return {
				val: this.$route.query.str,
				editIshow: false,
				userPer: -1,
				isAirUser: -1,
				userPerCode: [],
				currentView: '',
				rowObj: {},
				edit: 'edit',
				page: {
					count: 0,
					page: 1,
					size: 15,
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
						return(this.page.page - 1) * this.page.size + (params.index + 1)
					}
				}, {
					title: '姓名',
					key: 'name',
					width: 100,
				}, {
					title: '性别',
					width: 80,
					render: (h, params) => {
						if(params.row.sex == 0) return '男';
						if(params.row.sex == 1) return '女';
					}
				}, {
					title: '用户名',
					key: 'loginName'
				}, {
					title: '所属组织',
					key: 'orgName'
				}, {
					title: '	手机',
					key: 'phone'
				}, {
					title: '操作',
					width: 150,
					render: (h, params) => {
						if(this.userPer == -1) {
							if(this.isAirUser == -1) {
								return [h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.people.initData(params.row.id);
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
											this.delPeople(params.row.id, params.row.status);
										}
									}
								}, params.row.status == 0 ? '禁用' : '启用'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.$refs.people.initData(params.row.id);
										}
									}
								}, '查看')]
							}

						} else {
							if(this.isAirUser == -1) {
								return [h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.editModal(params.row)
										}
									}
								}, '编辑')]
							} else {
								return [h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.delPeople(params.row.id, params.row.status);
										}
									}
								}, params.row.status == 0 ? '禁用' : '启用'), h('Button', {
									props: {
										type: 'text',
									},
									on: {
										click: () => {
											this.editModal(params.row)
										}
									}
								}, '编辑')]
							}
						}

					}
				}],
				data: [],
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
				/*let userPerCode = [];*/
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
				_self.userPer = _self.userPerCode.indexOf(223);
				_self.isAirUser = _self.userPerCode.indexOf(224);
			},
			editModal(row) {
				this.rowObj = row;
				this.currentView = 'cus-sys-user-edit';
				this.$nextTick(function() {
					this.editIshow = !this.editIshow;
				})
			},
			change(page) {
				this.$emit('change-page', page);
			},
			changeEditIshow(val) {
				if(!val) {
					setBodyAtt()
				}
				this.editIshow = val;
			},
			initData() {
				let _self = this;
				_self.data = [];
				_self.page.count = 0;
				fetchPostUrlencoded('/nxp-admin/systemUser/byname?_=air_user', {
					page: _self.page.page,
					size: _self.page.size,
					name: _self.val,
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						//this.$Message.success(res.msg);
						_self.data = res.data;
						_self.page.count = res.count;
					}
				});
			},
			moreInfo() {
				this.$router.push({
					path: '/globalAirUser/index',
					query: {
						str: this.queryStr
					}
				})
			},
			changePage(e) {
				this.page.page = e;
				this.initData();
			},
			delPeople(id, status) {
				this.$Modal.confirm({
					title: '提示',
					content: '<p>确认禁用该用户吗？</p>',
					onOk: () => {
						fetchPostUrlencoded('/nxp-admin/systemUser/del', {
							id: id,
							status: status == 1 ? 0 : 1,
						}).then((res) => {
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.success(res.msg);
							}
							this.initData();
						});
					},
					onCancel: () => {}
				});
			},
			search() {
				this.$router.push({
					path: '/globalAirUser/index',
					query: {
						str: this.val
					}
				})
			},
		},
		mounted() {
			this.initData();
			this.servicUser();
			logHttp(this.$store.state.sourceInfo, '人员列表', fetchPostUrlencoded);
		},
	}
</script>

<style>

</style>