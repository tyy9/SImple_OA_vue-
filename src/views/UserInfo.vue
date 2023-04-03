<template>
  <div style="">
    <div style="margin-bottom: 40px; font-size: 50px">
      <b>个人信息</b>
    </div>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      style="width: 300px; border: 1px solid black; padding: 30px"
    >
      <el-form-item label="用户名称">
        <el-input v-model="userinfo.username" disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户别称">
        <el-input v-model="userinfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户地址">
        <el-input v-model="userinfo.address"></el-input>
      </el-form-item>
      <el-form-item label="用户电话">
        <el-input v-model="userinfo.phone"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱">
        <el-input v-model="userinfo.email"></el-input>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input v-model="userinfo.password" show-password></el-input>
      </el-form-item>
      <span>用户头像(点击更换)</span>
      <el-upload
        class="avatar-uploader"
        action="http://localhost:8001/my_oa/oss/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="userinfo.avatarUrl" :src="userinfo.avatarUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="btnbox">
        <el-button type="success" @click="updateUser">保存</el-button>
        <el-button type="">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import cookie from "js-cookie";
import user from "@/api/user"
import { type } from 'os';
export default {
  data() {
    return {
      userinfo: {},
    };
  },
  created() {
    const Stringinfo = cookie.get("userinfo");
    console.log(Stringinfo);
    //对string类型的信息进行json转换
    this.userinfo = JSON.parse(Stringinfo);
  },
  methods:{
    handleAvatarSuccess(res, file) {
        this.userinfo.avatarUrl=res.data.url
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      updateUser(){
        user.updateUser(this.userinfo).then(res=>{
          this.$message({
            type:'success',
            message:"修改成功,请重新登录"
          })
          
          this.$router.push("/login")
        })
      }
  }
};
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>