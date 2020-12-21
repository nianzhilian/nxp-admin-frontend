<!--图片列表-->

<template>
	<div style="margin: 20px;">
		<div class="picList" v-if="orderData.picList">
			<ul>
				<li v-for="(val,index) in orderData.picList">
					<!--<a :href="val.url" target="_blank" ><img :src="val.url" /></a>-->
					<span :href="val.url" @click="picShow(index)" ><img :src="val.url" /></span>
					
					<span>{{val.explain}}</span>
				</li>
			</ul>
		</div>
		<div v-if="orderData.picList == ''">
			<div style="text-align: center;line-height: 150px;">没有上传图片</div>
		</div>
		<airx-modal v-model="plList.theModal.show" :zindex=998 title="" size="lg" @on-close="close">
			<div style="text-align: center;" >
				<span  @click="previewData" v-if="indexItem!=0" class="left-btn">上一张</span>
				<span  @click="nextData" v-if="(indexItem+1) != orderData.picList.length" class="right-btn">下一张</span>
				<img style="width:700px;height:600px;" :src="orderData.picList[indexItem] ? orderData.picList[indexItem]['url'] : ''" :alt="orderData.picList[indexItem] ? orderData.picList[indexItem]['explain'] : ''" />	
			</div>
		</airx-modal>
	</div>
</template>

<script>
	import {
		fetchPostUrlencoded,
		fetchGet,
		fetchGetHaveParam
	} from '../../utils/requestHttp.js'

	export default {
		props: ['orderId'],
		data() {
			return {
				orderData: {
					picList: [],
				},
				indexItem:0,
				plList: {
					theModal: {
						show: false,
						title: ''
					},
					theForm: {}
				}
			}
		},
		created() {},
		watch: {
			orderId() {
				this.initData(this.orderId);
			}
		},
		methods: {
			initData(id) {
				let _self = this;
				_self.orderData.picList = [];
				if(this.orderId != undefined && this.orderId != null && this.orderId != '') {
					fetchGet('/nxp-admin/order/info/' + _self.orderId).then((res) => {
						if(res.flag !== 0) {
							_self.$Message.error('获取图片信息失败');
						} else {
							//_self.$Message.success(res.msg);
							_self.orderData = res.data;
						}
					});
				}
			},
			picShow(index) {
				this.indexItem = index;
				this.plList.theModal.show = true;
			},
			previewData(){
				this.indexItem = this.indexItem -1;
			},
			nextData(){
				this.indexItem = this.indexItem +1;
			},
			close(){
				
			}
		}
	}
</script>

<style scoped>
	.picList ul li {
		float: left;
		width: 200px;
		height: 220px;
	}
	
	.picList ul li img {
		width: 180px;
		height: 180px;
		display: block;
		margin-bottom: 10px;
	}
	 .left-btn {
        width: 36px;
        height: 72px;
        cursor: pointer;
        display: block;
        position: absolute;
        left: 100px;
        top: 50%;
        margin-top: -18px;
        background:rgba(0,0,0,.5) url("./photopn.png") 0 0;
        text-indent: -999px;
        overflow: hidden;
    }
    .right-btn {
        width: 36px;
        cursor: pointer;
        height: 72px;
        display: block;
        position: absolute;
        right: 100px;
        top: 50%;
        margin-top: -18px;
        background: rgba(0,0,0,.5) url("./photopn.png") -38px 0;
        text-indent: -999px;
        overflow: hidden;
    }
</style>