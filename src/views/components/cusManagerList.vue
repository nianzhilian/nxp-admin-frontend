<template>
  <div class="app-container">
    <template v-if="isGlobalSearch == 'yes'">
      <div v-if="this.type == 1 && data.length > 0" class="air-title h3">配件商管理</div>
      <div v-if="this.type == 2 && data.length > 0" class="air-title h3">保险公司管理</div>
      <div v-if="this.type == 3 && data.length > 0" class="air-title h3">修理厂管理</div>
    </template>
    <template v-if="isGlobalSearch == 'no'">
      <div v-if="this.type == 1" class="air-title h3">配件商管理</div>
      <div v-if="this.type == 2" class="air-title h3">保险公司管理</div>
      <div v-if="this.type == 3" class="air-title h3">修理厂管理</div>
      <Button type="info" @click="addHandle" icon="android-add">新增</Button>
      <search ref='search' @on-search="search" className='fr'></search>
      <tab-sts @on-get-sts="getSts"></tab-sts>
    </template>
    <cus-ops-table :cus-data="cusData" :ops-obj="getOpsObj" @on-reload="reloadData" @change-page="changePage"></cus-ops-table>
    <cus-add-modal :addTitle="addTitle" @on-open-edit="openEdit" @on-reload="reloadData" :type="type" @on-change="onChange" :is-show="addModalShow"></cus-add-modal>
    <!-- <Table border :loading='load'  highlight-row ref="currentRowTable" :columns="columns2" :data="loadData"></Table>
    <div v-show="this.data.length > 0" style="margin-top:15px;" class="fr">
      <Page :current="currentPage" @on-change="changePage" :total="dataCount" :page-size="size"></Page>
    </div> -->
  </div>
</template>

<script>
import {removeBodyAtt,logHttp} from '../../utils/common.js'
import search from '../../components/search.vue'
import tabSts from '../../components/tabSts.vue'
import {fetchPostUrlencoded,fetchGet} from '../../utils/requestHttp.js'
// import { dateTrans,getLocalTime } from '../../utils/common.js'
import cusOpsTable from '../components/cusOpsTable.vue'
import cusAddModal from './cusAddModal.vue'
export default {
  props:{
    type:Number,
    isGlobalSearch:String,
    queryStr:{
      type:String,
      default(){
        return ''
      }
    }
  },
  components:{
    search,
    'tab-sts':tabSts,
    'cus-ops-table':cusOpsTable,
    'cus-add-modal':cusAddModal
  },
  watch:{
    getqueryStr(){},
    addModalShow(val){
      if(val){
            if(this.$store.state.sourceInfo.tempPath == '/client/supplier'){
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/supplier/addSupplier',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'新增配件商',fetchPostUrlencoded);
            }else if (this.$store.state.sourceInfo.tempPath == '/client/insurer') {
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/insurer/addInsurer',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'新增保险公司',fetchPostUrlencoded);
            }else if (this.$store.state.sourceInfo.tempPath == '/client/repairer') {
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/repairer/addRepairer',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'新增修理厂',fetchPostUrlencoded);
            }

      }
    }
  },
  computed:{
    //传递表格数据
    getOpsObj(){
      var obj = {};
      obj.load = this.load;
      obj.type = this.type;
      obj.data = this.data;
      obj.currentPage = this.currentPage;
      obj.dataCount = this.dataCount;
      obj.size = this.size;
      obj.isGlobalSearch = this.isGlobalSearch;
      obj.queryStr = this.queryStr;
      return obj
    },
    getqueryStr(){
      if(this.isGlobalSearch == 'no'){
        this.$nextTick(function(){
          this.$refs.search.text = this.queryStr;
        })
      }
      return this.queryStr;
    },
  },
  created(){
    //加载数据
    this.fetchData(1,this.type,this.sts,this.$route.query.str);
  },
  methods:{
    //从新加载数据
    reloadData(){
      if(this.isGlobalSearch == 'yes'){
        this.fetchData(this.currentPage,this.type,this.sts,this.$route.query.str);
      }else{
        if(this.$refs.search.text == ''){
          this.fetchData(this.currentPage,this.type,this.sts);
        }else{
          this.fetchData(this.currentPage,this.type,this.sts,this.$refs.search.text);
        }
      }
    },
    openEdit(cusById){
      this.cusDataHttp(cusById);
    },
    cusDataHttp(cusById){
      fetchGet('/nxp-admin/cusOrganiztion/cusById/'+cusById).then((res)=>{
        if(res.data){
          this.cusData = res.data;
        }
      })
    },
    //嗾使
    search(name){
      this.fetchData(this.currentPage,this.type,this.sts,name);
    },
      fetchData(page,type,status,name){
        let obj={
            page:page,
            size:this.size,
            type:type,
            status:status
        };
        if(name){
          obj.name = name;
        }
        fetchPostUrlencoded('/nxp-admin/cusOrganiztion/list',obj).then((res)=>{
          if(res.flag == 0){
            this.load = false;
            this.dataCount = res.count;
            this.data = res.data;
          }
        })
      },
      //分页
      changePage(page){
        this.load = true;
        this.currentPage = page;
        this.fetchData(page,this.type,this.sts);
      },
      //获取启用禁用状态
    getSts(sts){
      this.$refs.search.text = "";
      this.sts = sts;
      this.currentPage = 1;
      this.load = true;
      this.fetchData(1,this.type,sts);
    },
    onChange(val) {
      if(!val){
        removeBodyAtt();
      }
      this.addModalShow = val;
    },
    addHandle(){
      this.addModalShow = !this.addModalShow;
      switch(this.type){
        case 1:
          this.addTitle = '新增配件商'
        break;
        case 2:
          this.addTitle = '新增保险公司'
        break;
        case 3:
          this.addTitle = '新增修理厂'
        break;
      }
    }
  },
  data(){
    return {
      load:true,
      currentPage:1,
      dataCount:1,
      size:15,
      sts:-1,
      data:[],
      addModalShow:false,
      cusData:{},
      addTitle:'新增配件商'
    }
  }
}
</script>
<style>
  .ivu-table-cell .stsContainer{
    position: relative;
    height: 20px;
  }
  .ivu-table-cell .red{
    background: red;
  }
  .ivu-table-cell .green{
    background: green;
  }
  .ivu-table-cell .green, .ivu-table-cell .red{
    position: absolute;
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    left: 50%;
    margin-left: -5px;
    top: 50%;
    margin-top: -5px;
  }
</style>
