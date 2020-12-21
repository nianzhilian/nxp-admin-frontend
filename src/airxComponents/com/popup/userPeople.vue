<!--管理后台用户人员详情-->
<template>
	<span>
	<airx-modal v-model="modal1" :zindex="999" :title="userDetail" size="sm" @on-close="close">
		<Row>
			<Col span="12">
			<Form :label-width="150">
				<FormItem label="用户名" >
					{{data.loginName}}
				</FormItem>
				<FormItem label="名称" >
					{{data.name}}
				</FormItem>
				<FormItem label="电话">
					{{data.phone}}
				</FormItem>
				<FormItem label="座机">
					{{data.telephone}}
				</FormItem>
				<FormItem label="所属部门">
					{{data.deptName}}
				</FormItem>
				<FormItem label="服务车型" >
					{{dataCar}}
				</FormItem>
			</Form>
			</Col>
		</Row>
	</airx-modal>
	</span>
</template>
<script>
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam
	} from '../../../utils/requestHttp.js'
	import {
		getLocalTime,
		dateTrans,
		splitK,
		logHttp
	} from '../../../utils/common.js'

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
				userDetail: '后台人员详情',
				data: {},
				dataCar: '',
			}
		},
		computed: {},
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
					fetchGet('/nxp-admin/serviceUser/serviceCars/' + _self.peopleId).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							_self.dataCar = res.data.join(',');
							fetchGet('/nxp-admin/emp/query/' + _self.peopleId).then((res) => {
								if(res.flag !== 0) {
									this.$Message.error(res.msg);
								} else {
									_self.data = res.data;
								}
							});
						}
					});
				}
			},
			close() {
				this.modal1 = false;
			},
			/*logInfo(){
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
			},*/
		}
	}
</script>