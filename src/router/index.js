import Vue from 'vue'
import Router from 'vue-router'
import KongmoonWeather from '@/components/KongmoonWeather'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'KongmoonWeather',
      component: KongmoonWeather
    }
  ]
})
