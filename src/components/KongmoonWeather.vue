<template>
  <div>
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <el-button icon="el-icon-search" circle @click="handleClick"></el-button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'KongmoonWeather',
  data () {
    return {
      msg: 'Welcome to Your KongmoonWeather'
    }
  },
  methods: {
    handleClick() {
      console.log('点击事件！');
      axios.get('api/meal/recommend').then(response => {
          this.$message('请求成功');
      }, response => {
          this.$message('请求失败');
      });
    }
  }
}
</script>


<style scoped>

</style>
