<!--组织详情-->
<template>
	<span>
	<airx-modal v-model="modal1" :zindex="998" :title="orgTypeName" size="md" @on-close="close">
		<h4 class="order-title">基本信息</h4>
		<br />
		<Row>
			<Col span="12">
			<Form :label-width="150">
				<FormItem label="全称" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.fullName}}
				</FormItem>
				<FormItem label="固话" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.telphone}}
				</FormItem>
				<FormItem label="传真" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.fax}}
				</FormItem>
				<FormItem label="地址" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.address}}
				</FormItem>
				<FormItem label="地区" v-if="data.type ==  3 || data.type == 2 || data.type == 1">
					{{regionStr}}
				</FormItem>
				<FormItem label="状态" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.status == '1' ? '失效':'正常'}}
				</FormItem>
			</Form>
			</Col>
			<Col span="12">
			<Form :label-width="150">
				<FormItem label="坐标" v-if="data.type == 3">
					{{data.latitudeAndLongitude}}
				</FormItem>
				<FormItem label="支付方式" v-if="data.type == 3">
					{{data.payType == '1' ? '月结':'现付'}}
				</FormItem>
				<FormItem label="修理厂父级" v-if="data.type == 3">
					{{data.hasChild}}
					<span v-if="data.hasChild == 1">（此修理厂有子修理厂）</span>
					<span v-if="data.hasChild == 0">
						<span v-if="data.parentId == 0">（没有父修理厂）</span>
						<span v-if="data.parentId != 0">（有）</span>
					</span>
				</FormItem>
				<FormItem label="订单结算方" v-if="data.type == 3">
					{{data.settlementPartyName}}
				</FormItem>
				<FormItem label="客服" v-if="data.type == 3">
					{{ssData.customerServiceName}}
				</FormItem>
				<FormItem label="销售" v-if="data.type == 3">
					{{ssData.saleName}}
				</FormItem>
			</Form>
			</Col>
		</Row>
		<h4 class="order-title">人员列表：共 {{userCount}} 人</h4>
		<Table :columns="columns1" :data="userData" :height="400"></Table>
		<people ref="people"></people>
		<br />
		<Page :current="userCurrent" :total="userCount" :page-size="15"></Page>
	</airx-modal>
	</span>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK } from '../../../utils/common.js'

	import people from './people'

	export default {
		components: {
			people
		},
		data() {
			return {
				orgId: '',
				type: 1,
				modal1: false,
				data: {},
				ssData: {},
				columns1: [{
						title: 'ID',
						key: 'id',
						width: 120,
					},
					{
						title: '用户名',
						key: 'loginName'
					},
					{
						title: '姓名',
						key: 'name'
					},
					{
						title: '电话',
						key: 'phone'
					},
					{
						title: '性别',
						key: 'sex',
						width: 80,
						render: (h, params) => {
							return params.row.status == 0 ? '男' : '女';
						}
					},
					{
						title: '注册时间',
						key: 'createTime',
						render: (h, params) => {
							return dateTrans(params.row.createTime);
						}
					},
					{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							return params.row.status == 0 ? '正常' : '失效';
						}
					},
					{
						title: '操作',
						render: (h, params) => {
							return h('div', [
								h('div', {
									on: {
										click: () => {
											console.log(params.row)
											this.viewPeople(params.row.id)
										}
									}
								}, '查看'),
							]);
						}
					},
				],
				userData: [],
				userCurrent: 1,
				userCount: 0,
				peopleId: '',
				regionData: [],
				regionStr: '',
			}
		},
		computed: {
			orgTypeName() {
				if(this.data.type == 1) return '配件商信息'
				if(this.data.type == 2) return '保险公司信息'
				if(this.data.type == 3) return '修理厂信息'
			}
		},
		watch: {
			orgId() {
				//this.initData();
			},
		},
		methods: {
			initData(id) {
				let _self = this;
				_self.orgId = id;
				_self.regionStr = '';
				if(_self.orgId != undefined) {
					this.modal1 = true;
					fetchGet('/nxp-admin/cusOrganiztion/cusById/' + _self.orgId).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.$Message.success(res.msg);
							_self.data = res.data;
							if(res.data.type == 3) {
								this.getServiceAndSale();
							}
							this.getUser();
							this.getRegion(res.data.region);
						}
					});
				}
			},
			getServiceAndSale() {
				let _self = this;
				fetchGet('/nxp-admin/cusOrganiztion/orgDev/' + _self.orgId).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						_self.ssData = res.data;
					}
				});
			},
			getUser() {
				let _self = this;
				_self.userCurrent = 1;
				fetchPostUrlencoded('/nxp-admin/systemUser/list', {
					orgId: _self.orgId,
					page: 1,
					size: 15,
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						_self.userData = res.data;
						_self.userCount = res.count;
					}
				});
			},
			getRegion(ids) {
				let _self = this;
				fetchGet('/nxp-admin/region/all').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						let idsArr = ids.split("-");
						let arr2 = [];
						let arr3 = [];
						let idsStr = [];
						for(let i = 0; i < res.data.length; i++) {
							if(idsArr[0] == res.data[i]['id']) {
								idsStr.push(res.data[i]['name']);
								arr2 = res.data[i]['childNodes'];
							}
						}
						for(let i = 0; i < arr2.length; i++) {
							if(idsArr[1] == arr2[i]['id']) {
								idsStr.push(arr2[i]['name']);
								arr3 = arr2[i]['childNodes'];
							}
						}
						for(let i = 0; i < arr3.length; i++) {
							if(idsArr[2] == arr3[i]['id']) {
								idsStr.push(arr3[i]['name']);
							}
						}
						_self.regionStr = idsStr.join("-");
					}
				});
			},
			close() {
				this.modal1 = false;
			},
			viewPeople(id) {
				this.$refs.people.initData(id);
			},
		}
	}
</script>

<style>

</style>