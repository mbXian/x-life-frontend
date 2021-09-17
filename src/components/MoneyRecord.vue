<template>
  <div>
    <el-button type="primary" @click="goBack">← 返回</el-button>

    <div>
      <div>
        <div class="contentItemStype">开始日期：</div>
        <div class="block">
          <el-date-picker
            v-model="requestRankingListByCategoryStartDate"
            type="date"
            value-format="yyyy-MM-dd"
            default-value=""
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="contentItemStype">结束日期：</div>
        <div class="block">
          <el-date-picker
            v-model="requestRankingListByCategoryEndDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </div>  
        <div class="contentItemStype">
          <el-button type="primary" @click="requestRankingListByCategory">排行榜查询</el-button>
          <el-button type="success" @click="add">记一笔</el-button>
        </div>
        <div class="contentItemStype">
          <el-table :data="priceRankingList" stripe style="width: 100%">

            <el-table-column prop="rank" label="排行" align="center">
            </el-table-column>

            <el-table-column prop="categoryName" label="类别" align="center">
            </el-table-column>

            <el-table-column prop="price" label="消费金额">
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="checkDetail(scope.row.categoryId)">详情 →</el-button>
              </template>
            </el-table-column>            
            
          </el-table>          
        </div>                 
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MoneyRecord",
  data() {
    return {
      // 每个一级分类的总消费排行榜
      priceRankingList: [],
      // 排行版的日期范围
      requestRankingListByCategoryStartDate: '',
      requestRankingListByCategoryEndDate: '',
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
      // 排行版的日期范围，默认本月
      var now = new Date();
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      if (m < 10) {
        m = "0" + m;
      }
      var d = now.getDate();
      let startDateString = y + "-" + m + "-" + d;
      this.requestRankingListByCategoryStartDate = y + "-" + m + "-" + "01";
      if (d < 10) {
        this.requestRankingListByCategoryEndDate = y + "-" + m + "-" + "0" + d;
      } else {
        this.requestRankingListByCategoryEndDate = y + "-" + m + "-" + d;
      }

      this.requestRankingListByCategory();
    },

    // 查询每个一级分类的总消费排行榜
    requestRankingListByCategory() {
      console.log(this.requestRankingListByCategoryStartDate + ', ' + this.requestRankingListByCategoryEndDate);
      let params = {
        startDate: this.requestRankingListByCategoryStartDate,//开始时间
        endDate: this.requestRankingListByCategoryEndDate,//结束时间
        userMobile: "18824140606"
      };
      axios.post("api/moneyRecord/priceRankingListByCategory", params).then(
        (response) => {
          this.priceRankingList = response.data.data;
          console.log(JSON.stringify(this.priceRankingList));
        },
        (response) => {
          this.$message.error("查询每个一级分类的总消费排行榜请求失败！");
        }
      );        
    },

    // 查看详情
    checkDetail(categoryId) {
      let param = {
        startDate: this.requestRankingListByCategoryStartDate,//开始时间
        endDate: this.requestRankingListByCategoryEndDate,//结束时间
        userMobile: "18824140606",
        parentCategoryId: categoryId
      };
      this.$router.push({path: '/moneyRecordListByCategory', query: param});
    },

    // 新增
    add() {
      let param = {
        userMobile: "18824140606"
      };
      this.$router.push({path: '/moneyRecordAdd', query: param});
    },

  },
};
</script>


<style>
.contentItemStype {
  margin-top: 10px;
}
</style>
