<template>
    <Modal
          v-model="myShow"
          title="提示框"
          @on-ok="ok"
          class="highLevelModal"
          >
          <slot></slot>
      </Modal>

</template>

<script>


export default {
  props:{
    isShow: {
      type: Boolean,
      default: false
    }
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
    ok(){
      this.$emit('on-ok');
    }
  },
  data(){
    return {
      myShow:this.isShow,
    }
  }
}
</script>
<style>
  .highLevelModal .ivu-modal-wrap, .highLevelModal .ivu-modal-mask{
    z-index: 1005
  }
</style>
