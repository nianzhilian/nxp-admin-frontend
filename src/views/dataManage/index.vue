<template>
  <div class="app-container">
    <div class="air-title h3">数据管理</div>
    <h1 style="padding:120px 0 0 0;text-align: center; line-height: 3em;"><Icon type="more" size="32"></Icon><br />请在左侧菜单选择相应功能</h1>
  </div>
</template>

<script>
import {fetchPostUrlencoded} from '../../utils/requestHttp.js'
import {logHttp} from '../../utils/common.js'
export default {
  mounted(){
    logHttp(this.$store.state.sourceInfo,'数据管理',fetchPostUrlencoded);
  }
}
</script>
