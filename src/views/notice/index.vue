<template>
	<div>
		<div class="air-title h3">网站公告 </div>
		<Row :gutter="16">
			<Col span="12">
			<div style="float: left;">
				<Button type="primary" icon="plus-round" @click="addNotice"> 新增</Button>
			</div>
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
		<Table border :loading="loading" :columns="columns" :data="data"></Table>
		<br />
		<Row :gutter="16">
			<Col span="24">
			<div style="float: right;">
				<Page :total="page.total" :current="page.current" :page-size="page.pageSize" show-total @on-change="changePage"></Page>
			</div>
			</Col>
		</Row>
		<!--新增-->
		<Modal v-model="noticeData.theModal.show" :title="noticeData.theModal.title" :mask-closable="false" width="1200">
			<Form ref="noticeData.theForm" :model="noticeData.theForm" :rules="noticeData.theRule" :label-width="80">
				<FormItem label="公告标题" prop="title">
					<Input v-model="noticeData.theForm.title"></Input>
				</FormItem>
				<FormItem label="公告内容" prop="content">
					<Input v-model="noticeData.theForm.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
				</FormItem>
				<FormItem label="发送对象" prop="target">
					<Tabs type="card" :animated="false" @on-click="changeType">
						<TabPane label="按对象" name="1">
							<CheckboxGroup v-model="noticeData.theForm.valForObj" @on-change="changeTarget">
								<Checkbox label="1">配件商</Checkbox>
								<Checkbox label="2">保险公司</Checkbox>
								<Checkbox label="3">修理厂</Checkbox>
							</CheckboxGroup>
						</TabPane>
						<TabPane label="按组织" name="2">
							<Row :gutter="16">
								<Col span="24">
								<Input v-model="filter.orgName">
								<span slot="prepend">过滤</span>
								</Input>
								</Col>
							</Row>
							<br />
							<Table border ref="orgList" :columns="orgColumns" :data="orgFilter" height="200" @on-selection-change="changeOrg"></Table>
						</TabPane>
					</Tabs>
				</FormItem>
				<Row>
					<Col span="6">
					<FormItem label="开始日期" prop="startDate">
						<DatePicker type="date" placeholder="开始日期" :editable="false" :options="optionsForStart" @on-change="setStartDate" v-model="noticeData.theForm.valForStartDate"></DatePicker>
					</FormItem>
					</Col>
					<Col span="6">
					<FormItem label="结束日期" prop="endDate">
						<DatePicker type="date" placeholder="结束日期" :editable="false" :options="optionsForEnd" @on-change="setEndDate" v-model="noticeData.theForm.valForEndDate"></DatePicker>
					</FormItem>
					</Col>
				</Row>

				<FormItem>
					<Button type="primary" @click="subForm">发布</Button>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="ghost" size="large" long @click="noticeData.theModal.show = false">关闭</Button>
			</div>
		</Modal>
		<!--编辑-->
		<Modal v-model="noticeDetailData.theModal.show" :title="noticeDetailData.theModal.title" :mask-closable="false">
			<Form ref="noticeDetailData.theForm" :model="noticeDetailData.theForm" :label-width="80">
				<FormItem label="公告标题">
					{{noticeDetailData.theForm.title}}
				</FormItem>
				<FormItem label="公告内容">
					{{noticeDetailData.theForm.content}}
				</FormItem>
				<FormItem label="发送对象">
					{{noticeDetailData.theForm.targetName}}
				</FormItem>
				<FormItem label="开始日期">
					{{noticeDetailData.theForm.startDate}}
				</FormItem>
				<FormItem label="结束日期">
					{{noticeDetailData.theForm.endDate}}
				</FormItem>
				<FormItem>
					<div v-if="noticeDetailData.theForm.status == 0">
						<Button type="error" @click="removeNotice(noticeDetailData.theForm.id)">禁用</Button>
					</div>
					<div v-if="noticeDetailData.theForm.status == 1">
						<Button type="error" disabled>已禁用</Button>
					</div>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="ghost" size="large" long @click="noticeDetailData.theModal.show = false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'
	import {logHttp} from '../../utils/common.js'
	export default {
		data() {
			return {
				loading: false,
				page: {
					status: '',
					total: 0,
					current: 1,
					pageSize: 15
				},
				filter: {
					orgName: ''
				},
				columns: [{
						title: '标题',
						key: 'title'
					},
					{
						title: '发布时间',
						key: 'createTime'
					},
					{
						title: '发布人',
						key: 'userName'
					},
					{
						title: '开始日期',
						key: 'startDate'
					},
					{
						title: '结束日期',
						key: 'endDate'
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
						width: 100,
						align: 'center',
						render: (h, params) => {
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
											this.noticeDetail(params.index)
										}
									}
								}, '查看')
							]);
						}
					}
				],
				data: [],
				orgColumns: [{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '组织名称',
						key: 'fullName'
					},
					{
						title: '组织类别',
						key: 'type',
						width: 100,
						render: (h, params) => {
							if(params.row.type == 1) {
								return h('div', ['配件商']);
							} else if(params.row.type == 2) {
								return h('div', ['保险公司']);
							} else {
								return h('div', ['修理厂']);
							}
						}
					}
				],
				orgData: [],
				noticeData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						title: '',
						content: '',
						type: '',
						target: '',
						startDate: '',
						endDate: '',
						valForStartDate: '',
						valForEndDate: '',
						valForObj: [],
						valForOrg: [],
					},
					theRule: {
						title: [{
							required: true,
							message: '标题不能为空',
							trigger: 'blur'
						}],
						content: [{
							required: true,
							message: '内容不能为空',
							trigger: 'blur'
						}],
						target: [{
							required: true,
							message: '发送对象不能为空',
							trigger: 'blur'
						}],
						startDate: [{
							required: true,
							message: '开始日期不能为空',
							trigger: 'blur'
						}],
						endDate: [{
							required: true,
							message: '结束日期不能为空',
							trigger: 'blur'
						}]
					}
				},
				noticeDetailData: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {
						id: '',
						title: '',
						content: '',
						targetName: '',
						startDate: '',
						endDate: ''
					}
				},
				optionsForStart: {
					disabledDate(date) {
						return date && date.valueOf() < Date.now();
					}
				},
				optionsForEnd: {
					disabledDate(date) {
						return date && date.valueOf() < Date.now() + 86400000;
					}
				}
			}
		},
		computed: {
			// 组织要过滤
			orgFilter: function() {
				var _self = this;
				return this.orgData.filter(function(data) {
					if(_self.filter.orgName) {
						return data.fullName.indexOf(_self.filter.orgName) > -1
					} else {
						return data
					}
				})
			}
		},
		methods: {
			ajaxData() {
				this.loading = true;
				fetchGetHaveParam('/nxp-admin/notice/list', {
					size: this.page.pageSize,
					page: this.page.current
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
				}).catch(() => {
					this.$Message.error("网络错误！");
				});
			},
			ajaxOrgData() {
				fetchGet('/nxp-admin/cusOrganiztion/all').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.orgData = res.data;
					}
					this.loading = false;
				}).catch(() => {
					this.$Message.error("网络错误！");
				});
			},
			changePage: function(e) {
				this.page.current = e;
				this.ajaxData();
			},
			addNotice: function() {
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/notice/addNotice',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'发布公告',fetchPostUrlencoded);
				this.$refs["noticeData.theForm"].resetFields();
				this.noticeData.theModal.show = true;

				this.noticeData.theModal.title = "发布公告";
				this.noticeData.theForm.title = '';
				this.noticeData.theForm.content = '';
				this.noticeData.theForm.type = 1;
				this.noticeData.theForm.target = '';
				this.noticeData.theForm.startDate = '';
				this.noticeData.theForm.endDate = '';
				this.noticeData.theForm.valForStartDate = '';
				this.noticeData.theForm.valForEndDate = '';
				this.noticeData.theForm.valForObj = [];
				this.$refs.orgList.selectAll(false);
				this.noticeData.theForm.valForOrg = [];
			},
			noticeDetail: function(index) {
				this.$store.commit('setSourceInfo', {
					sourceUri: this.$store.state.sourceInfo.sourceUri,
					currentUri: '/notice/noticeDetail',
					tempPath:this.$store.state.sourceInfo.tempPath
				});
				logHttp(this.$store.state.sourceInfo,'公告详细',fetchPostUrlencoded);
				this.noticeDetailData.theModal.show = true;
				this.noticeDetailData.theModal.title = "公告详细";

				this.noticeDetailData.theForm.id = this.data[index]['id'];
				this.noticeDetailData.theForm.title = this.data[index]['title'];
				this.noticeDetailData.theForm.content = this.data[index]['content'];
				this.noticeDetailData.theForm.targetName = this.data[index]['targetName'];
				this.noticeDetailData.theForm.startDate = this.data[index]['startDate'];
				this.noticeDetailData.theForm.endDate = this.data[index]['endDate'];
				this.noticeDetailData.theForm.status = this.data[index]['status'];
			},
			removeNotice(id) {
				this.$Modal.confirm({
					title: '提示',
					content: '<p>是否要禁用公告？</p>',
					onOk: () => {
						fetchGet('/nxp-admin/notice/canel/' + id).then((res) => {
							this.noticeDetailData.theModal.show = false;
							this.ajaxData();
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.$Message.success(res.msg);
							}
						});
					}
				});
			},
			subForm: function() {
				this.$refs["noticeData.theForm"].validate((valid) => {
					if(valid) {
						if(this.noticeData.theForm.valForEndDate <= this.noticeData.theForm.valForStartDate) {
							this.$Message.error("结束日期不能小于或等于开始日期！");
						} else {
							fetchPostUrlencoded('/nxp-admin/notice/add', {
								'title': this.noticeData.theForm.title,
								'content': this.noticeData.theForm.content,
								'type': this.noticeData.theForm.type,
								'target': this.noticeData.theForm.target,
								'startDate': this.noticeData.theForm.startDate,
								'endDate': this.noticeData.theForm.endDate
							}).then((res) => {
								if(res.flag !== 0) {
									this.$Message.error(res.msg);
								} else {
									this.noticeData.theModal.show = false;
									this.ajaxData();
									this.$Message.success(res.msg);
								}
							});
						}
					} else {
						this.$Message.error('表单验证失败!');
					}
				})
			},
			// 切换发送对象
			changeType(e) {
				this.noticeData.theForm.type = e;
				if(this.noticeData.theForm.type == 1) {
					this.noticeData.theForm.target = this.noticeData.theForm.valForObj.join(",")
				} else {
					this.noticeData.theForm.target = this.noticeData.theForm.valForOrg.join(",")
				}
			},
			// 选中发送对象
			changeTarget() {
				this.noticeData.theForm.target = this.noticeData.theForm.valForObj.join(",")
			},
			// 选中组织的数据
			changeOrg(e) {
				this.noticeData.theForm.valForOrg = [];
				for(var i = 0; i < e.length; i++) {
					this.noticeData.theForm.valForOrg.push(e[i]['id']);
				}
				this.noticeData.theForm.target = this.noticeData.theForm.valForOrg.join(",")
			},
			// 切换开始日期
			setStartDate(e) {
				this.noticeData.theForm.startDate = e;
			},
			// 切换结束日期
			setEndDate(e) {
				this.noticeData.theForm.endDate = e;
			}
		},
		mounted() {
			this.ajaxData();
			// 预载入组织列表
			this.ajaxOrgData();
			logHttp(this.$store.state.sourceInfo,'网站公告',fetchPostUrlencoded);
		}
	}
</script>

<style scoped>

</style>
