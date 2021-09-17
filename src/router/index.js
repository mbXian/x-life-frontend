import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import KongmoonWeather from '@/components/KongmoonWeather'
import MoneyRecord from '@/components/MoneyRecord'
import MoneyRecordListByCategory from '@/components/MoneyRecordListByCategory'
import MoneyRecordAdd from '@/components/MoneyRecordAdd'

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
    {
      path: '/moneyRecordListByCategory',
      name: 'MoneyRecordListByCategory',
      component: MoneyRecordListByCategory
    },
    {
      path: '/moneyRecordAdd',
      name: 'MoneyRecordAdd',
      component: MoneyRecordAdd
    },
  ]
})
