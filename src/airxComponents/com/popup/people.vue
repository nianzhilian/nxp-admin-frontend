<!--人员详情-->
<template>
	<span>
	<airx-modal v-model="modal1" :zindex="999" :title="peopleTypeName" size="sm" @on-close="close">
		<Row>
			<Col span="12">
			<Form :label-width="150">
				<FormItem label="用户名" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.loginName}}
				</FormItem>
				<FormItem label="姓名" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.name}}
				</FormItem>
				<FormItem label="电话" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.phone}}
				</FormItem>
				<FormItem label="邮箱" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.email}}
				</FormItem>
				<FormItem label="性别" v-if="data.type == 3 || data.type == 2 || data.type == 1">
					{{data.sex == '0' ? '男':'女'}}
				</FormItem>
				<FormItem label="QQ" v-if="data.type == 3">
					{{data.qq}}
				</FormItem>
				<FormItem label="出生日期" v-if="data.type == 3">
					{{data.birthDay}}
				</FormItem>
				<FormItem label="角色" v-if="data.type == 3">
					{{data.xxxx}}
				</FormItem>
			</Form>
			</Col>
			<Col span="12">
			<Form :label-width="150">
				<FormItem label="是否是维修顾问" v-if="data.type ==  3">
					{{data.isAdvisor == '0' ? '是':'否'}}
				</FormItem>
				<FormItem label="是否是收货人" v-if="data.type == 3">
					{{data.isConsignee == '0' ? '是':'否'}}
				</FormItem>
			</Form>
			</Col>
		</Row>
	</airx-modal>
	</span>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK,logHttp } from '../../../utils/common.js'

	export default {
		props: {
			isGlobalSearch: {
				type: String
			}
		},
		components: {},
		data() {
			return {
				peopleId: '',
				rowAdd: {},
				modal1: false,
				data: {},
				columns1: [{
						title: 'ID',
						key: 'id',
						width: 120,
					},
					{
						title: '用户名',
						key: 'loginName'
					},
					{
						title: '姓名',
						key: 'name'
					},
					{
						title: '电话',
						key: 'phone'
					},
					{
						title: '性别',
						key: 'sex',
						width: 80,
						render: (h, params) => {
							return params.row.status == 0 ? '男' : '女';
						}
					},
					{
						title: '注册时间',
						key: 'createTime',
						render: (h, params) => {
							return dateTrans(params.row.createTime);
						}
					},
					{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							return params.row.status == 0 ? '正常' : '失效';
						}
					}
				],
			}
		},
		computed: {
			peopleTypeName() {
				if(this.data.type == 1) return '配件商人员信息'
				if(this.data.type == 2) return '保险公司人员信息'
				if(this.data.type == 3) return '修理厂人员信息'
			}
		},
		watch: {
			peopleId() {
				//this.initData();
			}
		},
		methods: {
			initData(id) {
				let _self = this;
				_self.peopleId = id;
				if(_self.peopleId != undefined) {
					this.modal1 = true;

					fetchGet('/nxp-admin/systemUser/bySysId/' + _self.peopleId).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.$Message.success(res.msg);
							_self.data = res.data;
							this.logInfo();
						}
					});
				}
			},
			logInfo(){
				if(this.modal1){
				switch (this.data.type) {
					case 1:
							if(this.isGlobalSearch == 'yes'){
								this.$store.commit('setSourceInfo', {
									sourceUri: this.$store.state.sourceInfo.sourceUri,
									currentUri: '/dashboard/globalSearch/supplierUserInfo',
									tempPath:this.$store.state.sourceInfo.tempPath
								});
							}else{
								this.$store.commit('setSourceInfo', {
									sourceUri: this.$store.state.sourceInfo.sourceUri,
									currentUri: '/globalAirUser/supplierUserInfo',
									tempPath:this.$store.state.sourceInfo.tempPath
								});
							}
							logHttp(this.$store.state.sourceInfo,'配件商人员信息',fetchPostUrlencoded);
						break;
					case 2:
					if(this.isGlobalSearch == 'yes'){
						 this.$store.commit('setSourceInfo', {
						 sourceUri: this.$store.state.sourceInfo.sourceUri,
						 currentUri: '/dashboard/globalSearch/insurerUserInfo',
						 tempPath:this.$store.state.sourceInfo.tempPath
					 });
					 }else{
						 this.$store.commit('setSourceInfo', {
							 sourceUri: this.$store.state.sourceInfo.sourceUri,
							 currentUri: '/globalAirUser/insurerUserInfo',
							 tempPath:this.$store.state.sourceInfo.tempPath
						 });
					 }
					  logHttp(this.$store.state.sourceInfo,'保险公司人员信息',fetchPostUrlencoded);
						break;
					case 3:
					if(this.isGlobalSearch == 'yes'){
							this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/dashboard/globalSearch/repairerUserInfo',
							tempPath:this.$store.state.sourceInfo.tempPath
						});
						}else{
 						 this.$store.commit('setSourceInfo', {
 							 sourceUri: this.$store.state.sourceInfo.sourceUri,
 							 currentUri: '/globalAirUser/repairerUserInfo',
 							 tempPath:this.$store.state.sourceInfo.tempPath
 						 });
 					 }
					 logHttp(this.$store.state.sourceInfo,'修理厂人员信息',fetchPostUrlencoded);
						break;
				}
				}
			},
			close() {
				this.modal1 = false;
			},
		}
	}
</script>

<style>

</style>
