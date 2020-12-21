<template>
	<div>
		<div class="air-title h3">全部订单列表 </div>
		<Tabs :animated="false" v-model="tabsVal" @on-click="tag">
			<TabPane label="保险公司订单" name="INS"></TabPane>
			<TabPane label="修理厂订单" name="XLC"></TabPane>
			<TabPane label="高级搜索" name="GGSS"></TabPane>
			<TabPane label="退货单" name="THD"></TabPane>
			<TabPane label="换货单" name="HHD"></TabPane>
		</Tabs>
		<insOrder v-if="page.type == 'INS'" :queryStr="str"></insOrder>
		<xlcOrder v-if="page.type == 'XLC'" :queryStr="str"></xlcOrder>
		<GGSS v-if="page.type == 'GGSS'" :queryStr="str"></GGSS>
		<THD v-if="page.type == 'THD' " :returnType='page.type' :queryStr="str"></THD>
		<HHD v-if="page.type == 'HHD'" :returnType='page.type' :queryStr="str"></HHD>
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
	import insOrder from './insOrder'
	import xlcOrder from './xlcOrder'
	import GGSS from './GGSS'
	import inquiryTime from './inquiryTime'
	import THD from './THD'
	import HHD from './HHD'
	import orderDetail from '../../airxComponents/orderDetail'
	export default {
		props: {
			pageType: {
				type: String
			},
			str: {
				type: String
			},
		},
		components: {
			insOrder,
			xlcOrder,
			GGSS,
			inquiryTime,
			THD,
			HHD,
			orderDetail
		},
		data() {
			return {
				tabsVal: this.pageType,
				/*queryStr:this.$route.query.str,*/
				loading: false,
				btnLoading: false,
				editId: '',
				page: {
					type: this.pageType == ''?'INS':this.pageType,
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
				this.page.type = name;
				console.log(this.page.type);
			}
		}
	}
</script>

<style>
	.i-input {
		display: inline-block;
		width: 180;
		height: 32px;
		line-height: 32px;
		padding: 3px 7px;
		font-size: 12px;
		border: 1px solid #dddee1;
		border-radius: 4px;
		color: #495060;
		background-color: #fff;
		background-image: none;
		position: relative;
		cursor: text;
		transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
	}
</style>