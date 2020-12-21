<!--成交明细-->

<template>
	<div style="margin: 20px;">
		<Table :row-class-name="rowClassName" disabled-hover class="detail-tab" border :columns="columns" :data="data"></Table>
	</div>
</template>

<script>
	import { fetchPostJson, fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK } from '../../utils/common.js'
	import viewModal from '../com/quote/viewModal'
	export default {
		components: {
			viewModal
		},
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
						title: '配件品牌',
						key: 'brand'
					},
					{
						title: '送达数量 ／ 订购数量',
						align: 'center',
						width: 160,
						render(h, params) {
							return params.row.sendto + ' ／ ' + params.row.number
						}
					},
					{
						title: '单位',
						key: 'unit',
						width: 80,
					},
					{
						title: '单价',
						key: 'price',
						align: 'right',
						render(h, params) {
							if(params.row.guidePrice != null && params.row.guidePrice > 0 && (params.row.price + (params.row.manageCost == null ? 0 : params.row.manageCost) / params.row.number) > params.row.guidePrice) {
								return h('div', [
									h('Icon', {
										props: {
											type: 'alert-circled'
										},
										style: {
											color: '#ff6600',
											padding: '0px 0px 0px 2px'
										}
									}),
									h('strong', splitK(params.row.price))

								]);
							} else {
								return h('span', splitK(params.row.price));
							}
						}
					},
					{
						title: '总价',
						key: 'amount',
						align: 'right',
						render(h, params) {
							return splitK(params.row.amount)
						}
					},
					{
						title: '管理费',
						key: 'manageCost',
						align: 'right',
						render(h, params) {
							if(params.row.manageCost != null && params.row.manageCost != undefined && params.row.manageCost != '') {
								return splitK(params.row.manageCost)
							} else {
								return '- -'
							}
						}
					},
					{
						title: '4S指导价',
						key: 'guidePrice',
						align: 'right',
						render(h, params) {
							if(params.row.guidePrice) {
								return h(viewModal, {
									props: {
										"ref": "viewModal",
										"viewData": params.row,
										"name": "pjPrice"
									}
								})
							} else if(params.row.oem4sListPrice) {
								return h('span', splitK(params.row.oem4sListPrice));
							} else {
								return h('span', '--');
							}
						}
					},
					{
						title: '期货？',
						key: 'cycle',
						render: (h, params) => {
							if(params.row.cycle == 'Y')
								return h('span', '是')
							if(params.row.cycle == 'N')
								return h('span', '否')
						}
					},
					{
						title: '备货周期',
						key: 'cycleDate'
					},
					{
						title: '备注',
						key: 'remark'
					},
				],
				data: [],
				dealData: []
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
					fetchGet('/nxp-admin/order/deal/' + this.orderId + '?_deal').then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							//this.$Message.success(res.msg);
							_self.data = res.data;
							_self.data.filter((item)=>{
								item.sendto = 0;
							})
							this.logisticsData();
						}
					});
				}
			},
			logisticsData() {
				var _self = this;
				fetchPostJson('/nxp-logistics/admin/airinfo', {
					orderId: _self.orderId
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						//this.$Message.success(res.msg);
						var arr = [];
						if(res.data.logistics != undefined) {
							for(var i = 0; i < res.data.logistics.length; i++) {
								if(res.data.logistics[i]['status'] != -1 && res.data.logistics[i]['orderType'] != 3 && res.data.logistics[i]['orderType'] != 4 && res.data.logistics[i]['orderType'] != 5) {
									for(var j = 0; j < res.data.logistics[i]['infoList'].length; j++) {
										arr.push(res.data.logistics[i]['infoList'][j]);
									}
								}
							}
						}
						for(var i = 0; i < arr.length; i++) {
							for(var j = 0; j < _self.data.length; j++) {
								if(arr[i]['answerInfoid'] == _self.data[j]['id']) {
									if(arr[i]['isCom'] == 1) {
										_self.data[j]['logisticsStatus'] = 1;
										_self.data[j]['sendto'] = parseInt(_self.data[j]['sendto']) + parseInt(arr[i]['num']);
									} else {
										_self.data[j]['logisticsStatus'] = 0;
									}
								}
							}
						}
						_self.$set(_self.data);
					}
				});
			},
			rowClassName(row, index) {
				if(row.isStandard == '0') {
					return 'spLinePj';
				}
			}
		}
	}
</script>

<style>

</style>