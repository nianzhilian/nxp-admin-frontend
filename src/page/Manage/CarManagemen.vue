<template>
	<div class="example-case">
		<Tabs :animated="false" @on-click="tag">
			<Tab-pane label="力洋车型库" value="1"></Tab-pane>
			<Tab-pane label="自定义车型库" value="2"></Tab-pane>
			<Tab-pane label="车型备注订单" value="3"></Tab-pane>
		</Tabs>
		<Row style="margin-bottom: 18px;">
			<Button type="primary" v-if="statu==2" @click="quickAdd()">+&nbsp;新增车型</Button>
			<span v-if="statu==3">下单时间&nbsp;&nbsp;&nbsp; 
				<Button type="ghost" shape="circle" icon="arrow-up-b" size="small" v-bind:class="{isCheck:sort == 'asc'}" @click="orderAsc"></Button>&nbsp;&nbsp;
				<Button type="ghost" shape="circle" icon="arrow-down-b" size="small" v-bind:class="{isCheck:sort == 'desc'}"  @click="orderDesc"></Button>
				</span>
			<span style="float: right;"><input v-model="val" v-on:keyup.13="searchObj"   class="i-input" placeholder="请输入车型或车型备注检索">&nbsp;&nbsp;<Button type="ghost" @click="searchObj" icon="ios-search">搜索</Button></span>
		</Row>
		<Row style="margin-bottom: 18px;" v-if="statu==2">
			<span  >最后添加时间</span>&nbsp;&nbsp;&nbsp;
			<Button type="ghost" shape="circle" icon="arrow-up-b" size="small" @click="ascBtn" v-bind:class="{isCheck:sort == 'asc'}"></Button>&nbsp;&nbsp;
			<Button type="ghost" shape="circle" icon="arrow-down-b" size="small" @click="descBtn" v-bind:class="{isCheck:sort == 'desc'}"></Button>
			</span>
		</Row>
		<Alert banner type="warning" v-if="statu == 1 &&　liyangCarData.length <=0 " style="text-align: center;color:#66C1E0">通知：请输入车型搜索。。。</Alert>
		<div class="ivu-table-wrapper" style="margin-bottom: 25px;">
			<div class="ivu-table-tab ivu-table-border" style="text-align: right;">
				<table border="0" cellspacing="0" cellpadding="0" style="width:100% ;line-height: 36px;font-size: 12px;" v-if="statu == 1 || statu == 2">
					<tr>
						<th width='50'>#</th>
						<th>厂商</th>
						<th>品牌</th>
						<th>车系</th>
						<th>车型</th>
						<th>年款</th>
						<th>销售名称</th>
						<th>最后添加时间</th>
						<th>操作</th>
					</tr>
					<tr v-for="(val,index) in liyangCarData">
						<td>{{pageSize * (current ==1 ? 0 : (current-1)) + index+1}}</td>
						<td>{{val.changJia}}</td>
						<td>{{val.pinPai}}</td>
						<td>{{val.cheXi}}</td>
						<td>{{val.cheXing}}</td>
						<td>{{val.nianKuan}}</td>
						<td>{{val.xiaoShouName}}</td>
						<td>{{val.ssLastDu}}</td>
						<td>
							<span class='shou' v-if="statu==2 &&　val.status == 0" @click="disab(val.levelId,val.status)">禁用&nbsp;</span>
							<span class='shou' v-if="statu==2 &&　val.status == 1" @click="disab(val.levelId,val.status)">启用&nbsp;</span>
							<span class='shou' v-if="statu==2" @click="EditCar(val.levelId)">编辑&nbsp;</span>
							<span class='shou' v-if="statu==1" @click="look(val.levelId)">查看</span>
						</td>
					</tr>
				</table>
				<table border="0" cellspacing="0" cellpadding="0" style="width:100% ;line-height: 36px;font-size: 12px;" v-if="statu == 3">
					<tr>
						<th width='50'>
							<Checkbox v-model='checked' @click="check">{{indeterminate}}</Checkbox>
						</th>
						<th>订单号</th>
						<th>下单方</th>
						<th>配送方</th>
						<th>车型</th>
						<th>车型备注</th>
						<th>下单时间</th>
						<th>订单金额</th>
						<th>操作</th>
					</tr>
					<tr v-for="(val,index) in orderRemarkData">
						<td>{{pageSize * (current ==1 ? 0 : (current-1)) + index+1}}</td>
						<td>{{val.orderNo}}</td>
						<td>{{val.orgFullName}}</td>
						<td>{{val.xlcFullName}}</td>
						<td>
								<span v-if="val.factory != null&&val.factory != undefined&&val.factory != ''&&val.vehicleType==2">{{ val.factory }}-{{ val.brand }}-{{ val.model }}</span>
								<span v-if="val.factory == null||val.factory == undefined||val.factory == ''&&val.vehicleType==2">--</span>
								<span v-if="val.vehicleType==1">{{val.vehicleName}}</span>
						</td>
						<td>{{val.carNote}}</td>
						<td>{{new Date(val.createTime).toLocaleString()}} </td>
						<td>{{val.price}}</td>
						<td>
							<span class='shou' @click="queryOrder(val.id)">查看订单&nbsp;</span>
							<span class='shou' @click="quickAdd(val.id);">快速添加车型&nbsp;</span>
							<span class='shou' @click="updaCarRemark(val.id,val.liyangid);">修改车型备注&nbsp;</span>
							<span class='shou' @click="quickAddCar(val.id,val.liyangid);">编辑车型</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<Page :total="total" :page-size="pageSize" @on-change="change" show-total :current="current" style="float: right;"></Page>
		<Modal title="车型规格" width="820" v-model="carFormatView" ok-text='关闭' cancel-text='' :mask-closable="false" :closable="false">
			<CarFormat type="carFormat" :id="id"></CarFormat>
		</Modal>
		<Modal title="新增车型" width="820" ok-text='关闭' cancel-text='' v-model="addCarView" :mask-closable="false" :closable="false">
			<addCar type="carOrder" :quickId='quickId' :timeId='timeId'></addCar>
		</Modal>
		<Modal title="自定义车型修改" ok-text='关闭' cancel-text='' width="820" v-model="CustomCarModifiView" :mask-closable="false" :closable="false">
			<CustomCarModifi type="carOrder" :liyangId="liyangId"></CustomCarModifi>
		</Modal>
		<Modal title="修改车型备注" width="820" ok-text='关闭' cancel-text='' v-model="updateCarFormatView" :mask-closable="false" :closable="false">
			<UpdateCarFormat type="updateCarFormat" :carRemarkId="carRemarkId"></UpdateCarFormat>
		</Modal>
		<Modal title="编辑车型" width="820" ok-text='关闭' cancel-text='' v-model="quickAddCarView" :mask-closable="false" :closable="false">
			<QuickAddCar type="quickAddCar" :quickAddCarId='quickAddCarId' :liyang="levelId"></QuickAddCar>
		</Modal>
		<Modal title="" width="1200" cancel-text='' ok-text='关闭' v-model="OrderDetailView" :styles="{top: '20px'}" :mask-closable="false" :closable="false">
			<OrderDetail type="updateCarFormat" :getInfo="getInfo" :getDeal='getDeal' :createTime='createTime' :totalManagePrice='totalManagePrice' :totalPrice='totalPrice'></OrderDetail>
		</Modal>
	</div>
</template>
<script>
	import addCar from '../Manage/addCar'
	import CarFormat from '../Manage/CarFormat'
	import UpdateCarFormat from '../Manage/UpdateCarFormat'
	import CustomCarModifi from '../Manage/CustomCarModifi'
	import OrderDetail from '../Manage/OrderDetail'
	import QuickAddCar from '../Manage/QuickAddCar'
	export default {
		components: {
			addCar,
			CarFormat,
			UpdateCarFormat,
			CustomCarModifi,
			OrderDetail,
			QuickAddCar
		},
		data() {
			return {
				type: 1,
				statu: 1,
				addCarView: false,
				carFormatView: false,
				updateCarView: false,
				updateCarFormatView: false,
				CustomCarModifiView: false,
				OrderDetailView: false,
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
				createTime:"",
				query: '',
				sort :'desc',
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
				pageSize: 30
			}
		},
		created() {
			this.getCookie();
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
				} else {

				}
				var timestamp = Date.parse(new Date()) / 1000;
				this.timeId = timestamp;
				this.addCarView = true;
			},
			//车型备注 ============获取车型备注订单
			getOrderRemark: function() {
				var self = this;
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
			},
			// 获取备注订单
			check() {
				if(this.checked == true) {
					this.val = '';
					this.query = '';
					this.current = 1;
					this.judg = 1;
					this.getOrderRemark();
				} else {
					this.val = '';
					this.query = '';
					this.current = 1;
					this.judg = 0;
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
				this.id = id;
				this.carFormatView = true;
			},
			viewOrder(index) {
				this.addCarView = !this.addCarView;
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
						self.judg = 1;
						self.getOrderRemark();
					} else {
						self.judg = 0;
						self.current = 1;
						self.getOrderRemark();
					}

				}
			},
			//查看订单
			viewOrderDetail(index) {
				this.OrderDetailView = !this.OrderDetailView;
			},
			queryOrder(orderId) {
				var self = this;
				self.totalManagePrice = 0;
				self.totalPrice = 0;
				self.OrderDetailView = true;
				self.$http({
					url: '/nxp-admin/order/info/' + orderId,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.getInfo = res.data.data;
						self.createTime = res.data.data.createTime.time;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
				self.$http({
					url: '/nxp-admin/order/deal/' + orderId,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.getDeal = res.data.data;
						if(self.getDeal.length > 0) {
							for(var i = 0; i < self.getDeal.length; i++) {
								if(self.getDeal[i]['manageCost'] != null && 　self.getDeal[i]['manageCost'] != '') {
									self.totalManagePrice += parseFloat(self.getDeal[i]['manageCost']);
								} else {
									self.getDeal[i]['manageCost'] = 0;
									self.totalManagePrice += parseFloat(self.getDeal[i]['manageCost']);
								}
								if(self.getDeal[i]['amount'] != '' && self.getDeal[i]['amount'] != null) {
									self.totalPrice += parseFloat(self.getDeal[i]['amount']);
								} else {
									self.getDeal[i]['amount'] = 0;
									self.totalPrice += parseFloat(self.getDeal[i]['amount']);
								}
								if(self.getDeal[i]['cycle'] == 'N') {
									self.getDeal[i]['cycName'] = '否';
								} else {
									self.getDeal[i]['cycName'] = '是';
								}
							}
						} else {
							self.totalPrice = 0;
							self.totalManagePrice = 0;
						}
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			//车型备注订单升序降 序
			orderAsc() {
				this.current = 1;
				var self = this;
				self.sort = 'asc';
				this.getOrderRemark();
			},
			orderDesc() {
				this.current = 1;
				var self = this;
				self.sort = 'desc';
				this.getOrderRemark();
			},
			//车型规格
			viewFormat(index) {
				this.carFormatView = !this.carFormatView;
			},
			//修改车型备注
			viewUpdateCarFormat(index) {
				this.updateCarFormatView = !this.updateCarFormatView;
			},
			updaCarRemark(id) {
				this.updateCarFormatView = true;
				this.carRemarkId = id;
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
						alert(res.data.msg);
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
			getCookie() {
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			}
		}
	}
</script>
<style>
	.isCheck {
		background:#CCCCCC  !important;
		/*border:1px solid #0000FF !important;*/
	}
	.shou {
		cursor: pointer;
	}
	
	.shou:hover {
		color: blue;
	}
	.i-input {
	    display: inline-block;
	    width: 180;
	    height: 32px;
	    line-height:32px;
	    padding: 3px 7px;
	    font-size: 12px;
	    border: 1px solid #dddee1;
	    border-radius: 4px;
	    color: #495060;
	    background-color: #fff;
	    background-image: none;
	    position: relative;
	    cursor: text;
	    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
	}
</style>