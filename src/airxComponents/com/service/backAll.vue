<!--中标供应商重报-->
<template>
	<div>
		<!--<Button type="warning" long @click="backAll">重新邀请报价</Button>-->
			<airx-modal v-model="modal1" :zindex=999 title="全部打回" @on-close="closeBackAll">
			<Input v-model="backAllText" type="textarea" :rows="4" placeholder="请输入打回全部报价的原因..."></Input>
			<br />
			<br />
			<Row>
				<Col span="12" offset="6">
				<Button type="error" :loading="subLoading" long @click="backAllOk">确定全部打回</Button>
				</Col>
			</Row>
		</airx-modal>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	import backPartRow from './backPart-row.vue'

	export default {
		components: {},
		props: [],
		data() {
			return {
				orderId: '',
				subLoading: false,
				modal1: false,
				backAllText: '',
			}
		},
		mounted() {
			var _self = this;
		},
		methods: {
			closeBackAll() {
				this.modal1 = false;
			},
			close() {
				this.$emit("on-close");
			},
			initData(id) {
				let _self = this;
				_self.orderId = id;
				_self.modal1 = true;
				_self.backAllText = '';
			},
			updateBackCause(e, index) {
				this.backData[index]['serBackReasonCategory'] = e.serBackReasonCategory;
				this.backData[index]['serBackReasonDetails'] = e.serBackReasonDetails;
			},
			// 打回选中的报价
			backAll(index) {
				this.modal1 = true;
			},
			backAllOk() {
				let _self = this;
				if(_self.backAllText == '') {
					this.$Message.warning('全部打回原因不能为空！');
				} else {
					_self.$Modal.confirm({
						title: '提示',
						content: '<p>确认全部打回报价再邀请供应商重报？</p>',
						onOk: () => {
							_self.subLoading = true;
							fetchPostUrlencoded('/nxp-admin/order/allback/' + _self.orderId, {
								serBack: _self.backAllText
							}).then((res) => {
								if(res.flag !== 0) {
									_self.$Message.error(res.msg);
								} else {
									_self.$Message.success(res.msg);
									_self.modal1 = false;
									_self.subLoading = false;
									_self.close();
								}
							});
						},
						onCancel: () => {}
					});
				}
			},
		}
	}
</script>

<style scoped>

</style>