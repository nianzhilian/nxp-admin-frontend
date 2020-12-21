<template>
	<div class="example-case">
		<div class="air-title h3">客服控制台 </div>
		<Tabs :animated="false" @on-click="tag" style='padding:0 0 10px 0;'>
			<TabPane label="进行中的订单" name="Ing"></TabPane>
			<TabPane label="已完成订单" name="Finish"></TabPane>
			<TabPane label="已取消订单" name="Cancel"></TabPane>
			<TabPane label="全部订单" name="Full"></TabPane>
			<TabPane label="退货单" name="Thd"></TabPane>
			<TabPane label="换货单" name="Hhd"></TabPane>
			<TabPane label="配件名称" name="Pjmc"></TabPane>
			<TabPane label="超时订单" name="timeOrder"></TabPane>
		</Tabs>
		<InsXlcOrder v-if="page.type == 'Finish' || page.type == 'Cancel' || page.type =='Full' " :parentType="page.type" :orderStatu="orderStatu"></InsXlcOrder>
		<ThhOrder  v-if="page.type=='Thd' || page.type=='Hhd'" :parentType="page.type"></ThhOrder>
		<partsChange   v-if="page.type=='Pjmc'" :parentType="page.type" ></partsChange>
		<IngOrder v-if="page.type == 'Ing'" :parentType="page.type"></IngOrder>
		<timeOutOrder v-if="page.type == 'timeOrder'"  ></timeOutOrder>
	</div>
</template>

<script>
	import {
		md5,
		getLocalTime,
		splitK,
		rmoney,
		numAdd,
		dateTrans
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet
	} from '../../utils/requestHttp.js'
	
	import InsXlcOrder from './InsXlcOrder'
	import ThhOrder from './ThhOrder'
	import partsChange from './partsChange'
	import IngOrder from './IngOrder'
	import timeOutOrder from './timeOutOrder' 
	export default {
		components: {
			InsXlcOrder,
			ThhOrder,
			partsChange,
			IngOrder,
			timeOutOrder
		},
		data() {
			return {
				loading: false,
				btnLoading: false,
				editId: '',
				orderStatu:'',
				page: {
					type: 'Ing',
					total: 0,
					current: 1,
					pageSize: 12
				},
				val: '',
				data8: []
			}
		},
		created() {},
		watch: {},
		methods: {
			tag: function(name) {
				this.val = '';
				this.page.current = 1;
				if(name == 'Ing') {
					this.page.type = 'Ing';
				} else if(name == 'Finish') {
					this.page.type = 'Finish';
					this.orderStatu = '99';
				} else if(name == 'Cancel') {
					this.page.type = 'Cancel';
					this.orderStatu = '0';
				} else if(name == 'Full') {
					this.page.type = 'Full';
					this.orderStatu = '';
				} else if(name == 'Thd') {
					this.page.type = 'Thd';
				} else if(name == 'Hhd') {
					this.page.type = 'Hhd';
				} else if(name == 'Pjmc'){
					this.page.type = 'Pjmc';
				}else{
					this.page.type = 'timeOrder';
				}
			}
		}
	}
</script>
