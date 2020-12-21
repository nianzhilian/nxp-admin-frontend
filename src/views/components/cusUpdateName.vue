<template>
  <Modal
        v-model="myShow"
        title="修改名称"
        >
        <div v-if="myShow">
          <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <div class="fix disabled-name">
              <Form-item label="名称">
                <Input disabled v-model="rowObj.fullName"></Input>
              </Form-item>
            </div>
            <div class="fix">
              <Form-item label="新名称" prop="fullName">
                <Input v-model="formValidate.fullName"></Input>
              </Form-item>
            </div>
            <Form-item>
                <Button type="primary" :disabled="noDouble" @click="handleSubmit('formValidate')">确定</Button>
                <!-- <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
            </Form-item>
          </Form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="close" style="width:100%" size="large">关闭</Button>
      </div>
    </Modal>
</template>
<!--  orgId:80066620
name:天津市宝坻区精天诚汽车修理厂1-->
<script>
import { fetchPostUrlencoded } from '../../utils/requestHttp.js'

export default {
  props:{
    isShow: {
      type: Boolean,
      default: false
    },
    rowObj:Object
  },
  watch: {
    isShow(val) {
      this.myShow = val;
    },
    myShow(val) {
      if(val){
        this.formValidate.fullName = '';
      }
      this.$emit('on-change', val);
    }
  },
  methods:{
    close(){
      this.myShow = !this.myShow;
    },
    handleSubmit(name){
      this.$refs[name].validate((valid)=>{
        this.$emit('on-update-name',this.formValidate.fullName);
      })
    }
  },
  data(){
    const validateFullName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入名称'));
      }else{
        callback();
      }
    }
    return {
      myShow:this.isShow,
      oldFullName:'',
      noDouble:false,
      formValidate:{
        fullName:''
      },
      ruleValidate:{
        fullName: [{
          validator: validateFullName,
          trigger: 'blur',
          required: true,
        }]
      }
    }
  }
}
</script>
<style>
  .disabled-name .ivu-input[disabled]{
    color: #666;
  }
  .abc
  {

  }
</style>
