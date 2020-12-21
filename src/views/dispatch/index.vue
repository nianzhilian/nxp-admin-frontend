<template>
	<div class="app-container">
		<div class="air-title h3">客服调度</div>
		<h2>{{startDate}} 至 {{endDate}} 客服工作调度</h2>
		<br />
		<Row :gutter="16">
			<Col span="6">
			<Button type="primary" style="width: 150px" @click="week('pre')">上一周</Button>
			</Col>
			<Col span="12" style="text-align: center;">
			<DatePicker type="date" placeholder="请选择日期" style="width: 200px" :value="setDate" @on-change="handleChange"></DatePicker>
			</Col>
			<Col span="6">
			<div style="float: right;">
				<Button type="primary" style="width: 150px" @click="week('next')">下一周</Button>
			</div>
			</Col>
		</Row>
		<br />
		<Row :gutter="16">
			<Col span="24">
			<div class="ivu-table-wrapper">
				<div class="ivu-table">

					<div class="ivu-table-header">
						<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
							<colgroup>
								<col width="9%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
							</colgroup>
							<thead>
								<tr>
									<th style="text-align: center;">
										<div class="ivu-table-cell"><span>客服</span>

										</div>
									</th>
									<th v-for="item in dateData" style="text-align: center; padding: 10px 0;">
										<div class="ivu-table-cell">
											<span>{{item.week}}<br />{{item.day}}</span>
										</div>
									</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="ivu-table-body">
						<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
							<colgroup>
								<col width="9%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
								<col width="13%">
							</colgroup>
							<tbody class="ivu-table-tbody">
								<tr class="ivu-table-row" v-for="item in serverData">
									<td style="text-align: center;">
										{{item.userName}}
									</td>
									<td v-for="val in item.data" style="text-align: center; padding: 10px 0;">
										<div class="ivu-table-cell">
											<span v-if="val.workType==1">
												<Button type="success">上班中</Button>
												<br />
												<Button type="text" @click="update(val.id,2)" :disabled="val.status!=1">安排休息</Button>
											</span>
											<span v-if="val.workType==2">
												<Button type="warning">休息中</Button>
												<br />
												<Button type="text" @click="update(val.id,1)" :disabled="val.status!=1">安排上班</Button>
											</span>
											<span v-if="val==''">--</span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			</Col>
		</Row>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'
	import {logHttp} from '../../utils/common.js'
	export default {
		data() {
			return {
				setDate: new Date(),
				startDate: '1990-01-01',
				endDate: '2099-01-01',
				dateData: [],
				serverIdData: [],
				serverData: []
			}
		},
		methods: {
			initData() {
				fetchPostUrlencoded('/nxp-admin/work/query', {
					'startTime': this.startDate,
					'endTime': this.endDate
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						this.mixData(res.data);
					}
				}).catch(() => {
					this.$Message.error("网络错误！");
				});
			},
			mixData(data) {
				this.serverIdData = [];
				this.serverData = [];
				var sevice = '';
				var tempArr = [];
				// 循环出唯一客服和唯一日期
				for(var i = 0; i < data.length; i++) {
					if(this.serverIdData.indexOf(data[i]['userId']) == -1) {
						this.serverIdData.push(data[i]['userId']);
					}
				}
				for(var i = 0; i < this.serverIdData.length; i++) {
					sevice = '';
					tempArr = [];
					for(var a = 0; a < this.dateData.length; a++) {
						var thisDay = 0;
						for(var b = 0; b < data.length; b++) {
							if(data[b]['userId'] == this.serverIdData[i] && data[b]['workDay'] == this.dateData[a]['day']) {
								sevice = data[b]['userName'];
								thisDay++;
								// 排班日期比当前日期小的话
								if(data[b]['workDay'] < this.formatDate(new Date())) {
									data[b]['status'] = 0;
								} else {
									data[b]['status'] = 1;
								}
								tempArr.push(data[b]);
							}
						}
						if(thisDay == 0) {
							tempArr.push('');
						}
					}
					this.serverData[i] = {
						'userId': this.serverIdData[i],
						'userName': sevice,
						'data': tempArr
					};
				}
			},
			update(id, workType) {
				fetchPostUrlencoded('/nxp-admin/work/update', {
					'workId': id,
					'workType': workType
				}).then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						this.$Message.success(res.msg);
						this.initData();
					}
				}).catch(() => {
					this.$Message.error("网络错误！");
				});
			},
			createStartEnd(strDate) {
				this.dateData = [];
				var weekday = new Array(7);
				weekday[0] = "周日";
				weekday[1] = "周一";
				weekday[2] = "周二";
				weekday[3] = "周三";
				weekday[4] = "周四";
				weekday[5] = "周五";
				weekday[6] = "周六";

				var oneDaySecond = 24 * 60 * 60 * 1000;

				var now = new Date(strDate);
				var nowTime = now.getTime();
				var nowDay = now.getDay();
				nowDay = nowDay == 0 ? 7 : nowDay;
				var mondayTime = nowTime - (nowDay - 1) * oneDaySecond;
				var sundayTime = nowTime + (7 - nowDay) * oneDaySecond;
				this.startDate = this.formatDate(mondayTime);
				this.endDate = this.formatDate(sundayTime);
				for(var i = mondayTime; i <= sundayTime; i += oneDaySecond) {
					var weekDay = new Date(i);
					var tempArray = {
						'week': weekday[weekDay.getDay()],
						'day': this.formatDate(i)
					}
					this.dateData.push(tempArray);
				}
			},
			formatDate(strTime) {
				var date = new Date(strTime);
				var dateMonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
				var datedate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				return date.getFullYear() + "-" + dateMonth + "-" + datedate;
			},
			week(type) {
				var selectDate = "";
				if(type === "next") {
					selectDate = new Date(this.startDate);
					var oneDaySecond = 24 * 60 * 60 * 1000;
					var createTime = selectDate.getTime();
					var createDay = selectDate.getDay();
					var nextDate = createTime + (8 + createDay) * oneDaySecond;
				} else if(type === "pre") {
					selectDate = new Date(this.startDate);
					var oneDaySecond = 24 * 60 * 60 * 1000;
					var createTime = selectDate.getTime();
					var createDay = selectDate.getDay();
					var nextDate = createTime + (createDay - 8) * oneDaySecond;
				}
				this.createStartEnd(nextDate);
				this.initData();
			},
			handleChange(date) {
				this.createStartEnd(date);
				this.initData();
			}
		},
		mounted() {
			this.createStartEnd(new Date());
			this.initData();
			logHttp(this.$store.state.sourceInfo,'客服调度',fetchPostUrlencoded);
		}
	}
</script>
