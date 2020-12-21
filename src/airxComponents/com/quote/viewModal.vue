<!--弹窗-->
<template>
  <div class="updateTime" @click.stop>
     <div v-if="name=='pjRecall'">
     	<Tooltip placement="top">
      <Button type="warning" long size='small'><Icon size="16" type="arrow-swap"></Icon></Button>
      <div slot="content">
          	 客户打回原因：{{viewData.cusBackReasonCategory===null?'--':viewData.cusBackReasonCategory}}<br />
        		客户打回原因附加说明：{{viewData.cusBackReasonDetails===null?'--':viewData.cusBackReasonDetails}}<br />
        		<div class="divider"></div>
       	 		客服打回原因：{{viewData.serBackReasonCategory===null?'--':viewData.serBackReasonCategory}}<br />
        		客服打回原因附加说明：{{viewData.serBackReasonDetails===null?'--':viewData.serBackReasonDetails}}<br />
      </div>
     </Tooltip>
     </div>
     <div v-if="name=='pjPrice'">
			<Tooltip placement="top">
		        <Button long size='small'>{{viewData.guidePrice | jine}}</Button>
		        <div slot="content">
	           	东北区市场价：{{viewData.marketPriceDb===null?'--':viewData.marketPriceDb | jine}}<br />
        	华北区市场价：{{viewData.marketPriceHb===null?'--':viewData.marketPriceHb | jine}}<br />
        	华东区市场价：{{viewData.marketPriceHd===null?'--':viewData.marketPriceHd | jine}}<br />
        	华南区市场价：{{viewData.marketPriceHn===null?'--':viewData.marketPriceHn | jine}}<br />
         	上海区市场价：{{viewData.marketPriceSh===null?'--':viewData.marketPriceSh | jine}}<br />
                              西北区市场价：{{viewData.marketPriceXb===null?'--':viewData.marketPriceXb | jine}}<br />
		        </div>
		  </Tooltip>
		  </div>
    <div v-if="name=='pjRemark'">
    	<Tooltip placement="top">
      <Button type="warning" long size='small'><Icon size="16" type="document-text"></Icon></Button>
      <div slot="content">
        {{viewData.remark===null?'--':viewData.remark}}
      </div>
     </Tooltip>
    </div>
  </div>
</template>

<script>
	import { fetchPostUrlencoded, fetchGet, fetchGetHaveParam } from '../../../utils/requestHttp.js'
	import { getLocalTime, dateTrans, splitK } from '../../../utils/common.js'
	export default {
		components: {},
		props: ['viewData','name'],
		data() {
			return {
				subLoading: false,
				formItem: {
					maxExpTime: 0,
					expTime: 0
				},
        pjInfoData:[]
			}
		},watch: {
    },
		filters: {
			jine(s) {
				return splitK(s);
			}
		},
		mounted() {
		},
		methods: {
		    }
	}
</script>

<style scoped>
</style>
