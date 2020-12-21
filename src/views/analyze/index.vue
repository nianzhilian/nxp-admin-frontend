<template>
  <div class="app-container">
    <div class="air-title h3">分析报表</div>
    <h1 style="padding:120px 0 0 0;text-align: center; line-height: 3em;"><Icon type="hammer" size="32"></Icon><br />正在开发...</h1>
  </div>
</template>

<script>
import {fetchPostUrlencoded} from '../../utils/requestHttp.js'
import {logHttp} from '../../utils/common.js'
export default {
  mounted(){
    logHttp(this.$store.state.sourceInfo,'分析报表',fetchPostUrlencoded);
  }
}
</script>
