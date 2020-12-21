<!--退货明细-->

<template>
	<div style="margin: 20px;">
		<div v-for="val in data">
			<Row>
				<Col span="24">
				<div class="text-content">
					<ul>
						<li>退货发起人：{{val.createUserName}}</li>
						<li>发起时间：{{val.createTimeStr}}</li>
					</ul>
					<ul>
						<li>承修方：{{val.xlcName}}</li>
						<li>发起方：{{val.startName}}</li>
						<li>配件商：{{val.pjsName}}</li>
						<li>车牌号：{{val.numberPlates}}</li>
					</ul>
					<ul>
						<li>报价单配件数量：{{val.pjNumber}}</li>
						<li>退货配件数量：{{val.returnNumber}}</li>
						<li>原单配件价格：{{val.orderPrice}}</li>
						<li>退货配件价格：{{val.returnPrice}}</li>
					</ul>
					<ul>
						<li>退货备注：{{val.reaDet}}</li>
					</ul>
				</div>
				</Col>
			</Row>
			<Table border :row-class-name="rowClassName" disabled-hover :columns="columns" :data="val.infoList"></Table>
			<br />
			<Row :gutter="20">
				<Col span="12">
				<Button type="error" icon="close-round" style="margin-right: 10px;" @click="cannelReturn(val.id)"  v-if="val.returnType == 1 && val.status != 0 && val.status != 25 && val.status != 26 && ((val.isRefund == 0 &&  val.isPay == 1) || orderData.payType == 1)"
					>取消退货单</Button> 退货状态：{{status[val.status]}}
				</Col>
				<Col span="12">
				<Button type="primary" icon="ios-printer" style="float: right;"><a :href ="'newprint.html?orderId=' + orderId + '&wuliu=' + val.id + '&type=return&sendType=0'" target="_blank">打印退货单</a></Button>
				</Col>
			</Row>
			<br /><br />
		</div>
		<div v-if="data.length == 0">
			<div style="text-align: center;line-height: 150px;">没有退货单</div>
		</div>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'
	import { getLocalTime } from '../../utils/common.js'
	
	export default {
		props: ['orderId'],
		data() {
			return {
				columns: [{
						title: '#',
						width: 60,
						render: (h, params) => {
							return h('span', params.index + 1)
						}
					}, {
						title: '配件名称',
						key: 'pjName',
						width: 200
					},
					{
						title: 'OE码',
						key: 'pjOenum'
					},
					{
						title: '品类',
						key: 'cateorg'
					},
					{
						title: '品牌',
						key: 'pjBrand'
					},
					{
						title: '单价',
						key: 'pjPrice'
					},
					{
						title: '退回单价',
						key: 'returnPrice'
					},
					{
						title: '总价',
						key: 'amountPj'
					},
					{
						title: '退回总价',
						key: 'amountReturn'
					},
					{
						title: '数量',
						key: 'pjNumber'
					},
					{
						title: '退回数量',
						key: 'returnNumber'
					},
					{
						title: '单位',
						key: 'pjUnit'
					},
					{
						title: '退货原因',
						type: 'expand',
						width: 100,
						render: (h, params) => {
							return h('div', {
								style: {
									'text-align': 'right',
									'margin-left': '240px'
								}
							}, '退货原因：' + params.row.reaCat + ' / 退货原因说明：' + params.row.reaDet)
						}
					},
				],
				orderData:[],
				data: [],
				status: {
					0: '退货已取消',
					20: '退货审核已发起',
					21: '定损员已确认',
					22: '待配件商确认',
					23: '配件商已确认',
					24: '退货已发货',
					25: '退货完成',
				},
			}
		},
		created() {},
		watch: {
			orderId() {
				this.initData();
			}
		},
		methods: {
			initData() {
				var _self = this;
				_self.data = [];
				if(this.orderId){
					fetchGet('/nxp-admin/order/info/' +  this.orderId).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							//this.$Message.success(res.msg);
							_self.orderData = res.data;
							fetchPostUrlencoded('/nxp-admin/order/re/' + this.orderId + '?_=return', {}).then((res) => {
								if(res.flag !== 0) {
									this.$Message.error(res.msg);
								} else {
									//this.$Message.success(res.msg);
									_self.data = res.data;
									for(var i = 0; i < res.data.length; i++) {
										res.data[i]['createTimeStr'] = getLocalTime(res.data[i]['createTime']);
									}
								}
							});
						}
					});
				}
			},
			cannelReturn(id) {
				let _self = this;
				_self.$Modal.confirm({
					title: '提示',
					content: '<p>确认取消退货单？</p>',
					onOk: () => {
						fetchGet('/nxp-admin/retord/cancel/' + id).then((res) => {
							if(res.flag !== 0) {
								_self.$Message.error(res.msg);
							} else {
								_self.$Message.success(res.msg);
								_self.initData();
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

<style>
.text-content ul {
	clear: both;
}
.text-content ul li {
	float: left;
	margin-right: 20px;
}
</style>