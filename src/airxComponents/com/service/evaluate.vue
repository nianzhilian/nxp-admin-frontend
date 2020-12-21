<!--订单评价-->
<template>
	<div>
		<airx-modal v-model="modal1" :zindex=998 title="订单评价">
			<Alert type="warning" v-if="kehu == 0">
				客户未评价，所以暂时不能评价
			</Alert>
			<br />
			<Form label-position="left" :label-width="120">
				<FormItem label="客服评价">
					<span v-if="kefu == 1">{{serother}}</span>
					<span v-if="kehu > 0"><Input v-model="serother" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" v-if="kefu == 0"></Input></span>
				</FormItem>
				<FormItem label="客户评价">
					{{other}}
				</FormItem>
				<FormItem :label="val.parameterName" v-for="val in data" :key="val.id">
					<Rate show-text :disabled="kehu == 0 || kefu == 1" v-model="val.value"></Rate>
				</FormItem>
				<FormItem>
					<div v-if="kehu > 0">
						<div v-if="kefu == 0">
							<Button type="primary" :loading="subLoading" @click="handleSubmit('formCustom')">提交评价</Button>
						</div>
					</div>
				</FormItem>
			</Form>
		</airx-modal>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	export default {
		components: {},
		data() {
			return {
				orderId: '',
				modal1: false,
				serother: '',
				other: '',
				subLoading: false,
				data: [],
				formLeft: {},
				kehu: 0,
				kefu: 0,
			}
		},
		methods: {
			initData(id) {
				var _self = this;
				_self.modal1 = true;
				_self.orderId = id;
				_self.kehu = 0;
				_self.kefu = 0;
				fetchGet('/nxp-admin/sysOp/opePar/' + _self.orderId).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						// 获取有评分的项
						for(var i = 0; i < res.data.length; i++) {
							res.data[i]['value'] = parseInt(res.data[i]['value']);
							if(res.data[i]['value'] > 0) {
								_self.kehu++;
							}
						}
						// 如果有评分的项等于总数
						if(_self.kehu == res.data.length) {
							_self.kefu = 1;
						}

						_self.data = res.data;
						if(res.OTHER != undefined) _self.other = res.OTHER;
						if(res.SEROTHER != undefined) _self.serother = res.SEROTHER;
					}
				});
			},
			close() {
				this.modal1 = false;
				this.$emit("on-close");
			},
			handleSubmit() {
				let _self = this;

				let arr1 = [];
				let arr2 = [];
				let enb = false;

				for(let i = 0; i < _self.data.length; i++) {
					if(_self.data[i]['value'] == 0) {
						enb = true;
					}
					arr1.push(_self.data[i]['id']);
					arr2.push(_self.data[i]['value']);
				}
				if(enb || _self.serother == '') {
					this.$Message.warning('有评分为0，或者没填写评论');
				} else {
					fetchPostUrlencoded('/nxp-admin/order/eva/' + _self.orderId, {
						typeIds: arr1.join(","),
						valueStrs: arr2.join(","),
						evaluate: _self.serother,
					}).then((res) => {
						if(res.flag !== 0) {
							_self.$Message.error(res.msg);
							_self.subLoading = false;
						} else {
							_self.$Message.success(res.msg);
							_self.close();
						}
					});
				}
			},
		}
	}
</script>

<style></style>