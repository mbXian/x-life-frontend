<template>
  <div class="contentStype">
    <div class="contentItemStype">
      功能列表
    </div>
    <div class="contentItemStype">
      <el-button type="primary" @click="goToWeather">江门天气</el-button>
    </div>
    <div class="contentItemStype">
      <el-button type="primary" @click="goToMoneyRecord">记账工具</el-button>
    </div>

    <!-- 线 -->
    <div class="dashedStype"></div>    

    <div style="text-align: center">
      <span>
        <span style="color: darkturquoise">技术支持：@兵</span>
        <el-image
          class="valueIconStype"
          style="border-radius: 50%"
          src="https://gitee.com/pic-project/pic-it-work-001/raw/master/photoshop/portrait.png"
          fit="fill"
        ></el-image>
      </span>
    </div>

    <div style="text-align: center">
      <span>
        <span style="color: gray">version: v-1.1</span>
      </span>
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
.dashedStype {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px dashed darkgray;
}
</style>
