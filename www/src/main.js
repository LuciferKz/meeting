// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import app from './app'
import router from './router'

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import './icons' // icon

Vue.config.productionTip = false

import store from './store'

import '@/styles/common.css'
// Cookies.get('size') || 
Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { app },
  template: '<app/>'
})
