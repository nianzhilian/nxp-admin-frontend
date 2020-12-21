<template>
	<div>
		<div class="ivu-table-wrapper">
			<div class="ivu-table ivu-table-border">
				<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
					<thead>
						<tr>
							<th class="ivu-table-cell" style="width: 60px;">序号</th>
							<th class="ivu-table-cell" style="width:130px;">订单ID</th>
							<th class="ivu-table-cell" v-if="page.type=='INS'">保险公司</th>
							<th class="ivu-table-cell" v-if="page.type=='INS' || page.type=='XLC'">修理厂名称</th>
							<th class="ivu-table-cell" v-if="page.type=='GJSS'">发起方</th>
							<th class="ivu-table-cell" v-if="page.type=='GJSS'">承修方</th>
							<th style="text-align: right;">订单金额</th>
							<th class="ivu-table-cell">订单状态</th>
							<th class="ivu-table-cell">下询单时间</th>
							<th class="ivu-table-cell">收货人名称</th>
							<th class="ivu-table-cell"><span v-if="page.type!='XLC'">报案号</span></th>
							<th class="ivu-table-cell">车牌号</th>
							<th class="ivu-table-cell">车型信息</th>
							<th class="ivu-table-cell">结算方式</th>
							<th class="ivu-table-cell">客服</th>
							<th class="ivu-table-cell">操作</th>
						</tr>
					</thead>
					<tbody class="ivu-table-tbody">
						<tr v-for="(val,index) in data8">
							<td class="ivu-table-cell">{{page.pageSize * (page.current ==1 ? 0 : (page.current-1)) + index+1}}</td>
							<td class="ivu-table-cell">{{ val.orderNo }} <span v-if="val.isAdditional == 1" style="background-color: #D9534F; color: #FFFFFF;border-radius: 100px;padding: 1px 3px;font-size: 12px;" class="ng-scope">追</span></td>
							<td class="ivu-table-cell" v-if="page.type=='INS'">{{ val.orgFullName }}</td>
							<td class="ivu-table-cell" v-if="page.type=='INS' || page.type=='XLC'">{{ val.xlcFullName }}</td>
							<td class="ivu-table-cell" v-if="page.type=='GJSS'">{{ val.orgFullName }}</td>
							<td class="ivu-table-cell" v-if="page.type=='GJSS'">{{ val.xlcFullName }}</td>
							<td style="text-align: right;">{{val.price | jine}}</td>
							<td class="ivu-table-cell">{{val.status | filterStatus}}</td>
							<td class="ivu-table-cell">{{ val.createTime | dateFormate }}</td>
							<td class="ivu-table-cell">{{ val.receiverName }}</td>
							<td class="ivu-table-cell"><span v-if="page.type!='XLC'">{{ val.numberReport }}</span></td>
							<td class="ivu-table-cell">{{ val.numberPlates }}</td>
							<td class="ivu-table-cell">
								<span v-if="val.factory != null&&val.factory != undefined&&val.factory != ''&&val.vehicleType==2">{{ val.factory }}-{{ val.brand }}-{{ val.model }}</span>
								<span v-if="val.factory == null||val.factory == undefined||val.factory == ''&&val.vehicleType==2">{{val.carNote}}</span>
								<span v-if="val.vehicleType==1">{{val.vehicleName}}</span>
							</td>
							<td class="ivu-table-cell">
								<span v-if="val.payType == 0 && val.isCod == 1">货到付款</span>
								<span v-if="val.payType == 1">月结</span>
								<span v-if="val.payType == 0 && val.isCod == 0">先款后货</span>
							</td>
							<td class="ivu-table-cell">
								<span v-if="page.type!='GJSS'">{{val.serviceUserName}}</span>
								<span v-if="page.type=='GJSS'">{{ val.serviceName}}</span>
							</td>
							<td class="ivu-table-cell">
								<Button @click='queryOrder(val.id)' type="text">查看详细</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<br />
		<Row>
			<Col span="24">
				<Page :total="page.total" :page-size="page.pageSize" @on-change="changePage" show-total :current="page.current" style="float: right;"></Page>
			</Col>
		</Row>
		<br />
		<Row align="middle">
			<Col span="4" offset="12">
			<h2>查询记录：{{page.total}}</h2>
			</Col>
			<Col span="4">
			<h2>订单金额汇总：{{totalPrice | jine}}</h2>
			</Col>
			<Col span="4">
				<a href="/nxp-admin/order/downloadAllList?type=INS" target="_blank" class="exportbtn" style="color: white;">
					<Button type="primary" long>导出</Button>
				</a>
			</Col>
		</Row>
		<orderDetail ref="orderDetail" v-on:closedetail="closedetail"></orderDetail>
	</div>
</template>

<script>
	import {
		md5,
		getLocalTime,
		splitK,
		rmoney,
		orderStatus,
		dateTrans
	} from '../../utils/common.js'
	import {
		fetchPostUrlencoded,
		fetchGet
	} from '../../utils/requestHttp.js'
	import orderDetail from '../../airxComponents/orderDetail'
	export default {
		components: {
			orderDetail
		},
		props: ['queryStr'],
		data() {
			return {
				loading: false,
				totalPrice: 0,
				btnLoading: false,
				downloadUrl: '',
				editId: '',
				page: {
					type: 'INS',
					total: 0,
					current: 1,
					pageSize: 12
				},
				val: '',
				data8: []
			}
		},
		filters: {
			filterStatus(s){
				return orderStatus(s)
			},
			dateFormate(s) {
				return getLocalTime(s)
			},
			jine(s) {
				return splitK(s);
			}

		},
		created() {
			this.getOrder();
		},
		watch: {},
		methods: {
			queryOrder(id) {
				this.$refs.orderDetail.initData(id);
			},
			closedetail() {
				this.getOrder();
			},
			//获取订单
			getOrder() {
				fetchPostUrlencoded("/nxp-admin/order/allList", {
					'page': this.page.current,
					'size': this.page.pageSize,
					'type': this.page.type
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						this.data8 = res.data;
						this.page.total = res.count;
						if(res.totalPrice != null) {
							this.totalPrice = res.totalPrice;
						}
					}
				});
			},
			//分页
			changePage: function(e) {
				this.page.current = e;
				this.getOrder();
			},
			tag: function(name) {
				this.val = '';
				this.page.current = 1;
				if(name == 'INS') {
					this.page.name = -1;
					this.getOrder();
				} else if(name == 'XLC') {
					this.page.name = 0;
					this.getOrder();
				} else {
					this.page.name = 1;
					this.getOrder();
				}
			}
		}
	}
</script>

<style>
	/*
	.exportbtn {
		background: #38c1ff;
		border-color: #38c1ff;
		padding: 7px 12px;
		display: inline-block;
		text-align: center;
		border-radius: 5px;
		width: 294px;
	}
	*/
</style>