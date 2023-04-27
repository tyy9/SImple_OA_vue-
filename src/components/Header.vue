<template>
  <div style="line-height: 60px; display: flex">
    <div style="font-size: 20px; flex: 1">
      <span
        :class="collapsebtn"
        style="cursor: pointer"
        @click="changecollapse"
      ></span>
    </div>
    <el-dropdown
      style="
        width: 70px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        margin-right: 10px;
      "
    >
      <span
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          margin-right: 5px;
        "
      >
        <img
          :src="userinfo.avatarUrl"
          style="
            width: 30px;
            height: 30px;
            line-height: 60px;
            border-radius: 50%;
          "
        />
      </span>
      <span> {{ userinfo.username }}</span>
      <i
        class="el-icon-arrow-down"
        style="margin-left: 5px; line-height: 60px"
      ></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link
            to="/userinfo"
            style="text-decoration: none; color: black"
            >个人信息</router-link
          ></el-dropdown-item
        >
        <el-dropdown-item>
          <!-- <router-link to="/login" style="text-decoration: none; color: black"
            >退出</router-link
          > -->
          <span @click="register">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import cookie from "js-cookie";
import { error } from "console";
import Login from "@/api/Login";
import RoleMenu from "../api/RoleMenu";
import user from "../api/user";
import { ServerIp } from '../../public/config'
export default {
  props: {
    collapsebtn: String,
  },
  data() {
    return {
      userinfo: {},
    };
  },
  methods: {
    changecollapse() {
      this.$emit("parentMethod");
    },
    register() {
      console.log(1);
      cookie.set("token", "", { domain: `${ServerIp}` });
      cookie.set("userinfo", "", { domain: `${ServerIp}` });
      // cookie.set("menuList", "", { domain: `${ServerIp}` });
      this.$router.push("/login");
    },
    checktoken() {
      Login.checktoken().then((res) => {
        console.log("log=>", res);
        const userinfo = JSON.stringify(res.data.user);
        cookie.set("userinfo", userinfo, { domain: `${ServerIp}` });
        const Stringinfo = cookie.get("userinfo");
        //对string类型的信息进行json转换
        this.userinfo = JSON.parse(Stringinfo);
        //根据用户信息找到相应的菜单列表
        // user.getUserMenu(this.userinfo).then((res) => {
        //   console.log("用户菜单列表=>", res);
        //   const menuList = JSON.stringify(res.data.menulist);
        //   cookie.set("menuList", menuList, { domain: "localhost" });
          
        // });
        
        
        
      });
      //强制刷新一次页面，将菜单数据刷新  
      
    },
  },
  created() {
    // const Stringinfo = cookie.get("userinfo");
    // console.log(1);
    // //对string类型的信息进行json转换
    // this.userinfo = JSON.parse(Stringinfo);
    this.checktoken();
    if (window.location.href.indexOf("#reloaded") == -1) {
            window.location.href = window.location.href + "#reloaded";
            this.$forceUpdate
            window.location.reload();
          }
  },
};
</script>