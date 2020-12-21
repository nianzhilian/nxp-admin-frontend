<template>
  <Modal
        v-model="myShow"
        title="配件商基本信息"
        width="1000"
        >
        <div class="">
          <div class="air-space">
            基本信息
          </div>
          <cus-info-form :is-add="isAdd" :row-obj="row" @on-close="reloadInfo" :type="type"></cus-info-form>

          <Tabs v-model="firstTab" type="card" :animated="false">
            <!-- <TabPane name="name1" label="基本信息">
              <cus-info-form :is-add="isAdd" :row-obj="row" @on-close="reloadInfo" :type="type"></cus-info-form>
            </TabPane> -->
              <TabPane name="name1" label="人员列表">
                <systemUser :ops-obj="getOpsObj" @on-reload="reloadData" @change-page="changePage"></systemUser>
              </TabPane>
              <TabPane name="name2" label="评分">
                <div style="line-height:32px;padding:0 2%">
                  <Row>
                    <Col span="3" v-for='val in markData' :key="val.id">
          						{{val.parameterName}}<br />
                      <InputNumber size="large" :max="5" :min="0"  v-model='val.value'></InputNumber>
                      <!-- <input type="text" class="form-control" style="margin: 10px 0 20px 0;" pattern="^[0-5]{1}|[0-5]{1}\.\d{2}$" v-model='val.value'/> -->
          					</Col>
                  </Row>
                    <Button style="margin-top:10px;" type="primary" @click="handleSco">确定</Button>
                </div>
              </TabPane>
              <TabPane name="name3" label="主营车型">
                  <!-- <selectCar :row-obj="row" :car-data="carData" v-if="carData&&myShow" :data="rMockData" :keys="carKeys"></selectCar> -->
                  <selectCar v-if="myShow" :row-obj="row"></selectCar>
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
import selectCar from './selectCar.vue'
import { fetchGet, fetchPostUrlencoded,fetchGetHaveParam,fetchPostJson } from '../../../utils/requestHttp.js'
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
    selectCar,
    systemUser
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
        this.getSco();
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
    formatRdata(list){
      let mockData = [];
      list.map((item,index)=>{
        let obj = {};
        obj.key = (index+1).toString();
        obj.factory = item.factory;
        obj.brand = item.brand;
        obj.line = item.line;
        obj.id = item.id;
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
    getSco(){
      fetchGet('/nxp-admin/cusOrganiztion/scoById/'+this.row.id).then((res)=>{
        if(res.data){
          this.markData = res.data.filter((item)=>{
            item.value = parseInt(item.value);
            return item;
          });
        }
      })
    },
    handleSco(){
      let obj = {};
      obj.orgId = this.row.id;
      obj.SR_DEFAULT_SO_CR_PARTS_MATCHING  = this.markData[0].value;
      obj.SR_DEFAULT_SO_CR_PARTS_QUALITY   = this.markData[1].value;
      obj.SR_DEFAULT_SO_CR_SERVICE_QUALITY = this.markData[2].value;
      obj.SR_DEFAULT_SO_PR_BIDDING         = this.markData[3].value;
      obj.SR_DEFAULT_SO_PR_EFFICIENCY      = this.markData[4].value;
      obj.SR_DEFAULT_SO_PR_RESPONSIVENESS  = this.markData[5].value;
      obj.SR_DEFAULT_SO_PR_SERVICE_QUALITY = this.markData[6].value;
      obj.SR_DEFAULT_SP_PR_GOODS_READINESS = this.markData[7].value;
      fetchPostUrlencoded('/nxp-admin/cusOrganiztion/updateScore',obj).then((res)=>{
        if(res.flag == 0){
          tipsModal(res.msg,this.$Modal,'success');
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
      markData:[],
      carData:[],
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
