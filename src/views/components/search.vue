<template>
  <div class="ivu-transfer-list-body-search-wrapper">
    <Input
        v-model="currentQuery"
        size="small"
        :icon="icon"
        :placeholder="placeholder"
        @on-click="handleClick"></Input>
  </div>
</template>

<script>


export default {
  props: {
      placeholder: String,
      query: String
  },
  data () {
      return {
          currentQuery: this.query
      };
  },
  watch: {
      query (val) {
          this.currentQuery = val;
      },
      currentQuery (val) {
          this.$emit('on-query-change', val);
      }
  },
  computed: {
      icon () {
          return this.query === '' ? 'ios-search' : 'ios-close';
      }
  },
  methods: {
      handleClick () {
          if (this.currentQuery === '') return;
          this.currentQuery = '';
          this.$emit('on-query-clear');
      }
  }
}
</script>
