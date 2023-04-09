<template>
  <el-menu
    :default-openeds="['1', '3']"
    style="height: 100%; overflow: hidden; overflow-x: hidden"
    background-color="rgb(48, 65, 86)"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse-transition="false"
    :collapse="isCollapse"
    router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <b style="color: white" v-show="textshow">后台管理</b>
    </div>
    <div class="menuaside" v-for="item in menuList" :key="item.id">
      <div v-if="item.path">
        <el-menu-item :index="item.path">
          <template slot="title"
            ><i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span></template
          >
        </el-menu-item>
      </div>
      <div v-else>
        <el-submenu :index="item.path">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <div v-for="item2 in item.children" :key="item2.id">
            <el-menu-item :index="item2.path">
              <i :class="item2.icon"></i>
              <span slot="title">{{item2.name}}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </div>

    <!-- <el-menu-item index="/home">
      <template slot="title"
        ><i class="el-icon-message"></i>
        <span slot="title">首页</span></template
      >
    </el-menu-item> -->
    <!-- <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">系统管理</span>
      </template>
      <el-menu-item index="/user">
        <i class="el-icon-s-custom"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="/file">
        <i class="el-icon-s-custom"></i>
        <span slot="title">文件管理</span>
      </el-menu-item>
      <el-menu-item index="/role">
        <i class="el-icon-s-custom"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
      <el-menu-item index="/Menu">
        <i class="el-icon-s-custom"></i>
        <span slot="title">菜单管理</span>
      </el-menu-item>
    </el-submenu> -->
  </el-menu>
</template>
<script>
import cookie from "js-cookie";
export default {
  props: {
    textshow: Boolean,
    isCollapse: Boolean,
  },
  data: {
    return: {
      menuList: [],
    },
  },
  created() {
    this.menuList = JSON.parse(cookie.get("menuList"));
    console.log("aside_menu=>", this.menuList);
  },
};
</script>