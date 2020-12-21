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
			<Col span="4" :lg="{ offset:3 }"  >
			<Button type="primary" size='large' @click="update">修改</Button>
			</Col>
		</Row>
	</div>
</template>
<script>
	export default {
		props: ['liyangId'],
		data() {
			return {
				changJia: '',
				pinPai: '',
				cheXi: '',
				cheXing: '',
				nianKuan: '',
				xiaoShouName: '',
				CustomCarModifiView: true
			}
		},
		created() {
			this.getCookie();
		},
		watch:{
			liyangId : 'getRawData'
		},
		methods: {
			getRawData() {
				var self= this;
				self.$http({
					url: '/nxp-admin/liYang/carStatus/' + self.liyangId,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						if(res.data.data.changJia !=null && res.data.data.changJia !='' &&  res.data.data.changJia !=undefined ){
							self.changJia=res.data.data.changJia;
						}else{
							self.changJia='';
						}
						if(res.data.data.pinPai !=null && res.data.data.pinPai !='' &&  res.data.data.pinPai !=undefined ){
							self.pinPai = res.data.data.pinPai;
						}else{
							self.pinPai = '';
						}
						if(res.data.data.cheXi !=null && res.data.data.cheXi !='' &&  res.data.data.cheXi !=undefined ){
							self.cheXi = res.data.data.cheXi;
						}else{
							self.cheXi ='';
						}
						if(res.data.data.cheXing !=null && res.data.data.cheXing !='' &&  res.data.data.cheXing !=undefined ){
							self.cheXing = res.data.data.cheXing;
						}else{
							self.cheXing = '';
						}
						if(res.data.data.nianKuan !=null && res.data.data.nianKuan !='' &&  res.data.data.nianKuan !=undefined ){
							self.nianKuan = res.data.data.nianKuan;
						}else{
							self.nianKuan = '';
						}
						if(res.data.data.xiaoShouName !=null && res.data.data.xiaoShouName !='' &&  res.data.data.xiaoShouName !=undefined ){
							self.xiaoShouName = res.data.data.xiaoShouName;
						}else{
							self.xiaoShouName = '';
						}
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			update(){
				var self= this;
				self.$http({
					url: '/nxp-admin/liYang/update/',
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					params:{
						levelId : self.liyangId,
						changJia: self.changJia,
						pinPai: self.pinPai,
						cheXi: self.cheXi,
						cheXing: self.cheXing,
						nianKuan: self.nianKuan,
						xiaoShouName: self.xiaoShouName
					}
				}).then(function(res) {
					if(res.data.flag == 0){
						alert(res.data.msg);
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