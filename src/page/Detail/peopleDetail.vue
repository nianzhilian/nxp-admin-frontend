<template>
	<div>
		<Row>
			<Col span="12">用户名：{{orgPeopleDetailData.loginName}}</Col>
			<Col span="12">姓名：{{orgPeopleDetailData.name}}</Col>
			<Col span="12">电话：{{orgPeopleDetailData.phone}}</Col>
			<Col span="12">邮箱：{{orgPeopleDetailData.email}}</Col>
			<Col span="12" >性别：{{orgPeopleDetailData.sex == 0 ? '男' : '女'}}</Col>
			<Col span="12">QQ：{{orgPeopleDetailData.qq}}</Col>
			<Col span="12">出生日期：{{orgPeopleDetailData.birthDay}}</Col>
			<!--<Col span="12" v-if="type== 'xlc'">是否是维修顾问：{{orgPeopleDetailData.isAdvisor == 0 ? "是" : '否'}}</Col>
			<Col span="12" v-if="type== 'xlc'">是否是收货人：{{orgPeopleDetailData.isConsignee == 0 ? "是" : '否'}}</Col>-->
			<Col span="12" v-if="type== 'ins'">是否是定损员：{{orgPeopleDetailData.isDamage == 0 ? "是" : '否'}}</Col>
			<Col span="12" >角色：<span v-for="val in roleArray">{{val}} &nbsp; &nbsp;</span></Col>
		</Row>
	</div>
</template>
<script>
export default {
		props: ['type','userId'],
		data() {
			return {
				xlcDetailView: false,
				peopleDetailView: false,
				orgPeopleDetailData :[],
				funRoles : [],
				roleArray:[]
			}
		},
		created() {  
			this.getCookie();
			this.allRole()
		},
		watch: {  
			userId: 'orgPeopleDetail',
		},
		methods: {
			getCookie() {
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			},
			//查询所有权限
			allRole(){
				var self = this;
				self.$http({
					url: '/nxp-admin/role/all/C_I',
					method: 'GET',
					headers: {
						"token": self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0){
						self.funRoles = res.data.data;	
					}else{
						self.$Message.error(res.data.msg);
					}
				})	
			},
			//人员详情
			orgPeopleDetail(){
				var self = this;
				self.roleArray = [];
				if(this.userId != 0){
					self.$http({
						url: '/nxp-admin/systemUser/bySysId/' + self.userId,
						method: 'GET',
						headers: {
							'token': self.user.token
						}
					}).then(function(res) {
						if(res.data.flag == 0) {
							self.orgPeopleDetailData = res.data.data;
							for(var i=0;i<self.funRoles.length;i++){
								for(var j=0;j<self.orgPeopleDetailData.userRole.length;j++){
									if(self.funRoles[i]['id'] == self.orgPeopleDetailData.userRole[j]['roleId']){
										self.roleArray.push(self.funRoles[i]['name']);
									}
								}
							}
						} else {
							self.$Message.error(res.data.msg);
						}
					});
				}
			}
		}
	}
</script>
<style>

</style>