<template>
	<div>
		<airx-modal v-model="modal1" :zindex="998" title="报价详细">
        <div v-if="Detail!=''">
          <div v-if="zIndex!=undefined">
          	<h3>本轮报价详细</h3>
          	<div v-for="val in Detail" style="padding-top: 20px">
              <Row>
                <div>
                  <Col span="6">配件商名称： <span @click="viewOrg(val)">{{val.orgName}}</span></Col>
                  <Col span="6" >报价时间：{{val.createTime}}</Col>
                  <Col span="6" offset="6" style="text-align: right">
                  评分：{{val.score}}
                  <br />
                  <div style="margin-top: 10px" v-if="val.cusSelected==1||val.isSelect==1">
                    <Button type="success" size="small" icon="checkmark-round" v-if="val.cusSelected!=1&&val.isSelect==1">被选中</Button>
                    <Button type="success" size="small" icon="checkmark-round" v-if="val.cusSelected==1">最终被选中</Button>
                  </div>
                </Col>
                </div>
              </Row>
              <Row class="detail-titbox-menu" >
                <Col span="24"> 备注：{{val.remark}}</Col>
              </Row>
              <br />
            <Table :row-class-name="rowClassName" disabled-hover class="detail-tab" border :columns="columns"  :data="val.infoList">
            </Table>
           </div>
          </div>
          <div v-if="zIndex==undefined">
          	<h3>配件商报价详细</h3>
            <div style="padding-top: 20px" >
                <Row>
                  <Col span="24">配件商名称：<span @click="viewOrg(Detail[0])">{{Detail[0].orgName}}</span></Col>
                </Row>
              <br />
              <Table :row-class-name="rowClassName" disabled-hover class="detail-tab" border :columns="columns"  :data="Detail" >
              </Table>
            </div>
          </div>
        </div>
        <div class="has-nothing" v-if="Detail==''">
          还没有收到报价
         </div>

		</airx-modal>
		<org ref="org"></org>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK } from '../../../utils/common.js'
	import org from '../popup/org.vue'
  	import viewModal from './viewModal.vue'
	export default {
    components: {
      viewModal,org
    },
		data() {
			return {
        Id:'',
				zIndex:'',
				loading: false,
				modal1:false,
				columns: [],
				Detail: [],
				setPj: [],
				formItem: {
					expTime: 0,
					remark: ''
				}
			}
		},
		methods: {
			initData(id,index) {
        var _self = this;
        _self.id=id;
        _self.zIndex=index;
				this.modal1 = true;
				_self.loading = false;
				_self.data1 = [];
       if(index!=''&&index!=undefined&&index!=null){
           fetchGet('/nxp-admin/order/bj/'+id+'/'+index).then((res) => {
             if(res.flag !== 0) {
               this.$Message.error(res.msg);
             } else {
               this.$Message.success(res.msg);
               _self.Detail = res.data;
               _self.columns = [{
                 title: '名称',
                 width: 200,
                 key: 'name',
               },
                 {
                   title: 'OE码',
                   key: 'oenum',
                 },
                 {
                   title: '配件品牌',
                   key: 'brand'
                 },
                 {
                   title: '品类',
                   key: 'category',
                 },
                 {
                   title: '现货/期货',
                   key: 'cycle',
                   render: (h, params) => {
                     if (params.row.cycle == 'Y') {
                       return h('span', "是");
                     } else if (params.row.cycle == 'N') {
                       return h('span', "否")
                     }
                   }
                 },
                 {
                   title: '备货周期',
                   key: 'cycleDate',
                 },
                 {
                   title: '单价',
                   align: 'right',
                   key: 'price',
                   render: function (h, params) {
                     if (params.row.guidePrice != null && params.row.guidePrice > 0 && (params.row.price + (params.row.manageCost == null ? 0 : params.row.manageCost) / params.row.number) > params.row.guidePrice) {
                       return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjPriceInfo"
                         }
                       })
                     } else {
                       return h('span', params.row.price == undefined ? '' : splitK(params.row.price));
                     }
                   }
                 },
                 {
                   title: '数量',
                   align: 'right',
                   key: 'number',
                 },
                 {
                   title: '总价',
                   align: 'right',
                   key: 'amount',
                   render(h, params) {
                   	return splitK(params.row.amount)
                   }
                 },
                 {
                   title: '管理费',
                   align: 'right',
                   key: 'manageCost',
                   render: function (h, params) {
                     return h('span', splitK(params.row.manageCost===null?'0':params.row.manageCost));
                   }
                 },
                 {
                   title: '4S指导价',
                   key: 'guidePrice',
                   render: function (h, params) {
                   	if(params.row.guidePrice){
                   		return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjPrice"
                         }
                       })	
                   	}else if(params.row.oem4sListPrice){
                   		return h('span', splitK(params.row.oem4sListPrice));
                   	}else{
                   		return h('span', '--');
                   	}
                   }
                 },
                 /*{
                   title: '4s店价格',
                   render: function (h, params) {
                     if (params.row.factorySuggestPrice != null || params.row.oemPrice != null || params.row.brandPrice != null || params.row.factorySuggestPrice != null) {
                       return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjPrice"
                         }
                       })
                     } else {
                       return h('span', "--");
                     }
                   }
                 },*/
                 {
                   title: '打回原因',
                   render: function (h, params) {
                     if (params.row.cusBackReasonCategory != null || params.row.serBackReasonCategory != null) {
                       return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjRecall"
                         }
                       })
                     } else {
                       return h('span', "");
                     }
                   }
                 }, {
                   title: '备注',
                   render: function (h, params) {
                     if (params.row.remark != null && params.row.remark != '') {
                       return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjRemark"
                         }
                       })
                     } else {
                       return h('span', "");
                     }
                   }
                 }
               ]
               var checked=false;
               for (var i = 0; i < _self.Detail.length; i++) {
                 var manageCost = '0';
                 for (var j = 0; j < _self.Detail[i].infoList.length; j++) {
                   manageCost = this.calculate(_self.Detail[i].infoList[j].manageCost, manageCost);
                   if(_self.Detail[i].infoList[j].dealNum>0){
                       checked=true
                   }
                 }
                 var amount = {
                   number: "合计",
                   amount: _self.Detail[i].amount,
                   manageCost: manageCost
                 }
                 _self.Detail[i].infoList.push(amount);
               }
               if(checked){
                 var checkedArr = {
                   title: '',
                   width: 60,
                   key: 'name',
                   render: (h, params) => {
                     if (params.row.dealNum > 0) {
                       return h('Icon', {
                         props: {
                           "type": "checkmark-circled",
                         }
                       })
                     } else {
                       return h('span', "");
                     }
                   }
                 }
                 _self.columns.unshift(checkedArr)
               }
             }
           });
       }else{
           fetchGet('/nxp-admin/order/ansInfo/'+id).then((res) => {
             if(res.flag !== 0) {
               this.$Message.error(res.msg);
             } else {
               this.$Message.success(res.msg);
               _self.Detail = res.data;
               _self.columns = [{
                 title: '名称',
                 width: 200,
                 key: 'name',
               },
                 {
                   title: 'OE码',
                   key: 'oenum',
                 },
                 {
                   title: '配件品牌',
                   key: 'brand'
                 },
                 {
                   title: '品类',
                   key: 'category',
                 },
                 {
                   title: '现货/期货',
                   key: 'cycle',
                   render: (h, params) => {
                     if (params.row.cycle == 'Y') {
                       return h('span', "是");
                     } else if (params.row.cycle == 'N') {
                       return h('span', "否")
                     }
                   }
                 },
                 {
                   title: '备货周期',
                   key: 'cycleDate',
                 },
                 {
                   title: '单价',
                   align: 'right',
                   key: 'price',
                   render: function (h, params) {
                     if (params.row.guidePrice != null && params.row.guidePrice > 0 && (params.row.price + (params.row.manageCost == null ? 0 : params.row.manageCost) / params.row.number) > params.row.guidePrice) {
                        return h('div', [
		                    h('Icon', {
		                        props: {
		                            type: 'alert-circled'
		                        },
		                        style:{
		                        	color:'#ff6600',
		                        	padding:'0px 0px 0px 2px'
		                        }
		                    }),
		                    h('strong', splitK(params.row.price))
		                    
		                ]);
                     } else {
                       return h('span', splitK(params.row.price));
                     }
                   }
                 },
                 {
                   title: '数量',
                   align: 'right',
                   key: 'number',
                 },
                 {
                   title: '总价',
                   align: 'right',
                   key: 'amount',
                   render(h, params) {
                   	return splitK(params.row.amount)
                   }
                 },
                 {
                   title: '管理费',
                   align: 'right',
                   key: 'manageCost',
                   render: function (h, params) {
                     return h('span', splitK(params.row.manageCost===null?'0':params.row.manageCost));
                   }
                 },
                 {
                   title: '4S指导价',
                   key: 'guidePrice',
                   render: function (h, params) {
                   	if(params.row.guidePrice){
                   		return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjPrice"
                         }
                       })	
                   	}else if(params.row.oem4sListPrice){
                   		return h('span', splitK(params.row.oem4sListPrice));
                   	}else{
                   		return h('span', '--');
                   	}
                   }
                 },
                 /*{
                   title: '4s店价格',
                   render: function (h, params) {
                     if (params.row.factorySuggestPrice != null || params.row.oemPrice != null || params.row.brandPrice != null || params.row.factorySuggestPrice != null) {
                       return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjPrice"
                         }
                       })
                     } else {
                       return h('span', "--");
                     }
                   }
                 },*/
                 {
                   title: '打回原因',
                   render: function (h, params) {
                     if (params.row.cusBackReasonCategory != null || params.row.serBackReasonCategory != null) {
                       return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjRecall"
                         }
                       })
                     } else {
                       return h('span', "");
                     }
                   }
                 }, {
                   title: '备注',
                   render: function (h, params) {
                     if (params.row.remark != null && params.row.remark != '') {
                       return h(viewModal, {
                         props: {
                           "ref": "viewModal",
                           "viewData": params.row,
                           "name": "pjRemark"
                         }
                       })
                     } else {
                       return h('span', "");
                     }
                   }
                 }
               ]
               var checked=false;
               for (var i = 0; i < _self.Detail.length; i++) {
                 var manageCost = '0';
                 if(_self.Detail[i].infoList) {
                 	for (var j = 0; j < _self.Detail[i].infoList.length; j++) {
	                   manageCost = this.calculate(_self.Detail[i].infoList[j].manageCost, manageCost);
	                   if(_self.Detail[i].infoList[j].dealNum>0){
	                     checked=true
	                   }
	                 }
	                 var amount = {
	                   number: "合计",
	                   amount: _self.Detail[i].amount,
	                   manageCost: manageCost
	                 }
	                 _self.Detail[i].infoList.push(amount);
                 }
               }
               if(checked){
                 var checkedArr = {
                   title: '',
                   width: 60,
                   key: 'name',
                   render: (h, params) => {
                     if (params.row.dealNum > 0) {
                       return h('Icon', {
                         props: {
                           "type": "checkmark-circled",
                         }
                       })
                     } else {
                       return h('span', "");
                     }
                   }
                 }
                 _self.columns.unshift(checkedArr)
               }
             }
         });
       }

			},
			close() {
				this.modal1 = false;
				this.$emit("closeInviteQuotatio");
			},calculate(arg1,arg2){
        var r1,r2,m;
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2))
        return ((arg1*m+arg2*m)/m).toFixed(2);
     },
     viewOrg(val) {
     	this.$refs.org.initData(val.orgId);
     },rowClassName (row, index) {
          if(row.isStandard=='0'){
          	return 'spLinePj';
          }
        }
	}
	}
</script>

<style scoped="scoped">
	/*
	.service-op-mask {
		background: rgba(0, 0, 0, 0.5);
		z-index: 102;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.service-op-box {
		z-index: 103;
		position: fixed;
		top: 7%;
		right: 7%;
		bottom: 7%;
		left: 7%;
		background: #FFF;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
		border-radius: 5px;
	}

	.service-op-close {
		z-index: 104;
		position: absolute;
		top: 5px;
		right: 5px;
	}

	.service-op-content {
		height: 100%;
		padding: 20px;
		overflow-y: auto;
	}

	.service-op-title {
		line-height: 32px;
		margin: 30px 0 10px 0;
	}
  .detail-titbox {
    padding: 20px 10px;
    border: 1px solid #CCCCCC;
  }
  .detail-titbox-menu div{
    font-weight: bold;
    color: #888;
  }
  .detail-tab tr td{
    position: relative;
  }
  */
</style>
