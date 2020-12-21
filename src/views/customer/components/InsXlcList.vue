<template>
	<div>
		<div class="ivu-table-wrapper">
			<div class="ivu-table ivu-table-border">
				<div class="ivu-table-header">
					<table cellspacing="0" cellpadding="0" border="0" style="width:100% ;">
						<colgroup>
						 <col width="50%" />
						 <col width="50%" />
						</colgroup>
						<thead>
							<tr>
								<th class="ivu-table-column-center">
									<div class="ivu-table-cell">
										<span>保险公司</span>
									</div>
								</th>
								<th class="ivu-table-column-center">
									<div class="ivu-table-cell">
										<span>定损员</span>
									</div>
								</th>
							</tr>
						</thead>
					</table>
				</div>
				<div class="ivu-table-body">
					<table cellspacing="0" cellpadding="0" border="0" style="width:100% ;">
						<colgroup>
						 <col width="50%" />
						 <col width="50%" />
						</colgroup>
						<tbody>
							<tr class="ivu-table-row" :key="val.orgId" v-for="val in xlcData">
								<td class="ivu-table-column-center">
										<div class="ivu-table-cell">
											<span @click="orgDetail(val.orgId)">{{val.orgName}}</span>
										</div>
								</td>
								<td class="ivu-table-column-center">
										<div class="ivu-table-cell">
											<span v-for="ite in val.users" :key="ite.userId">
												<span  @click="orgPeopleDetail(ite.userId)">{{ite.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											</span>
										</div>
									</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<Modal title="保险公司详细" width="820" v-model="xlcDetailView" :mask-closable="false" :closable="false">
			<OrgDetail type="ins" :orgId='orgId'></OrgDetail>
		</Modal>
		<Modal title="人员详细" width="820" v-model="peopleDetailView" :mask-closable="false" :closable="false">
			<peopleDetail type="ins" :userId='userId'></peopleDetail>
		</Modal>
	</div>
</template>
<script>
	import { setBodyAtt } from '../../../utils/common.js'
	import { fetchGet } from '../../../utils/requestHttp.js'
	import OrgDetail from './OrgDetail'
	import peopleDetail from './peopleDetail'
	export default {
		props:{
			type:Number,
			rowObj:{
				type:Object,
				default:{}
			}
		},
		components: {
			OrgDetail,
			peopleDetail
		},
		watch:{
			xlcDetailView(val){
				if(!val){
					setBodyAtt();
				}
			},
			peopleDetailView(val){
				if(!val){
					setBodyAtt();
				}
			}
		},
		data() {
			return {
				orgId: 0,
				userId: 0,
				xlcDetailView: false,
				peopleDetailView: false,
				xlcData: []
			}
		},
		created() {
			this.getXlcList();
		},
		methods: {
			getXlcList() {
				fetchGet('/nxp-admin/cusOrganiztion/refInsList/'+this.rowObj.id).then((res)=>{
					if(res.flag == 0) {
						this.xlcData = res.data;
					} else {
						this.$Message.error({
							content:res.data.msg
						});
					}
				})
			},
			//人员详情
			orgPeopleDetail(id) {
				this.peopleDetailView = true;
				this.userId = id;
			},
			//组织详情
			orgDetail(id) {
				this.xlcDetailView = true;
				this.orgId = id;
			},
			viewOrg(index) {
				this.xlcDetailView = !this.xlcDetailView;
			},
			viewPeople(index) {
				this.peopleDetailView = !this.peopleDetailView;
			}
		}
	}
</script>
<style>

</style>
