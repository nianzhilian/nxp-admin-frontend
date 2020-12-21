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
    logHttp(this.$store.state.sourceInfo,'配件商管理',fetchPostUrlencoded);
  },
  data(){
    return {
      type:1,
      queryStr:this.$route.query.str
    }
  }
}
</script>
