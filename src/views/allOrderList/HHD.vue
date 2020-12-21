<template>
	<div>
		<Tabs :animated="false" @on-click="tagThd">
			<TabPane :label="label" name="1"></TabPane>
			<TabPane label="全部换货单" name="all"></TabPane>
		</Tabs>
		<div v-if="page.statu == 'all'">
		<Row :gutter="20">
			<Col span="5">客服</Col>
			<Col span="5">承修方</Col>
			<Col span="5">换货单状态</Col>
		</Row>
		<br />
		<Row :gutter="20">
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
				<Option v-for="(item,index) in changeStatus" :value="item.id" :key="item.id">{{item.status}}</Option>
			</Select>
			</Col>
		</Row>
		<!--时间-->
		<inquiryTime ref="inquiryTime"></inquiryTime>
		<br />
		<Row>
			<Col span="3">
			<Button type="primary" @click="searchChange" long icon="search" :loading="btnLoading">查询</Button>
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
							<th class="ivu-table-cell">换货原因</th>
							<th class="ivu-table-cell">换货单状态</th>
							<th class="ivu-table-cell">客服</th>
							<th class="ivu-table-cell" width='120' style="text-align: right">换回配件数量</th>
							<th class="ivu-table-cell" style="text-align: right">换回配件总价</th>
							<th class="ivu-table-cell">换货发起时间</th>
							<th class="ivu-table-cell">结算方式</th>
							<th style="text-align: center;">操作</th>
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
								<Button @click='seeReturnOrder(val.id)' type="text" size="small">查看换货单</Button>
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
				<Button type="primary" long>导出</Button>
			</a>
			<a :href="downLoad" download v-show="page.statu == 'all'" class="exportbtn" style="color: white;">
				<Button type="primary" long>导出</Button>
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
			<h2>换货单金额汇总：{{totalPrice | jine}}</h2>
			</Col>
		</Row>
		<Modal width='1200' v-model="returnOrder.theModal.show" :title="returnOrder.theModal.title">
			<lookOrder :type='returnType' :id="id"> </lookOrder>
			<div slot="footer"></div>
		</Modal>
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
				str: 0,
				id: '',
				formData: {
					datetime: '',
					dateVal: '',
					startDate: '',
					endDate: '',
					csArray: [], //选择的客服
					statusArray: [], //换货单状态
					xlcArray: [] // 选择的修理厂
				},
				startDate: '',
				endDate: '',
				page: {
					statu: 1,
					total: 0,
					current: 1,
					pageSize: 12
				},
				//查看换货单
				returnOrder: {
					theModal: {
						show: false,
						title: '换货单详情'
					}
				},
				data6: [],
				changeStatus: [{
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
					'status': '换货退回已发货'
				}, {
					'id': 25,
					'status': '换货已退回'
				}, {
					'id': 31,
					'status': '换货已再次发货'
				}, {
					'id': 32,
					'status': '换货完成'
				}],
				serviceData: [],
				xlcData: [],
				label: (h) => {
					return h('div', [
						h('span', '进行中的换货单 '),
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
		created() {
			this.getOrder();
		},
		watch: {},
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
				if(this.$refs.inquiryTime.formData.startDate != undefined && this.$refs.inquiryTime.formData.startDate != null && this.$refs.inquiryTime.formData.startDate != '') {
					this.formData.startDate = this.$refs.inquiryTime.formData.startDate + ' ' + '00' + ':' + '00' + ':' + '00';
					this.formData.endDate = this.$refs.inquiryTime.formData.endDate + ' ' + '23' + ':' + '59' + ':' + '59';

				} else {
					this.formData.startDate = '';
					this.formData.endDate = '';
				}
				this.getOrder();
			},

			getOrder() {
				this.btnLoading = true;
				this.data6 = [];
				if(this.page.statu == 1) {
					this.downLoad = '/nxp-admin/retord/downloadOngoing?type=2';
					fetchPostUrlencoded('/nxp-admin/retord/ongoing', {
						'type': 2
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data6 = res.data;
							this.page.total = res.data.length;
							this.str = res.data.length;
							if(res.totalPrice != null) {
								this.totalPrice = res.totalPrice;
							} else {
								this.totalPrice = 0;
							}
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
						'type': 2,
						'xlcArray': this.formData.xlcArray
					};
					this.downLoad = '/nxp-admin/retord/downloadAll?query=' + encodeURIComponent(JSON.stringify(data));
					fetchPostJson('/nxp-admin/retord/all', {
						'csArray': this.formData.csArray,
						'endDate': this.formData.endDate == undefined ? '' : this.formData.endDate,
						'page': this.page.current,
						'size': this.page.pageSize,
						'startDate': this.formData.startDate == undefined ? '' : this.formData.startDate,
						'statusArray': this.formData.statusArray,
						'type': 2,
						'xlcArray': this.formData.xlcArray
					}).then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.data6 = res.data;
							this.page.total = res.count;
							if(res.totalPrice != null) {
								this.totalPrice = res.totalPrice;
							} else {
								this.totalPrice = 0;
							}
						}
					})
				} else {}
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
		;
	}
</style>