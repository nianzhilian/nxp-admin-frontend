<template>
	<div class="ivu-table-wrapper">
			<div class="ivu-table-tab ivu-table-border" style="text-align: right;">
				<table border="0" cellspacing="0" cellpadding="0" style="width:100% ;line-height: 36px;font-size: 12px;" v-if="">
					<tr>
						<th>#</th>
						<th>订单号</th>
						<th>下单方</th>
						<th>配送方</th>
						<th>车型</th>
						<th>车型备注</th>
						<th>下单时间</th>
						<th>订单金额</th>
						<th>操作</th>
					</tr>
					<tr v-for="(val,index) in orderRemarkData">
						<td>{{pageSize * (current ==1 ? 0 : (current-1)) + index+1}}</td>
						<td>{{val.orderNo}}</td>
						<td>{{val.orgFullName}}</td>
						<td>{{val.xlcFullName}}</td>
						<td>
							<span v-if="val.factory != null&&val.factory != undefined&&val.factory != ''&&val.vehicleType==2">{{ val.factory }}-{{ val.brand }}-{{ val.model }}</span>
							<span v-if="val.factory == null||val.factory == undefined||val.factory == ''&&val.vehicleType==2">--</span>
							<span v-if="val.vehicleType==1">{{val.vehicleName}}</span>
						</td>
						<td>
							<span>{{val.carNote}}</span>
						</td>
						<td>{{new Date(val.createTime).toLocaleString()}} </td>
						<td>{{val.price}}</td>
						<td><span v-click="">查看</span></td>
					</tr>
				</table>
				<Page :total="total" @on-change="change" style="margin-top: 25px;"></Page>
			</div>
		</div>
</template>
<script>
	export default {
		props: ['type', 'orgId'],
		data() {
			return {
				orderRemarkData: [],
				carMangeView :false,
				// 初始页当前页码
				current: 1,
				// 每页显示条数长度
				pageSize: 5,
				// 总页数
				totalPage: 0,
				// 记录总数
				totalSize: 0
			}
		},
		created() {  
			this.getCookie();
			this.parent();
			this.region()
		},
		watch: {  
			orgId: 'orgDetail',
		},
		methods: {
			getCookie() {
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			},
			//获取车型备注订单
			getOrderRemark: function() {
				var self = this;
				self.$http({
					url: '/nxp-admin/order/queryCar',
					method: 'POST',
					headers: {
						'token': self.user.token
					},
					params: {
						page: this.current,
						size: this.pageSize
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.orderRemarkData = res.data.data;
						self.total = res.data.count;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			},
			change: function(page) {
				this.current = page;
				this.getLiyang();
			},
		}
	}
</script>