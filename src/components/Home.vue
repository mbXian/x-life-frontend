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
    <!-- <div class="contentItemStype">
      <el-button type="primary" @click="test">test</el-button>
    </div> -->

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
        <span style="color: gray">version: v1.2.7</span>
      </span>
    </div>

    <el-dialog title="登录" :visible.sync="dialogLoginVisible" width="90%">
      <el-form>

        <el-form-item label="手机号">
          <el-input v-model="userMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLoginVisible = false">取 消</el-button>
        <el-button type="primary" @click="onLogin">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import storage from 'store'

export default {
  name: "Home",
  data() {
    return {
      // 登录弹窗显示
      dialogLoginVisible: false,
      formLabelWidth: '120px',
      userMobile: null,
      password: null,
      userLoginVO: {},
    };
  },

  created() {
    storage.set('client_id', 'ben_client');
    storage.set('client_secret', 'ben_secret');
  },

  methods: {
    // 跳转到天气
    goToWeather() {
      this.$router.push('/weather');
    },

    // 跳转到记账
    goToMoneyRecord() {
      if (storage.get('userLoginVO')) {
        this.$router.push({path:'/moneyRecord', query: null}); 
      } else {
        this.dialogLoginVisible = true;
      }
    },

    // 登录
    onLogin() {
      if (this.userMobile == null || this.userMobile.lenght == 0) {
        this.$message.error("请输入手机号！");
        return
      }
      if (this.password == null || this.password.lenght == 0) {
        this.$message.error("请输入密码！");
        return
      }

      let urlString = "api/oauth/token?username=" + this.userMobile + "&password=" + this.password + "&grant_type=password&client_id=" + storage.get('client_id') + "&client_secret=" + storage.get('client_secret');
      axios.post(urlString).then(
        (response) => {
          this.userLoginVO = response.data;
          if (this.userLoginVO) {
            // 存储登录信息
            storage.set('userLoginVO', this.userLoginVO);
            this.dialogLoginVisible = false;
            this.goToMoneyRecord();
          } else {
            this.$message.error("登录失败！");  
          }
        },
        (response) => {
          this.$message.error("登录请求失败！");
        }
      );   
    },

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
.valueIconStype {
  width: 30px;
  height: 30px;
}
</style>
