<template>
  <div class="supp-edit" style="padding-top:15px;">
    <Button @click="showM" style="margin-bottom:10px" type="primary">更新</Button>
    <div class="ivu-transfer-list ivu-transfer-l" style="width: 100%; height: 400px;">
        <div class="ivu-transfer-list-header">
            <span class="ivu-transfer-list-header-title" style="font-size: 15px;">主营车型</span>
        </div>
        <div class="ivu-transfer-list-body ivu-transfer-list-body-with-search ivu-transfer-list-body-with-footer">
            <div>
              <Search style="margin-bottom:10px"
                  :query="normalquery"
                  @on-query-clear="normalRhandleQueryClear"
                  @on-query-change="normalRhandleQueryChange"
                  :placeholder="filterPlaceholder">
                </Search>
                <div class="ivu-table-wrapper" style="height: 320px; margin-top: 5px;">
                    <div class="ivu-table ivu-table-with-fixed-top">
                        <div class="ivu-table-header">
                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <colgroup>
                                    <col width="40%">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="ivu-table-cell">
                                                <span>品牌</span>
                                            </div>
                                        </th>
                                        <th class="">
                                          <div class="ivu-table-cell">
                                            <span>车系</span>
                                           </div>
                                         </th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="ivu-table-body" style="height: 279px;">
                          <table class="cur-table" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                           <colgroup>
                            <col width="40%" />
                           </colgroup>
                           <tbody class="ivu-table-tbody">
                            <tr
                            v-for="item in normalData"
                            :key="item.id"
                            class="ivu-table-row">
                             <td class="">
                              <div class="ivu-table-cell">
                               <span>{{item.brandName}}</span>
                              </div></td>
                             <td class="">
                              <div class="ivu-table-cell">
                               <span>{{item.familyName}}</span>
                              </div></td>
                            </tr>
                           </tbody>
                          </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Modal
          v-model="myShow"
          title="车型"
          class="highLevelModal"
          width="860"
          >
          <div class="supp-edit">
            <Button type="primary" @click="save"  size="large">确定更新</Button>
            <div class="ivu-transfer" style="margin-top:25px;">
              <div class="ivu-transfer-list ivu-transfer-l" style="width: 400px; height: 400px;">
                  <div class="ivu-transfer-list-header">
                      <span class="ivu-transfer-list-header-title" style="font-size: 15px;">备选车型</span>
                  </div>
                  <div class="ivu-transfer-list-body ivu-transfer-list-body-with-search ivu-transfer-list-body-with-footer">
                      <div>
                        <Search style="margin-bottom:10px"
                            :query="lquery"
                            @on-query-clear="LhandleQueryClear"
                            @on-query-change="LhandleQueryChange"
                            :placeholder="filterPlaceholder">
                          </Search>
                          <div class="ivu-table-wrapper" style="height: 320px; margin-top: 5px;">
                              <div class="ivu-table ivu-table-with-fixed-top">
                                  <div class="ivu-table-header">
                                      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                          <colgroup>
                                              <col width="32">
                                          </colgroup>
                                          <thead>
                                              <tr>
                                                  <th>
                                                      <div class="ivu-table-cell">
                                                        <span v-if="isShowB">品牌</span>
                                                        <div v-else class="ivu-breadcrumb">
                                                            <span>
                                                                <a @click="backBrand" class="ivu-breadcrumb-item-link">Home</a>
                                                                <span class="ivu-breadcrumb-item-separator">&gt;</span>
                                                            </span>
                                                            <!-- <span>
                                                                <span class="ivu-breadcrumb-item-link">品牌</span>
                                                                <span class="ivu-breadcrumb-item-separator">&gt;</span>
                                                            </span> -->
                                                            <span v-if="bName!=''">
                                                                <span class="ivu-breadcrumb-item-link">{{bName}}</span>
                                                                <span class="ivu-breadcrumb-item-separator">&gt;</span>
                                                            </span>
                                                        </div>
                                                      </div>
                                                  </th>
                                              </tr>
                                          </thead>
                                      </table>
                                  </div>
                                  <div class="ivu-table-body" style="height: 279px;">
                                    <ul v-if="isShowB" class="brand-ul">
                                      <li v-for="(item,itemindex) in brandCom" :key="item.id">
                                        <span @click="showSerise(item)" class="l">
                                          <Icon type="share"></Icon>
                                        </span>
                                        <!-- <Icon type="folder"></Icon> -->
                                        <Checkbox
                                        @on-change="checkBrandChange($event,item,itemindex)"
                                        v-model="item.set">
                                       </Checkbox>
                                        {{item.brandName}}
                                      </li>
                                    </ul>
                                    <ul v-else class="brand-ul">
                                      <li v-for="item in seriseData" :key="item.id">
                                        <Checkbox
                                        @on-change="selectSerise($event,item)"
                                        v-model="item.set">
                                        </Checkbox>
                                        {{item.familyName}}
                                      </li>
                                    </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="ivu-transfer-list ivu-transfer-l" style="width: 400px; height: 400px;margin-left:20px;">
                  <div class="ivu-transfer-list-header">
                      <span class="ivu-transfer-list-header-title" style="font-size: 15px;">已选车型</span>
                  </div>
                  <div class="ivu-transfer-list-body ivu-transfer-list-body-with-search ivu-transfer-list-body-with-footer">
                      <div>
                        <Search style="margin-bottom:10px"
                            :query="rquery"
                            @on-query-clear="RhandleQueryClear"
                            @on-query-change="RhandleQueryChange"
                            :placeholder="filterPlaceholder">
                          </Search>
                          <div class="ivu-table-wrapper" style="height: 320px; margin-top: 5px;">
                              <div class="ivu-table ivu-table-with-fixed-top">
                                  <div class="ivu-table-header">
                                      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                          <colgroup>
                                              <col width="40%">
                                          </colgroup>
                                          <thead>
                                              <tr>
                                                  <th>
                                                      <div class="ivu-table-cell">
                                                          <span>品牌</span>
                                                      </div>
                                                  </th>
                                                  <th class="">
                                                    <div class="ivu-table-cell">
                                                      <span>车系</span>
                                                     </div>
                                                   </th>
                                              </tr>
                                          </thead>
                                      </table>
                                  </div>
                                  <div class="ivu-table-body" style="height: 279px;">
                                    <table class="cur-table" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                     <colgroup>
                                      <col width="40%" />
                                     </colgroup>
                                     <tbody class="ivu-table-tbody">
                                      <tr
                                      v-for="item in TempSets"
                                      :key="item.id"
                                      class="ivu-table-row">
                                       <td class="">
                                        <div class="ivu-table-cell">
                                         <span>{{item.brandName}}</span>
                                        </div></td>
                                       <td class="">
                                        <div class="ivu-table-cell">
                                         <span>{{item.familyName}}</span>
                                        </div></td>
                                        <td>
                                         <div class="ivu-table-cell">
                                          <Button @click="deleteS(false,item)"  type="text">删除</Button>
                                         </div></td>
                                      </tr>
                                     </tbody>
                                    </table>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
          <div slot="footer">
            <Button type="ghost" @click="close" style="width:100%" size="large">关闭</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import Search from '../../components/search.vue';
import { tipsModal,setBodyAtt } from '../../../utils/common.js'
import { fetchPostJson } from '../../../utils/requestHttp.js'
export default {
  components:{
    Search
  },
  props:{
    rowObj:{
      type:Object,
      default:{}
    }
  },
  watch:{
    myShow(val){
      if(!val){
        setBodyAtt();
        this.bName = "";
      }
    },
    withLink(val){
      this.brandData = this.brandData.filter((item)=>{
        if(this.brandSets.indexOf(item.brandId) > -1){
          item.set = true;
        }else{
          item.set = false;
        }
        return item
      })
    },
    single(val){
      let len = this.seriseData.length;
      let serarr = this.seriseData.map((item)=>{
        return item.brandId
      })
      let arr = this.setsId.map((item)=>{
        return item.brandId
      });
      let count = 0;
      this.setsId.forEach((item)=>{
        if(serarr.indexOf(item.brandId)>-1){
          count++;
        }
      })
      if(this.tempLink){
        if(count == len){
          serarr.forEach((item,index)=>{
            if(!(this.brandSets.indexOf(item)>-1)){
              this.brandSets[this.brandSets.length] = item;
            }
        })
        }
        if(this.setsId.length == 0){
          this.brandSets.forEach((item,index)=>{
            if(!(this.setsId.indexOf(item)>-1)){
              this.brandSets.splice(index,1);
            }
        })
      }
      }else{
        if(count!=len){
          this.brandSets.forEach((item,index)=>{
            if(serarr.indexOf(item)>-1){
              this.brandSets.splice(index,1);
            }
        })
      }
      }
      this.withLink = !this.withLink;
    }
  },
  computed:{
    brandCom(){
      return this.brandData;
    }
  },
  created(){
    this.brandHttp();
  },
  methods:{
    checkBrandChange(val,item,itemindex){
      if(val){
        this.brandSets[this.brandSets.length] = item.brandId;
      }else{
        this.brandSets.forEach((i,index)=>{
          if(item.brandId==i){
            this.brandSets.splice(index,1);
          }
        })
      }
      this.seriseData = [];
      this.seriseHttp(item,'all');
    },
    selectSerise(val,item){
      let obj = {};
      if(val) {
       this.tempLink = true;
       obj.brandId = item.brandId;
       obj.brandCode = item.brandCode;
       obj.brandName = item.brandName;
       obj.familyId = item.familyId;
       obj.familyCode = item.familyCode;
       obj.familyName = item.familyName;
       this.single = !this.single;
       this.setsId[this.setsId.length] = obj;
       if(this.rquery!=""){
         this.TempSets[this.TempSets.length] = obj;
       }else{
         this.TempSets = this.setsId;
       }
     }else{
       this.tempLink = false;
       this.single = !this.single;
       this.setsId.forEach((i,index)=>{
          if(item.familyId == i.familyId){
            this.setsId.splice(index,1);
          }
        })
        this.TempSets.forEach((i,index)=>{
           if(item.familyId == i.familyId){
             this.TempSets.splice(index,1);
           }
         })

     }
    },
    deleteChange(item){
      this.brandSets.forEach((i,index)=>{
         if(item.brandId == i){
           this.brandSets.splice(index,1);
         }
       })
      this.setsId.forEach((i,index)=>{
         if(item.familyId == i.familyId){
           this.setsId.splice(index,1);
         }
       })
       this.TempSets.forEach((i,index)=>{
          if(item.familyId == i.familyId){
            this.TempSets.splice(index,1);
          }
        })
        this.withLink = !this.withLink;
    },
    deleteS(val,item){
      this.deleteChange(item);
      let setArr = this.setsId.map((item)=>{
        return item.familyId
      })
      let list = this.seriseData;
      for(let i=0;i<list.length;i++) {
        list[i]['brandCode'] = item.brandCode;
        list[i]['brandName'] = item.brandName;
        if(setArr.indexOf(list[i].familyId) > -1){
          list[i]['set'] = true;
        }else{
          list[i]['set'] = false;
        }
      }
      this.seriseData = list;
    },
    selectAll(list,brandItem){
      let obj = null;
      let data = list;
      this.seriseData = [];
      let arr = this.setsId.map((item)=>{
        return item.familyId
      })
      let dataArr = list.map((item)=>{
        return item.familyId;
      })
      for(let i = 0;i<arr.length;i++){
        if(dataArr.indexOf(arr[i])>-1){
          this.setsId.splice(i,1);
          arr.splice(i,1);
          i--;
        }
      }
      for(let i=0;i<data.length;i++) {
        let bid = data[i].brandId;
        if(this.brandSets.indexOf(bid)>-1){
          obj = {
            brandId: data[i].brandId,
            brandCode: brandItem.brandCode,
            brandName: brandItem.brandName,
            familyId: data[i].familyId,
            familyCode: data[i].familyCode,
            familyName: data[i].familyName,
          }
          this.setsId.push(obj);
          data[i]['set'] = true;
        }else{
          this.setsId.forEach((sItem,index)=>{
            if(bid == sItem.brandId){
              this.setsId.splice(index,1);
            }
          })
          data[i]['set'] = false;
        }
      }
      this.TempSets = this.setsId;
      this.seriseData = data;
    },
    showSerise(item){
      this.seriseData = [];
      this.isShowB = false;
      this.bName = item.brandName;
      this.seriseHttp(item);
    },
    save(){
      fetchPostJson(
          '/nxp-admin/sup/add',
          {
            orgId:this.rowObj.id,
            supplierMainlines:this.setsId
          }
        ).then((res) => {
          if(res.flag == 0){
            this.$Message.success(res.msg);
            this.queryCarHttp();
            this.myShow = false;
          }else{
            this.$Message.error(res.msg);
          }
      })
    },
    backBrand(){
      this.bName = "";
      this.isShowB = true;
    },
    normalRhandleQueryClear(){
      this.normalquery = '';
    },
    normalRhandleQueryChange(val){
      this.normalquery = val;
      this.normalData = this.vague(val,this.tempNormalData,'sName');
    },
    RhandleQueryClear(){
      this.rquery = '';
    },
    RhandleQueryChange(val){
      this.rquery = val;
      this.TempSets = this.vague(val,this.setsId,'sName');
    },
    LhandleQueryClear(){
      this.lquery = '';
    },
    LhandleQueryChange(val){
      this.lquery = val;
      this.brandData = this.vague(val,this.tempBrandData,'bName');
    },
    vague(keyWord,data,type) {
      var list = data;
      var len = data.length;
      var arr = [];
      var reg = new RegExp(keyWord);
      for (var i = 0; i < len; i++) {
        //如果字符串中不包含目标字符会返回-1
        let bName = data[i].brandName;
        let fName = data[i].familyName;
        if(type == 'bName'){
          if(bName){
            if (bName.match(reg)) {
              arr.push(data[i]);
            }
          }
        }
        if(type == 'sName'){
          if(fName){
            if (fName.match(reg)) {
              arr.push(data[i]);
            }
          }
        }
      }
      return arr;
    },
    showM(){
      this.myShow = true;
    },
    close(){
      this.myShow = false;
    },
    seriseHttp(item,all){
      fetchPostJson('/nxp-admin/sup/family',{brandId:item.brandId}).then((res)=>{
        if(res.data){
          if(all == 'all'){
            this.selectAll(res.data,item);
          }else{
            let setArr = this.setsId.map((item)=>{
              return item.familyId
            })
            if(setArr.length!=0){
              for(let i=0;i<res.data.length;i++) {
                res.data[i]['brandCode'] = item.brandCode;
                res.data[i]['brandName'] = item.brandName;
                if(setArr.indexOf(res.data[i].familyId) > -1){
                  res.data[i]['set'] = true;
                }else{
                  res.data[i]['set'] = false;
                }
              }
            }else{
              for(let i=0;i<res.data.length;i++) {
                res.data[i]['brandCode'] = item.brandCode;
                res.data[i]['brandName'] = item.brandName;
                res.data[i]['set'] = false;
              }
            }
            this.seriseData = res.data;
          }

        }else{
          this.$Message.error(res.msg);
        }
      })
    },
    queryCarHttp(){
      fetchPostJson('/nxp-admin/sup/query',{orgId:this.rowObj.id}).then((res)=>{
        if(res.data){
          this.normalData = res.data;
          this.tempNormalData = res.data;
          let obj = null;
          let list = res.data;
            for(let i = 0;i<list.length;i++){
              obj = {
                brandId : list[i].brandId,
                brandCode : list[i].brandCode,
                brandName : list[i].brandName,
                familyId : list[i].familyId,
                familyCode : list[i].familyCode,
                familyName : list[i].familyName
              }
              if(!(this.brandSets.indexOf(list[i].brandId)>-1)){
                this.brandSets.push(list[i].brandId);
              }
              if(!(this.setsId.indexOf(list[i].familyId)>-1)){
                this.setsId.push(obj);
              }
            }
            this.TempSets = this.setsId;
            this.withLink = !this.withLink;
        }else{
          this.$Message.error(res.msg);
        }
      })
    },
    brandHttp(){
      fetchPostJson('/nxp-admin/sup/brand',{}).then((res)=>{
        if(res.data){
          this.brandData = res.data;
          this.tempBrandData = res.data;
          this.queryCarHttp()
        }else{
          this.$Message.error(res.msg);
        }
      })
    }
  },
  data(){
    return {
      TempSets:[],
      setsId:[],
      brandSets:[],
      lquery: '',
      rquery:'',
      normalquery:'',
      isShowB:true,
      filterPlaceholder:'请输入搜索内容',
      myShow:false,
      brandData:[],
      tempBrandData:[],
      normalData:[],
      seriseData:[],
      tempNormalData:[],
      bName:"",
      single:true,
      withLink:false,
      tempLink:false
    }
  }
}
</script>
<style>
.brand-ul{
  line-height: 40px;
  font-size: 15px;
}
.brand-ul li{
  border-bottom: 1px solid #dddee1;
  padding: 0 20px;
}
.brand-ul li .l{
  float: right;
  cursor: pointer;
}
.highLevelModal .ivu-modal-wrap, .highLevelModal .ivu-modal-mask{
  z-index: 1002
}
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
.normal-ul{

}
.normal-ul li{
  border-radius: 5px;
  margin:10px 15px 10px;
  margin-right: 15px;
  padding: 0 10px;
  float: left;
  height: 30px;
  line-height: 30px;
  border:1px solid #e9eaec;
}
</style>
