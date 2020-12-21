<template>
	<div class="example-case">
		<Table border :columns="columns8" :data="data8" ref="selection" @on-selection-change="increasePj"></Table>
		<Button @click="qxOrderCheck" type='primary' style="margin-top:15px;" v-if="orderIds.length > 0">将选中订单取消</Button>
		<orderDetail ref="orderDetail" v-on:closedetail="closedetail"></orderDetail>
	</div>
</template>

<script>
	import {
		md5,
		getLocalTime,
		splitK,
		rmoney,
		orderStatus,
		dateTrans
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet
	} from '../../utils/requestHttp.js'
	import orderDetail from '../../airxComponents/orderDetail'
	export default {
		components: {
			orderDetail
		},
		props: ['orderStatu', 'parentType'],
		data() {
			return {
				loading: false,
				btnLoading: false,
				orderIds: [],
				selec: [],
				page: {
					type: 'INS',
					total: 0,
					current: 1,
					pageSize: 12
				},
				columns8: [{
						type: 'selection',
						width: 60,
						align: 'center',
					}, {
						title: '序号',
						key: '',
						width: 80,
						render: (h, params) => {
							return this.page.pageSize * (this.page.current == 1 ? 0 : (this.page.current - 1)) + params.index + 1;
						}
					}, {
						title: '订单ID',
						key: 'orderNo',
						width: 120,
						render: (h, params) => {
							if(params.row.isAdditional == 1) {
								return h('div', [
									h('span', params.row.orderNo),
									h('span', {
										style: {
											background: '#D9534F',
											color: '#FFFFFF',
											'border-radius': '100px',
											padding: ' 1px 3px',
											'font-size': '12px'
										}
									}, '追')
								]);
							} else {
								return [params.row.orderNo];
							}
						}
					}, {
						title: '保险公司',
						key: 'orgFullName',
						/*render: (h, params) => {
							if(this.page.type == 'INS') {
								return params.row.orgFullName;
							} else {
								return '--';
							}
						}*/
					}, {
						title: '修理厂名称',
						key: 'xlcFullName'
					}, {
						title: '订单金额',
						key: 'price',
						align: 'right',
						width: 100,
						render: (h, params) => {
							return splitK(params.row.price);
						}
					}, {
						title: '订单状态',
						key: 'status',
						render: (h, params) => {
							return [orderStatus(params.row.status)];
						}
					}, {
						title: '下询单时间',
						key: 'createTime',
						render: (h, params) => {
							return [getLocalTime(params.row.createTime)];
						}
					}, {
						title: '收货人',
						key: 'receiverName'
					},
					/*{
					title: '报案号',
					key: 'numberReport',
					render: (h, params) => {
						if(this.page.type == 'INS') {
							return params.row.numberReport;
						} else {
							return '--';
						}
					}
				},*/
					{
						title: '车牌号',
						key: 'numberPlates'
					}, {
						title: '车型信息',
						key: 'factory',
						render: (h, params) => {
							if((params.row.factory == '' || params.row.factory == null || params.row.factory == undefined)&&params.row.vehicleType==2) {
								return h('span', params.row.carNote);
							}else if(params.row.factory != '' && params.row.factory != null && params.row.factory != undefined&&params.row.vehicleType==2) {
								return h('span', params.row.factory + ' - ' + params.row.brand + ' - ' + params.row.model + ' - ' + params.row.year + ' - ' + params.row.saleName);
							}else if(params.row.vehicleType==1){
								return h('span', params.row.vehicleName);
							}
						}
					}, {
						title: '结算方式',
						key: 'payType',
						render: (h, params) => {
							if(params.row.payType == 0 && params.row.isCod == 1) {
								return '货到付款';
							} else if(params.row.payType == 1) {
								return '月结';
							} else if(params.row.payType == 0 && params.row.isCod == 0) {
								return '先款后货';
							}
						}
					}, {
						title: '操作',
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
											this.qxOrder(params.row.id)
										}
									}
								}, '取消订单'),
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

							])
						}
					}
				],
				data8: []
			}
		},
		filters: {
			dateFormate(s) {
				return getLocalTime(s)
			},
			jine(s) {
				return splitK(s);
			}

		},
		created() {
			this.getOrder();
		},
		watch: {},
		methods: {
			queryOrder(id) {
				this.$refs.orderDetail.initData(id);
			},
			closedetail() {
				this.getOrder();
			},
			increasePj(obj) {
				this.orderIds = [];
				this.selec = obj;
				for(var i = 0; i < this.selec.length; i++) {
					this.orderIds.push(this.selec[i].id);
				}
			},
			//获取超时订单
			getOrder() {
				fetchPostUrlencoded('/nxp-admin/order/qxList', {}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.data8 = res.data;
					}
				})
			},
			//单选取消订单
			qxOrder(ids) {
				fetchPostUrlencoded('/nxp-admin/order/qxs', {
					'orderIds': ids
				}).then((res) => {
					this.btnLoading = false;
					if(res.flag == 0) {
						this.$Message.success(res.msg);
						this.getOrder();
					} else {
						this.$Message.error(res.msg);
					}
				})
			},
			//取消订单 多选
			qxOrderCheck() {
				this.$Modal.confirm({
					content: '<p>您确定取消订单吗？</p>',
					onOk: () => {
						fetchPostUrlencoded('/nxp-admin/order/qxs', {
							'orderIds': this.orderIds.join(',')
						}).then((res) => {
							this.btnLoading = false;
							if(res.flag == 0) {
								this.$Message.success(res.msg);
								this.orderIds = [];
								this.getOrder();
							} else {
								this.$Message.error(res.msg);
							}
						})
					}
				});
			}
		}
	}
</script>
<style type="text/css">
	/*.className {
		background-color: #D9534F;
		color: #FFFFFF;
		border-radius: 100px;
		padding: 1px 3px;
		font-size: 12px;
	}*/
</style>
