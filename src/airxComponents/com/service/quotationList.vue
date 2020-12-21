<!--选择报价-->
<template>
	<div>
		<airx-modal v-model="modal1" :zindex=998 title="选择报价">
			<div v-for="(val,index) in data">
				<div style="border: #DDD 1px solid; padding: 20px; background: #F9F9F9;">
					<Row>
						<Col span="12">
						<h3>{{val.orgName}}</h3>
						<br /> 报价时间：{{val.createTime}}
						<br /> 评分：{{val.score}}
						</Col>
						<Col span="12"></Col>
					</Row>
					<br />
					<div style="padding: 10px; background: #FFFFFF; border: #DDD 1px solid;">第 {{val.infoList[0]['turnNum']}} 轮报价</div>
					<Table :row-class-name="rowClassName" disabled-hover :columns="columns" :data="val.infoList" @on-selection-change="setList($event,index)"></Table>
					<br />
					<Row>
						<Col span="3">
						<Button type="warning" long @click="backSet(index)">打回选中报价</Button>
						</Col>
						<Col span="3" offset="18">
						<Button type="success" :loading="subLoading" long @click="choseBj(val.id,val.orgName)">选中此配件商</Button>
						</Col>
					</Row>
					<div v-if="val.prevInfoList.length > 0">
						<br />
						<div style="padding: 10px; background: #FFFFFF; border: #DDD 1px solid;">被打回报价 （ 第 {{val.prevInfoList[0]['turnNum']}} 轮报价 ）</div>
						<Table :row-class-name="rowClassName" disabled-hover :columns="columnsBack" :data="val.prevInfoList"></Table>
					</div>
				</div>
				<br />
			</div>
			<Row>
				<Col span="12" offset="6">
				<Button type="error" long @click="backAll">全部打回</Button>
				</Col>
			</Row>
			<!--部分打回-->
			<airx-modal v-model="modal2" :zindex=999 @on-close="closeBackPart" title="部分打回">
				<Table :row-class-name="rowClassName" disabled-hover :columns="backColumns" :data="backData"></Table>
				<br />
				<Row>
					<Col span="12" offset="6">
					<Button type="warning" :loading="subLoading" long @click="backPartOk">确定部分打回</Button>
					</Col>
				</Row>
			</airx-modal>
			<!--全部打回-->
			<airx-modal v-model="modal3" :zindex=999 @on-close="closeBackPart" title="全部打回">
				<Input v-model="backAllText" type="textarea" :rows="4" placeholder="请输入打回全部报价的原因..."></Input>
				<br />
				<br />
				<Row>
					<Col span="12" offset="6">
					<Button type="error" :loading="subLoading" long @click="backAllOk">确定全部打回</Button>
					</Col>
				</Row>
			</airx-modal>
		</airx-modal>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	import backPartRow from './backPart-row.vue'
	
	import {logHttp} from '../../../utils/common.js'
	import viewModal from '../quote/viewModal.vue'
	export default {
		components: {},
		watch:{
			modal1(val){
				if(val){
					this.$store.commit('setSourceInfo', {
						sourceUri: this.$store.state.sourceInfo.sourceUri,
						currentUri: '/orderDetail/selectBidOrg',
						tempPath:this.$store.state.sourceInfo.tempPath
					});
					logHttp(this.$store.state.sourceInfo,'选择中标供应商',fetchPostUrlencoded);
				}
			}
		},
		data() {
			return {
				orderId: '',
				subLoading: false,
				modal1: false,
				modal2: false,
				modal3: false,
				backAllText: '',
				columns: [{
						type: 'selection',
						width: 80,
						align: 'center'
					},
					{
						title: '名称',
						key: 'name',
					},
					{
						title: 'OE码',
						key: 'oenum'
					},
					{
						title: '配件品牌',
						key: 'brand'
					},
					{
						title: '品类',
						key: 'category'
					},
					{
						title: '期货?',
						render: (h, params) => {
							if(params.row.cycle == 'Y') {
								return h('span', {}, '是')
							}
							if(params.row.cycle == 'N') {
								return h('span', {}, '否')
							}
						}
					},
					{
						title: '单价',
						key: 'price'
					},
					{
						title: '数量',
						key: 'number'
					},
					{
						title: '总价',
						key: 'amount'
					},
					{
						title: '管理费',
						key: 'manageCost'
					},
					{
						title: '4S指导价',
						key: 'guidePrice',
	                   	render: function (h, params) {
	                   	if(params.row.guidePrice){
	                   		return h(viewModal, {
	                         props: {
	                           "ref": "viewModal",
	                           "viewData": params.row,
	                           "name": "pjPrice"
	                         }
	                       })	
	                   	}else if(params.row.oem4sListPrice){
	                   		return h('span', splitK(params.row.oem4sListPrice));
	                   	}else{
	                   		return h('span', '--');
	                   	}
	                   }
	                 },
					{
						title: '备注',
						key: 'remark'
					}
				],
				columnsBack: [{
						title: ' ',
						width: 80,
						render: (h, params) => {
							if(params.row.cusBackReasonCategory != null || params.row.serBackReasonCategory != null) {
								return h('span', {
									style: {
										'color': '#ed3f14'
									}
								}, '被打回')
							}
						}
					}, {
						title: '名称',
						key: 'name',
					},
					{
						title: 'OE码',
						key: 'oenum'
					},
					{
						title: '配件品牌',
						key: 'brand'
					},
					{
						title: '品类',
						key: 'category'
					},
					{
						title: '期货?',
						render: (h, params) => {
							if(params.row.cycle == 'Y') {
								return h('span', {}, '是')
							}
							if(params.row.cycle == 'N') {
								return h('span', {}, '否')
							}
						}
					},
					{
						title: '单价',
						key: 'price'
					},
					{
						title: '数量',
						key: 'number'
					},
					{
						title: '总价',
						key: 'amount'
					},
					{
						title: '管理费',
						key: 'manageCost'
					},
					{
						title: '4S指导价',
						key: 'guidePrice',
                   		render: function (h, params) {
	                   	if(params.row.guidePrice){
	                   		return h(viewModal, {
	                         props: {
	                           "ref": "viewModal",
	                           "viewData": params.row,
	                           "name": "pjPrice"
	                         }
	                       })	
	                   	}else if(params.row.oem4sListPrice){
	                   		return h('span', splitK(params.row.oem4sListPrice));
	                   	}else{
	                   		return h('span', '--');
	                   	}
	                   }
	                 },
					{
						title: '备注',
						key: 'remark'
					}
				],
				backColumns: [{
						type: 'expand',
						width: 50,
						render: (h, params) => {
							var _self = this;
							return h(backPartRow, {
								props: {
									row: params.row
								},
								on: {
									backCause: function(event) {
										_self.updateBackCause(event, params.index);
									}
								},
							})
						}
					}, {
						title: '名称',
						key: 'name',
					},
					{
						title: 'OE码',
						key: 'oenum'
					},
					{
						title: '配件品牌',
						key: 'brand'
					},
					{
						title: '品类',
						key: 'category'
					},
					{
						title: '期货?',
						render: (h, params) => {
							if(params.row.cycle == 'Y') {
								return h('span', {}, '是')
							}
							if(params.row.cycle == 'N') {
								return h('span', {}, '否')
							}
						}
					},
					{
						title: '单价',
						key: 'price'
					},
					{
						title: '数量',
						key: 'number'
					},
					{
						title: '总价',
						key: 'amount'
					},
					{
						title: '管理费',
						key: 'manageCost'
					},
					{
						title:'4S指导价',
						key: 'guidePrice',
	                   	render: function (h, params) {
	                   	if(params.row.guidePrice){
	                   		return h(viewModal, {
	                         props: {
	                           "ref": "viewModal",
	                           "viewData": params.row,
	                           "name": "pjPrice"
	                         }
	                       })	
	                   	}else if(params.row.oem4sListPrice){
	                   		return h('span', splitK(params.row.oem4sListPrice));
	                   	}else{
	                   		return h('span', '--');
	                   	}
	                   }
	                 },
					{
						title: '备注',
						key: 'remark'
					}
				],
				backData: [],
				data: [],
			}
		},
		methods: {
			// 关闭打回报价弹窗
			closeBackPart() {
				this.backPartModal = false;
			},
			closeBackAll() {
				this.backAllModal = false;
			},
			initData(id) {
				var _self = this;
				_self.orderId = id;
				_self.modal1 = true;
				_self.subLoading = false;
				fetchGet('/nxp-admin/order/bj/' + id + '?type=1').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						for(var i = 0; i < res.data.length; i++) {
							if(res.data[i]['prevInfoList'] == undefined) {
								res.data[i]['prevInfoList'] = [];
							}
						}
						_self.data = res.data;
						//this.$Message.success(res.msg);
					}
				});
			},
			close() {
				this.modal1 = false;
				this.$emit("on-close");
			},
			// 将当前选中报价塞进已选择的数组
			setList(e, index) {
				this.data[index]['set'] = e;
			},
			// 打回选中的报价
			backSet(index) {
				if(this.data[index]['set'] == undefined || this.data[index]['set'].length == 0) {
					this.$Message.warning('没有选中要打回报价的配件');
				} else {
					for(var i = 0; i < this.data[index]['set'].length; i++) {
						this.data[index]['set'][i]['_expanded'] = true;
					}
					this.backData = this.data[index]['set'];
					this.modal2 = true;
				}
			},
			// 选中报价
			choseBj(id, name) {
				let _self = this;
				_self.$Modal.confirm({
					title: '提示',
					content: '<p>确认选中《' + name + '》的报价？</p>',
					onOk: () => {
						_self.subLoading = true;
						fetchPostUrlencoded('/nxp-admin/order/chose', {
							answerId: id,
							orderId: this.orderId,
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
					onCancel: () => {}
				});
			},
			// 将expanded返回数据写进当前数据中
			updateBackCause(e, index) {
				this.backData[index]['serBackReasonCategory'] = e.serBackReasonCategory;
				this.backData[index]['serBackReasonDetails'] = e.serBackReasonDetails;
			},
			// 打算全部打回
			backAll(index) {
				let _self = this;
				_self.modal3 = true;
				_self.backAllText = '';
			},
			// 确认部分打回的方法
			backPartOk() {
				let _self = this;
				_self.$Modal.confirm({
					title: '提示',
					content: '<p>确认部分打回重报？</p>',
					onOk: () => {
						_self.backPartModal = false;
						var answerInfo = [];
						var obj = {
							id: '',
							serBackReasonCategory: '',
							serBackReasonDetails: '',
						};
						for(var i = 0; i < _self.backData.length; i++) {
							obj = {
								id: _self.backData[i]['id'],
								serBackReasonCategory: _self.backData[i]['serBackReasonCategory'],
								serBackReasonDetails: _self.backData[i]['serBackReasonDetails'],
							};
							answerInfo.push(obj);
						}
						fetchPostUrlencoded('/nxp-admin/order/subback/' + _self.orderId, {
							answerId: _self.backData[0]['answerId'],
							answerInfo: JSON.stringify(answerInfo)
						}).then((res) => {
							if(res.flag !== 0) {
								_self.$Message.error(res.msg);
							} else {
								_self.$Message.success(res.msg);
								_self.modal2 = false;
								_self.close();
							}
						});
					},
					onCancel: () => {}
				});
			},
			// 确认全部打回的方法
			backAllOk() {
				var _self = this;
				if(_self.backAllText == '') {
					this.$Message.warning('全部打回原因不能为空！');
				} else {
					_self.$Modal.confirm({
						title: '提示',
						content: '<p>确认全部打回报价再邀请供应商重报？</p>',
						onOk: () => {
							fetchPostUrlencoded('/nxp-admin/order/allback/' + _self.orderId, {
								serBack: _self.backAllText
							}).then((res) => {
								if(res.flag !== 0) {
									_self.$Message.error(res.msg);
								} else {
									_self.$Message.success(res.msg);
									_self.modal3 = false;
									_self.close();
								}
							});
						},
						onCancel: () => {}
					});
				}
			},rowClassName (row, index) {
	          if(row.isStandard=='0'){
	          	return 'spLinePj';
	          }
	        }
		}
	}
</script>

<style>

</style>
