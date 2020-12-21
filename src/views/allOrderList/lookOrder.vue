<template>
	<div>
		<div class="ivu-table-wrapper">
			<div class="ivu-table ivu-table-border">
				<table border='0' cellspacing="0" cellpadding="0" style="width: 100%;">
					<thead>
						<tr>
							<th class="ivu-table-cell">配件名称</th>
							<th class="ivu-table-cell">OE码</th>
							<th class="ivu-table-cell">配件品牌</th>
							<th class="ivu-table-cell">品类</th>
							<th class="ivu-table-cell" style="text-align: right;">{{(type=='HHD' || type=='Hhd')  ? '换' : '退'}}回配件数量</th>
							<th class="ivu-table-cell">单位</th>
							<th style="text-align: right;">
								<span class="ivu-table-cell">
									{{(type=='HHD' || type=='Hhd')  ? '换' : '退'}}回配件单价
								</span>
							</th>
							<th style="text-align: right;">
								<span class="ivu-table-cell">
									{{(type=='HHD' || type=='Hhd')  ? '换' : '退'}}回配件总价
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="val in data8">
							<td class="ivu-table-cell">{{ val.pjName }}</td>
							<td class="ivu-table-cell">{{ val.pjOenum }}</td>
							<td class="ivu-table-cell">{{ val.pjBrand }}</td>
							<td class="ivu-table-cell">{{val.cateorg}}</td>
							<td class="ivu-table-cell" style="text-align: right;">{{ val.returnNumber }}</td>
							<td class="ivu-table-cell">{{val.pjUnit}}</td>
							<td style="text-align: right;">
								<span class="ivu-table-cell">
									{{ val.returnPrice | jine}}
								</span>
							</td>
							<td style="text-align: right;">
								<span class="ivu-table-cell">
									{{ val.amountReturn | jine}}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
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
	export default {
		props: ['id', 'type'],
		data() {
			return {
				loading: false,
				btnLoading: false,
				data8: []
			}
		},
		filters: {
			dateFormate(s) {
				return getLocalTime(s)
			},
			jine(s) {
				return splitK(s);
			}
		},
		created() {
			//			this.getOrder();
		},
		watch: {
			id: 'getOrder'
		},
		methods: {
			//获取订单详情
			getOrder() {
				fetchGet('/nxp-admin/retord/info/' + this.id, {}).then((res) => {
					this.btnLoading = false;
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.data8 = res.data;
					}
				})
			}
		}
	}
</script>
<style>
	.oLi {
		float: left;
		margin-right: 80px;
		cursor: pointer;
	}
	
	.hover {
		font-weight: bold;
		color: #000;
	}
</style>