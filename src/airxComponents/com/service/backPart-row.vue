<style scoped>
	.expand-row {
		margin-bottom: 16px;
	}
</style>
<template>
	<Form>
		<Row>
			<Col span="1" style="color: #FF0000;">*</Col>
			<Col span="11">
			<Select v-model="serBackReasonCategory" style="width:100%" @on-change="backCause">
				<Option v-for="item in data" :value="item" :key="item">{{ item }}</Option>
			</Select>
			</Col>
			<Col span="12">
			<Input v-model="serBackReasonDetails" placeholder="" style="width: 100%" @on-blur="backCause"></Input>
			</Col>
		</Row>
	</Form>
</template>
<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	export default {
		props: {
			row: Object
		},
		data() {
			return {
				serBackReasonCategory: '',
				serBackReasonDetails: '',
				data: [],
			}
		},
		created() {
			this.initData();
		},
		methods: {
			initData() {
				var _self = this;
				fetchGet('/nxp-admin/sysOp/par/MD_RE_REQ').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						_self.data = (res.data.value).split(",");
						_self.serBackReasonCategory = _self.data[0];
						_self.backCause();
					}
				});
			},
			backCause() {
				var obj = {
					serBackReasonCategory: this.serBackReasonCategory,
					serBackReasonDetails: this.serBackReasonDetails
				}
				this.$emit("backCause", obj);
			}
		}
	};
</script>