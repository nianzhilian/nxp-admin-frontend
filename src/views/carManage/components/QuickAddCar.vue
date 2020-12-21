<template>
	<div>
		<!-- 公共选择车型 -->
		<Row>
			<ul class='oUl'>
				<li @click="gostep(1)" v-bind:class="{hover2:step ==1}"><span>厂商</span></li>
				<li @click="gostep(2)" v-bind:class="{hover2:step ==2}"><span>品牌</span></li>
				<li @click="gostep(3)" v-bind:class="{hover2:step ==3}"><span>车系</span></li>
				<li @click="gostep(4)" v-bind:class="{hover2:step ==4}"><span>年款</span></li>
				<li @click="gostep(5)" v-bind:class="{hover2:step ==5 ||  step ==6}"><span>销售名称</span>
				</li>
			</ul>
		</Row>

		<div class="step-box " v-if='step == 1'>
			<ul class="title-box">
				<li v-on:click='selectCS("a,b")' v-bind:class="{hover1:step1 == 'a,b'}">A,B</li>
				<li @click="selectCS('c,d')" v-bind:class="{hover1:step1 == 'c,d'}">C,D</li>
				<li @click="selectCS('e,f,g')" v-bind:class="{hover1:step1 == 'e,f,g'}">E,F,G</li>
				<li @click="selectCS('h,j')" v-bind:class="{hover1:step1 == 'h,j'}">H,J</li>
				<li @click="selectCS('k,l,m,n,o,p')" v-bind:class="{hover1:step1 == 'k,l,m,n,o,p'}">K,L,M,N,O,P</li>
				<li @click="selectCS('q,r')" v-bind:class="{hover1:step1 == 'q,r'}">Q,R</li>
				<li @click="selectCS('s')" v-bind:class="{hover1:step1 == 's'}">S</li>
				<li @click="selectCS('t,w,x')" v-bind:class="{hover1:step1 == 't,w,x'}">T,W,X</li>
				<li @click="selectCS('y,z')" v-bind:class="{hover1:step1 == 'y,z'}">Y,Z</li>
			</ul>
		</div>
		<!--1      厂商-->
		<Row v-if="step == 1" style="margin-top:-10px;">
			<ul class='list-box'>
				<li v-for="val in changShang" v-on:click="selectCSOne(val.id,val.name)" v-bind:class="{isColor:val.id ==changshangid}">{{val.name}}</li>
			</ul>
		</Row>
		<!-- 2  品牌-->
		<Row v-if="step == 2">
			<ul class='list-box'>
				<li v-for="val in pinPai" v-on:click="selectPPOne(val.id,val.name)" v-bind:class="{isColor:val.id ==pinpaiid}">{{val.name}}</li>
			</ul>
		</Row>
		<!-- 3  车系-->
		<Row v-if="step == 3">
			<ul class='list-box'>
				<li v-for="val in cheXi" v-on:click="selectCXOne(val.id,val.name)" v-bind:class="{isColor:val.id ==chexiid}">{{val.name}}</li>
			</ul>
		</Row>

		<!-- 4  年款-->
		<Row v-if="step == 4">
			<ul class='list-box'>
				<li v-for="val in nianKuan" v-on:click="selectNKOne(val.id,val.name)" v-bind:class="{isColor:val.id ==niankuanid}">{{val.name}}</li>
			</ul>
		</Row>
		<!-- 5  销售名称-->
		<Row v-if="step == 5">
			<ul class='list-box'>
				<li v-for="val in xiaoShouName" v-on:click="selectListOne(val.id,val.name)" v-bind:class="{isColor:val.id ==xiaoshounameid}">{{val.name}}</li>
			</ul>
		</Row>
		<!-- 6  列表-->
		<Row v-if="step == 6">
			<ul class='list-box'>
				<li v-for="val in listBiao" v-on:click="selectXSOne(val.id,val.name)">{{val.name}}</li>
			</ul>
		</Row>

		<Table stripe :columns="columns1" :data="lists" v-if="step==6 "></Table>

		<div slot="footer" style="margin-top: 20px;">
			{{changshangName}} - {{pinpaiName}} - {{chexiName}} - {{niankuanName}} - {{xiaoshounameName}}
		</div>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'

	export default {
		props: ['quickAddCarId', 'liyang'],
		data() {
			return {
				changShang: [],
				pinPai: [],
				cheXi: [],
				nianKuan: [],
				xiaoShouName: [],
				lists: [],
				step: 1,
				step1: '',
				changshangid: '',
				chexiid: '',
				niankuanid: '',
				pinpaiid: '',
				xiaoshounameid: '',
				changshangName: '',
				chexiName: '',
				niankuanName: '',
				pinpaiName: '',
				xiaoshounameName: '',
				listBiao: [],
				columns1: [{
						title: '厂商',
						key: 'changJia'
					},
					{
						title: '品牌',
						key: 'pinPai'
					},
					{
						title: '车系',
						key: 'cheXi'
					},
					{
						title: '年款',
						key: 'nianKuan'
					},
					{
						title: '销售名称',
						key: 'xiaoShouName'
					},
					{
						title: '车辆类型',
						key: 'cheXing'
					},
					{
						title: '车身型式',
						key: 'csxs'
					},
					{
						title: '排量',
						key: 'paiLiang'
					},
					{
						title: '选择',
						render: (h, params) => {
								return h('Button', {
									on: {
										click: () => {
                                            this.save(params.row.levelId)
                                        }
									}
								}, '选择')
						}
					},
				],
			}
		},
		created() {},
		watch: {
			quickAddCarId: 'clearData',
			liyang() {
				this.getCheck();
			}
		},
		methods: {
			clearData() {
				var self = this;
				self.changShang = [];
				self.pinPai = [];
				self.cheXi = [];
				self.nianKuan = [];
				self.xiaoShouName = [];
				self.lists = [];
				self.changshangName = '';
				self.chexiName = '';
				self.niankuanName = '';
				self.pinpaiName = '';
				self.xiaoshounameName = '';
				self.changshangid = '';
				self.chexiid = '';
				self.niankuanid = '';
				self.pinpaiid = '';
				self.xiaoshounameid = '';
				self.step = 1;
			},
			//获取默认数据
			getCheck() {
				if(this.liyang != '' && this.liyang != null && this.liyang != undefined) {
					let _self = this;

					fetchGet("/nxp-admin/liYang/carStatus/" + this.liyang, {
						carNote: _self.carNote
					}).then((res) => {
						if(res.flag != 0) {
							this.$Message.error(res.msg);
						} else {
							_self.changshangName = res.data.changJia;
							_self.chexiName = res.data.cheXi;
							_self.niankuanName = res.data.nianKuan;
							_self.pinpaiName = res.data.pinPai;
							_self.xiaoshounameName = res.data.xiaoShouName;
						}
					});

				}
			},
			//获取厂商
			selectCS(val) {
				var self = this;
				self.step1 = val;
				self.changShang = [];

				fetchGet("/nxp-admin/liYang/changshang").then((res) => {
					if(res.flag != 0) {
						this.$Message.error(res.msg);
					} else {
						for(var i = 0; i < res.data.length; i++) {
							if(val.indexOf(res.data[i]['first']) > -1) {
								self.changShang.push(res.data[i]);
							}
						}
					}
				});
			},
			selectCSOne(val, name) {
				var self = this;
				self.changshangid = val;
				self.changshangName = name;
				self.chexiName = '';
				self.niankuanName = '';
				self.pinpaiName = '';
				self.xiaoshounameName = '';
				self.step = 2;
				self.pinPai = [];

				fetchGet("/nxp-admin/liYang/pinpai/" + val).then((res) => {
					if(res.flag != 0) {
						this.$Message.error(res.msg);
					} else {
						self.pinPai = res.data;
					}
				});

			},
			gostep(val) {
				var self = this;
				if(val == 1) {
					self.step = 1;
				} else if(val == 2) {
					self.step = 2;
				} else if(val == 3) {
					self.step = 3;
				} else if(val == 4) {
					self.step = 4;
				} else {
					self.step = 5;
				}
			},
			//最终选择车型
			save(id) {
				var self = this;

				fetchPostUrlencoded("/nxp-admin/order/updateCar/", {
					orderId: self.quickAddCarId,
					liyangId: id
				}).then((res) => {
					if(res.flag != 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						this.close();
					}
				});
			},
			selectPPOne(val, name) {
				var self = this;
				self.pinpaiid = val;
				self.pinpaiName = name;
				self.step = 3;
				self.cheXi = [];

				fetchGet("/nxp-admin/liYang/chexi/" + val).then((res) => {
					if(res.flag != 0) {
						this.$Message.error(res.msg);
					} else {
						self.cheXi = res.data;
					}
				});

			},
			selectCXOne(val, name) {
				var self = this;
				self.chexiid = val;
				self.chexiName = name;
				self.step = 4;
				self.nianKuan = [];

				fetchGet("/nxp-admin/liYang/niankuan/" + val).then((res) => {
					if(res.flag != 0) {
						this.$Message.error(res.msg);
					} else {
						self.nianKuan = res.data;
					}
				});

			}, //获取销售名称
			selectNKOne(val, name) {
				var self = this;
				self.niankuanid = val;
				self.niankuanName = name;
				self.step = 5;
				self.xiaoShouName = [];

				fetchGet("/nxp-admin/liYang/xiaoshouname/" + val).then((res) => {
					if(res.flag != 0) {
						this.$Message.error(res.msg);
					} else {
						self.xiaoShouName = res.data;
					}
				});
			},
			selectListOne(val, name) {
				var self = this;
				self.step = 6;
				self.xiaoshounameid = val;
				self.xiaoshounameName = name;
				//self.xiaoShouName = [];

				fetchGet("/nxp-admin/liYang/info/?changshangid=" + self.changshangid + '&chexiid=' + self.chexiid + "&niankuanid=" + self.niankuanid + "&pinpaiid=" + self.pinpaiid + '&xiaoshounameid=' + self.xiaoshounameid).then((res) => {
					if(res.flag != 0) {
						this.$Message.error(res.msg);
					} else {
						self.lists = res.data;
					}
				});

			},
			close() {
				this.$emit("on-close");
			},
		}
	}
</script>

<style scoped="scoped">
	.oUl {
		overflow: hidden;
		line-height: 40px;
		display: block;
		border: 1px solid #DDD;
	}
	
	.oUl li {
		float: left;
		padding: 0 40px;
		cursor: pointer;
		list-style: none;
		border-right: #DDDDDD 1px solid;
	}
	
	ul li:hover span {
		color: #2d8cf0;
		font-weight: bold;
	}
	
	.step-box {
		margin-top: 20px;
		overflow: hidden;
	}
	
	.title-box {
		overflow: hidden;
	}
	
	.title-box li {
		list-style: none;
		float: left;
		margin-right: 10px;
		border: 1px solid #ddd;
		padding: 4px 8px;
		cursor: pointer;
		border-radius: 5px;
	}
	
	.isColor {
		border: #2d8cf0 1px solid;
		color: #2d8cf0;
		font-weight: bold;
	}
	
	.hover1 {
		font-weight: bold;
	}
	
	.hover2 {
		color: #2d8cf0;
	}
	
	.list-box {
		overflow: hidden;
		margin-top: 20px;
	}
	
	.list-box li {
		float: left;
		margin-right: 10px;
		margin-bottom: 10px;
		border: 1px solid #CCCCCC;
		font-size: 12px;
		cursor: pointer;
		padding: 0 10px;
		border-radius: 4px;
		line-height: 30px;
	}
</style>