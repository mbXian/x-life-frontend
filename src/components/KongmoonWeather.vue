<template>
  <div>
    <span>{{JSON.stringify(this.realTimeDataVO)}}</span>
    
    <el-button icon="el-icon-search" circle></el-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "KongmoonWeather",
  data() {
    return {
      msg: "Welcome to Your KongmoonWeather",
      //实时天气数据
      realTimeDataVO: {},
      //今天天气预报数据
      dayForecastVO: {},
      //一周天气预报数据
      weekForecastVO: {},
    };
  },

  created() {
    this.requestWeatherData();
  },

  methods: {

    //拉取所有的天气数据
    requestWeatherData() {
      //实时天气数据
      axios.post("api/weather/getRealTimeData").then(
        (response) => {
          console.log("resp = " + JSON.stringify(response.data.data));
          this.realTimeDataVO = response.data.data;
        },
        (response) => {
          this.$message.error('实时天气数据请求失败！');
        }
      );

      //今天天气预报
      axios.post("api/weather/getDayForecast").then(
        (response) => {
          console.log("resp = " + JSON.stringify(response.data.data));
          this.dayForecastVO = response.data.data;
        },
        (response) => {
          this.$message.error('今天天气预报请求失败！');
        }
      );

      //一周天气预报
      axios.post("api/weather/getWeekForecast").then(
        (response) => {
          console.log("resp = " + JSON.stringify(response.data.data));
          this.weekForecastVO = response.data.data;
        },
        (response) => {
          this.$message.error('一周天气预报请求失败！');
        }
      );
    },
  },
};
</script>


<style scoped>
</style>
