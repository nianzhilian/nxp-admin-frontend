<style>
.tx-div .hui{
  color: #bbbec4;
}


</style>

<template>

<div class="tx-div">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="名称" prop="name">
            <Input v-model="formValidate.name"></Input>
        </Form-item>
        <!-- <Form-item label="生效日期" prop="billTime">
          <Date-picker v-model="formValidate.billTime" type="date" placeholder="选择日期" style="width: 100%"></Date-picker>
        </Form-item> -->
        <Form-item label="权限" prop="qx">
          <Button @click="editRole" type="ghost">编辑</Button>
          <div v-if="sarr.length == 0">
            暂无内容
          </div>
          <div v-else class="role-list" v-for="val in sarr">
              <Row>
                  <Col class="air-space" span='24'>{{val.name}}</Col>
              </Row>
              <div v-for="info in val.childNodes" :key="info.id" style="margin-left: 10px;">
                  <Row class="row role-content">
                      <Col :class-name="info.color" span="12">
                          {{info.code}} {{info.name}}
                          <!-- <CheckboxGroup v-model="formValidate.subFunids">
                              {{info.color}}<Checkbox :label="info.id">{{info.code}} {{info.name}}</Checkbox>
                          </CheckboxGroup> -->
                      </Col>
                  </Row>
                  <Row>
                      <Col span="11" v-for="item in info.childNodes" :key="info.childNodes.id" style="margin-left: 20px;">
                          {{item.code}} {{item.name}}
                          <!-- <CheckboxGroup v-model="formValidate.subFunids">
                              <Checkbox :label="item.id">{{item.code}} {{item.name}}</Checkbox>
                          </CheckboxGroup> -->
                      </Col>
                  </Row>
              </div>
          </div>
        </Form-item>
        <FormItem label="是否">
            <RadioGroup  v-model="formValidate.radio">
                <Radio label="1">公开</Radio>
                <Radio label="2">受邀请</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem :label='yxNum' v-if="formValidate.radio != '1'">
          <Button @click="editOrg" type="ghost">编辑</Button>
          <Table style="margin-top:15px;width:100%" height="250" border ref="selection" :columns="columns1" :data="selectOrgData"></Table>
        </FormItem>
        <Form-item>
            <Button type="primary" :disabled="noDouble" @click="handleSubmit('formValidate')">确定</Button>
            <!-- <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
        </Form-item>
    </Form>
    <Modal v-model="isShowRole" title="权限" width="800">
        <div class="role-list" v-for="val in groupArray">
            <Row>
                <Col class="air-space" span='24'>{{val.name}}</Col>
            </Row>
            <div v-for="info in val.childNodes" :key="info.id" style="margin-left: 10px;">
                <Row class="row role-content">
                    <Col span="12">
                        <CheckboxGroup v-model="formValidate.subFunids">
                            <Checkbox :label="info.code">{{info.code}} {{info.name}}</Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span="11" v-for="item in info.childNodes" :key="info.childNodes.id" style="margin-left: 20px;">
                        <CheckboxGroup v-model="formValidate.subFunids">
                            <Checkbox :label="item.code">{{item.code}} {{item.name}}</Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
            </div>
        </div>
        <Row>
          <Col span="3" :offset="21">
            <Button type="primary"  @click="closeRole" long>确定并关闭</Button>
          </Col>
        </Row>
        <div slot="footer">
            <!-- <Button type="ghost" @click="closeRole" style="width:100%" size="large">关闭</Button> -->
        </div>
    </Modal>
    <Modal v-model="isShowOrg" title="组织列表" width="800">
        <!-- <Button type="info">确定</Button> -->
      <select-org
        :perm-function="permFunctionExtend"
        :select-data="selectOrgData"
        :org-data1="tempOrgData"
        :temp-org-data1="tempOrgData"
        :show="isShowOrg"
        @change-org="changeOrg">
      </select-org>
      <br/>
      <Row>
        <Col span="3" :offset="21">
          <Button type="primary"  @click="closeOrg" long>确定并关闭</Button>
        </Col>
      </Row>
        <div slot="footer">
            <!-- <Button type="ghost" @click="closeOrg" style="width:100%" size="large">关闭</Button> -->
        </div>
    </Modal>
</div>

</template>

<script>
import { tipsModal } from '../../../utils/common.js'
import {
    fetchGet,
    fetchPostJson
}
from '../../../utils/requestHttp.js'
import selectOrg from './selectOrg.vue'
export default {
    props: {
        type: Number,
        opsObj: {
            type: Object,
            default: {}
        },
        title:String,
    },
    components: {
        'select-org': selectOrg
    },
    watch: {
      // rowObj(val){
      //   if(val){
      //     // this.isShowOrg = false;
      //     // this.formValidate.name = val.name;
      //     // this.formValidate.radio = val.type.toString();
      //     // this.permFunctionExtend = val.permFunctionExtend;
      //   }
      // },
      title(val){
        alert(888);
        console.log(val);
        this.modelTitle = val;
      },
      permFunctionPack(val){
        this.formValidate.subFunids = val.map((item)=>{
          return parseInt(item.permFunction);
        })
        this.getTempRole();
      },
      isShowRole(val){
        var _that = this;
        var groupArray = this.groupArray;
        var firstChild = [];
        var firobj = {childNodes:[],title:''};
        var secondChild = [];
        var secondobj = {};
        if(_that.formValidate.subFunids.length>0){
          _that.formValidate.qx = '123';
        }else{
          _that.formValidate.qx = '';
        }
        for(var i = 0;i<groupArray.length;i++){
          var childNodes = groupArray[i].childNodes;
          for(var j = 0;j<childNodes.length;j++){
            var nodes = childNodes[j].childNodes;
            var tempFlag = false;
            var flag = false;
            if(_that.formValidate.subFunids.indexOf(childNodes[j].code)>-1){
                tempFlag = true;
            }
            firobj.childNodes = [];
              if(nodes){
                for(var m = 0;m<nodes.length;m++){
                  if(_that.formValidate.subFunids.indexOf(nodes[m].code)>-1){
                      flag = true;
                      secondobj.pid = childNodes[j].id;
                      secondobj.code = nodes[m].code;
                      secondobj.id = nodes[m].id;
                      secondobj.name = nodes[m].name;
                      secondobj.color = "bai";
                      firobj.childNodes.push(JSON.parse(JSON.stringify(secondobj)));
                      secondChild.push(JSON.parse(JSON.stringify(secondobj)));
                  }
                }
              }
              firobj.code = childNodes[j].code;
              firobj.id = childNodes[j].id;
              firobj.name = childNodes[j].name;
              firobj.title = groupArray[i].name;
              if(tempFlag){
                firobj.color = "bai";
                firstChild.push(JSON.parse(JSON.stringify(firobj)));
              }else{
                if(flag){
                  firobj.color = "hui";
                  firstChild.push(JSON.parse(JSON.stringify(firobj)));
                }
              }
          }
        }
        this.roleResArr = firstChild;
      },
      roleResArr(val){
        let arr = [];
        this.snames = [];
        var _that = this;
        let obj = {
          childNodes:[],
          title:''
        }
        if(val.length>0){
          for(var i = 0;i<val.length;i++){
            if(!(_that.snames.indexOf(val[i].title)>-1)){
              _that.snames.push(val[i].title);
            }
          }
        }
      },
      snames(val){
        let sarr = [];
        let _that = this;
        let arr = [];
        if(val){
          for(var i = 0;i<val.length;i++){
            arr = [];
            for(var j = 0;j<_that.roleResArr.length;j++){
              if(val[i] == _that.roleResArr[j].title){
                arr.push(_that.roleResArr[j]);
              }
            }
            sarr.push({
              name: val[i],
              childNodes: arr,
            });
          }
          this.sarr = sarr;
        }
      }
    },
    computed:{
      yxNum(){
          let num = 0;
          if(this.selectOrgData){
            num = this.selectOrgData.length;
          }
          let str = "已选组织" + "("+num+")";
          return str;
      }
    },
    mounted(){
      // this.getOrgAll();
      if(this.opsObj){
        this.getQueryById(this.opsObj.id);
      }
      // this.getRole();
    this.formValidate.billTime = new Date();
  },
    methods: {
      getTempRole(){
        var _that = this;
        var groupArray = this.groupArray;
        var firstChild = [];
        var firobj = {childNodes:[],title:''};
        var secondChild = [];
        var secondobj = {};
        if(_that.formValidate.subFunids.length>0){
          _that.formValidate.qx = '123';
        }else{
          _that.formValidate.qx = '';
        }
        for(var i = 0;i<groupArray.length;i++){
          var childNodes = groupArray[i].childNodes;
          for(var j = 0;j<childNodes.length;j++){
            var nodes = childNodes[j].childNodes;
            var tempFlag = false;
            var flag = false;
            if(_that.formValidate.subFunids.indexOf(childNodes[j].code)>-1){
                tempFlag = true;
            }
            firobj.childNodes = [];
              if(nodes){
                for(var m = 0;m<nodes.length;m++){
                  if(_that.formValidate.subFunids.indexOf(nodes[m].code)>-1){
                      flag = true;
                      secondobj.pid = childNodes[j].id;
                      secondobj.code = nodes[m].code;
                      secondobj.id = nodes[m].id;
                      secondobj.name = nodes[m].name;
                      secondobj.color = "bai";
                      firobj.childNodes.push(JSON.parse(JSON.stringify(secondobj)));
                      secondChild.push(JSON.parse(JSON.stringify(secondobj)));
                  }
                }
              }
              firobj.code = childNodes[j].code;
              firobj.id = childNodes[j].id;
              firobj.name = childNodes[j].name;
              firobj.title = groupArray[i].name;
              if(tempFlag){
                firobj.color = "bai";
                firstChild.push(JSON.parse(JSON.stringify(firobj)));
              }else{
                if(flag){
                  firobj.color = "hui";
                  firstChild.push(JSON.parse(JSON.stringify(firobj)));
                }
              }
          }
        }
        this.roleResArr = firstChild;
      },
      getOrgAll() {
              fetchGet('/nxp-admin/cusOrganiztion/all').then((res) => {
                this.selectOrgData = [];
                  if (res.flag !== 0) {
                      this.tempbool = true;
                      this.$Message.error(res.msg);
                  } else {
                      this.tempbool = false;
                      this.load = false;
                      this.tempOrgData = res.data;
                      this.orgData1 = this.tempOrgData;
                      if(this.opsObj){
                        let orgids = this.permFunctionExtend.map((item)=>{
                          return item.orgId;
                        })

                        for(let i = 0;i<this.tempOrgData.length;i++){
                          this.$set(this.tempOrgData,i,{
                            address:this.tempOrgData[i].address,
                            fullName:this.tempOrgData[i].fullName,
                            pinyin:this.tempOrgData[i].pinyin,
                            id:this.tempOrgData[i].id,
                            checked:false
                          });
                          if(orgids.indexOf(this.tempOrgData[i].id)>-1){
                            this.$set(this.tempOrgData,i,{
                              address:this.tempOrgData[i].address,
                              fullName:this.tempOrgData[i].fullName,
                              pinyin:this.tempOrgData[i].pinyin,
                              id:this.tempOrgData[i].id,
                              checked:true
                            });
                            this.selectOrgData.push(this.tempOrgData[i]);
                          }
                        }
                        // this.getQueryById(this.opsObj.id);
                      }else{
                        for(let i = 0;i<this.tempOrgData.length;i++){
                          this.$set(this.tempOrgData,i,{
                            address:this.tempOrgData[i].address,
                            fullName:this.tempOrgData[i].fullName,
                            pinyin:this.tempOrgData[i].pinyin,
                            id:this.tempOrgData[i].id,
                            checked:false
                          });
                        }
                      }
                  }
              });
          },
          getQueryById(id){
            fetchPostJson('/nxp-admin/fun/premOrgById',{id:id}).then((res)=>{
              this.selectOrgData = [];
              this.orgData1 = [];
              if(res.flag == 0){
                this.formValidate.name = res.data.name;
                this.formValidate.radio = res.data.type.toString();
                this.permFunctionExtend = res.data.permFunctionExtend;
                // this.permFunctionPack = res.data.permFunctionPack;
                let orgids = res.data.permFunctionExtend.map((item)=>{
                  return item.orgId;
                })
                this.getRole(res.data.permFunctionPack);
                // for(let i = 0;i<this.tempOrgData.length;i++){
                //   this.$set(this.tempOrgData,i,{
                //     address:this.tempOrgData[i].address,
                //     fullName:this.tempOrgData[i].fullName,
                //     pinyin:this.tempOrgData[i].pinyin,
                //     id:this.tempOrgData[i].id,
                //     checked:false
                //   });
                //   if(orgids.indexOf(this.tempOrgData[i].id)>-1){
                //     this.$set(this.tempOrgData,i,{
                //       address:this.tempOrgData[i].address,
                //       fullName:this.tempOrgData[i].fullName,
                //       pinyin:this.tempOrgData[i].pinyin,
                //       id:this.tempOrgData[i].id,
                //       checked:true
                //     });
                //     this.selectOrgData.push(this.tempOrgData[i]);
                //   }
                // }
                if(res.data.permFunctionExtend.length>0){
                  for(let i = 0;i<res.data.permFunctionExtend.length;i++){
                    res.data.permFunctionExtend[i].fullName = res.data.permFunctionExtend[i].orgName;
                    res.data.permFunctionExtend[i].address = res.data.permFunctionExtend[i].orgAddress;
                    res.data.permFunctionExtend[i].id = res.data.permFunctionExtend[i].orgId;
                    this.selectOrgData.push(res.data.permFunctionExtend[i]);
                  }
                }
                // this.selectOrgData = res.data.permFunctionExtend;
              }else{
                this.$Message.error(res.msg);
              }
            })
          },
      handleSubmit(name){
        var _that = this;
        this.noDouble = true;
          this.$refs[name].validate((valid)=>{
            if(valid){
              let orgIds = "";
              let ids = _that.selectOrgData.map((item)=>{
                return item.id
              })
              if(_that.formValidate.radio == '1'){
                orgIds = '';
              }else{
                orgIds = ids.join();
              }
              if(this.title == "新增"){
                console.log(_that.formValidate.subFunids.length>0)
                fetchPostJson('/nxp-admin/fun/addPremOrg',{
                  name:_that.formValidate.name,
                  type:_that.formValidate.radio,
                  permFunctions:_that.formValidate.subFunids.length>0 ? _that.formValidate.subFunids.join():'',
                  orgIds:orgIds,
                  id:'',
                  status:1
                }).then((res)=>{
                  if(res.flag == 1){
                    tipsModal(res.msg,this.$Modal,'warning');
                    this.noDouble = false;
                  }else if (res.flag == 0) {
                    this.noDouble = false;
                    this.$Message.success(res.msg);
                    this.$emit('on-close');
                  }
                })
              }else{
                fetchPostJson('/nxp-admin/fun/addPremOrg',{
                  name:_that.formValidate.name,
                  type:_that.formValidate.radio,
                  permFunctions:_that.formValidate.subFunids.length>0 ? _that.formValidate.subFunids.join():'',
                  orgIds:orgIds,
                  id:this.opsObj.id,
                  status:1
                }).then((res)=>{
                  if(res.flag == 1){
                    tipsModal(res.msg,this.$Modal,'warning');
                    this.noDouble = false;
                  }else if (res.flag == 0) {
                    this.noDouble = false;
                    this.$Message.success(res.msg);
                    this.$emit('on-close');
                  }
                })
              }
            }else {
              this.noDouble = false;
              this.$Message.error('表单验证失败!');
            }
          })
      },
        changeOrg(val) {
          this.selectOrgData = val;
            },
            getRole(ppack) {
                fetchGet('/nxp-admin/fun/all/' + 'C_A').then((res) => {
                    if (res.flag !== 0) {
                        this.$Message.error(res.msg);
                    } else {
                        for (var i = 0; i < res.data.length; i++) {
                            var index = this.groupName.indexOf(res.data[i]['group']);
                            if (index == -1) {
                                this.groupName.push(res.data[i]['group']);
                                this.groupArray.push({
                                    'name': res.data[i]['group'],
                                    'childNodes': [res.data[i]]
                                });
                            } else {
                                this.groupArray[index]['childNodes'].push(res.data[i]);
                            }
                        }
                        if(ppack){
                          this.permFunctionPack = ppack;
                        }
                    }
                });
            },
            closeRole() {
                this.isShowRole = !this.isShowRole;
            },
            closeOrg() {
                this.isShowOrg = !this.isShowOrg;
            },
            editRole() {
                this.isShowRole = true;
                this.groupArray = [];
    						this.groupName = []; //每次选择时质空
                this.getRole();
            },
            editOrg() {
                this.isShowOrg = true;
                if(this.tempbool){
                  this.getOrgAll();
                }
            }
    },
    data() {
        return {
            isShowRole: false,
            isShowOrg: false,
            groupName: [],
            snames:[],
            sarr:[],
            groupArray: [],
            tempGroup:[],
            selectOrgData:[],
            roleResArr:[],
            permFunctionExtend:[],
            permFunctionPack:[],
            orgData1:[],
            tempOrgData:[],
            modelTitle:'',
            tempbool:true,
            columns1: [{
                title: '组织名称',
                key: 'fullName'
            }, {
                title: '地址',
                key: 'address'
            }],
            noDouble: false,
            formValidate: {
                name: '',
                radio: '1',
                billTime: '',
                funids: [], //存放权限数据
  							subFunids: [], // 最后选中ID
                qx:''
            },
            ruleValidate: {
                name: [{
                    required: true,
                    message: '名称不能为空',
                    trigger: 'blur'
                }],
                qx:[{
                    required: true,
                    message: '权限不能为空',
                    trigger: 'change'
                }],
                billTime: [{
                  required: true,
                  type: 'date',
                  message: '请选择日期',
                  trigger: 'change'
                }]
            }
        }
    }
}

</script>
