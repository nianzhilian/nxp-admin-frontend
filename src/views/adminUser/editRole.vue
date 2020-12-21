<template>
	<div>
		<Form ref="editRoleData.theForm" :model="editRoleData.theForm" :label-width="80">
			<FormItem label="角色">
				<Row>
					<Col span='6' v-for='val in editRoleObj' :key="val.id">
					<CheckboxGroup v-model="roleIds">
						<Checkbox :label="val.id">{{val.name}}</Checkbox>
					</CheckboxGroup>
					</Col>
				</Row>
			</FormItem>
			<FormItem>
				<Button type="primary" @click="subRole">更新</Button>
			</FormItem>
		</Form>
	</div>
</template>

<script>
	import {
		md5,
		logHttp
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet
	} from '../../utils/requestHttp.js'
	import Ajax from '../../utils/ajax.js'
	export default {
		props: ['peopleId', 'depart'],
		data() {
			return {
				editRoleObj: [],
				roleIds: [],
				//编辑角色
				editRoleData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
					}
				},
			}
		},
		mounted() {
			this.getCheckRole();
		},
		created() {},
		watch: {},
		methods: {
			//获取用默认用户角色
			getCheckRole() {
				let status = {
					"status": 1
				};
				Ajax.get("/nxp-admin/Roles", status).then((res) => { //获取所有角色
					if(res.code == 200) {
						this.editRoleObj = res.data;
						this.$Message.success(res.msg);
						var url = !this.depart ? '/nxp-admin/ServiceUsers/' : '/nxp-admin/ServiceDepts/';
						Ajax.get(url + this.peopleId).then((res) => { //获取默认角色
							if(res.code == 200) {
								this.roleIds = res.data.roleIds;
								this.$Message.success(res.msg);
							} else {
								this.$Message.error(res.msg);
							}
						});
					} else {
						this.$Message.error(res.msg);
					}
				});
			},
			//更新用户角色
			subRole() {
				let roleIds = this.roleIds;
				var url1 = "/nxp-admin/ServiceUsers/" + this.peopleId + "/updateRoles";
				var url2 = "/nxp-admin/ServiceDepts/" + this.peopleId + "/updateDeptRoles";
				var url = !this.depart ? url1 : url2
				Ajax.patch(url, roleIds).then((res) => {
					if(res.code == 200) {
						this.$Message.success(res.msg);
						if(!this.depart) {
							this.$emit('closeRoles', '');
						}
					} else {
						this.$Message.error(res.msg);
					}
				});
			},
		}
	}
</script>

<style>

</style>