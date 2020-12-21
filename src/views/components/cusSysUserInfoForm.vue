<template>
  <div class="">
    <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <div v-if="this.isAdd == 'edit'" class="fix">
        <Form-item  label="用户名" prop="loginName">
          <Input disabled v-model="formValidate.loginName" placeholder="必填"></Input>
        </Form-item>
        <Form-item label="密码">
          <Input type="password" v-model="formValidate.passWord"></Input>
        </Form-item>
      </div>
      <div v-else class="fix">
        <Form-item  label="用户名" prop="loginName">
          <Input v-model="formValidate.loginName" placeholder="必填"></Input>
        </Form-item>
        <Form-item label="密码" prop="passWord">
          <Input type="password" v-model="formValidate.passWord" placeholder="必填"></Input>
        </Form-item>
      </div>
        <Form-item label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="必填"></Input>
        </Form-item>
        <Form-item label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="必填"></Input>
        </Form-item>
        <Form-item label="邮箱">
          <Input v-model="formValidate.email" placeholder="非必填"></Input>
        </Form-item>
        <Form-item label="性别" prop="sex">
          <Select @on-change="sexChange" v-model="formValidate.sex">
                <Option
                v-for="item in sexArr"
                :value="item.id"
                :label="item.name"
                 :key="item.id">
                    {{item.name}}
               </Option>
          </Select>
        </Form-item>
        <div v-if="type == 3" class="fix">
          <Form-item label="是否是维修顾问" prop="isAdvisor">
            <Select @on-change="advisorChange" v-model="formValidate.isAdvisor">
                  <Option value="0">是</Option>
                  <Option value="1">否</Option>
            </Select>
          </Form-item>
          <Form-item label="是否是收货人" prop="isConsignee">
            <Select @on-change="consigneeChange" v-model="formValidate.isConsignee">
              <Option value="0">是</Option>
              <Option value="1">否</Option>
            </Select>
          </Form-item>
        </div>
         <Form-item label="职务">
          <Input v-model="formValidate.position" placeholder="非必填"></Input>
        </Form-item>
        <Form-item label="QQ">
          <Input v-model="formValidate.qq" placeholder="非必填"></Input>
        </Form-item>
        <Form-item label="出生日期">
          <Input v-model="formValidate.birthDay" placeholder="非必填"></Input>
        </Form-item>
        <Form-item label="角色">
          <CheckboxGroup v-model="formValidate.roleCodeStr">
              <Checkbox v-for="item in role" :key="item.id" :label="item.id"><span>{{item.name}}</span></Checkbox>
            </CheckboxGroup>
        </Form-item>
        <div v-if="type == 2" class="fix">
          <Form-item label="是否是定损员" prop="isDamage">
            <Select @on-change="damageChange" v-model="formValidate.isDamage">
                  <Option v-for="item in damageArr" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
            <div v-if="isShowCos" style="margin-top:20px;" class="ivu-transfer insu-edit">
              <div style="width:100%;height:375px;" class="ivu-transfer-list ivu-transfer-l">
                <div class="ivu-transfer-list-header">
                    <span style="font-size:15px;" class="ivu-transfer-list-header-title">待选修理厂</span>
                </div>
                <div style="height:auto" class="ivu-transfer-list-body ivu-transfer-list-body-with-search ivu-transfer-list-body-with-footer">
                  <Search style="margin-bottom:10px"
                      :query="lquery"
                      @on-query-clear="LhandleQueryClear"
                      @on-query-change="LhandleQueryChange"
                      :placeholder="filterPlaceholder"></Search>
                      <!-- <div style="margin-top:5px;">
                        <Table ref="coselection" height="300" @on-selection-change="selectionChange" :columns="columns1" :data="cosList"></Table>
                      </div> -->
                      <div class="ivu-table-wrapper" style="margin-top:5px;">
                        <div class="ivu-table ivu-table-with-fixed-top">
                            <div class="ivu-table-body" style="height:285px">
                              <table class="cur-table" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                               <tbody class="ivu-table-tbody">
                                <tr @click.prevent="chk(item.xlcId)" v-for="item in cosList" :key="item.xlcId" class="ivu-table-row">

                                 <td class="">
                                  <div class="ivu-table-cell">
                                  <Checkbox :value="isSelected(item.xlcId)"></Checkbox>
                                   <span>{{item.xlcName}}</span>
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
          </Form-item>

        </div>
        <Form-item>
            <Button type="primary" :disabled="noDouble" @click="handleSubmit('formValidate')">确定</Button>
            <!-- <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
        </Form-item>
    </Form>
  </div>
</template>

<script>
import { fetchGet, fetchPostUrlencoded } from '../../utils/requestHttp.js'
import { md5,tipsModal } from '../../utils/common.js'
import Search from './search.vue';
export default {
  props:{
    type:Number,
    isAdd:String,
    rowObj:{
      type:Object,
      default:{}
    }
  },
  components:{
    Search
  },
  created(){
    if(this.type == 2){
      this.roleUrl = '/nxp-admin/role/all/C_I';
      this.cosListHttp();
    }else if (this.type == 3) {
      this.roleUrl = '/nxp-admin/role/all/C_R';
    }
  },
  mounted(){
    if(this.type == 2 && this.isAdd == 'edit'){
      this.damSysUser();
    }
    this.httpRole();
    if(this.isAdd == 'edit'){
      this.httpBySysId();
    }
  },
  computed:{
    getRowObj(){
      if(this.rowObj.id && this.isAdd == 'edit'){
        console.log(this.rowObj);
        this.formValidate.loginName = this.rowObj.loginName;
        this.formValidate.name = this.rowObj.name;
        this.formValidate.phone = this.rowObj.phone;
        this.formValidate.email = this.rowObj.email;
        this.formValidate.sex = this.rowObj.sex.toString();
        this.formValidate.qq = this.rowObj.qq;
        this.formValidate.birthDay = this.rowObj.birthDay;
        this.formValidate.position = this.rowObj.position;
        if(this.type == 2){
          this.formValidate.isDamage = this.rowObj.isDamage.toString();
          if(this.rowObj.isDamage == 0){
            this.isShowCos = true;
          }else{
            this.isShowCos = false;
          }
        }else if(this.type == 3){
          this.formValidate.isAdvisor = this.rowObj.isAdvisor.toString();
          this.formValidate.isConsignee = this.rowObj.isConsignee.toString();
        }
      }
      return this.rowObj;
    },
  },
  watch:{
    getRowObj(val){},
  },
  methods:{
    httpRole(){
      fetchGet(this.roleUrl).then((res)=>{
        if(res.flag == 0){
          this.role = res.data;
        }
      })
    },
    chk(id){
      let index = this.chkArr.indexOf(id);
      index > -1?this.chkArr.splice(index,1):this.chkArr.push(id);
      console.log(this.chkArr);
    },
    isSelected(id){
      return this.chkArr.indexOf(id) > -1
    },
    //保险公司组织关系列表
    cosListHttp(){
      let orgId;
      if(this.isAdd == 'edit'){
        orgId = this.rowObj.orgId;
      }else{
        orgId = this.rowObj.id;
      }
      fetchGet('/nxp-admin/cos/list/'+orgId).then((res)=>{
        if(res.flag == 0){
          this.cosData = res.data;
          this.cosList = res.data;
        }else{
          this.$Message.error({
            content:res.msg
          })
        }
      })
    },
    //保险公司所属修理厂定损员
    damSysUser(){
      fetchGet('/nxp-admin/systemUser/damBySysId/'+this.rowObj.id).then((res)=>{
        if(res.flag == 0){
          this.chkArr = res.data.map(item=>item.xlcId);
        }else{
          this.$Message.error({
            content:res.msg
          })
        }
      })
    },
    LhandleQueryClear(){
      this.lquery = '';
    },
    LhandleQueryChange(val){
      this.lquery = val;
      this.cosList = this.vague(val,this.cosData);
    },
    selectionChange(selection){
      this.formValidate.xlcIds = (selection.map(item=>item.xlcId)).join();
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
        }
      }
      return arr;
    },
    httpBySysId(){
      fetchGet('/nxp-admin/systemUser/bySysId/'+this.rowObj.id).then((res)=>{
        if(res.flag == 0){
          this.formValidate.roleCodeStr = res.data.userRole.map(item=>item.roleId);
        }
      })
    },
    opeDom(){
      let pDom = document.getElementsByClassName("v-transfer-dom");
      let lastDom = pDom[pDom.length-1];
      let fc = lastDom.firstChild;
      let lc = lastDom.lastChild;
      fc.style.zIndex = 1100;
      lc.style.zIndex = 1100;
    },
    sexChange(value){
      this.formValidate.sex = value;
    },
    advisorChange(value){
      this.formValidate.isAdvisor = value;
    },
    consigneeChange(value){
      this.formValidate.isConsignee = value;
    },
    damageChange(value){
      if(value == 0){
        this.isShowCos = !this.isShowCos;
      }else{
        this.isShowCos = false;
      }
    },
    handleSubmit(name){
      this.noDouble = true;
      console.log(this.rowObj)
      this.$refs[name].validate((valid)=>{
        if(valid){
          var obj = {};
          if(this.isAdd !='edit'){
            obj.orgId = this.rowObj.id;
            obj.loginName = this.formValidate.loginName;
            this.url = '/nxp-admin/systemUser/add';
            obj.orgName = this.rowObj.fullName;
          }else{
            obj.id = this.rowObj.id;
            obj.orgId = this.rowObj.orgId;
            this.url = '/nxp-admin/systemUser/update';
            obj.orgName = this.rowObj.orgName;
          }
          if(this.formValidate.passWord!=''){
            obj.passWord = (md5(this.formValidate.passWord)).toUpperCase();
          }else{
            obj.passWord = '';
          }
          obj.name = this.formValidate.name;
          obj.phone = this.formValidate.phone;
          obj.email = this.formValidate.email;
          obj.position = this.formValidate.position;
          obj.type = this.type;
          obj.sex = parseInt(this.formValidate.sex);
          obj.qq = this.formValidate.qq;
          obj.birthDay = this.formValidate.birthDay;
          if(this.formValidate.roleCodeStr){
            obj.roleCodeStr = (this.formValidate.roleCodeStr).join();
          }
          obj.isAdvisor = 1;
          obj.isConsignee = 1;
          if(this.type == 1){
            obj.isDamage = 1;
          }
          if(this.type == 2){
            obj.isDamage = this.formValidate.isDamage;
            if(this.formValidate.isDamage == 0){
              obj.xlcIds = this.chkArr.join();
            }else{
              obj.xlcIds = this.formValidate.xlcIds;
            }
          }else if(this.type == 3){
            obj.isAdvisor = this.formValidate.isAdvisor;
            obj.isConsignee = this.formValidate.isConsignee;
            obj.isDamage = 1;
          }else{
            obj.xlcIds = this.formValidate.xlcIds;
          }
          fetchPostUrlencoded(this.url,obj).then((res)=>{
            if(res.flag == 0){
              tipsModal(res.msg,this.$Modal,'success','lev1');
              this.opeDom();
              this.$emit('on-close');
              this.noDouble = false;
            }else{
              tipsModal(res.msg,this.$Modal,'warning','lev1');
              this.opeDom();
              this.noDouble = false;
            }
          })
        }else{
          this.noDouble = false;
          this.$Message.error('表单验证失败!');
        }
      })
    }
  },
  data(){
    const validateLoginName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'));
      }else{
        callback();
      }
    }
    const validatePassWord = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'));
      }else{
        callback();
      }
    }

    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入姓名'));
      }else{
        callback();
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入电话'));
      }else{
        callback();
      }
    }
    return {
      noDouble:false,
      role:[],
      roleUrl:'/nxp-admin/role/all/C_A',
      lquery:'',
      cosData:[],
      cosList:[],
      chkArr:[],
      isShowCos:false,
      filterPlaceholder:'请输入修理厂名称',
      sexArr:[{
        id:'0',
        name:'男'
      },
      {
        id:'1',
        name:'女'
      }],
      damageArr:[
        {
          id:'0',
          name:'是'
        },
        {
          id:'1',
          name:'否'
        }
      ],
      url:'/nxp-admin/systemUser/add',
      formValidate:{
        loginName:'',
        passWord:'',
        name:'',
        phone:'',
        email:'',
        sex:'0',
        qq:'',
        birthDay:'',
        roleCodeStr:[],
        isAdvisor:'',
        isConsignee:'',
        isDamage:'',
        xlcIds:'',
        position:''
      },
      ruleValidate:{
        loginName: [{
          validator: validateLoginName,
          trigger: 'blur',
          required: true,
        }],
        passWord: [{
          validator: validatePassWord,
          trigger: 'blur',
          required: true,
        }],
        name: [{
          validator: validateName,
          trigger: 'blur',
          required: true,
        }],
        phone: [{
          validator: validatePhone,
          trigger: 'blur',
          required: true,
        }],
        sex: [{
          message: '请选择性别',
          trigger: 'change',
          required: true,
        }],
        isDamage:[{
          message: '请选择是否是定损员',
          trigger: 'change',
          required: true,
        }],
        isAdvisor:[{
          message: '请选择是否是维修顾问',
          trigger: 'change',
          required: true,
        }],
        isConsignee:[{
          message: '请选择是否是收货人',
          trigger: 'change',
          required: true,
        }]
      },
      columns1:[
        {
              type: 'selection',
              width: 60,
              align: 'center'
       },
       {
             title: '名称',
             key: 'xlcName'
      },
      ]
    }
  }
}
</script>
<style>

  .insu-edit .ivu-table-wrapper{
    border:0;
    border-top: 1px solid #dddee1
  }
.insu-edit  .ivu-table:after, .supp-edit .ivu-table:before{
  background: none;
  }
.insu-edit  .ivu-transfer-list{
  padding-top: 40px;
}
.insu-edit .ivu-input-wrapper-small .ivu-input-icon{
  line-height: 24px;
}
</style>
