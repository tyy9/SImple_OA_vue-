<template>
  <div class="box">
    <div class="contains">
      <div class="tittle">
        <b>登录</b>
      </div>
      <div class="inputbox">
        <el-form
          :model="sysuser"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              class="inputtools"
              placeholder="请输入用户名"
              v-model="sysuser.username"
              prefix-icon="el-icon-user"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              class="inputtools"
              placeholder="请输入密码"
              v-model="sysuser.password"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="权限选择" :label-width="formLabelWidth">
          <el-select v-model="sysuser.role" placeholder="请选择权限">
            <el-option v-for="item in roleList" :key="item" :label="item.name"  :value="item.flag"></el-option>
        </el-select>
        </el-form-item>
        </el-form>
      </div>
      <div class="enterbtn_box">
        <el-button class="enterbtn" type="primary" @click="login" plain
          >登录</el-button
        >
        <el-button class="enterbtn" type="success" plain>
          <router-link
            to="/register"
            style="text-decoration: none; color: black"
            >注册</router-link
          >
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/api/Login";
import cookie from "js-cookie";
import user from "../api/user";
import Role from "@/api/Role"
import { ServerIp } from "../../public/config";
export default {
  data() {
    return {
      sysuser: {},
      roleList:{},
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          { min: 1, max: 20, message: "长度在 1 到 20个字符", trigger: "blur" },
        ],
      },
      timeout:5
    };
  },
  methods: {
    login() {
      this.$refs["ruleForm"].validate((vaild) => {
        if (vaild) {
          Login.login(this.sysuser).then((res) => {
            console.log(res);
            //将token放入cookie中
            cookie.set("token", res.data.token, { domain: `${ServerIp}` });
            console.log(cookie.get("token"));
            //在跳转之前对token进行检查并把用户信息保存在cookie中
            Login.checktoken().then((res) => {
              console.log("log=>", res);
              const userinfo = JSON.stringify(res.data.user);
              cookie.set("userinfo", userinfo, { domain: `${ServerIp}` });
              
              user.getUserMenu(res.data.user).then((res) => {
                console.log("用户菜单列表=>", res);
                const menuList = JSON.stringify(res.data.menulist);
                cookie.set("menuList", menuList, { domain: `${ServerIp}` });
                //强制刷新一次页面，将菜单数据刷新
                // if (window.location.href.indexOf("#reloaded") == -1) {
                //   window.location.href = window.location.href + "#reloaded";

                //   window.location.reload();
                // }
              });
              let time=setInterval(() => {
                  console.log(this.timeout)
                  --this.timeout
                  
                  if(this.timeout==0){
                    this.$router.push("/home")
                    clearInterval(time)
                  }
                }, 1000);

            });
            
          });
          
        } else {
          return false;
        }
      });
    },
  },
  created () {
      Role.getAllRole().then(res=>{
        this.roleList=res.data.data
      })
    }
};
</script>

<style>
.box {
  height: 100%;
  overflow: hidden;
  background-image: linear-gradient(to bottom right, #ffb891, #1f69f066);
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.contains {
  width: 500px;
  height: auto;
  margin: 0 auto;
  border: 1px solid black;
  background-color: #fff;
  text-align: center;
}
.tittle {
  font-size: 30px;
  height: 60px;
  line-height: 60px;
}
.contains .inputbox {
  margin: 20px;
}
.contains .inputbox .inputtools {
  margin-bottom: 5px;
}
.contains .enterbtn_box {
  float: right;
}
.contains .enterbtn_box .enterbtn {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>