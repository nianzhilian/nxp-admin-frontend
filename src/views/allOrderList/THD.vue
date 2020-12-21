<template>
	<div>
		<Tabs :animated="false" @on-click="tagThd">
			<TabPane :label="label" name="1"></TabPane>
			<TabPane label="全部退货单" name="all"></TabPane>
		</Tabs>
		<div v-if="page.statu == 'all'">
		<Row v-if="page.statu == 'all'">
			<Col span="5">客服</Col>
			<Col span="5">修理厂</Col>
			<Col span="5">退货单状态</Col>
		</Row>
		<br />
		<Row v-if="page.statu == 'all'" :gutter="20">
			<Col span="5">
			<Select v-model="formData.csArray" filterable multiple>
				<Option v-for="item in serviceData" :value="item.id" :key="item.id">{{item.name}}</Option>
			</Select>
			</Col>
			<Col span="5">
			<Select v-model="formData.xlcArray" filterable multiple>
				<Option v-for="item in xlcData" :value="item.id" :key="item.id">{{item.fullName}}</Option>
			</Select>
			</Col>
			<Col span="5">
			<Select v-model="formData.statusArray" filterable multiple>
				<Option v-for="(item,index) in returnStatus" :value="item.id" :key="item.id">{{item.status}}</Option>
			</Select>
			</Col>
		</Row>
		<inquiryTime v-if="page.statu == 'all'" ref="inquiryTime"></inquiryTime>
		<br />
		<Row v-if="page.statu == 'all'">
			<Col span="3">
			<Button type="primary" @click="searchChange" icon="search" long :loading="btnLoading">查询</Button>
			</Col>
		</Row>
		</div>
		<div class="ivu-table-wrapper " style="margin-top: 20px;">
			<div class="ivu-table ivu-table-border">
				<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
					<thead>
						<tr>
							<th class="ivu-table-cell" style="width: 60px;">序号</th>
							<th class="ivu-table-cell" width="130">订单ID</th>
							<th class="ivu-table-cell" style="width: 100px;">车牌号</th>
							<th class="ivu-table-cell">修理厂名称</th>
							<th class="ivu-table-cell">退货原因</th>
							<th class="ivu-table-cell">退货单状态</th>
							<th class="ivu-table-cell">客服</th>
							<th class="ivu-table-cell" width='120' style="text-align: right">退回配件数量</th>
							<th class="ivu-table-cell" style="text-align: right">退回配件总价</th>
							<th class="ivu-table-cell">退货发起时间</th>
							<th class="ivu-table-cell">结算方式</th>
							<th style="text-align: center;" width="180">操作</th>
						</tr>
					</thead>
					<tbody class="ivu-table-tbody">
						<tr v-for="(val,index) in data6">
							<td class="ivu-table-cell">{{page.pageSize * (page.current ==1 ? 0 : (page.current-1)) + index+1}}</td>
							<td class="ivu-table-cell">{{ val.orderNo }} <span v-if="val.isAdditional == 1" style="background-color: #D9534F; color: #FFFFFF;border-radius: 100px;padding: 1px 3px;font-size: 12px;" class="ng-scope">追</span></td>
							<td class="ivu-table-cell">{{ val.numberPlates }}</td>
							<td class="ivu-table-cell">{{ val.xlcName }}</td>
							<td class="ivu-table-cell" style="text-align: right;">{{val.reaCat}}</td>
							<td class="ivu-table-cell">{{val.status | filterStatus}}</td>
							<td class="ivu-table-cell">{{val.serviceUserName}}</td>
							<td class="ivu-table-cell" style="text-align: right">{{val.returnNumber}}</td>
							<td class="ivu-table-cell" style="text-align: right">{{val.returnPrice | jine}}</td>
							<td class="ivu-table-cell">{{val.createTime | dateFormate}}</td>
							<td class="ivu-table-cell">
								<span v-if="val.payType == 0 && val.isCod == 1">货到付款</span>
								<span v-if="val.payType == 1">月结</span>
								<span v-if="val.payType == 0 && val.isCod == 0">先款后货</span>
							</td>
							<td style="text-align: center;">
								<Button @click='queryOrder(val.orderId)' type="text" size="small">查看订单</Button>
								<Button @click='seeReturnOrder(val.id)' type="text" size="small">查看退货单</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<br />
		<Row>
			<Col span="3">
			<a :href="downLoad" download v-show="page.statu == 1" class="exportbtn" style="color: white;">
				<Button type="primary" long icon="ios-cloud-download">导出</Button>
			</a>
			<a :href="downLoad" download v-show="page.statu == 'all'" class="exportbtn" style="color: white;">
				<Button type="primary" long icon="ios-cloud-download">导出</Button>
			</a>
			</Col>
			<Col span="21" v-if="page.statu == 'all'">
				<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;">
					<slot>
						查询记录：{{ page.total }}条
					</slot>
				</Page>
			</Col>
			<Col span="21" v-if="page.statu != 'all'" style="text-align: right; line-height: 32px;">
			查询记录：{{ page.total }}条
			</Col>
		</Row>
		<br />
		<Row>
			<Col span="24">
			<h2>退货单金额汇总：{{totalPrice | jine}}</h2>
			</Col>
		</Row>
		<orderDetail ref="orderDetail" v-on:closedetail="closedetail"></orderDetail>
		<Modal width='1200' v-model="returnOrder.theModal.show" :title="returnOrder.theModal.title">
			<lookOrder :type='returnType' :id="id"> </lookOrder>
			<div slot="footer"></div>
		</Modal>
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
		fetchPostJson
	} from '../../utils/requestHttp.js'
	import inquiryTime from './inquiryTime'
	import orderDetail from '../../airxComponents/orderDetail'
	import lookOrder from './lookOrder'
	export default {
		components: {
			inquiryTime,
			orderDetail,
			lookOrder
		},
		props: ['returnType'],
		data() {
			return {
				loading: false,
				btnLoading: false,
				totalPrice: 0,
				downLoad: "",
				id: '',
				str: 0, //进行中数量
				formData: {
					datetime: '',
					dateVal: '',
					csArray: [], //选择的客服
					statusArray: [], //退货单状态
					xlcArray: [] // 选择的修理厂
				},
				//查看退货单
				returnOrder: {
					theModal: {
						show: false,
						title: '退货单详情'
					}
				},
				startDate: '',
				endDate: '',
				page: {
					statu: 1,
					total: 0,
					current: 1,
					pageSize: 12
				},
				data6: [],
				returnStatus: [{
					'id': 0,
					'status': '已取消'
				}, {
					'id': 21,
					'status': '定损员已确认'
				}, {
					'id': 22,
					'status': '待供应商确认'
				}, {
					'id': 23,
					'status': '供应商已确认'
				}, {
					'id': 24,
					'status': '退货已发货'
				}, {
					'id': 25,
					'status': '退货已完成'
				}],
				serviceData: [],
				xlcData: [],
				label: (h) => {
					return h('div', [
						h('span', '进行中的退货单 '),
						h('Badge', {
							props: {
								count: this.str
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
		mounted() {
			this.getOrder();
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
			//搜索
			searchChange() {
				this.page.page = 1;
				this.page.total = 0;
				this.page.current = 1;
				//this.$refs.inquiryTime.returnVal();
				if(this.$refs.inquiryTime.formData.startDate != undefined && this.$refs.inquiryTime.formData.startDate != null && this.$refs.inquiryTime.formData.startDate != '') {
					this.formData.startDate = this.$refs.inquiryTime.formData.startDate + ' ' + '00' + ':' + '00' + ':' + '00';
					this.formData.endDate = this.$refs.inquiryTime.formData.endDate + ' ' + '23' + ':' + '59' + ':' + '59';

				} else {
					this.formData.startDate = '';
					this.formData.endDate = '';
				}
				this.getOrder();
			},
			//获取订单
			getOrder() {
				this.btnLoading = true;
				this.data6 = [];
				if(this.page.statu == 1) {
					this.downLoad = '/nxp-admin/retord/downloadOngoing?type=1';
					fetchPostUrlencoded('/nxp-admin/retord/ongoing', {
						'type': 1
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag == 0) {
							this.data6 = res.data;
							this.str = res.data.length;
							if(res.totalPrice != null) {
								this.totalPrice = res.totalPrice;
							}
							this.page.total = res.data.length;
						} else {
							this.$Message.error(res.msg);
						}
					})
				} else if(this.page.statu == 'all') {
					var data = {
						'csArray': this.formData.csArray,
						'startDate': this.formData.startDate == undefined ? '' : this.formData.startDate,
						'endDate': this.formData.endDate == undefined ? '' : this.formData.endDate,
						'page': this.page.current,
						'size': this.page.pageSize,
						'statusArray': this.formData.statusArray,
						'type': 1,
						'xlcArray': this.formData.xlcArray
					};
					this.downLoad = '/nxp-admin/retord/downloadAll?query=' + encodeURIComponent(JSON.stringify(data));
					fetchPostJson('/nxp-admin/retord/all', {
						'csArray': this.formData.csArray,
						'startDate': this.formData.startDate == undefined ? '' : this.formData.startDate,
						'endDate': this.formData.endDate == undefined ? '' : this.formData.endDate,
						'page': this.page.current,
						'size': this.page.pageSize,
						'statusArray': this.formData.statusArray,
						'type': 1,
						'xlcArray': this.formData.xlcArray
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag == 0) {
							this.data6 = res.data;
							this.page.total = res.count;
							if(res.totalPrice != null) {
								this.totalPrice = res.totalPrice;
							} else {
								this.totalPrice = 0;
							}
						} else {
							this.$Message.error(res.msg);
						}
					})
				} else {
					this.$Message.error('数据错误，请刷新页面');
				}
			},
			tagThd(name) {
				this.page.statu = name;
				if(this.page.statu == 1) {
					this.data6 = [];
					this.getOrder();
				} else if(this.page.statu == 'all') {
					this.getRepair();
					this.getSevice();
					this.data6 = [];
					this.getOrder();
				} else {}
			},
			//获取客服
			getSevice() {
				fetchPostUrlencoded("/nxp-admin/serviceUser/getUser", {
					'type': 2
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.serviceData = res.data;
					}
				});
			},
			//获取修理厂
			getRepair() {
				fetchPostUrlencoded('/nxp-admin/cusOrganiztion/allList', {
					'type': 3
				}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.xlcData = res.data;
					}
				}).catch(() => {
					this.btnLoading = false;
					this.$Message.error('网络超时');
				});
			},
			//分页
			changePage: function(e) {
				this.page.current = e;
				this.getOrder();
			},
		}
	}
</script>
<style>
	.ivu-badge-count {
		background: #38c1ff;
	}
</style>