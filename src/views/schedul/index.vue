<template>
	<div class="example-case">
		<div class="air-title h3">作业调度 </div>
		<Tabs :animated="false">
			<TabPane label="需关注订单" value="1"></TabPane>
		</Tabs>
		<!--<Table border :columns="columns7" :data="data"></Table>
		<Page :total="page.total" :page-size="pageSize" @on-change="changePage" show-total :current="current" style="float: right;"></Page>-->
		<div class="air-space">
			<i class="fa fa-sort-desc" aria-hidden="true"></i> 超时订单
		</div>
		<Table border :columns="columns7" :data="overData"></Table>
		<div class="air-space">
			<i class="fa fa-sort-desc" aria-hidden="true"></i> 未分派订单
		</div>
		<Table border :columns="columns7" :data="undistributData"></Table>
		<orderDetail ref="orderDetail" v-on:closedetail="closedetail"></orderDetail>
	</div>
</template>
<script>
	import {
		getLocalTime,
		splitK,
		rmoney,
		numAdd,
		dateTrans,
		oveTtime,
		md5,
		logHttp
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
		data() {
				return {
					loading: false,
					btnLoading: false,
					page: {
						status: '',
						total: 0,
						current: 1,
						pageSize: 15
					},
					loading: false,
					columns7: [{
						title: '订单编号',
						key: 'orderNo'
					}, {
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
						title: '已空挡时长',
						key: 'createTime',
						render: (h, params) => {
							return h('div', oveTtime(params.row.createTime.time));
						}
					}, {
						title: '分派客服',
						key: 'serviceName'
					}, {
						title: '操作',
						key: 'action',
						width: 300,
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
								}, '查看')
							]);
						}
					}],
					overData: [],
					undistributData: [],
				}
			},
			created() {
				this.getSchedu();
			},
			watch: {

			},
			mounted(){
				logHttp(this.$store.state.sourceInfo,'作业调度',fetchPostUrlencoded);
			},
			methods: {
				queryOrder(id) {
					this.$refs.orderDetail.initData(id);
				},
				closedetail() {
					this.getSchedu();
				},
				//获取用户列表
				getSchedu() {
					this.loading = true;
					fetchGet('/nxp-admin/custService/abnormalOrders').then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.overData = res.data.exp;
							this.undistributData = res.data.nocs;
							this.$Message.success(res.msg);
						}
					}).catch(() => {
						this.btnLoading = false;
						this.$Message.error('网络超时');
					});
				}
			}
	}
</script>
