<template>
	<div>
		<div class="example-case" slot="content">
			<div class="ivu-table-wrapper">
				<div class="ivu-table-tab ivu-table-border" style="text-align: right;">
					<table border="0" cellspacing="0" cellpadding="0" style="width:100% ;text-align: left;line-height: 36px;font-size: 12px;">
						<tr>
							<th>修理厂名称</th>
							<th>定损员</th>
						</tr>
						<tr v-for="val in xlcData">
							<td><span @click="orgDetail(val.orgId)">{{val.orgName}}</span></td>
							<td style="text-align: center;">
								<span v-for="ite in val.users">
									<span  @click="orgPeopleDetail(ite.userId)">{{ite.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								</span>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<Modal title="修理厂详细" width="820" v-model="xlcDetailView" :mask-closable="false" :closable="false">
			<OrgDetail type="xlc" :orgId='orgId'></OrgDetail>
		</Modal>
		<Modal title="人员详细" width="820" v-model="peopleDetailView" :mask-closable="false" :closable="false">
			<peopleDetail type="xlc" :userId='userId'></peopleDetail>
		</Modal>
	</div>
</template>
<script>
	import OrgDetail from '../Detail/OrgDetail'
	import peopleDetail from '../Detail/peopleDetail'
	export default {
		components: {
			OrgDetail,
			peopleDetail
		},
		data() {
			return {
				orgId: 0,
				userId: 0,
				commonInsId: '',
				xlcDetailView: false,
				peopleDetailView: false,
				xlcData: []
			}
		},
		created() {
			this.getCookie();
			this.getXlcList();
		},
		methods: {
			getCookie() {
				this.commonInsId = this.$route.query.insId;
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			},
			getXlcList() {
				var self = this;
				self.$http({
					url: '/nxp-admin/cusOrganiztion/refXlcList/' + self.commonInsId,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.xlcData = res.data.data;
					} else {
						self.$Message.error(res.data.msg);
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