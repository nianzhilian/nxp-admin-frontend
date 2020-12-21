<template>
	<div class="example-case">
		<Tabs :animated="false" @on-click="tagThd" style='padding:0 0 10px 0;'>
			<TabPane :label="label" name="WorkIng"></TabPane>
			<TabPane :label="label2" name="Complete"></TabPane>
			<TabPane :label="label3" name="ComList"></TabPane>
		</Tabs>
		<div class="ivu-table-wrapper">
			<div class="ivu-table ivu-table-border">
				<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
					<thead>
						<tr>
							<th class="ivu-table-cell" style="width: 60px;">序号</th>
							<th class="ivu-table-cell" width="130">订单ID</th>
							<th class="ivu-table-cell" style="width: 100px;">车牌号</th>
							<th class="ivu-table-cell">修理厂名称</th>
							<th class="ivu-table-cell">{{parentType=='Thd' ? '退' : '换'}}货原因</th>
							<th class="ivu-table-cell">{{parentType=='Thd' ? '退' : '换'}}货单状态</th>
							<th class="ivu-table-cell" width='120' style="text-align: right">{{parentType=='Thd' ? '退' : '换'}}回配件数量</th>
							<th class="ivu-table-cell" style="text-align: right">{{parentType=='Thd' ? '退' : '换'}}回配件总价</th>
							<th class="ivu-table-cell">{{parentType=='Thd' ? '退' : '换'}}货发起时间</th>
							<th class="ivu-table-cell">结算方式</th>
							<th class="ivu-table-cell">操作</th>
						</tr>
					</thead>
					<tbody class="ivu-table-tbody">
						<tr v-for="(val,index) in data8">
							<td class="ivu-table-cell">{{page.pageSize * (page.current ==1 ? 0 : (page.current-1)) + index+1}}</td>
							<td class="ivu-table-cell">{{ val.orderNo }} <span v-if="val.isAdditional == 1" style="background-color: #D9534F; color: #FFFFFF;border-radius: 100px;padding: 1px 3px;font-size: 12px;" class="ng-scope">追</span></td>
							<td class="ivu-table-cell">{{ val.numberPlates }}</td>
							<td class="ivu-table-cell">{{ val.xlcName }}</td>
							<td class="ivu-table-cell" style="text-align: right;">{{val.reaCat}}</td>
							<td class="ivu-table-cell"> 
								<span v-if="val.returnType=='1'">{{val.status | filterThStatus}}</span>
								<span v-if="val.returnType=='2'">{{val.status | filterHhStatus}}</span>
							</td>
							<td class="ivu-table-cell" style="text-align: right">{{val.returnNumber}}</td>
							<td class="ivu-table-cell" style="text-align: right">{{val.returnPrice | jine}}</td>
							<td class="ivu-table-cell">{{val.createTime | dateFormate}}</td>
							<td class="ivu-table-cell">
								<span v-if="val.payType == 0 && val.isCod == 1">货到付款</span>
								<span v-if="val.payType == 1">月结</span>
								<span v-if="val.payType == 0 && val.isCod == 0">先款后货</span>
							</td>
							<td class="ivu-table-cell">
								<span @click='queryOrder(val.id)' type="text" style="cursor: pointer;">查看详细</span>&nbsp;
								<span @click='seeReturnOrder(val.id)' type="text" style="cursor: pointer;">查看{{parentType=='Thd' ? '退' : '换'}}货单</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<Page :total="page.total" :page-size="page.pageSize" v-show="page.type!='WorkIng'" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
		<!--查看退换货单-->
		<Modal width='1200' v-model="returnOrder.theModal.show" :title="returnOrder.theModal.title" :mask-closable="false">
			<lookOrder :type='parentType' :id="id"> </lookOrder>
		</Modal>
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
		orderStatus,
		dateTrans
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam
	} from '../../utils/requestHttp.js'
	import orderDetail from '../../airxComponents/orderDetail'
	import lookOrder from '../allOrderList/lookOrder'
	export default {
		components: {
			orderDetail,
			lookOrder
		},
		props: ['parentType'],
		data() {
			return {
				loading: false,
				btnLoading: false,
				str: 0,
				id: '',
				page: {
					type: 'WorkIng',
					total: 0,
					current: 1,
					pageSize: 12
				},
				//查看退换货单
				returnOrder: {
					theModal: {
						show: false,
						title: ''
					}
				},
				data8: [],
				data7: [],
				label: (h) => {
					if(this.parentType == 'Thd') {
						return h('div', [
							h('span', '进行中退货单'),
							h('Badge', {
								props: {
									count: this.str
								}
							})
						])
					} else if(this.parentType == 'Hhd') {
						return h('div', [
							h('span', '进行中退货单'),
							h('Badge', {
								props: {
									count: this.str
								}
							})
						])
					} else {}
				},
				label2: (h) => {
					if(this.parentType == 'Thd') {
						return h('div', [
							h('span', '已完成退货单'),
						])
					} else if(this.parentType == 'Hhd') {
						return h('div', [
							h('span', '已完成换货单'),
						])
					} else {}

				},
				label3: (h) => {
					if(this.parentType == 'Thd') {
						return h('div', [
							h('span', '全部退货单'),
						])
					} else if(this.parentType == 'Hhd') {
						return h('div', [
							h('span', '全部换货单'),
						])
					} else {}

				}
			}
		},
		filters: {
			filterHhStatus: function(s) {
				let orderStatus = {
					0: '换货已取消',
					20: '换货审核已发起',
					21: '定损员已确认',
					22: '待供应商确认',
					23: '供应商已确认',
					24: '换货退回已发货',
					25: '换货已退回',
					31: '换货已再次发货',
					32: '换货完成',
				};
				return orderStatus[s]
			},
			filterThStatus(s){
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
		},
		watch: {
			parentType: 'getOrder'
		},
		methods: {
			seeReturnOrder(id) {
				this.id = id;
				this.returnOrder.theModal.show = true;
			},
			queryOrder(id) {
				this.$refs.orderDetail.initData(id);
			},
			closedetail() {
				this.getOrder();
			},
			//获取订单
			getOrder() {
				this.str =0;
				// ===================退货单
				if(this.parentType == 'Thd' && this.page.type == 'WorkIng') {
					/* 退货单进行中的退货单  */
					fetchPostUrlencoded('/nxp-admin/retord/unComlist', {
						'status': '21,22,23,24',
						'type': 1
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data8 = res.data;
							this.page.total = res.count;
						}
					})
				} else if(this.parentType == 'Thd' && this.page.type == 'Complete') {
					/* 退货单已完成的退货单  */
					fetchGetHaveParam('/nxp-admin/retord/complete?', {
						'page': this.page.current,
						'size': this.page.pageSize,
						'type': 1
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data8 = res.data;
							this.page.total = res.count;
						}
					})
				} else if(this.parentType == 'Thd' && this.page.type == 'ComList') {
					/* 退货 全部的退货单  */
					fetchGetHaveParam('/nxp-admin/retord/comlist?', {
							'page': this.page.current,
							'size': this.page.pageSize,
							'type': 1
						}).then((res) => {
							this.btnLoading = false;
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.data8 = res.data;
								this.page.total = res.count;
							}
						})
						// ===================换货单
				} else if(this.parentType == 'Hhd' && this.page.type == 'WorkIng') {
					//换货单 进行中订单
					fetchPostUrlencoded('/nxp-admin/retord/unComlist', {
						'status': '21,22,23,24,25,31',
						'type': 2
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data8 = res.data;
						}
					})

				} else if(this.parentType == 'Hhd' && this.page.type == 'Complete') {
					fetchGetHaveParam('/nxp-admin/retord/complete?', {
						'page': this.page.current,
						'size': this.page.pageSize,
						'type': 2
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data8 = res.data;
							this.page.total = res.count;
						}
					})
				} else if(this.parentType == 'Hhd' && this.page.type == 'ComList') {
					fetchGetHaveParam('/nxp-admin/retord/comlist?', {
						'page': this.page.current,
						'size': this.page.pageSize,
						'type': 2
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data8 = res.data;
							this.page.total = res.count;
						}
					})
				} else {}
				this.getOrderNumber();
			},
			//获取进行中订单
			getOrderNumber() {
				fetchGet('/nxp-admin/counter/order', {}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						for(var i=0;i<res.data.length;i++){
							if(res.data[i]['returnType'] == 1 && (res.data[i]['status'] == 21 || res.data[i]['status'] == 22 || res.data[i]['status'] == 23 || res.data[i]['status'] == 24) && this.parentType == 'Thd'){
								this.str +=res.data[i]['totalAmount'];
							}else if(res.data[i]['returnType'] == 2 && (res.data[i]['status'] == 21 || res.data[i]['status'] == 22 || res.data[i]['status'] == 23 || res.data[i]['status'] == 24 || res.data[i]['status'] == 25 || res.data[i]['status'] == 31) && this.parentType == 'Hhd'){
								this.str +=res.data[i]['totalAmount'];
							}
						}
					}
				})
			},
			tagThd: function(name) {
				this.page.type = name;
				this.page.current = 1;
				this.getOrder();
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
</style>