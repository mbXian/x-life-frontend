import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import KongmoonWeather from '@/components/KongmoonWeather'
import MoneyRecord from '@/components/MoneyRecord'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/weather',
      name: 'KongmoonWeather',
      component: KongmoonWeather
    },
    {
      path: '/moneyRecord',
      name: 'MoneyRecord',
      component: MoneyRecord
    },
  ]
})
