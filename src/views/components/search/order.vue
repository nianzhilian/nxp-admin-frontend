<template>
	<div v-show="page.count > 0">
		<div class="air-title h3">订单搜索</div>
		<div v-if="queryStr == ''">
			<Alert type="warning">搜索关键字为空，无法搜索</Alert>
		</div>
		<div v-else>
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
			<Table :columns="columns" :data="data"></Table>
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
			<Row v-if="isGlobalSearch != 'yes'">
				<Col span="24">
				<Page :total="page.count" :current="page.page" :page-size="page.size" @on-change="changePage" show-total style="float: right;"></Page>
				</Col>
			</Row>
		</div>
		<orderDetail ref="orderDetail" @closedetail="closedetail"></orderDetail>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam, fetchPostJson } from '../../../utils/requestHttp.js'
	import { orderStatus, getLocalTime } from '../../../utils/common.js'

	import orderDetail from '../../../airxComponents/orderDetail'

	export default {
		props: {
			isGlobalSearch: {
				type: String
			},
			queryStr: String
		},
		components: {
			orderDetail
		},
		data() {
			return {
				val: this.$route.query.str,
				page: {
					count: 0,
					page: 1,
					size: 15,
				},
				columns: [{
						title: '#',
						width: 60,
						render: (h, params) => {
							/*return(params.index + 1) * this.page.page*/
							return this.page.size * (this.page.page ==1 ? 0 : (this.page.page-1)) + params.index+1;
						}
					}, {
						title: '订单号',
						key: 'orderNo'
					},
					{
						title: '发起方',
						key: 'orgFullName'
					},
					{
						title: '承修方',
						key: 'xlcFullName'
					},
					{
						title: '车牌号',
						key: 'numberPlates'
					},
					{
						title: '车型信息',
						width: 250,
						render: (h, params) => {
							if((params.row.factory == '' || params.row.factory == null || params.row.factory == undefined)&&params.row.vehicleType==2) {
								return h('span', params.row.carNote);
							}else if(params.row.factory != '' && params.row.factory != null && params.row.factory != undefined&&params.row.vehicleType==2) {
								return h('span', params.row.factory + ' - ' + params.row.brand + ' - ' + params.row.model + ' - ' + params.row.year + ' - ' + params.row.saleName);
							}else if(params.row.vehicleType==1){
								return h('span', params.row.vehicleName);
							}
						}
					},
					{
						title: '收货人姓名',
						key: 'receiverName'
					},
					{
						title: '下单时间',
						key: 'createTime',
						width:150,
						render:(h,params) => {
							return getLocalTime(params.row.createTime)
						}
					},
					{
						title: '客服',
						key: 'serviceName'
					},
					{
						title: '订单状态',
						key: 'status',
						width:150,
						render:(h,params) => {
							return orderStatus(params.row.status)
						}
					},
					{
						title: '订单详情',
						render: (h, params) => {
							return h('Button', {
								props: {
									type: 'text',
								},
								on: {
									click: () => {
										this.$refs.orderDetail.initData(params.row.id);
									}
								}
							}, '查看详细')
						}
					}
				],
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
			initData() {
				let _self = this;
				_self.data = [];
				_self.count = 0;
				if(this.queryStr == '') {
					_self.$Message.warning('搜索关键字为空，无法搜索');
				} else {
					fetchPostUrlencoded('/nxp-admin/order/search/', {
						page: _self.page.page,
						size: _self.page.size,
						key: _self.val,
					}).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							//this.$Message.success(res.msg);
							_self.data = res.data;
							_self.page.count = res.count;
						}
					});
				}
			},
			closedetail() {
				this.initData();
			},
			moreInfo() {
				this.$router.push({
					path: '/globalOrder/index',
					query: {
						str: this.queryStr
					}
				})
			},
			changePage(e) {
				this.page.page = e;
				this.initData();
			},
			search() {
				this.$router.push({
					path: '/globalOrder/index',
					query: {
						str: this.val
					}
				})
			},
		},
		mounted() {
			this.initData();
		},
	}
</script>

<style>

</style>