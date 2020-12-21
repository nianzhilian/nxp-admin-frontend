<template>
  <div class="app-container">
  	 <div class="air-title h3">系统管理</div>
  </div>
</template>

<script>
import {fetchPostUrlencoded} from '../../utils/requestHttp.js'
import {logHttp} from '../../utils/common.js'
export default {
  mounted(){
    logHttp(this.$store.state.sourceInfo,'系统管理',fetchPostUrlencoded);
  }
}
</script>
