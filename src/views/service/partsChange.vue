<template>
	<div class="example-case">
		<Tabs :animated="false" @on-click="tag" style='padding:0 0 10px 0;'>
			<TabPane label="待更正" name="Uncorrect"></TabPane>
			<TabPane label="已更正" name="Correct"></TabPane>
		</Tabs>
		<Table border :columns="columns2" :data="data"></Table>
		<!--<div class="ivu-table-wrapper">
			<div class="ivu-table ivu-table-border">
				<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
					<thead>
						<tr>
							<th class="ivu-table-cell" width="100">序号</th>
							<th class="ivu-table-cell" width="130">订单ID</th>
							<th class="ivu-table-cell">发起方</th>
							<th class="ivu-table-cell">承修方</th>
							<th class="ivu-table-cell" style="text-align: right">订单金额</th>
							<th class="ivu-table-cell">订单状态</th>
							<th class="ivu-table-cell">下询单时间</th>
							<th class="ivu-table-cell">收货人名称</th>
							<th class="ivu-table-cell">车牌号</th>
							<th class="ivu-table-cell">车型信息</th>
							<th class="ivu-table-cell">结算方式</th>
							<th class="ivu-table-cell">客服</th>
							<th class="ivu-table-cell">配件详细</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(val,index) in data">
							<td class="ivu-table-cell" width="100">{{page.pageSize * (page.current ==1 ? 0 : (page.current-1)) + index+1}}</td>
							<td class="ivu-table-cell">{{ val.orderNo }}</td>
							<td class="ivu-table-cell">{{ val.orgFullName }}</td>
							<td class="ivu-table-cell">{{ val.xlcFullName }}</td>
							<td class="ivu-table-cell" style="text-align: right">{{val.price | jine}}</td>
							<td class="ivu-table-cell">{{ val.status | filterStatus }}</td>
							<td class="ivu-table-cell">{{ val.createTime | dateFormate}}</td>
							<td class="ivu-table-cell">{{ val.receiverName }}</td>
							<td class="ivu-table-cell">{{ val.numberPlates }}</td>
							<td class="ivu-table-cell">
								<span v-if='val.factory != null'>{{ val.factory }}-{{ val.brand }}-{{ val.model }}</span>
								<span v-if='val.factory == null'>{{val.carNote}}</span>
							</td>
							<td class="ivu-table-cell">
								<span v-if="val.payType == 0 && val.isCod == 1">货到付款</span>
								<span v-if="val.payType == 1">月结</span>
								<span v-if="val.payType == 0 && val.isCod == 0">先款后货</span>
							</td>
							<td class="ivu-table-cell">
								{{ val.serviceName}}
							</td>
							<td class="ivu-table-cell">
								<Button type="text" @click="queryPart(val.id)">查看详细</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>-->
		<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
		<!--配件名称详细-->
		<Modal width='1200' v-model="parts.theModal.show" :title="parts.theModal.title" :mask-closable="false">
			<div class="example-case">
				<h2>配件明细</h2>
				<div class="ivu-table-wrapper" style="margin-top: 20px;">
					<div class="ivu-table ivu-table-border">
						<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
							<thead>
								<tr>
									<th class="ivu-table-cell">#</th>
									<th class="ivu-table-cell">配件名称</th>
									<th class="ivu-table-cell">标准名称</th>
									<th class="ivu-table-cell">编辑</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(val,index) in data8">
									<td class="ivu-table-cell" width="100">{{page.pageSize * (page.current ==1 ? 0 : (page.current-1)) + index+1}}</td>
									<td class="ivu-table-cell">{{ val.name }}</td>
									<td class="ivu-table-cell">
										{{ val.standardName }}</td>
									<td class="ivu-table-cell">
										<Button type="text" @click="edit(val.id,val.standardName)">编辑</Button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Modal>
		<!--编辑配件名称-->
		<Modal width='800' style="height:400px" v-model="editSparts.theModal.show" :title="editSparts.theModal.title" :mask-closable="false">
			<h2>编辑配件名称</h2>
			<Select v-model="model1" style="margin-top:30px" filterable>
				<Option v-for="item in data2" :value="item.pjNbr" :key="item.pjNbr">{{ item.pjName }}</Option>
			</Select>
			<Button type="primary" @click="save()" style="margin-top: 20px;">修改</Button>
			<div slot="footer">
				<Button type="error" size="large" @click="editSparts.theModal.show =false">关闭</Button>
			</div>
		</Modal>
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
		fetchGet
	} from '../../utils/requestHttp.js'
	export default {
		props: ['orderStatu'],
		data() {
			return {
				loading: false,
				btnLoading: false,
				id: '',
				orderId: '',
				model1: '',
				status: 0,
				page: {
					total: 0,
					current: 1,
					pageSize: 12
				},
				parts: {
					theModal: {
						show: false,
						title: ''
					}
				},
				editSparts: {
					theModal: {
						show: false,
						title: ''
					}
				},
				data: [],
				data2: [],
				data8: [],
				columns2: [{
						title: '#',
						width: 80,
						render: (h, params) => {
							return this.page.pageSize * (this.page.current == 1 ? 0 : (this.page.current - 1)) + params.index + 1;
						}
					}, {
						title: '订单号',
						key: 'orderNo'
					}, {
						title: '发起方',
						key: 'orgFullName',
					}, {
						title: '承修方',
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
						title: '收货人名称',
						key: 'receiverName'
					}, {
						title: '车牌号',
						key: 'numberPlates',
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
								return '货到付款'
							} else if(params.row.payType == 0 && params.row.isCod == 0) {
								return '先款后货'
							} else {
								return '月结'
							}
						}
					}, {
						title: '客服',
						key: 'serviceName'
					}, {
						title: '操作',
						width: 120,
						align: 'center',
						render: (h, params) => {
								return h('div', [
									h('Button', {
										props: {
											type: 'text'
										},
										on: {
											click: () => {
												this.queryPart(params.row.id)
											}
										}
									}, '查看配件')
								]);
						}
					}],
				}
		},
		/*filters: {
			filterStatus: function(s) {
				let orderStatus = {
					0: '已取消',
					1: '客户询价单已生成',
					2: '天驶询价单已生成',
					3: '已邀请供应商报价',
					4: '供应商报价中',
					5: '供应商报价已完成',
					6: '已选择报价',
					7: '订单确认待发货',
					8: '订单确认待支付',
					9: '支付完毕待发货',
					11: '订单核价被打回',
					20: '退货审核已发起',
					21: '定损员已确认',
					22: '待供应商确认',
					23: '供应商已确认',
					24: '退货已发货',
					25: '退货完成',
					26: '退款已完成',
					30: '供应商备货中',
					31: '配送中',
					97: '货到待付款',
					98: '预订单保存',
					99: '订单完成'
				};
				return orderStatus[s]
			},
			dateFormate(s) {
				return getLocalTime(s)
			},
			jine(s) {
				return splitK(s);
			}

		},*/
		created() {
			this.getOrder();
		},
		watch: {},
		methods: {
			//提交修改
			save() {
				fetchPostUrlencoded('/nxp-admin/order/updatePjName', {
					'ansInfoId': this.orderId,
					'standardId': this.model1,

				}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						this.editSparts.theModal.show = false;
						this.getPjDeal();
					}
				})
			},
			//查看配件明细
			queryPart(id) {
				this.id = id;
				this.parts.theModal.show = true;
				this.getPjDeal();
			},
			//编辑配件标准名称
			edit: function(orderId,standardName) {
				this.orderId = orderId;
				this.model1 =standardName;
				this.editSparts.theModal.show = true;
				this.getPj();
			},
			//所有配件
			getPj() {
				fetchGet('/nxp-admin/carLine/allPj', {}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.data2 = res.data;
					}
				})
			},
			//获取明细
			getPjDeal() {
				fetchGet('/nxp-admin/order/deal/' + this.id, {}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.data8 = res.data;
					}
				})
			},
			//获取订单
			getOrder() {
				fetchPostUrlencoded('/nxp-admin/order/matching', {
					'page': this.page.current,
					'size': this.page.pageSize,
					'status': this.status,
					'orderNo' : ''

				}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.data = res.data;
						this.page.total = res.data.length;
					}
				})
			},
			tag: function(name) {
				this.page.current = 1;
				if(name == 'Uncorrect') {
					this.status = 0;
					this.getOrder();
				} else if(name == 'Correct') {
					this.status = 1;
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