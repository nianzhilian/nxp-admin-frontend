<template>
  <div class="app-container">
    <h1 style="padding:120px 0 0 0;text-align: center; line-height: 3em;"><Icon type="easel" size="32"></Icon><br />欢迎进入天驶汽配云平台管理后台</h1>
  </div>
</template>

<script>
import {fetchPostUrlencoded} from '../../utils/requestHttp.js'
import {logHttp} from '../../utils/common.js'
export default {
  mounted(){
    // logHttp(this.$store.state.sourceInfo,'后台首页',fetchPostUrlencoded);
  }
}
</script>
