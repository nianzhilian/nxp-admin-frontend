<template>
	<div>
		<div class="air-title h3">物流状态查询 </div>
		<Tabs :animated="false" @on-click="tag">
			<TabPane label="所有未完成配送单" name="all"></TabPane>
			<TabPane label="备货中订单" name="0"></TabPane>
			<TabPane label="配送中订单" name="1"></TabPane>
		</Tabs>
		<Table border :columns="columns7" :data="data" v-show="statuType == 'all'"></Table>
		<div class="air-space" v-show="statuType != 'all'">
			<i class="fa fa-sort-desc" aria-hidden="true" ></i> 自采订单
		</div>
		<Table border :columns="columns8" :data="xlcOrder" v-show="statuType != 'all'"></Table>
		<div class="air-space" v-show="statuType  != 'all'">
			<i class="fa fa-sort-desc" aria-hidden="true" ></i> 保险公司订单
		</div>
		<Table border :columns="columns8" :data="insOrder" v-show="statuType != 'all'"></Table>
		<orderDetail ref="orderDetail" v-on:closedetail="closedetail"></orderDetail>
	</div>
</template>

<script>
	import {
		md5,
		logHttp
	} from '../../utils/common.js'
	import {
		fetchPostJson,
		fetchPostUrlencoded,
		fetchGet
	} from '../../utils/requestHttp.js'
	import orderDetail from '../../airxComponents/orderDetail'
	export default {
		components: {
			orderDetail
		},
		data() {
				return {
					statuType:'all',
					loading: false,
					columns7: [{
						title: '订单号',
						key: 'orderNo'
					}, {
						title: '配送单号',
						key: 'logisticsNo'
					}, {
						title: '配送方',
						key: 'xlcName'
					}, {
						title: '供应商名称',
						key: 'supName'
					}, {
						title: '供应商报价人姓名',
						key: 'bjName'
					}, {
						title: '供应商报价人联络方式',
						key: 'bjPhone'
					}, {
						title: '配送单状态',
						key: 'opInstr'
					}, {
						title: '配送单最后操作时间',
						key: 'lastOpTime'
					}, {
						title: '查看订单',
						key: 'action',
						align: 'center',
						render: (h, params) => {
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
											this.queryOrder(params.row.orderId)
										}
									}
								}, '查看详细')
							]);
						}
					}],
					columns8:[{
						title: '订单号',
						key: 'orderNo'
					}, {
						title: '配送方',
						key: 'xlcFullName'
					}, {
						title: '供应商名称',
						key: 'supFullName'
					}, {
						title: '供应商报价人姓名',
						key: 'bjName'
					}, {
						title: '供应商报价人联络方式',
						key: 'bjPhone'
					},  {
						title: '下单时间',
						key: 'confirmTime'
					}, {
						title: '查看订单',
						key: 'action',
						align: 'center',
						render: (h, params) => {
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
											this.queryOrder(params.row.id)
										}
									}
								}, '查看详细')
							]);
						}
					}
					],
					data: [],
					insOrder:[],
					xlcOrder:[]
				}
			},
			created() {
				this.orderList();
			},
			mounted() {
				logHttp(this.$store.state.sourceInfo,'物流状态查询',fetchPostUrlencoded);
			},
			watch: {},
			methods: {
				queryOrder(id) {
					this.$refs.orderDetail.initData(id);
				},
				closedetail() {
					if(this.statuType == 'all'){
						this.orderList();
					}else{
						this.stockingOrder();
					}
				},
				//获取用户列表
				orderList() {
					this.loading = true;
					fetchPostJson('/nxp-logistics/admin/in').then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data = res.data;
							this.$Message.success(res.msg);
						}
					}).catch(() => {
						this.btnLoading = false;
						this.$Message.error('网络超时');
					});
				},
				stockingOrder(){
					this.loading = true;
					var type = 0;
					var url =this.statuType==0 ? '/nxp-admin/order/list/30?' +"type=1" : '/nxp-admin/order/list/31?' +"type=1"
					fetchGet(url).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.insOrder = res.data.insOrder;
							this.xlcOrder = res.data.xlcOrder;
							this.$Message.success(res.msg);
						}
					}).catch(() => {
						this.btnLoading = false;
						this.$Message.error('网络超时');
					});
				},
				tag: function(status) {
					if(status == 'all') {
						this.statuType = 'all';
						this.orderList();
					} else if(status == 0) {
						this.statuType =0;
						this.stockingOrder();
					} else {
						this.statuType =1;
						this.stockingOrder();
					}
				},
			}
	}
</script>
