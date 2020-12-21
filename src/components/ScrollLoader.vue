<template>
  <div class="left-scroll">
    <slot></slot>
  </div>
</template>

<script>


export default {
  name: "scroll-loader",
  props:{
    className:{
      type:String,
      required:true
    }
  },
  data() {
            return {
               topLoading: false,
               bottonLoading: false,
               stopTopLoading: false, //是否停止传播滚动到顶部事件
               stopBottonLoading: false,  //是否停止传播滚动到底部事件
            }
  },
  mounted(){
    this.listenScroll();
  },
  methods:{
    listenScroll(){
      var _this = this;
      var topDone = (stopTopLoading) =>{
        _this.topLoading = false;
        if(stopTopLoading) _this.stopTopLoading = true;
      }
      var bottonDone = (stopBottonLoading)=>{
        _this.bottonLoading = false;
        if(stopBottonLoading){
          _this.stopBottonLoading = true;
        }
      }
      console.log(this.className)
      setTimeout(function(){
        var scrollContainer = document.getElementsByClassName("left-scroll");
        var tableWrap = scrollContainer[0].childNodes;
        var tab = tableWrap[0].childNodes;
        var ivuTable = tab[0].childNodes;
        var tabBody = ivuTable[4];
        tabBody.onscroll = function(){
          if(tabBody.scrollTop<=0&&!_this.stopTopLoading){
            if(_this.topLoading) return;
                
                _this.$emit('scroll-to-top', topDone);
          }else{
            // console.log('offsetHeight:'+tabBody.offsetHeight);
            // console.log('scrollTop:'+tabBody.scrollTop);
            // console.log('scrollHeight:'+tabBody.scrollHeight);
          }
          if((tabBody.offsetHeight+tabBody.scrollTop+80>=tabBody.scrollHeight)&&!_this.stopBottonLoading){
            if(_this.stopBottonLoading){
              return;
            }
            tabBody.scrollTop = 0;
            _this.$emit('scroll-to-botton',bottonDone)
          }
        }
        console.log(tabBody);
        // console.log(scrollContainer.querySelector('.ivu-table-body'));
      },50)
    }
  }
}
</script>
