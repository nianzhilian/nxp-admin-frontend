<template>
  <div class="ivu-transfer">
    <div :style="lstyle" class="ivu-transfer-list ivu-transfer-l">
      <div class="ivu-transfer-list-header">
          <!-- <Checkbox></Checkbox> -->
          <span style="font-size:15px;" class="ivu-transfer-list-header-title">{{ title[0] }}</span>
          <!-- <span class="ivu-transfer-list-header-count">{{ count }}</span> -->
      </div>
      <div class="ivu-transfer-list-body ivu-transfer-list-body-with-search ivu-transfer-list-body-with-footer">
        <slot name="ldata"></slot>
      </div>

    </div>
    <div class="ivu-transfer-operation ivu-transfer-m">
      <Button type="primary" size="small" :disabled="!rightActive" @click="moveToLeft">
          <Icon type="ios-arrow-left"></Icon> {{ operations[0] }}
      </Button>
      <Button type="primary" size="small" :disabled="!leftActive" @click="moveToRight">
          {{ operations[1] }} <Icon type="ios-arrow-right"></Icon>
      </Button>
    </div>
    <div :style="rstyle" class="ivu-transfer-list ivu-transfer-m">
      <div class="ivu-transfer-list-header">
          <!-- <Checkbox></Checkbox> -->
          <span style="font-size:15px;" class="ivu-transfer-list-header-title">{{ title[1] }}</span>
          <!-- <span class="ivu-transfer-list-header-count">{{ count }}</span> -->
      </div>
      <div class="ivu-transfer-list-body ivu-transfer-list-body-with-search ivu-transfer-list-body-with-footer">
        <slot name="rdata"></slot>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  props:{
    lstyle:Object,
    rstyle:Object,
    operations: Array,
    leftActive: Boolean,
    rightActive: Boolean,
    title: Array,
  },
  methods: {
        moveToLeft () {
          this.$emit('move-to-left','left');
        },
        moveToRight () {
          this.$emit('move-to-right','right');
        }
    }
}
</script>
