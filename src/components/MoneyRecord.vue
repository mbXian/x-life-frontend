<template>
  <div>
    <el-button type="primary" @click="goBack">← 返回</el-button>


  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MoneyRecord",
  data() {
    return {
      
    };
  },

  created() {
    
  },

  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }
  },
};
</script>


<style>

</style>
