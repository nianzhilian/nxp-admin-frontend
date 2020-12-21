<template>
  <div class="app-container">
    <Button type="info" @click="addHandle" icon="android-add">新增</Button>
    <Table style="margin-top:15px;" border :loading='opsObj.load'  highlight-row  :columns="columns" :data="opsObj.data"></Table>
    <div v-show="this.opsObj.data.length > 0" style="margin-top:15px;" class="fr">
      <Page :current="opsObj.currentPage" @on-change="change"  :total="opsObj.dataCount" :page-size="opsObj.size"></Page>
    </div>
    <cus-sys-user-modal :row-data="opsObj.rowData"  @on-reload="reload" :type="opsObj.type" @on-change="onChangeUserModal" :is-show="addModalShow"></cus-sys-user-modal>
    <component @on-change="changeEditIshow" @on-reload="reload" :row-data="rowObj" :type="opsObj.type" :is-show="editIshow" v-bind:is="currentView">
    </component>
    <tips-model @on-change="onChange" @on-ok="ensure" :is-show="tips">
      <span v-if="this.btnType == 'detain' " style="text-align:center;display:block;font-size:16px">你确定禁用吗？</span>
      <span v-if="this.btnType == 'awaken' " style="text-align:center;display:block;font-size:16px">你确定启用吗？</span>
    </tips-model>
  </div>
</template>

<script>
import { dateTrans,getLocalTime,tipsModal,setBodyAtt,logHttp } from '../../utils/common.js'
import { fetchPostUrlencoded } from '../../utils/requestHttp.js'
import tipsModel from '../../components/tipsModel.vue'
import cusSysUserModal from './cusSysUserModal.vue'
import cusSysUserEdit from './cusSysUserEdit.vue'
export default {
  props:{
    opsObj:{
      type:Object,
      default:{}
    }
  },
  watch:{
    addModalShow(val){
      if(val){
        switch (this.opsObj.type) {
          case 1:
              if(this.opsObj.isGlobalSearch == 'yes'){
                this.$store.commit('setSourceInfo', {
                  sourceUri: this.$store.state.sourceInfo.sourceUri,
                  currentUri: '/dashboard/globalSearch/addSupplierUser',
                  tempPath:this.$store.state.sourceInfo.tempPath
                });
                logHttp(this.$store.state.sourceInfo,'新增配件商人员',fetchPostUrlencoded);
              }
            break;
          case 2:
          if(this.opsObj.isGlobalSearch == 'yes'){
             this.$store.commit('setSourceInfo', {
             sourceUri: this.$store.state.sourceInfo.sourceUri,
             currentUri: '/dashboard/globalSearch/addInsurerUser',
             tempPath:this.$store.state.sourceInfo.tempPath
           });
           logHttp(this.$store.state.sourceInfo,'新增保险公司人员',fetchPostUrlencoded);
           }
            break;
          case 3:
          if(this.opsObj.isGlobalSearch == 'yes'){
            console.log(this.opsObj);
              this.$store.commit('setSourceInfo', {
  	          sourceUri: this.$store.state.sourceInfo.sourceUri,
  	          currentUri: '/dashboard/globalSearch/addRepairerUser',
  	          tempPath:this.$store.state.sourceInfo.tempPath
  	        });
  	        logHttp(this.$store.state.sourceInfo,'新增修理厂人员',fetchPostUrlencoded);
            }
            break;
        }
            if(this.$store.state.sourceInfo.tempPath == '/client/supplier'){
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/supplier/addSupplierUser',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'新增配件商人员',fetchPostUrlencoded);
            }else if (this.$store.state.sourceInfo.tempPath == '/client/insurer') {
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/insurer/addInsurerUser',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'新增保险公司人员',fetchPostUrlencoded);
            }else if (this.$store.state.sourceInfo.tempPath == '/client/repairer') {
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/repairer/addRepairerUser',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'新增修理厂人员',fetchPostUrlencoded);
            }

      }
    },
    editIshow(val){
      if(val){

        switch (this.opsObj.type) {
        case 1:
            if(this.opsObj.isGlobalSearch == 'yes'){
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/dashboard/globalSearch/editSupplierUser',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'编辑配件商人员',fetchPostUrlencoded);
            }
          break;
        case 2:
        if(this.opsObj.isGlobalSearch == 'yes'){
           this.$store.commit('setSourceInfo', {
           sourceUri: this.$store.state.sourceInfo.sourceUri,
           currentUri: '/dashboard/globalSearch/editInsurerUser',
           tempPath:this.$store.state.sourceInfo.tempPath
         });
         logHttp(this.$store.state.sourceInfo,'编辑保险公司人员',fetchPostUrlencoded);
         }
          break;
        case 3:
        if(this.opsObj.isGlobalSearch == 'yes'){
          console.log(this.opsObj);
            this.$store.commit('setSourceInfo', {
            sourceUri: this.$store.state.sourceInfo.sourceUri,
            currentUri: '/dashboard/globalSearch/editRepairerUser',
            tempPath:this.$store.state.sourceInfo.tempPath
          });
          logHttp(this.$store.state.sourceInfo,'编辑修理厂人员',fetchPostUrlencoded);
          }
          break;
      }


            if(this.$store.state.sourceInfo.tempPath == '/client/supplier'){
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/supplier/editSupplierUser',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'编辑配件商人员',fetchPostUrlencoded);
            }else if (this.$store.state.sourceInfo.tempPath == '/client/insurer') {
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/insurer/editInsurerUser',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'编辑保险公司人员',fetchPostUrlencoded);
            }else if (this.$store.state.sourceInfo.tempPath == '/client/repairer') {
              this.$store.commit('setSourceInfo', {
                sourceUri: this.$store.state.sourceInfo.sourceUri,
                currentUri: '/client/repairer/editRepairerUser',
                tempPath:this.$store.state.sourceInfo.tempPath
              });
              logHttp(this.$store.state.sourceInfo,'编辑修理厂人员',fetchPostUrlencoded);
            }

      }
    }
  },
  components:{
    'tips-model':tipsModel,
    'cus-sys-user-modal':cusSysUserModal,
    'cus-sys-user-edit':cusSysUserEdit
  },
  methods:{
    //控制弹框显示
    onChange(val) {
      this.tips = val;
    },
    //确定
    ensure(){
        let obj = {
          id:this.rowId,
          status:this.jqSts
        }
        fetchPostUrlencoded('/nxp-admin/systemUser/del',obj).then((res)=>{
          if(res.flag == 0){
            this.$emit('on-reload');
            tipsModal(res.msg,this.$Modal,'success');
          }
        })
    },
    reload(){
      this.$emit('on-reload');
    },
    change(page){
      this.$emit('change-page',page);
    },
    changeEditIshow(val){
      if(!val){
        setBodyAtt()
      }
      this.editIshow = val;
    },
    deleteOrgan(id,type,sts){
      this.btnType = type;
      this.rowId = id;
      this.jqSts = sts;
      this.tips = !this.tips;
    },
    addHandle(){
      this.addModalShow = !this.addModalShow;
    },
    onChangeUserModal(val){
      if(!val){
        setBodyAtt();
      }
      this.addModalShow = val;
    },
    editModal(row){
      this.rowObj = row;
      this.currentView = 'cus-sys-user-edit';
      this.$nextTick(function(){
        this.editIshow = !this.editIshow;
      })
    }
  },
  data(){
    return {
      tips:false,
      btnType:'',
      jqSts:0,
      addModalShow:false,
      currentView:'',
      editIshow:false,
      rowObj:{},
      columns:[
        {
          title: 'ID',
          align: 'left',
          key: 'id',
        },
        {
          title: '用户名',
          align: 'left',
          key: 'loginName',
        },
        {
          title: '姓名',
          align: 'left',
          key: 'name'
        },

        {
          title: '电话',
          align: 'left',
          key: 'phone'
        },
        {
          title: '性别',
          align: 'left',
          key: 'sex',
          render: (h, params) => {
                if(params.row.sex == 1){
                  return `女`;
                }else{
                  return `男`
                }
          }
        },{
          title: '职务',
          align: 'left',
          key: 'position'
        },
        {
          title: '注册时间',
          align: 'left',
          key: 'createTime',
          render: (h, params) => {
                if(params.row.createTime){
                  return `${getLocalTime(params.row.createTime)}`;
                }
          }
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          render: (h, params) => {
                if(params.row.status == 1){
                  return `禁用`;
                }else{
                  return `启用`
                }
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 130,
          render: (h, params) => {
                      if(params.row.status == 0){
                        return h('div', [
                          h('Button', {
                            props: {
                              type: 'text',
                              size: 'small'
                            },
                            on: {
                              click: () => {
                                this.deleteOrgan(params.row.id,'detain',1)
                              }
                            }
                          }, '禁用'),
                          h('Button', {
                            props: {
                              type: 'text',
                              size: 'small'
                            },
                            on: {
                              click: () => {
                                this.editModal(params.row)
                                // this.handleEdit(params.row)
                              }
                            }
                          }, '编辑')
                        ])
                      }else{
                        return h('div', [
                          h('Button', {
                            props: {
                              type: 'text',
                              size: 'small'
                            },
                            on: {
                              click: () => {
                                this.deleteOrgan(params.row.id,'awaken',0)
                              }
                            }
                          }, '启用')
                        ])
                      }

                    }
        },
      ],
    }
  }
}
</script>
<style>
  .ivu-modal-confirm-body-render{
    margin:16px -16px -24px;
  }
</style>
