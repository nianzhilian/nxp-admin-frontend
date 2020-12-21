<template>
  <div class="app-container">
  	<!--修理厂-->
    <cus-manager-list :is-global-search="'yes'" :query-str="queryStr" :type="3"></cus-manager-list>
    <!--保险公司-->
    <cus-manager-list :is-global-search="'yes'" :query-str="queryStr" :type="2"></cus-manager-list>
    <!--配件商-->
    <cus-manager-list :is-global-search="'yes'" :query-str="queryStr" :type="1"></cus-manager-list>
    <!--订单-->
    <order :is-global-search="'yes'" :query-str="queryStr"></order>
    <!--退货单-->
    <comreturn :is-global-search="'yes'" :query-str="queryStr"></comreturn>
    <!--换货单-->
    <comchange :is-global-search="'yes'" :query-str="queryStr"></comchange>
    <!--人员-->
    <airuser :is-global-search="'yes'"  :query-str="queryStr"></airuser>
    <!--用户关联的修理厂-->
    <userxlc :is-global-search="'yes'" :query-str="queryStr"></userxlc>
    <!--系统用户-->
    <adminuser :query-str="queryStr"></adminuser>
  </div>
</template>

<script>
import {fetchPostUrlencoded} from '../../utils/requestHttp.js'
import {logHttp} from '../../utils/common.js'
import cusManagerList from '../components/cusManagerList.vue'
import userxlc from '../components/search/userxlc.vue'
import airuser from '../components/search/airuser.vue'
import adminuser from '../components/search/adminuser.vue'
import order from '../components/search/order.vue'
import comreturn from '../components/search/return.vue'
import comchange from '../components/search/change.vue'

import orderDetail from '../../airxComponents/orderDetail'

export default {
  components:{
    'cus-manager-list':cusManagerList,
    airuser,
    adminuser,
    userxlc,
    order,
    comreturn,
    comchange,
    orderDetail
  },
  mounted(){
    logHttp(this.$store.state.sourceInfo,'全局搜索',fetchPostUrlencoded);
  },
  data(){
    return {
      queryStr:this.$route.query.str
    }
  }
}
</script>
