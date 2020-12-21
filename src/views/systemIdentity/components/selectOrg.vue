

<template>

<div class="">
    <Row style="margin:15px 0;">
        <Col span="24">
            <Input v-model="orgInput" @on-change="orgChange">
            <Button slot="append" icon="ios-search"></Button>
            </Input>
        </Col>
    </Row>
    <div class="ivu-table-wrapper">
      <div class="ivu-table ivu-table-border">
        <div class="ivu-table-header">
          <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
            <colgroup>
              <col width="60" />
              <col width="350" />
              <col width="" />
            </colgroup>
            <thead>
              <tr>
                <th><div class="ivu-table-cell"><Checkbox v-model="checkAll"></Checkbox></div></th>
                <th><div class="ivu-table-cell">名称</div></th>
                <th><div class="ivu-table-cell">地址</div></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="ivu-table-body" style="height: 200px;">
          <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
            <colgroup>
              <col width="60" />
              <col width="350" />
              <col width="" />
            </colgroup>
            <tbody>
              <tr v-for="(val,index) in orgData" :key="val.id">
                <td>
                  <div class="ivu-table-cell">
                    <Checkbox @on-change="checkFun(val.id,val.checked)" v-model="val.checked">
                    </Checkbox>
                  </div>
                </td>
                <td><div class="ivu-table-cell">{{ val.fullName }}</div></td>
                <td><div class="ivu-table-cell">{{ val.address }}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</div>

</template>

<script>
import {
    fetchGet
}
from '../../../utils/requestHttp.js'
export default {
    props:{
      show:Boolean,
      selectData:Array,
      tempOrgData1:{
        type:Array,
        default:[]
      },
      orgData1:{
        type:Array,
        default:[]
      },
      permFunction:{
        type:Array,
        default:[]
      }
    },
    mounted() {
            // this.getOrgAll();
        },
        watch:{
          selectData(val){
            if(val){
              this.checkUserData = val;
            }
          },
          tempOrgData1(val){
            if(val){
              this.tempOrgData = val;
            }
          },
          orgData1(val){
            this.orgData = val;
          },
          orgData(val){
            let count = 0;
            for(let i = 0;i<val.length;i++){
              if(val[i].checked == true){
                count++;
              }
            }
            if(count == val.length){
              this.checkAll = true;
              this.tempCheck = true;
            }else{
              this.checkAll = false;
              this.tempCheck = false;
            }
          },
          checkUserIds(val){
            for(let i = 0;i<this.tempOrgData.length;i++){
              if(val.indexOf(this.tempOrgData[i].id)>-1){
                this.tempOrgData[i].checked = true;
              }else{
                this.tempOrgData[i].checked = false;
              }
            }
          },
          checkUserData(val){
            let count = 0;
            let arr = val.map((item)=>{
              return item.id
            })
            for(let i = 0;i<this.orgData.length;i++){
              if(arr.indexOf(this.orgData[i].id)>-1){
                count++;
              }
            }
            if(count == this.orgData.length){
              this.checkAll = true;
            }else{
              this.checkAll = false;
            }
          },
          checkAll(val){
            if(val){
              for(let i = 0; i < this.orgData.length; i++) {
      					if(!(this.checkUserIds.indexOf(this.orgData[i].id)>-1)){
                  this.$set(this.orgData,i,{
                    address:this.orgData[i].address,
                    fullName:this.orgData[i].fullName,
                    pinyin:this.orgData[i].pinyin,
                    id:this.orgData[i].id,
                    checked:true
                  });
                  this.checkUserData.push(this.orgData[i]);
                  this.checkUserIds.push(this.orgData[i]['id']);
                }
      				}
            }else{
              if(this.tempCheck){
                for(let i = 0;i<this.orgData.length;i++){
                  for(let j = 0;j<this.checkUserIds.length;j++){
                    if(this.orgData[i].id == this.checkUserIds[j]){
                      this.$set(this.orgData,i,{
                        address:this.orgData[i].address,
                        fullName:this.orgData[i].fullName,
                        pinyin:this.orgData[i].pinyin,
                        id:this.orgData[i].id,
                        checked:false
                      });
                      this.checkUserData.splice(j, 1);
                      this.checkUserIds.splice(j,1);
                    }
                  }
                }
              }
            }
          },
          permFunction(val){
            if(val){
              this.checkUserIds = val.map((item)=>{
                return item.orgId;
              })
            }
          },
          show(val){
            this.$emit('change-org',this.checkUserData);
          }
        },
        methods: {
          checkFun(id, checked) {
    				for(var i = 0; i < this.orgData.length; i++) {
    					if(checked == true) {
    						if(this.orgData[i]['id'] == id) {
    							this.checkUserData.push(this.orgData[i]);
    							this.checkUserIds.push(this.orgData[i]['id']);
    						}
    					} else {
    						if(this.orgData[i]['id'] == id) {
    							var idx = this.checkUserIds.indexOf(id);
                  for(let j = 0;j<this.checkUserData.length;j++){
                    if(this.checkUserData[j].id == id){
                      this.checkUserData.splice(j,1);
                    }
                  }
    							this.checkUserIds.splice(idx, 1);
    						}
                this.checkAll = false;
                this.tempCheck = false;
    					}
    				}
    			},
                vague(keyWord, data) {
                    var list = data;
                    var len = data.length;
                    var arr = [];
                    var reg = new RegExp(keyWord);
                    for (var i = 0; i < len; i++) {
                        //如果字符串中不包含目标字符会返回-1
                        if (list[i].fullName.match(reg)) {
                            arr.push(list[i]);
                        } else if (list[i].pinyin.match(reg)) {
                            arr.push(list[i]);
                        }
                    }
                    return arr;
                },
                orgChange() {
                    this.orgData = this.vague(this.orgInput, this.tempOrgData);
                }
        },
        data() {
            return {
                height: 400,
                load: true,
                orgData: [],
                orgInput: '',
                tempOrgData: [],
                orgIds: [],
                checkOrg: [],
                checkUserData:[],
                checkUserIds:[],
                checkAll:false,
                tempCheck:true,
                columns4: [{
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    _disabled: true
                }, {
                    title: '组织名称',
                    key: 'fullName'
                }, {
                    title: '地址',
                    key: 'address'
                }],
            }
        }
}

</script>
