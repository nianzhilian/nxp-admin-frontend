<template>
  <div class="gg-search-con">
    <div :class="className">
      <Input
      @mouseenter.native="handleInputMouseenter"
      @mouseleave.native="handleInputMouseleave"
      @on-click="handleIconClick"
      @on-blur="handleBlur"
      :icon="iconType"
      style="width:200px;float:left"
      v-model="text"
      placeholder="请输入搜索关键字"></Input>
      <div class="fl">
        <div class="ivu-input-group-append">
          <Button @click="searchHandle" icon="search"></Button>
        </div>
      </div>
      <!-- <Input placeholder='请输入搜索关键字' v-model="text">

      </Input> -->
    </div>
  </div>
</template>

<script>


export default {
  props:{
    className:{
      type:String
    }
  },
  computed:{
    iconType() {
      let icon = '';
      if (this.showClose) icon = 'ios-close';
      return icon;
    }
  },
  methods:{
    handleIconClick(){
      this.text = '';
      this.$emit('on-search',this.text);
    },
    searchHandle(){
      this.$emit('on-search',this.text);
    },
    handleFocus() {
      if (this.text != "") this.showClose = true;
    },
    handleBlur() {
      this.showClose = false;
    },
    handleInputMouseenter() {
      this.handleFocus();
    },
    handleInputMouseleave() {
      this.handleBlur();
    }
  },
  data(){
    return {
      text:'',
      showClose:false
    }
  }
}
</script>
<style>
  .gg-search-con .ivu-input{
    border-radius: 4px 0 0 4px
  }
</style>
