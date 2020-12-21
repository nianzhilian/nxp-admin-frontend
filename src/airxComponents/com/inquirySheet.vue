<!--询单配件列表-->

<template>
	<div style="margin: 20px;">
		<Table border :row-class-name="rowClassName" disabled-hover :columns="columns" :data="data"></Table>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'

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
						title: '名称',
						key: 'name',
						width: 200
					},{
						title: 'OE码',
						key: 'code',
						width:180
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
						title: '数量',
						key: 'number',
						align: 'right',
						width: 80,
					},
					{
						title: '单位',
						key: 'unit',
						width: 80,
					},
					{
						title: '备注',
						key: 'remark'
					},
				],
				data: []
			}
		},
		created() {
			//this.initData(this.orderId);
		},
		watch: {
			orderId() {
				this.initData(this.orderId);
			}
		},
		methods: {
			initData(id) {
				var _self = this;
				_self.data = [];
				if(this.orderId != undefined && this.orderId != null && this.orderId != '') {
					fetchGet('/nxp-admin/order/item/' + id).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							//this.$Message.success(res.msg);
							_self.data = res.data;
						}
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