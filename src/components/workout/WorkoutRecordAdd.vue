<template>
  <div>
    <el-button type="primary" @click="goBack">← 返回</el-button>

    <div>
      
      <div>
        <div class="contentItemStype"><span class="formNotNullStype">*</span>开始时间：</div>
        <div class="block">
          <el-date-picker
            v-model="startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>        
      </div>

      <div>
        <div class="contentItemStype"><span class="formNotNullStype">*</span>结束时间：</div>
        <div class="block">
          <el-date-picker
            v-model="endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>        
      </div>           

      <div class="contentItemStype">
        <div v-for="recordDetail in workoutRecordDetailList" :key="recordDetail.id" class="recordDetailStype">
          <span>
           {{recordDetail.name}}:
          </span>
          <span>
           {{recordDetail.count}}
          </span>
          <span>
           {{recordDetail.unit}}
          </span>

          <el-button type="danger" icon="el-icon-delete" size="mini" style="float:right;" @click="onDelete(recordDetail)"></el-button>
        </div>
      </div>

      <div style="margin-top: 10px; text-align: center;">
          <el-button type="primary" @click="add" class="contentItemStype" style="width: 200px;">添加项目</el-button>
      </div>

      <div style="margin-top: 10px; text-align: center;">
          <el-button type="success" style="width: 200px;" @click="submit">提交</el-button>
      </div>

    </div>

    <el-dialog title="添加" :visible.sync="dialogAddVisible" width="90%">
      <el-form>

        <el-form-item label="类型:">
          <el-select v-model="typeId" placeholder="请选择" @change="onTypeChange">
            <el-option
              v-for="item in workoutTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>          
        </el-form-item>

        <el-form-item label="单位:">
          <span>
            {{typeVO.unit}}
          </span>
        </el-form-item>

        <el-form-item label="数量:">
          <el-input-number v-model="count" :min="0" label="请输入数量"></el-input-number>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddConfirm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WorkoutRecordAdd",
  data() {
    return {
      // 运动健身类型列表
      workoutTypeList: [],
      // 开始时间
      startTime: this.dateFormat(new Date()),
      // 结束时间
      endTime: this.dateFormat(new Date()),
      // 运动健身记录明细集合
      workoutRecordDetailList: [],
      // 添加弹窗显示
      dialogAddVisible: false,
      // 添加的类型ID
      typeId: null,
      // 添加的类型VO
      typeVO: {},
      // 数量
      count: 0,
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

      this.requestWorkoutTypeList();
    },

    // 格式化时间
    dateFormat(d) {
      return d.getFullYear() + '-' + ((d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))) +
      '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
      ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
    },

    // 查询运动健身类型列表
    requestWorkoutTypeList() {
      axios.post("api/workoutType/list").then(
        (response) => {
          this.workoutTypeList = response.data.data;
          if (this.workoutTypeList.length > 0) {
            this.typeId = this.workoutTypeList[0].id;
            this.typeVO = this.workoutTypeList[0];
          }
        },
        (response) => {
          this.$message.error("运动健身类型列表请求失败！");
        }
      );        
    },

    // 添加
    add() {
      this.dialogAddVisible = true;
    },

    // 选择类型
    onTypeChange() {
      this.workoutTypeList.forEach(element => {
        if (element.id == this.typeId) {
          this.typeVO = element;
        }
      });
    },

    // 删除添加的
    onDelete(recordDetail){
      //表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
      this.workoutRecordDetailList.splice(this.workoutRecordDetailList.indexOf(recordDetail), 1);
    },

    // 添加完成
    onAddConfirm() {
      this.workoutRecordDetailList.push({
        'id': Math.ceil(Math.random()*1000),
        'typeId': this.typeId,
        'count': this.count,
        'name': this.typeVO.name,
        'unit': this.typeVO.unit,
        'groups': 1
      })

      this.dialogAddVisible = false;
    },

    // 提交
    submit() {
      console.log(this.startTime + ', ' + this.endTime);
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        latitude: null,
        longitude: null,
        recordDetailSaveDTOList: this.workoutRecordDetailList
      }
      
      let that = this;

      axios.post("api/workoutRecord/save", params).then(
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
.recordDetailStype {
  border: 1px solid gray;
  border-radius: 4px;
  margin-top: 5px;
  height: 28px;
}
</style>
