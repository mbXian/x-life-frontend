<template>
  <div class="contentStype">
    <div class="contentItemStype">
      功能列表
    </div>
    <div class="contentItemStype">
      <el-button type="primary" @click="goToWeather">主要按钮</el-button>
    </div>
    <div class="contentItemStype">
      <el-button type="primary" @click="goToMoneyRecord">主要按钮</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      
    };
  },

  created() {
    
  },

  methods: {
    // 跳转到天气
    goToWeather() {
      this.$router.push('/weather');
    },
    // 跳转到记账
    goToMoneyRecord() {
      this.$router.push('/moneyRecord');
    }
  },
};
</script>


<style>
.contentStype {
  background-color: floralwhite;
  text-align: center;
  height: 5000px;
}
.contentItemStype {
  margin-top: 10px;
}
</style>
