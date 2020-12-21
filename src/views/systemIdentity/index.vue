<template>
  <div class="app-container">
  	 <div class="air-title h3">特性管理</div>
     <Button type="info" @click="add('')" icon="android-add">新增</Button>
     <Table
       style="margin-top:20px;"
       border :loading='load'
       highlight-row ref="currentRowTable"
       :columns="columns" :data="loadData">
     </Table>
     <cus-add-modal
       :title="title"
       @on-open-edit="openEdit"
       @on-reload="reloadData"
       @on-change="onChange"
       :row-obj="rowObj"
       :is-show="addModalShow">
     </cus-add-modal>
  </div>
</template>

<script>
import {fetchPostUrlencoded,fetchGet,fetchPostJson} from '../../utils/requestHttp.js'
import {removeBodyAtt,logHttp} from '../../utils/common.js'
import cusAddModal from './components/cusAddModal.vue'
export default {
  components:{
    'cus-add-modal':cusAddModal
  },
  mounted(){
    logHttp(this.$store.state.sourceInfo,'特性管理',fetchPostUrlencoded);
    this.txList();
  },
  methods:{
    add(id){
      this.addModalShow = true;
      if(id == ''){
        this.title = "新增";
        this.rowObj = null;
      }else{
        this.title = "编辑";
        this.rowObj = {};
        this.rowObj.id = id;
        // this.getQueryById(id);
      }

    },
    deleteTx(id){
      fetchPostJson('/nxp-admin/fun/delPremOrg',{id:id}).then((res)=>{
        if(res.flag == 0){
          this.$Message.success(res.msg);
          this.reloadData();
        }else{
          this.$Message.error(res.msg);
        }
      })
    },
    getQueryById(id){
      fetchPostJson('/nxp-admin/fun/premOrgById',{id:id}).then((res)=>{
        if(res.flag == 0){
          console.log(res.data);
          this.rowObj = res.data;
        }else{
          this.$Message.error(res.msg);
        }
      })
    },
    openEdit(){


    },
    txList(){
      fetchPostJson('/nxp-admin/fun/premOrgList',{}).then((res)=>{
        if(res.flag == 0){
          this.loadData = res.data;
        }else{
          this.$Message.error(res.msg);
        }
      })
    },
    reloadData(){
      this.txList();
    },
    onChange(val) {
      if(!val){
        removeBodyAtt();
      }
      this.addModalShow = val;
    },
  },
  data(){
    return {
      load:false,
      title:"",
      addModalShow:false,
      loadData:[],
      rowObj:null,
      columns:[
        {
          title: '名称',
          align: 'left',
          key: 'name',
        },
        {
          title: '适用范围',
          align: 'left',
          key: 'type',
          render(row, column, index) {
            if(column.row.type == 1){
              return `公开`;
            }else{
              return `受邀请`;
            }
					}
        },
        {
          title: '操作',
          render: (h, params) => {
                        return h('div', [
                          h('Button', {
                            props: {
                              type: 'text',
                              size: 'small'
                            },
                            on: {
                              click: () => {
                                this.add(params.row.id);
                              }
                            }
                          }, '编辑'),
                          h('Button', {
                            props: {
                              type: 'text',
                              size: 'small'
                            },
                            on: {
                              click: () => {
                                this.deleteTx(params.row.id);
                              }
                            }
                          }, '删除')
                        ])
                    }
        }
      ]
    }
  }
}
</script>
