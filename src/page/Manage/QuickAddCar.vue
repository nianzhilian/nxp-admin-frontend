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
		<div class="ivu-table-tab ivu-table-border" style="text-align: right;margin-left: 28px;" v-if="step==6 ">
			<table border="0" cellspacing="0" cellpadding="0" style="width:100% ;line-height: 36px;font-size: 12px;">
				<thead>
					<tr>
						<th>厂商</th>
						<th>品牌</th>
						<th>车系</th>
						<th>年款</th>
						<th>销售名称</th>
						<th>车辆类型</th>
						<th>车身型式</th>
						<th>排量</th>
						<th>选择</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="val in lists">
						<td>{{ val.changJia }}</td>
						<td>{{ val.pinPai }}</td>
						<td>{{ val.cheXi }}</td>
						<td>{{ val.nianKuan }}</td>
						<td>{{ val.xiaoShouName }}</td>
						<td>{{ val.cheXing }}</td>
						<td>{{val.csxs}}</td>
						<td>{{val.paiLiang}}</td>
						<td>
							<Button type="primary" @click="save(val.levelId)">选择</Button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div slot="footer" style="line-height: 40px;margin-left: 30px;">
			{{changshangName}} - {{pinpaiName}} - {{chexiName}} - {{niankuanName}} - {{xiaoshounameName}}
		</div>
	</div>
</template>

<script>
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
				xiaoshounameName: ''
			}
		},
		created() {
			this.getCookie();
		},
		watch: {
			quickAddCarId: 'clearData',
			liyang: 'getCheck'
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
					var self = this;
					self.$http({
						url: "/nxp-admin/liYang/carStatus/" + this.liyang,
						method: 'GET',
						headers: {
							'token': self.user.token
						}
					}).then(function(res) {
						if(res.data.flag == 0) {
							self.changshangName = res.data.data.changJia;
							self.chexiName = res.data.data.cheXi;
							self.niankuanName = res.data.data.nianKuan;
							self.pinpaiName = res.data.data.pinPai;
							self.xiaoshounameName = res.data.data.xiaoShouName;
						} else {
							self.$Message.error(res.data.msg);
						}
					})
				} else {
					console.log('没有车型');
				}
			},
			//获取厂商
			selectCS(val) {
				var self = this;
				self.step1 = val;
				self.changShang = [];
				self.$http({
					url: "/nxp-admin/liYang/changshang",
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						for(var i = 0; i < res.data.data.length; i++) {
							if(val.indexOf(res.data.data[i]['first']) > -1) {
								self.changShang.push(res.data.data[i]);
							}
						}
					} else {
						self.$Message.error(res.data.msg);
					}
				})
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
				self.$http({
					url: "/nxp-admin/liYang/pinpai/" + val,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.pinPai = res.data.data;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
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
				self.$http({
					url: "/nxp-admin/order/updateCar/",
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					params: {
						orderId: self.quickAddCarId,
						liyangId: id
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						alert(res.data.msg);
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			selectPPOne(val, name) {
				var self = this;
				self.pinpaiid = val;
				self.pinpaiName = name;
				self.step = 3;
				self.cheXi = [];
				self.$http({
					url: "/nxp-admin/liYang/chexi/" + val,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.cheXi = res.data.data;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			selectCXOne(val, name) {
				var self = this;
				self.chexiid = val;
				self.chexiName = name;
				self.step = 4;
				self.nianKuan = [];
				self.$http({
					url: "/nxp-admin/liYang/niankuan/" + val,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.nianKuan = res.data.data;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			}, //获取销售名称
			selectNKOne(val, name) {
				var self = this;
				self.niankuanid = val;
				self.niankuanName = name;
				self.step = 5;
				self.xiaoShouName = [];
				self.$http({
					url: "/nxp-admin/liYang/xiaoshouname/" + val,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.xiaoShouName = res.data.data;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			selectListOne(val, name) {
				var self = this;
				self.step = 6;
				self.xiaoshounameid = val;
				self.xiaoshounameName = name;
				self.xiaoShouName = [];
				self.$http({
					url: "/nxp-admin/liYang/info/?changshangid=" + self.changshangid + '&chexiid=' + self.chexiid + "&niankuanid=" + self.niankuanid + "&pinpaiid=" + self.pinpaiid + '&xiaoshounameid=' + self.xiaoshounameid,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.lists = res.data.data;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			getCookie() {
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			},
		}
	}
</script>

<style>
	.oUl {
		overflow: hidden;
		height: 42px;
		display: block;
		border-bottom: 2px solid #C8C8C8;
	}
	
	.oUl li {
		float: left;
		line-height: 42px;
		padding: 0 40px;
		font-size: 16px;
		cursor: pointer;
		list-style: none;
	}
	
	ul li:hover span {
		color: #3cc8b8;
	}
	
	.step-box {
		margin-left: 33px;
		margin-top: 12px;
		overflow: hidden;
	}
	
	.title-box li {
		font-size: 12px;
		border-radius: 4px;
		list-style: none;
		float: left;
		margin-right: 10px;
		border: 1px solid #ddd;
		padding: 4px 8px;
		cursor: pointer;
	}
	
	.isColor {
		border: #3cc8b8;
		color: #3cc8b8;
		font-weight: bold;
	}
	
	.hover1 {
		font-weight: bold;
	}
	
	.hover2 {
		color: #3cc8b8;
	}
	
	.list-box {
		overflow: hidden;
		margin-left: 23px;
		margin-top: 25px;
	}
	
	.list-box li {
		float: left;
		margin-left: 8px;
		margin-top: 6px;
		border: 1px solid #CCCCCC;
		font-size: 12px;
		cursor: pointer;
		padding: 0 10px;
		border-radius: 4px;
		line-height: 30px;
	}
</style>