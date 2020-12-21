<template>
	<div>
		<br />
		<Row :gutter="20">
			<Col span="24">
				下询单区间：
			</Col>
			<Col span="24">
				<br />
				<ButtonGroup>
				<Button :type="formData.dateVal=='ALL' ? 'primary' : 'ghost'" @click="setTime('ALL')">全部</Button>
				<Button :type="formData.dateVal=='WEEK' ? 'primary' : 'ghost'" @click="setTime('WEEK')">本周</Button>
				<Button :type="formData.dateVal=='ONE' ? 'primary' : 'ghost'" @click="setTime('ONE')">本月</Button>
				<Button :type="formData.dateVal=='QUARTER' ? 'primary' : 'ghost'" @click="setTime('QUARTER')">本季度</Button>
				<Button :type="formData.dateVal=='YEAR' ? 'primary' : 'ghost'" @click="setTime('YEAR')">本年</Button>
				</ButtonGroup>
			</Col>
		</Row>
		<br />
		<Row :gutter="20">
			<Col span="5">
			<DatePicker type="date" placeholder="开始日期" v-model="formData.formatStart" style="width: 100%" @on-change="dateChange"></DatePicker>
			</Col>
			<Col span="5">
			<DatePicker type="date" placeholder="结束日期" v-model="formData.formatEnd" style="width: 100%" @on-change="dateChange2"></DatePicker>
			</Col>
		</Row>
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
		data() {
				return {
					formData: {
						dateVal: 'ALL',
						startDate: '',
						formatStart: '',
						endDate: '',
						formatEnd: '',
					},
				}
			},
			methods: {
				//选择开始日期
				dateChange(shortcuts) {
					this.formData.dateVal = '';
					if(shortcuts != undefined && shortcuts != '' && shortcuts != null) {
						this.formData.startDate = shortcuts;
						this.formData.formatStart = new Date(shortcuts);
					} else {
						this.formData.startDate = '';
						this.formData.formatStart = '';
					}
				},
				//结束日期
				dateChange2(shortcuts) {
					if(shortcuts != undefined && shortcuts != '' && shortcuts != null) {
						this.formData.endDate = shortcuts;
						this.formData.formatEnd = new Date(shortcuts);
					} else {
						this.formData.endDate = '';
						this.formData.formatEnd = '';
					}
				},
				//选择时间
				setTime(val) {
					this.formData.dateVal = val;
					var myDate = new Date();
					var end = new Date();
					this.formData.formatEnd = myDate;
					this.formData.endDate = end.getFullYear() + '-' + ((end.getMonth() + 1) > 9 ? (end.getMonth() + 1) : '0' + (end.getMonth() + 1)) + '-' + end.getDate();
					if(val == 'ALL') {
						this.formData.startDate = "";
						this.formData.formatStart = '';
						this.formData.endDate = "";
						this.formData.formatEnd = '';
					}
					if(val == 'WEEK') {
						this.formData.startDate = this.getWeekStartDate();
						this.formData.formatStart = new Date(this.getWeekStartDate());
					}
					if(val == 'ONE') {
						this.formData.startDate = myDate.getFullYear() + '-' + this.addzero(myDate.getMonth() + 1) + '-01';
						this.formData.formatStart = new Date(myDate.getFullYear(), myDate.getMonth(),1);
					}
					if(val == 'QUARTER') {
						this.formData.startDate = this.getQuarterStartDate();
						this.formData.formatStart = new Date(this.getQuarterStartDate());
					}
					if(val == 'YEAR') {
						this.formData.startDate = myDate.getFullYear() + '-01-01';
						this.formData.formatStart = new Date(myDate.getFullYear() + '-01-01');
					}
				},
				//获得本周的开端日期 
				getWeekStartDate() {
					var date = new Date();
					var weekStartDate = date.getFullYear() + '-' + this.addzero(date.getMonth() + 1) + '-' + this.addzero(date.getDate() - date.getDay() + 1);
					return weekStartDate;
				},
				//获得本季度的开始月份
				getQuarterStartMonth() {
					var myDate = new Date();
					var nowMonth = myDate.getMonth();
					var quarterStartMonth = 0;
					if(nowMonth < 3) {
						quarterStartMonth = 0;
					}
					if(2 < nowMonth && nowMonth < 6) {
						quarterStartMonth = 3;
					}
					if(5 < nowMonth && nowMonth < 9) {
						quarterStartMonth = 6;
					}
					if(nowMonth > 8) {
						quarterStartMonth = 9;
					}
					return quarterStartMonth;
				},
				//获得本季度的开端日期 
				getQuarterStartDate() {
					var date = new Date();
					var quarterStartDate = this.addzero(date.getFullYear()) + '-' + this.addzero(this.getQuarterStartMonth()) + '-' + this.addzero(1);
					return quarterStartDate;
				},
				// 日期补零
				addzero(val) {
					if(val < 10) {
						return '0' + val;
					} else {
						return val;
					}
				}
			}
	}
</script>
<style scoped="scoped">
	.oLi {
		cursor: pointer;
	}
	
	.hover {
		font-weight: bold;
		color: #000;
	}
</style>