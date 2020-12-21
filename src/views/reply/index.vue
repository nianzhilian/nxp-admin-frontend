<template>
	<div>
		<div class="air-title h3">快速注册审批</div>
		<Tabs :animated="false" @on-click="changeTabs">
			<TabPane label="待审核" name="0"></TabPane>
			<TabPane label="已同意" name="1"></TabPane>
			<TabPane label="已拒绝" name="2"></TabPane>
			<TabPane label="推送失败" name="3"></TabPane>
		</Tabs>
		<br />
		<Table border :loading="loading" :columns="columns" :data="data"></Table>
		<br />
		<Row :gutter="16">
			<Col span="24">
			<div style="float: right;">
				<Page :total="page.total" :current="page.current" :page-size="page.pageSize" show-total @on-change="changePage"></Page>
			</div>
			</Col>
		</Row>
		<!--编辑-->
		<Modal v-model="regDetailData.theModal.show" :title="regDetailData.theModal.title" :mask-closable="false" width="800">
			<Form ref="regDetailData.theForm" :model="regDetailData.theForm" :rules="regDetailData.theRule" :label-width="140">
				<FormItem label="">
					<h3 class="from-space">组织信息</h3>
				</FormItem>
				<FormItem label="公司全称" prop="cusFullName">
					<Input v-model="regDetailData.theForm.cusFullName"></Input>
				</FormItem>
				<FormItem label="公司区域" prop="cusRegion">
					<Cascader v-model="regDetailData.theForm.cusRegionArr" :data="region"></Cascader>
				</FormItem>
				<FormItem label="公司地址" prop="cusAddress">
					<Input v-model="regDetailData.theForm.cusAddress"></Input>
				</FormItem>
				<FormItem label="公司电话" prop="cusPhone">
					<Input v-model="regDetailData.theForm.cusPhone"></Input>
				</FormItem>
				<FormItem label="">
					<h3 class="from-space">下单员信息 <span style="color: #FF0000;margin-left: 20px;" v-if="regDetailData.theForm.isRec == 0">
					<Icon type="android-checkbox-outline"></Icon> 同时也是收货人
					</span></h3>
				</FormItem>
				<FormItem label="下单员登录名" prop="orderInitLoginName">
					<Input v-model="regDetailData.theForm.orderInitLoginName"></Input>
				</FormItem>
				<FormItem label="下单员名称" prop="orderInitName">
					<Input v-model="regDetailData.theForm.orderInitName"></Input>
				</FormItem>
				<FormItem label="下单员手机" prop="orderInitPhone">
					<Input v-model="regDetailData.theForm.orderInitPhone"></Input>
				</FormItem>
				<div v-if="regDetailData.theForm.isRec == 1">
					<FormItem label="">
						<h3 class="from-space">收货人信息</h3>
					</FormItem>
					<FormItem label="收货人登录名" prop="recLoginName">
						<Input v-model="regDetailData.theForm.recLoginName"></Input>
					</FormItem>
					<FormItem label="收货人名称" prop="recName">
						<Input v-model="regDetailData.theForm.recName"></Input>
					</FormItem>
					<FormItem label="收货人手机" prop="recPhone">
						<Input v-model="regDetailData.theForm.recPhone"></Input>
					</FormItem>
				</div>
				<FormItem label="">
					<h3 class="from-space">维修顾问信息</h3>
				</FormItem>
				<FormItem label="维修顾问登录名" prop="saLoginName">
					<Input v-model="regDetailData.theForm.saLoginName"></Input>
				</FormItem>
				<FormItem label="维修顾问名称" prop="saName">
					<Input v-model="regDetailData.theForm.saName"></Input>
				</FormItem>
				<FormItem label="维修顾问手机" prop="saPhone">
					<Input v-model="regDetailData.theForm.saPhone"></Input>
				</FormItem>
				<FormItem label="">
					<h3 class="from-space">结算方式</h3>
				</FormItem>
				<FormItem label="结算方式" prop="payType">
					<i-select v-model="regDetailData.theForm.payType">
						<i-option v-for="item in regDetailData.theForm.payTypeArr" :value="item.value" :key="item.value">{{ item.label }}</i-option>
					</i-select>
				</FormItem>
				<FormItem label="">
					<h3 class="from-space">客服和销售</h3>
				</FormItem>
				<FormItem label="客服" prop="serviceId">
					<i-select v-model="regDetailData.theForm.serviceId">
						<i-option v-for="item in regDetailData.theForm.serviceArr" :value="item.id" :key="item.id">{{ item.name }}</i-option>
					</i-select>
				</FormItem>
				<FormItem label="销售" prop="saleId">
					<i-select v-model="regDetailData.theForm.saleId">
						<i-option v-for="item in regDetailData.theForm.saleArr" :value="item.id" :key="item.id">{{ item.name }}</i-option>
					</i-select>
				</FormItem>
				<FormItem label="">
					<h3 class="from-space">图片</h3>
					<div class="imglist">
						<ul>
							<li v-for="val in regDetailData.theForm.cusPicsArr">
								<a :href="val" target="_blank"><img :src="val" width="628" /></a>
							</li>
						</ul>
					</div>
				</FormItem>
				<FormItem>
					<Row :gutter="16">
						<Col span="6">
						<Button type="success" long @click="subForm">修改并同意</Button>
						</Col>
						<Col span="6">
						<Button type="error" long @click="noForm">拒绝</Button>
						</Col>
					</Row>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="ghost" size="large" long @click="regDetailData.theModal.show = false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import { getLocalTime } from '../../utils/common.js'
	import { md5 ,logHttp} from '../../utils/common.js'
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'

	export default {
		name: 'reply',
		data() {
			return {
				value2: '',
				loading: false,
				page: {
					status: 0,
					total: 0,
					current: 1,
					pageSize: 15
				},
				filter: {
					orgName: ''
				},
				region: [],
				columns: [{
						title: '#',
						key: 'id',
						width: 60,
						fixed: 'left'
					},
					{
						title: '名称',
						key: 'cusFullName',
						width: 240,
						fixed: 'left'
					},
					{
						title: '下单员名称',
						key: 'orderInitName',
						width: 150
					},
					{
						title: '下单员手机',
						key: 'orderInitPhone',
						width: 150
					},
					{
						title: '收货人名称',
						key: 'recName',
						width: 150
					},
					{
						title: '收货人手机',
						key: 'recPhone',
						width: 150
					},
					{
						title: '维修顾问名称',
						key: 'saName',
						width: 150
					},
					{
						title: '维修顾问电话',
						key: 'saPhone',
						width: 150
					},
					{
						title: '添加时间',
						key: 'createTime',
						width: 150,
						render: (h, params) => {
							return h('div', getLocalTime(params.row.createTime))
						}
					},
					{
						title: '审批状态',
						key: 'status',
						width: 100,
						align: 'center',
						render: (h, params) => {
							if(params.row.status == 0) {
								return h('div', [
									h('Button', {
										props: {
											type: 'ghost',
											size: 'small'
										}
									}, '待审批')
								]);
							} else if(params.row.status == 1) {
								return h('div', [
									h('Button', {
										props: {
											type: 'success',
											size: 'small'
										}
									}, '已通过')
								]);
							} else if(params.row.status == 2) {
								return h('div', [
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										}
									}, '已拒绝')
								]);
							} else if(params.row.status == 3) {
								return h('div', [
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										}
									}, '审批失败')
								]);
							}
						}
					},
					{
						title: '操作',
						key: 'name',
						width: 100,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.regDetail(params.index)
										}
									}
								}, '查看')
							]);
						}
					}
				],
				data: [],
				orgColumns: [{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '组织名称',
						key: 'fullName'
					},
					{
						title: '组织类别',
						key: 'type',
						width: 100,
						render: (h, params) => {
							if(params.row.type == 1) {
								return h('div', ['配件商']);
							} else if(params.row.type == 2) {
								return h('div', ['保险公司']);
							} else {
								return h('div', ['修理厂']);
							}
						}
					}
				],
				orgData: [],
				regDetailData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
						cusFullName: '',
						cusRegion: '',
						cusRegionArr: [],
						cusAddress: '',
						cusPhone: '',
						orderInitLoginName: '',
						orderInitpassWord: '',
						orderInitName: '',
						orderInitPhone: '',
						isRec: '',
						recLoginName: '',
						recPassWord: '',
						recName: '',
						recPhone: '',
						saLoginName: '',
						saPassWord: '',
						saName: '',
						saPhone: '',
						payType: '',
						payTypeArr: [{
								value: '0',
								label: '现付'
							},
							{
								value: '1',
								label: '月结'
							}
						],
						serviceId: '',
						serviceArr: [],
						saleId: '',
						saleArr: [],
						cusPics: '',
						cusPicsArr: []
					},
					theRule: {
						title: [{
							required: true,
							message: '标题不能为空',
							trigger: 'blur'
						}],
						cusFullName: [{
							required: true,
							message: '公司全称不能为空',
							trigger: 'blur'
						}],
						cusRegion: [{
							required: true,
							message: '公司区域不能为空',
							trigger: 'blur'
						}],
						cusAddress: [{
							required: true,
							message: '公司地址不能为空',
							trigger: 'blur'
						}],
						cusPhone: [{
							required: true,
							message: '公司电话不能为空',
							trigger: 'blur'
						}],
						orderInitLoginName: [{
							required: true,
							message: '下单员登录名不能为空',
							trigger: 'blur'
						}],
						orderInitName: [{
							required: true,
							message: '下单员名称不能为空',
							trigger: 'blur'
						}],
						orderInitPhone: [{
							required: true,
							message: '下单员手机不能为空',
							trigger: 'blur'
						}],
						recLoginName: [],
						recName: [],
						recPhone: [],
						saLoginName: [{
							required: true,
							message: '维修顾问登录名不能为空',
							trigger: 'blur'
						}],
						saName: [{
							required: true,
							message: '维修顾问名称不能为空',
							trigger: 'blur'
						}],
						saPhone: [{
							required: true,
							message: '维修顾问手机不能为空',
							trigger: 'blur'
						}],
						payType: [{
							required: true,
							message: '支付方式不能为空',
							trigger: 'blur'
						}],
						serviceId: [{
							type: "number",
							required: true,
							message: '客服不能为空',
							trigger: 'blur'
						}],
						saleId: [{
							type: "number",
							required: true,
							message: '销售不能为空',
							trigger: 'blur'
						}]
					}
				},
				optionsForStart: {
					disabledDate(date) {
						return date && date.valueOf() < Date.now();
					}
				},
				optionsForEnd: {
					disabledDate(date) {
						return date && date.valueOf() < Date.now() + 86400000;
					}
				}
			}
		},
		computed: {
			// 组织要过滤
			orgFilter: function() {
				var _self = this;
				return this.orgData.filter(function(data) {
					if(_self.filter.orgName) {
						return data.fullName.indexOf(_self.filter.orgName) > -1
					} else {
						return data
					}
				})
			}
		},
		methods: {
			initData() {
				this.loading = true;
				fetchGetHaveParam('/nxp-admin/qsu/list/', {
					size: this.page.pageSize,
					page: this.page.current,
					status: this.page.status
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.page.total = res.count;
						this.data = res.data;
						this.$Message.success(res.msg);
						// 改变状态后如果数据结果小于1页则跳回到第1页
						if(res.count <= this.page.pageSize && this.page.current != 1) {
							this.changePage(1);
						}
					}
					this.loading = false;
				}).catch(() => {
					this.$Message.error("网络错误！");
				});
			},
			regionData() {
				fetchGet('/nxp-admin/region/all').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.region = this.formatCity(res.data);
					}
				});
			},
			workerData() {
				fetchGet('/nxp-admin/serviceUser/queryUser').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.regDetailData.theForm.serviceArr = res.data.customerService;
						this.regDetailData.theForm.saleArr = res.data.sale;
					}
				});
			},
			formatCity(data) {
				for(var i = 0; i < data.length; i++) {
					if(data[i]['childNodes'] && data[i]['childNodes'].length > 0) {
						data[i]['children'] = this.formatCity(this.formatCity(data[i]['childNodes']));
					}
					data[i]['value'] = data[i]['id'];
					data[i]['label'] = data[i]['name'];
				}
				return data;
			},
			changePage: function(e) {
				this.page.current = e;
				this.initData();
			},
			regDetail: function(index) {
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/regApproval/regDetail',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'详细信息',fetchPostUrlencoded);
				this.regDetailData.theModal.show = true;
				this.$refs["regDetailData.theForm"].resetFields();
				this.regDetailData.theModal.title = "详细信息";
				// 根据是不是收货人来决定收货人项是不是必填
				if(this.data[index]['isRec'] == 0) {
					this.regDetailData.theRule.recLoginName = [];
					this.regDetailData.theRule.recName = [];
					this.regDetailData.theRule.recPhone = [];
				} else {
					this.regDetailData.theRule.recLoginName = [{
						required: true,
						message: '收货人登录名不能为空',
						trigger: 'blur'
					}];
					this.regDetailData.theRule.recName = [{
						required: true,
						message: '收货人名称不能为空',
						trigger: 'blur'
					}];
					this.regDetailData.theRule.recPhone = [{
						required: true,
						message: '收货人手机不能为空',
						trigger: 'blur'
					}];
				}
				this.regDetailData.theForm.id = this.data[index]['id'];
				this.regDetailData.theForm.cusFullName = this.data[index]['cusFullName'];
				this.regDetailData.theForm.cusName = this.data[index]['cusName'];
				this.regDetailData.theForm.cusRegion = this.data[index]['cusRegion'];
				this.regDetailData.theForm.cusRegionArr = this.data[index]['cusRegion'].split("-");
				this.regDetailData.theForm.cusAddress = this.data[index]['cusAddress'];
				this.regDetailData.theForm.cusPhone = this.data[index]['cusPhone'];
				this.regDetailData.theForm.orderInitLoginName = this.data[index]['orderInitLoginName'];
				this.regDetailData.theForm.orderInitpassWord = this.data[index]['orderInitpassWord'];
				this.regDetailData.theForm.orderInitName = this.data[index]['orderInitName'];
				this.regDetailData.theForm.orderInitPhone = this.data[index]['orderInitPhone'];
				this.regDetailData.theForm.isRec = this.data[index]['isRec'];
				if(this.data[index]['isRec'] == 0) {
					this.regDetailData.theForm.recLoginName = '';
					this.regDetailData.theForm.recPassWord = '';
					this.regDetailData.theForm.recName = '';
					this.regDetailData.theForm.recPhone = '';
				} else {
					this.regDetailData.theForm.recLoginName = this.data[index]['recLoginName'];
					this.regDetailData.theForm.recPassWord = this.data[index]['recPassWord'];
					this.regDetailData.theForm.recName = this.data[index]['recName'];
					this.regDetailData.theForm.recPhone = this.data[index]['recPhone'];
				}
				this.regDetailData.theForm.saLoginName = this.data[index]['saLoginName'];
				this.regDetailData.theForm.saPassWord = this.data[index]['saPassWord'];
				this.regDetailData.theForm.saName = this.data[index]['saName'];
				this.regDetailData.theForm.saPhone = this.data[index]['saPhone'];
				this.regDetailData.theForm.payType = this.data[index]['payType'];
				this.regDetailData.theForm.serviceId = this.data[index]['serviceId'];
				this.regDetailData.theForm.saleId = this.data[index]['saleId'];
				this.regDetailData.theForm.cusPics = this.data[index]['cusPics'];
				this.regDetailData.theForm.cusPicsArr = this.data[index]['cusPics'].split(",");
			},
			subForm() {
				this.$refs["regDetailData.theForm"].validate((valid) => {
					if(valid) {
						fetchPostUrlencoded('/nxp-admin/qsu/review', {
							'qucikId': this.regDetailData.theForm.id,
							'orderInitLoginName': this.regDetailData.theForm.orderInitLoginName,
							'orderInitpassWord': this.regDetailData.theForm.orderInitpassWord,
							'orderInitName': this.regDetailData.theForm.orderInitName,
							'orderInitPhone': this.regDetailData.theForm.orderInitPhone,
							'cusFullName': this.regDetailData.theForm.cusFullName,
							'cusName': this.regDetailData.theForm.cusName,
							'cusAddress': this.regDetailData.theForm.cusAddress,
							'cusRegion': this.regDetailData.theForm.cusRegionArr.join("-"),
							'cusPhone': this.regDetailData.theForm.cusPhone,
							'isRec': this.regDetailData.theForm.isRec,
							'recLoginName': this.regDetailData.theForm.recLoginName,
							'recPassWord': this.regDetailData.theForm.recPassWord,
							'recName': this.regDetailData.theForm.recName,
							'recPhone': this.regDetailData.theForm.recPhone,
							'saLoginName': this.regDetailData.theForm.saLoginName,
							'saPassWord': this.regDetailData.theForm.saPassWord,
							'saName': this.regDetailData.theForm.saName,
							'saPhone': this.regDetailData.theForm.saPhone,
							'cusPics': this.regDetailData.theForm.cusPics,
							'payType': this.regDetailData.theForm.payType,
							'customerServiceId': this.regDetailData.theForm.serviceId,
							'saleId': this.regDetailData.theForm.saleId
						}).then((res) => {
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.regDetailData.theModal.show = false;
								this.initData();
								this.$Message.success(res.msg);
							}
						});
					} else {
						this.$Message.error('表单验证失败!');
					}
				})
			},
			noForm() {
				fetchPostUrlencoded('/nxp-admin/qsu/review', {
					'qucikId': this.regDetailData.theForm.id,
					'type': 1
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						this.regDetailData.theModal.show = false;
						this.initData();
					}
				});
			},
			changeTabs(e) {
				this.page.status = e;
				this.initData();
			},
		},
		mounted() {
			this.initData();
			this.regionData();
			this.workerData();
			logHttp(this.$store.state.sourceInfo,'快速注册审批',fetchPostUrlencoded);
		}
	}
</script>

<style scoped>
	.from-space {
		background: #F0F0F0;
		line-height: 30px;
		padding: 0 10px;
		border-radius: 5px;
	}

	.imglist ul li {
		width: 628px;
		margin: 0 auto;
	}

	.imglist ul li img {
		display: block;
		padding: 4px;
		border: #DDDDDD 1px solid;
		margin: 10px 0;
	}
</style>
<style>
	.ivu-modal-wrap {
		position: absolute;
	}
</style>
