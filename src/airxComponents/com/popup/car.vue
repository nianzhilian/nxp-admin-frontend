<!--车型规格-->
<template>
	<span>
	<airx-modal v-model="modal1" :zindex=999 title="车型规格" @on-close="close">
		<div>
			<ul>
				<li><label>Level ID：</label>{{data.levelId}}</li>
				<li><label>厂家：</label>{{data.changJia}}</li>
				<li><label>品牌：</label>{{data.pinPai}}</li>
				<li><label>车系：</label>{{data.pinPai}}</li>
				<li><label>车型：</label>{{data.cheXing}}</li>
				<li><label>销售名称：</label>{{data.xiaoShouName}}</li>
				<li><label>年款：</label>{{data.nianKuan}}</li>
				<li><label>底盘号：</label>{{data.diPanNum}}</li>
				<li><label>排放标准：</label>{{data.paiFangBz}}</li>
				<li><label>车辆类型：</label>{{data.cheLiangLx}}</li>
				<li><label>车辆级别：</label>{{data.cheLiangJb}}</li>
				<li><label>指导价格：</label>{{data.zhiDaoPrice}}</li>
				<li><label>上市年份：</label>{{data.shangShiYear}}</li>
				<li><label>上市月份：</label>{{data.shangShiMonth}}</li>
				<li><label>生产年份：</label>{{data.shengChanYear}}</li>
				<li><label>生产月份：</label>{{data.shengChanMonth}}</li>
				<li><label>停产年份：</label>{{data.tingChanYear}}</li>
				<li><label>生产状态：</label>{{data.shegnChanStatus}}</li>
				<li><label>国别：</label>{{data.guoBie}}</li>
				<li><label>国产合资进口：</label>{{data.guoChanHzjk}}</li>
				<li><label>气缸容积：</label>{{data.qingGangRj}}</li>
				<li><label>排量(升)：</label>{{data.paiLiang}}</li>
				<li><label>进气形式：</label>{{data.jinQiXs}}</li>
				<li><label>燃油类型：</label>{{data.ranYouLx}}</li>
				<li><label>燃油标号：</label>{{data.ranYouBh}}</li>
				<li><label>最大马力(Ps)：</label>{{data.maxMl}}</li>
				<li><label>最大功率(kW)：</label>{{data.maxGl}}</li>
				<li><label>最大功率转速(rpm)：</label>{{data.maxGlzs}}</li>
				<li><label>最大扭矩(N·m)：</label>{{data.maxNj}}</li>
				<li><label>最大扭矩转速(rpm)：</label>{{data.maxNjzs}}</li>
				<li><label>气缸排列形式：</label>{{data.qgPlxs}}</li>
				<li><label>气缸数(个)：</label>{{data.qgNum}}</li>
				<li><label>每缸气门数(个)：</label>{{data.meiGangQmNum}}</li>
				<li><label>压缩比：</label>{{data.ysb}}</li>
				<li><label>供油方式：</label>{{data.gongYouFs}}</li>
				<li><label>工信部综合油耗(L)：</label>{{data.gongXbzhyh}}</li>
				<li><label>市区工况油耗：</label>{{data.sqgkyh}}</li>
				<li><label>市郊工况油耗：</label>{{data.sjgkyh}}</li>
				<li><label>加速时间（0-100km/h)：</label>{{data.jiaSuTime}}</li>
				<li><label>最高车速(km/h)：</label>{{data.maxCs}}</li>
				<li><label>变速箱类型：</label>{{data.bsxLx}}</li>
				<li><label>变速器描述：</label>{{data.bsqMs}}</li>
				<li><label>档位数：</label>{{data.dangNum}}</li>
				<li><label>前制动器类型：</label>{{data.qianZdqlx}}</li>
				<li><label>后制动器类型：</label>{{data.houZdqlx}}</li>
				<li><label>前悬挂类型：</label>{{data.qianXglx}}</li>
				<li><label>后悬挂类型：</label>{{data.houXglx}}</li>
				<li><label>转向机形式：</label>{{data.zxjxs}}</li>
				<li><label>助力类型：</label>{{data.zllx}}</li>
				<li><label>最小离地间隙(mm)：</label>{{data.zxldjx}}</li>
				<li><label>最小转弯半径：</label>{{data.zxzwbj}}</li>
				<li><label>发动机位置：</label>{{data.fangDjwz}}</li>
				<li><label>驱动方式：</label>{{data.qdfs}}</li>
				<li><label>车身型式：</label>{{data.csxs}}</li>
				<li><label>长(mm)：</label>{{data.chang}}</li>
				<li><label>宽(mm)：</label>{{data.kuan}}</li>
				<li><label>高(mm)：</label>{{data.gao}}</li>
				<li><label>轴距(mm)：</label>{{data.zhouju}}</li>
				<li><label>前轮距(mm)：</label>{{data.qianlunju}}</li>
				<li><label>后轮距(mm)：</label>{{data.houlunju}}</li>
				<li><label>整备质量(Kg)：</label>{{data.zhengbeiZl}}</li>
				<li><label>最大载重质量(kg)：</label>{{data.maxZzzl}}</li>
				<li><label>油箱容积(L)：</label>{{data.youxiangRj}}</li>
				<li><label>行李厢容积(L)：</label>{{data.xlxrj}}</li>
				<li><label>车顶型式：</label>{{data.chedingXs}}</li>
				<li><label>车门数：</label>{{data.cheMenNum}}</li>
				<li><label>座位数(个)：</label>{{data.zuoWeiNum}}</li>
				<li><label>前轮毂规格：</label>{{data.qlggg}}</li>
				<li><label>后轮毂规格：</label>{{data.hlggg}}</li>
				<li><label>轮毂材料：</label>{{data.lgcl}}</li>
				<li><label>备胎规格：</label>{{data.bggg}}</li>
				<li><label>驾驶座安全气囊：</label>{{data.jszAqqn}}</li>
				<li><label>副驾驶安全气囊：</label>{{data.fjsAqqn}}</li>
				<li><label>前排侧气囊：</label>{{data.qpcQn}}</li>
				<li><label>后排侧气囊：</label>{{data.hpcQn}}</li>
				<li><label>前排头部气囊(气帘)：</label>{{data.qptbQn}}</li>
				<li><label>后排头部气囊(气帘)：</label>{{data.hptbQn}}</li>
				<li><label>膝部气囊：</label>{{data.qbQn}}</li>
				<li><label>电动天窗：</label>{{data.ddtc}}</li>
				<li><label>全景天窗：</label>{{data.qjtc}}</li>
				<li><label>氙气大灯：</label>{{data.sqdd}}</li>
				<li><label>前雾灯：</label>{{data.qwd}}</li>
				<li><label>后雨刷：</label>{{data.hys}}</li>
				<li><label>空调：</label>{{data.kt}}</li>
				<li><label>自动空调：</label>{{data.zdkt}}</li>
			</ul>
		</div>
	</airx-modal>
	</span>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK,logHttp } from '../../../utils/common.js'

	export default {
		components: {},
		data() {
			return {
				carId: '',
				modal1: false,
				data: {},
			}
		},
		computed: {},
		watch: {
			carId() {},
			modal1(val){
				console.log(val);
				if(val){
					if(this.$store.state.sourceInfo.tempPath == '/dataOps/vehicleOps'){
						this.$store.commit('setSourceInfo', {
							sourceUri: this.$store.state.sourceInfo.sourceUri,
							currentUri: '/dataOps/vehicleOps/lookModelSpec',
							tempPath:this.$store.state.sourceInfo.tempPath
						});
					}
					logHttp(this.$store.state.sourceInfo,'查看车型规格',fetchPostUrlencoded);
				}
			}
		},
		methods: {
			initData(id) {
				let _self = this;
				_self.carId = id;
				if(_self.carId != undefined) {
					this.modal1 = true;

					fetchGet('/nxp-admin/liYang/car/' + _self.carId).then((res) => {
						if(res.flag !== 0) {
							this.$Message.error(res.msg);
						} else {
							this.$Message.success(res.msg);
							_self.data = res.data;
						}
					});
				}
			},
			close() {
				this.modal1 = false;
			},
		}
	}
</script>

<style scoped="scoped">
	div ul {
		overflow: hidden;
	}
	div ul li {
		float: left;
		width: 50%;
		line-height: 30px;
	}

	div ul li label {
		width: 30%;
		float: left;
		text-align: right;
	}
</style>
