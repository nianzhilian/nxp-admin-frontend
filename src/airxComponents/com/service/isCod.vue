<!--该客户货到付款-->
<template>
	<div class="updateTime" @click.stop>
		<Button type="warning" long @click="isCod">该客户货到付款</Button>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	export default {
		components: {},
		props: ['orderId'],
		data() {
			return {
				subLoading: false,
			}
		},
		mounted() {
			var _self = this;
		},
		methods: {
			isCod() {
				this.$Modal.confirm({
					title: '提示',
					content: '<p>确认客户货到付款？</p>',
					onOk: () => {
						this.handleSubmit();
					},
					onCancel: () => {}
				});
			},
			handleSubmit() {
				var _self = this;
				fetchPostUrlencoded('/nxp-admin/order/changeCod', {
					orderId: _self.orderId,
					cod: 1,
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
			close() {
				this.$emit("closeIsCod");
			}
		}
	}
</script>

<style scoped>

</style>