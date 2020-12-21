<template>
	<div class="app-container">
		<div class="air-title h3">系统参数 </div>
		<Row :gutter="16">
			<Col span="12">
				<Button type="primary" icon="plus-round" @click="aeSystemSetting('')"> 新增</Button>
			</Col>
			<!--<Col span="10">
			<Input v-model="page.filterVal">
			<span slot="prepend">查找</span>
			</Input>
			</Col>
			<Col span="2">
			<Button type="ghost" icon="ios-search" @click="searchKey">开始查找</Button>
			</Col>-->
		</Row>
		<br />
		<Tabs :animated="false" @on-click="changeTabs">
			<TabPane label="全部" name="all"></TabPane>
			<TabPane label="已启用" name="0"></TabPane>
			<TabPane label="已禁用" name="1"></TabPane>
		</Tabs>
		<Table border :loading="loading" :columns="columns" :data="data"></Table>
		<br />
		<Row :gutter="16">
			<Col span="24">
			<div style="float: right;">
				<Page :total="page.total" :current="page.current" :page-size="page.pageSize" show-total @on-change="changePage"></Page>
			</div>
			</Col>
		</Row>
		<br />
		<h2>系统数据更新</h2>
		<br />
		<Row :gutter="16" class-name="btns">
			<Col :xs="{ span: 8 }" :sm="{ span: 6 }" :md="{ span: 5 }" :lg="{ span: 4 }">
			<div>
				<Button type="primary" :loading="btnLoading" @click="btnAjax('ly')" long>
					<span v-if="!btnLoading">力洋数据库同步更新</span>
					<span v-else>数据同步中...</span>
				</Button>
			</div>
			</Col>
			<Col :xs="{ span: 8 }" :sm="{ span: 6 }" :md="{ span: 5 }" :lg="{ span: 4 }">
			<div>
				<Button type="primary" :loading="btnLoading" @click="btnAjax('kh')" long>
					<span v-if="!btnLoading">客户数据同步更新</span>
					<span v-else>数据同步中...</span>
				</Button>
			</div>
			</Col>
			<Col :xs="{ span: 8 }" :sm="{ span: 6 }" :md="{ span: 5 }" :lg="{ span: 4 }">
			<div>
				<Button type="primary" :loading="btnLoading" @click="btnAjax('qx')" long>
					<span v-if="!btnLoading">权限数据同步更新</span>
					<span v-else>数据同步中...</span>
				</Button>
			</div>
			</Col>
			<Col :xs="{ span: 8 }" :sm="{ span: 6 }" :md="{ span: 5 }" :lg="{ span: 4 }">
			<div>
				<Button type="primary" :loading="btnLoading" @click="btnAjax('xt')" long>
					<span v-if="!btnLoading">系统数据同步更新</span>
					<span v-else>数据同步中...</span>
				</Button>
			</div>
			</Col>
			<Col :xs="{ span: 8 }" :sm="{ span: 6 }" :md="{ span: 5 }" :lg="{ span: 4 }">
			<div>
				<Button type="primary" :loading="btnLoading" @click="btnAjax('pj')" long>
					<span v-if="!btnLoading">配件信息同步更新</span>
					<span v-else>数据同步中...</span>
				</Button>
			</div>
			</Col>
		</Row>
		<!--编辑-->
		<Modal v-model="systemSettingData.theModal.show" :title="systemSettingData.theModal.title" :mask-closable="false">
			<Form ref="systemSettingData.theForm" :model="systemSettingData.theForm" :rules="systemSettingData.theRule" :label-width="80">
				<FormItem label="变量名称" prop="name">
					<Input v-model="systemSettingData.theForm.name"></Input>
				</FormItem>
				<FormItem label="类别" prop="type">
					<Select v-model="systemSettingData.theForm.type">
						<Option v-for="item in systemSettingData.theForm.typeSelect" :value="item" :key="item.value">{{ item }}</Option>
					</Select>
				</FormItem>
				<FormItem label="值" prop="value">
					<Input v-model="systemSettingData.theForm.value"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="subForm">提交</Button>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="ghost" size="large" long @click="systemSettingData.theModal.show = false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import { md5,logHttp } from '../../utils/common.js'
	import { fetchPostUrlencoded, fetchGet } from '../../utils/requestHttp.js'

	export default {
		data() {
			return {
				loading: false,
				btnLoading: false,
				page: {
					status: '',
					total: 0,
					current: 1,
					pageSize: 15
				},
				columns: [{
						title: '#',
						key: 'id',
						width: 60
					},
					{
						title: '名称',
						key: 'name'
					},
					{
						title: '变量值',
						key: 'value'
					},
					{
						title: '类型',
						key: 'type'
					},
					{
						title: '状态',
						key: 'status',
						width: 100,
						render: (h, params) => {
							if(params.row.status == 0) {
								return h('div', [
									h('Button', {
										props: {
											type: 'success',
											size: 'small'
										}
									}, '已启用')
								]);
							} else {
								return h('div', [
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										}
									}, '已禁用')
								]);
							}
						}
					},
					{
						title: '操作',
						key: 'name',
						width: 150,
						align: 'center',
						render: (h, params) => {
							if(params.row.status == 0) {
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
												this.aeSystemSetting(params.row.id)
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
												this.aeSystemSetting(params.row.id)
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
									}, '启用')
								]);
							}
						}
					}
				],
				data: [],
				systemSettingData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
						name: '',
						type: '',
						typeSelect: ['service_user_type', 'user_type', 'pj_type'],
						value: '',
						status: ''
					},
					theRule: {
						name: [{
							required: true,
							message: '名称不能为空',
							trigger: 'blur'
						}],
						type: [{
							required: true,
							message: '类型不能为空',
							trigger: 'blur'
						}],
						value: [{
							required: true,
							message: '值不能为空',
							trigger: 'blur'
						}]
					},
					permisData: []
				}
			}
		},
		methods: {
			ajaxData() {
				this.loading = true;
				fetchPostUrlencoded('/nxp-admin/systemSetting/getList', {
					'status': this.page.status,
					'page': this.page.current,
					'size': this.page.pageSize
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.page.total = res.count;
						this.data = res.data;
						this.$Message.success(res.msg);
						// 改变状态后如果数据结果小于1页则跳回到第1页
						if(res.count <= this.page.pageSize && this.page.current != 1) {
							this.changePage(1);
						}
					}
					this.loading = false;
				});
			},
			changeTabs(status) {
				this.page.current = 1;
				this.page.status = status === 'all' ? '' : status;
				this.ajaxData()
			},
			changePage: function(e) {
				this.page.current = e;
				this.ajaxData();
			},
			changeStatus: function(id, status) {
				var str = status == 0 ? '启用' : '禁用';
				this.$Modal.confirm({
					title: '提示',
					content: '<p>是否要' + str + '</p>',
					onOk: () => {
						this.loading = true;
						fetchPostUrlencoded('/nxp-admin/systemSetting/del', {
							'id': id,
							'status': status
						}).then((res) => {
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.success(res.msg);
							}
							this.ajaxData();
						});
					}
				});
			},
			aeSystemSetting: function(id) {
				this.$refs["systemSettingData.theForm"].resetFields();
				this.systemSettingData.theModal.show = true;

				if(id !== '') {
					this.systemSettingData.theModal.title = "编辑系统变量";
					this.$store.commit('setSourceInfo', {
						sourceUri: this.$store.state.sourceInfo.sourceUri,
						currentUri: '/sysOps/editSysOps',
						tempPath:this.$store.state.sourceInfo.tempPath
					});
					logHttp(this.$store.state.sourceInfo,'编辑系统变量',fetchPostUrlencoded);
					fetchPostUrlencoded('/nxp-admin/systemSetting/getId', {
						'id': id,
						'status': 0
					}).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.systemSettingData.theForm.id = id;
							this.systemSettingData.theForm.name = res.data.name;
							this.systemSettingData.theForm.type = res.data.type;
							this.systemSettingData.theForm.value = res.data.value;
							this.systemSettingData.theForm.status = res.data.status;
						}
					});

				} else {
					this.$store.commit('setSourceInfo', {
						sourceUri: this.$store.state.sourceInfo.sourceUri,
						currentUri: '/sysOps/addSysOps',
						tempPath:this.$store.state.sourceInfo.tempPath
					});
					logHttp(this.$store.state.sourceInfo,'新增系统变量',fetchPostUrlencoded);
					this.systemSettingData.theModal.title = "新增系统变量";
					this.systemSettingData.theForm.id = '';
					this.systemSettingData.theForm.name = '';
					this.systemSettingData.theForm.type = '';
					this.systemSettingData.theForm.value = '';
					this.systemSettingData.theForm.status = '';
				}
			},
			subForm: function() {
				var url = this.systemSettingData.theForm.id === '' ? '/nxp-admin/systemSetting/add' : '/nxp-admin/systemSetting/update';
				this.$refs["systemSettingData.theForm"].validate((valid) => {
					if(valid) {
						fetchPostUrlencoded(url, {
							'id': this.systemSettingData.theForm.id,
							'name': this.systemSettingData.theForm.name,
							'type': this.systemSettingData.theForm.type,
							'value': this.systemSettingData.theForm.value,
							'status': 0
						}).then((res) => {
							this.systemSettingData.theModal.show = false;
							this.ajaxData();
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.success(res.msg);
							}
						});
					} else {
						this.$Message.error('表单验证失败!');
					}
				})
			},
			btnAjax: function(type) {
				this.btnLoading = true;
				if(type == 'ly') {
					fetchGet('/nxp-admin/liYang/sync').then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.$Message.success(res.msg);
						}
					}).catch(()=>{
						this.btnLoading = false;
						this.$Message.error('网络超时');
					});
				} else if(type == 'kh') {
					fetchGet('/nxp-admin/cusOrganiztion/sync').then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.$Message.success(res.msg);
						}
					}).catch(()=>{
						this.btnLoading = false;
						this.$Message.error('网络超时');
					});
				} else if(type == 'qx') {
					fetchGet('/nxp-admin/fun/sync').then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.$Message.success(res.msg);
						}
					}).catch(()=>{
						this.btnLoading = false;
						this.$Message.error('网络超时');
					});
				} else if(type == 'xt') {
					fetchGet('/nxp-admin/systemSetting/sync').then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.$Message.success(res.msg);
						}
					}).catch(()=>{
						this.btnLoading = false;
						this.$Message.error('网络超时');
					});
				} else if(type == 'pj') {
					fetchGet('/nxp-admin/carLine/syncBrand').then((res) => {
						this.btnLoading = false;
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.$Message.success(res.msg);
						}
					}).catch(()=>{
						this.btnLoading = false;
						this.$Message.error('网络超时');
					});
				}
			}
		},
		mounted() {
			this.ajaxData();
			logHttp(this.$store.state.sourceInfo,'系统参数',fetchPostUrlencoded);
		}
	}
</script>

<style scoped>
	.btns .ivu-col {
		margin-bottom: 16px;
	}
</style>
