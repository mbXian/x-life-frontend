<template>
  <div>
    <el-button type="primary" @click="goBack">← 返回</el-button>

    <div>
        <div  class="contentItemStype">
          <el-table :data="moneyRecordList" stripe style="width: 100%">

            <el-table-column prop="categoryName" label="类别" align="center">
            </el-table-column>

            <el-table-column prop="changeTime" label="消费时间" align="center" width="95px">
            </el-table-column>

            <el-table-column prop="price" label="消费金额" align="right">
            </el-table-column>

            <el-table-column prop="channelName" label="支付渠道" align="center">
            </el-table-column>

            <el-table-column label="标签" align="center">
              <template slot-scope="scope">
                  <div class="tagStype" v-for="tagName in scope.row.tagNameList" :key="tagName">
                    {{tagName}}
                  </div>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span style="font-size: 7px;">{{scope.row.remark}}</span>
              </template>
            </el-table-column>             
            
          </el-table>          
        </div>      
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MoneyRecordListByCategory",
  data() {
    return {
      // 消费list
      moneyRecordList: [],
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
      this.requestRankingListByCategory();
    },

    // 查询每个一级分类的总消费排行榜
    requestRankingListByCategory() {
      let params = {
        startDate: this.$route.query.startDate,//开始时间
        endDate: this.$route.query.endDate,//结束时间
        userMobile: this.$route.query.userMobile,
        parentCategoryId: this.$route.query.parentCategoryId
      };
      axios.post("api/moneyRecord/listByParentCategoryId", params).then(
        (response) => {
          this.moneyRecordList = response.data.data;

          this.moneyRecordList.forEach(element => {
            element.changeTime = element.changeTime.slice(0, 10)
            if (element.tagNameList && element.tagNameList.length > 0) {
              var tagNames =''
              element.tagNameList.forEach(tagName => {
                if (tagNames != '') {
                  tagNames = tagNames + "，"
                }
                tagNames = tagNames + tagName
              });
              element.tagNames = tagNames;
            }
          });
        },
        (response) => {
          this.$message.error("根据大类查询用户的具体消费请求失败！");
        }
      );        
    },

    // 查看备注
    showRemark(remark) {

    },
    
  },
};
</script>


<style>
.contentItemStype {
  margin-top: 10px;
}
.tagStype {
  height: 20px;
  width: 42px;
  font-size: 10px;
  color: rgb(96, 173, 221);
  border: 1px solid rgb(142, 208, 235);
  background: #dff4f7;
  border-radius: 2px;
  margin-bottom: 1px;
  text-align: center;
}
</style>
