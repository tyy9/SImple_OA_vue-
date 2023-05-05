<template>
    <div class="box">
      <div class="contains">
        <div class="tittle">
          <b>注册</b>
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
          <el-form-item label="别称" prop="nickname">
            <el-input
              class="inputtools"
              placeholder="请输入别称"
              v-model="sysuser.nickname"
              prefix-icon="el-icon-lock"

            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              class="inputtools"
              placeholder="请输入邮箱"
              v-model="sysuser.email"
              prefix-icon="el-icon-lock"

            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input
              class="inputtools"
              placeholder="请输入电话"
              v-model="sysuser.phone"
              prefix-icon="el-icon-lock"

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
          <el-button class="enterbtn" type="primary" @click="register" plain
            >注册</el-button
          >
          <el-button class="enterbtn" type="success" plain>
            <router-link to="/login" style="text-decoration: none;color: black  ;">取消</router-link>
        </el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Login from "@/api/Login";
  import Role from "@/api/Role"
  export default {
    data() {
      return {
        sysuser: {},
        roleList:{},
        rules:{
          username:[
              {
                  required: true, message: '请输入用户名', trigger: 'blur' 
              },
              { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password:[
              {
                  required: true, message: '请输入密码', trigger: 'blur' 
              },
              { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
          ],
          nickname:[
              {
                  required: true, message: '请输入别名', trigger: 'blur' 
              },
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          email:[
              {
                  required: true, message: '请输入邮箱', trigger: 'blur' 
              },
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          phone:[
              {
                  required: false, message: '请输入电话', trigger: 'blur' 
              },
              { min: 13, max: 13, message: '长度在13 个字符', trigger: 'blur' }
          ],
          }
      };
    },
    methods: {
        register() {
          this.$refs['ruleForm'].validate((vaild)=>{
              if(vaild){
                  Login.register(this.sysuser).then((res) => {
                    this.$message({
                      message:"注册成功,请等待管理员审核通过",
                      type:"success"
                    })
                      this.$router.push("/login")
                      
                  });
              }else{
                  return false
              }
          })
        
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