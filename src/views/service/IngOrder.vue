<template>
	<div class="example-case">
		<Tabs :animated="false" @on-click="tagIng" style='padding:0 0 10px 0;'>
			<TabPane :label="label" name="InvitePrice"></TabPane>
			<TabPane :label="label2" name="QuotedPrice"></TabPane>
			<TabPane :label="label3" name="Payment"></TabPane>
			<TabPane :label="label4" name="Requotation"></TabPane>
		</Tabs>
		<div v-show="data2.length > 0">
			<div class="air-space">
				<i class="fa fa-sort-desc" aria-hidden="true"></i> 保险公司订单
			</div>
			<div class="ivu-table-wrapper">
				<div class="ivu-table ivu-table-border">
					<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
						<thead>
							<tr>
								<th class="ivu-table-cell" width="200">订单ID</th>
								<th class="ivu-table-cell">车牌号</th>
								<th class="ivu-table-cell">车型信息</th>
								<th class="ivu-table-cell">修理厂名称</th>
								<th class="ivu-table-cell">收货人名称</th>
								<th class="ivu-table-cell">平台管理费</th>
								<th class="ivu-table-cell">保险公司</th>
								<th class="ivu-table-cell">报案号</th>
								<th class="ivu-table-cell">下询单时间</th>
								<th class="ivu-table-cell">订单状态</th>
								<th class="ivu-table-cell">结算方式</th>
								<th class="ivu-table-cell">订单详细</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="val in data2">
								<td class="ivu-table-cell">{{ val.orderNo }}&nbsp;<span v-if="val.isAdditional == 1" style="background-color: #D9534F; color: #FFFFFF;border-radius: 100px;padding: 1px 3px;font-size: 12px;">追</span></td>
								<td class="ivu-table-cell">{{ val.numberPlates }}</td>
								<td class="ivu-table-cell">
									<span v-if="val.factory != null&&val.factory != undefined&&val.factory != ''&&val.vehicleType==2">{{ val.factory }}-{{ val.brand }}-{{ val.model }}</span>
									<span v-if="val.factory == null||val.factory == undefined||val.factory == ''&&val.vehicleType==2">{{val.carNote}}</span>
									<span v-if="val.vehicleType==1">{{val.vehicleName}}</span>
								</td>
								<td class="ivu-table-cell">{{ val.xlcFullName }}</td>
								<td class="ivu-table-cell">{{ val.receiverName }}</td>
								<td class="ivu-table-cell">{{val.manageCost}}</td>
								<td class="ivu-table-cell">{{ val.orgFullName }}</td>
								<td class="ivu-table-cell">{{ val.numberReport }}</td>
								<td class="ivu-table-cell">{{ val.createTime| dateFormate }}</td>
								<td class="ivu-table-cell">{{val.status | filterStatus }}</td>
								<td class="ivu-table-cell">
									<span v-if="val.payType == 0 && val.isCod == 1">货到付款</span>
									<span v-if="val.payType == 1">月结</span>
									<span v-if="val.payType == 0 && val.isCod == 0">先款后货</span>
								</td>
								<td class="text-center">
									<Button @click='queryOrder(val.id)' type="text">查看详细</Button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div v-show="data3.length>0">
			<div class="air-space">
				<i class="fa fa-sort-desc" aria-hidden="true"></i> 自采订单
			</div>
			<div class="ivu-table-wrapper">
				<div class="ivu-table ivu-table-border">
					<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
						<thead>
							<tr>
								<th class="ivu-table-cell" width="200">订单ID</th>
								<th class="ivu-table-cell">车牌号</th>
								<th class="ivu-table-cell">车型信息</th>
								<th class="ivu-table-cell">修理厂名称</th>
								<th class="ivu-table-cell">收货人名称</th>
								<th class="ivu-table-cell">下询单时间</th>
								<th class="ivu-table-cell">订单状态</th>
								<th class="ivu-table-cell">结算方式</th>
								<th class="ivu-table-cell">订单详细</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="val in data3">
								<td class="ivu-table-cell">{{ val.orderNo }}&nbsp;<span v-if="val.isAdditional == 1" style="background-color: #D9534F; color: #FFFFFF;border-radius: 100px;padding: 1px 3px;font-size: 12px;">追</span></td>
								<td class="ivu-table-cell">{{ val.numberPlates }}</td>
								<td class="ivu-table-cell">
									<span v-if="val.factory != null&&val.factory != undefined&&val.factory != ''&&val.vehicleType==2">{{ val.factory }}-{{ val.brand }}-{{ val.model }}</span>
									<span v-if="val.factory == null||val.factory == undefined||val.factory == ''&&val.vehicleType==2">{{val.carNote}}</span>
									<span v-if="val.vehicleType==1">{{val.vehicleName}}</span>
								</td>
								<td class="ivu-table-cell">{{ val.xlcFullName }}</td>
								<td class="ivu-table-cell">{{ val.receiverName }}</td>
								<td class="ivu-table-cell">{{ val.createTime| dateFormate }}</td>
								<td class="ivu-table-cell">{{val.status | filterStatus }}</td>
								<td class="ivu-table-cell">
									<span v-if="val.payType == 0 && val.isCod == 1">货到付款</span>
									<span v-if="val.payType == 1">月结</span>
									<span v-if="val.payType == 0 && val.isCod == 0">先款后货</span>
								</td>
								<td class="ivu-table-cell">
									<Button @click='queryOrder(val.id)' type="text">查看详细</Button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div v-show="data2.length == 0 && data3.length == 0" class="nothing">
			<div>没有查询到自采或者保险公司订单</div>
		</div>
		<!--详情-->
		<orderDetail ref="orderDetail" v-on:closedetail="closedetail"></orderDetail>
	</div>
</template>

<script>
	import {
		md5,
		getLocalTime,
		splitK,
		rmoney,
		numAdd,
		dateTrans,
		orderStatus
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam
	} from '../../utils/requestHttp.js'
	import orderDetail from '../../airxComponents/orderDetail'
	export default {
		components: {
			orderDetail
		},
		props: ['parentType'],
		data() {
			return {
				loading: false,
				btnLoading: false,
				str: '',
				str2: '',
				str3: '',
				str4: '',
				num: 1,
				page: {
					type: 'InvitePrice',
					total: 0,
					current: 1,
					pageSize: 12
				},
				data2: [],
				data3: [],
				label: (h) => {
					return h('div', [
						h('span', '邀请报价 '),
						h('Badge', {
							props: {
								count: this.str
							}
						})
					])
				},
				label2: (h) => {
					return h('div', [
						h('span', '选择报价 '),
						h('Badge', {
							props: {
								count: this.str2
							}
						})
					])
				},
				label3: (h) => {
					return h('div', [
						h('span', '支付确认 '),
						h('Badge', {
							props: {
								count: this.str3
							}
						})
					])
				},
				label4: (h) => {
					return h('div', [
						h('span', '需要重新报价 '),
						h('Badge', {
							props: {
								count: this.str4
							}
						})
					])
				}
			}
		},
		filters: {
			filterStatus(s){
				return orderStatus(s)
			},
			dateFormate(s) {
				return getLocalTime(s)
			},
			jine(s) {
				return splitK(s);
			}

		},
		created() {
			this.getOrder();
			this.getOrderNumber();
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
				this.getOrderNumber();
			},
			//获取订单
			getOrder() {
				// ===================进行中订单
				if(this.parentType == 'Ing' && this.page.type == 'InvitePrice') {
					/* 邀请报价  */
					fetchGet('/nxp-admin/order/list/' + this.num, {}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data2 = res.data.insOrder;
							this.data3 = res.data.xlcOrder;
						}
					})
				} else if(this.parentType == 'Ing' && this.page.type == 'QuotedPrice') {
					/* 选择报价  */
					fetchGet('/nxp-admin/order/list/' + this.num, {}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data2 = res.data.insOrder;
							this.data3 = res.data.xlcOrder;
						}
					})
				} else if(this.parentType == 'Ing' && this.page.type == 'Payment') {
					/*  支付确认  */
					fetchGet('/nxp-admin/order/list/' + this.num, {}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data2 = res.data.insOrder;
							this.data3 = res.data.xlcOrder;
						}
					})
				} else if(this.parentType == 'Ing' && this.page.type == 'Requotation') {
					// 需重新报价
					fetchGet('/nxp-admin/order/list/' + this.num, {}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data2 = res.data.insOrder;
							this.data3 = res.data.xlcOrder;
						}
					})
				} else {}
			},
			getOrderNumber() {
				fetchGet('/nxp-admin/counter/order', {}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						for(var j = 0; j < res.data.length; j++) {
							if(res.data[j]['returnType'] == 0) {
								if(res.data[j]['status'] == 1) {
									this.str = res.data[j]['totalAmount'];
								} else if(res.data[j]['status'] == 5) {
									this.str2 = res.data[j]['totalAmount'];
								} else if(res.data[j]['status'] == 8) {
									this.str3 = res.data[j]['totalAmount'];
								} else if(res.data[j]['status'] == 11) {
									this.str4 = res.data[j]['totalAmount'];
								}
							}
						}
					}
				})
			},
			tagIng: function(name) {
				this.page.type = name;
				this.page.current = 1;
				if(this.page.type == 'InvitePrice') {
					this.num = 1;
				} else if(this.page.type == 'QuotedPrice') {
					this.num = 5;
				} else if(this.page.type == 'Payment') {
					this.num = 8;
				} else if(this.page.type == 'Requotation') {
					this.num = 11;
				} else {}
				this.getOrder();
				this.getOrderNumber();
			},
			changePage: function(e) {
				this.page.current = e;
				this.getOrder();
			}
		}
	}
</script>
<style>
	.ivu-badge-count {
		background: #38c1ff;
		;
	}
	
	.nothing {
		line-height: 80px;
		padding: 80px 0;
		text-align: center;
		color: #ddd;
		border: #ddd 1px dotted;
		background: #fefefe;
	}
</style>