<template xmlns="http://www.w3.org/1999/html">

	<div style="text-align: center; margin-top: 20px; ">

		<Collapse class="page-frame" style="text-align: left;" v-model="value2" accordion>
			<Panel name="all" style="">
				<Checkbox-group v-model="value2" style="float: left">
					<Checkbox label="all">
						<span></span>
					</Checkbox>
				</Checkbox-group>
				全局修改
				<div slot="content">
					<div>
						<div class="example-case" slot="content">
							<div class="ivu-table-wrapper">
								<div v-model="value2" class="ivu-table-tab ivu-table-border" style="text-align: right;">
									<table cellspacing="0" cellpadding="0" border="0" style="width:100%;text-align: center">
										<tr>
											<th>A类</th>
											<th>B类</th>
											<th>C类</th>
											<th>D类</th>
											<th>E1类</th>
											<th>E2类</th>
											<th>E3类</th>
											<th>E4类</th>
										</tr>
										<tr>
											<td v-for="val in costData">
                        <span v-if='val.rate===""'>{{'-'}}</span>
                        <span v-if="val.rate!=0">{{val.rate+"%"}}</span>
                        <span v-if="val.rate===0">{{val.rate+"%"}}</span>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
						<Row>
							<Col span="2">
							<Button type="primary" @click="modal1 = true" style="margin-top: 16px">修改费率</Button>
							</Col>
						</Row>
					</div>
					<Modal title="修改管理费" width="820" v-model="modal1" class-name="vertical-center-modal" :mask-closable="false" :closable="false">
						<form name="roleForm" style="text-align: center;margin: 30px;">
							<Row>
								<Col span="3" v-for="val in costData" class="pjmenu">
								<span class="pjname">{{val.name}}类</span>
								<input type="text" class="form-control-global" v-model='val.rate' />
								<span class="form-control-icon">%</span>
								</Col>
							</Row>
						</form>
						<div slot="footer">
							<Button @click="closeAllModal">取消</Button>
							<Button @click="okAllModal" type="primary">提交</Button>
						</div>
					</Modal>
				</div>
			</Panel>
			<Panel name="category" v-model="value2">
				<Checkbox-group v-model="value2" style="float: left">
					<Checkbox label="category">
						<span></span>
					</Checkbox>
				</Checkbox-group>
				分类修改费率
				<div slot="content">
					<div>
						<Row>
							<Col span="2">
							<Button @click="modalOrganization = true" type="primary" style="margin-bottom: 16px;">新添分类</Button>
							</Col>
							<Col span="24">
							<Modal width="820" v-model="modalOrganization" class-name="vertical-center-modal" :mask-closable="false" :closable="false">
								<p slot="header">
									<span>{{modalTitle}}</span>
								</p>
								<div>
									<div class="air-space">分类名称</div>
									<div style="padding: 10px;height: 40px; line-height: 30px;">
										<Row>
											<Col span="2">
											<label><span style="color:red;">*</span>分类名称:</label>
											</Col>
											<Col span="4">
											<input v-if="!isClassified" class="form-control" placeholder="请输入分类名称" style=" height:28px;width: 100%;" v-model="addClassify.name" />
											<input v-if="isClassified" class="form-control" placeholder="请输入分类名称" style=" height:28px;width: 100%;color: #c3cbd6;    background-color: #f7f7f7;    border-color: #d7dde4;" v-model="addClassify.name" />
											</Col>
										</Row>
									</div>
									<div>
										<div class="air-space">平台管理费</div>
										<form name="roleForm" style="text-align: center;margin-top: 30px;">
											<Row>
												<Col v-if="addClassify.name!='未分类'" span="3" v-for="val in addClassify.detail" class="pjmenu">
												<span class="pjname">{{val.name}}类</span>
												<input type="text" class="form-control-global" v-model='val.rate' />

												<span class="form-control-icon">%</span>
												</Col>
												<Col v-if="addClassify.name=='未分类'" span="3" v-for="val in costData" class="pjmenu">
												<span class="pjname">{{val.name}}类</span>
												<input type="text" class="form-control-global" v-model='val.rate' />
												<span class="form-control-icon">%</span>
												</Col>
											</Row>
										</form>
									</div>
									<div>
										<div class="air-space">修理厂</div>
										<div style="height:50px;">
											<Row>
												<Col span="1" offset="21">
												<Button v-if="!isClassified" @click="addXlc()" type="primary">新添修理厂</Button>
												</Col>
											</Row>
										</div>
										<div class="example-case">
											<div class="ivu-table-wrapper">
												<div class="ivu-table ivu-table ivu-table-border" style="text-align: right;">
													<table cellspacing="0" cellpadding="0" border="0" style="width:100%;text-align: center;">
														<tr>
															<!--<th width="30"></th>-->
															<th>
																<div class="ivu-table-cell">修理厂名称</div>
															</th>
															<th v-if="!isClassified" width="80" style="text-align: center;">操作</th>
														</tr>
														<tr v-for="val in filteredXlc">
															<!--<td>-->
															<!--<input type="checkbox" @click="chkremove(val.xlcId)" v-bind:checked="isxlcSelected(val.xlcId)"  >-->
															<!--</td>-->
															<td>{{val.xlcName}}</td>
															<td v-if="!isClassified">
																<i-button :disabled="isClassified" type="error" size="small" @click="classifyXlcRemove(val.xlcId)">删除</i-button>
															</td>
														</tr>
														<!--<tr>-->
														<!--<Button  :disabled="isClassified" @click="classifyXlcRemove()" style="margin: 5px;" type="error">删除</Button>-->
														<!--</tr>-->
													</table>

												</div>
												<Alert v-if='filteredXlc.length==""'>
													<template slot="desc">当期分类，没有修理厂</template>
												</Alert>
											</div>
										</div>
									</div>
								</div>
								<div slot="footer">
									<Button @click="closeCategoryAdd">取消</Button>
									<Button v-if="modalType=='add'" @click="okCategoryAdd('add')" type="primary">提交</Button>
									<Button v-if="modalType=='update'" @click="okCategoryAdd('update')" type="primary">提交</Button>
									<Button v-if="modalType=='weifenlei'" @click="okCategoryAdd('weifenlei')" type="primary">提交</Button>
								</div>
							</Modal>
							<Modal title="新添修理厂" width="820" v-model="modalInvoice" :mask-closable="false" :closable="false">
								<div class="example-case">
									<div class="ivu-table-wrapper">
										<div v-model="value2" class="ivu-table ivu-table ivu-table-border" style="text-align: right;">
											<table v-model="value2" cellspacing="0" cellpadding="0" border="0" style="width:100% ;text-align: left;">
												<tr>
													<th colspan="3">
														<div style="width: 220px; padding:10px;" class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-prepend ivu-input-group-with-append ivu-input-hide-icon">
															<div class="ivu-input-group-prepend">
																<div style="width: 60px;">
																	<span value="day">快速搜索</span>
																</div>
															</div>
															<input type="text" placeholder="" v-model="query" style="width: 130px;border-radius:6px;" class="ivu-input">
														</div>
													</th>
												</tr>
												<tr>
													<th width="100">
														<div class="ivu-table-cell"><input type="checkbox" v-model="checked" v-on:change="allSel(checked,filteredUsers)"></div>
													</th>
													<th>
														<div class="ivu-table-cell">修理厂名称</div>
													</th>
													<th>
														<div class="ivu-table-cell">所属分类</div>
													</th>
												</tr>
												<tr v-for="val in filteredUsers">
													<td>
														<input type="checkbox" @click="chk(val.xlcId,val.categoryId)" v-bind:checked="isSelectedxlcpush(val.xlcId)">
													</td>
													<td>{{val.xlcName}}</td>
													<td>{{categoryFL(val.categoryId)}}</td>
												</tr>
											</table>
										</div>
										<Alert v-if='filteredUsers.length==""'>
											<template slot="desc">没有可以继续添加的修理厂</template>
										</Alert>
									</div>

								</div>
								<div slot="footer">
									<Button @click="closeCategoryXlcAdd">取消</Button>
									<Button @click="okCategoryXlcAdd" type="primary">提交</Button>
								</div>
							</Modal>
							</Col>
						</Row>
						<div class="example-case" slot="content">
							<div class="ivu-table-wrapper">
								<div v-model="value2" class="ivu-table-tab ivu-table-border" style="text-align: right;">
									<table v-model="value2" cellspacing="0" cellpadding="0" border="0" style="width:100%;text-align: center;">
										<tr>
											<th>
												<div class="ivu-table-name">分类名称</div>
											</th>
											<th width="65">A类</th>
											<th width="65">B类</th>
											<th width="65">C类</th>
											<th width="65">D类</th>
											<th width="65">E1类</th>
											<th width="65">E2类</th>
											<th width="65">E3类</th>
											<th width="65">E4类</th>
											<th width="90">修理厂数量</th>
											<th width="95">操作</th>
										</tr>
										<tr v-for="item in filterCategory">
											<td>
												<div class="ivu-table-name">{{item.categoryName}}</div>
											</td>
											<td v-if="item.categoryName!='未分类'" v-for="val in item.detail">
												{{val.rate>=0 ? val.rate+"%":'-'}}
											</td>
											<td v-if="item.categoryName=='未分类'" v-for="val in costData">
                        <span v-if='val.rate===""'>{{'-'}}</span>
												<span v-if="val.rate!=0">{{val.rate+"%"}}</span>
                        <span v-if="val.rate===0">{{val.rate+"%"}}</span>
											</td>
											<td>{{item.count}}</td>
											<td class="handle">
												<i-button type="primary" size="small" @click="classifyupdata(item.categoryId)">编辑</i-button>
												<i-button v-if="item.categoryId" type="error" size="small" @click="classifyRemove(item.categoryId)">删除</i-button>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Panel>
			<Panel name="xlc">
				<Checkbox-group v-model="value2" style="float: left">
					<Checkbox label="xlc" style="float: left">
						<span></span>
					</Checkbox>
				</Checkbox-group>
				按修理厂修改费率
				<div class="example-case" slot="content">
					<div class="ivu-table-wrapper">
						<div v-model="value2" class="ivu-table-tab ivu-table-border" style="text-align: right;">
							<table cellspacing="0" cellpadding="0" border="0" style="width:100%;text-align: center">
								<tr>
									<th colspan="12">
										<div style="width: 220px; padding:10px;" class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-prepend ivu-input-group-with-append ivu-input-hide-icon">
											<div class="ivu-input-group-prepend">
												<div style="width: 60px;">
													<span value="day">快速搜索</span>
												</div>
											</div>
											<input type="text" placeholder="" v-model="xlcquery" style="width: 130px;border-radius:6px;" class="ivu-input">
										</div>
									</th>
								</tr>
								<tr class="ivu-table-tab">
									<th width="30">
										<div>
											<input type="checkbox" v-model="checked" v-on:change="xlcSel(checked,filteredXlcData)">
										</div>
									</th>
									<th>
										<div class="ivu-table-name">
											修理厂名称
										</div>
									</th>
									<th width="65">A类</th>
									<th width="65">B类</th>
									<th width="65">C类</th>
									<th width="65">D类</th>
									<th width="65">E1类</th>
									<th width="65">E2类</th>
									<th width="65">E3类</th>
									<th width="65">E4类</th>
									<th width="90">操作</th>
								</tr>
								<tr class="ivu-table-tab" v-for="item in filteredXlcData">
									<td>
										<input type="checkbox" @click="bulkArr(item.xlcId)" v-bind:checked="isxlcSelected(item.xlcId)">
									</td>
									<td>
										<div class="ivu-table-name">{{item.xlcName}}</div>
									</td>
									<td v-for="item1 in item.detail">
										{{item1.rate!=undefined ? item1.rate+"%":'-'}}
									</td>
									<td>
										<i-button type="primary" size="small" @click="xlcUpdate(item.xlcName,item.xlcId)">修改费率</i-button>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<Row>
						<Col span="2">
						<Button type="primary" @click="bulkEditing()" style=" margin: 10px 0px;">批量修改</Button>
						</Col>
					</Row>
					<Modal width="820" v-model="modal4" :mask-closable="false" :closable="false">
						<p slot="header">
							<span>{{modalXlcTitle}}</span>
						</p>
						<form name="roleForm" style="text-align: center;margin: 30px;">
							<Row>
								<Col span="3" v-for="val in xlcEditData" class="pjmenu">
								<span class="pjname">{{val.name}}类</span>
								<input type="text" class="form-control-global" v-model='val.rate' />
								<span class="form-control-icon">%</span>
								</Col>
							</Row>
						</form>
						<p slot="footer">
							<Button @click="closeXlcInvoice">取消</Button>
							<Button @click="okXlcInvoice" type="primary">提交</Button>
						</p>
					</Modal>
				</div>
			</Panel>
		</Collapse>
	</div>
</template>

<script>
	export default {
		data() {
			return {
			  commonInsId:'',
				user: '',
				isNoticeTrue: false,
				globalval: '',
				allCheck: false,
				xlcCheck: true,
				categoryCheck: false,
				isClassified: false,
				value2: [],
				modalXlcTitle: '',
				categoryArr: [],
				categoryAllArr: [],
				modal1: false,
				modal4: false,
				modalTitle: '新添分类',
				modalType: 'add',
				vertical: '',
				modalOrganization: false,
				modalInvoice: false,
				value13: '',
				select3: 'day',
				query: '',
				xlcquery: '',
				checked: false,
				CommonData: [],
				allXlcData: [

				],
				temporaryXlc: [],
				xlcData: [],
				updateClassify: [],
				addClassify: {
					name: '',
					xlcIds: [],
					detail: [
						{ name: 'A', "pjTypeId": 10, "rate": '' },
						{ name: 'B', "pjTypeId": 11, "rate": '' },
						{ name: 'C', "pjTypeId": 12, "rate": '' },
						{ name: 'D', "pjTypeId": 13, "rate": '' },
						{ name: 'E1', "pjTypeId": 14, "rate": '' },
						{ name: 'E2', "pjTypeId": 15, "rate": '' },
						{ name: 'E3', "pjTypeId": 16, "rate": '' },
						{ name: 'E4', "pjTypeId": 17, "rate": '' }
					],
          insId:''
				},
				verifynum: 0,
				costData: [
					{ name: 'A', "pjTypeId": 10, "rate": '' },
					{ name: 'B', "pjTypeId": 11, "rate": '' },
					{ name: 'C', "pjTypeId": 12, "rate": '' },
					{ name: 'D', "pjTypeId": 13, "rate": '' },
					{ name: 'E1', "pjTypeId": 14, "rate": '' },
					{ name: 'E2', "pjTypeId": 15, "rate": '' },
					{ name: 'E3', "pjTypeId": 16, "rate": '' },
					{ name: 'E4', "pjTypeId": 17, "rate": '' }
				],
				xlcIds: [

				],
				xlcEditData: [
					{ name: 'A', "pjTypeId": 10, "rate": '' },
					{ name: 'B', "pjTypeId": 11, "rate": '' },
					{ name: 'C', "pjTypeId": 12, "rate": '' },
					{ name: 'D', "pjTypeId": 13, "rate": '' },
					{ name: 'E1', "pjTypeId": 14, "rate": '' },
					{ name: 'E2', "pjTypeId": 15, "rate": '' },
					{ name: 'E3', "pjTypeId": 16, "rate": '' },
					{ name: 'E4', "pjTypeId": 17, "rate": '' }
				]
			}
		},
		created() {
			this.getCookie();
			this.getCustomers()
		},
		watch: {
			'$route': 'getCustomers',
			value2: function(val) {
				var str = val.join("");
				if(str != '' && str != undefined && str != null) {
					if(str != this.globalval) {
						this.globalval = str;
						this.getUpdateCustomers(str);
					}
				} else {
					this.value2.push(this.globalval);
				}
			}
		},
		computed: {
			filteredUsers: function() {
				//快速搜索
				var self = this;
				return self.allXlcData.filter(function(user) {
					return user.xlcName.indexOf(self.query) !== -1;
				})
			},
			filteredXlc: function() {
				var self = this;

				return self.temporaryXlc.filter(function(user) {

					return self.addClassify.xlcIds.indexOf(user.xlcId) !== -1;
					//return user.xlcId.indexOf(self.addClassify.xlcIds)!==-1;

				})
			},
			filteredXlcData: function() {
				var self = this;
				return self.xlcData.filter(function(user) {
					function down(x, y) {
						return(x.pjTypeId > y.pjTypeId) ? 1 : -1
					}
					user.detail.sort(down);
					if(user.detail.length == 0) {
						user.detail.push({}, {}, {}, {}, {}, {}, {}, {})
					}
					return user.xlcName.indexOf(self.xlcquery) !== -1;
				})
			},
			filterCategory: function() {
				var self = this;
				if(self.CommonData) {
					return self.CommonData.filter(function(user) {
						if(user.detail != undefined && user.detail != null && user.detail != '') {
							function down(x, y) {
								return(x.pjTypeId > y.pjTypeId) ? 1 : -1
							}
							user.detail.sort(down);
						} else {
							user.detail = [{}, {}, {}, {}, {}, {}, {}, {}];
						}
						return user;
					})
				}
			}
		},
		methods: {
			getCookie() {
        this.commonInsId=this.$route.query.insId;
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			},
			getCustomers() {
				var self = this;
				this.$http({
					url: "/nxp-crm/sys/setting/query?insId="+self.commonInsId,
					method: 'GET',
					headers: {
						'token': this.user.token,
					}
				}).then((res) => {
					if(res.data.flag != 0) {
            this.$Message.error(res.data.msg);
					} else {
						this.value2.push(res.data.msg);
						if(res.data.msg == 'all') {
							this.getGlobal();
						} else if(res.data.msg == 'category') {
							this.getCategory();
						} else {
							this.getXlc();
						}
					}
				}).catch((err) => {
          			this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
				})
			},
			getUpdateCustomers(str) {
				//修改费率模式
				this.$http({
					url: '/nxp-crm/sys/setting/edit',
					method: 'POST',
					headers: {
						'token': this.user.token
					},
					data: {
            insId:this.commonInsId,
            way: str
					}
				}).then((res) => {
					if(res.data.flag != 0) {
            this.$Message.error(res.data.msg);
					} else {
						this.$Message.success('费率模式，修改成功');
						if(str == 'all') {
							this.getGlobal();
						} else if(str == 'category') {
							this.getCategory();
							this.getGlobal();
						} else {
							this.getXlc();
						}
					}
				}).catch((err) => {
          			this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
				})
			},
			getGlobal() {
				this.$http({
					url: '/nxp-crm/sys/subsidy/all/list?insId='+this.commonInsId,
					method: 'GET',
					headers: {
						'token': this.user.token
					}
				}).then((res) => {
					if(res.data.flag != 0) {
            this.$Message.error(res.data.msg);
					} else {
						for(var i = 0; i < res.data.data.length; i++) {
							for(var j = 0; j < this.costData.length; j++) {
								if(this.costData[j].pjTypeId == res.data.data[i].pjTypeId) {
									this.costData[j].rate = res.data.data[i].rate;
								}
							}

						}
					}
				}).catch((err) => {
          			this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
				})
			},
			getCategory() {
				this.$http({
					url: '/nxp-crm/sys/subsidy/category/list?insId='+this.commonInsId,
					method: 'GET',
					headers: {
						'token': this.user.token
					}
				}).then((res) => {
					if(res.data.flag != 0) {
            this.$Message.error(res.data.msg);
					} else {
						this.CommonData = res.data.data;
					}
				}).catch((err) => {
          			this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
				})
			},
			getXlc() {
				this.$http({
					url: '/nxp-crm/sys/subsidy/xlc/list?insId='+this.commonInsId,
					method: 'GET',
					headers: {
						'token': this.user.token
					}
				}).then((res) => {
					if(res.data.flag != 0) {
            this.$Message.error(res.data.msg);
					} else {
						this.xlcData = res.data.data;
					}
				}).catch((err) => {
          			this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
				})
			},
			closeAllModal() {
        for(var j = 0; j < this.costData.length; j++) {
            this.costData[j].rate = '';
        }
				this.getGlobal();
				this.modal1 = false;
			},
			okAllModal() {
				this.verify();
				if(this.verifynum == 0) {
					this.$http({
						url: '/nxp-crm/sys/subsidy/update',
						method: 'POST',
						headers: {
							'token': this.user.token
						},
						data: {
              insId:this.commonInsId,
							type: 'all',
							detail: this.costData
						}
					}).then((res) => {
						if(res.data.flag != 0) {
              this.$Message.error(res.data.msg);
						} else {
							this.modal1 = false;
							this.getGlobal();
						}
						//this.CommonData=res.data.data;
					}).catch((err) => {
            			this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
					})
				} else {
          this.$Message.error("请输入小于100的数字");
				}
			},
			del(catId) {
				this.$http({
					url: '/nxp-crm/sys/cat/remove/',
					method: 'POST',
					headers: {
						'token': this.user.token
					}
				}).then((res) => {
					//this.CommonData=res.data.data;
				}).catch((err) => {
          			this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
				})
			},
			closeCategoryAdd() {
				this.getCategory();
				this.getGlobal();
				this.isClassified = false;
				this.modalOrganization = false;
				this.addClassify.name = '';
				this.addClassify.xlcIds = [];
				this.modalType = 'add';
				this.modalTitle = '新增分类';
				this.temporaryXlc = [];
        for(var j = 0; j < this.costData.length; j++) {
          this.costData[j].rate = '';
        }
				for(var i = 0; i < this.addClassify.detail.length; i++) {
					this.addClassify.detail[i].rate = '';
				}
			},
			okCategoryAdd(type) {
				if(type != 'weifenlei') {
					this.verify("category");
				} else {
					this.verify();
				}
				if(type == 'add') {
					if(this.addClassify.name != '' && this.addClassify.name != null && this.addClassify.name != undefined && this.verifynum == 0) {
            this.addClassify.insId=this.commonInsId;
						this.$http({
							url: '/nxp-crm/sys/cat/add',
							method: 'POST',
							headers: {
								'token': this.user.token
							},
							data: this.addClassify
						}).then((res) => {
							if(res.data.flag != 0) {
                this.$Message.error(res.data.msg);
							} else {
								//重新请求分类列表
								this.addClassify.name = '';
								this.addClassify.xlcIds = [];
								this.temporaryXlc = [];
								for(var i = 0; i < this.addClassify.detail.length; i++) {
									this.addClassify.detail[i].rate = '';
								}
								this.getCategory();
								this.modalOrganization = false;
							}
						}).catch((err) => {
              				this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
						})
					} else {
            this.$Message.error("分类名称或管理费填写有误！");
					}
				} else if(type == 'update') {
					if(this.addClassify.name != '' && this.addClassify.name != null && this.addClassify.name != undefined && this.verifynum == 0) {
            this.addClassify.insId=this.commonInsId;
						this.$http({
							url: '/nxp-crm/sys/cat/edit',
							method: 'POST',
							headers: {
								'token': this.user.token
							},
							data: this.addClassify
						}).then((res) => {
							if(res.data.flag != 0) {
                this.$Message.error(res.data.msg);
							} else {
								//重新请求分类列表
								this.isClassified = false;
								this.modalType = 'add';
								this.modalTitle = '新增分类';
								this.addClassify.name = '';
								this.addClassify.xlcIds = [];
								this.temporaryXlc = [];
								for(var i = 0; i < this.addClassify.detail.length; i++) {
									this.addClassify.detail[i].rate = '';
								}
								this.getCategory();
								this.modalOrganization = false;
							}
						}).catch((err) => {
							this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
						})
					}
				} else {
					if(this.verifynum == 0) {
						this.$http({
							url: '/nxp-crm/sys/subsidy/update',
							method: 'POST',
							headers: {
								'token': this.user.token
							},
							data: {
							  insId:this.commonInsId,
								type: 'all',
								detail: this.costData
							}
						}).then((res) => {
							//重新请求分类列表
							if(res.data.flag != 0) {
                this.$Message.error(res.data.msg);
							} else {
								this.isClassified = false;
								this.modalType = 'add';
								this.modalTitle = '新增分类';
								this.addClassify.name = '';
								this.addClassify.xlcIds = [];
								this.temporaryXlc = [];
								for(var i = 0; i < this.addClassify.detail.length; i++) {
									this.addClassify.detail[i].rate = '';
								}
								this.getCategory();
								this.getGlobal();
								this.modalOrganization = false;
							}
						}).catch((err) => {
							this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
						})
					} else {
            this.$Message.error("请输入1-100的数字");
					}
				}
			},
			addXlc() {
				this.categoryAllArr = [];
				//第二种模式 点击（添加或者编辑）
				this.modalInvoice = true;
				this.$http({
					url: '/nxp-crm/sys/xlc/query',
					method: 'POST',
					headers: {
						'token': this.user.token
					},
					data: {
					    insId:this.commonInsId,
						exclude: this.addClassify.xlcIds
					}
				}).then((res) => {
					if(res.data.flag !=0) {
            this.$Message.error(res.data.msg)
					} else {
						this.allXlcData = res.data.data;
					}
				}).catch((err) => {
					this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
				})
				this.$http({
					url: '/nxp-crm/sys/xlc/query',
					method: 'POST',
					headers: {
						'token': this.user.token
					},
					data: {
            			insId:this.commonInsId,
						exclude: []
					}
				}).then((res) => {
					//获取所有修理厂 以便查找
					if(res.data.flag != 0) {
            			this.$Message.error(res.data.msg);
					} else {
						this.temporaryXlc = res.data.data;
					}
				}).catch((err) => {
 					this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
				})
			},
			isSelected(id) {
				return this.addClassify.xlcIds.indexOf(id) > -1;
			},
			isxlcSelected(id) {
				return this.xlcIds.indexOf(id) > -1;
			},
			isSelectedxlcpush(id) {
				return this.categoryAllArr.indexOf(id) > -1;
			},
			chk(id, categoryId) {
				//删除或添加修理厂
				var idx = this.categoryAllArr.indexOf(id);
				if(idx > -1) {
					if(categoryId != '' && categoryId != undefined && categoryId != null) {
						this.categoryArr.splice(idx, 1);
					}
					this.categoryAllArr.splice(idx, 1);
				} else {
					if(categoryId != '' && categoryId != undefined && categoryId != null) {
						this.categoryArr.push(id);
					}
					this.categoryAllArr.push(id);
				}
			},
			allSel(checked, Data) {
				if(checked == true) {
					for(var i = 0; i < Data.length; i++) {
						var idx = this.categoryAllArr.indexOf(Data[i].xlcId);
						var categoryId = Data[i].categoryId;
						if(idx == -1) {
							if(categoryId != '' && categoryId != undefined && categoryId != null) {
								this.categoryArr.push(Data[i].xlcId);
							}
							this.categoryAllArr.push(Data[i].xlcId);
						}
					}
				} else {
					this.categoryArr = [];
					this.categoryAllArr = [];
				}
			},
			classifyRemove(id) {
				//分类删除
				this.$Modal.confirm({
					title: '',
					content: '<p>删除当前分类，分类下修理厂将被分配到未分类里</p>',
					onOk: () => {
						this.$http({
							url: "/nxp-crm/sys/cat/remove/" + id,
							method: 'POST',
							headers: {
								'token': this.user.token
							}
						}).then((res) => {
							if(res.data.flag != 0) {
                this.$Message.error(res.data.msg);
							} else {
								this.getCategory();
							}
						}).catch((err) => {
              				this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
						})
					},
					onCancel: () => {}
				});
			},
			classifyupdata(id) {
				this.verify("category");
				//修改分类
				if(id == '' || id == null || id == undefined) {
					this.isClassified = true;
					this.modalType = 'weifenlei';
				} else {
					this.modalTitle = '修改分类';
					this.modalType = 'update';
				}
				for(var i = 0; i < this.CommonData.length; i++) {
					if(this.CommonData[i].categoryId == id) {
						this.addClassify.id = this.CommonData[i].categoryId;
						this.temporaryXlc = this.CommonData[i].xlcs;
						for(var j = 0; j < this.CommonData[i].xlcs.length; j++) {
							this.addClassify.xlcIds.push(this.CommonData[i].xlcs[j].xlcId);
						}
						this.addClassify.name = this.CommonData[i].categoryName;
						for(var k = 0; k < this.CommonData[i].detail.length; k++) {
							for(var y = 0; y < this.addClassify.detail.length; y++) {
								if(this.CommonData[i].detail[k].pjTypeId == this.addClassify.detail[y].pjTypeId) {
									this.addClassify.detail[y].rate = this.CommonData[i].detail[k].rate;
								}
							}
						}
					}
				}
				this.modalOrganization = true;
				// .ivu-modal-header-inner
			},
			xlcUpdate(name, id) {
				this.xlcIds.splice(0, this.xlcIds.length, id);
				this.modalXlcTitle = "管理费费率修改";
				this.modal4 = true;
				for(var i = 0; i < this.xlcData.length; i++) {
					var istrue = true;
					if(this.xlcData[i].xlcId == id) {
						for(var j = 0; j < this.xlcData[i].detail.length; j++) {
							if(this.xlcData[i].detail[j].rate == undefined || this.xlcData[i].detail[j].rate == '' || this.xlcData[i].detail[j].rate == null) {
								istrue = false;
							}
						}
						if(istrue != false) {
							for(var j = 0; j < this.xlcData[i].detail.length; j++) {
								for(var k = 0; k < this.xlcEditData.length; k++) {
									if(this.xlcData[i].detail[j].pjTypeId == this.costData[k].pjTypeId) {
										this.xlcEditData[k].rate = this.xlcData[i].detail[j].rate;
									}
								}
							}
						} else {
							for(var k = 0; k < this.xlcEditData.length; k++) {
								this.xlcEditData[k].rate = '';
							}
						}
					}
				}
			},
			okXlcInvoice() {
				this.verify('xlc');
				if(this.verifynum == 0) {
					this.$http({
						url: '/nxp-crm/sys/xlc/update',
						method: 'POST',
						headers: {
							'token': this.user.token
						},
						data: {
						    insId:this.commonInsId,
							xlcIds: this.xlcIds,
							detail: this.xlcEditData
						}
					}).then((res) => {
						if(res.data.flag!="0") {
              this.$Message.error(res.data.msg);
						} else {
							this.verifyclear('xlc');
							this.modal4 = false;
							this.getXlc();
							this.xlcIds = [];
						}
					}).catch((err) => {
            			this.$Message.warning('哎呀！服务器好像出问题了,请稍后重试...')
						//this.modal4 = false;
					})
				} else {
          this.$Message.error("请输入1-100的数字");
				}
			},
			closeXlcInvoice() {
				//第三种模式
				this.xlcIds = [];
				this.getXlc();
				this.modal4 = false;
				this.verifyclear('xlc');
			},
			bulkArr(id) {
				var idx = this.xlcIds.indexOf(id);
				if(idx > -1) {
					this.xlcIds.splice(idx, 1);
				} else {
					this.xlcIds.push(id);
				}
			},
			bulkEditing() {
				if(this.xlcIds.length == 0) {
					this.$Message.warning('请点击复选框进行选择');
				} else {
					//this.verifyclear("xlc");
					this.modalXlcTitle = "批量费率修改";
					this.modal4 = true;
				}
			},classifyXlcRemove(xlcId) {
				this.$Modal.confirm({
					title: '',
					content: '<p>是否删除此修理厂？</p>',
					onOk: () => {
						var idx = this.addClassify.xlcIds.indexOf(xlcId);
						if(idx > -1) {
							this.addClassify.xlcIds.splice(idx, 1);
						}
					},
					onCancel: () => {}
				})
			},categoryFL(id) {
				//分类
				if(!id) return '未分类';
				for(var i = 0; i < this.CommonData.length; i++) {
					if(this.CommonData[i].categoryId == id) {
						return this.CommonData[i].categoryName;
					}
				}
			},
			okCategoryXlcAdd() {
				if(this.categoryArr.length != 0) {
					this.confirm();
				} else {
					for(var i = 0; i < this.categoryAllArr.length; i++) {
						var idx = this.addClassify.xlcIds.indexOf(this.categoryAllArr[i]);
						if(idx == -1) {
							this.addClassify.xlcIds.push(this.categoryAllArr[i]);
						}
					}
					this.modalInvoice = false;
				}
			},
			closeCategoryXlcAdd() {
				this.modalInvoice = false;
			},
			confirm() {
				this.$Modal.confirm({
					title: '',
					content: '<p>至少有一个修理厂，在其他分类里存在，继续添加，所选修理厂将从原有分类里删除</p>',
					onOk: () => {
						for(var i = 0; i < this.categoryAllArr.length; i++) {
							var idx = this.addClassify.xlcIds.indexOf(this.categoryAllArr[i]);
							if(idx == -1) {
								this.addClassify.xlcIds.push(this.categoryAllArr[i]);
							}
						}
						this.categoryArr = [];
						this.categoryAllArr = [];
						this.modalInvoice = false;
					},
					onCancel: () => {}
				});
			},
			xlcSel(checked, data) {
				if(checked == true) {
					for(var i = 0; i < data.length; i++) {
						var idx = this.xlcIds.indexOf(data[i].xlcId);
						if(idx > -1) {
							//this.xlcIds.splice(idx,1);
						} else {
							this.xlcIds.push(data[i].xlcId);
						}
					}
				} else {

					this.xlcIds = [];
				}
			},
			verify(str) {
				this.verifynum = 0;
				var self = this.costData;
				if(str == 'category') {
					self = this.addClassify.detail;
				} else if(str == 'xlc') {
					self = this.xlcEditData;
				}
				for(var i = 0; i < self.length; i++) {
					if(self[i].rate >= 0 && self[i].rate < 100) {
					} else {
						this.verifynum += 1;
					}
				}
			},
			verifyclear(str) {
				var self = this.costData;
				if(str == 'xlc') {
					self = this.xlcEditData;
				}
				for(var k = 0; k < self.length; k++) {
					self[k].rate = '';
				}
			}
		}
	}
</script>
<style>
  .pjmenu{
    position: relative;
  }
  .pjname{
    float: left;
    line-height: 34px;
    width: 30px;
  }
  .page-title{
    height: 38px;
    font-size: 18px;
    line-height: 38px;
    margin-left: 16px;
  }
	.ivu-collapse>.ivu-collapse-item>.ivu-collapse-header {
		padding-left: 16px !important;
	}

	.ivu-table-name {
		text-align: left;
		padding-left: 18px;
		padding-right: 18px;
	}

	ivu-table-tab {
		width: inherit;
		height: 100%;
		max-width: 100%;
		overflow: hidden;
		color: #657180;
		font-size: 12px;
		background-color: #fff;
		box-sizing: border-box;
	}

	.ivu-table-tab td,
	.ivu-table-tab th {
		min-width: 0;
		height: 48px;
		box-sizing: border-box;
		text-align: center;
		text-overflow: ellipsis;
		vertical-align: middle;
		border-bottom: 1px solid #e3e8ee;
	}

	.ivu-table-tab th {
		height: 40px;
		white-space: nowrap;
		overflow: hidden;
		background-color: #f5f7f9;
	}

	.ivu-icon-arrow-right-b:before {
		content: "" !important;
	}

	.ivu-collapse-item-active {
		background: #E5E5E5;
	}

	.ivu-checkbox-group,
	.ivu-checkbox-wrapper {
		height: 13px !important;
	}

	.handle {
		padding: 0 !important;
		text-align: center !important;
	}

	.active {
		background: #eee !important;
	}

	.ivu-table td {
		padding-left: 18px;
		padding-right: 18px;
	}

	.ivu-table table {
		table-layout: auto !important;
	}

	.wrapper {
		width: 900px;
		margin: 0 auto;
	}

	.page-frame {
		width: 860px;
		margin: 0 auto;
	}

	.air-space {
		background: #f4f4f4;
		line-height: 24px;
		padding: 0 10px;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		-ms-border-radius: 4px;
		border-radius: 4px;
		margin: 20px 0;
	}

	.form-control-icon {
		position: absolute;
		top: 9px;
		right: 20px;
	}

	.form-control-global {
		display: block;
		width: 59px;
		height: 34px;
		padding: 6px 12px;
		font-size: 14px;
		line-height: 1.42857143;
		color: #555;
		background-color: #fff;
		background-image: none;
		border: 1px solid #ccc;
		border-radius: 4px;
		-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
		-webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
		-o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
		transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
	}

	.form-control {
		display: block;
		width: 100%;
		height: 34px;
		padding: 6px 12px;
		font-size: 14px;
		line-height: 1.42857143;
		color: #555;
		/*background-color: #fff;*/
		background-image: none;
		border: 1px solid #ccc;
		border-radius: 4px;
		-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
		-webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
		-o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
		transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
	}
  .ivu-modal{
    top: 10px !important;
    margin-bottom: 10px;
  }
  .ivu-col-offset-21{
    margin-left:88.9% !important;
  }
</style>
