<template lang="html">

	<div class="detail-top">
		<h4 class="modal-title" style="margin-left:20px;">订单详情</h4>
		<div style="margin-left:20px;">
			订单编号：{{getInfo.orderNo}}&nbsp;<br> 订单日期：{{createTime | dateFormate}}
		</div>
		<div class="status text-right">
			<span>{{getInfo.status | filterStatus}}</span>
			<br>
			<span style="color:red" v-if="getInfo.price > 0">￥&nbsp;{{getInfo.price | jine}}</span>
		</div>
		<div class="detail-wrap">
			<div class="fix">
				<div class="col-sm-12">
					<div class="air-space">客户信息</div>
				</div>
			</div>
			<div class="info-detail">
				<div class="form-group fix">
					<label class="col-sm-1 control-label">订单发起方</label>
					<div class="col-sm-5 form-control-static">
						<span class="c3a9ec5">{{getInfo.orgFullName}}</span>
					</div>
					<label class="col-sm-1 control-label">订单送达方</label>
					<div class="col-sm-5 c3a9ec5 form-control-static">
						{{getInfo.xlcFullName}}
					</div>
				</div>
				<div class="form-group fix">
					<label class="col-sm-1 control-label">询价人</label>
					<div class="col-sm-5 form-control-static">
						<span class="c3a9ec5">{{getInfo.saName}}  /  {{getInfo.saPhone}}</span>
					</div>
					<label class="col-sm-1 control-label">收货人</label>
					<div class="col-sm-5 c3a9ec5 form-control-static">
						{{getInfo.receiverName}} / {{getInfo.receiverPhone}}
					</div>
				</div>
				<div class="form-group fix">
					<label class="col-sm-1 control-label">维修顾问</label>
					<div class="col-sm-5 form-control-static">
						<span class="c3a9ec5">{{getInfo.saName}}  /  {{getInfo.saPhone}}</span>
					</div>
				</div>
			</div>
			<div class="fix">
				<div class="col-sm-12">
					<div class="air-space">供应商信息</div>
				</div>
			</div>
			<div class="info-detail">
				<div class="form-group fix">
					<label class="col-sm-1 control-label">供应商名称</label>
					<div class="col-sm-5 form-control-static">
						<span class="c3a9ec5">{{getInfo.supFullName}}</span>
					</div>
					<label class="col-sm-1 control-label">供应商联络人</label>
					<div class="col-sm-5 c3a9ec5 form-control-static">
						{{getInfo.bjName}}
					</div>
				</div>
				<div class="form-group fix">
					<label class="col-sm-1 control-label">手机</label>
					<div class="col-sm-5 form-control-static">
						<span class="c3a9ec5">{{getInfo.bjPhone}}</span>
					</div>
					<label class="col-sm-1 control-label">供应商地址</label>
					<div class="col-sm-5 c3a9ec5 form-control-static">
						{{getInfo.supAddress}}
					</div>
				</div>
			</div>
			<div class="fix">
				<div class="col-sm-12">
					<div class="air-space">成交明细</div>
				</div>
				<div class="col-sm-12">
					<span style="margin-left: 10px;">支付方式：</span>
					<span v-if="getPayType == -1">
              <span v-if="getInfo.isCod == 1 && getInfo.payType == 0" style="color:#5bc0de;font-weight: bold;">货到付款&nbsp;&nbsp;{{getInfo.payType | filterPayType}}</span>
					<span v-if="getInfo.isCod == 0 && getInfo.payType == 1" style="color:#5bc0de;font-weight: bold;">月结</span>
					<span v-if="getInfo.isCod == 0 && getInfo.payType == 0" style="color:#5bc0de;font-weight: bold;">先款后货&nbsp;&nbsp;{{getInfo.payType | filterPayType}}</span>
					</span>
					<span v-if="getPayType != -1 ">
              <span v-if="getInfo.isCod == 1 && getInfo.payType == 0" style="color:#5bc0de;font-weight: bold;">货到付款&nbsp;&nbsp;{{getPayType | filterPayType}}</span>
					<span v-if="getInfo.isCod == 0 && getInfo.payType == 0" style="color:#5bc0de;font-weight: bold;">先款后货&nbsp;&nbsp;{{getPayType | filterPayType}}</span>
					</span>
				</div>
			</div>
			<Table style="margin:15px; margin-bottom:0" width="100%" :columns="columns1" :data="getDeal" align='center'></Table>
			<div style="margin-left:15px;margin-right:15px;border-top:0" class="ivu-table-wrapper">
				<div class="ivu-table ivu-table-border">
					<div class="ivu-table-body">
						<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
							<tbody class="ivu-table-tbody br-none">
								<tr>
									<td>
										<span style="margin-left:640px;">合计<span style="margin-left:70px;">{{totalPrice | jine}} </span><span style="margin-left:70px;"></span>{{totalManagePrice | jine}}</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		getLocalTime,
		splitK,
		rmoney,
		numAdd,
		dateTrans
	}
	from '../../utils/common.js'
	export default {
		props: ['getInfo', 'getDeal', 'totalManagePrice', 'totalPrice','createTime'],
		/*tableRow:{
		    type:Object,
		    default:{}
		  },
		},*/
		data() {
			return {
				columns1: [{
					title: '配件名称',
					key: 'name',
				}, {
					title: 'OE码',
					key: 'oenum',
				}, {
					title: '品类',
					key: 'category',
				}, {
					title: '配件品牌',
					key: 'brand',
				}, {
					title: '单位',
					key: 'unit',
				}, {
					title: '单价',
					key: 'price',
				}, {
					title: '数量',
					key: 'dealNum',
				}, {
					title: '总价',
					key: 'amount',
				}, {
					title: '管理费',
					key: 'manageCost',
				}, {
					title: '期货',
					key: 'cycName',
				}, {
					title: '备货周期',
					key: 'cycleDate',
				}, {
					title: '备注',
					key: 'remark',
				}, ],
			}
		},
		filters: {
			filterStatus: function(s) {
				let orderStatus = {
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
				};
				return orderStatus[s]
			},
			filterPayType: function(s) {
				let payType = {
					0: '线上',
					1: '月结',
					2: '线下',
					3: '线上退',
					4: '月退',
					5: '线下退',
				};
				return payType[s]
			},
			dateFormate(s){
				return getLocalTime(s)
			},
			jine(s){
				return splitK(s);
			}
			
		},

		/* 计算属性的*/
		computed: {
			/* getInfo(){
			   return this.$store.getters.getDetailData
			 },
			 getDeal(){
			   let deal = [];
			   deal = this.formateList(this.$store.getters.getDetailDealData);
			   return deal
			 },
			 getPayType(){
			   return this.$store.getters.getDetailPayTypeData
			 },*/
			getPrice() {
				let total = {};
				let amountArr = [];
				let manageCostArr = [];
				this.formateList(this.getDeal).forEach(function(item, index) {
					amountArr.push(rmoney(item.amount));
					if(item.manageCost != "") {
						manageCostArr.push(rmoney(item.manageCost));
					}
				})
				total.amount = splitK(numAdd(amountArr));
				total.manageCostTotal = splitK(numAdd(manageCostArr));
				return total
			},
			getTbaleRow() {
				return this.tableRow
			}
		},
		created() {
			this.getCookie();
		},
		methods: {
			change() {
				this.myShow = !this.myShow;
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

<style lang="css" scoped>
	.br-none td {
		border-right: none
	}
	
	.c3a9ec5 {
		color: #3a9ec5;
	}
	
	.modal-title {
		line-height: 1.42857;
		margin: 0;
		font-size: 18px;
	}
	
	.detail-top {
		position: relative;
		line-height: 1.5;
	}
	
	.detail-top .status {
		position: absolute;
		right: 15px;
		top: 5px;
	}
	
	.detail-top .status span {
		color: #47c6ff;
		font-size: 20px;
	}
	
	.text-right {
		text-align: right;
	}
	
	.info-detail {
		line-height: 22px;
		margin-left: 30px;
	}
	
	.col-sm-1,
	.col-sm-5,
	.col-sm-12 {
		min-height: 1px;
		padding-left: 15px;
		padding-right: 15px;
		position: relative;
	}
	
	.col-sm-1,
	.col-sm-5,
	.col-sm-12 {
		float: left;
	}
	
	.col-sm-1 {
		width: 8.33333%;
	}
	
	.col-sm-5 {
		width: 41.6667%;
	}
	
	.col-sm-12 {
		width: 100%;
	}
	
	.form-horizontal .control-label {
		margin-bottom: 0;
		padding-top: 7px;
		text-align: right;
	}
	
	.info-detail .form-group .control-label {
		padding: 0;
	}
	
	.fix {
		*zoom: 1;
	}
	
	.fix:after {
		display: block;
		content: "clear";
		height: 0;
		clear: both;
		overflow: hidden;
		visibility: hidden;
	}
	
	.air-space {
		background: none repeat scroll 0 0 #f4f4f4;
		border-radius: 4px;
		line-height: 24px;
		margin: 20px 0;
		padding: 0 10px;
	}
</style>