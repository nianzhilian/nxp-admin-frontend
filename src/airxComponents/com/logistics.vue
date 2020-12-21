<!--物流明细-->

<template>
	<div style="margin: 20px;">
		<div v-for="val in data">
			<Row>
				<Col span="12">
				<div class="text-content">
					<ul>
						<li>发起配送日期：{{val.lastOpTime}}</li>
					</ul>
				</div>
				</Col>
				<Col span="12">
				<ButtonGroup size="small" shape="circle" style="float: right;">
					<Button>{{val.logisticsStatus}}</Button>
					<Button v-if="val.type==0">天驶物流</Button>
					<Button v-if="val.type==1">其它物流</Button>
					<Button v-if="val.orderType==5">换货物流</Button>
				</ButtonGroup>
				</Col>
			</Row>
			<br />
			<Table :row-class-name="rowClassName" disabled-hover border :columns="columns" :data="val.infoList"></Table>
			<br />
			<Row>
				<Col span="12">
				<Button type="error" icon="close" v-if="val.status != -1 && val.status != 5" @click="cancelSend(val.logisticsId)">撤销配送单</Button>
				<!--
				<li v-if='val.type==1'>承运商名称：{{val.otherLogisticsCompanyName}}</li>
				<li v-if='val.type==1'>承运商联系方式：{{val.otherLogisticsPhone}}</li>
				<li v-if='val.type==1'>运单号：{{val.otherLogisticsNo}}</li>
				-->
				&nbsp;
				</Col>
				<Col span="12">
				<Button type="primary" icon="ios-printer" style="float: right;" v-if="val.orderType != 5"><a :href="'newprint.html?orderId=' + orderId + '&wuliu=' + val.logisticsId + '&type=send&sendType=0'" target="_blank">打印配送单</a></Button>
				<Button type="primary" icon="ios-printer" style="float: right;" v-if="val.orderType == 5"><a :href="'newprint.html?orderId=' + orderId + '&wuliu=' + val.returnOrderId + '&type=changeSend&sendType=0'" target="_blank">打印换货发货单</a></Button>
				</Col>
			</Row>
			<br /><br />
		</div>
		<div v-if="data.length == 0">
			<div style="text-align: center;line-height: 150px;">没有物流单</div>
		</div>
	</div>
</template>

<script>
	import { fetchPostJson } from '../../utils/requestHttp.js'

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
						key: 'name',
						width: 200
					},
					{
						title: 'OE码',
						key: 'oenum'
					},
					{
						title: '品类',
						key: 'category',
						width: 80,
					},
					{
						title: '数量',
						key: 'num'
					},
					{
						title: '单位',
						key: 'unit'
					},
				],
				data: [],
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
				if(this.orderId != undefined && this.orderId != null && this.orderId != '') {
              			fetchPostJson('/nxp-logistics/admin/airinfo',{'orderId':_self.orderId}).then((res) => {
							if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							//this.$Message.success(res.msg);
							if(res.data.logistics != undefined) _self.data = res.data.logistics;
						}
					});
				}
			},
			cancelSend(id) {
				this.$Modal.confirm({
					title: '提示',
					content: '<p>是否撤回配送单</p>',
					onOk: () => {
						fetchPostJson('/nxp-logistics/admin/delLst',{
              			'lstId':id
						}).then((res) => {
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.error(res.msg);
								this.initData();
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

</style>
