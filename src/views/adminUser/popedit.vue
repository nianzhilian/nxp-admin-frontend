<template>
	<div>
		<Form ref="systemSettingData.theForm" :model="systemSettingData.theForm" :rules="systemSettingData.theRule" :label-width="80">
			<FormItem label="登录名" prop="loginName">
				<Input v-model="systemSettingData.theForm.loginName" v-if="peopleId ==''"></Input>
				<Input v-model="systemSettingData.theForm.loginName" disabled v-else="peopleId !=''"></Input>
			</FormItem>
			<FormItem label="密码">
				<Input v-model="systemSettingData.theForm.pwd" type='password'></Input>
			</FormItem>
			<FormItem label="重置密码" prop="resPwd" v-show="peopleId == ''">
				<Input v-model="systemSettingData.theForm.resPwd" type='password'></Input>
			</FormItem>
			<FormItem label="名称" prop="name">
				<Input v-model="systemSettingData.theForm.name"></Input>
			</FormItem>
			<FormItem label="电话" prop="phone">
				<Input v-model="systemSettingData.theForm.phone" v-if="peopleId ==''"></Input>
				<Input v-model="systemSettingData.theForm.phone" disabled v-else="peopleId !=''"></Input>
			</FormItem>
			<FormItem label="座机" prop="telephone">
				<Input v-model="systemSettingData.theForm.telephone"></Input>
			</FormItem>
			<FormItem label="邮箱" prop="email" v-show="peopleId == ''">
				<Input v-model="systemSettingData.theForm.email"></Input>
			</FormItem>
			<FormItem>
				<Button type="primary" @click="subForm">{{peopleId ? '更新' :'新增' }}</Button>
			</FormItem>
		</Form>
		<div v-if="peopleId">
			<Tabs type="card" @on-click='tag'>
				<TabPane label="所属部门" name="SubordinateDepartment"></TabPane>
			</Tabs>
			<Row>
				<Col span="18" style="margin:10px 0 20px 30px">
				<Button type="primary" @click="toUpdate">更新</Button>
				</Col>
			</Row>
			<div v-if="tagType=='SubordinateDepartment'" style="margin-left:30px;line-height:32px;">
				<Row>
					<Col span='6' v-for='val in deptData' :key="val.id">
					<CheckboxGroup v-model="deptIds">
						<Checkbox :label="val.id">{{val.name}}</Checkbox>
					</CheckboxGroup>
					</Col>
				</Row>
			</div>
		</div>
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
		props: ['peopleId'],
		data() {
			return {
				deptData: [],
				tagType: 'SubordinateDepartment',
				deptIds: [], //部门ID
				//新增 编辑
				systemSettingData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
						name: '',
						loginName: '',
						pwd: '',
						resPwd: '',
						roleIds: [],
						phone: '',
						telephone: '',
						email: '',
						serviceCar: []
					},
					theRule: {
						name: [{
							required: true,
							message: '名称不能为空',
							trigger: 'blur'
						}],
						loginName: [{
							required: true,
							message: '登录名不能为空',
							trigger: 'blur'
						}],
						email: [{
							required: true,
							message: '邮箱不能为空',
							trigger: 'blur'
						}],
						resPwd: [{
							required: true,
							message: '重复密码不能为空',
							trigger: 'blur'
						}],
						phone: [{
							required: true,
							message: '电话不能为空',
							trigger: 'blur'
						}]
					}
				},
			}
		},
		created() {},
		mounted() {
			this.getUser();
		},
		watch: {
			peopleId: "getUser",
		},
		methods: {
			tag(a) {
				this.tagType = a;
			},
			//更新部门等
			toUpdate() {
				var _self = this;
				Ajax.patch("/nxp-admin/ServiceUsers/" + _self.systemSettingData.theForm.id + "/updateDepts", _self.deptIds).then((res) => {
					if(res.code == 200) {
						_self.$Message.success(res.msg);
					} else {
						_self.$Message.error(res.msg);
					}
				});
			},
			//获取人员信息
			getUser() {
				if(this.peopleId) {
					Ajax.get('/nxp-admin/ServiceUsers/' + this.peopleId, ).then((res) => {
						if(res.code == 200) {
							this.systemSettingData.theForm.id = this.peopleId;
							this.systemSettingData.theForm.name = res.data.name;
							this.systemSettingData.theForm.loginName = res.data.loginName;
							this.systemSettingData.theForm.phone = res.data.phone;
							this.systemSettingData.theForm.email = res.data.email;
							this.deptIds = res.data.deptIds;
							this.systemSettingData.theForm.telephone = res.data.telephone;
							this.getDept();
						} else {
							this.$Message.error(res.msg);
						}
					});
				}
			},
			//获取所属部门
			getDept() {
				this.loading = true;
				let status = {
					'status':1
				};
				Ajax.get('/nxp-admin/ServiceDepts',status ).then((res) => {
					this.btnLoading = false;
					if(res.code == 200) {
						this.deptData = res.data;
					} else {
						this.$Message.error(res.msg);						
					}
				})
			},
			//提交新增 修改
			subForm: function() {
				if(this.systemSettingData.theForm.id == '') {
					this.$refs["systemSettingData.theForm"].validate((valid) => {
						if(valid) {
							if(this.systemSettingData.theForm.pwd == this.systemSettingData.theForm.resPwd) {
								if(this.systemSettingData.theForm.pwd == '') {
									this.$Message.error('请输入密码');
								} else {
									let obj = {
										'name': this.systemSettingData.theForm.name,
										'loginName': this.systemSettingData.theForm.loginName,
										'passWord': (md5(this.systemSettingData.theForm.pwd)).toUpperCase(),
										'phone': this.systemSettingData.theForm.phone,
										'email': this.systemSettingData.theForm.email,
										'telephone': this.systemSettingData.theForm.telephone,
									}
									Ajax.post("/nxp-admin/ServiceUsers", obj).then((res) => {
										if(res.code == 200) {
											this.$emit('close', false);
											this.$Message.success(res.msg);
										} else {
											this.$Message.error(res.msg);
										}
									});
								}
							} else {
								this.$Message.error('两次输入密码不一致!');
							}
						} else {
							this.$Message.error('表单验证失败!');
						}
					})
				} else {
					let empId = this.systemSettingData.theForm.id;
					let obj = {
						'name': this.systemSettingData.theForm.name,
						'passWord': this.systemSettingData.theForm.pwd ? (md5(this.systemSettingData.theForm.pwd)).toUpperCase() : '',
						'phone': this.systemSettingData.theForm.phone,
						'telephone': this.systemSettingData.theForm.telephone,
						'email': this.systemSettingData.theForm.email,
					};
					Ajax.put("/nxp-admin/ServiceUsers/" + empId, obj).then((res) => {
						if(res.code ==200) {
							/*this.$emit('close', false);*/
							this.$Message.success(res.msg);
						} else {
							this.$Message.error(res.msg);
						}
					});
				}
			}
		}
	}
</script>

<style>

</style>