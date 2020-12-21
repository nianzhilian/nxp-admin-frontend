<template>
	<div class="example-case">
		<Tabs :animated="false" @on-click="tag" style='padding:0 0 10px 0;'>
			<TabPane label="保险公司订单" name="INS"></TabPane>
			<TabPane label="修理厂订单" name="XLC"></TabPane>
		</Tabs>
		<Table border :columns="columns7" :data="data8"></Table>
		<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
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
				page: {
					type: 'INS',
					total: 0,
					current: 1,
					pageSize: 12
				},
				columns7: [{
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
							}
							else {
								return [params.row.orderNo];
							}
							}
						}, {
								title: '保险公司',
								key: 'orgFullName',
								render: (h, params) => {
									if(this.page.type == 'INS') {
										return params.row.orgFullName;
									} else {
										return '--';
									}
								}
							}, {
								title: '修理厂名称',
								key: 'xlcFullName'
							}, {
								title: '订单金额',
								key: 'price',
								align: 'right',
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
							}, {
								title: '报案号',
								key: 'numberReport',
								render: (h, params) => {
									if(this.page.type == 'INS') {
										return params.row.numberReport;
									} else {
										return '--';
									}
								}
							}, {
								title: '车牌号',
								key: 'numberPlates'
							}, {
								title: '车型信息',
								key: 'factory',
								render: (h, params) => {
									//val.factory != null&&val.factory != undefined&&val.factory != ''&&val.vehicleType==2
									   
									if((params.row.factory == '' || params.row.factory == null || params.row.factory == undefined)&&params.row.vehicleType==2) {
										return h('span', params.row.carNote);
									}else if(params.row.factory != '' && params.row.factory != null && params.row.factory != undefined && params.row.vehicleType==2) {
										return h('span', params.row.factory + ' - ' + params.row.brand + ' - ' + params.row.model + ' - ' + params.row.year + ' - ' + params.row.saleName);
									}else if(params.row.vehicleType == 1 ){
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
									])
								}
							}],
						data8: [],
						data7: []
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
				watch: {
					parentType: 'getOrder'
				},
				methods: {
					queryOrder(id) {
						this.$refs.orderDetail.initData(id);
					},
					closedetail() {
						this.getOrder();
					},
					//获取订单
					getOrder() {
						fetchPostUrlencoded('/nxp-admin/order/allOrdBySU', {
							'page': this.page.current,
							'size': this.page.pageSize,
							'status': this.orderStatu,
							'type': this.page.type

						}).then((res) => {
							this.btnLoading = false;
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.data8 = res.data;
								this.page.total = res.count;
							}
						})
					},
					tag: function(name) {
						this.page.type = name;
						this.page.current = 1;
						if(name == 'INS') {
							this.page.type = 'INS';
							this.getOrder();
						} else if(name == 'XLC') {
							this.page.type = 'XLC';
							this.getOrder();
						} else {}
					},
					changePage: function(e) {
						this.page.current = e;
						this.getOrder();
					}
				}
			}
</script>
<style type="text/css">
	.className {
		background-color: #D9534F;
		color: #FFFFFF;
		border-radius: 100px;
		padding: 1px 3px;
		font-size: 12px;
	}
</style>