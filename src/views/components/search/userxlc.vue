<template>
	<div v-show="page.count > 0">
		<div class="air-title h3">用户关联修理厂</div>
		<div v-if="isGlobalSearch != 'yes'">
			<Row>
				<Col span="8" offset="16">
				<Input v-model="val" placeholder="搜点什么吧..." @on-enter="search">
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
		<org ref="org"></org>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam, fetchPostJson } from '../../../utils/requestHttp.js'
	
	import org from '../../../airxComponents/com/popup/org'

	export default {
		props: {
			isGlobalSearch: {
				type: String
			},
			queryStr: String
		},
		components: {
			org
		},
		data() {
			return {
				val: this.$route.query.str,
				page: {
					count: 0,
					page: 1,
					size: 15,
				},
				userPerCode:[],
				isUserDelXlc:-1,
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
						title: '缺省',
						align: 'center',
						width: 80,
						render: (h, params) => {
							if(params.row.validateMsg.length != 0) {
								return h('Tooltip', {
									props: {
										placement: 'bottom',
									},
									'class': {
										tooltipContainer: true
									}
								}, [
									h('Icon', {
										props: {
											type: 'alert-circled',
										}
									}, ''),
									h('div', {
										slot: 'content',
									}, [
										h('ul', params.row.validateMsg.map(function(item) {
											return h('li', item)
										}))
									])
								])
							}
						}
					}, {
						title: '	全称',
						key: 'fullName',
						width: 150,
					}, {
						title: '固话',
						key: 'telphone',
						width: 100,
					}, {
						title: '地址',
						key: 'address',
						width: 150,
					}, {
						title: '	支付方式',
						width: 100,
						render: (h, params) => {
							if(params.row.paytype == 0) {
								return '月结'
							} else {
								return '现付'
							}
						}
					},
					{
						title: '注册时间',
						key: 'createTime',
					},
					{
						title: '	手机',
						key: 'phone'
					},
					{
						title: '操作',
						width: 150,
						render: (h, params) => {
							if(this.isUserDelXlc == -1){
								return [h('Button', {
								props: {
									type: 'text',
								},
								on: {
									click: () => {
										this.$refs.org.initData(params.row.id);
									}
								}
							}, '查看')]
							}else{
								return [h('Button', {
								props: {
									type: 'text',
								},
								on: {
									click: () => {
										this.delXlc(params.row.id, params.row.status);
									}
								}
							}, params.row.status == 0 ? '禁用' : '启用'), h('Button', {
								props: {
									type: 'text',
								},
								on: {
									click: () => {
										this.$refs.org.initData(params.row.id);
									}
								}
							}, '查看')]
							}
						}
					}
				],
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
				_self.isUserDelXlc = _self.userPerCode.indexOf(204);
			},
			initData() {
				let _self = this;
				_self.data = [];
				_self.page.count = 0;
				fetchGet('/nxp-admin/cusOrganiztion/search?page=' + _self.page.page + '&size=' + _self.page.size + '&key=' + _self.val).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						//this.$Message.success(res.msg);
						if(res.data == null) {
						} else {
							_self.data = res.data;
							_self.page.count = res.count;
						}
					}
				});
			},
			delXlc(id, status) {
				let str = status == 1 ? '启用' : '禁用';
				this.$Modal.confirm({
					title: '提示',
					content: '<p>确认'+str+'该组织吗？</p>',
					onOk: () => {
						fetchPostUrlencoded('/nxp-admin/cusOrganiztion/del/', {
							id: id,
							status: status == 1 ? 0 : 1,
						}).then((res) => {
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.info(res.msg);
							}
							this.initData();
						});
					},
					onCancel: () => {}
				});
			},
			search() {
				this.$router.push({
					path: '/globalUserXlc/index',
					query: {
						str: this.val
					}
				})
			},
			moreInfo() {
				this.$router.push({
					path: '/globalUserXlc/index',
					query: {
						str: this.val
					}
				})
			},
			changePage(e) {
				this.page.page = e;
				this.initData();
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