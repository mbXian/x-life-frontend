<template>
  <div class="contentStype">
    <!-- 顶部按钮栏 -->
    <div class="topButtonViewStype">
      <!-- 地区选项 -->
      <el-select
        v-model="district"
        style="width: 90px"
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
      <el-button type="primary" @click="requestWeatherData">刷新</el-button>
    </div>

    <!-- 线 -->
    <div class="dashedStype"></div>

    <!-- 实时数据模块 -->
    <div v-loading="isLoading()">
      <div class="titleStype">实时数据</div>

      <div>
        <!-- 实时温度 -->
        <div class="temperatureStype" :style="temperatureColorStype">
          {{ realTimeDataVO.temperature }}°
        </div>
        <!-- 温度范围 -->
        <div class="temperatureRangeStype">
          {{ getDayForecastCityValue("tmin") }}°~{{
            getDayForecastCityValue("tmax")
          }}°
        </div>
      </div>
      <div>
        <el-row class="rowStype">
          <el-col :span="12">
            <span>【风向】{{ getRealTimeWindDirection() }}</span>
          </el-col>
          <el-col :span="12">
            <span>【日降雨量】{{ realTimeDataVO.dailyRainfall }}毫米</span>
          </el-col>
        </el-row>

        <el-row class="rowStype">
          <el-col :span="12">
            <span>【风力】{{ realTimeDataVO.windPower }}</span>
          </el-col>
          <el-col :span="12">
            <span>【相对湿度】{{ realTimeDataVO.relativeHumidity }}%</span>
          </el-col>
        </el-row>

        <el-row class="rowStype">
          <el-col :span="12">
            <span>【风速】{{ realTimeDataVO.windSpeed }}m/s</span>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>

        <el-row class="rowStype remarkStype">
          <el-col :span="24">
            <span>{{ realTimeDataVO.detectionDateTimeString }} 检测</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 线 -->
    <div class="dashedStype"></div>

    <!-- 未来24小时预报模块 -->
    <div v-loading="isLoading()">
      <div class="titleStype" style="width: 130px">未来24小时预报</div>

      <div style="text-align: center">
        <!-- 预报图标 -->
        <el-image
          style="width: 50px; height: 50px"
          :src="getDayForecastCityIcon()"
          fit="fill"
        ></el-image>
      </div>

      <div>
        <el-row class="rowStype">
          <el-col :span="12">
            <span>【风向】{{ getDayForecastCityValue("windDirection") }}</span>
          </el-col>
          <el-col :span="12">
            <span>【天气】{{ getDayForecastCityValue("weatherShape") }}</span>
          </el-col>
        </el-row>

        <el-row class="rowStype">
          <el-col :span="12">
            <span>【风速】{{ getDayForecastCityValue("windSpeed") }}</span>
          </el-col>
          <el-col :span="12">
            <span>【空气】{{ getDayForecastCityValue("air") }}</span>
          </el-col>
        </el-row>

        <el-row class="rowStype">
          <el-col :span="24">
            <span>【预告】{{ getDayForecastInfoVOValue("weatherDesc") }}</span>
          </el-col>
        </el-row>

        <el-row class="rowStype remarkStype">
          <el-col :span="24">
            <span
              >{{ getDayForecastInfoVOValue("forecaster") }} 于
              {{ getDayForecastInfoVOValue("time") }} 预报</span
            >
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 线 -->
    <div class="dashedStype"></div>

    <!-- 未来一周预报 -->
    <div v-loading="isLoading()">
      <el-table :data="getWeekDayForecastCityVO()" stripe style="width: 100%">
        <el-table-column label="时间" fixed>
          <template slot-scope="scope">
            <div>{{ scope.row.time }}</div>
            <div>{{ scope.row.week }}</div>
          </template>
        </el-table-column>
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

      <el-row class="rowStype">
        <el-col :span="24">
          <span>【一周预告】{{ getWeekForecastInfoValue("weekRemark") }}</span>
        </el-col>
      </el-row>
    </div>

    <!-- 线 -->
    <div class="dashedStype"></div>

    <!-- 各种指数模块 -->
    <div v-loading="isLoading()">
      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="http://jmqx.jiangmen.cn/material/tqzs/zwx.gif"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span
            >紫外线强度为{{ getDayForecastIndexVOValue("ultraviolet") }}</span
          >
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="http://jmqx.jiangmen.cn/material/tqzs/ssd.gif"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span>舒适度为{{ getDayForecastIndexVOValue("comfortLevel") }}</span>
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="http://jmqx.jiangmen.cn/material/tqzs/cshx.gif"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span>城市火警为{{ getDayForecastIndexVOValue("cityFire") }}</span>
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="http://jmqx.jiangmen.cn/material/tqzs/ls.gif"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span>晾晒指数为{{ getDayForecastIndexVOValue("sunCure") }}</span>
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="http://jmqx.jiangmen.cn/material/tqzs/mb.gif"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span>霉变指数为{{ getDayForecastIndexVOValue("mildew") }}</span>
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="http://jmqx.jiangmen.cn/material/tqzs/cl.gif"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span
            >晨运指数为{{ getDayForecastIndexVOValue("morningExercise") }}</span
          >
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="http://jmqx.jiangmen.cn/material/tqzs/slhx.gif"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span>森林火警为{{ getDayForecastIndexVOValue("forestFire") }}</span>
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="http://jmqx.jiangmen.cn/material/tqzs/cy.gif"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span>穿衣指数为{{ getDayForecastIndexVOValue("dress") }}</span>
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="https://gitee.com/pic-project/pic-it-work-001/raw/master/x-frontend/air.png"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span>空气指数为{{ getDayForecastIndexVOValue("air") }}</span>
        </el-col>
      </el-row>

      <el-row class="rowStype">
        <el-col :span="2">
          <div>
            <el-image
              class="valueIconStype"
              src="https://gitee.com/pic-project/pic-it-work-001/raw/master/x-frontend/sun.png"
              fit="fill"
            ></el-image>
          </div>
        </el-col>
        <el-col :span="22">
          <span>暑热指数为{{ getDayForecastIndexVOValue("heat") }}</span>
        </el-col>
      </el-row>

      <div class="rowStype remarkStype">
        {{ getWeekForecastInfoValue("forecaster7Day") }} 预报
      </div>
    </div>

    <div style="text-align: center">
      <span>
        <span style="border-radius: 50%; color: darkturquoise"
          >技术支持：@兵</span
        >
        <el-image
          class="valueIconStype"
          style="border-radius: 50%"
          src="https://gitee.com/pic-project/pic-it-work-001/raw/master/photoshop/portrait.png"
          fit="fill"
        ></el-image>
      </span>
    </div>
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
          label: "蓬江区",
        },
        {
          value: "新会",
          label: "新会区",
        },
        {
          value: "江海",
          label: "江海区",
        },
        {
          value: "鹤山",
          label: "鹤山市",
        },
        {
          value: "开平",
          label: "开平市",
        },
        {
          value: "台山",
          label: "台山市",
        },
        {
          value: "恩平",
          label: "恩平市",
        },
        {
          value: "川岛",
          label: "川岛",
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
      // 目前请求到的接口数
      dataCount: 0,
      // 总共需要完成接口数
      dataCountTotal: 3,
      //温度颜色
      temperatureColorStype: {
        color: "#000",
      },
    };
  },

  created() {
    this.requestWeatherData();
  },

  methods: {
    // 是否显示loading
    isLoading() {
      return this.dataCount < this.dataCountTotal;
    },
    // 更新温度颜色
    updateTemperatureColor() {
      let temperature = this.realTimeDataVO.temperature;
      var b = 0;
      var g = 0;
      var r = 0;
      if (temperature === 20) {
        b = 0;
        g = 256;
        r = 0;
      } else if (temperature < 20) {
        b = 256 - ((256/20) * (temperature - 0));
        g = 256 - ((256/20) * (20 - temperature));
        r = 0;
      } else if (temperature > 20) {
        b = 0;
        g = 256 - ((256/20) * (temperature - 20));
        r = 256 - ((256/20) * (40 - temperature));
      }
      this.temperatureColorStype.color = this.convertRgbToHex(r, g, b);
    },
    // rgb转hex
    convertRgbToHex(r, g, b) {
      r = Math.max(Math.min(Number(r), 100), 0) * 2.55;
      g = Math.max(Math.min(Number(g), 100), 0) * 2.55;
      b = Math.max(Math.min(Number(b), 100), 0) * 2.55;
      r = ("0" + (Math.round(r) || 0).toString(16)).slice(-2);
      g = ("0" + (Math.round(g) || 0).toString(16)).slice(-2);
      b = ("0" + (Math.round(b) || 0).toString(16)).slice(-2);
      let hex = "#" + r + g + b;
      console.log('hex = ' + hex);
      return hex;
    },
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
      this.dataCount = 0;

      //实时天气数据
      axios.post("api/weather/getRealTimeData").then(
        (response) => {
          this.realTimeDataVO = response.data.data;
          this.dataCount = this.dataCount + 1;
          // 更新温度颜色
          this.updateTemperatureColor();
        },
        (response) => {
          this.$message.error("实时天气数据请求失败！");
          this.dataCount = this.dataCount + 1;
        }
      );

      //今天天气预报
      axios.post("api/weather/getDayForecast").then(
        (response) => {
          this.dayForecastVO = response.data.data;
          this.dataCount = this.dataCount + 1;
        },
        (response) => {
          this.$message.error("今天天气预报请求失败！");
          this.dataCount = this.dataCount + 1;
        }
      );

      //一周天气预报
      axios.post("api/weather/getWeekForecast").then(
        (response) => {
          this.weekForecastVO = response.data.data;
          this.dataCount = this.dataCount + 1;
        },
        (response) => {
          this.$message.error("一周天气预报请求失败！");
          this.dataCount = this.dataCount + 1;
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
.lineStype {
  background-color: #000000;
  height: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.dashedStype {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px dashed darkgray;
}
.contentStype {
  background-color: floralwhite;
}
.topButtonViewStype {
  margin-top: 10px;
  text-align: center;
}
.temperatureStype {
  text-align: center;
  font-weight: bold;
  font-size: 60px;
  color: rgb(0, 0, 0);
}
.temperatureRangeStype {
  text-align: center;
  font-size: 18px;
  color: darkturquoise;
}
.rowStype {
  margin-top: 5px;
}
.remarkStype {
  font-size: 13px;
  color: darkgray;
  text-align: right;
}
.valueIconStype {
  width: 30px;
  height: 30px;
}
.titleStype {
  border: 1px solid darkturquoise;
  background: #dddddd;
  border-radius: 25px;
  font-weight: bold;
  width: 80px;
  text-align: center;
}
</style>
