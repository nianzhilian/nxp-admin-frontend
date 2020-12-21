<!--日志-->

<template>
	<div style="margin: 20px;">
		<Table border :columns="columns" :data="data"></Table>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK } from '../../utils/common.js'

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
						title: '时间',
						key: 'opTime',
						width: 150,
						render(h, params) {
							return getLocalTime(params.row.opTime)
						}
					}, {
						title: '信息',
						key: 'msg'
					},
					{
						title: '组织',
						key: 'orgname'
					},
					{
						title: '操作人',
						key: 'userName'
					},
				],
				data: []
			}
		},
		created() {},
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
					fetchGet('/nxp-admin/orderlog/list/' + id).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							//this.$Message.success(res.msg);
							_self.data = res.data;
						}
					});
				}
			}
		}
	}
</script>

<style>

</style>