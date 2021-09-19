<template>
  <div>
    <el-button type="primary" @click="goBack">← 返回</el-button>

    <div>
      <div>
        <div class="contentItemStype"><span class="formNotNullStype">*</span>账户变动时间：</div>
        <div class="block">
          <el-date-picker
            v-model="changeTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>        
      </div>

      <div>
        <div class="contentItemStype"><span class="formNotNullStype">*</span>价格：</div>
        <div>
          <el-input-number v-model="price" :precision="2" :step="0.1" :min="0"></el-input-number>
        </div>        
      </div>

      <div>
        <div class="contentItemStype"><span class="formNotNullStype">*</span>类型：</div>
        <div>
          <el-select v-model="type" placeholder="请选择" @change="onTypeChange">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>          
        </div>        
      </div>

      <div>
        <div class="contentItemStype"><span class="formNotNullStype">*</span>渠道：</div>
        <div>
          <el-select v-model="channelId" placeholder="请选择">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>          
        </div>        
      </div> 

      <div class="block">
        <div class="contentItemStype"><span class="formNotNullStype">*</span>类别：</div>
        <el-cascader
          v-model="categoryIdList"
          :options="categoryList"
          :props="{ checkStrictly: true }"
          clearable></el-cascader>
      </div>

      <div>
        <div class="contentItemStype">标签：</div>
        <div>
          <el-select v-model="tagIdList" multiple placeholder="请选择">
            <el-option
              v-for="item in tagList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>          
        </div>        
      </div>      

      <div>
        <div class="contentItemStype">备注：</div>
        <div>
          <el-input v-model="remark" placeholder="备注"></el-input>
        </div>        
      </div>      

      <div class="contentItemStype" style="text-align: center;">
        <el-button type="success" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MoneyRecordAdd",
  data() {
    return {
      userMobile: null,
      changeTime: this.dateFormat(new Date()),
      price:0.00,
      remark: null,
      tagList: [],
      // 所选的标签
      tagIdList: '',
      categoryList: [],
      type: 1,
      typeList: [
        {
          value: 1,
          label: "支出"
        },
        {
          value: 2,
          label: "收入"
        }
      ],
      // 所选类别
      categoryIdList: null,
      channelList: [],
      // 所选渠道
      channelId: null,
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
      this.userMobile = this.$route.query.userMobile;

      this.requestTagList();
      this.requestCategoryList();
      this.requestChannelList();
    },

    // 请求标签列表
    requestTagList() {
      let params = {
        userMobile: this.userMobile
      }
      axios.post("api/moneyTag/findUserTagList", params).then(
        (response) => {
          this.tagList = response.data.data;
        },
        (response) => {
          this.$message.error("查询用户标签请求失败！");
        }
      );
    },

    // 请求类别列表
    requestCategoryList() {
      let params = {
        type: this.type
      }
      axios.post("api/moneyCategory/tree", params).then(
        (response) => {
          this.categoryList = response.data.data;
        },
        (response) => {
          this.$message.error("类别列表请求失败！");
        }
      );
    },

    // 请求渠道列表
    requestChannelList() {
      let params = {
        type: this.type
      }
      axios.post("api/moneyChannel/listByType", params).then(
        (response) => {
          this.channelList = response.data.data;
        },
        (response) => {
          this.$message.error("渠道列表请求失败！");
        }
      );
    },

    // 类型切换了
    onTypeChange() {
      this.requestCategoryList();
      this.requestChannelList();
    },

    // 格式化时间
    dateFormat(d) {
      return d.getFullYear() + '-' + ((d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))) +
      '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
      ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
    },

    // 保存
    save() {
        if (this.price === 0) {
          this.$message.error("请先选择价格！");
          return
        }
        if (this.categoryIdList == null || this.categoryIdList.lenght == 0) {
          this.$message.error("请先选择类别！");
          return
        }
        var categoryIdLast = null;
        this.categoryIdList.forEach(element => {
          categoryIdLast = element;
        });
        
        var tagIds = null;
        if (this.tagIdList != null && this.tagIdList.length > 0) {
          for (let index = 0; index < this.tagIdList.length; index++) {
            const element = this.tagIdList[index];
            if (tagIds == null) {
              tagIds = element;
            } else {
              tagIds = (tagIds + "," + element);
            }
          }
        }
        let params = {
          userMobile: this.userMobile,
          price: this.price,
          changeTime: this.changeTime,
          categoryId: categoryIdLast,
          channelId: this.channelId,
          tagIds: tagIds,
          remark: this.remark
        }
        
        let that = this;

        axios.post("api/moneyRecord/save", params).then(
        (response) => {
          this.$message({
            message: '新增成功！',
            type: 'success'
          });
          setTimeout(function(){
            that.goBack()
          }, 1000);
        },
        (response) => {
          this.$message.error("操作失败！");
        }
      );
    },

  },
};
</script>


<style>
.contentItemStype {
  margin-top: 10px;
}
.formNotNullStype {
  color: red;
}
</style>
