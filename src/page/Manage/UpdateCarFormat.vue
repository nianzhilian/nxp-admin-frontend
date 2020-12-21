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
	export default {
		props: ['carRemarkId'],
		data() {
			return {
				carRemarkId: '',
				updateCarFormatView: true
			}
		},
		created() {
			this.getCookie();
		},
		methods: {
			//修改车型备注车系
			update(){
				var self= this;
				self.$http({
					url: '/nxp-admin/order/carNote/' + self.carRemarkId,
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					params:{
						carNote : self.carNote
					}
				}).then(function(res) {
					if(res.data.flag == 0){
						alert(res.data.msg);
						self.$Modal.remove();
					}else{
						self.$Message.error(res.data.msg);
					}
				})
			},
			getCookie() {
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			},
		}
	}
</script>