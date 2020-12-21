<style>
.header-section {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  background: #fff;
  height: 50px;
  line-height: 48px;
  z-index: 99;
  border-bottom: 2px solid #38c1ff;
}

.header-section .left {
  font-size: 16px;
  line-height: 32px;
  margin: 8px 0 0 20px;
}

.header-section .left>img {
  float: left;
  background: url('./assets/images/logo-space.png') no-repeat right center;
  display: block;
  margin: 6px 10px 0 0;
  padding: 0 20px 0 0;
}

.header-section .left .version {
  float: left;
  color: #ff0000;
  font-size: 10px;
  height: 32px;
  line-height: 16px;
  margin: 0 0 0 10px;
  overflow: hidden;
}

.header-section .left .myinfo {
  float: right;
  font-size: 12px;
  margin-right: 20px;
}
.header-section .left .myinfo .bell {
  height: 32px;
  padding: 0 10px;
  border: #ddd 1px solid;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -ms-border-radius: 4px;
  border-radius: 4px;
  cursor: pointer;
  float: left;
}
.header-section .left .ivu-dropdown-item {
  line-height: normal;
}

.nxp-left-content {
  background: none repeat scroll 0 0 #ffffff;
  border-right: 1px solid #e9edf1;
  height: 100%;
  overflow-y: auto;
  width: 200px;
  position: fixed;
  padding-top: 50px;
}

.nxp-right-content {
  float: left;
  height: 100%;
  padding-top: 50px;
  width: 100%;
}

.nxp-right-content .main-content .wrapper {
  margin: 0 0 0 200px;
}

.nxp-right-content .main-content .page-frame{
  padding: 30px;
}

.top-login {
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  height: 32px;
  padding: 0 10px
}

.top-login .ivu-select-dropdown {
  width: 120px;
}
.menu-rest .ivu-menu-item  i{
  margin-right: 6px;
}
.menu-rest a{
  display: block;
  width: 100%;
  padding: 14px 24px;
}
.menu-rest .router-link-active{
  background: none repeat scroll 0 0 #f6f8fe;
    border: 0 none;
    color: #38c1ff;
}
.menu-rest .ivu-menu-vertical .ivu-menu-item{
  padding: 0;
}

.nav>li {
    position: relative;
    display: block;
}
.nxp-left-content .nav li ul{
  display: none;
}
.nxp-left-content .nav li.active ul{
  display: block;
}
.nxp-left-content .nav li{
  line-height: 48px;
}
.nxp-left-content .nav li a{
  color: #000;
  display: block;
  padding: 0 20px;
}
.nxp-left-content .nav li span{
  float: left;
  width: 25px;
}
.nxp-left-content .nav li a:hover{
    background-color: #e6f2ff;
    border-radius: 0;
    color: #38c1ff;
    text-decoration: none;
}
.nxp-left-content .nav li.active{
  background: #f6f8fe!important;
}
.nxp-left-content .nav li ul li a{
  padding-left: 45px;
}
</style>

<template>
<div class="nxp-container">
  <div class="nxp-row fix">
    <div class="header-section">
      <div class="left fix">
        <img src="./assets/images/logo.png">
        <div class="text" style="margin-right:50px;float:left">
          <span class="str fl">管理后台</span>
          <span class="version">DEV BUILD 171019-1540	<br>(FE) 95f226f1 / (BE) Unknown	</span>
        </div>
        <div style="width:20%;float:left">
          <Input>
            <Button slot="append" icon="search"></Button>
          </Input>
        </div>
        <div class="myinfo">
          <div class="bell" style="border:none">

            <Button icon="chatboxes" type="ghost">切换至 财务子系统</Button>
						<!-- <a href="/finance" target="_parent"><i class="fa fa-money" aria-hidden="true"></i> 切换至 财务子系统</a> -->
					</div>
          <div class="bell" style="border:none">
            <Button icon="person" type="ghost">系统管理员</Button>
						<!-- <a href="/admin/#/main" target="_parent"><i class="fa fa-money" aria-hidden="true"></i> 系统管理员</a> -->
					</div>
          <!-- <Dropdown trigger="click" class="top-login" style="margin-left: 20px;" placement="bottom-end">
            <a v-if="getLocalStorage.userInfo" href="javascript:void(0)">
            {{getLocalStorage.userInfo['name']}}
            <Icon type="arrow-down-b"></Icon>
        </a>
            <Dropdown-menu v-if="getLocalStorage.loginType == 'web' " slot="list">
              <Dropdown-item>
                <Icon type="android-person" size=16></Icon>&nbsp;&nbsp<span>修改密码</span></Dropdown-item>
              <Dropdown-item>
                <a href="/admin/#/loginout" target="_parent">
                <Icon type="android-exit" size=16></Icon>&nbsp;&nbsp<span>退出登录</span></a></Dropdown-item>
            </Dropdown-menu>
          </Dropdown> -->
        </div>
      </div>
    </div>
    <div class="nxp-right-content">
      <div class="main-content">
        <div class="wrapper">
          <div class="page-frame">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
    <div class="nxp-left-content">
      <div class="main-content">
        <ul class="nav">
          <li v-for="navItem in defaultNav" v-bind:class="{active:selectedNav == navItem.code}">
            <!-- <a @click="itemClick(navItem)">
              <span class="ico"><Icon type="android-train"></Icon></span>
              {{navItem.title}}
            </a> -->
            <router-link :to="linkHref(navItem)"><Icon type="cash"></Icon>{{navItem.title}}</router-link>
            <ul>
              <li v-for="childItem in navItem.child">
                <a>{{childItem.title}}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div  class="upload_loading_wrap" v-if="getLoading" >
    <div class="mask"></div>
    <div class="load_pos">
        <div style="width:40px; margin: 0 auto;">
            <div class="load4">
                <div class="loader"></div>
            </div>
        </div>
        <div class="load_txt">正在加载...</div>
    </div>
</div> -->
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'app',
  data() {
    return {
      spanLeft: 24,
      selectedNav:1299,
      defaultNav:[{
        code: 1299,
        title: "后台首页",
        href: "main",
        ico: "home"
    }, {
        code: 199,
        title: "后台用户管理",
        href: "main.adminUser",
        ico: "user"
    }, {
        code: 1401,
        title: "部门管理",
        href: "main.department",
        ico: "sitemap"
    }, {
        code: 1501,
        title: "物流管理",
        href: "main.logistics",
        ico: "truck",
        child: [{
            title: "物流查询",
            href: "main.logisticsQuery"
        }]
    }, {
        code: 299,
        title: "客户管理",
        href: "main.client",
        ico: "users",
        child: [{
            title: "配件商",
            href: "main.customerSupply"
        }, {
            title: "保险公司",
            href: "main.customerInsurance"
        }, {
            title: "修理厂",
            href: "main.customer"
        }]
    }, {
        code: 399,
        title: "系统管理",
        href: "main.system",
        ico: "wrench"
    }, {
        code: 399,
        title: "数据管理",
        href: "main.dataManage",
        ico: "users",
        child: [{
            title: "车型管理",
            href: "main.carManage"
        }]
    }, {
        code: 599,
        title: "运营管理",
        href: "main.operation",
        ico: "cog"
    }, {
        code: 699,
        title: "角色/权限",
        href: "main.role",
        ico: "lock",
        child: [{
            title: "权限列表",
            href: "main.function"
        }]
    }, {
        code: 1899,
        title: "作业调度",
        href: "main.schedul",
        ico: "exclamation-circle"
    }, {
        code: 899,
        title: "客服控制台",
        href: "main.service",
        ico: "tachometer"
    }, {
        code: 799,
        title: "全部订单列表",
        href: "main.order",
        ico: "list-alt"
    }, {
        code: 1,
        title: "运营报表",
        href: "main.report",
        ico: "line-chart"
    }, {
        code: 1399,
        title: "网站公告",
        href: "main.notice",
        ico: "sticky-note-o"
    }, {
        code: 1,
        title: "分析报表",
        href: "main.analyze",
        ico: "pie-chart"
    }, {
        code: 499,
        title: "客服调度",
        href: "main.dispatch",
        ico: "calendar"
    }, {
        code: 1601,
        title: "快速注册审批",
        href: "main.reply",
        ico: "gavel"
    }]
    }
  },
  computed:{
    // ...mapGetters(['getLoading']),
    // ...mapGetters(['getVersion1']),
    // ...mapGetters(['getVersion2']),

    getLocalStorage(){
      var _storage = {};
      var key = 'user';
      var storageStr = localStorage.getItem(key);
      if (storageStr) {
          _storage = JSON.parse(storageStr);
      }
      return _storage
    }
  },
  methods: {
    linkHref(item){
      let obj = {name:item.href};
      console.log(obj);
      return obj
    },
    itemClick(item){
      console.log(item)
      this.selectedNav = item.code;
    }
  },
  created(){
    // this.$store.dispatch('getMyQueryVersion1','/admin/builddata.txt');
    // this.$store.dispatch('getMyQueryVersion2','/admin/buildnumber.txt');
  }
}
</script>
