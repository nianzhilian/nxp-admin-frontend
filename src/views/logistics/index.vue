<template>
	<div class="example-case">
		<div class="air-title h3">物流集货点管理 </div>
		<Row>
			<Col span="12">
			<Button type="primary" icon="plus-round" @click="pointAdd('')">新增</Button>
			</Col>
		</Row>
		<br />
		<Table border :columns="columns7" :data="data"></Table>
		<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
		<!--新增-->
		<Modal width='800' v-model="logisticData.theModal.show" :title="logisticData.theModal.title" :mask-closable="false">
			<Form ref="logisticData.theForm" :model="logisticData.theForm" :rules="logisticData.theRule" :label-width="80">
				<FormItem label="名称" prop="name">
					<Input v-model="logisticData.theForm.name"></Input>
				</FormItem>
				<FormItem label="地址" prop="address">
					<Input v-model="logisticData.theForm.address"></Input>
				</FormItem>
				<FormItem label="地区" prop="regionModel">
					<Cascader v-model="logisticData.theForm.cusRegionArr" :data="regionData"></Cascader>
				</FormItem>
				<FormItem label="电话">
					<Input v-model="logisticData.theForm.phone"></Input>
				</FormItem>
				<FormItem label="部门">
					<Select v-model="logisticData.theForm.dept" clearable>
						<Option v-for="item in logisticData.theForm.deptSelect" :key="item.id" :value="item.id">{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="备注">
					<Input v-model="logisticData.theForm.remark"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="subForm">提交</Button>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="ghost" size="large" long @click="logisticData.theModal.show = false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import {
		getLocalTime,
		md5,
		logHttp
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam
	} from '../../utils/requestHttp.js'
	export default {
		data() {
				return {
					regionData: [],
					loading: false,
					btnLoading: false,
					editId: '',
					page: {
						total: 0,
						current: 1,
						pageSize: 15
					},
					val: '',
					columns7: [{
						title: '状态',
						width: 60,
						align: 'center',
						render: (h, params) => {
							if(params.row.status == 0) {
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
					},{
						title: '#',
						key: 'id',
						width: 60
					}, {
						title: '名称',
						key: 'name'
					}, {
						title: '电话',
						key: 'phone'
					}, {
						title: '地区',
						key: 'regionName'
					}, {
						title: '地址',
						key: 'address'
					}, {
						title: '部门',
						key: 'deptName'
					}, {
						title: '操作',
						key: 'action',
						width: 300,
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
												this.pointAdd(params.row.id)
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
												this.pointAdd(params.row.id)
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
					}],
					data: [],
					logisticData: {
						theModal: {
							show: false,
							title: ''
						},
						theForm: {
							id: '',
							name: '',
							address: '',
							dept: '',
							deptSelect: [],
							phone: '',
							remark: '',
							cusRegionArr: [] //地区
						},
						theRule: {
							name: [{
								required: true,
								message: '名称不能为空',
								trigger: 'blur'
							}],
							address: [{
									required: true,
									message: '地址不能为空',
									trigger: 'blur'
								}]
								/*,
								regionModel: [{
									required: true,
									message: '地区不能为空',
									trigger: 'blur'
								}]*/
						},
					}
				}
			},
			created() {
				this.getPoint();
				this.getRegionData();
			},
			mounted(){
				logHttp(this.$store.state.sourceInfo,'物流管理',fetchPostUrlencoded);
			},
			watch: {},
			methods: {
				//获取地区
				getRegionData() {
					fetchGet('/nxp-admin/region/all').then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.regionData = this.formatCity(res.data);
						}
					});
				},
				formatCity(data) {
					for(var i = 0; i < data.length; i++) {
						if(data[i]['childNodes'] && data[i]['childNodes'].length > 0) {
							data[i]['children'] = this.formatCity(this.formatCity(data[i]['childNodes']));
						}
						data[i]['value'] = data[i]['id'];
						data[i]['label'] = data[i]['name'];
					}
					return data;
				},
				pointAdd: function(id) {
					this.logisticData.theModal.show = true;
					this.editId = id;
					this.logisticData.theForm.name = '';
					this.logisticData.theForm.cusRegionArr = [];
					this.logisticData.theForm.dept = '';
					this.logisticData.theForm.address = '';
					this.logisticData.theForm.remark = '';
					this.logisticData.theForm.phone = '';
					this.getDept();
					if(id != '') {
						this.logisticData.theModal.title = "编辑集货点";
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/logistics/logisticsEdit',
							tempPath:this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo,'编辑集货点',fetchPostUrlencoded);
						fetchGet('/nxp-admin/point/query/' + this.editId, {}).then((res) => {
							if(res.flag !== 0) {
								this.$Message.error(res.msg);
							} else {
								this.logisticData.theForm.id = this.editId;
								this.logisticData.theForm.name = res.data.name;
								this.logisticData.theForm.address = res.data.address;
								this.logisticData.theForm.dept = res.data.deptId > 0 ? res.data.deptId : ''; //部门
								this.logisticData.theForm.phone = res.data.phone;
								this.logisticData.theForm.remark = res.data.remark;
								this.logisticData.theForm.cusRegionArr = res.data.region.split('-');
							}
						});
					} else {
						this.logisticData.theModal.title = "新增集货点";
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/logistics/logisticsAdd',
							tempPath:this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo,'新增集货点',fetchPostUrlencoded);
						this.logisticData.theForm.id = '';
					}
				},
				subForm: function() {
					var url = this.logisticData.theForm.id === '' ? '/nxp-admin/point/add' : '/nxp-admin/point/update';
					this.$refs["logisticData.theForm"].validate((valid) => {
						if(valid) {
							fetchPostUrlencoded(url, {
								'pointId': this.logisticData.theForm.id,
								'name': this.logisticData.theForm.name,
								'address': this.logisticData.theForm.address,
								'phone': this.logisticData.theForm.phone,
								'region': this.logisticData.theForm.cusRegionArr.join('-'),
								'deptId': this.logisticData.theForm.dept,
								'remark': this.logisticData.theForm.remark
							}).then((res) => {
								if(res.flag !== 0) {
									this.$Message.error(res.msg);
								} else {
									this.logisticData.theModal.show = false;
									this.$Message.success(res.msg);
									this.getPoint();
								}
							});
						} else {
							this.$Message.error('表单验证失败!');
						}
					})
				},
				//查询集货点
				getPoint() {
					this.loading = true;
					fetchPostUrlencoded('/nxp-admin/point/all', {
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
				//获取所有部门
				getDept() {
					fetchGet('/nxp-admin/dept/queryDept/' + 3, {}).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.logisticData.theForm.deptSelect = res.data;
						}
					});
				},
				//分页
				changePage(e) {
					this.page.current = e;
					this.getPoint();
				},
				//禁用启用
				changeStatus(id, status) {
					var str = status == 0 ? '启用' : '禁用';
					this.$Modal.confirm({
						title: '提示',
						content: '<p>是否要' + str + '</p>',
						onOk: () => {
							this.loading = true;
							fetchPostUrlencoded('/nxp-admin/point/del', {
								'pointId': id,
								'status': status
							}).then((res) => {
								if(res.flag !== 0) {
									this.$Message.error(res.msg);
								} else {
									this.$Message.success(res.msg);
									this.getPoint();
								}
							});
						}
					});
				}
			}
	}
</script>
