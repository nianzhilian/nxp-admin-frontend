<template>
	<div>
		<br />
		<Row :gutter="20">
			<Col span="5">发起方</Col>
			<Col span="5">承修方</Col>
			<Col span="5">车型</Col>
			<Col span="5">客服</Col>
			<Col span="4">订单状态</Col>
		</Row>
		<br />
		<Row :gutter="20">
			<Col span="5">
			<Select v-model="searchObj.model2" filterable multiple>
				<Option v-for="item in searchObj.sponsorData" :value="item.id" :key="item.id">{{item.fullName}}</Option>
			</Select>
			</Col>
			<Col span="5">
			<Select v-model="searchObj.model3" filterable multiple>
				<Option v-for="item in searchObj.repairData" :value="item.id" :key="item.id">{{item.fullName}}</Option>
			</Select>
			</Col>
			<Col span="5">
			<Select v-model="searchObj.model4" filterable clearable>
				<Option v-for="(item,index) in searchObj.carData" :value="item.carNew" :key="item.carNew">{{item.factory}} - {{item.brand}} - {{item.line}}</Option>
			</Select>
			</Col>
			<Col span="5">
			<Select v-model="searchObj.model5" filterable multiple>
				<Option v-for="item in searchObj.serviceData" :value="item.id" :key="item.id">{{ item.name }}</Option>
			</Select>
			</Col>
			<Col span="4">
			<Select v-model="searchObj.model6" filterable multiple>
				<Option v-for="item in orderStatus" :value="item.key" :key="item.key">{{ item.value }}</Option>
			</Select>
			</Col>
		</Row>
		<inquiryTime ref='inquiryTime'></inquiryTime>
		<br />
		<Row>
			<Col span="3">
				<Button type="primary" icon="search" long :loading="btnLoading" @click="searchChange">查询</Button>
			</Col>
		</Row>
		<br />
		<div class="ivu-table-wrapper">
			<div class="ivu-table ivu-table-border">
				<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
					<thead>
						<tr>
							<th style="width: 60px; text-align: center;">#</th>
							<th class="ivu-table-cell" style="width:130px;">订单ID</th>
							<th class="ivu-table-cell">发起方</th>
							<th class="ivu-table-cell">承修方</th>
							<th style="text-align: right;"><span class="ivu-table-cell">订单金额</span></th>
							<th class="ivu-table-cell">订单状态</th>
							<th class="ivu-table-cell">下询单时间</th>
							<th class="ivu-table-cell">收货人名称</th>
							<th class="ivu-table-cell">报案号</th>
							<th class="ivu-table-cell">车牌号</th>
							<th class="ivu-table-cell">车型信息</th>
							<th class="ivu-table-cell">结算方式</th>
							<th class="ivu-table-cell">客服</th>
							<th width="90" style="text-align: center;">
								<span class="ivu-table-cell">
									操作
								</span>
							</th>
						</tr>
					</thead>
					<tbody class="ivu-table-tbody">
						<tr v-for="(val,index) in data8">
							<td style="text-align: center;">{{page.pageSize * (page.current ==1 ? 0 : (page.current-1)) + index+1}}</td>
							<td class="ivu-table-cell">{{ val.orderNo }} <span v-if="val.isAdditional == 1" style="background-color: #D9534F; color: #FFFFFF;border-radius: 100px;padding: 1px 3px;font-size: 12px;" class="ng-scope">追</span></td>
							<td class="ivu-table-cell">{{ val.orgFullName }}</td>
							<td class="ivu-table-cell">{{ val.xlcFullName }}</td>
							<td style="text-align: right;"><span class="ivu-table-cell">{{val.price | jine}}</span></td>
							<td class="ivu-table-cell">{{val.status | filterStatus}}</td>
							<td class="ivu-table-cell">{{ val.createTime | dateFormate }}</td>
							<td class="ivu-table-cell">{{ val.receiverName }}</td>
							<td class="ivu-table-cell">{{val.numberReport}}</td>
							<td class="ivu-table-cell">{{ val.numberPlates }}</td>
							<td class="ivu-table-cell">
								<span v-if="val.factory != null&&val.factory != undefined&&val.factory != ''&&val.vehicleType==2">{{ val.factory }}-{{ val.brand }}-{{ val.model }}</span>
								<span v-if="val.factory == null||val.factory == undefined||val.factory == ''&&val.vehicleType==2">{{val.carNote}}</span>
								<span v-if="val.vehicleType==1">{{val.vehicleName}}</span>
							</td>
							<td class="ivu-table-cell">
								<span v-if="val.payType == 0 && val.isCod == 1">货到付款</span>
								<span v-if="val.payType == 1">月结</span>
								<span v-if="val.payType == 0 && val.isCod == 0">先款后货</span>
							</td>
							<td class="ivu-table-cell">
								<span>{{ val.serviceName}}</span>
							</td>
							<td style="text-align: center;">
								<Button @click='queryOrder(val.id)' type="text">查看详细</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<br />
		<Row :gutter="20">
			<Col span="3">
			<a target="_blank" style="color: white;" :href="'/nxp-admin/order/downloadSearchOrders?sponsor=' + this.searchObj.model2.join(',') + '&orgId=' + this.searchObj.model3.join(',') + '&factory=' + (this.searchObj.model4 == undefined ? '' : this.searchObj.model4.split(',')[0]) + '&brand=' + (this.searchObj.model4 == '' ? '' : this.searchObj.model4.split(',')[1])  + '&model=' + (this.searchObj.model4 == '' ? '' : this.searchObj.model4.split(',')[2]) + '&serviceUserId=' + this.searchObj.model5.join(',') + '&status=' + this.searchObj.model6.join(',') + '&startDate=' + this.formData.startDate + '&endDate=' + this.formData.endDate">
				<Button type="primary" long icon="ios-cloud-download">导出</Button>
			</a>
			</Col>
			<Col span="21" style="text-align: right;">
				<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" :current="page.current" show-total>
					<slot>
						查询记录：{{ page.total }}条
					</slot>
				</Page>
			</Col>
		</Row>
		<br />
		<Row :gutter="20">
			<Col span="24">
				<h2>订单金额汇总：{{totalPrice | jine}}</h2>
			</Col>
		</Row>
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
	export default {
		components: {
			inquiryTime,
			orderDetail
		},
		data() {
			return {
				loading: false,
				btnLoading: false,
				downLoad:'',
				totalPrice:0,
				searchObj: {
					model2: [],
					model3: [],
					model4: '',
					model5: [],
					model6: [],
					sponsorData: [], //发起方
					repairData: [], //承修方
					carData: [], //车型信息
					serviceData: [] //客服
				},
				orderStatus: [{
					'key': 0,
					'value': '已取消'
				}, {
					'key': 1,
					'value': '客户询价单已生成'
				}, {
					'key': 2,
					'value': '天驶询价单已生成'
				}, {
					'key': 3,
					'value': '已邀请供应商报价'
				}, {
					'key': 4,
					'value': '供应商报价中'
				}, {
					'key': 5,
					'value': '供应商报价已完成'
				}, {
					'key': 6,
					'value': '已选择报价'
				}, {
					'key': 7,
					'value': '订单确认待发货'
				}, {
					'key': 8,
					'value': '订单确认待支付'
				}, {
					'key': 9,
					'value': '支付完毕待发货'
				}, {
					'key': 11,
					'value': '订单核价被打回'
				}, {
					'key': 20,
					'value': '退货审核已发起'
				}, {
					'key': 21,
					'value': '定损员已确认'
				}, {
					'key': 22,
					'value': '待供应商确认'
				}, {
					'key': 23,
					'value': '供应商已确认'
				}, {
					'key': 24,
					'value': '退货已发货'
				}, {
					'key': 25,
					'value': '退货完成'
				}, {
					'key': 26,
					'value': '退款已完成'
				}, {
					'key': 30,
					'value': '供应商备货中'
				}, {
					'key': 31,
					'value': '配送中'
				}, {
					'key': 97,
					'value': '已收货待支付确认'
				}, {
					'key': 98,
					'value': '预订单保存'
				}, {
					'key': 99,
					'value': '订单完成'
				}],
				formData: {
					datetime: '',
					startDate: '',
					endDate: ''
				},
				startDate: '',
				endDate: '',
				page: {
					type: 'XLC',
					total: 0,
					current: 1,
					pageSize: 12,
				},
				val: '',
				data8: []
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
			this.getSponsor();
			this.getRepair();
			this.getCarLine();
			this.getSevice();
			this.getOrder();
		},
		watch: {},
		methods: {
			queryOrder(id) {
				this.$refs.orderDetail.initData(id);
			},
			closedetail() {
				this.btnLoading = true;
				this.getOrder();
			},
			// 查询按钮
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
			//搜索
			getOrder() {
				this.btnLoading = true;
				this.data8 = [];
				fetchPostUrlencoded('/nxp-admin/order/search', {
					'sponsor': this.searchObj.model2.join(','),
					'orgId': this.searchObj.model3.join(','),
					'factory': this.searchObj.model4 == '' ? '' : this.searchObj.model4.split(',')[0],
					'brand': this.searchObj.model4 == '' ? '' : this.searchObj.model4.split(',')[1],
					'model': this.searchObj.model4 == '' ? '' : this.searchObj.model4.split(',')[2],
					'serviceUserId': this.searchObj.model5.join(','),
					'status': this.searchObj.model6.join(','),
					'startDate': this.formData.startDate,
					'endDate': this.formData.endDate,
					'page': this.page.current,
					'size': this.page.pageSize
				}).then((res) => {
					this.btnLoading = false;
					if(res.flag == 0) {
						this.data8 = res.data;
						this.page.total = res.count;
						if(res.totalPrice!=null){
							this.totalPrice = res.totalPrice;
						}else{
							this.totalPrice = 0;
						}
					} else {
						this.$Message.error(res.msg);
					}
				}).catch((res)=>{
					this.btnLoading = false;
					this.$Message.error('网络超时');
				})
			},
			//获取发起方
			getSponsor() {
				fetchGet('/nxp-admin/cusOrganiztion/sponsor').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.searchObj.sponsorData = res.data;
					}
				}).catch(() => {
					this.$Message.error('网络超时');
				});
			},
			//获取承修方
			getRepair() {
				fetchPostUrlencoded('/nxp-admin/cusOrganiztion/allList', {
					'type': 3
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.searchObj.repairData = res.data;
					}
				}).catch(() => {
					this.$Message.error('网络超时');
				});
			},
			//获取车型信息
			getCarLine() {
				fetchGet('/nxp-admin/carLine/all').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.searchObj.carData = res.data;
						for(var i = 0; i < this.searchObj.carData.length; i++) {
							this.searchObj.carData[i]['carNew'] = this.searchObj.carData[i]['factory'] + ',' + this.searchObj.carData[i]['brand'] + ',' + this.searchObj.carData[i]['line'];
						}
					}
				})
			},
			//获取客服
			getSevice() {
				fetchPostUrlencoded("/nxp-admin/serviceUser/getUser", {
					'type': 2
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.searchObj.serviceData = res.data;
					}
				});
			},
			//分页
			changePage(e) {
				this.page.current = e;
				this.getOrder();
			}
		}
	}
</script>

<style>
</style>