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
          <router-link to="/userinfo" style="text-decoration: none; color: black"
            >个人信息</router-link
          ></el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/login" style="text-decoration: none; color: black"
            >退出</router-link
          >
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import cookie from "js-cookie";

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
      this.$router.push("/login");
    },
  },
  created() {
    const Stringinfo = cookie.get("userinfo");
    //对string类型的信息进行json转换
    this.userinfo = JSON.parse(Stringinfo);
  },
};
</script>