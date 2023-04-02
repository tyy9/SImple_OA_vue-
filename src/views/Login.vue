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
        </el-form>
      </div>
      <div class="enterbtn_box">
        <el-button class="enterbtn" type="primary" @click="login" plain
          >登录</el-button
        >
        <el-button class="enterbtn" type="success" plain>
            <router-link to="/register" style="text-decoration: none;color: black  ;">注册</router-link>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/api/Login";
export default {
  data() {
    return {
      sysuser: {},
      rules:{
        username:[
            {
                required: true, message: '请输入用户名', trigger: 'blur' 
            },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
            {
                required: true, message: '请输入密码', trigger: 'blur' 
            },
            { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
        ],
        }
    };
  },
  methods: {
    login() {
        this.$refs['ruleForm'].validate((vaild)=>{
            if(vaild){
                Login.login(this.sysuser).then((res) => {
                    this.$router.push("/")
                });
            }else{
                return false
            }
        })
      
    },
  },
  
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