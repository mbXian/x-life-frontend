<template>
  <div class="contentStype">
    <!-- 顶部按钮栏 -->
    <div class="topButtonViewStype">
      <!-- 地区选项 -->
      <el-select
        v-model="district"
        style="width: 80px"
        @change="handleChangeDistrict"
      >
        <el-option
          v-for="item in districtOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 刷新按钮 -->
      <el-button
        icon="el-icon-refresh"
        circle
        @click="requestWeatherData"
      ></el-button>
    </div>
    <!-- 线 -->
    <div class="lineStype"></div>
    <div>实时数据：</div>
    <div class="temperatureStype">
      <!-- 实时温度 -->
      <span>{{ realTimeDataVO.temperature }}°</span>
      <!-- 温度范围 -->
      <span class="temperatureRangeStype"
        >{{ getDayForecastCityValue("tmin") }}°~{{
          getDayForecastCityValue("tmax")
        }}°</span
      >
    </div>
    <div>
      <el-row>
        <el-col :span="12">
          <span>风速：{{ realTimeDataVO.windSpeed }}m/s</span>
        </el-col>
        <el-col :span="12">
          <span>风力：{{ realTimeDataVO.windPower }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>日降雨量：{{ realTimeDataVO.dailyRainfall }}毫米</span>
        </el-col>
        <el-col :span="12">
          <span>相对湿度：{{ realTimeDataVO.relativeHumidity }}%</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>风向：{{ getRealTimeWindDirection() }}</span>
        </el-col>
        <el-col :span="12">
          <span>检测时间：{{ realTimeDataVO.detectionDateTimeString }}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 线 -->
    <div class="lineStype"></div>
    <div>未来24小时预报：</div>
    <div style="text-align: center">
      <!-- 预报图标 -->
      <el-image
        style="width: 50px; height: 50px"
        :src="getDayForecastCityIcon()"
        fit="fill"
      ></el-image>
    </div>
    <div>
      <el-row>
        <el-col :span="12">
          <span>天气：{{ getDayForecastCityValue("weatherShape") }}</span>
        </el-col>
        <el-col :span="12">
          <span>空气：{{ getDayForecastCityValue("air") }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>风速：{{ getDayForecastCityValue("windSpeed") }}</span>
        </el-col>
        <el-col :span="12">
          <span>风向：{{ getDayForecastCityValue("windDirection") }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>紫外线：{{ getDayForecastIndexVOValue("ultraviolet") }}</span>
        </el-col>
        <el-col :span="12">
          <span>舒适度：{{ getDayForecastIndexVOValue("comfortLevel") }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <span>城市火警：{{ getDayForecastIndexVOValue("cityFire") }}</span>
        </el-col>
        <el-col :span="12">
          <span>晾晒指数：{{ getDayForecastIndexVOValue("sunCure") }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <span>霉变指数：{{ getDayForecastIndexVOValue("mildew") }}</span>
        </el-col>
        <el-col :span="12">
          <span
            >晨运指数：{{ getDayForecastIndexVOValue("morningExercise") }}</span
          >
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <span>森林火警：{{ getDayForecastIndexVOValue("forestFire") }}</span>
        </el-col>
        <el-col :span="12">
          <span>穿衣指数：{{ getDayForecastIndexVOValue("dress") }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <span>空气指数：{{ getDayForecastIndexVOValue("air") }}</span>
        </el-col>
        <el-col :span="12">
          <span>暑热指数：{{ getDayForecastIndexVOValue("heat") }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <span>预报人员：{{ getDayForecastInfoVOValue("forecaster") }}</span>
        </el-col>
        <el-col :span="12">
          <span>检测时间：{{ getDayForecastInfoVOValue("time") }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span>描述：{{ getDayForecastInfoVOValue("weatherDesc") }}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 线 -->
    <div class="lineStype"></div>
    <div>未来一周预报：</div>
    <div>
      <el-table :data="getWeekDayForecastCityVO()" stripe style="width: 100%">
        <el-table-column prop="time" label="日期"> </el-table-column>
        <el-table-column prop="week" label="星期"> </el-table-column>
        <el-table-column label="图标">
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: 30px"
              :src="weatherImageIp + scope.row.icon"
              fit="fill"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="situation" label="天气"> </el-table-column>
        <el-table-column prop="temperature" label="温度(°)"> </el-table-column>
        <el-table-column prop="windDirection" label="风向"> </el-table-column>
        <el-table-column prop="windSpeed" label="风速"> </el-table-column>
        <el-table-column prop="humidity" label="相对湿度"> </el-table-column>
        <el-table-column prop="visibility" label="能见度"> </el-table-column>
      </el-table>
    </div>
    <div>
      <span>预报人员：{{ getWeekForecastInfoValue("forecaster7Day") }}</span>
    </div>
    <div>
      <span>一周描述：{{ getWeekForecastInfoValue("weekRemark") }}</span>
    </div>
    <div>技术支持：@兵</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "KongmoonWeather",
  data() {
    return {
      //地区选项
      districtOptions: [
        {
          value: "蓬江",
          label: "蓬江",
        },
        {
          value: "新会",
          label: "新会",
        },
        {
          value: "江海",
          label: "江海",
        },
        {
          value: "鹤山",
          label: "鹤山",
        },
        {
          value: "开平",
          label: "开平",
        },
        {
          value: "台山",
          label: "台山",
        },
        {
          value: "恩平",
          label: "恩平",
        },
      ],
      //所选地区
      district: "蓬江",
      //实时天气数据
      realTimeDataVO: {},
      //今天天气预报数据
      dayForecastVO: {},
      //一周天气预报数据
      weekForecastVO: {},
      weatherImageIp: "http://jmqx.jiangmen.cn/material/tqpic/",
    };
  },

  created() {
    this.requestWeatherData();
  },

  methods: {
    // 获取今日天气预报图标
    getDayForecastCityIcon() {
      const iconUrl =
        this.weatherImageIp + this.getDayForecastCityValue("icon");
      return iconUrl;
    },

    // 获取相应的预报值
    getDayForecastCityValue(key) {
      const dayForecastCityVO = this.getDayForecastCityVO();
      if (dayForecastCityVO) {
        return dayForecastCityVO[key];
      }
      return "";
    },

    // 获取实时风向
    getRealTimeWindDirection() {
      if (this.realTimeDataVO.windDirectionImage === "nw.gif") {
        return "西北";
      } else if (this.realTimeDataVO.windDirectionImage === "n.gif") {
        return "北";
      } else if (this.realTimeDataVO.windDirectionImage === "ne.gif") {
        return "东北";
      } else if (this.realTimeDataVO.windDirectionImage === "e.gif") {
        return "东";
      } else if (this.realTimeDataVO.windDirectionImage === "se.gif") {
        return "东南";
      } else if (this.realTimeDataVO.windDirectionImage === "s.gif") {
        return "南";
      } else if (this.realTimeDataVO.windDirectionImage === "sw.gif") {
        return "西南";
      } else if (this.realTimeDataVO.windDirectionImage === "w.gif") {
        return "西";
      }
      return "";
    },

    // 获取当前地区的天气预报
    getDayForecastCityVO() {
      if (this.dayForecastVO.dayForecastCityVOList) {
        for (
          let index = 0;
          index < this.dayForecastVO.dayForecastCityVOList.length;
          index++
        ) {
          const dayForecastCityVO = this.dayForecastVO.dayForecastCityVOList[
            index
          ];
          if (dayForecastCityVO.name === this.district) {
            return dayForecastCityVO;
          }
        }
      }
      return null;
    },

    // 获取当前地区的未来一周预报
    getWeekDayForecastCityVO() {
      if (this.weekForecastVO.weekForecastCityVOList) {
        for (
          let index = 0;
          index < this.weekForecastVO.weekForecastCityVOList.length;
          index++
        ) {
          const weekForecastCityVO = this.weekForecastVO.weekForecastCityVOList[
            index
          ];
          if (weekForecastCityVO.name === this.district) {
            return weekForecastCityVO.weekDayForecastCityVOList;
          }
        }
      }
      return [];
    },
    // 获取当前地区的未来一周预报描述值
    getWeekForecastInfoValue(key) {
      if (this.weekForecastVO.weekForecastInfoVO) {
        return this.weekForecastVO.weekForecastInfoVO[key];
      }
      return "";
    },

    // 获取天气预报的描述
    getDayForecastInfoVOValue(key) {
      if (this.dayForecastVO.dayForecastInfoVO) {
        return this.dayForecastVO.dayForecastInfoVO[key];
      }
      return "";
    },

    //获取今天预报指数值
    getDayForecastIndexVOValue(key) {
      if (this.dayForecastVO.dayForecastIndexVO) {
        return this.dayForecastVO.dayForecastIndexVO[key];
      }
      return "";
    },

    //拉取所有的天气数据
    requestWeatherData() {
      //实时天气数据
      axios.post("api/weather/getRealTimeData").then(
        (response) => {
          // console.log("resp = " + JSON.stringify(response.data.data));
          this.realTimeDataVO = response.data.data;
        },
        (response) => {
          this.$message.error("实时天气数据请求失败！");
        }
      );

      //今天天气预报
      axios.post("api/weather/getDayForecast").then(
        (response) => {
          // console.log("resp = " + JSON.stringify(response.data.data));
          this.dayForecastVO = response.data.data;
        },
        (response) => {
          this.$message.error("今天天气预报请求失败！");
        }
      );

      //一周天气预报
      axios.post("api/weather/getWeekForecast").then(
        (response) => {
          // console.log("resp = " + JSON.stringify(response.data.data));
          this.weekForecastVO = response.data.data;
        },
        (response) => {
          this.$message.error("一周天气预报请求失败！");
        }
      );
    },

    //切换地区
    handleChangeDistrict(value) {
      console.log(value);
      this.requestWeatherData();
    },
  },
};
</script>


<style>
.testStype {
  background-color: #67c23a;
}
.testStype1 {
  background-color: chocolate;
}
.lineStype {
  background-color: #000000;
  height: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.contentStype {
  background-color: burlywood;
}
.topButtonViewStype {
  margin-top: 10px;
  text-align: center;
}
.temperatureStype {
  text-align: center;
  font-weight: bold;
  font-size: 45px;
  color: blueviolet;
}
.temperatureRangeStype {
  font-size: 20px;
  color: blueviolet;
}
</style>
