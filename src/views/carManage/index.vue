<template>
	<div class="example-case">
		<div class="air-title h3">车型管理</div>
		<orderDetail ref="orderDetail" v-on:closedetail="closedetail"></orderDetail>
		<Tabs :animated="false" @on-click="tag">
			<Tab-pane label="力洋车型库" value="1"></Tab-pane>
			<Tab-pane label="自定义车型库" value="2"></Tab-pane>
			<Tab-pane label="车型备注订单" value="3"></Tab-pane>
		</Tabs>
		<Row>
			<Col span="12">
			<span v-if="statu==1">&nbsp;</span>
			<Button type="primary" icon="plus-round" v-if="statu==2" @click="quickAdd()">新增自定义车型</Button>
			<div v-if="statu==3">
				<i-switch v-model="judg" @on-change="check" style="margin-right: 10px;"></i-switch>仅显示未匹配过车型的订单
			</div>
			</Col>
			<Col span="12">
			<span style="float: right;">
					<Input v-model="val" placeholder="请输入车型或车型备注检索" @on-enter="searchObj" style="width: 300px"></Input>
					<Button type="ghost" @click="searchObj" icon="ios-search">搜索</Button>
				</span>
			</Col>
		</Row>
		<div v-if="statu == 1">
			<br />
			<Row>
				<Col span="24">
				<Alert banner type="warning">通知：请输入车型搜索</Alert>
				</Col>
			</Row>
		</div>
		<div v-if="statu==2">
			<br />
			<Row>
				<Col span="24">
				<ButtonGroup style="float: right;">
					<Button :type="sort == 'asc'?'primary':'ghost'" icon="arrow-up-b" @click="ascBtn">添加时间升序排列</Button>
					<Button :type="sort == 'desc'?'primary':'ghost'" icon="arrow-down-b" @click="descBtn">添加时间降序排列</Button>
				</ButtonGroup>
				</Col>
			</Row>
		</div>
		<div v-if="statu==3">
			<br />
			<Row>
				<Col span="24">
				<ButtonGroup style="float: right;">
					<Button :type="sort == 'asc'?'primary':'ghost'" icon="arrow-up-b" @click="orderAsc">下单时间升序排列</Button>
					<Button :type="sort == 'desc'?'primary':'ghost'" icon="arrow-down-b" @click="orderDesc">下单时间降序排列</Button>
				</ButtonGroup>
				</Col>
			</Row>
		</div>
		<br />
		<Table border :columns="columns1" :data="liyangCarData" v-if="statu == 1 || statu == 2"></Table>
		<Table border :columns="columns2" :data="orderRemarkData" v-if="statu == 3"></Table>
		<br />
		<Row>
			<Col span="24">
			<Page :total="total" :page-size="pageSize" @on-change="change" show-total :current="current" style="float: right;"></Page>
			</Col>
		</Row>

		<car ref="car"></car>

		<airx-modal v-model="addCarView" :zindex=998 title="新增车型" @on-close="closedetail">
			<addCar type="carOrder" :quickId='quickId' :timeId='timeId' @on-close="addCarView = false"></addCar>
		</airx-modal>

		<airx-modal v-model="CustomCarModifiView" :zindex=998 title="自定义车型修改" @on-close="closedetail">
			<CustomCarModifi type="carOrder" :liyangId="liyangId" @on-close="CustomCarModifiView = false"></CustomCarModifi>
		</airx-modal>

		<airx-modal v-model="updateCarFormatView" :zindex=998 title="修改车型备注" @on-close="closedetail">
			<UpdateCarFormat type="updateCarFormat" :carRemarkId="carRemarkId" @on-close="updateCarFormatView = false"></UpdateCarFormat>
		</airx-modal>

		<airx-modal v-model="quickAddCarView" :zindex=998 title="编辑车型" @on-close="closedetail">
			<QuickAddCar type="quickAddCar" :quickAddCarId='quickAddCarId' :liyang="levelId" @on-close="quickAddCarView = false"></QuickAddCar>
		</airx-modal>
	</div>
</template>
<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'
	import {logHttp} from '../../utils/common.js'
	import addCar from './components/addCar'
	import CarFormat from './components/CarFormat'
	import UpdateCarFormat from './components/UpdateCarFormat'
	import CustomCarModifi from './components/CustomCarModifi'
	import OrderDetail from './components/OrderDetail'
	import QuickAddCar from './components/QuickAddCar'

	import orderDetail from '../../airxComponents/orderDetail'

	import car from '../../airxComponents/com/popup/car'

	export default {
		components: {
			addCar,
			CarFormat,
			UpdateCarFormat,
			CustomCarModifi,
			OrderDetail,
			QuickAddCar,
			orderDetail,
			car,
		},
		data() {
			return {
				columns1: [{
						title: '状态',
						width: 60,
						align: 'center',
						render: (h, params) => {
							if(params.row.status == 0) {
								return h('span', {
									style: {
										background: '#19be6b',
										overflow: 'hidden',
										color: '#19be6b',
										width: '10px',
										height: '10px',
										display: 'inline-block',
										'border-radius': '100px'
									}
								}, 'ok')
							} else {
								return h('span', {
									style: {
										background: '#ed3f14',
										overflow: 'hidden',
										color: '#ed3f14',
										width: '10px',
										height: '10px',
										display: 'inline-block',
										'border-radius': '100px'
									}
								}, 'no')
							}
						}
					},{
						title: '#',
						width: 80,
						render: (h, params) => {
							return h('div', [h('span', {}, (this.current - 1) * this.pageSize + params.index + 1)]);
						}
					},
					{
						title: '厂商',
						key: 'changJia'
					},
					{
						title: '品牌',
						key: 'pinPai'
					},
					{
						title: '车系',
						key: 'cheXi'
					},
					{
						title: '车型',
						key: 'cheXing'
					},
					{
						title: '年款',
						key: 'nianKuan'
					},
					{
						title: '销售名称',
						key: 'xiaoShouName'
					},
					{
						title: '最后添加时间',
						key: 'ssLastDu'
					},
					{
						title: '操作',
						width: 120,
						render: (h, params) => {
							if(this.statu == 1) {
								return h('div', [
									h('Button', {
										props: {
											type: 'text'
										},
										on: {
											click: () => {
												this.look(params.row.levelId)
											}
										}
									}, '查看')
								]);
							}
							if(this.statu == 2) {
								if(params.row.status == 0) {
									return h('div', [
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.disab(params.row.levelId, params.row.status)
												}
											}
										}, '禁用'),
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.EditCar(params.row.levelId)
												}
											}
										}, '编辑')
									]);
								} else {
									return h('div', [
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.disab(params.row.levelId, params.row.status)
												}
											}
										}, '启用'),
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.EditCar(params.row.levelId)
												}
											}
										}, '编辑')
									]);
								}
							}
						}
					}
				],
				columns2: [{
						title: '#',
						width: 80,
						render: (h, params) => {
							return h('div', [h('span', {}, (this.current - 1) * this.pageSize + params.index + 1)]);
						}
					},
					{
						title: '订单号',
						key: 'orderNo'
					},
					{
						title: '下单方',
						key: 'orgFullName'
					},
					{
						title: '配送方',
						key: 'xlcFullName'
					},
					{
						title: '车型',
						width: 200,
						render: (h, params) => {
							if((params.row.factory == '' || params.row.factory == null || params.row.factory == undefined)&&params.row.vehicleType==2) {
								return h('span','--');
							}else if(params.row.factory != '' && params.row.factory != null && params.row.factory != undefined&&params.row.vehicleType==2) {
								return h('span', params.row.factory + ' - ' + params.row.brand + ' - ' + params.row.model + ' - ' + params.row.year + ' - ' + params.row.saleName);
							}else if(params.row.vehicleType==1){
								return h('span', res.vehicleName);
							}
						}
					},
					{
						title: '车型备注',
						key: 'carNote'
					},
					{
						title: '下单时间',
						key: 'createTime',
						width: 200,
						render: (h, params) => {
							return h('div', [h('span', {}, new Date(params.row.createTime).toLocaleString())]);
						}
					},
					{
						title: '订单金额',
						key: 'price'
					},
					{
						title: '操作',
						width: 240,
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text'
									},
									on: {
										click: () => {
											this.queryOrder(params.row.id)
										}
									}
								}, '查看订单'),
								h('Button', {
									props: {
										type: 'text'
									},
									on: {
										click: () => {
											this.quickAdd(params.row.id)
										}
									}
								}, '快速添加车型'),
								h('Button', {
									props: {
										type: 'text'
									},
									on: {
										click: () => {
											this.updaCarRemark(params.row.id,params.row.liyangid)
										}
									}
								}, '修改车型备注'),
								h('Button', {
									props: {
										type: 'text'
									},
									on: {
										click: () => {
											this.quickAddCar(params.row.id,params.row.liyangid)
										}
									}
								}, '编辑车型')
							]);
						}
					}
					/*
					<span class='shou' @click="queryOrder(val.id)">查看订单&nbsp;</span>
					<span class='shou' @click="quickAdd(val.id);">快速添加车型&nbsp;</span>
					<span class='shou' @click="updaCarRemark(val.id,val.liyangid);">修改车型备注&nbsp;</span>
					<span class='shou' @click="quickAddCar(val.id,val.liyangid);">编辑车型</span>
					*/
				],
				user: '',
				type: 1,
				statu: 1,
				addCarView: false,
				updateCarView: false,
				updateCarFormatView: false,
				CustomCarModifiView: false,
				quickAddCarView: false,
				quickAddCarId: '',
				liyangCarData: [],
				orderRemarkData: [],
				liyangId: '', //力洋ID
				levelId: '',
				carRemarkId: '', //修改车型备注
				orderId: '', //订单详情的id
				orgId: '',
				id: '', //车型规格
				createTime: "",
				query: '',
				sort: 'desc',
				quickId: "",
				timeId: '',
				judg: 1,
				getInfo: {},
				getDeal: [],
				totalManagePrice: 0,
				totalPrice: 0,
				checked: true,
				// 初始页当前页码
				current: 1,
				// 每页显示条数长度
				pageSize: 30,
				total: 0,
				val: '',
				judg: true
			}
		},
		created() {
			this.user = JSON.parse(localStorage.getItem('user'));
		},
		mounted(){
			logHttp(this.$store.state.sourceInfo,'车型管理',fetchPostUrlencoded);
		},
		watch: {
			liyangId: 'EditCar',
			id: 'look',
			updateCarFormatView: 'getOrderRemark',
			CustomCarModifiView: 'getLiyang',
			checked: "check",
			addCarView: 'getLiyang',
		},
		methods: {
			//快速添加车型
			quickAdd(id) {
				if(id != undefined && id != null && id != '') {
					this.quickId = id;
				}
				var timestamp = Date.parse(new Date()) / 1000;
				this.timeId = timestamp;
				this.addCarView = true;
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/dataOps/vehicleOps/addUserCarModel',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'新增自定义车型',fetchPostUrlencoded);
			},
			//车型备注 ============获取车型备注订单
			getOrderRemark: function() {
				var self = this;
				fetchPostUrlencoded('/nxp-admin/order/queryCar', {
					key: self.query,
					sort: self.sort,
					judge: self.judg ? '1' : '0',
					page: self.current,
					size: self.pageSize
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						self.orderRemarkData = res.data;
						self.total = res.data.count;
					}
				});
				/*
				self.$http({
					url: '/nxp-admin/order/queryCar',
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					params: {
						key: self.query,
						sort: self.sort,
						judge: self.judg,
						page: self.current,
						size: self.pageSize
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.orderRemarkData = res.data.data;
						self.total = res.data.count;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
				*/
			},
			// 获取备注订单
			check() {
				if(this.checked == true) {
					this.val = '';
					this.query = '';
					this.current = 1;
					this.getOrderRemark();
				} else {
					this.val = '';
					this.query = '';
					this.current = 1;
					this.getOrderRemark();
				}
			},
			//编辑车型
			viewquickAddCar(index) {
				this.quickAddCarView = !this.quickAddCarView;
			},
			//车型备注订单 编辑车型
			quickAddCar(id, levelId) {
				this.quickAddCarId = id;
				this.levelId = levelId;
				this.quickAddCarView = true;
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/dataOps/vehicleOps/editCarModel',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'编辑车型',fetchPostUrlencoded);
			},
			//获取力洋车型库
			getLiyang() {
				var self = this;
				self.$http({
					url: '/nxp-admin/liYang/list/' + self.type,
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					params: {
						key: self.query,
						sort: self.sort,
						page: self.current,
						size: self.pageSize
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.liyangCarData = res.data.data;
						self.total = res.data.count;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			//力洋车型库查看车型规格
			look(id) {
				this.$refs.car.initData(id);
			},
			//分页
			change: function(page, current) {
				this.current = page;
				if(this.statu == 1) {
					this.getLiyang();
				} else if(this.statu == 2) {
					this.getLiyang();
				} else {
					this.getOrderRemark();
				}
			},
			//自定义车型库升序降 序
			ascBtn() {
				this.current = 1;
				var self = this;
				self.sort = 'asc';
				this.getLiyang();
			},
			descBtn() {
				this.current = 1;
				var self = this;
				self.sort = 'desc';
				this.getLiyang();
			},
			//搜索
			searchObj() {
				var self = this;
				self.query = this.val;
				self.statu = this.statu;
				if(self.statu == 1) {
					self.current = 1;
					self.statu = 1;
					self.total = 0;
					self.liyangCarData = [];
					self.getLiyang();
				} else if(self.statu == 2) {
					self.getLiyang();
				} else {
					if(this.checked == true) {
						self.current = 1;
						self.getOrderRemark();
					} else {
						self.current = 1;
						self.getOrderRemark();
					}

				}
			},
			queryOrder(id) {
				this.$refs.orderDetail.initData(id);
			},
			//车型备注订单升序降 序
			orderAsc() {
				this.current = 1;
				this.sort = 'asc';
				this.getOrderRemark();
			},
			orderDesc() {
				this.current = 1;
				this.sort = 'desc';
				this.getOrderRemark();
			},
			//修改车型备注
			viewUpdateCarFormat(index) {
				this.updateCarFormatView = !this.updateCarFormatView;
			},
			updaCarRemark(id) {
				this.updateCarFormatView = true;
				this.carRemarkId = id;
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/dataOps/vehicleOps/updateCarMark',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'修改车型备注',fetchPostUrlencoded);
			},
			//禁用
			disab: function(liyangId, status) {
				var self = this;
				self.$http({
					url: '/nxp-admin/liYang/disable/' + liyangId,
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					params: {
						status: status == 0 ? 1 : 0
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.$Message.success(res.data.msg);
						self.getLiyang();
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			//自定义编辑车型
			EditCar(id) {
				this.liyangId = id;
				this.CustomCarModifiView = true;
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/dataOps/vehicleOps/editUserCarModel',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'编辑自定义车型',fetchPostUrlencoded);
			},
			//页签切换
			tag: function(name) {
				var self = this;
				self.val = '';
				self.query = '';
				self.type = parseInt(name + 1);
				self.current = 1;
				if(self.type == 3) {
					this.quickId = '';
					this.sort = 'desc';
					self.statu = 3;
					self.getOrderRemark();
				} else if(self.type == 2) {
					this.sort = 'desc';
					this.quickId = '';
					self.statu = 2;
					self.getLiyang();
				} else {
					this.quickId = '';
					self.current = 1;
					self.statu = 1;
					self.total = 0;
					self.liyangCarData = [];
				}
			},
			closedetail() {
				this.searchObj();
			}
		}
	}
</script>
<style></style>
