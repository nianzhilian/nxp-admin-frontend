<template>
  <Modal
        v-model="myShow"
        :title="modalTitle"
        class="highLevelModal"
        width="800"
        >
        <div v-if="myShow">
          <!-- <div class="air-space">
            基本信息
          </div> -->
          <cus-sys-user-info-form :is-add="isAdd" :row-obj="rowData" @on-close="reloadInfo" :type="type">
          </cus-sys-user-info-form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="close" style="width:100%" size="large">关闭</Button>
      </div>
    </Modal>
</template>

<script>
import cusSysUserInfoForm from './cusSysUserInfoForm.vue'
export default {
  props:{
    type:Number,
    isShow: {
      type: Boolean,
      default: false
    },
    rowData:{
      type:Object,
      default:{}
    }
  },
  components:{
    'cus-sys-user-info-form':cusSysUserInfoForm
  },
  computed:{
    modalTitle(){
      switch (this.type) {
        case 1:
          this.addTitle = '配件商人员修改';
          break;
        case 2:
        this.addTitle = '保险公司人员修改';
          break;
        case 3:
        this.addTitle = '修理厂人员修改';
          break;
      }
      return this.addTitle
    }

  },
  watch: {
    rowData(val){
      console.log(123);
    },
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
    reloadInfo(){
      this.close();
      this.$emit('on-reload')
    }
  },

  data(){
    return {
      myShow:this.isShow,
      isAdd:'edit',
      addTitle:'配件商人员修改',
      rowAdd:{},
    }
  }
}
</script>
<style>
  .ivu-modal .ivu-select-dropdown{
    top:32px!important;
  }
  .highLevelModal .ivu-modal-wrap, .highLevelModal .ivu-modal-mask{
    z-index: 1002
  }
  .highLevelModal .ivu-modal-wrap{
    /*position: absolute;*/
  }
</style>
