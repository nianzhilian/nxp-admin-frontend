<template>
	<div>
		<Row>
			<Col span="2" :lg="{ offset: 1 }" justify='center'>厂商：</Col>
			<Col span="14">
			<Input v-model="changJia" type="text" size="large" placeholder="请输入厂商"></Input>
			</Col>
		</Row>
		<br>
		<Row>
			<Col span="2" :lg="{ offset: 1 }">品牌：</Col>
			<Col span="14">
			<Input v-model="pinPai" type="text" size="large" placeholder="请输入品牌"></Input>
			</Col>
		</Row>
		<br>
		<Row>
			<Col span="2" :lg="{ offset: 1 }">车系：</Col>
			<Col span="14">
			<Input v-model="cheXi" type="text" size="large" placeholder="请输入车系"></Input>
			</Col>
		</Row>
		<br>
		<Row>
			<Col span="2" :lg="{ offset: 1 }">车型：</Col>
			<Col span="14">
			<Input v-model="cheXing" type="text" size="large" placeholder="请输入车型"></Input>
			</Col>
		</Row>
		<br>
		<Row>
			<Col span="2" :lg="{ offset: 1 }">年款：</Col>
			<Col span="14">
			<Input v-model="nianKuan" type="text" size="large" placeholder="请输入年款"></Input>
			</Col>
		</Row>
		<br>
		<Row>
			<Col span="2" :lg="{ offset: 1 }">销售名称：</Col>
			<Col span="14">
			<Input v-model="xiaoShouName" type="text" size="large" placeholder="请输入销售名称"></Input>
			</Col>
		</Row>
		<br>
		<Row>
			<Col span="4" :lg="{ offset:3 }">
			<Button type="primary" size='large' @click="add">添加</Button>
			</Col>
		</Row>
	</div>
</template>
<script>
	export default {
		props: ['liyangId', 'quickId','timeId'], //quickId 判断是否是快速添加车型
		data() {
			return {
				changJia: '',
				pinPai: '',
				cheXi: '',
				cheXing: '',
				nianKuan: '',
				xiaoShouName: '',
				levelId: ''
			}
		},
		created() {
			this.getCookie();
		},
		watch:{
			timeId:'clearData'
		},
		methods: {
			//初始清空
			clearData() {
				this.changJia = '';
				this.pinPai = '';
				this.cheXi = '';
				this.cheXing = '';
				this.nianKuan = '';
				this.xiaoShouName = '';
			},
			//添加车系
			add() {
				var self = this;
				self.$http({
					url: '/nxp-admin/liYang/insert',
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					params: {
						changJia: self.changJia,
						pinPai: self.pinPai,
						cheXi: self.cheXi,
						cheXing: self.cheXing,
						nianKuan: self.nianKuan,
						xiaoShouName: self.xiaoShouName
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.levelId = res.data.data.levelId;
						if(self.quickId != '' && self.quickId != null && self.quickId != undefined) {
							self.$http({
								url: "/nxp-admin/order/updateCar/",
								method: 'POST',
								headers: {
									'token': self.user.token
								},
								params: {
									orderId: self.quickId,
									liyangId: self.levelId
								}
							}).then(function(res) {
								if(res.data.flag == 0) {
									alert(res.data.msg);
								} else {
									self.$Message.error(res.data.msg);
								}
							})
						} else {
							alert(res.data.msg);
						}
					} else {
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