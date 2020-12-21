<template>
	<div v-show="page.count > 0">
		<div class="air-title h3">换货单搜索</div>
		<div v-if="queryStr == ''">
			<Alert type="warning">搜索关键字为空，无法搜索</Alert>
		</div>
		<div v-else>
			<div v-if="isGlobalSearch != 'yes'">
				<Row>
					<Col span="8" offset="16">
					<Input v-model="val" placeholder="搜索..." @on-enter="search">
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
	import { orderStatus, getLocalTime } from '../../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam,
		fetchPostJson
	} from '../../../utils/requestHttp.js'

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
					size: 10,
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
					key: 'orderNumber'
				}, {
					title: '退单号',
					key: 'returnOrderNumber'
				}, {
					title: '发起方',
					key: 'purchaserName'
				}, {
					title: '承修方',
					key: 'repairerName'
				}, {
					title: '车牌号',
					key: 'license'
				}, {
					title: '车型信息',
					key: 'carName'
				}, {
					title: '	收货人姓名',
					key: 'grName'
				}, {
					title: '换货发起时间',
					key: 'returnTime',
					render: (h, params) => {
						return [getLocalTime(params.row.returnTime)];
					}
				}, {
					title: '客服',
					key: 'ccName'
				}, {
					title: '状态',
					key: 'status',
					render:(h,params) => {
						return orderStatus(params.row.status)
					}
				}, {
					title: '订单详情',
					render: (h, params) => {
						return h('Button', {
							props: {
								type: 'text',
							},
							on: {
								click: () => {
									this.$refs.orderDetail.initData(params.row.orderId);
								}
							}
						}, '查看详细')
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
			initData() {
				let _self = this;
				_self.data = [];
				_self.count = 0;
				fetchGet('/nxp-admin/retord/searchReturnOrder?key=' + _self.val + '&page=' + _self.page.page + '&pageSize=' + _self.page.size + '&type=2').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						//this.$Message.success(res.msg);
						_self.data = res.data.data;
						_self.page.count = res.data.count;
					}
				});
			},
			closedetail() {
				this.initData();
			},
			moreInfo() {
				this.$router.push({
					path: '/globalChange/index',
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
					path: '/globalChange/index',
					query: {
						str: this.val
					}
				})
			},
		},
		mounted() {
			this.initData();
		}
	}
</script>

<style>

</style>