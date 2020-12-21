<template>
  <Modal
        v-model="myShow"
        :title="title"
        width="800"
        >
        <div v-if="myShow">
          <div class="air-space">
            基本信息
          </div>
          <cus-info-form
            :title="title"
            :ops-obj="rowObj"
            @on-close="reloadInfo">
          </cus-info-form>
        </div>
        <div slot="footer">
          <!-- <Button type="ghost" @click="close" style="width:100%" size="large">关闭</Button> -->
      </div>
    </Modal>
</template>

<script>
import cusInfoForm from './cusInfoForm.vue'
import { logHttp } from '../../../utils/common.js'
import { fetchPostUrlencoded } from '../../../utils/requestHttp.js'
export default {
  props:{
    title:String,
    type:Number,
    rowObj:{
      type:Object,
      default:{}
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components:{
    'cus-info-form':cusInfoForm
  },
  watch: {
    isShow(val) {
      this.myShow = val;
      if(val){
        if(this.title == '新增'){
          this.$store.commit('setSourceInfo', {
            sourceUri: this.$store.state.sourceInfo.sourceUri,
            currentUri: '/sysOps/identity/add',
            tempPath:this.$store.state.sourceInfo.tempPath
          });
          logHttp(this.$store.state.sourceInfo,'新增特性',fetchPostUrlencoded);
        }else{
          this.$store.commit('setSourceInfo', {
            sourceUri: this.$store.state.sourceInfo.sourceUri,
            currentUri: '/sysOps/identity/edit',
            tempPath:this.$store.state.sourceInfo.tempPath
          });
          logHttp(this.$store.state.sourceInfo,'编辑特性',fetchPostUrlencoded);
        }
      }
    },
    myShow(val) {
      this.$emit('on-change', val);
    }
  },
  methods:{
    close(){
      this.myShow = !this.myShow;
    },
    reloadInfo(cusById){
      var that = this;
      this.close();
      this.$emit('on-reload');
      setTimeout(function() {
        that.$emit('on-open-edit',cusById);
      }, 200)
    }
  },

  data(){
    return {
      myShow:this.isShow,
      isAdd:'add',
      rowAdd:{}
    }
  }
}
</script>
<style>
.ivu-modal .ivu-select-dropdown{
  top:32px!important;
}
</style>
