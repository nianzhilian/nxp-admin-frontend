<template>
	<div class="app-container">
		<div class="air-title h3">运营管理</div>
		<Row :gutter="16">
			<Col :sm="{ span: 24 }" :md="{ span: 20 }" :lg="{ span: 12 }">
			<Form :label-width="250">
				<div v-for="type in data" class="opsType">
					<h3>{{type[0].type}}</h3>
					<div v-for="val in type">
						<FormItem label-position="right" :label="val.parameterName" v-if="val.parameterType == 'LIST'">
							<Poptip placement="bottom-start">
								<Button type="info" size="small"><Icon type="plus-round"></Icon></Button>
								<div class="api" slot="content">
									<Input v-model="value[val.id]" style="width: 300px"></Input>
									<Button type="primary" @click="addNewList(val.id)">添加</Button>
									<br /><br />
									<span style="color: #FF0000;">请不要输入英文 , 号</span>
								</div>
							</Poptip>
							<br />
							<div v-for="list in formData[val.id]">
								<Button shape="circle" type="ghost" size="small" @click="removeList(val.id,list)"><Icon type="minus-round"></Icon></Button> {{list}}
							</div>
						</FormItem>
						<FormItem label-position="right" :label="val.parameterName" v-if="val.parameterType == 'INT'">
							<InputNumber :max="val.maxNum" :min="val.minNum" size="large" v-model="formData[val.id]"></InputNumber> {{val.parameterUnit}}
							<span style="color: #888; padding-top: 5px;display: block;">范围：{{val.minNum}} ~ {{val.maxNum}}</span>
						</FormItem>
						<FormItem label-position="right" :label="val.parameterName" v-if="val.parameterType == 'BOOL'">
							<i-switch v-model="formData[val.id]" size="large">
								<span slot="open">启用</span>
								<span slot="close">关闭</span>
							</i-switch>
						</FormItem>
					</div>
				</div>
			</Form>
			<Button type="primary" size="large" long @click="subFrom">提交所有运营参数修改</Button>
			</Col>
		</Row>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet } from '../../utils/requestHttp.js'
	import {
		logHttp
	} from '../../utils/common.js'
	import Ajax from '../../utils/ajax.js'
	export default {
		data() {
			return {
				data: [],
				formData: {},
				value: {}
			}
		},
		methods: {
			initData() {
				let obj={
					status:'-1'
				}
				Ajax.get("/nxp-admin/OpsParms/",obj).then((res) => {
			        if(res.code !== 200){
						this.$Message.error(res.msg);
					} else {
						this.$Message.success("查询运营参数信息成功");
						this.data = [];
						var arrGroup = [];
						for(var i = 0; i <= res.data.length; i++) {
							// 数据插入到隐藏的data中
							if(i < res.data.length) {
								if(res.data[i]['parameterType'] == 'INT') {
									this.formData[res.data[i]['id']] = parseInt(res.data[i]['value']);
								} else if(res.data[i]['parameterType'] == 'BOOL') {
									this.formData[res.data[i]['id']] = res.data[i]['value'] == 'Y' ? true : false;
								} else if(res.data[i]['parameterType'] == 'LIST') {
									this.formData[res.data[i]['id']] = res.data[i]['value'].split(",");
								} else {
									this.formData[res.data[i]['id']] = res.data[i]['value'];
								}
							}
							// 组成新的数据格式给页面显示用
							if(i == 0) {
								arrGroup.push(res.data[i]);
							} else if(i < res.data.length) {
								if(res.data[i - 1].type == res.data[i].type) {
									arrGroup.push(res.data[i]);
								} else {
									this.data.push(arrGroup);
									arrGroup = [];
									arrGroup.push(res.data[i]);
								}
							} else {
								this.data.push(arrGroup);
							}
						}

                 	}
			    });
				
				/*fetchGet('/nxp-admin/sysOp/query').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						this.data = [];
						var arrGroup = [];
						for(var i = 0; i <= res.data.length; i++) {
							// 数据插入到隐藏的data中
							if(i < res.data.length) {
								if(res.data[i]['parameterType'] == 'INT') {
									this.formData[res.data[i]['id']] = parseInt(res.data[i]['value']);
								} else if(res.data[i]['parameterType'] == 'BOOL') {
									this.formData[res.data[i]['id']] = res.data[i]['value'] == 'Y' ? true : false;
								} else if(res.data[i]['parameterType'] == 'LIST') {
									this.formData[res.data[i]['id']] = res.data[i]['value'].split(",");
								} else {
									this.formData[res.data[i]['id']] = res.data[i]['value'];
								}
							}
							// 组成新的数据格式给页面显示用
							if(i == 0) {
								arrGroup.push(res.data[i]);
							} else if(i < res.data.length) {
								if(res.data[i - 1].type == res.data[i].type) {
									arrGroup.push(res.data[i]);
								} else {
									this.data.push(arrGroup);
									arrGroup = [];
									arrGroup.push(res.data[i]);
								}
							} else {
								this.data.push(arrGroup);
							}
						}
					}
				}).catch(() => {
					this.$Message.error("网络错误！");
				});*/
			},
			subFrom() {
				let obj=[];
				for(let i in this.formData) {
					var value='';
					if(typeof(this.formData[i]) == 'boolean') {
						value=this.formData[i] ? 'Y' : 'N';
					} else if(this.formData[i].constructor == Array) {
						value=this.formData[i].join(",");
					} else {
						value=this.formData[i];
					}
					obj.push({'id':i,'value':value})
				}
				/*fetchPostUrlencoded('/nxp-admin/sysOp/update', {
					'parameterId': strId.join("|"),
					'parameterValue': strVal.join("|")
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
					}
				});*/
				Ajax.put("/nxp-admin/OpsParms",obj).then((res) => {
			        if(res.code == 200){
						this.$Message.success(res.msg);
						this.initData();
					} else {
						this.$Message.error(res.msg);
                 	}
			    });
				
			},
			addNewList(id) {
				if(this.value[id] != '' && this.value[id] != undefined) {
					this.formData[id].push(this.value[id]);
					this.$forceUpdate()
					this.value[id] = '';
					this.$Message.success("添加成功！请记得点击最下方的按钮提交更改");
				} else {
					this.$Message.error("请输入内容后新增！");
				}
			},
			removeList(id, val) {
				for(var i = 0; i < this.formData[id].length; i++) {
					if(this.formData[id][i] == val) {
						this.formData[id].splice(i,1);
					}
				}
				this.$forceUpdate()
				this.$Message.success("删除成功！请记得点击最下方的按钮提交更改");
			}
		},
		mounted() {
			this.initData();
			logHttp(this.$store.state.sourceInfo,'运营管理',fetchPostUrlencoded);
		}
	}
</script>

<style scoped>
	.opsType {
		margin-top: 32px;
	}

	.opsType h3 {
		border-top: #DDDDDD 1px solid;
		border-bottom: #DDDDDD 1px solid;
		background: #f9f9f9;
		margin-bottom: 16px;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
	}
</style>
