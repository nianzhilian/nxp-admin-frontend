<template>
	<div>
		<Row>
			<Col span="2" :lg="{ offset: 1 }" justify='center'>请输入：</Col>
			<Col span="14">
			<Input v-model="carNote" type="text" size="large" placeholder="请输入车型备注"></Input>
			</Col>
		</Row><br />
		<Row>
			<Col span="4" :lg="{ offset:3 }">
			<Button type="primary" size='large' @click="update">修改</Button>
			</Col>
		</Row>
	</div>
</template>
<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'
	
	export default {
		props: ['carRemarkId'],
		data() {
			return {
				carNote: '',
				updateCarFormatView: true
			}
		},
		watch: {
			carRemarkId() {
				this.carNote = '';
			}
		},
		created() {
		},
		methods: {
			//修改车型备注车系
			update(){
				let _self= this;
				
				fetchPostUrlencoded('/nxp-admin/order/carNote/' + _self.carRemarkId, {
					carNote : _self.carNote
				}).then((res) => {
					if(res.flag != 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						_self.close();
					}
				});
			},
			close() {
				this.$emit("on-close");
			},
		}
	}
</script>