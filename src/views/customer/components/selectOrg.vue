<template>
  <div class="supp-edit" style="padding-top:15px;padding-left:40px;">
    <Button @click="updateCar" style="margin-bottom:10px" type="primary">更新</Button>
    <trans
    :lstyle="lstyle"
    :rstyle="rstyle"
    @move-to-left="moveToLeft"
    @move-to-right="moveToRight"
    :title="['已选修理厂','待选修理厂']"
    :left-active="leftActive"
    :right-active="rightActive"
    :operations="[]"
    >
    <div slot="ldata"  class="">
      <Search style="margin-bottom:10px"
          :query="lquery"
          @on-query-clear="LhandleQueryClear"
          @on-query-change="LhandleQueryChange"
          :placeholder="filterPlaceholder"></Search>
      <div class="ivu-table-wrapper" style="height:320px;margin-top:5px;">
        <div class="ivu-table ivu-table-with-fixed-top">
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
              <colgroup>
                <col width="32">
                <!-- <col width="112"> -->
              </colgroup>
                <thead>
                  <tr>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <Checkbox :value="lcheckedAll" @on-change="ltoggleSelectAll"></Checkbox>
                      </div>
                    </th>
                    <th class="">
                      <div class="ivu-table-cell">
                        <span>修理厂名称</span>
                         <!----> <!---->
                       </div>
                     </th>
                      </tr>
                    </thead>
                  </table>
            </div>
            <div class="ivu-table-body" style="height:279px">
              <table class="cur-table" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
               <colgroup>
                <col width="30" />
                <!-- <col width="112" /> -->
               </colgroup>
               <tbody class="ivu-table-tbody">
                <tr @click.prevent="select(item,'left')"  v-for="item in carByData" :key="item.key" class="ivu-table-row">
                 <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                   <Checkbox :value="isCheck(item,'left')"></Checkbox>
                  </div></td>
                 <td class="">
                  <div class="ivu-table-cell">
                   <span>{{item.xlcName}}</span>
                  </div></td>
                </tr>
               </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
    <div slot="rdata">
      <Search style="margin-bottom:10px"
          :query="rquery"
          @on-query-clear="RhandleQueryClear"
          @on-query-change="RhandleQueryChange"
          :placeholder="filterPlaceholder"></Search>
        <!-- <ScrollLoader @scroll-to-botton="infinite" @scroll-to-top="refesh" :class-name="rClassName">
          <Table :loading="rloading" style="margin-top:5px" height="320" ref="selection" :columns="columns1" :data="mockData"></Table>
        </ScrollLoader> -->
        <!-- <Table :loading="rloading" style="margin-top:5px" height="320" ref="selection" :columns="columns1" :data="mockData"></Table> -->
        <!-- <ul style="height:270px;overflow:auto">
          <li v-for="item in mockData">
            <input type="checkbox" />{{item.brand}}
          </li>
        </ul> -->
        <div class="ivu-table-wrapper" style="height:320px;margin-top:5px;">
          <div class="ivu-table ivu-table-with-fixed-top">
            <div class="ivu-table-header">
              <table  cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col width="32">
                  <!-- <col width="112">
                  <col width="112"> -->
                </colgroup>
                  <thead>
                    <tr>
                      <th class="ivu-table-column-center">
                        <div class="ivu-table-cell">
                          <Checkbox :value="rcheckedAll" @on-change="rtoggleSelectAll"></Checkbox>
                        </div>
                      </th>
                      <th class="">
                        <div class="ivu-table-cell">
                          <span>修理厂名称</span>
                           <!----> <!---->
                         </div>
                       </th>
                       <th class="">
                         <div class="ivu-table-cell">
                           <span>地址</span>
                            <!----> <!---->
                          </div>
                        </th>
                        </tr>
                      </thead>
                    </table>
              </div>
              <div class="ivu-table-body" style="height:279px">
                <table class="cur-table" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                 <colgroup>
                  <col width="30" />
                  <!-- <col width="112" />
                  <col width="112" /> -->
                 </colgroup>
                 <tbody class="ivu-table-tbody">
                  <tr @click.prevent="select(item,'right')"  v-for="item in mockData" :key="item.key" class="ivu-table-row">
                   <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                     <Checkbox :value="isCheck(item,'right')"></Checkbox>
                    </div></td>
                   <td class="">
                    <div class="ivu-table-cell">
                     <span>{{item.xlcName}}</span>
                    </div></td>
                   <td class="">
                    <div class="ivu-table-cell">
                     <span>{{item.address}}</span>
                    </div></td>
                  </tr>
                 </tbody>
                </table>
              </div>
          </div>
        </div>
    </div>
    </trans>
  </div>
</template>

<script>
import { tipsModal } from '../../../utils/common.js'
import trans from '../../components/trans.vue'
import Search from '../../components/search.vue';
import { fetchGet, fetchPostUrlencoded,fetchGetHaveParam } from '../../../utils/requestHttp.js'
export default {
  components:{
    Search,
    trans
  },
  props:{
    rowObj:{
      type:Object,
      default:{}
    },
    carData:{
      type:Array,
      default () {
          return [];
      }
    },
    data:{
      type:Array,
      default () {
          return [];
      }
    },
    keys:{
      type:Array,
      default(){
        return []
      }
    }
  },
  computed:{
    leftValidKeysCount () {
        return this.getValidKeys('left').length;
    },
    rightValidKeysCount () {
        return this.getValidKeys('right').length;
    },
    lcheckedAll(){
      if(this.leftValidKeysCount == 0){
        return false
      }else{
        return this.carByData.length == this.leftValidKeysCount
      }
    },
    rcheckedAll(){
      if(this.rightValidKeysCount == 0){
        return false
      }else{
        return this.mockData.length == this.rightValidKeysCount
      }
    },
    getCarByData(){
      return this.carData
    }
  },
  watch:{
    carData(val){
      if(val){
        console.log(val)
        this.carByData = this.getCarByData;
        this.lSearchData = val.filter((item) => {return true});
      }
    },
    data(val){
      this.targetKeys = [];
      this.mockData = val.filter((item) => {return true});
      this.middleData = val.filter((item) => {return true})
    },
    carByData(val){
      console.log(val);
    },
    keys(val){
      if(val){
        this.targetKeys = val;
        this.middleTargetKeys = val;
      }
    },
    rightCheckedKeys(val){
      if(val.length > 0){
        this.rightActive = true;
      }else{
        this.rightActive = false;
      }
    },
    leftCheckedKeys(val){
      if(val.length == this.carByData.length){
        this.leftData = this.carByData;
      }
      if(val.length > 0){
        this.leftActive = true;
      }else{
        this.leftActive = false;
      }
    },
    targetKeys(val){
      console.log(123);
      console.log(val);
      if(val.length > 0){
        this.splitData(false)
      }
    },
    mockData(val){
      if(val.length > 0){
        this.splitData(false)
      }
    },
    middleData(val){
      console.log("已经变化");
      console.log(val);
    }
  },
  // mounted(){
  //   this.getCarLine();
  // },
  methods:{
    getValidKeys (direction) {
        return this[`${direction}Data`].filter(data => this[`${direction}CheckedKeys`].indexOf(data.key) > -1).map(data => data.key);
    },
    select (item,direction) {
        // if(direction == 'right'){
        //   const id = this[`${direction}CheckedKeys`].indexOf(item.id);
        //   id > -1 ? this[`${direction}CheckedKeys`].splice(index, 1):this[`${direction}CheckedKeys`].push(item.id);
        // }
        const index = this[`${direction}CheckedKeys`].indexOf(item.key);
        index > -1 ? this[`${direction}CheckedKeys`].splice(index, 1) : this[`${direction}CheckedKeys`].push(item.key);
    },
    isCheck (item,direction) {
        return this[`${direction}CheckedKeys`].some(key => key === item.key);
    },
    splitData (init = false) {
        this.rightData = this.mockData;
        this.leftData = [];
        console.log(this.targetKeys);
        if (this.targetKeys.length > 0) {
            this.targetKeys.forEach((targetKey) => {
                const filteredData = this.rightData.filter((data, index) => {
                    if (data.key === targetKey) {
                        this.mockData.splice(index, 1);
                        return true;
                    }
                    return false;
                });
                if (filteredData && filteredData.length > 0){
                  this.leftData.push(filteredData[0]);
                }
            });
        }
    },
    moveToRight(direction){
      this.targetKeys = [];
      this.leftCheckedKeys.forEach((targetKey,i)=>{
        this.carByData.filter((data,index)=>{
          if(data.key == targetKey){
            this.carByData.splice(index, 1);
            return true
          }
          return false
        })
        this.lSearchData.filter((data,index)=>{
          if(data.key == targetKey){
            this.lSearchData.splice(index,1)
            return true
          }
          return false;
        })

        this.middleTargetKeys.filter((data,index)=>{
          if(data == targetKey){
            this.middleTargetKeys.splice(index,1);
            return true
          }
          return false;
        })
      })
      const moveKeys = this.middleTargetKeys.filter(targetKey => !this.leftCheckedKeys.some(checkedKey => targetKey === checkedKey));
      console.log(moveKeys);
      if(moveKeys.length > 0){
          const filterData = this.middleData.filter(item => !(moveKeys.indexOf(item.key) > -1));
          this.mockData = filterData;
      }else{
        this.mockData = this.middleData.filter((item) => {return true});
      }
      this.leftActive = false;
    },
    moveToLeft (direction) {
        const targetKeys = this.targetKeys;
        const opposite = direction === 'left' ? 'right' : 'left';
        const moveKeys = this.getValidKeys(opposite);
        const newTargetKeys = direction === 'left' ?
                moveKeys.concat(targetKeys) :
                targetKeys.filter(targetKey => !moveKeys.some(checkedKey => targetKey === checkedKey));
        this.rtoggleSelectAll(false);
        this.reloadChange(newTargetKeys,direction,moveKeys)
    },
    reloadChange(newTargetKeys,direction,moveKeys){
      this.targetKeys = newTargetKeys;
      this.middleTargetKeys = this.targetKeys;
      this.carByData = [];
      this.lSearchData = [];
      this.leftCheckedKeys = [];
      this.targetKeys.forEach((targetKey) => {
          const filteredData = this.middleData.filter((data, index) => {
              if (data.key === targetKey) {
                  return true;
              }
              return false;
          });
          this.carByData.push(filteredData[0]);
          this.lSearchData.push(filteredData[0])
      });
    },
    ltoggleSelectAll(status){
      const keys = status ?
              this.carByData.map(data => data.key) :
              this.carByData.filter(data => false).map(data => data.key);
      this.leftCheckedKeys = keys;
    },
    rtoggleSelectAll(status){
      const keys = status ?
              this.mockData.map(data => data.key) :
              this.mockData.filter(data => false).map(data => data.key);
      this.rightCheckedKeys = keys;
    },
    // formatRdata(list){
    //   let mockData = [];
    //   list.map((item,index)=>{
    //     let obj = {};
    //     obj.key = (index+1).toString();
    //     obj.factory = item.factory;
    //     obj.brand = item.brand;
    //     obj.line = item.line;
    //     obj.id = item.id;
    //     mockData.push(obj);
    //     return item;
    //   });
    //   return mockData;
    // },
    LhandleQueryClear(){
      this.lquery = '';
    },
    LhandleQueryChange(val){
      this.lquery = val;
      console.log(this.lSearchData);
      this.carByData = this.vague(val,this.lSearchData);
    },
    RhandleQueryClear(){
      this.rquery = '';
    },
    RhandleQueryChange(val){
      this.rquery = val;
      this.mockData = this.vague(val,this.middleData);
    },
    vague(keyWord,data) {
      var list = data;
      var len = data.length;
      var arr = [];
      var reg = new RegExp(keyWord);
      for (var i = 0; i < len; i++) {
        //如果字符串中不包含目标字符会返回-1
        if (list[i].xlcName.match(reg)) {
          arr.push(list[i]);
        }else if(list[i].pinyin.match(reg)){
          arr.push(list[i]);
        }
      }
      return arr;
    },
    // getCarLine(){
    //   fetchGet('/nxp-admin/carLine/all').then((res)=>{
    //     if(res.data){
    //       let list = res.data;
    //       this.rCount = res.data.length;
    //       this.rPageCount = Math.ceil(this.rCount/this.PageSize);
    //       this.rCountData = this.formatRdata(res.data);
    //       this.middleData = this.formatRdata(list);
    //       this.mockData = this.formatRdata(list);
    //     }
    //   })
    // },
    updateCar(){
      this.LhandleQueryClear();
      this.LhandleQueryChange('');
      let model = this.carByData.map(item => item.xlcIds);
      fetchPostUrlencoded('/nxp-admin/xrp/update',{
        xlcId:this.rowObj.id,
        supIds:model.join(),
      }).then((res)=>{
        if(res.flag == 0){
          tipsModal('更新修理厂成功!',this.$Modal,'success');
        }else{
          tipsModal(res.msg,this.$Modal,'warning');
        }
      })
    }
  },
  data(){
    return {
      lquery: '',
      rquery:'',
      filterPlaceholder:'请输入搜索内容',
      lSearchData:[],
      carByData:[],
      targetKeys:[],
      rCount:0,
      PageSize:50,
      rPageCount:0,
      rCurrentPage:1,
      rClassName:'left-scroll',
      risUpperLaoding: false,
      risUnderLaoding: false,
      risLoadedAll:false,
      rCountData:[],
      rloading:false,
      middleData:[],
      moveKeys:[],
      middleTargetKeys:[],
      leftData: [],
      rightData: [],
      leftCheckedKeys: [],
      rightCheckedKeys: [],
      rightCheckedId:[],
      lstyle:{
        width:'400px',
        height:'400px'
      },
      rstyle:{
        width:'400px',
        height:'400px'
      },
      mockData:[],
      leftActive:false,
      rightActive:false
    }
  }
}
</script>
<style>
  .supp-edit .ivu-table-wrapper{
    border:0;
    border-top: 1px solid #dddee1
  }
.supp-edit  .ivu-table:after, .supp-edit .ivu-table:before{
  background: none;
  }
.supp-edit  .ivu-transfer-list{
  padding-top: 40px;
}
</style>
