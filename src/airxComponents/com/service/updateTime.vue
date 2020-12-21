<!--修改报价时间-->
<template>
	<div class="updateTime" @click.stop>
		<Button type="warning" long @click="visibleBox">修改报价时间&nbsp;&nbsp;<Icon type="arrow-down-b"></Icon></Button>
		<div class="opBox" v-if="visible">
			请填写更新时间（分钟）
			<br /><br />
			<InputNumber :max="formItem.maxExpTime" :min="1" v-model="formItem.expTime"></InputNumber>&nbsp;&nbsp;
			<Button type="primary" :loading="subLoading" @click="handleSubmit('formItem')">提交</Button>
		</div>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	export default {
		components: {},
		props: ['orderId'],
		data() {
			return {
				visible: false,
				subLoading: false,
				formItem: {
					maxExpTime: 0,
					expTime: 0
				},
			}
		},
		mounted() {
			var _self = this;
			window.document.body.onclick = function() {
				if(_self.visible) {
					_self.visible = false;
				}
			};
		},
		methods: {
			initData() {
				var _self = this;
				fetchGet('/nxp-admin/sysOp/par/SQM_QUOTE_TIMEOUT').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						_self.formItem.maxExpTime = parseInt(res.data.value);
					}
				});
			},
			visibleBox() {
				var _self = this;
				if(!_self.visible) {
					_self.initData();
				} else {
					_self.formItem = {
						maxExpTime: 0,
						expTime: 0
					}
				}
				_self.visible = !_self.visible;
			},
			handleSubmit() {
				var _self = this;
				if(this.formItem.expTime == 0 || this.formItem.expTime == '') {
					_self.$Message.warning("请正确填写时间");
				} else {
					fetchPostUrlencoded('/nxp-admin/inv/updateDate', {
						orderId: _self.orderId,
						expTime: _self.formItem.expTime,
					}).then((res) => {
						if(res.flag !== 0) {
							_self.$Message.error(res.msg);
							_self.subLoading = false;
						} else {
							_self.$Message.success(res.msg);
							_self.visibleBox();
						}
					});
				}
			}
		}
	}
</script>

<style scoped>
	.updateTime {
		position: relative;
		z-index: 101;
	}
	
	.opBox {
		position: absolute;
		top: 32px;
		left: 0;
		background: #FFF;
		border: #DDD 1px solid;
		border-radius: 5px;
		padding: 20px;
	}
</style>