<template>
	<div class="jy-con">
		<template v-if="opsObj.isGlobalSearch == 'yes'">
			<Table v-if="loadData.length > 0" :row-class-name="rowClassName" border :loading='opsObj.load' highlight-row ref="currentRowTable" :columns="columns" :data="loadData"></Table>
			<Row v-if="opsObj.dataCount>=10" style="margin-top:15px;" type="flex">
				<Col span="20">
				<div style="margin:0;line-height:23px;font-size:20px;">
					搜索到：{{opsObj.dataCount}}条
				</div>
				</Col>
				<Col span="4">
				<div class="fr">
					<Button @click="moreInfo" type="primary">查看更多</Button>
				</div>
				</Col>
			</Row>
		</template>
		<template v-else>
			<Table :row-class-name="rowClassName" border :loading='opsObj.load' highlight-row ref="currentRowTable" :columns="columns" :data="loadData"></Table>
			<div v-show="this.opsObj.data.length > 0" style="margin-top:15px;" class="fr">
				<Page :current="opsObj.currentPage" @on-change="change" :total="opsObj.dataCount" :page-size="opsObj.size"></Page>
			</div>
		</template>
		<div v-if="this.opsObj.type == 3">
			<cus-update-name @on-update-name="updateNameSubmit" :row-obj="rowObj" @on-change="changeUpdateNameShow" :is-show="updateNameShow"></cus-update-name>
		</div>
		<component @on-change="changeEditIshow" @on-update-reload='updateDoneReload' :row="rowObj" :type="opsObj.type" :is-show="editIshow" v-bind:is="currentView">
		</component>
		<tips-model @on-change="onChange" @on-ok="ensure" :is-show="tips">
			<span v-if="this.btnType == 'detain' " style="text-align:center;display:block;font-size:16px">你确定禁用吗？</span>
			<span v-if="this.btnType == 'awaken' " style="text-align:center;display:block;font-size:16px">你确定启用吗？</span>
			<span v-if="this.btnType == 'updateName' " style="text-align:center;display:block;font-size:16px">确定要修改名称吗？</span>
		</tips-model>
		<org ref="org"></org>
	</div>
</template>

<script>
	import {
		dateTrans,
		getLocalTime,
		tipsModal,
		removeBodyAtt,
		logHttp
	} from '../../utils/common.js'
	import tipsModel from '../../components/tipsModel.vue'
	import cusUpdateName from '../components/cusUpdateName.vue'
	import {
		fetchPostUrlencoded
	} from '../../utils/requestHttp.js'
	import supplierEdit from '../../views/customerSupply/components/supplierEdit.vue'
	import insurerEdit from '../../views/customerInsurance/components/insurerEdit.vue'
	import customerEdit from '../../views/customer/components/customerEdit.vue'
	import org from '../../airxComponents/com/popup/org'
	export default {
		components: {
			'tips-model': tipsModel,
			'cus-update-name': cusUpdateName,
			'supplier-edit': supplierEdit,
			'insurer-edit': insurerEdit,
			'customer-Edit': customerEdit,
			org
		},
		props: {
			opsObj: {
				type: Object,
				default: {}
			},
			cusData: {
				type: Object,
				default: {}
			}
		},
		computed: {
			loadData() {
				let data = [];
				data = this.formatData(this.opsObj.data);
				return data
			},
			columns() {
				switch(this.opsObj.type) {
					case 1:
						return this.columns1
						break;
					case 2:
						return this.columns1
						break;
					case 3:
						return this.columns2
						break;
				}
			}
		},
		mounted() {
			this.servicUser();
		},
		watch: {
			cusData(val) {
				this.editModal(val);
			},
			editIshow(val) {
				if(val) {
					if(this.$store.state.sourceInfo.tempPath == '/client/supplier') {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/client/supplier/editSupplier',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo, '编辑配件商', fetchPostUrlencoded);
					} else if(this.$store.state.sourceInfo.tempPath == '/client/insurer') {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/client/insurer/editInsurer',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo, '编辑保险公司', fetchPostUrlencoded);
					} else if(this.$store.state.sourceInfo.tempPath == '/client/repairer') {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/client/repairer/editRepairer',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
						logHttp(this.$store.state.sourceInfo, '编辑修理厂', fetchPostUrlencoded);
					}

				}
			},
			updateNameShow(val) {
				if(val) {
					if(this.$store.state.sourceInfo.tempPath == '/client/repairer') {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/client/repairer/updateRepairerName',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
					} else if(this.$store.state.sourceInfo.tempPath == '/dashboard/globalSearch') {
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/dashboard/globalSearch/updateRepairerName',
							tempPath: this.$store.state.sourceInfo.tempPath
						});
					}
					logHttp(this.$store.state.sourceInfo, '修改修理厂名称', fetchPostUrlencoded);
				}
			}
		},
		methods: {
			servicUser() {
				let _self = this;
				let userInfo = JSON.parse(window.localStorage['user'])['permInfo'];
				for(var i = 0; i < userInfo.length; i++) {
					if(userInfo[i]['childNodes'] != null && userInfo[i]['childNodes'] != '' && userInfo[i]['childNodes'] != undefined) {
						for(var j = 0; j < userInfo[i]['childNodes'].length; j++) {
							if(userInfo[i]['childNodes'][j]['childNodes'] != null && userInfo[i]['childNodes'][j]['childNodes'] != '' && userInfo[i]['childNodes'][j]['childNodes'] != undefined) {
								for(var k = 0; k < userInfo[i]['childNodes'][j]['childNodes'].length; k++) {
									_self.userPerCode.push(userInfo[i]['childNodes'][j]['childNodes'][k]['code']);
								}
							} else {
								_self.userPerCode.push(userInfo[i]['childNodes'][j]['code']);
							}
						}
					} else {
						_self.userPerCode.push(userInfo[i]['code']);
					}
				}
				_self.isUser = _self.userPerCode.indexOf(201);
				_self.isDel = _self.userPerCode.indexOf(204);
			},
			moreInfo() {
				switch(this.opsObj.type) {
					case 1:
						this.$router.push({
							path: '/client/supplier',
							query: {
								str: this.opsObj.queryStr
							}
						})
						break;
					case 2:
						this.$router.push({
							path: '/client/insurer',
							query: {
								str: this.opsObj.queryStr
							}
						})
						break;
					case 3:
						this.$router.push({
							path: '/client/repairer',
							query: {
								str: this.opsObj.queryStr
							}
						})
						break;
				}
			},
			//数据过滤
			formatData(list) {
				for(let i = 0; i < list.length; i++) {
					list[i].createTime = dateTrans(list[i].createTime);
					if(list[i].lastModify) {
						list[i].lastModify = getLocalTime(list[i].lastModify);
					} else {
						list[i].lastModify = '';
					}
					list[i].idp = (this.opsObj.currentPage - 1) * this.opsObj.size + i + 1;
				}
				return list;
			},
			// 禁用
			deleteOrgan(id, type, sts) {
				this.btnType = type;
				this.rowId = id;
				this.jqSts = sts;
				this.tips = !this.tips;
			},
			//控制弹框显示
			onChange(val) {
				this.tips = val;
			},
			changeEditIshow(val) {
				if(!val) {
					removeBodyAtt();
				}
				this.editIshow = val;
			},
			changeUpdateNameShow(val) {
				this.updateNameShow = val;
			},
			//确定
			ensure() {
				if(this.btnType == 'updateName') {
					let obj = {
						orgId: this.rowObj.id,
						name: this.updateNameStr
					};
					fetchPostUrlencoded('/nxp-admin/cusOrganiztion/updateName', obj).then((res) => {
						if(res.flag == 0) {
							this.$emit('on-reload');
							this.updateNameShow = !this.updateNameShow;
							tipsModal(res.msg, this.$Modal, 'success', 'lev1');
						} else {
							tipsModal(res.msg, this.$Modal, 'warning', 'lev1');
						}
					})
				} else {
					let obj = {
						id: this.rowId,
						status: this.jqSts
					}
					fetchPostUrlencoded('/nxp-admin/cusOrganiztion/del', obj).then((res) => {
						if(res.flag == 0) {
							this.$emit('on-reload');
							tipsModal(res.msg, this.$Modal, 'success', 'lev1');
						}
					})
				}
			},
			updateDoneReload() {
				this.$emit('on-reload');
			},
			rowClassName(row, index) {
				if(row.status == 1) {
					return 'demo-table-info-row';
				} else {
					return ''
				}
			},
			change(page) {
				this.$emit('change-page', page);
			},
			handleUpdateName(row, type) {
				this.btnType = type;
				this.$nextTick(() => {
					this.updateNameShow = !this.updateNameShow;
					this.rowObj = row;
				})
			},
			updateNameSubmit(name) {
				this.updateNameStr = name;
				this.tips = !this.tips;
			},
			editModal(row) {
				this.rowObj = row;
				this.rowObj.isGlobalSearch = this.opsObj.isGlobalSearch;
				switch(this.opsObj.type) {
					case 1:
						this.currentView = 'supplier-edit';
						if(this.opsObj.isGlobalSearch == 'yes') {
							this.$store.commit('setSourceInfo', {
								sourceUri: this.$store.state.sourceInfo.sourceUri,
								currentUri: '/dashboard/globalSearch/editSupplier',
								tempPath: this.$store.state.sourceInfo.tempPath
							});
							logHttp(this.$store.state.sourceInfo, '编辑配件商', fetchPostUrlencoded);
						}
						break;
					case 2:
						this.currentView = 'insurer-edit';
						if(this.opsObj.isGlobalSearch == 'yes') {
							this.$store.commit('setSourceInfo', {
								sourceUri: this.$store.state.sourceInfo.sourceUri,
								currentUri: '/dashboard/globalSearch/editInsurer',
								tempPath: this.$store.state.sourceInfo.tempPath
							});
							logHttp(this.$store.state.sourceInfo, '编辑保险公司', fetchPostUrlencoded);
						}
						break;
					case 3:
						this.currentView = 'customer-Edit';
						if(this.opsObj.isGlobalSearch == 'yes') {
							this.$store.commit('setSourceInfo', {
								sourceUri: this.$store.state.sourceInfo.sourceUri,
								currentUri: '/dashboard/globalSearch/editRepairer',
								tempPath: this.$store.state.sourceInfo.tempPath
							});
							logHttp(this.$store.state.sourceInfo, '编辑修理厂', fetchPostUrlencoded);
						}
						break;
				}

				this.$nextTick(function() {
					this.editIshow = !this.editIshow;
				})
			},
			//查看客户管理
			viewOrg(id) {
				this.$refs.org.initData(id);
			},
		},
		data() {
			return {
				tips: false,
				btnType: '',
				rowId: 0,
				jqSts: 0,
				updateNameShow: false,
				updateNameStr: '',
				rowObj: {},
				currentView: '',
				editIshow: false,
				userPerCode: [],
				isUser: -1,
				isDel: -1,
				columns1: [{
						title: '状态',
						align: 'center',
						key: 'status',
						width: 60,
						render: (h, params) => {
							if(params.row.status == 0) {
								return h('div', {
									'class': {
										stsContainer: true
									}
								}, [
									h('span', {
										'class': {
											green: true,
										}
									}, '')
								])
							} else {
								return h('div', {
									'class': {
										stsContainer: true
									}
								}, [
									h('span', {
										'class': {
											red: true,
										}
									}, '')
								])
							}
						}
					}, {
						width: 60,
						title: '#',
						key: 'idp',
						align: 'left'
					}, {
						title: '全称',
						align: 'left',
						key: 'fullName',
					}, {
						title: '固话',
						align: 'left',
						key: 'telphone',
					}, {
						title: '地址',
						align: 'left',
						key: 'address'
					},

					{
						title: '区域',
						align: 'left',
						key: 'regionName',
						width: 80,
					}, {
						title: '注册时间',
						align: 'left',
						key: 'createTime',
						// render(row, column, index) {
						//   if(row.receiverName!=null){
						//     return `${row.receiverName}`;
						//   }else{
						//     return `无`;
						//   }
						// }
					}, {
						title: '最后更新时间',
						align: 'left',
						key: 'lastModify'
					}, {
						title: '操作',
						align: 'center',
						width: 130,
						render: (h, params) => {
							if(this.isUser > -1) {
								/*if(this.isDel == -1) {

								}*/
								if(params.row.status == 0) {
									return h('div', [
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.deleteOrgan(params.row.id, 'detain', 1)
												}
											}
										}, '禁用'),
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.editModal(params.row)
												}
											}
										}, '编辑')
									])
								} else {
									return h('div', [
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.deleteOrgan(params.row.id, 'awaken', 0)
												}
											}
										}, '启用')
									])
								}
							} else {
								if(params.row.status == 0) {
									return h('div', [
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.deleteOrgan(params.row.id, 'detain', 1)
												}
											}
										}, '禁用'),
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.viewOrg(params.row.id)
														// this.handleEdit(params.row)
												}
											}
										}, '查看')
									])
								} else {
									return h('div', [
										h('Button', {
											props: {
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.deleteOrgan(params.row.id, 'awaken', 0)
												}
											}
										}, '启用')
									])
								}
							}

						}
					},
				],
				columns2: [{
					width: 80,
					key: 'validateMsg',
					title: '缺省',
					align: 'center',
					render: (h, params) => {
						if(params.row.validateMsg.length != 0) {
							return h('Tooltip', {
								props: {
									placement: 'bottom',
								},
								'class': {
									tooltipContainer: true
								}
							}, [
								h('Icon', {
									props: {
										type: 'alert-circled',
									}
								}, ''),
								h('div', {
									slot: 'content',
								}, [
									h('ul', params.row.validateMsg.map(function(item) {
										return h('li', item)
									}))
								])
							])
						}
					}
				}, {
					width: 60,
					title: '#',
					key: 'idp',
					align: 'left'
				}, {
					title: '全称',
					align: 'left',
					key: 'fullName',
				}, {
					title: '固话',
					align: 'left',
					key: 'telphone',
				}, {
					title: '地址',
					align: 'left',
					key: 'address'
				}, {
					title: '支付方式',
					align: 'center',
					key: 'payType',
					width: 100,
					render(row, column, index) {
						if(column.row.payType == 0) {
							return `现付`;
						} else {
							return `月结`;
						}
					}
				}, {
					title: '区域',
					align: 'left',
					key: 'regionName',
					width: 80,
				}, {
					title: '注册时间',
					align: 'left',
					key: 'createTime',
					// render(row, column, index) {
					//   if(row.receiverName!=null){
					//     return `${row.receiverName}`;
					//   }else{
					//     return `无`;
					//   }
					// }
				}, {
					title: '状态',
					align: 'center',
					key: 'status',
					width: 80,
					render: (h, params) => {
						if(params.row.status == 0) {
							return h('div', {
								'class': {
									stsContainer: true
								}
							}, [
								h('span', {
									'class': {
										green: true,
									}
								}, '')
							])
						} else {
							return h('div', {
								'class': {
									stsContainer: true
								}
							}, [
								h('span', {
									'class': {
										red: true,
									}
								}, '')
							])
						}
					}
				}, {
					title: '最后更新时间',
					align: 'left',
					key: 'lastModify'
				}, {
					title: '操作',
					align: 'center',
					width: 130,
					render: (h, params) => {
						if(this.isUser > -1) {
							if(params.row.status == 0) {
								return h('div', [
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.deleteOrgan(params.row.id, 'detain', 1)
											}
										}
									}, '禁用'),
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.editModal(params.row)
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
												this.handleUpdateName(params.row, 'updateName')
											}
										}
									}, '修改名称')
								])
							} else {
								return h('div', [
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.deleteOrgan(params.row.id, 'awaken', 0)
											}
										}
									}, '启用')
								])
							}
						} else {
							if(params.row.status == 0) {
								return h('div', [
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.deleteOrgan(params.row.id, 'detain', 1)
											}
										}
									}, '禁用'),
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.viewOrg(params.row.id)
											}
										}
									}, '查看'),
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.handleUpdateName(params.row, 'updateName')
											}
										}
									}, '修改名称')
								])
							} else {
								return h('div', [
									h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										on: {
											click: () => {
												this.deleteOrgan(params.row.id, 'awaken', 0)
											}
										}
									}, '启用')
								])
							}
						}

					}
				}, ]
			}
		}
	}
</script>
<style>
	.jy-con .ivu-table .demo-table-info-row td {
		background-color: #f7f7f7;
	}
	
	.tooltipContainer .ivu-icon {
		color: red;
	}
</style>