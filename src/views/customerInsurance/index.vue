<template>
  <div class="app-container">
    <cus-manager-list :is-global-search="'no'" :query-str="queryStr" :type="type"></cus-manager-list>
  </div>
</template>

<script>
import cusManagerList from '../components/cusManagerList.vue'
import {fetchPostUrlencoded} from '../../utils/requestHttp.js'
import {logHttp} from '../../utils/common.js'
export default {
  components:{
    'cus-manager-list':cusManagerList
  },
  mounted(){
    logHttp(this.$store.state.sourceInfo,'保险公司管理',fetchPostUrlencoded);
  },
  data(){
    return {
      type:2,
      queryStr:this.$route.query.str
    }
  }
}
</script>
