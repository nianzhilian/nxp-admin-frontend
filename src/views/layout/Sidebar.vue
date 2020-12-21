<template>
  <div class="">
    <sidebar-item :routes='permission_routers'></sidebar-item>
  </div>


</template>


<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
    ]),
  }
}
</script>
