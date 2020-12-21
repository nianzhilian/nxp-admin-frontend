<!--报价历史-->

<template>
	<div style="margin: 20px;">
    <div v-if="data.length > 0">
      <detailQuotetion ref="detailQuotetion" v-on:closedetailQuotetion="closedetailQuotetion"></detailQuotetion>
      <div class="order-detail-mask" v-if="viewMask"></div>
      <Tabs type="card" :animated="false">
        <TabPane  v-for="(val,index) in data" :key="val.orgId" :label="'第'+ ( index + 1 ) +'次报价'" >
          <Table border :columns="columns"  :data="val"></Table>
          <Row type="flex" justify="end" class="code-row-bg" style="margin-top: 20px;">
            <Col>
              <Button type="primary"  @click="detailQuotetionFun(index)">本轮报价详情</Button>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
    <div v-if="data.length == 0">
      <div style="text-align: center;line-height: 150px;">还没有收到报价</div>
     </div>
     <org ref="org"></org>
	</div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK } from '../../utils/common.js'
  import detailQuotetion from './quote/detailQuotetion'
  import org from './popup/org.vue'
	export default {
    props: ['orderId'],
    components: {
      detailQuotetion,
      org
    },
		data() {
			return {
        viewMask: false,
        columns:[{
            title: '#',
            width: 60,
            render: (h,
                     params) => {
              return h('span', params.index + 1)
            }
          },{
            title: '配件商名称',
            width:200,
            key:'orgName',
            render: (h, params) => {
							return [h('Button', {
								props: {
									type: 'text',
								},
								on: {
									click: () => {
										this.$refs.org.initData(params.row.orgId);
									}
								}
							}, params.row.orgName)]
						}
          },{
            title: '是否已报价',
            key: 'isAnswer',
            render: (h, params) => {
              if(params.row.isAnswer == '-1'){
                return h('span', '管理员终止报价')
              }else if(params.row.isAnswer == '0'){
                return h('span', '暂未报价')
              }else if(params.row.isAnswer == '1'){
                return h('span', '已报价')
              }else if(params.row.isAnswer == '2'){
                return h('span', '报价超时')
              }else if(params.row.isAnswer == '3'){
                return h('span', '客户放弃报价')
              }
            }
          },
            {
              title: '报价截止时间',
              key: 'expTime'
            },{
            title: '报价时间',
            key: 'answerTime'
          },
            {
              title: '报价金额',
              key: 'amount',
              align:'right',
              render(h, params) {
                  if(params.row.amount){
                    return splitK(params.row.amount)
                  }
              }
            },
            {
              title: '评分',
              key: 'score',
              align: 'right'
            },
            {
              title: '是否选中',
              key: 'cusSelect',
              render: (h, params) => {
                if(params.row.select== 1){
                  if(params.row.cusSelect == '1'){
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'success',
                          size: 'small',
                          icon:'checkmark-round'

                        }
                      }, '最终被选中')
                    ])
                  }else if(params.row.cusSelect == '0'){
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'success',
                          size: 'small',
                          icon:'checkmark-round'
                        }
                      }, '被选中')
                    ])
                  }
                }
              }
            },
            {
              title: '操作',
              key:'',
              render: (h,params) => {
                if(params.row.isAnswer==1){
                  //answerId
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'text',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.detailanswerFun(params.row.answerId)
                        }
                      }
                    }, '查看详细')
                  ]);
                }
              }
            }],
				data: []
			}
		},
		created() {
		},
    watch: {
      orderId() {
        this.initData(this.orderId);
      }
    },
		methods: {
			initData(id) {
        var _self = this;
        _self.orderId=id;
				_self.data = [];
				if(this.orderId != undefined && this.orderId != null && this.orderId != '') {
				fetchGet('/nxp-admin/order/askInfo/' + id + '?_=history').then((res) => {
					if(res.flag !== 0) {
						this.$Message.error(res.msg);
					} else {
						//this.$Message.success(res.msg);
						//_self.data = eval(res.data);
						let theArray = [];
						let obj = res.data;
						Object.keys(obj).forEach(function(key){
							//console.log(key,obj[key]);
							theArray.push(obj[key]);
						});
						_self.data = theArray;
					}
				}).catch(() => {
					this.$Message.error("网络错误！");
				});
				};
			},detailQuotetionFun(index){
            this.$refs.detailQuotetion.initData(this.orderId,index+1);
      },closedetailQuotetion() {
        this.initData(this.orderId);
      },detailanswerFun(answerId){
        this.$refs.detailQuotetion.initData(answerId);
      }
		}
	}
</script>

<style>

</style>
