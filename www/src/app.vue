<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Layout from './views/layout/index.vue'
export default {
    name: 'app',
    components: { Layout }
}
</script>
