<!--终止报价-->
<template>
	<div>
		<Button type="warning" long :loading="subLoading" @click="abandon">终止报价</Button>
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
			abandon() {
				this.$Modal.confirm({
					title: '提示',
					content: '<p>确认终止报价？</p>',
					onOk: () => {
						this.handleSubmit();
					},
					onCancel: () => {}
				});
			},
			handleSubmit() {
				var _self = this;
				_self.subLoading = true;
				fetchGet('/nxp-admin/inv/cancel/' + _self.orderId).then((res) => {
					if(res.flag !== 0) {
						_self.$Message.error(res.msg);
					} else {
						_self.$Message.success(res.msg);
					}
					_self.subLoading = false;
					_self.close();
				});
			},
			close() {
				this.$emit("on-close");
			}
		}
	}
</script>

<style scoped>

</style>