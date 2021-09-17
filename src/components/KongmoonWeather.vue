<template>
  <div>
    <el-button type="primary" @click="goBack">← 返回</el-button>

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

        <!-- 当前日期 -->
        <div>
          <span>{{ dateTimeString }}</span>
        </div>
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
            <span :style="temperatureMinColorStype"
              >{{ getDayForecastCityValue("tmin") }}°c</span
            >
            ~
            <span :style="temperatureMaxColorStype"
              >{{ getDayForecastCityValue("tmax") }}°c</span
            >
          </div>
          <!-- 预警信号 -->
          <div
            style="text-align: center; margin-top: 10px"
            v-if="warningSignalImageList.length > 0"
          >
            <el-image
              v-for="(imageUrl, index) in warningSignalImageList"
              :key="index"
              style="width: 45px; height: 45px"
              :src="warningSignalImageIp + imageUrl"
              fit="fill"
              @click="handleWarningSignalImage(imageUrl)"
            ></el-image>
          </div>
        </div>
        <div>
          <el-row class="rowStype">
            <el-col :span="12">
              <span class="indexKeyStype">【风向】</span>
              <span>{{ getRealTimeWindDirection() }}</span>
            </el-col>
            <el-col :span="12">
              <span class="indexKeyStype">【日降雨量】</span>
              <span>{{ realTimeDataVO.dailyRainfall }}毫米</span>
            </el-col>
          </el-row>

          <el-row class="rowStype">
            <el-col :span="12">
              <span class="indexKeyStype">【风力】</span>
              <span>{{ realTimeDataVO.windPower }}</span>
            </el-col>
            <el-col :span="12">
              <span class="indexKeyStype">【相对湿度】</span>
              <span>{{ realTimeDataVO.relativeHumidity }}%</span>
            </el-col>
          </el-row>

          <el-row class="rowStype">
            <el-col :span="12">
              <span class="indexKeyStype">【风速】</span>
              <span>{{ realTimeDataVO.windSpeed }}m/s</span>
            </el-col>
            <el-col :span="12"></el-col>
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
          <!-- 天气 -->
          <div style="font-weight: bold; font-style: italic;">
            {{ getDayForecastCityValue("weatherShape") }}
          </div>
        </div>

        <div>
          <el-row class="rowStype">
            <el-col :span="12">
              <span class="indexKeyStype">【风向】</span>
              <span>{{ getDayForecastCityValue("windDirection") }}</span>
            </el-col>
            <el-col :span="12">
              <span class="indexKeyStype">【空气】</span>
              <span>{{ getDayForecastCityValue("air") }}</span>
            </el-col>
          </el-row>

          <el-row class="rowStype">
            <el-col :span="12">
              <span class="indexKeyStype">【风速】</span>
              <span>{{ getDayForecastCityValue("windSpeed") }}</span>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>

          <el-row class="rowStype">
            <el-col :span="24">
              <span class="indexKeyStype">【预告】</span>
              <span>{{ getDayForecastInfoVOValue("weatherDesc") }}</span>
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
          <el-table-column label="时间" align="center" fixed>
            <template slot-scope="scope">
              <div>{{ scope.row.time }}</div>
              <div>{{ scope.row.week }}</div>
            </template>
          </el-table-column>
          <el-table-column label="天气图" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 30px; height: 30px"
                :src="weatherImageIp + scope.row.icon"
                fit="fill"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="situation" label="天气" align="center">
          </el-table-column>
          <el-table-column prop="temperature" label="温度" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.temperature.split("-")[0] }}</span
              >~<span>{{ scope.row.temperature.split("-")[1] }}</span
              >°c
            </template>
          </el-table-column>
          <el-table-column prop="windDirection" label="风向" align="center">
          </el-table-column>
          <el-table-column prop="windSpeed" label="风速" align="center">
          </el-table-column>
          <el-table-column prop="humidity" label="相对湿度" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.humidity.split("-")[0] }}</span
              >~<span>{{ scope.row.humidity.split("-")[1] }}</span
              >%
            </template>
          </el-table-column>
          <el-table-column prop="visibility" label="能见度" align="center">
          </el-table-column>
        </el-table>

        <el-row class="rowStype">
          <el-col :span="24">
            <span class="indexKeyStype">【一周预告】</span>
            <span>{{ getWeekForecastInfoValue("weekRemark") }}</span>
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

      <div class="rowStype" style="text-align: center">
        <el-image
          style="height: 20px; width: 300px"
          src="https://gitee.com/pic-project/pic-it-work-001/raw/master/x-frontend/temperature_color.png"
          fit="fill"
        ></el-image>
      </div>

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
  </div>
</template>

<script>
import axios from "axios";
import {
  YYMMDD,
  weekday,
  cDay,
  solarDay3,
  solarDay2,
  solarDay1,
} from "@/utils/today";
import { convertRgbToHex } from "@/utils/color";

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
      //预警信号
      warningSignalVO: {},
      warningSignalImageList: [],
      //天气图片IP
      weatherImageIp: "http://jmqx.jiangmen.cn/material/tqpic/",
      //预警图片Ip
      warningSignalImageIp: "http://jmqx.jiangmen.cn/material/yjxh/",
      // 目前请求到的接口数
      dataCount: 0,
      // 总共需要完成接口数
      dataCountTotal: 4,
      //温度颜色
      temperatureColorStype: {
        color: "#000",
      },
      temperatureMinColorStype: {
        color: "#000",
      },
      temperatureMaxColorStype: {
        color: "#000",
      },
      //日期
      dateTimeString: "",
    };
  },

  created() {
    this.initData();
    this.requestWeatherData();
  },

  methods: {
    //初始化数据
    initData() {
      this.dateTimeString = YYMMDD() + " " + weekday();
    },

    // 是否显示loading
    isLoading() {
      return this.dataCount < this.dataCountTotal;
    },
    // 更新温度颜色
    updateTemperatureColor() {
      this.temperatureColorStype.color = this.calTemperatureColor(
        this.realTimeDataVO.temperature
      );
      var bottomStyle = "5px solid ";
      var temperatureMinBottomStyle =
        bottomStyle +
        this.calTemperatureColor(this.getDayForecastCityValue("tmin"));
      var temperatureMaxBottomStyle =
        bottomStyle +
        this.calTemperatureColor(this.getDayForecastCityValue("tmax"));
      this.temperatureMinColorStype = {
        "border-bottom": temperatureMinBottomStyle,
      };
      this.temperatureMaxColorStype = {
        "border-bottom": temperatureMaxBottomStyle,
      };
    },

    //计算温度转颜色值
    calTemperatureColor(temperature) {
      var b = 0;
      var g = 0;
      var r = 0;
      if (temperature === 20) {
        b = 0;
        g = 256;
        r = 0;
      } else if (temperature < 20) {
        b = 256 - (256 / 20) * (temperature - 0);
        g = 256 - (256 / 20) * (20 - temperature);
        r = 0;
      } else if (temperature > 20) {
        b = 0;
        g = 256 - (256 / 20) * (temperature - 20);
        r = 256 - (256 / 20) * (40 - temperature);
      }
      return convertRgbToHex(r, g, b);
    },

    // 获取今日天气预报图标
    getDayForecastCityIcon() {
      const iconUrl = this.getDayForecastCityValue("icon");
      if (iconUrl && iconUrl.length > 0) {
        return this.weatherImageIp + iconUrl;
      }

      return null;
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
          // 更新温度颜色
          this.updateTemperatureColor();
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

      //预警信息
      axios.post("api/weather/getWarningSignal").then(
        (response) => {
          this.warningSignalVOList = response.data.data;
          this.warningSignalImageList = [];
          this.warningSignalVOList.forEach((warningSignalVO) => {
            if (warningSignalVO.area === this.district) {
              this.warningSignalVO = warningSignalVO;
              if (this.warningSignalVO.path1) {
                this.warningSignalImageList.push(this.warningSignalVO.path1);
              }
              if (this.warningSignalVO.path2) {
                this.warningSignalImageList.push(this.warningSignalVO.path2);
              }
              if (this.warningSignalVO.path3) {
                this.warningSignalImageList.push(this.warningSignalVO.path3);
              }
              if (this.warningSignalVO.path4) {
                this.warningSignalImageList.push(this.warningSignalVO.path4);
              }
              if (this.warningSignalVO.path5) {
                this.warningSignalImageList.push(this.warningSignalVO.path5);
              }
              if (this.warningSignalVO.path6) {
                this.warningSignalImageList.push(this.warningSignalVO.path6);
              }
              if (this.warningSignalVO.path7) {
                this.warningSignalImageList.push(this.warningSignalVO.path7);
              }
              if (this.warningSignalVO.path8) {
                this.warningSignalImageList.push(this.warningSignalVO.path8);
              }
              if (this.warningSignalVO.path9) {
                this.warningSignalImageList.push(this.warningSignalVO.path9);
              }
              if (this.warningSignalVO.path10) {
                this.warningSignalImageList.push(this.warningSignalVO.path10);
              }
            }
          });
          this.dataCount = this.dataCount + 1;
        },
        (response) => {
          this.$message.error("预警信息请求失败！");
          this.dataCount = this.dataCount + 1;
        }
      );
    },

    // 点击预警图片
    handleWarningSignalImage(imageUrl) {
      var msg = this.warningSignalVO.yjxhStr;

      var color = "";
      var warnTypeColor = "info";
      if (imageUrl.indexOf("blue") > -1) {
        color = "蓝色";
        warnTypeColor = "info";
      } else if (imageUrl.indexOf("orange") > -1) {
        color = "橙色";
        warnTypeColor = "warning";
      } else if (imageUrl.indexOf("red") > -1) {
        color = "红色";
        warnTypeColor = "error";
      } else if (imageUrl.indexOf("white") > -1) {
        color = "白色";
        warnTypeColor = "info";
      } else if (imageUrl.indexOf("yellow") > -1) {
        color = "黄色";
        warnTypeColor = "warning";
      }

      var warningSignal = "";
      if (imageUrl.indexOf("typh") > -1) {
        warningSignal = "台风预警";
      } else if (imageUrl.indexOf("rst") > -1) {
        warningSignal = "暴雨预警";
      } else if (imageUrl.indexOf("htem") > -1) {
        warningSignal = "高温预警";
      } else if (imageUrl.indexOf("ltem") > -1) {
        warningSignal = "寒冷预警";
      } else if (imageUrl.indexOf("fog") > -1) {
        warningSignal = "大雾预警";
      } else if (imageUrl.indexOf("haze") > -1) {
        warningSignal = "灰霾预警";
      } else if (imageUrl.indexOf("thun") > -1) {
        warningSignal = "雷雨大风预警";
      } else if (imageUrl.indexOf("iceup") > -1) {
        warningSignal = "道路结冰预警";
      } else if (imageUrl.indexOf("hail") > -1) {
        warningSignal = "冰雹预警";
      } else if (imageUrl.indexOf("fire") > -1) {
        warningSignal = "森林火警预警";
      }

      if (color.length > 0 || warningSignal.length > 0) {
        msg = color + " - " + warningSignal;
      }
      this.$message({
        message: msg,
        type: warnTypeColor,
        center: true,
      });
    },
    //切换地区
    handleChangeDistrict(value) {
      this.requestWeatherData();
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }
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
  font-family: Arial, Helvetica, sans-serif;
}

.temperatureRangeStype {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: black;
  font-family: Arial, Helvetica, sans-serif;
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

.indexKeyStype {
  font-weight: bold;
}
</style>
