<template>
  <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <div v-if="this.isAdd =='edit' " class="fix disabled-name">
        <Form-item label="全称" prop="fullName">
          <Input disabled v-model="formValidate.fullName"></Input>
        </Form-item>
      </div>
      <div v-else class="fix">
        <Form-item label="全称" prop="fullName">
          <Input v-model="formValidate.fullName"></Input>
        </Form-item>
      </div>
      <div class="fix">
        <Form-item label="固话">
          <Input v-model="formValidate.telphone" placeholder="非必填"></Input>
        </Form-item>
      </div>
      <div class="fix">
        <Form-item label="传真">
          <Input v-model="formValidate.fax" placeholder="非必填"></Input>
        </Form-item>
      </div>
      <div class="fix">
        <Form-item label="地址" prop="address">
          <Input v-model="formValidate.address" placeholder="非必填"></Input>
        </Form-item>
      </div>
      <div class="fix">
        <FormItem label="地区" prop="cusRegion">
					<Cascader v-model="formValidate.cusRegionArr" @on-change="setRegion" :data="region"></Cascader>
				</FormItem>
      </div>
      <div v-if="this.isAdd == 'edit' " class="fix">
        <FormItem label="状态" prop="status">
          <RadioGroup @on-change="statusChange" v-model="formValidate.status">
                <Radio label="0">正常</Radio>
                <Radio label="1">失效</Radio>
            </RadioGroup>
				</FormItem>
      </div>
      <template v-if="this.type == 2">
        <div class="fix">
          <FormItem label="结算方策略">
            <Select v-model="formValidate.insSettlementPolicy">
              <Option v-for="item in insSettlementPolicyArr" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="fix">
          <FormItem label="合作修理厂可选配置">
            <Select v-model="formValidate.insRepairerPolicy">
              <Option v-for="item in insRepairerPolicyArr" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
        </div>
      </template>
      <div v-if="this.type == 2 && this.isAdd =='edit'">
        <div class="fix">
          <FormItem label="销售">
            <Select v-model="formValidate.insSaleId">
              <Option v-for="item in insSale" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
        </div>
      </div>
      <div v-if="this.type == 3">
        <div class="fix">
          <FormItem label="坐标">
            <Row>
              <Col span="12" style="padding-right:10px;">
                  <Input v-model="formValidate.longitude" placeholder="请输入经度"></Input>
              </Col>
              <Col span="12">
                  <Input v-model="formValidate.latitude" placeholder="请输入纬度"></Input>
              </Col>
            </Row>
  				</FormItem>
          </div>
          <div class="fix">
            <FormItem label="支付方式" prop="payType">
              <Select v-model="formValidate.payType">
                  <Option value="0">现付</Option>
                  <Option value="1">月结</Option>
              </Select>
            </FormItem>
          </div>
          <div class="fix">
            <FormItem v-if="isParent" label="修理厂父级">
                <Dropdown @on-click="selectXlcParent" placement="top" trigger="custom" :visible="isSelectShow" style="width:300px">
                  <div class="select-parent">
                    <a style="display:block;width:100%" href="javascript:void(0)" @click="handleOpen">
                        {{selectName}}
                        <Icon style="float:right;margin-top:10px" type="arrow-down-b"></Icon>
                    </a>
                  </div>
                    <DropdownMenu slot="list">
                        <div style="padding:16px;">
                          <Input v-model="keyVal" @on-change="inputChange" placeholder="请输入修理厂名字进行检索"></Input>
                        </div>
                        <!-- <h3 style="padding-left:24px;">修理厂父级</h3> -->
                        <div style="height:150px;overflow:hidden;overflow-y:scroll">
                            <DropdownItem  name="">暂无</DropdownItem>
                            <div v-for="item in listHas" :key="item.id">
                              <DropdownItem  :name="item.id">{{item.fullName}}</DropdownItem>
                            </div>
                        </div>
                         <div style="text-align: right;margin:10px;">
                             <Button type="primary" @click="handleClose">关闭</Button>
                         </div>
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
            <FormItem v-else label="修理厂父级">
              （此修理厂有子修理厂）
            </FormItem>
          </div>
          <div class="fix">
            <FormItem label="订单结算方" prop="settlementStr">
              <select class="form-control" v-model='formValidate.settlementParty'>
                <option v-for="item in listPayData" :key="item.id" :value="item.id">{{item.fullName}}</option>
              </select>
            </FormItem>
          </div>
          <div class="fix">
            <FormItem label="客服">
              <Select v-model="formValidate.cusSerId">
                <Option v-for="item in customerService" :value="item.id" :key="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
          </div>
          <div class="fix">
            <FormItem label="销售">
              <Select v-model="formValidate.saleId">
                <Option v-for="item in saleArr" :value="item.id" :key="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
          </div>
      </div>
      <div v-if="this.type == 1 && this.isAdd == 'add' " class="fix">
        <Form-item label="评分" prop="supParArr">
          <Row>
            <Col span="4" v-for='val in markData' :key="val.id">
  						{{val.parameterName}}<br />
              <InputNumber size="large" :max="5" :min="0"  v-model='val.value'></InputNumber>
              <!-- <input type="text" class="form-control" style="margin: 10px 0 20px 0;" pattern="^[0-5]{1}|[0-5]{1}\.\d{2}$" v-model='val.value'/> -->
  					</Col>
          </Row>
        </Form-item>
      </div>
      <Form-item>
          <Button type="primary" :disabled="noDouble" @click="handleSubmit('formValidate')">确定</Button>
          <!-- <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
      </Form-item>
    </Form>
</template>

<script>
import { tipsModal } from '../../utils/common.js'
import { fetchGet, fetchPostUrlencoded } from '../../utils/requestHttp.js'
export default {
  props:{
    type:Number,
    isAdd:String,
    rowObj:{
      type:Object,
      default:{}
    }
  },
  watch:{
    fullNameChange(val){
      let _this = this;
      let payData = {
        id:0,
        fullName:''
      };
      if(this.isAdd == 'add'){
        if(val){
            payData.fullName = val;
            if(this.formValidate.parentId){
            }else{
              console.log("000");
              this.listPayData[0] = payData;
            }
          this.settlementName =  this.settlementName==''?val:this.settlementName;
        }else{
          this.listPayData.shift();
          // this.settlementName = '无';
        }
        this.formValidate.settlementStr = '123';
      }
    },
    getRowObj(val){}
  },
  created(){
    this.regionHttp();
    if(this.type == 1){
      this.supParHttp();
    }else if(this.type == 2){
      this.queryUserHttp();
    }else if(this.type == 3){
      this.queryUserHttp();
      this.listHasHttp();
    }
  },
  mounted(){},
  computed:{
    getFullName(){
      this.listHas.filter((item) => {
        if(name == item.id){
          return item.fullName
        }
      })
    },
    fullNameChange(){
      return this.formValidate.fullName
    },
    getRowObj(){
      if(this.rowObj.id){
        console.log(this.rowObj);
        this.formValidate.fullName = this.rowObj.fullName;
        this.formValidate.telphone = this.rowObj.telphone;
        this.formValidate.fax = this.rowObj.fax;
        this.formValidate.address = this.rowObj.address;
        this.formValidate.cusRegionArr = this.rowObj.region.split('-');
        this.formValidate.status = this.rowObj.status.toString();
        this.formValidate.cusRegion = this.rowObj.region.split('-').join();
        this.formValidate.insSaleId = this.rowObj.insSaleId;
        this.formValidate.insSettlementPolicy = this.rowObj.insSettlementPolicy;
        this.formValidate.insRepairerPolicy = this.rowObj.insRepairerPolicy;
        if(this.type == 3){
          if(this.rowObj.latitudeAndLongitude){
            this.formValidate.longitude = this.rowObj.latitudeAndLongitude.split(',')[1];
            this.formValidate.latitude = this.rowObj.latitudeAndLongitude.split(',')[0];
          }
          this.formValidate.payType = this.rowObj.payType.toString();
          this.formValidate.cusSerId = this.rowObj.countCustService;
          this.formValidate.saleId = this.rowObj.countSale;
          if(this.isAdd == 'edit'){
            this.setParent(this.rowObj.parentId);
          }
        }
      }
      return this.rowObj;
    }
  },
  methods:{
    setParent(pid){
      var _this = this;
      this.formValidate.settlementStr = '666';
      if(this.rowObj.settlementParty){
        this.tempListData = [];
        // let tempObj = {
        //   "id":this.rowObj.settlementParty,
        //   "fullName":this.rowObj.fullName
        // }
        let tempObj = {
          "id":this.rowObj.id,
          "fullName":this.rowObj.fullName
        }
        this.tempListData.push(tempObj);
        console.log(this.tempListData)
      }
      if((null!=pid || undefined!=pid) && 0!=pid){
        this.formValidate.parentId = pid;
        this.cusListPayHttp(pid);
        if(pid == 0 && this.rowObj.hasChild == 1){
          this.formValidate.settlementParty = this.rowObj.settlementParty;
          this.isParent = false;
          this.selectName = '无'
        }else if(pid == 0){
          this.selectName = '无'
          this.formValidate.settlementParty = this.rowObj.settlementParty;
        }else{
          this.formValidate.settlementParty = this.rowObj.settlementParty;
          this.isParent = true;
          if(this.listHas.length > 0){
              this.selectName = this.listHas.filter((item) => {
              if(pid == item.id){
                return item.fullName
              }
            })[0].fullName;
          }
        }
      }else{
        this.listPayData = [];
        this.formValidate.parentId = '';
        this.formValidate.settlementParty = this.rowObj.settlementParty;
        this.listPayData = this.listHas.filter((item) => {
              if(_this.rowObj.settlementParty == item.id){
                return true
              }
          })
      }
    },
    cusListPayHttp(pid){
      this.listPayData = [];
      var _this = this;
      fetchGet('/nxp-admin/cusOrganiztion/listPay/'+pid).then((res)=>{
        if(res.flag == 0){
          _this.listPayData = res.data;
          if(_this.isAdd == 'add'){
            var nowOfData = {
  						"id": 0,
  						"fullName": _this.formValidate.fullName
  					};
            if(_this.formValidate.fullName != ''){
              _this.listPayData.unshift(nowOfData);
            }
          }else{
            this.listPayData = this.listPayData.filter((item)=>{
              if(item.id != _this.tempListData[0].id){
                return item
              }
            })
            _this.listPayData.unshift(_this.tempListData[0]);
          }
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    formatCity(data) {
				for(var i = 0; i < data.length; i++) {
					if(data[i]['childNodes'] && data[i]['childNodes'].length > 0) {
						data[i]['children'] = this.formatCity(this.formatCity(data[i]['childNodes']));
					}
					data[i]['value'] = data[i]['id'];
					data[i]['label'] = data[i]['name'];
				}
				return data;
			},
      regionHttp(){
        fetchGet('/nxp-admin/region/all').then((res)=>{
          this.region = this.formatCity(res.data);
          if(this.type == 1){
            this.formValidate.supParArr = '666';
          }
        })
      },
      supParHttp(){
        fetchGet('/nxp-admin/sysOp/supPar').then((res)=>{
          if(res.data){
            this.markData = res.data.filter((item)=>{
              item.value = parseInt(item.value);
              return item;
            });
          }
        })
      },
      queryUserHttp(){
        fetchGet('/nxp-admin/serviceUser/queryUser').then((res)=>{
          if(res.data){
            this.customerService = res.data.customerService;
            this.saleArr = res.data.sale;
            this.insSale = res.data.insSale;
          }
        })
      },
      listHasHttp(){
        fetchPostUrlencoded('/nxp-admin/cusOrganiztion/listHas',{type:this.type}).then((res)=>{
          if(res.data){
            this.gdListHas = res.data;
            this.listHas = res.data;
          }
        })
      },
      handleSubmit(name){
        this.noDouble = true;
        this.$refs[name].validate((valid)=>{
          if(valid){
            var obj = {};
            obj.fullName = this.formValidate.fullName;
            obj.telphone = this.formValidate.telphone;
            obj.fax = this.formValidate.fax;
            obj.address = this.formValidate.address;
            obj.region = this.formValidate.cusRegionArr.join('-');
            obj.type = this.type;
            if(this.isAdd == 'edit'){
              obj.id = this.rowObj.id;
              obj.status = this.formValidate.status;
            }
            if(this.type == 1 && this.isAdd == 'add'){
              this.pfObj.SR_DEFAULT_SO_CR_PARTS_MATCHING = this.markData[0].value;
              this.pfObj.SR_DEFAULT_SO_CR_PARTS_QUALITY = this.markData[1].value;
              this.pfObj.SR_DEFAULT_SO_CR_SERVICE_QUALITY = this.markData[2].value;
              this.pfObj.SR_DEFAULT_SO_PR_BIDDING = this.markData[3].value;
              this.pfObj.SR_DEFAULT_SO_PR_EFFICIENCY = this.markData[4].value;
              this.pfObj.SR_DEFAULT_SO_PR_RESPONSIVENESS = this.markData[5].value;
              this.pfObj.SR_DEFAULT_SO_PR_SERVICE_QUALITY = this.markData[6].value;
              this.pfObj.SR_DEFAULT_SP_PR_GOODS_READINESS = this.markData[7].value;

              obj.SR_DEFAULT_SO_CR_PARTS_MATCHING  = this.pfObj.SR_DEFAULT_SO_CR_PARTS_MATCHING;
              obj.SR_DEFAULT_SO_CR_PARTS_QUALITY   = this.pfObj.SR_DEFAULT_SO_CR_PARTS_QUALITY;
              obj.SR_DEFAULT_SO_CR_SERVICE_QUALITY = this.pfObj.SR_DEFAULT_SO_CR_SERVICE_QUALITY;
              obj.SR_DEFAULT_SO_PR_BIDDING         = this.pfObj.SR_DEFAULT_SO_PR_BIDDING;
              obj.SR_DEFAULT_SO_PR_EFFICIENCY      = this.pfObj.SR_DEFAULT_SO_PR_EFFICIENCY;
              obj.SR_DEFAULT_SO_PR_RESPONSIVENESS  = this.pfObj.SR_DEFAULT_SO_PR_RESPONSIVENESS;
              obj.SR_DEFAULT_SO_PR_SERVICE_QUALITY = this.pfObj.SR_DEFAULT_SO_PR_SERVICE_QUALITY;
              obj.SR_DEFAULT_SP_PR_GOODS_READINESS = this.pfObj.SR_DEFAULT_SP_PR_GOODS_READINESS;
            }else if(this.type == 2){
              obj.insSettlementPolicy = this.formValidate.insSettlementPolicy;
              obj.insRepairerPolicy = this.formValidate.insRepairerPolicy;
            }else if(this.type == 2 && this.isAdd == 'edit'){
              obj.insSaleId = this.formValidate.insSaleId;
            }else if(this.type == 3){
              obj.longitude = this.formValidate.longitude;
              obj.latitude = this.formValidate.latitude;
              obj.payType = this.formValidate.payType;
              obj.settlementParty = this.formValidate.settlementParty;
              obj.saleId = this.formValidate.saleId;
              obj.cusSerId = this.formValidate.cusSerId;
              if(this.formValidate.parentId!='' || this.formValidate.parentId!=null || this.formValidate.parentId !=undefined){
                obj.parentId = this.formValidate.parentId;
              }
            }
            console.log(this.formValidate);
            if(this.isAdd == 'add'){
              fetchPostUrlencoded('/nxp-admin/cusOrganiztion/add',obj).then((res)=>{
                if(res.flag == 1){
                  tipsModal(res.msg,this.$Modal,'warning');
                  this.noDouble = false;
                }else if (res.flag == 0) {
                  this.noDouble = false;
                  this.$Message.success(res.msg);
                  this.$emit('on-close',res.data);
                }
              })
            }else if(this.isAdd == 'edit'){
              fetchPostUrlencoded('/nxp-admin/cusOrganiztion/update',obj).then((res)=>{
                if(res.flag == 1){
                  tipsModal(res.msg,this.$Modal,'warning');
                  this.noDouble = false;
                }else if (res.flag == 0) {
                  this.noDouble = false;
                  tipsModal(res.msg,this.$Modal,'success','lev1');
                  if(this.formValidate.status == '1'){
                    this.$emit('on-close','close');
                  }else{
                    this.$emit('on-close','show');
                  }
                }
              })
            }
          }else {
            this.noDouble = false;
            this.$Message.error('表单验证失败!');
          }
        })
      },
      setRegion(value){
        this.formValidate.cusRegion = value.join();
      },
      controlIsSelectShow(){
        this.isSelectShow = !this.isSelectShow;
      },
      handleOpen(){
        this.controlIsSelectShow();

      },
      handleClose(){
        this.isSelectShow = false;
      },
      vague(keyWord, data) {
        var list = data;
        var len = data.length;
        var arr = [];
        var reg = new RegExp(keyWord);
        for (var i = 0; i < len; i++) {
          //如果字符串中不包含目标字符会返回-1
            if (list[i].fullName.match(reg) || list[i].pinyin.match(reg)) {
              arr.push(list[i]);
            }
        }
        return arr;
      },
      inputChange(event){
        if (event.target.value != ''){
          this.listHas = this.vague(event.target.value,this.gdListHas);
        }else{
          this.listHas = this.gdListHas;
        }
      },
      selectXlcParent(name){
        if(name){
          this.formValidate.parentId = name;
          this.formValidate.settlementStr = '666';
          if(this.listHas.length > 0){
            // this.selectName
            var ss = this.listHas.filter((item) => {
              if(name == item.id && item.id!=undefined){
                return item
              }
            });
            this.selectName = ss[0].fullName;
          }
          this.formValidate.settlementParty = this.tempListData[0].id;
          this.cusListPayHttp(name);
        }else{
          if(this.formValidate.fullName){
            this.listPayData.splice(1,this.listPayData.length);
            this.formValidate.settlementParty = this.listPayData[0].id;
          }else{
            this.listPayData.splice(0,this.listPayData.length);
          }
          this.formValidate.parentId = "";
          this.selectName = '无';
        }
        this.controlIsSelectShow();
      },
      selectSettle(name){
        this.settlementName = this.listPayData.filter((item) => {
          if(name == item.id){
            return item.fullName
          }
        })[0].fullName;
        this.formValidate.settlementParty =  name;
        this.formValidate.settlementStr = '666';

      },
      statusChange(label){
        this.formValidate.status = label.toString();
      }
  },
  data(){
    const validateFullName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入全称'));
      }else{
        callback();
      }
    }
    const validateAddress = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入地址'));
      }else{
        callback();
      }
    }
    return {
      tempListData:[],
      noDouble:false,
      region:[],
      markData:[],
      isSelectShow:false,
      listHas:[],
      gdListHas:[],
      keyVal:'',
      selectName:'无',
      settlementName:'无',
      listPayData:[],
      customerService:[],
      isParent:true,
      saleArr:[],
      insSale:[],
      insSettlementPolicyArr:[
        {
          id:'I',
          name:'保验公司结算方'
        },
        {
          id:'R',
          name:'修理厂结算方'
        }
      ],
      insRepairerPolicyArr:[
        {
          id:'C',
          name:'可选'
        },
        {
          id:'N',
          name:'必选'
        }
      ],
      pfObj:{
        SR_DEFAULT_SO_CR_PARTS_MATCHING:'',
        SR_DEFAULT_SO_CR_PARTS_QUALITY:'',
        SR_DEFAULT_SO_CR_SERVICE_QUALITY:'',
        SR_DEFAULT_SO_PR_BIDDING:'',
        SR_DEFAULT_SO_PR_EFFICIENCY:'',
        SR_DEFAULT_SO_PR_RESPONSIVENESS:'',
        SR_DEFAULT_SO_PR_SERVICE_QUALITY:'',
        SR_DEFAULT_SP_PR_GOODS_READINESS:'',
      },
      formValidate: {
        fullName: '',
        telphone: '',
        fax: '',
        address: '',
        cusRegion:'',
        cusRegionArr: [],
        supParArr:'',
        longitude:'',
        latitude:'',
        payType:'',
        parentId:'',
        settlementParty:0,
        settlementStr:'',
        cusSerId:'',
        saleId:'',
        insSaleId:'',
        insSettlementPolicy:'R',
        insRepairerPolicy:'N',
        status:''
      },
      ruleValidate: {
        fullName: [{
          validator: validateFullName,
          trigger: 'blur',
          required: true,
        }],
        address: [{
          validator: validateAddress,
          trigger: 'blur',
          required: true,
        }],
        cusRegion: [{
							required: true,
							message: '地区不能为空',
							trigger: 'blur'
				}],
        supParArr: [{
							required: true,
							message: '评分不能为空',
							trigger: 'blur'
				}],
        payType: [{
          required: true,
          message: '请选择支付方式',
          trigger: 'change'
         }],
        settlementStr:[{
          required: true,
          message: '请选择订单结算方',
          trigger: 'change'
        }],
        status: [{
          required: true,
          message: '请选择状态',
          trigger: 'change'
        }],
      }
    }
  }
}
</script>
<style>
  .select-parent{
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    height: 32px;
    padding: 0 10px;
  }
  .form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
</style>
