<template>
  <ul class="nav-tabs fix">
    <li v-for='item in statusTabs' :class="{active:select === item.code}">
      <a @click="selectSts(item.code)">{{item.name}}</a>
    </li>
  </ul>
</template>

<script>


export default {
  methods:{
    selectSts(code){
      this.select = code;
      this.$emit('on-get-sts', code);
    }
  },
  data(){
    return {
      select:-1,
      statusTabs:[{
        code:-1,
        name:'全部'
      },
      {
        code:0,
        name:'已启用'
      },
      {
        code:1,
        name:'已禁用'
      }]
    }
  }
}
</script>
<style scoped>
.nav-tabs {
  border: none;
  font-size: 14px;
  line-height: 14px;
  margin: 20px 0;
}
.nav-tabs li {
    border-right: #eee 1px solid;
    padding-right: 20px;
    margin-right: 20px;
    float: left;
}
.nav-tabs li:last-child {
    border-right: none;
}
.nav-tabs li.active a{
  color: #555;
}
</style>
