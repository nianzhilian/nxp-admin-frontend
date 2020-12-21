<template>
	<div class="example-case">
		<div class="air-title h3">功能列表</div>
		<Tabs :animated="false" @on-click="tag">
			<TabPane label="全部" name="-1"></TabPane>
			<TabPane label="已启用" name="1"></TabPane>
			<TabPane label="已禁用" name="0"></TabPane>
		</Tabs>
		<Table border :columns="columns7" :data="data"></Table>
		<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
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
		data() {
				return {
					loading: false,
					btnLoading: false,
					statuType: -1,
					name: '',
					page: {
						total: 0,
						current: 1,
						pageSize: 15
					},
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
						title: 'ID',
						key: 'id',
						width: 80
					}, {
						title: '名称',
						key: 'name',
					}, {
						title: '父级',
						key: 'parentId'
					}, {
						title: '说明',
						key: 'description'
					}, {
						title: '分组',
						key: 'group'
					}, {
						title: '功能类型',
						key: 'typeName'
					}, {
						title: '操作',
						key: 'action',
						align: 'center',
						render: (h, params) => {
							if(params.row.status == 1) {
								return h('div', [
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
										on: {
											click: () => {
												this.changeStatus(params.row.id, 1)
											}
										}
									}, '启用')
								]);
							}
						},
					}],
					data: []
				}
			},
			created() {
				this.getRole();
			},
			watch: {},
			mounted() {
				logHttp(this.$store.state.sourceInfo, '权限管理', fetchPostUrlencoded);
			},
			methods: {
				//查询权限列表
				getRole() {
					this.loading = true;
					let obj = {
						'name': this.name,
						'status': this.statuType,
						'page': this.page.current,
						'per_page': this.page.pageSize
					}
					Ajax.get('/nxp-admin/Previleges', obj).then((res) => {
						if(res.code == 200) {
							this.page.total = res.count;
							this.data = res.data;
							this.$Message.success(res.msg);
							// 改变状态后如果数据结果小于1页则跳回到第1页
							if(res.count <= this.page.pageSize && this.page.current != 1) {
								this.changePage(1);
							}
						} else {
							this.$Message.error(res.msg);
						}
					});
				},
				//禁用启用
				changeStatus(id, status) {
					var str = status == 1 ? '启用' : '禁用';
					var url = '/nxp-admin/Previleges/' + id+'/updateStatus';
					var status={
						"status":status
					}
					this.$Modal.confirm({
						title: '提示',
						content: '<p>是否要' + str + '</p>',
						onOk: () => {
							Ajax.patch(url, status).then((res) => {
								if(res.code == 200) {
									this.$Message.success(res.msg);
									this.getRole();
								} else {
									this.$Message.error(res.msg);
								}
							});
						}
					});
				},
				//分页
				changePage(e) {
					this.page.current = e;
					this.getRole();
				},
				tag: function(status) {
					this.page.current = 1;
					this.statuType = status;
					this.getRole();
				},
			}
	}
</script>