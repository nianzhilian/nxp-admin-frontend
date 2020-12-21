<template>
  <Modal
        v-model="myShow"
        title="修理厂基本信息"
        width="1000"
        >
        <div class="">
          <div v-if="type == 3">
            <div v-if="row.validateMsg.length > 0" style="background:#f4f4f4" class="cus-panel">
              <div class="panel-body">
                <div class="panel-body">
                  <Icon style="color: red;padding-right:15px;" type="alert-circled"></Icon>{{row.validateMsg.join("&nbsp;&nbsp;")}}
                </div>
              </div>
            </div>
          </div>
          <div class="air-space">
            基本信息
          </div>
          <cus-info-form v-if="myShow" :is-add="isAdd" :row-obj="row" @on-close="reloadInfo" :type="type"></cus-info-form>
          <Tabs v-model="firstTab" type="card" :animated="false">
            <!-- <TabPane name="name1" label="基本信息">
              <cus-info-form :is-add="isAdd" :row-obj="row" @on-close="reloadInfo" :type="type"></cus-info-form>
            </TabPane> -->
              <TabPane name="name1" label="人员列表">
                <systemUser :ops-obj="getOpsObj" @on-reload="reloadData" @change-page="changePage"></systemUser>
              </TabPane>
              <TabPane name="name2" label="优选供应商">
                  <selectOrg :row-obj="row" :car-data="carData" v-if="carData&&myShow" :data="rMockData" :keys="carKeys"></selectOrg>
              </TabPane>
              <TabPane name="name3" label="关联保险公司">
                <div v-if="myShow">
                  <InsXlcList :row-obj="row" :type="type"></InsXlcList>
                </div>
              </TabPane>
          </Tabs>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="close" style="width:100%" size="large">关闭</Button>
      </div>
    </Modal>
</template>

<script>
import { tipsModal } from '../../../utils/common.js'
import cusInfoForm from '../../components/cusInfoForm.vue'
import systemUser from '../../components/systemUser.vue'
import InsXlcList from './InsXlcList.vue'
import selectOrg from './selectOrg.vue'
import { fetchGet, fetchPostUrlencoded,fetchGetHaveParam } from '../../../utils/requestHttp.js'
export default {
  props:{
    isShow: {
      type: Boolean,
      default: false
    },
    row:{
      type:Object,
      default:{}
    },
    type:Number,
  },
  components:{
    'cus-info-form':cusInfoForm,
    selectOrg,
    systemUser,
    InsXlcList
  },
  computed:{
    getOpsObj(){
      var obj = {};
      obj.load = this.load;
      obj.type = this.type;
      obj.data = this.systemUserList;
      obj.currentPage = this.currentPage;
      obj.dataCount = this.dataCount;
      obj.size = this.pageSize;
      obj.rowData = this.row;
      obj.isGlobalSearch = this.row.isGlobalSearch;
      return obj
    }
  },
  watch: {
    isShow(val) {
      this.myShow = val;
    },
    myShow(val) {
      if(val){
        this.zIndex = 100;
        this.doSerialTing();
        this.systemUserSupply(1);
        this.firstTab = 'name1';
      }else{
        this.zIndex = -1;
      }
      this.$emit('on-change', val);
    },

  },

  // mounted() {
  //   // window.addEventListener('scroll', this.handleScroll)
  // },
  // beforeDestroy() {
  //   window.removeEventListener('scroll', this.handleScroll)
  // },
  methods:{
    reloadData(){
      this.systemUserSupply(this.currentPage);
    },
    changePage(page){
      this.load = true;
      this.currentPage = page;
      this.systemUserSupply(page);
    },
    close(){
      this.myShow = !this.myShow;
    },
    getCarLine(){
      return new Promise((resolve, reject)=>{
        fetchGet('/nxp-admin/xrp/suplist').then((res)=>{
          if(res.data){
            let list = res.data;
            this.rMockData = this.formatRdata(list);
            resolve(this.rMockData);
          }
        })
      })

    },
    formatRdata(list){
      let mockData = [];
      list.map((item,index)=>{
        let obj = {};
        obj.key = (index+1).toString();
        obj.xlcName = item.fullName;
        obj.address = item.address;
        obj.xlcIds = item.id;
        obj.pinyin = item.pinyin;
        mockData.push(obj);
        return item;
      });
      return mockData;
    },
    reloadInfo(s){
      if(s == 'close'){
        this.close();
      }
      this.$emit('on-update-reload')
    },
    handleScroll(){
      this.topChange = document.body.scrollTop+'px';
    },
  async  doSerialTing(){
      this.getCarLine().then((res)=>{
        this.getCarById(res);
      });
    },
    getCarById(carLine){
      fetchGet('/nxp-admin/xrp/list/' + this.row.id).then((res)=>{
        if(res.data){
          let mockData = [];
          let list = res.data;
          this.carData = [];
          this.carKeys = [];
          list.forEach((tag,index)=>{
              const filterItem = carLine.filter((item)=>{
                  if(tag.supId == item.xlcIds){
                    this.carData.push(item);
                    return true;
                  }
              })
          });
          // this.carData = mockData;
          this.carKeys = this.carData.map(item => item.key);
        }
      })
    },
    //人员列表
    systemUserSupply(page){
      fetchPostUrlencoded('/nxp-admin/systemUser/list',{
        orgId:this.row.id,
        page:page,
        size:this.pageSize
      }).then((res)=>{
        if(res.flag == 0){
          this.load = false;
          this.dataCount = res.count;
          this.systemUserList = res.data;
        }else{
          tipsModal(res.msg,this.$Modal,'warning');
        }
      })
    },
  },
  data(){
    return {
      myShow:this.isShow,
      isAdd:'edit',
      carData:[],
      carKeys:[],
      rMockData:[],
      currentPage:1,
      dataCount:0,
      load:true,
      pageSize:10,
      systemUserList:[],
      firstTab:'name1',
      columns1:[
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: '厂商',
            key: 'factory'
        },
        {
            title: '品牌',
            key: 'brand'
        },
        {
            title: '车系',
            key: 'line'
        },
      ]
    }
  }
}
</script>
<style>
.cus-panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
}
.cus-panel .panel-body{
  padding: 15px;
}
</style>
