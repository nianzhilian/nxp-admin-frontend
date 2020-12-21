<template>
	<div style="font-weight: bold;">
		<Row>
			 <Col span="12"><span class='zushi' >Level ID：</span>{{carFormatData.levelId}}</Col>
			 <Col span="12"><span class='zushi' >厂家：</span>{{carFormatData.changJia}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >品牌：</span>{{carFormatData.pinPai}}</Col>
			 <Col span="12"><span class='zushi' >车系：</span>{{carFormatData.cheXi}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >车型：</span>{{carFormatData.cheXing}}</Col>
			 <Col span="12"><span class='zushi' >销售名称：</span>{{carFormatData.xiaoShouName}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >年款：</span>{{carFormatData.nianKuan}}</Col>
			 <Col span="12"><span class='zushi' >底盘号：</span>{{carFormatData.diPanNum}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >排放标准：</span>{{carFormatData.paiFangBz}}</Col>
			 <Col span="12"><span class='zushi' >车辆类型：</span>{{carFormatData.cheLiangLx}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >车辆级别：</span>{{carFormatData.cheLiangJb}}</Col>
			 <Col span="12"><span class='zushi' >指导价格：</span>{{carFormatData.zhiDaoPrice}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >上市年份：</span>{{carFormatData.shangShiYear}}</Col>
			 <Col span="12"><span class='zushi' >上市月份：</span>{{carFormatData.shangShiMonth}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >生产年份：</span>{{carFormatData.shengChanYear}}</Col>
			 <Col span="12"><span class='zushi' >生产月份：</span>{{carFormatData.shengChanMonth}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >停产年份：</span>{{carFormatData.tingChanYear}}</Col>
			 <Col span="12"><span class='zushi' >生产状态：</span>{{carFormatData.shegnChanStatus}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >国别：</span>{{carFormatData.guoBie}}</Col>
			 <Col span="12"><span class='zushi' >国产合资进口：</span>{{carFormatData.guoChanHzjk}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >气缸容积：</span>{{carFormatData.qingGangRj}}</Col>
			 <Col span="12"><span class='zushi' >排量(升)：</span>{{carFormatData.paiLiang}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >进气形式：</span>{{carFormatData.jinQiXs}}</Col>
			 <Col span="12"><span class='zushi' >燃油类型：</span>{{carFormatData.ranYouLx}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >燃油标号：</span>{{carFormatData.ranYouBh}}</Col>
			 <Col span="12"><span class='zushi' >最大马力(Ps)：</span>{{carFormatData.maxMl}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >最大功率(kW)：</span>{{carFormatData.maxGl}}</Col>
			 <Col span="12"><span class='zushi' >最大功率转速(rpm)：</span>{{carFormatData.maxGlzs}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >最大扭矩(N·m)：</span>{{carFormatData.maxNj}}</Col>
			 <Col span="12"><span class='zushi' >最大扭矩转速(rpm)：</span>{{carFormatData.maxNjzs}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >气缸排列形式：</span>{{carFormatData.qgPlxs}}</Col>
			 <Col span="12"><span class='zushi' >气缸数(个)：</span>{{carFormatData.qgNum}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >每缸气门数(个)：</span>{{carFormatData.meiGangQmNum}}</Col>
			 <Col span="12"><span class='zushi' >压缩比：</span>{{carFormatData.ysb}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >供油方式：</span>{{carFormatData.gongYouFs}}</Col>
			 <Col span="12"><span class='zushi' >工信部综合油耗(L)：</span>{{carFormatData.gongXbzhyh}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >市区工况油耗：</span>{{carFormatData.sqgkyh}}</Col>
			 <Col span="12"><span class='zushi' >市郊工况油耗：</span>{{carFormatData.sjgkyh}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >加速时间（0-100km/h)：</span>{{carFormatData.jiaSuTime}}</Col>
			 <Col span="12"><span class='zushi' >最高车速(km/h)：</span>{{carFormatData.maxCs}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >变速箱类型：</span>{{carFormatData.bsxLx}}</Col>
			 <Col span="12"><span class='zushi' >变速器描述：</span>{{carFormatData.bsqMs}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >档位数：</span>{{carFormatData.dangNum}}</Col>
			 <Col span="12"><span class='zushi' >前制动器类型：</span>{{carFormatData.qianZdqlx}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >后制动器类型：</span>{{carFormatData.houZdqlx}}</Col>
			 <Col span="12"><span class='zushi' >前悬挂类型：</span>{{carFormatData.qianXglx}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >后悬挂类型：</span>{{carFormatData.houXglx}}</Col>
			 <Col span="12"><span class='zushi' >转向机形式：</span>{{carFormatData.zxjxs}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >助力类型：</span>{{carFormatData.zllx}}</Col>
			 <Col span="12"><span class='zushi' >最小离地间隙(mm)：</span>{{carFormatData.zxldjx}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >最小转弯半径：</span>{{carFormatData.zxzwbj}}</Col>
			 <Col span="12"><span class='zushi' >发动机位置：</span>{{carFormatData.fangDjwz}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >驱动方式：</span>{{carFormatData.qdfs}}</Col>
			 <Col span="12"><span class='zushi' >车身型式：</span>{{carFormatData.csxs}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >长(mm)：</span>{{carFormatData.chang}}</Col>
			 <Col span="12"><span class='zushi' >宽(mm)：</span>{{carFormatData.kuan}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >高(mm)：</span>{{carFormatData.gao}}</Col>
			 <Col span="12"><span class='zushi' >轴距(mm)：</span>{{carFormatData.zhouju}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >前轮距(mm)：</span>{{carFormatData.qianlunju}}</Col>
			 <Col span="12"><span class='zushi' >后轮距(mm)：</span>{{carFormatData.houlunju}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >整备质量(Kg)：</span>{{carFormatData.zhengbeiZl}}</Col>
			 <Col span="12"><span class='zushi' >最大载重质量(kg)：</span>{{carFormatData.maxZzzl}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >油箱容积(L)：</span>{{carFormatData.youxiangRj}}</Col>
			 <Col span="12"><span class='zushi' >行李厢容积(L)：</span>{{carFormatData.xlxrj}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >车顶型式：</span>{{carFormatData.chedingXs}}</Col>
			 <Col span="12"><span class='zushi' >车门数：</span>{{carFormatData.cheMenNum}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >座位数(个)：</span>{{carFormatData.zuoWeiNum}}</Col>
			 <Col span="12"><span class='zushi' >前轮毂规格：</span>{{carFormatData.qlggg}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >后轮毂规格：</span>{{carFormatData.hlggg}}</Col>
			 <Col span="12"><span class='zushi' >轮毂材料：</span>{{carFormatData.lgcl}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >备胎规格：</span>{{carFormatData.bggg}}</Col>
			 <Col span="12"><span class='zushi' >驾驶座安全气囊：</span>{{carFormatData.jszAqqn}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >副驾驶安全气囊：</span>{{carFormatData.shangShiYear}}</Col>
			 <Col span="12"><span class='zushi' >前排侧气囊：</span>{{carFormatData.qpcQn}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >后排侧气囊：</span>{{carFormatData.hpcQn}}</Col>
			 <Col span="12"><span class='zushi' >前排头部气囊(气帘)：</span>{{carFormatData.qptbQn}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >后排头部气囊(气帘)：</span>{{carFormatData.hptbQn}}</Col>
			 <Col span="12"><span class='zushi' >膝部气囊：</span>{{carFormatData.qbQn}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >电动天窗：</span>{{carFormatData.ddtc}}</Col>
			 <Col span="12"><span class='zushi' >全景天窗：</span>{{carFormatData.qjtc}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >氙气大灯：</span>{{carFormatData.sqdd}}</Col>
			 <Col span="12"><span class='zushi' >前雾灯：</span>{{carFormatData.qwd}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >后雨刷：</span>{{carFormatData.hys}}</Col>
			 <Col span="12"><span class='zushi' >空调：</span>{{carFormatData.kt}}</Col>
		</Row>
		<Row>
			 <Col span="12"><span class='zushi' >自动空调：</span>{{carFormatData.zdkt}}</Col>
		</Row>
	</div>
</template>

<script>
	export default {
		props: ['id'],
		data() {
			return {
				carFormatView: true,
				carFormatData: []
			}
		},
		created() {
			this.getCookie();
		},
		watch: {
			id: 'carFormat',
		},
		methods: {
			getCookie() {
				var strCookie = decodeURIComponent(document.cookie);
				if(strCookie != "" && strCookie != null && strCookie != undefined) {
					strCookie = strCookie.substring(5);
					this.user = JSON.parse(strCookie);
				}
			},
			//查询车型规格
			carFormat() {
				var self = this;
				self.$http({
					url: '/nxp-admin/liYang/carStatus/' + self.id,
					method: 'GET',
					headers: {
						'token': self.user.token
					}
				}).then(function(res) {
					if(res.data.flag == 0) {
						self.carFormatData = res.data.data;
					} else {
						self.$Message.error(res.data.msg);
					}
				})
			}
		}
	}
</script>
<style type="text/css">
	.zushi{
		font-weight: normal;
		color:#888;
	}
	row{
		margin-top:15px;
	}
</style>