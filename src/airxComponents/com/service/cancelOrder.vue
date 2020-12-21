<!--取消订单-->
<template>
	<div>
		<Button type="error" long :loading="subLoading" @click="handleSubmit">取消订单</Button>
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
		},
		methods: {
			close() {
				let _self = this;
				_self.$emit("on-close");
			},
			handleSubmit() {
				let _self = this;

				this.$Modal.confirm({
					title: '提示',
					content: '<p>确定需要取消订单吗？</p>',
					onOk: () => {
						_self.subLoading = true;
						fetchGet('/nxp-admin/order/qx/' + _self.orderId).then((res) => {
							if(res.flag !== 0) {
								_self.$Message.error(res.msg);
							} else {
								_self.$Message.success(res.msg);
							}
							_self.subLoading = false;
							_self.close();
						});
					},
					onCancel: () => {}
				});
			}
		}
	}
</script>

<style scoped>

</style>