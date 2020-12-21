<template>
	<div class="example-case">
		<div class="air-title h3">部门管列表 </div>
		<Row>
			<Col span="12">
			<Button type="primary" icon="plus-round" @click="addDept('')">新增</Button>
			</Col>
		</Row>
		<br />
		<Table border :columns="columns7" :data="data"></Table>
		<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
		<Modal width='1200' v-model="deptData.theModal.show" :title="deptData.theModal.title" :mask-closable="false">
			<Form ref="deptData.theForm" :model="deptData.theForm" :rules="deptData.theRule" :label-width="80" v-if="deptData.theModal.show">
				<FormItem label="名称" prop="name">
					<Input v-model="deptData.theForm.name"></Input>
				</FormItem>
				<FormItem label="负责人">
					<Select v-model="deptData.theForm.info" filterable clearable>
						<Option v-for="item in deptData.theForm.infoData" :value="item.id" :key="item.id">{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="备注">
					<Input v-model="deptData.theForm.remark" placeholder="非必填"></Input>
				</FormItem>
				<FormItem label="电话">
					<Input v-model="deptData.theForm.phone" placeholder="非必填"></Input>
				</FormItem>
				<FormItem label="上级部门">
					<Select v-model="deptData.theForm.parentId" clearable>
						<Option v-for="item in deptData.theForm.deptInfoData" :key="item.id" :value="item.id">{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="subForm" v-if="!deptData.theForm.id">新增</Button>
					<Button type="primary" @click="subForm" v-if="deptData.theForm.id">更新</Button>
				</FormItem>
			</Form>
      <br />
      <Tabs value="name1" type="card" v-if="deptData.theForm.id">
        <TabPane label="角色" name="name1">
          <editRole :peopleId='deptData.theForm.id' :depart="true"></editRole>
        </TabPane>
        <TabPane label="标签" name="name2">
          <departmentLable :peopleId="deptData.theForm.id"></departmentLable>
        </TabPane>
      </Tabs>
			<div v-show="deptData.theForm.id">
				<div class="row">
					<div class="col-sm-12">
						<div class="air-space">人员列表<span style="margin-left:1030px;">总数：{{DeptUserPage.total}}</span></div>
					</div>
				</div>
				<Row style='padding:0 0 24px 0;'>
					<Col span="12">
					<Button type="primary" icon="plus-round" @click="addUser('')">新增人员</Button>
					</Col>
					<Col span="12"><span style="float: right;">
						 <Select v-model="roleId"  clearable style="width:200px" >
					      <Option v-for="item in roleData" :value="item.id" :key="item.id">{{item.name}}</Option>
					    </Select>
						<input v-model="str" v-on:keyup.13="searchObj"   class="i-input" placeholder="请输入用户名或姓名检索"><Button type="ghost" @click="searchObj" icon="ios-search">搜索</Button></span></Col>
				</Row>
				<!--<Table border :columns="columns8" :data="data8"></Table>-->
				<div class="ivu-table-wrapper ">
					<div class="ivu-table ivu-table-border">
						<table border='0' cellspacing="0" cellpadding="0" style="width: 1167px;">
							<thead>
								<tr>
									<th class="ivu-table-cell" width='80'>ID</th>
									<th class="ivu-table-cell">名称</th>
									<th class="ivu-table-cell">登录名称</th>
									<th class="ivu-table-cell">电话</th>
									<th class="ivu-table-cell">所属部门</th>
									<th class="ivu-table-cell">角色</th>
									<th class="ivu-table-column-center">操作</th>
								</tr>
							</thead>
							<tbody class="ivu-table-tbody">
								<tr v-for="val in data8">
									<td class="ivu-table-cell">{{ val.id }}</td>
									<td class="ivu-table-cell">{{ val.name }}</td>
									<td class="ivu-table-cell">{{ val.loginName }}</td>
									<td class="ivu-table-cell">{{val.phone}}</td>
									<td class="ivu-table-cell">{{val.deptNames}}</td>
									<td class="ivu-table-cell">{{val.roleNames}}</td>
									<td class="ivu-table-column-center">
										<Button type="text" @click='userEdit(val.id)'>编辑</Button >
										<!--<span   type="text"  @click='editService(val.id)'>编辑服务车型</span >-->
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<br />
				<Row>
					<Col>
						<Page :total="DeptUserPage.total" :page-size="DeptUserPage.pageSize" @on-change="changeUserPage" show-total :current="DeptUserPage.current" style="float: right;"></Page>
					</Col>
				</Row>
			</div>
			<div slot="footer">
			</div>
		</Modal>
		<!--部门新增人员-->
		<Modal width='1200' v-model="userData.theModal.show" :title="userData.theModal.title" :mask-closable="false">
			<Row>
				<Col span="11">
				<Row class="air-space">
					<h3>全部人员：{{userData.theForm.allUserData.length}}人</h3>
				</Row>
				<Row>
					<Col span="24">
					<Input v-model="userInput" @on-change="userChange">
					<Button slot="append" icon="ios-search"></Button>
					</Input>
					</Col>
				</Row>
				<div class="ivu-table-wrapper" style="margin-top:15px;">
					<div class="ivu-table ivu-table-border">
						<div class="ivu-table-header">
							<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
								<colgroup>
									<col width="80" />
									<col width="160" />
									<col />
								</colgroup>
								<thead>
									<tr>
										<th>
											<div class="ivu-table-cell">#</div>
										</th>
										<th>
											<div class="ivu-table-cell">名称</div>
										</th>
										<th>
											<div class="ivu-table-cell">所属部门</div>
										</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="ivu-table-body" style="height: 400px;">
							<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
								<colgroup>
									<col width="80" />
									<col width="160" />
									<col />
								</colgroup>
								<tbody>
									<tr v-for="val in userData.theForm.allUserData">
										<td>
											<div class="ivu-table-cell">
												<Checkbox @on-change="checkFun(val.id,val.checked)" v-model="val.checked"></Checkbox>
											</div>
										</td>
										<td>
											<div class="ivu-table-cell">{{ val.name }}</div>
										</td>
										<td>
											<div class="ivu-table-cell">{{val.deptNames}}</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				</Col>
				<Col span="11" offset="2">
				<Row class="air-space">
					<h3>已选人员：{{userData.theForm.checkUserData.length}}人</h3>
				</Row>
				<div class="ivu-table-wrapper" style="margin-top: 65px;">
					<div class="ivu-table ivu-table-border">
						<div class="ivu-table-header">
							<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
								<colgroup>
									<col width="160" />
									<col />
								</colgroup>
								<thead>
									<tr>
										<th>
											<div class="ivu-table-cell">名称</div>
										</th>
										<th>
											<div class="ivu-table-cell">所属部门</div>
										</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="ivu-table-body" style="height: 400px;">
							<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
								<colgroup>
									<col width="160" />
									<col />
								</colgroup>
								<tbody>
									<tr v-for="val in userData.theForm.checkUserData">
										<td>
											<div class="ivu-table-cell">{{ val.name }}</div>
										</td>
										<td>
											<div class="ivu-table-cell">{{val.deptNames}}</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				</Col>
			</Row>
			<br />
			<Row>
				<Col span="24">
				<Button type="primary" @click="subUser">提交</Button>
				</Col>
			</Row>
			<div slot="footer">
				<!--<Button type="ghost" size="large" long @click="userData.theModal.show = false">关闭</Button>-->
			</div>
		</Modal>
		<Modal width='1200' v-model="systemSettingData.theModal.show" :title="systemSettingData.theModal.title" :mask-closable="false">
			<popedit :peopleId='editId' v-if="systemSettingData.theModal.show" v-on:erzishuo="erzishuo">
			</popedit>
			<div slot="footer">
				<!--<Button type="ghost" size="large" long @click="userClose">关闭</Button>-->
			</div>
		</Modal>
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
	import popedit from '../adminUser/popedit'
	import Ajax from '../../utils/ajax.js'
 	import departmentLable from './departmentLable.vue'
 	import editRole from '../adminUser/editRole'
	export default {
		components: {
			popedit,
      departmentLable,
      editRole,
		},
		data() {
			return {
				firstTab:'name1',
				tagId:'',
				userInput: '',
				tempAllUserData: [],
				editId: '',
				userServicId: '',
				loading: false,
				btnLoading: false,
				userlView: false,
				deptId: '',
				single: '',
				str: '',
				roleId: '', // 查询角色ID
				page: {
					status: -1,
					total: 0,
					current: 1,
					pageSize: 15
				},
				DeptUserPage:{
					status: -1,
					total: 0,
					current: 1,
					pageSize: 15
				},
				//部门
				columns7: [{
					title: '状态',
					width: 60,
					align: 'center',
					render: (h, params) => {
						if(params.row.status == 1) {
							return h('span', {
								style: {
									background: '#19be6b',
									overflow: 'hidden',
									color: '#19be6b',
									width: '10px',
									height: '10px',
									display: 'inline-block',
									'border-radius': '100px'
								}
							}, 'ok')
						} else {
							return h('span', {
								style: {
									background: '#ed3f14',
									overflow: 'hidden',
									color: '#ed3f14',
									width: '10px',
									height: '10px',
									display: 'inline-block',
									'border-radius': '100px'
								}
							}, 'no')
						}
					}
				}, {
					title: '名称',
					key: 'name'
				}, {
					title: '负责人',
					key: 'leaderName'
				}, {
					title: '电话',
					key: 'phone'
				}, {
					title: '上级部门',
					key: 'parentName'
				}, {
					title: '职能',
					key: 'tagNames'
				}, {
					title: '备注',
					key: 'remark'
				}, {
					title: '操作',
					key: 'action',
					width: 300,
					align: 'center',
					render: (h, params) => {
						if(params.row.status == 1) {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.addDept(params.row.id)
										}
									}
								}, '编辑'),
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.changeStatus(params.row.id, 0)
										}
									}
								}, '禁用')
							]);
						} else {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.addDept(params.row.id)
										}
									}
								}, '编辑'),
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.changeStatus(params.row.id, 1)
										}
									}
								}, '启用')
							]);
						}
					}
				}],
				data: [],
				data8: [], //人员列表数据
				roleData: [], // 新增编辑 变量
				tagData: [],
				deptData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
						name: '',
						loginName: '',
						info: '',
						infoData: '', //负责人
						deptInfoData: [], //上级部门
						tagIds: [],
						parentId: '',
						roleIds: [],
						phone: '',
					},
					theRule: {
						name: [{
							required: true,
							message: '名称不能为空',
							trigger: 'blur'
						}],
					},
				},
				userData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
						name: '',
						loginName: '',
						dept: '',
						phone: '',
						allUser: [],
						checkUser: [],
						allUserData: [],
						checkUserData: [], //所有已选数据
						checkUserIds: [] // 已选ID
					}
				},
				systemSettingData: {
					theModal: {
						show: false,
						title: ''
					}
				},
				//修改服务车型
				serviceCarData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						userId: '',
						targetNames: [],
						serviceData: [],
						targetKeys: [],
						allCarData: []
					}
				}
			}
		},
		mounted() {
			logHttp(this.$store.state.sourceInfo, '部门管理', fetchPostUrlencoded);
		},
		watch: {},
		created() {
			this.getDepart();
		},
		methods: {
			vague(keyWord, data) {
				var list = data;
				var len = data.length;
				var arr = [];
				var reg = new RegExp(keyWord);
				for(var i = 0; i < len; i++) {
					//如果字符串中不包含目标字符会返回-1
					if(list[i].name.match(reg)) {
						arr.push(list[i]);
					}
				}
				return arr;
			},
			userChange(event) {
				this.userData.theForm.allUserData = this.vague(this.userInput, this.tempAllUserData);
			},
			erzishuo(userServicId) {
				this.editService(userServicId);
			},
			//编辑服务车型
			editService(userServicId) {
				this.serviceCarData.theModal.show = true;
				//父组件调用子组件方法
				this.$refs.serviceCar.updserviceCar(userServicId);
			},
			//关闭部门人员编辑
			userClose() {
				this.systemSettingData.theModal.show = false;
				this.getDeptUser();
			},
			//关闭服务车型
			closeService() {
				this.serviceCarData.theModal.show = false;
				this.$refs.serviceCar.getServiceCar();
			}, //人员编辑
			userEdit(id) {
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/dept/deptEditUser',
					tempPath: this.$store.state.sourceInfo.tempPath
				});
        		this.systemSettingData.theModal.title='人员编辑';
				logHttp(this.$store.state.sourceInfo, '人员编辑', fetchPostUrlencoded);
				this.systemSettingData.theModal.show = true;
				this.editId = id;
			},
			//新增人员
			addUser() {
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/dept/deptAddUser',
					tempPath: this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo, '部门新增人员', fetchPostUrlencoded);
				this.userData.theModal.show = true;
        		this.systemSettingData.theModal.title='新增人员';
       			this.userData.theModal.title = "部门新增人员";
				this.userData.theForm.checkUserData = [];
				this.userData.theForm.checkUserIds = [];
				this.getUser();
			},
			//提交新增人员
			subUser() {
		        Ajax.patch('/nxp-admin/ServiceDepts/'+this.deptId+'/updateDeptMembers',this.userData.theForm.checkUserIds).then((res) => {
		          if(res.code == 200){
		            this.$Message.success(res.msg);
		            this.userData.theModal.show = false;
		            this.getDeptUser();
		          }
		        });
			},
			//获取人员列表
			getDeptUser() {
			    let obj={
            'deptId':this.deptId,
            'roleId': this.roleId ? this.roleId : '',
            'searchName': this.str,
            'status': this.DeptUserPage.status,
            'page': this.DeptUserPage.current,
            'per_page': this.DeptUserPage.pageSize
          }
          Ajax.get("/nxp-admin/ServiceUsers", obj).then((res) => {
            if(res.code == 200){
              this.loading = false;
              this.DeptUserPage.total = res.count;
              this.data8 = res.data;
              if(res.count <= this.DeptUserPage.pageSize && this.DeptUserPage.current != 1) {
                this.changeUserPage(1);
              }
            }
        });
			},
			//获取已选人员
			getUser() {
				var obj={
					"status":'-1'
				}
				Ajax.get("/nxp-admin/ServiceUsers", obj).then((res) => {
		            if(res.code == 200){
		            	this.userData.theForm.allUserData = res.data; //所有人员
								this.tempAllUserData = res.data;
								let obj={
						            'deptId':this.deptId,
						            'status': this.DeptUserPage.status,
			        			}
								Ajax.get("/nxp-admin/ServiceUsers", obj).then((responce) => {
							    	if(responce.code == 200){
											for(var i = 0; i < this.userData.theForm.allUserData.length; i++) {
												this.userData.theForm.allUserData[i]['checked'] = false;
									             for(var j = 0; j < responce.data.length; j++) {
													if(this.userData.theForm.allUserData[i]['id'] == responce.data[j]['id']) {
														this.userData.theForm.allUserData[i]['checked'] = true;
														this.userData.theForm.checkUserData.push(this.userData.theForm.allUserData[i]); //存放已选所有数据
														this.userData.theForm.checkUserIds.push(this.userData.theForm.allUserData[i]['id']); //存放已选ID
													}
												}
								            }
									}
								});
							    
		            }
		        });
				
				/*fetchPostUrlencoded('/nxp-admin/emp/EmpByDept/' + this.deptId, {
					'roleId': this.roleId ? this.roleId : 0,
					'key': '',
				}).then((res) => {
					this.btnLoading = false;
					if(res.code !== 200) {
						this.$Message.error(res.msg);
					} else {
						this.userData.theForm.checkUser = res.data;
						//获取所有人员
						fetchPostUrlencoded("/nxp-admin/emp/all", {}).then((res) => {
							if(res.code !== 200) {
								this.$Message.error(res.msg);
							} else {
								this.userData.theForm.allUserData = res.data; //所有人员
								this.tempAllUserData = res.data;
								for(var i = 0; i < this.userData.theForm.allUserData.length; i++) {
									this.userData.theForm.allUserData[i]['checked'] = false;
									for(var j = 0; j < this.userData.theForm.checkUser.length; j++) {
										if(this.userData.theForm.allUserData[i]['id'] == this.userData.theForm.checkUser[j]['id']) {
											this.userData.theForm.allUserData[i]['checked'] = true;
											this.userData.theForm.checkUserData.push(this.userData.theForm.allUserData[i]); //存放已选所有数据
											this.userData.theForm.checkUserIds.push(this.userData.theForm.allUserData[i]['id']); //存放已选ID
										}
									}

								}
							}
						});
					}
				}).catch(() => {
					this.btnLoading = false;
					this.$Message.error('网络超时');
				});*/
			},
			//选择人员
			checkFun(id, checked) {
				for(var i = 0; i < this.userData.theForm.allUserData.length; i++) {
					if(checked == true) {
						if(this.userData.theForm.allUserData[i]['id'] == id) {
							this.userData.theForm.checkUserData.push(this.userData.theForm.allUserData[i]);
							this.userData.theForm.checkUserIds.push(this.userData.theForm.allUserData[i]['id']);
						}

					} else {
						if(this.userData.theForm.allUserData[i]['id'] == id) {
							var idx = this.userData.theForm.checkUserIds.indexOf(id);
							this.userData.theForm.checkUserData.splice(idx, 1);
							this.userData.theForm.checkUserIds.splice(idx, 1);
						}
					}
				}
			},
			//新增或者编辑部门
			addDept: function(id) {
				this.deptData.theModal.show = true;
				this.deptData.theModal.title = '新增部门';
				this.deptId = id;
				this.getRole();
				this.getTag();
				this.getInfo();
				//制空
				this.deptData.theForm.id = '';
				this.roleId = '';
				this.str = '';
				this.deptData.theForm.name = '';
				this.deptData.theForm.remark = '';
				this.deptData.theForm.phone = '';
				this.deptData.theForm.info = '';
				this.deptData.theForm.parentId = '';
				this.deptData.theForm.roleIds = [];
				this.deptData.theForm.tagIds = [];
				if(this.deptId !== '') {
					this.$store.commit('setSourceInfo', {
						sourceUri: this.$store.state.sourceInfo.sourceUri,
						currentUri: '/dep/deptEdit',
						tempPath: this.$store.state.sourceInfo.tempPath
					});
					logHttp(this.$store.state.sourceInfo, '编辑部门', fetchPostUrlencoded);
					this.deptData.theModal.title = "编辑部门";
					//+this.deptId
					Ajax.get('/nxp-admin/ServiceDepts/'+id).then((res) => {
			        if(res.code == 200){
			        	console.log(res.data)
			          	this.deptData.theForm.id = this.deptId;
						this.deptData.theForm.name = res.data.name;
						this.deptData.theForm.remark = res.data.remark;
						this.deptData.theForm.leaderName = res.data.leaderName;
						this.deptData.theForm.phone = res.data.phone;
						//this.deptData.theForm.email = res.data.email;
						this.deptData.theForm.roleIds = res.data.roleIds;
						this.deptData.theForm.tagIds = res.data.tagIds;
						this.deptData.theForm.parentId = res.data.parentId > 0 ? res.data.parentId : ''; //上级部门
						this.deptData.theForm.info = res.data.leaderId > 0 ? res.data.leaderId : ''; //负责人
			        }
			        this.loading = false;
			    });

					//获取人员列表
					this.getDeptUser();
				} else {
					this.$store.commit('setSourceInfo', {
						sourceUri: this.$store.state.sourceInfo.sourceUri,
						currentUri: '/dep/deptAdd',
						tempPath: this.$store.state.sourceInfo.tempPath
					});
					logHttp(this.$store.state.sourceInfo, '新增部门', fetchPostUrlencoded);
					this.deptData.theModal.title = "新增部门";
				}
				this.getDept();
			},
			//提交新增 修改
			subForm: function() {
				var url = this.deptData.theForm.id === '' ? '/nxp-admin/ServiceDepts' : '/nxp-admin/ServiceDepts/'+this.deptData.theForm.id;
				this.$refs["deptData.theForm"].validate((valid) => {
					if(valid) {
						let obj={
							'name': this.deptData.theForm.name,
							'leaderId': this.deptData.theForm.info,
							'remark': this.deptData.theForm.remark,
							'phone': this.deptData.theForm.phone,
							'parentId': this.deptData.theForm.parentId
						}
						if(this.deptData.theForm.id==""||this.deptData.theForm.id==null||this.deptData.theForm.id==undefined){
							Ajax.post(url,obj).then((res) => {
						        if(res.code == 200){
						        		this.deptData.theForm.id=res.data;	
				        			this.getDepart()
						        }
					 		});
						}else{
							obj.deptId = this.deptData.theForm.id
							Ajax.put(url,obj).then((res) => {
				        			this.getDepart()
					 		});
						}
						
					}else {
						this.$Message.error('表单验证失败!');
					}

				})
			},
			//搜索人员
			searchObj() {
				this.DeptUserPage.current = 1;
				this.getDeptUser();
			},
			//获取角色
			getRole() {
				let obj={
					"status":'1'
				}
		        Ajax.get("/nxp-admin/Roles",obj).then((res) => { //获取所有角色
		          if(res.code == 200) {
		            this.roleData = res.data;
		          } else {
		          	this.$Message.error(res.msg);
		          }
		        });
			},
			//获取标签
			getTag() {
				/*fetchGet('/nxp-admin/dept/queryTag').then((res) => {
					this.btnLoading = false;
					if(res.code == 200) {
						this.tagData = res.data;
					} else {
						this.$Message.error(res.msg);
						
					}
				}).catch(() => {
					this.btnLoading = false;
					this.$Message.error('网络超时');
				});*/
			},
			//获取负责人
			getInfo() {
				let obj={
					status:'1'
				}
				this.deptData.theForm.infoData='';
				Ajax.get("/nxp-admin/ServiceUsers",obj).then((res) => {
					if(res.code !== 200) {
						this.$Message.error(res.msg);
					} else {
						this.deptData.theForm.infoData = res.data;
						this.$Message.success(res.msg);
			        }
			        this.loading = false;
			   });
			},
			//获取上级部门
			getDept() {
				let obj={
					status:'-1'
				}
				Ajax.get("/nxp-admin/ServiceDepts",obj).then((res) => {
					if(res.code == 200){
				       if(this.deptData.theForm.name != '') {
							this.deptData.theForm.deptInfoData = res.data.filter((item) => {
								if(item.name != this.deptData.theForm.name) {
									return item
								}
							});
						} else {
							this.deptData.theForm.deptInfoData = res.data;
						}
					}
			    });
			},
			//查询部门列表
			getDepart() {
				this.loading = true;
				let obj = {
					'tagId': this.tagId,
					'status': this.page.status,
					'page': this.page.current,
					'per_page': this.page.pageSize
				};
				Ajax.get("/nxp-admin/ServiceDepts", obj).then((res) => {
			        if(res.code == 200){
                  this.page.total = res.count;
                  this.data = res.data;
                  this.$Message.success(res.msg);
                  // 改变状态后如果数据结果小于1页则跳回到第1
                  if(res.count <= this.page.pageSize && this.page.current != 1) {
                    this.changePage(1);
                  }
			        }
			        this.loading = false;
			    });
			},
			//分页
			changePage: function(e) {
				this.page.current = e;
				this.getDepart();
			},
			//分页
			changeUserPage: function(e) {
				this.DeptUserPage.current = e;
				this.getDeptUser();
			},
			//禁用启用
			changeStatus(id, status) {
				var str = status == 1 ? '启用' : '禁用';
				this.$Modal.confirm({
					title: '提示',
					content: '<p>是否要' + str + '</p>',
					onOk: () => {
						this.loading = true;
						///ServiceDepts/{id}/updateStatus
						let obj = {
							'status': status,
						}
						var url='/nxp-admin/ServiceDepts/'+id+'/updateStatus'
						Ajax.patch(url, obj).then((res) => {
					       if(res.code !== 200) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.success(res.msg);
								this.getDepart();
							}
					        this.loading = false;
					    });
						/*fetchPostUrlencoded('/nxp-admin/dept/del', {
							'deptId': id,
							'status': status
						}).then((res) => {
							if(res.code !== 200) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.success(res.msg);
								this.getDepart();
							}
						});*/
					}
				});
			}
		}
	}
</script>

<style>
	.i-input {
		display: inline-block;
		width: 180px;
		height: 32px;
		line-height: 32px;
		padding: 3px 7px;
		font-size: 12px;
		border: 1px solid #dddee1;
		border-radius: 4px;
		color: #495060;
		background-color: #fff;
		background-image: none;
		position: relative;
		cursor: text;
		transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
	}
</style>
