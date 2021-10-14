import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import KongmoonWeather from '@/components/weather/KongmoonWeather'
import MoneyRecord from '@/components/money/MoneyRecord'
import MoneyRecordListByCategory from '@/components/money/MoneyRecordListByCategory'
import MoneyRecordAdd from '@/components/money/MoneyRecordAdd'
import WorkoutRecord from '@/components/workout/WorkoutRecord'
import WorkoutRecordAdd from '@/components/workout/WorkoutRecordAdd'

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
    {
      path: '/WorkoutRecord',
      name: 'WorkoutRecord',
      component: WorkoutRecord
    },
    {
      path: '/WorkoutRecordAdd',
      name: 'WorkoutRecordAdd',
      component: WorkoutRecordAdd
    },    
  ]
})
