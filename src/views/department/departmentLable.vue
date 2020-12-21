<template>
  <div>
    <Form  :label-width="80">
      <FormItem label="标签">
        <Row>
          <Col span='6' v-for='val in tagIdsObj' :key="val.id">
          <CheckboxGroup v-model="tagIds">
            <Checkbox :label="val.id">{{val.name}}</Checkbox>
          </CheckboxGroup>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="subForm">更新</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import {
    md5,
    logHttp
  } from '../../utils/common.js'
  import {
    fetchPostUrlencoded,
    fetchGet
  } from '../../utils/requestHttp.js'
  import Ajax from '../../utils/ajax.js'
  export default {
    props: ['peopleId'],
    data() {
      return {
        tagIdsObj: [],
        tagIds: [],
      }
    },
    mounted() {
      this.getCheckRole();
    },
    created() {},
    watch: {},
    methods: {
      //获取默认标签
      getCheckRole() {
        Ajax.get("/nxp-admin/Tags").then((res) => { //获取所有角色
          if(res.code !== 200) {
            this.$Message.error(res.msg);
          } else {
            this.tagIdsObj = res.data;
            this.$Message.success(res.msg);
            Ajax.get("/nxp-admin/ServiceDepts/" + this.peopleId).then((res) => { //获取默认角色
              if(res.code !== 200) {
                this.$Message.error(res.msg);
              } else {
                this.tagIds = res.data.tagIds;
                this.$Message.success(res.msg);
              }
            });
          }
        });
      },
      //更新用户角色
      subForm() {
        Ajax.patch("/nxp-admin/ServiceDepts/"+this.peopleId+"/updateDeptTags",this.tagIds).then((res) => {
          if(res.code !== 200) {
            this.$Message.error(res.msg);
          } else {
            this.$Message.success(res.msg);
          }
        });
      },
    }
  }
</script>

<style>

</style>
