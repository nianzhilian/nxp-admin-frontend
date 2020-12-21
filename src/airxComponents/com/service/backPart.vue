<!--中标供应商重报-->
<template>
	<div>
		<airx-modal v-model="modal1" :zindex=999 title="部分打回" @on-close="close">
			<h3>将要求《{{pjOrgName}}》对以下配件重新报价</h3>
			<br />
			<Table :row-class-name="rowClassName" disabled-hover :columns="backColumns" :data="backData"></Table>
			<br />
			<Row>
				<Col span="12" offset="6">
				<Button type="warning" :loading="subLoading" long @click="backPartOk">确定部分打回</Button>
				</Col>
			</Row>
		</airx-modal>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	import backPartRow from './backPart-row.vue'
	import viewModal from '../quote/viewModal.vue'
	export default {
		components: {},
		props: [],
		data() {
			return {
				orderId: '',
				modal1: false,
				pjOrgName: '',
				subLoading: false,
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
				backData: [],
			}
		},
		mounted() {
			var _self = this;
		},
		methods: {
			initData(id) {
				var _self = this;
				_self.orderId = id;
				_self.modal1 = true;
				_self.backSet();
			},
			close() {
				this.modal1 = false;
				this.$emit("on-close");
			},
			updateBackCause(e, index) {
				this.backData[index]['serBackReasonCategory'] = e.serBackReasonCategory;
				this.backData[index]['serBackReasonDetails'] = e.serBackReasonDetails;
			},
			// 打回选中的报价
			backSet() {
				let _self = this;
				fetchGet('/nxp-admin/order/bj/' + _self.orderId + '?type=0').then((res) => {
					if(res.flag !== 0) {
						_self.$Message.error(res.msg);
					} else {
						_self.$Message.success(res.msg);

						let arr = [];
						let arr3 = [];
						let issnum = 0;
						// 找到客服选中的报价
						for(let a = 0; a < res.data.length; a++) {
							if(res.data[a]['isSelect'] == 1) {
								issnum++;
								arr = res.data[a];
							}
						}
						// 如果有两个或以上客服选中的报价
						if(issnum > 1) {
							for(let a = 0; a < res.data.length; a++) {
								if(res.data[a]['cusSelected'] == 1) {
									arr = res.data[a];
								}
							}
						}
						// 找到有打回原因的报价
						for(let b = 0; b < arr['infoList'].length; b++) {
							if(arr['infoList'][b]['cusBackReasonCategory'] != null) {
								arr['infoList'][b]['_expanded'] = true;
								arr3.push(arr['infoList'][b]);
							}
						};
						// 找不到的话提示一下
						if(arr3.length == 0) {
							this.$Message.warning('哎呀，出意外了……数据错误，请尝试重新邀请报价试试');
							_self.close();
						} else {
							_self.backData = arr3;
							_self.pjOrgName = arr3[0]['orgName'];
						}
					}
				});
			},
			// 确认部分打回的方法
			backPartOk() {
				var _self = this;
				_self.$Modal.confirm({
					title: '提示',
					content: '<p>确认部分打回重报？</p>',
					onOk: () => {
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
								_self.close();
							}
						});
					},
					onCancel: () => {}
				});
			},rowClassName (row, index) {
	          if(row.isStandard=='0'){
	          	return 'spLinePj';
	          }
	        }
		}
	}
</script>

<style scoped>

</style>