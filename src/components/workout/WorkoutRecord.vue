<template>
  <div>
    <el-button type="primary" @click="goBack">← 返回</el-button>

    <div>
      
      <div v-if="toNowStatisticsVO != null" class="moduleStype">
        <div class="moduleTitleStyle">
          历史运动健身记录
        </div>

        <div v-if="toNowStatisticsVO.startTrainTimeString && toNowStatisticsVO.endTrainTimeString" class="moduleItemStype">
          <span class="nameStyle">
            ⏰ 时间：
          </span>
          <span class="valueStyle">
            {{toNowStatisticsVO.startTrainTimeString}}
          </span>
          <span>
            ~
          </span>
          <span class="valueStyle">
            {{toNowStatisticsVO.endTrainTimeString}}
          </span>
        </div>

        <div class="moduleItemStype">
          <span class="nameStyle">
            ⏰ 总时长:
          </span>
          <span class="valueStyle">
            {{toNowStatisticsVO.duration}}
          </span>
          <span>
            秒
          </span>
        </div>

        <div class="moduleItemStype">
          <span class="nameStyle">
            🏋🏻 次数:
          </span>
          <span class="valueStyle">
            {{toNowStatisticsVO.count}}
          </span>
        </div>     

        <div>
          <div v-for="item in toNowStatisticsEachTypeVOList" :key="item.typeId" class="moduleItemStype">
            <span class="nameStyle">
              🏆 {{item.typeName}}:
            </span>
            <span class="valueStyle">
              {{item.countTotal}}
            </span>
            <span>
              {{item.unit}}
            </span>
          </div>
        </div>   
      </div>    

      <div v-if="todayStatisticsVO != null" class="moduleStype">
        <div class="moduleTitleStyle">
          今日运动健身记录
        </div>

        <div v-if="todayStatisticsVO.startTrainTimeString && todayStatisticsVO.endTrainTimeString" class="moduleItemStype">
          <span class="nameStyle">
            ⏰ 时间:
          </span>
          <span class="valueStyle">
            {{todayStatisticsVO.startTrainTimeString}}
          </span>
          <span>
            ~
          </span>
          <span class="valueStyle">
            {{todayStatisticsVO.endTrainTimeString}}
          </span>
        </div>

        <div class="moduleItemStype">
          <span class="nameStyle">
            ⏰ 总时长:
          </span>
          <span class="valueStyle">
            {{todayStatisticsVO.duration}}
          </span>
          <span>
            秒
          </span>
        </div>

        <div class="moduleItemStype">
          <span class="nameStyle">
            🏋🏻 次数:
          </span>
          <span class="valueStyle">
            {{todayStatisticsVO.count}}
          </span>
        </div>        

        <div>
          <div v-for="item in todayStatisticsEachTypeVOList" :key="item.typeId" class="moduleItemStype">
            <span class="nameStyle">
              🏆 {{item.typeName}}:
            </span>
            <span class="valueStyle">
              {{item.countTotal}}
            </span>
            <span>
              {{item.unit}}
            </span>
          </div>
        </div>   
      </div>

      <div style="margin-top: 10px; text-align: center;">
          <el-button type="success" style="width: 200px;" @click="add">开始</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WorkoutRecord",
  data() {
    return {
      // 统计至今运动健身数据
      toNowStatisticsVO: null,
      // 统计至今运动健身分组数据
      toNowStatisticsEachTypeVOList: [],
      // 统计今日运动健身数据
      todayStatisticsVO: null,
      // 统计今日运动健身分组数据
      todayStatisticsEachTypeVOList: [],
      // 已连续运动健身天数
      keepOnDays: 0,
      // 过去n天运动健身饱和率
      daysSaturation: 0.0,
    };
  },

  created() {
    this.initDate();
  },

  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },

    // 初始化数据
    initDate() {

      this.requestToNowStatistics();
      this.requestTodayStatistics();
      this.requestKeepOnDays();
      this.requestDaysSaturation();
    },

    // 统计至今运动健身数据
    requestToNowStatistics() {
      axios.post("api/workoutRecord/toNowStatistics").then(
        (response) => {
          this.toNowStatisticsVO = response.data.data;
          if (this.toNowStatisticsVO != null && this.toNowStatisticsVO.statisticsEachTypeVOList != null) {
            this.toNowStatisticsEachTypeVOList = this.toNowStatisticsVO.statisticsEachTypeVOList; 
          }
        },
        (response) => {
          this.$message.error("统计至今运动健身数据请求失败！");
        }
      );        
    },

    // 统计今日运动健身数据
    requestTodayStatistics() {
      axios.post("api/workoutRecord/todayStatistics").then(
        (response) => {
          this.todayStatisticsVO = response.data.data;
          if (this.todayStatisticsVO != null && this.todayStatisticsVO.statisticsEachTypeVOList != null) {
            this.todayStatisticsEachTypeVOList = this.todayStatisticsVO.statisticsEachTypeVOList; 
          }
        },
        (response) => {
          this.$message.error("统计今日运动健身数据请求失败！");
        }
      );        
    },

    // 已连续运动健身天数
    requestKeepOnDays() {
      axios.post("api/workoutRecord/keepOnDays", {}).then(
        (response) => {
          this.keepOnDays = response.data.data.keepOnDays;
        },
        (response) => {
          this.$message.error("已连续运动健身天数请求失败！");
        }
      );        
    },

    // 过去n天运动健身饱和率
    requestDaysSaturation() {
      axios.post("api/workoutRecord/daysSaturation", {'days': 7}).then(
        (response) => {
          this.daysSaturation = response.data.data.daysSaturation;
        },
        (response) => {
          this.$message.error("过去n天运动健身饱和率请求失败！");
        }
      );        
    },

    // 跳转到新增页面
    add() {
      this.$router.push({path:'/WorkoutRecordAdd', query: null});
    }
  },
};
</script>


<style>
.moduleStype {
  border: 1px solid gray;
  background: #dff4f7;
  border-radius: 4px;
  margin-top: 10px;
}
.moduleTitleStyle {
  color: orange;
  font-weight: bold;
  text-align: center;
}
.moduleItemStype {
  margin-top: 5px;
}
.nameStyle {
  color: black;
  font-weight: bold;
}
.valueStyle {
  color: skyblue;
  font-weight: bold;
}

</style>
