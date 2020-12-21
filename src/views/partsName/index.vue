<template>
	<div class="example-case">
		<div class="air-title h3">配件名称管理</div>
		<Tabs :animated="false" @on-click="tag">
			<Tab-pane label="标准名称库" name="1"></Tab-pane>
			<Tab-pane label="自定义配件名称" name="2"></Tab-pane>
			<Tab-pane label="异常配件名称处理" name="3"></Tab-pane>
		</Tabs>
		<Row>
			<Col span="12">
			<span v-if="statu==1">&nbsp;</span>
			<Button type="primary" icon="plus-round" v-if="statu==2" @click="addParts()">新增自定义配件名称</Button>
			<div v-if="statu==3">
				<i-switch v-model="judg" @on-change="check" style="margin-right: 10px;"></i-switch>仅显示有未匹配过车型的订单
			</div>
			</Col>
			<Col span="12">
			<span style="float: right;">
					<Input v-model="query" placeholder="请输入关键字检索" @on-enter="searchObj" style="width: 300px"></Input>
					<Button type="ghost" @click="searchObj" icon="ios-search">搜索</Button>
				</span>
			</Col>
		</Row>
		<div v-if="statu == 1">
			<br />
			<Row>
				<Col span="24">
				<Alert banner type="warning">通知：请输入配件名称搜索</Alert>
				</Col>
			</Row>
		</div>
		<div v-if="statu==2">
			<br />
			<Row>
				<Col span="24">
				<ButtonGroup style="float: right;">
					<Button :type="sort == 'asc'?'primary':'ghost'" icon="arrow-up-b" @click="ascBtn">添加时间升序排列</Button>&nbsp;
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
					&nbsp;
					<DatePicker type="daterange" :options="options2" @on-change='myDate' placement="bottom-end" placeholder="请选择时间检索" style="width: 200px"></DatePicker>
					<Button :type="sort == 'asc'?'primary':'ghost'" icon="arrow-up-b" @click="orderAsc">下单时间升序排列</Button>
					<Button :type="sort == 'desc'?'primary':'ghost'" icon="arrow-down-b" @click="orderDesc">下单时间降序排列</Button>
				</ButtonGroup>
				</Col>
			</Row>
		</div>
		<br />
		<Table border :columns="columns1" :data="data2" v-if="statu == 1 || statu == 2"></Table>
		<Table border :columns="columns2" :data="exceedData" v-if="statu == 3"></Table>
		<!--异常配件订单-->
		<br />
		<Row>
			<Col span="24">
			<Page :total="page.total" :page-size="page.pageSize" @on-change="change" show-total :current="page.current" style="float: right;"></Page>
			</Col>
		</Row>

		<airx-modal v-model="addPartsData.theModal.show" size='xs' :zindex=998 :title="title" @on-close="closedetail" >
			<addEdit :editId='editId' :editVal='editVal' @close="close"></addEdit>
		</airx-modal>
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
		<Modal width='1200' style="height:600px" v-model="editSparts.theModal.show" :title="editSparts.theModal.title" :mask-closable="false">
			<h2>编辑配件名称</h2>
			<Select v-model="model1" style="margin-top:30px" filterable>
				<Option v-for="item in data2" :value="item.pjNbr" :key="item.pjNbr">{{ item.pjName }}</Option>
			</Select>
			<Button type="primary" @click="save2()" style="margin-top: 20px;">修改</Button>
			<div slot="footer">
				<Button type="error" size="large" @click="editSparts.theModal.show =false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam
	} from '../../utils/requestHttp.js'
	import {
		md5,
		getLocalTime,
		splitK,
		rmoney,
		orderStatus,
		dateTrans,
		logHttp
	} from '../../utils/common.js'
	import addEdit from './addEdit'
	export default {
		components: {
			addEdit
		},
		data() {
			return {
				options2: {
					shortcuts: [{
						text: '一周',
						value() {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							return [start, end];
						}
					}, {
						text: '一月',
						value() {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							return [start, end];
						}
					}, {
						text: '三月',
						value() {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							return [start, end];
						}
					}]
				},
				type: 1,
				statu: 1,
				addPartsData: {
					theModal: {
						show: false,
						title: ''
					},
				},
				createTime: "",
				query: '',
				sort: 'desc',
				correction:0,//是否处理更正
				editId: "",
				editVal: '',
				judg: 1,
				checked: true,
				endTime: '',
				startTime: '',
				judg: true,
				title: "",
				data2: [],
				model1:'',
				data8:[], //配件明细
				exceedData: [], // 存放异常数据
				page: {
					total: 0,
					current: 1,
					pageSize: 30
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
				columns1: [{
					title: '#',
					width: 80,
					render: (h, params) => {
						return this.page.pageSize * (this.page.current == 1 ? 0 : (this.page.current - 1)) + params.index + 1;
					}
				}, {
					title: '名称',
					key: 'pjName'
				}, {
					title: '创建时间',
					key: 'createTime',
					render(h, params) {
						return getLocalTime(params.row.createTime);
					}
				}, {
					title: '操作',
					width: 120,
					align: 'center',
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
								}, '--')
							]);
						} else if(this.statu == 2) {
							if(params.row.status == 0) {
								return h('div', [
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.disab(params.row.pjNbr)
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
												this.addParts(params.row.pjNbr, params.row.pjName)
											}
										}
									}, '编辑')
								]);
							} else {
								return '已禁用';
							}
						} else {}
					}
				}],
			}
		},
		created() {
			this.user = JSON.parse(localStorage.getItem('user'));
		},
		mounted(){
			logHttp(this.$store.state.sourceInfo,'配件名称管理',fetchPostUrlencoded);
		},
		watch: {},
		methods: {
			myDate(Option) {
				var self = this;
				if(self.statu == 3) {
					if(Option) {
						this.startTime = Option[0] ? Option[0] + ' ' + '00' + ':' + '00' + ':' + '00' : '';
						this.endTime = Option[1] ?  Option[1] + ' ' + '23' + ':' + '59' + ':' + '59' : '';
					}
				}
				this.getExceptionHandl();
			},
			//搜索
			searchObj() {
				var self = this;
				self.page.current = 1;
				if(self.statu == 1) {
					self.page.total = 0;
					self.getStandName();
				} else if(self.statu == 2) {
					self.page.total = 0;
					self.getStandName();
				} else {
					if(self.judg == true) {
						self.correction = 0;
						self.getExceptionHandl();
					} else {
						self.correction = 1;
						self.getExceptionHandl();
					}
				}
			},
			//关闭添加编辑名称
			close(){
				this.addPartsData.theModal.show = false;
				this.searchObj();
			},
			// 获取备注订单
			check() {
				this.page.current = 1;
				if(this.judg == true) {
					this.query = '';
					this.correction = 0;
					this.getExceptionHandl();
				} else {
					this.query = '';
					this.correction = 1;
					this.getExceptionHandl();
				}
			},
			//自定义添加添加名称
			addParts(id, name) {
				var self = this;
				self.addPartsData.theModal.show = true;
				self.editId = id ? id : '';
				self.editVal = name ? name : '';
				if(self.editId != null && self.editId != undefined && self.editId != '') {
					self.title = '编辑配件名称';
					this.$store.commit('setSourceInfo', {
						sourceUri: this.$store.state.sourceInfo.sourceUri,
						currentUri: '/dataOps/partsOps/editParts',
						tempPath:this.$store.state.sourceInfo.tempPath
					});
					logHttp(this.$store.state.sourceInfo,'编辑配件名称',fetchPostUrlencoded);
				} else {
					self.title = '新增配件名称';
					this.$store.commit('setSourceInfo', {
						sourceUri: this.$store.state.sourceInfo.sourceUri,
						currentUri: '/dataOps/partsOps/addParts',
						tempPath:this.$store.state.sourceInfo.tempPath
					});
					logHttp(this.$store.state.sourceInfo,'新增配件名称',fetchPostUrlencoded);
				}
			},
			//获取标准名称库和自定义名称
			getStandName() {
				var self = this;
				fetchPostUrlencoded('/nxp-admin/carLine/pjBytype', {
					'type': self.type,
					'key': self.query,
					'sort': self.sort,
					'page': self.page.current,
					'size': self.page.pageSize
				}).then(function(res) {
					if(res.flag == 0) {
						self.data2 = res.data;
						self.page.total = res.count;
					} else {
						self.$Message.error(res.msg);
					}
				})
			},
			//异常
			getExceptionHandl() {
				var self = this;
				fetchPostUrlencoded('/nxp-admin/order/matching', {
					'page': self.page.current,
					'size': self.page.pageSize,
					'type': 2,
					'status': self.correction, //是否处理更正
					'orderNo': self.query, //查询订单ID
					'startTime': self.startTime,
					'endTime': self.endTime,
					'sort': self.sort,
				}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.exceedData = res.data;
						this.page.total = res.data.length;
					}
				})
			},
			//查看配件明细
			queryPart(id) {
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/dataOps/partsOps/partsQuery',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'配件明细',fetchPostUrlencoded);
				var self = this;
				self.id = id;
				self.parts.theModal.show = true;
				self.getPjDeal();
			},
			//编辑配件标准名称
			edit: function(orderId,standardName) {
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/dataOps/partsOps/editStanderParts',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'编辑标准配件名称',fetchPostUrlencoded);
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
			//异常配件提交修改
			save2() {
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
			//分页
			change: function(page, current) {
				this.page.current = page;
				this.getStandName();
			},
			//自定义标准升序降 序
			ascBtn() {
				this.page.current = 1;
				var self = this;
				self.sort = 'asc';
				this.getStandName();
			},
			descBtn() {
				this.page.current = 1;
				var self = this;
				self.sort = 'desc';
				this.getStandName();
			},
			//车型备注订单升序降 序
			orderAsc() {
				this.page.current = 1;
				this.sort = 'asc';
				this.getExceptionHandl();
			},
			orderDesc() {
				this.page.current = 1;
				this.sort = 'desc';
				this.getExceptionHandl();
			},
			//禁用
			disab: function(delId) {
				var self = this;
				fetchPostUrlencoded('/nxp-admin/carLine/delPj', {
					'pjNbr': delId
				}).then(function(res) {
					if(res.flag == 0) {
						self.$Message.success(res.msg);
						self.getStandName();
					} else {
						self.$Message.error(res.msg);
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
				self.query = '';
				self.type = name;
				self.statu = name;
				this.sort = 'desc';
				self.page.current = 1;
				if(self.type == 3) {
					self.getExceptionHandl();
				} else if(self.type == 2) {
					self.getStandName();
				} else {
					self.data2 = [];
				}
			},
			closedetail() {
				this.searchObj();
			}
		}
	}
</script>
<style></style>
