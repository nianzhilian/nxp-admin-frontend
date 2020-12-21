<!--邀请报价-->
<template>
	<div>
		<airx-modal v-model="modal1" :zindex=998 title="邀请报价">
			<Form :model="formItem" :label-width="120">
				<FormItem label="时限">
					<InputNumber :max="formItem.maxExpTime" :min="1" v-model="formItem.expTime"></InputNumber>
				</FormItem>
				<FormItem label="备注">
					<Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
				</FormItem>
				<FormItem label="已选中配件商">
					<span v-if="setPj.length <= 0">请选择配件商</span>
					<Tag color="green" closable v-for="item in setPj" :key="item.id" :name="item.id" @on-close="delSetPj(item.id)">{{item.name}}</Tag>
				</FormItem>
				<FormItem>
					<Button type="primary" :loading="subLoading" @click="subForm">邀请报价</Button>
				</FormItem>
			</Form>
			<div v-if="loading">
				<Alert type="warning">
					<Icon type="load-a element-animated rotate long infinite"></Icon>&nbsp;&nbsp;请稍候...
					<template slot="desc">
						系统正在拼命为你推荐配件商...
					</template>
				</Alert>
			</div>
			<div v-if="!loading">
				<h4 class="service-op-title">系统推荐配件商：{{data1.length}}家</h4>
				<Table border ref="selection1" :height="240" :columns="columns" :data="data1" @on-selection-change="increasePj1"></Table>
				<h4 class="service-op-title">本地配件商：{{data2.length}}家</h4>
				<Table border ref="selection2" :height="240" :columns="columns" :data="data2" @on-selection-change="increasePj2"></Table>
				<h4 class="service-op-title">其他配件商：{{data3.length}}家</h4>
				<Table border ref="selection3" :height="240" :columns="columns" :data="data3" @on-selection-change="increasePj3"></Table>
			</div>
		</airx-modal>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	export default {
		components: {},
		data() {
			return {
				orderId: '',
				modal1: false,
				animateShow: '',
				loading: true,
				subLoading: false,
				columns: [{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '名称',
						key: 'fullName',
						width: 400,
					},
					{
						title: '主营品牌',
						key: 'branch'
					}
				],
				data1: [],
				data2: [],
				data3: [],
				setData1: [],
				setData2: [],
				setData3: [],
				setPj: [],
				formItem: {
					maxExpTime: 1,
					expTime: 1,
					remark: ''
				},
				vehicleType:'',
			}
		},
		methods: {
			detaultForm() {
				var _self = this;
				_self.modal1 = true;
				_self.loading = true;
				_self.subLoading = false;
				_self.data1 = [];
				_self.data2 = [];
				_self.data3 = [];
				_self.setData1 = [];
				_self.setData2 = [];
				_self.setData3 = [];
				_self.setPj = [];
				_self.formItem = {
					maxExpTime: 1,
					expTime: 1,
					remark: ''
				}
			},
			initData(id,vehicleType) {
				var _self = this;
				
				_self.orderId = id;
				_self.vehicleType = vehicleType;
				_self.detaultForm(id);
				fetchGet('/nxp-admin/sysOp/par/SQM_QUOTE_TIMEOUT').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						//this.$Message.success(res.msg);
						_self.formItem.maxExpTime = parseInt(res.data.value);
						_self.formItem.expTime = parseInt(res.data.value);
					}
				});
				fetchPostUrlencoded('/nxp-admin/cusOrganiztion/cusByRegion', {
							orderId: id
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						_self.data2 = res.data.local;
						_self.data3 = res.data.other;
						this.$Message.success(res.msg);
						fetchGet('/nxp-admin/order/match/' + id).then((res) => {
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								// 系统推荐的
								_self.data1 = res.data;
								_self.regenerateData();
								_self.loading = false;
							}

						});
					}
				});
			},
			regenerateData() {
				var _self = this;
				// 主营品牌变成字符串返回
				for(var i = 0; i < this.data1.length; i++) {
					this.data1[i]['id'] = this.data1[i]['orderId'];
					this.data1[i]['fullName'] = this.data1[i]['orgName'];
					if(_self.vehicleType==1){
						this.data1[i]['branch'] = this.strBranch(this.data1[i]['supplierMainline']);
					}else{
						this.data1[i]['branch'] = this.strBranch(this.data1[i]['cusOrganiztionModels']);
					}
				}
				for(var i = 0; i < this.data2.length; i++) {
					if(_self.vehicleType==1){
						this.data2[i]['branch'] = this.strBranch(this.data2[i]['supplierMainline']);
					}else{
						this.data2[i]['branch'] = this.strBranch(this.data2[i]['cusOrganiztionModels']);
					}
				}
				for(var i = 0; i < this.data3.length; i++) {
					if(_self.vehicleType==1){
						this.data3[i]['branch'] = this.strBranch(this.data3[i]['supplierMainline']);
					}else{
						this.data3[i]['branch'] = this.strBranch(this.data3[i]['cusOrganiztionModels']);
					}
				}
				// 去掉重复的配件商
				for(var i = 0; i < this.data2.length; i++) {
					for(var j = 0; j < this.data3.length; j++) {
						if(this.data2[i]['id'] == this.data3[j]['id']) {
							this.data3.splice(j, 1);
						}
					}
				}
				for(var i = 0; i < this.data1.length; i++) {
					for(var j = 0; j < this.data2.length; j++) {
						if(this.data1[i]['orgId'] == this.data2[j]['id']) {
							this.data1[i]['branch'] = this.data2[j]['branch']
							this.data2.splice(j, 1);
						}
					}
				}
				_self.$set(_self.data1);
				_self.$set(_self.data2);
				_self.$set(_self.data3);
			},
			strBranch(data) {
				data=JSON.parse(data);
				var arr = [];
				// 返回所有车辆品牌
				if(data) {
					for(var i = 0; i < data.length; i++) {
						if(this.vehicleType==1){
							if(arr.indexOf(data[i]['brandName']) == -1) {
								arr.push(data[i]['brandName']);
							}
						}else{
							if(arr.indexOf(data[i]['changJia']) == -1) {
								arr.push(data[i]['changJia']);
							}
						}
					}
					return arr.join(",");
				} else {
					return '- -';
				}
			},
			close() {
				this.modal1 = false;
				this.$emit("on-close");
			},
			increasePj1(selection, obj) {
				this.setData1 = selection;
				this.regeneratePj();
			},
			increasePj2(selection) {
				this.setData2 = selection;
				this.regeneratePj();
			},
			increasePj3(selection) {
				this.setData3 = selection;
				this.regeneratePj();
			},
			regeneratePj() {
				this.setPj = [];
				var arr = {};
				for(var i = 0; i < this.setData1.length; i++) {
					arr = {
						id: this.setData1[i]['orgId'],
						name: this.setData1[i]['fullName']
					};
					this.setPj.push(arr);
				}
				for(var i = 0; i < this.setData2.length; i++) {
					arr = {
						id: this.setData2[i]['id'],
						name: this.setData2[i]['fullName']
					};
					this.setPj.push(arr);
				}
				for(var i = 0; i < this.setData3.length; i++) {
					arr = {
						id: this.setData3[i]['id'],
						name: this.setData3[i]['fullName']
					};
					this.setPj.push(arr);
				}
			},
			delSetPj(id) {
				var forlevel = '';
				var findPj = '';
				for(var i = 0; i < this.data1.length; i++) {
					if(this.data1[i]['orgId'] == id) {
						forlevel = 1;
						findPj = i;
					}
				}
				for(var i = 0; i < this.data2.length; i++) {
					if(this.data2[i]['id'] == id) {
						forlevel = 2;
						findPj = i;
					}
				}
				for(var i = 0; i < this.data3.length; i++) {
					if(this.data3[i]['id'] == id) {
						forlevel = 3;
						findPj = i;
					}
				}
				this.$refs['selection' + forlevel].toggleSelect(findPj);
			},
			subForm() {
				var _self = this;

				if(_self.setPj.length <= 0) {
					_self.$Message.warning("请选择配件商");
				} else {
					this.$Modal.confirm({
						title: '提醒',
						content: '<p>是否邀请报价</p>',
						onOk: () => {
							_self.confirmForm();
							_self.subLoading = true;
						},
						onCancel: () => {}
					});
				}
			},
			confirmForm() {
				var _self = this;

				var orgIds = [];
				var orgName = [];

				for(var i = 0; i < _self.setPj.length; i++) {
					orgIds.push(_self.setPj[i]['id']);
					orgName.push(_self.setPj[i]['name']);
				}

				fetchPostUrlencoded('/nxp-admin/inv/add', {
					orderId: _self.orderId,
					orgId: orgIds.join(","),
					orgName: orgName.join(","),
					expTime: _self.formItem.expTime,
					remark: _self.formItem.remark
				}).then((res) => {
					if(res.flag !== 0) {
						_self.$Message.error(res.msg);
						_self.subLoading = false;
					} else {
						_self.$Message.success(res.msg);
						_self.close();
					}
				});
			},
		}
	}
</script>

<style>
	/*
	.service-op-mask {
		background: rgba(0, 0, 0, 0.5);
		z-index: 102;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	
	.service-op-box {
		z-index: 103;
		position: fixed;
		top: 7%;
		right: 7%;
		bottom: 7%;
		left: 7%;
		background: #FFF;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
		border-radius: 5px;
	}
	
	.service-op-close {
		z-index: 104;
		position: absolute;
		top: 5px;
		right: 5px;
	}
	
	.service-op-content {
		height: 100%;
		padding: 20px;
		overflow-y: auto;
	}
	
	.service-op-title {
		line-height: 32px;
		margin: 30px 0 10px 0;
	}
	*/
</style>