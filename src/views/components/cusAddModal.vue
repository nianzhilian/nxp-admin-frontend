<template>
  <Modal
        v-model="myShow"
        :title="addTitle"
        width="800"
        >
        <div v-if="myShow">
          <div class="air-space">
            基本信息
          </div>
          <cus-info-form :is-add="isAdd" :row-obj="rowAdd" @on-close="reloadInfo" :type="type"></cus-info-form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="close" style="width:100%" size="large">关闭</Button>
      </div>
    </Modal>
</template>

<script>
import cusInfoForm from './cusInfoForm.vue'
export default {
  props:{
    addTitle:String,
    type:Number,
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
