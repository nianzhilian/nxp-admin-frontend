<template>
  <Modal
        v-model="myShow"
        title="保险公司基本信息"
        width="1000"
        >
        <div class="">
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
              <TabPane name="name2" label="平台管理费">
                <div v-if="myShow" style="height:500px;overflow-y:auto">
                  <ManFee :row-obj="row" :type="type"></ManFee>
                </div>
              </TabPane>
              <TabPane name="name3" label="保险公司组织关系列表">
                  <selectOrg :row-obj="row" :car-data="carData" v-if="carData&&myShow" :data="rMockData" :keys="carKeys"></selectOrg>
              </TabPane>
              <TabPane name="name4" label="关联修理厂">
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
import ManFee from './ManFee.vue'
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
    InsXlcList,
    ManFee
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
        fetchPostUrlencoded('/nxp-admin/cusOrganiztion/allList',{type:3}).then((res)=>{
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
      fetchGet('/nxp-admin/cos/list/' + this.row.id).then((res)=>{
        if(res.data){
          let mockData = [];
          let list = res.data;
          this.carData = [];
          this.carKeys = [];
          list.forEach((tag,index)=>{
              const filterItem = carLine.filter((item)=>{
                  if(tag.xlcId == item.xlcIds){
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
