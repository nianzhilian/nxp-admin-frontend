<template>
	<div>
		<airx-modal v-model="modal1" :zindex="997" :title="'订单详情： '+orderData.orderNo" @on-close="close">
			<Row>
				<!--
				<Col span="12">
				<h2>订单号：{{orderData.orderNo}}
				</h2>
				<h2 v-if="orderData">发起日期：{{createTime}}</h2>
				</Col>
				-->
				<Col span="24">
				<h2>订单状态：<span style="color: #ed3f14;">{{orderStatus[orderData.status]}}</span>
					<ButtonGroup size="small" shape="circle" style="margin-left: 10px;">
						<Button v-if="orderData.targetSupId > 0">优选供应商</Button>
						<Button v-if="orderData.isAdditional == 1">追加单</Button>
					</ButtonGroup>
				</h2>
				<h2>¥{{price}}</h2>
				</Col>
			</Row>
			<org ref="org"></org>
			<people ref="people"></people>
			<car ref="car"></car>
			<div>
				<h4 class="order-title">订单信息</h4>
				<div class="order-content">
					<Row>
						<Col span="12"> 发起日期： {{createTime}}
						</Col>
						<Col span="12">
						</Col>
					</Row>
				</div>
				<h4 class="order-title">客户信息</h4>
				<div class="order-content">
					<Row>
						<Col span="12"> 订单发起方：
						<Button type="text" size="small" @click="viewOrg(createOrg)">{{createOrgName}}</Button>
						</Col>
						<Col span="12"> 订单送达方：
						<Button type="text" size="small" @click="viewOrg(orderData.xlcId)">{{orderData.xlcFullName}}</Button>
						</Col>
					</Row>
					<br />
					<Row>
						<Col span="12"> 询价人：
						<Button type="text" size="small" @click="viewPeople(orderData.createUserId)">{{orderData.createUserName}} / {{orderData.createUserPhone}}</Button>
						</Col>
						<Col span="12"> 收货人：
						<Button type="text" size="small" @click="viewPeople(orderData.receiverId)">{{orderData.receiverName}} / {{orderData.receiverPhone}}</Button>
						</Col>
					</Row>
					<br />
					<Row>
						<Col span="12"> 维修顾问：
						<Button type="text" size="small" @click="viewPeople(orderData.saId)">{{orderData.saName}} / {{orderData.saPhone}}</Button>
						</Col>
					</Row>
				</div>
				<h4 class="order-title">配件商信息</h4>
				<div class="order-content" v-if="orderData.status > 6">
					<Row>
						<Col span="12">供应商名称：
						<Button type="text" size="small" @click="viewOrg(orderData.supId)">{{orderData.supFullName}}</Button>
						</Col>
						<Col span="12">供应商联络人：
						<Button type="text" size="small" @click="viewPeople(orderData.bjId)">{{orderData.bjName}} / {{orderData.bjPhone}}</Button>
						</Col>
					</Row>
					<br />
					<Row>
						<Col span="12">配件商地址：{{orderData.supAddress}}
						</Col>
					</Row>
					<Row v-if="orderData.targetSupFullName != ''">
						<Col span="12">优选配件商：{{orderData.targetSupFullName}}
						</Col>
					</Row>
				</div>
				<div v-if="orderData.status <= 6">
					<div class="order-content">
						<div style="line-height: 80px; text-align: center; border: #DDDDDD 1px dotted; margin-bottom: 20px; color: #888;">订单未选中配件商</div>
					</div>
				</div>
				<h4 class="order-title">车辆信息</h4>
				<div class="order-content">
					<Row>
						<Col span="24">车型：
							<span v-if="orderData.factory != null&&orderData.factory != undefined&&orderData.factory != ''&&orderData.vehicleType==2">{{ orderData.factory }}-{{ orderData.brand }}-{{ orderData.model }}</span>
							<span v-if="orderData.factory == null||orderData.factory == undefined||orderData.factory == ''&&orderData.vehicleType==2">{{orderData.carNote}}</span>
							<span v-if="orderData.vehicleType==1">{{orderData.vehicleName}}</span>
            </Col>
					</Row>
					<br />
					<Row>
						<Col span="12">车型规格：
						<Button type="text" size="small" @click="viewCar(orderData.liyangId,orderData.vehicleId)">查看</Button>
						</Col>
						<Col span="12">VIN码：{{orderData.vin}}
						</Col>
					</Row>
					<br />
					<Row>
						<Col span="12">车牌号：{{orderData.numberPlates}}
						</Col>
						<Col span="12">备案号：{{orderData.recordCode}}
						</Col>
					</Row>
					<br />
					<Row>
						<Col span="12">报案号：{{orderData.numberReport}}
						</Col>
						<Col span="12">被保险人：{{orderData.insurer}}
						</Col>
					</Row>
				</div>
				<h4 class="order-title">其它信息</h4>
				<div class="order-content">
					<Row>
						<Col span="24">订单备注：{{orderData.remark}}
						</Col>
					</Row>
				</div>
			</div>
			<h4 class="order-title" v-if="serviceOps">客服操作</h4>
			<div class="order-content" v-if="serviceOps">
				<div class="order-op">
					<!--订单操作-->
					<Row :gutter="20">
						<Col span="4" v-if="orderData.status == 1">
						<!--邀请报价-->
						<Button type="success" long @click="inviteQuotatioFun">邀请报价</Button>
						</Col>
						<Col span="4" v-if="orderData.status == 3 || orderData.status == 4">
						<!--修改报价时间-->
						<updateTime ref="updateTime" :orderId="orderData.id"></updateTime>
						</Col>
						<Col span="4" v-if="orderData.status == 5">
						<!--选择中标供应商-->
						<Button type="success" long @click="quotationListFun">选择中标供应商</Button>
						</Col>
						<Col span="4" v-if="orderData.status == 8">
						<!--该客户货到付款-->
						<isCod ref="isCod" :orderId="orderData.id" v-on:closeIsCod="closeIsCod"></isCod>
						</Col>
						<Col span="4" v-if="orderData.status == 11">
						<!--全部打回-->
						<Button type="warning" long @click="backAllFun">重新邀请报价</Button>
						</Col>
						<Col span="4" v-if="orderData.status == 11">
						<!--部分打回-->
						<Button type="warning" long @click="backPartFun">中标供应商重报</Button>
						</Col>
						<Col span="4" v-if="orderData.status == 99">
						<!--订单评价-->
						<Button type="success" long @click="evaluateFun">订单评价</Button>
						</Col>
					</Row>
				</div>
			</div>
			<br />
			<h4 class="order-title">客服主管操作</h4>
			<div class="order-content">
				<div class="order-op">
					<!--订单操作-->
					<Row :gutter="20" v-if="userPower(813)">
						<Col span="24"> 当前分配客服：{{orderData.serviceUserName}}
						<Dropdown trigger="click" style="margin-left:20px">
							<a href="javascript:void(0)">
								切换客服
								<Icon type="arrow-down-b"></Icon>
							</a>
							<DropdownMenu slot="list" style="height: 240px; overflow-y: auto;">
								<a v-for="item in serviceData" style="width: 100%; padding: 5px 10%; display: block;" @click="saveService(orderData.id,item.id,item.name)">{{ item.name }}</a>
							</DropdownMenu>
						</Dropdown>
						</Col>
					</Row>
					<br />
					<Row :gutter="20">
						<Col span="4" v-if="orderData.status == 3 || orderData.status == 4 && userPower(828)">
						<!--终止报价-->
						<abandon :orderId="orderData.id" v-on:on-close="refresh"></abandon>
						</Col>
						<Col span="4" v-if="orderData.status < 99 && orderData.status!= 0 && orderData.status!= 97 && userPower(811)">
						<!--取消订单-->
						<cancelOrder :orderId="orderData.id" v-on:on-close="refresh"></cancelOrder>
						</Col>
					</Row>
				</div>
			</div>
			<br />
			<div class="order-info">
				<Tabs value="name1" :animated="false">
					<TabPane label="询单配件列表" name="name1">
						<inquirySheet :orderId="orderData.id"></inquirySheet>
					</TabPane>
					<TabPane label="成交明细" name="name2">
						<div style="margin: 20px;">支付方式：
							<span v-if="orderData.payType == 0 && orderData.isCod == 1">货到付款</span>
							<span v-if="orderData.payType == 1">月结</span>
							<span v-if="orderData.payType == 0 && orderData.isCod == 0">先款后货</span>
							<span v-if="orderData.payType == 2">保险公司结算</span>
						</div>
						<deal :orderId="orderData.id"></deal>
					</TabPane>
					<TabPane label="报价历史" name="name5">
						<quoteHistory :orderId="orderData.id" ref="quoteHistory"></quoteHistory>
					</TabPane>
					<TabPane label="物流明细" name="name3">
						<logistics :orderId="orderData.id"></logistics>
					</TabPane>
					<TabPane label="退货单" name="name7">
						<returncom :orderId="orderData.id"></returncom>
					</TabPane>
					<TabPane label="换货单" name="name8">
						<changecom :orderId="orderData.id"></changecom>
					</TabPane>
					<TabPane label="订单图片" name="name4">
						<picList :orderId="orderData.id" :picList="orderData.picList"></picList>
					</TabPane>
					<TabPane label="订单日志" name="name6">
						<log :orderId="orderData.id"></log>
					</TabPane>
				</Tabs>
			</div>
			<!--邀请报价-->
			<inviteQuotatio ref="inviteQuotatio" @on-close="closeInviteQuotatio"></inviteQuotatio>
			<!--选择报价-->
			<quotationList ref="quotationList" @on-close="closeQuotationList"></quotationList>
			<!--全部打回-->
			<backAll ref="backAll" :orderId="orderData.id" @on-close="refresh"></backAll>
			<!--部分打回-->
			<backPart ref="backPart" :orderId="orderData.id" @on-close="refresh"></backPart>
			<!--订单评价-->
			<evaluate ref="evaluate" @on-close="refresh"></evaluate>
		</airx-modal>
		<Modal width="480" v-model="carDetailVisible" title="车型规格">
			<carDetail v-if="carDetailVisible" :data="carDetailData"></carDetail>
			<div slot="footer"></div>
		</Modal>
	</div>
</template>

<script>
	import { fetchPostJson,fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../utils/requestHttp.js'

	import { getLocalTime, dateTrans, splitK,logHttp } from '../utils/common.js'

	import { userPower } from '../utils/common.js'

	import inquirySheet from './com/inquirySheet'
	import deal from './com/deal'
	import logistics from './com/logistics'
	import returncom from './com/returncom'
	import changecom from './com/changecom'
	import log from './com/log'
	import picList from './com/picList'
	import quoteHistory from './com/quoteHistory'

	import inviteQuotatio from './com/service/inviteQuotation'
	import quotationList from './com/service/quotationList'
	import updateTime from './com/service/updateTime'
	import isCod from './com/service/isCod'
	import abandon from './com/service/abandon'
	import cancelOrder from './com/service/cancelOrder'
	import backPart from './com/service/backPart'
	import backAll from './com/service/backAll'
	import evaluate from './com/service/evaluate'

	import org from './com/popup/org'
	import people from './com/popup/people'
	import car from './com/popup/car'
	import carDetail from './com/popup/jyCar'

	export default {
		components: {
			inquirySheet,
			logistics,
			deal,
			returncom,
			changecom,
			picList,
			log,
			inviteQuotatio,
			quotationList,
			updateTime,
			isCod,
			abandon,
			cancelOrder,
			backPart,
			backAll,
			evaluate,
			quoteHistory,
			org,
			people,
			car,
			carDetail
		},
		data() {
			return {
				carDetailData:'',
				carDetailVisible:false,
				modal1: false,
				orderData: {},
				serviceData: [],
				changeService: '',
				visible: false,
				orderStatus: {
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
					97: '已收货待支付确认',
					98: '预订单保存',
					99: '订单完成'
				},
			}
		},
		watch:{
			modal1(val){
				if(val){
							// if(this.$store.state.sourceInfo.tempPath == '/logistics/inquiries'){
							// 	this.$store.commit('setSourceInfo', {
							// 		sourceUri: this.$store.state.sourceInfo.sourceUri,
							// 		currentUri: '/logistics/orderDetail',
							// 		tempPath:this.$store.state.sourceInfo.tempPath
							// 	});
							// }else if (this.$store.state.sourceInfo.tempPath == '/dataOps/vehicleOps') {
							// 	this.$store.commit('setSourceInfo', {
							// 		sourceUri: this.$store.state.sourceInfo.sourceUri,
							// 		currentUri: '/dataOps/vehicleOps/orderDetail',
							// 		tempPath:this.$store.state.sourceInfo.tempPath
							// 	});
							// }else if (this.$store.state.sourceInfo.tempPath == '/exceptionalOrders/index') {
							// 	this.$store.commit('setSourceInfo', {
							// 		sourceUri: this.$store.state.sourceInfo.sourceUri,
							// 		currentUri: '/exceptionalOrders/orderDetail',
							// 		tempPath:this.$store.state.sourceInfo.tempPath
							// 	});
							// }else if (this.$store.state.sourceInfo.tempPath == '/service/index') {
							// 	this.$store.commit('setSourceInfo', {
							// 		sourceUri: this.$store.state.sourceInfo.sourceUri,
							// 		currentUri: '/service/orderDetail',
							// 		tempPath:this.$store.state.sourceInfo.tempPath
							// 	});
							// }
								this.$store.commit('setSourceInfo', {
									sourceUri: this.$store.state.sourceInfo.sourceUri,
									currentUri: '/orderList/orderDetail',
									tempPath:this.$store.state.sourceInfo.tempPath
								});
							logHttp(this.$store.state.sourceInfo,'订单详细',fetchPostUrlencoded);
				}
			}
		},
		computed: {
			createTime() {
				let obj = '';
				if(JSON.stringify(this.orderData) != '{}') obj = this.orderData.createTime.time;
				return dateTrans(obj)
			},
			price() {
				let obj = '';
				if(JSON.stringify(this.orderData) != '{}') obj = this.orderData.price;
				return splitK(obj)
			},
			createOrg() {
				let obj = '';
				if(JSON.stringify(this.orderData) != '{}') {
					if(this.orderData.orgFullName != undefined) {
						return this.orderData.orgId
					} else {
						return this.orderData.xlcId
					}
				}
			},
			createOrgName() {
				let obj = '';
				if(JSON.stringify(this.orderData) != '{}') {
					if(this.orderData.orgFullName != undefined) {
						return this.orderData.orgFullName
					} else {
						return this.orderData.xlcFullName
					}
				}
			},
			serviceOps() {
				let _self = this;
				let userInfo = JSON.parse(window.localStorage['user'])['userInfo'];
				if(_self.orderData.serviceUserId == userInfo.id) {
					return true;
				} else {
					return false;
				}
			},
		},
		methods: {
			userPower(code) {
				let re = false;
				for (var i in arguments) {
					if(userPower(arguments[i])) {
						re = true;
						break;
					}
				}
				return re;
			},
			handleOpen() {
				this.visible = true;
			},
			handleClose() {
				this.visible = false;
			},
			initData(id) {
				var _self = this;
				_self.modal1 = true;
				_self.orderData = {};
				fetchGet('/nxp-admin/order/info/' + id).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						_self.orderData = res.data;
					}
				});
				_self.getService();
			},
			refresh() {
				this.initData(this.orderData.id);
			},
			close() {
				this.modal1 = false;
				this.$emit("closedetail");
			},
			getService() {
				var _self = this;
				fetchPostUrlencoded('/nxp-admin/serviceUser/getUser', {
					type: 2
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						//this.$Message.success(res.msg);
						_self.serviceData = res.data;
					}
				});
			},
			saveService(id, user, username) {
				var _self = this;
				if(!user) {
					_self.$Message.warning('没有选中要切换的客服');
				} else {
					_self.$Modal.confirm({
						title: '提示',
						content: '<p>点击确定将修改订单的客服为：' + username + '</p>',
						onOk: () => {
							fetchPostUrlencoded('/nxp-admin/order/changeService', {
								orderId: id,
								userId: user
							}).then((res) => {
								if(res.flag !== 0) {
									_self.$Message.error(res.msg);
								} else {
									_self.$Message.success(res.msg);
									_self.initData(id);
									_self.changeService = '';
								}
							});
						},
						onCancel: () => {}
					});
				}
			},
			viewOrg(id) {
				this.$refs.org.initData(id);
			},
			viewPeople(id) {
				this.$refs.people.initData(id);
			},
			viewCar(liyangId,vehicleId) {
				if(this.orderData.vehicleType=='2'){
					this.$refs.car.initData(liyangId);
				}else if(this.orderData.vehicleType=='1'){
					fetchPostJson('/nxp-admin/sup/carInfo?_=' + Math.random(), {
						vehicleId: vehicleId,
					}).then((res) => {
						if(res.flag=='0'){
							this.carDetailData = res.data;
							this.carDetailVisible = true;
						}
					});
				}
			},
			inviteQuotatioFun() {
				this.$refs.inviteQuotatio.initData(this.orderData.id,this.orderData.vehicleType);
			},
			closeInviteQuotatio() {
				this.initData(this.orderData.id);
			},
			quotationListFun() {
				this.$refs.quotationList.initData(this.orderData.id);
			},
			closeQuotationList() {
				this.initData(this.orderData.id);
			},
			closecancenorder() {
				this.initData(this.orderData.id);
			},
			closeIsCod() {
				this.initData(this.orderData.id);
			},
			backAllFun() {
				this.$refs.backAll.initData(this.orderData.id);
			},
			backPartFun() {
				this.$refs.backPart.initData(this.orderData.id);
			},
			evaluateFun() {
				this.$refs.evaluate.initData(this.orderData.id);
			},
		}
	}
</script>

<style scoped>
	/*
	.order-detail-mask {
		background: rgba(0, 0, 0, 0.25);
		z-index: 100;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.order-detail-box {
		background: #FFF;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
		border-radius: 5px;
		z-index: 101;
		position: fixed;
		top: 5%;
		left: 5%;
		width: 90%;
		height: 90%;
		padding: 20px;
	}

	.order-detail-content {
		overflow-y: scroll;
		height: 100%;
	}

	.order-detail-close {
		position: absolute;
		top: 20px;
		right: 20px;
	}

	.order-info {
		border: #DDD 1px solid;
	}

	.order-piclist li {
		float: left;
		width: 16%;
		margin: 2%;
	}

	.order-piclist li img {
		display: block;
		width: 100%;
	}

	.text-content ul {
		overflow: hidden;
	}

	.text-content ul li {
		float: left;
		margin: 0 20px 10px 0;
	}

	.order-op {
		width: 90%;
	}

	.has-nothing {
		line-height: 80px;
		padding: 80px 0;
		text-align: center;
		color: #ddd;
		border: #ddd 1px dotted;
		background: #fefefe;
	}
	*/

	.order-title {
		margin: 20px 0 20px 0;
		padding: 0 10px;
		border: #EEEEEE 1px solid;
		background: #f9f9f9;
		line-height: 30px;
		border-radius: 5px;
	}

	.order-content {
		padding: 10px;
	}

	.order-info {
		border: #DDD 1px solid;
	}

	.order-info .text-content ul {
		overflow: hidden;
		clear: both;
	}

	.order-info .text-content ul li {
		float: left;
		line-height: 30px;
		margin-right: 20px;
	}

	.ivu-tabs,
	.ivu-row,
	.ivu-col {
		position: static;
	}
</style>
