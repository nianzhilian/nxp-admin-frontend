<template>
  <div>
    <Button @click="getCustomers">loading</Button>
  </div>
</template>
<script>
  export default {
    methods: {
      getCustomers: function() {
        this.$http({
          url: '/nxp-crm/setting/query',
          method:'GET',
          headers: {
          'token': 'P/JoJdBk9SDtayELn3YBv6B0Geyv8+VGny+d7VQHj5n7sDS1hx4VRRQPhs0dL5DuMxkaOtezE0I='
          }
        }).then(function(res){
          console.log(res)
        }).catch(function(err){
          console.log(err)
        })

// this.$http({
//          url: '/nxp-crm/setting/edit',
//          method:'POST',
//          headers: {
//          'token': 'P/JoJdBk9SDtayELn3YBv6B0Geyv8+VGny+d7VQHj5n7sDS1hx4VRRQPhs0dL5DuMxkaOtezE0I='
//          },
//          data:{
//            way:'category'
//          }
//        }).then(function(res){
//          console.log(res)
//        }).catch(function(err){
//          console.log(err)
//        })
      }
    }
  }
</script>
<style>

</style>
