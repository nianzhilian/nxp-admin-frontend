<template>
	<div>
		<Row>
			<Col span="12">全称：{{orgDetailData.fullName}}</Col>
			<Col span="12">固话：{{orgDetailData.telphone}}</Col>
			<Col span="12">地址：{{orgDetailData.address}}</Col>
			<Col span="12">传真：{{orgDetailData.fax}}</Col>
			<Col span="12" v-if="type== 'xlc'">支付方式：{{orgDetailData.payType == 0 ? '现付': '月结'}}</Col>
			<Col span="12" v-if="type== 'xlc'">订单结算方：{{orgDetailData.settlementPartyName}}</Col>
			<Col span="12" v-if="type== 'xlc'">客服：{{customerServiceName}}</Col>
			<Col span="12" v-if="type== 'xlc'">销售：{{saleName}}</Col>
			<Col span="12" v-if="type== 'xlc'">修理厂父级：
				<span  v-if="orgDetailData.hasChild == 0 &&　orgDetailData.parentId !=null && orgDetailData.parentId!=  '' && orgDetailData.parentId != 0">{{parentName}}</span>
				<span  v-if="orgDetailData.hasChild == 0 &&  (orgDetailData.parentId == 0 || orgDetailData.parentId == '' || orgDetailData.parentId == null)"></span>
				<span  v-if="orgDetailData.hasChild == 1 &&  (orgDetailData.parentId == 0 || orgDetailData.parentId == '' || orgDetailData.parentId == null)">（此修理厂有子修理厂）</span>
			</Col>
			<Col span="12" >地区：{{regionName}}</Col>
			
		</Row>
	</div>
</template>
<script>
	export default {
		props: ['type', 'orgId'],
		data() {
			return {
				xlcDetailView: false,
				peopleDetailView: false,
				orgDetailData: [],
				customerServiceName :'',
				saleName : '',
				parentArray:[],
				parentName : '',
				regionAll : [],
				regionStr : '',
				regionName:''
			}
		},
		created() {  
			this.getCookie();
			this.parent();
			this.region()
		},
		watch: {  
			orgId: 'orgDetail',
		},
		methods: {
			getCookie() {
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			},
			//查询客服销售人员
			queryKefu(){
				var self = this;
				self.$http({
					url: '/nxp-admin/cusOrganiztion/orgDev/' + self.orgId,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0){
						self.customerServiceName = res.data.data['customerServiceName'];
						self.saleName = res.data.data['saleName'];
					}else{
						self.$Message.error(res.data.msg);
					}
				})
			},
			//修理厂父级
			parent(){
				var self = this;
				self.$http({
					url: '/nxp-admin/cusOrganiztion/listHas',
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					data:{
						'type' : 3
					}
				}).then(function(res) {
					if(res.data.flag == 0){
						self.parentArray = res.data.data;
					}else{
						self.$Message.error(res.data.msg);
					}
				})
			},
			//地区
			region(){
				var self = this;
				self.$http({
					url: '/nxp-admin/region/all',
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0){
						self.regionAll =res.data.data;
					}else{
						self.$Message.error(res.data.msg);
					}
				})
			},
			//组织详情
			orgDetail() {
				var self = this;
				if(this.orgId != 0){
					self.$http({
						url: '/nxp-admin/cusOrganiztion/cusById/' + self.orgId,
						method: 'GET',
						headers: {
							'token': self.user.token
						}
					}).then(function(res) {
						if(res.data.flag == 0) {
							self.orgDetailData = res.data.data;
							//self.queryKefu();
							if(self.orgDetailData['hasChild'] == 0 && (self.orgDetailData['parentId']!=null || self.orgDetailData['parentId']!= '' || self.orgDetailData['parentId']!=0)){
								for(var i=0;i<self.parentArray.length;i++){
									if(self.orgDetailData['parentId'] == self.parentArray[i]['id']){
										self.parentName = self.parentArray[i]['fullName'];
									}
								}
							}
							self.regionStr = self.orgDetailData['region'].split('-');
							for(var j=0;j<self.regionAll.length;j++){
								if(self.regionAll[j]['id'] == self.regionStr[0]){
									self.regionName = self.regionAll[j]['name'];
									for(var a=0;a<self.regionAll[j]['childNodes'].length;a++){
										if(self.regionAll[j]['childNodes'][a]['id'] == self.regionStr[1]){
self.regionName = self.regionAll[j]['name'] + '-' + self.regionAll[j]['childNodes'][a]['name'];
											for(var b=0;b<self.regionAll[j]['childNodes'][a]['childNodes'].length;b++){
												if(self.regionAll[j]['childNodes'][a]['childNodes'][b]['id'] == self.regionStr[2]){
													self.regionName = self.regionAll[j]['name'] + '-' + self.regionAll[j]['childNodes'][a]['name'] + '-' + self.regionAll[j]['childNodes'][a]['childNodes'][b]['name'];
												}
											}
										}
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