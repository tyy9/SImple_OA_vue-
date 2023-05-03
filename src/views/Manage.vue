<template>
  <div class="home" style="height: 100%">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside
        :width="dynamic_px + 'px'"
        style="background-color: rgb(238, 241, 246); height: 100%"
      >
        <Aside :textshow="textshow" :isCollapse="isCollapse"></Aside>
      </el-aside>

      <el-container>
        <el-header
          style="border-bottom: 1px solid #ccc;"
        >
          <Header :collapsebtn="collapsebtn"  @parentMethod="changecollapse"></Header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
   
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import user from "@/api/user";
import Aside from "@/components/Aside"
import Header from "@/components/Header.vue";
import tree from '../../../../../guli/源码/day18/前端整合代码/element-ui依赖/element-ui/packages/table/src/store/tree';
import cookie from"js-cookie"
import { ServerIp } from "../../public/config";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
      collapsebtn: "el-icon-s-fold",
      
      
    };
    return {
      userdata: {},
      collapsebtn: "el-icon-s-fold",
      total: 0,
      page: 1,
      limit: 5,
      sysUser: {},
      dialogFormVisible: false,
      form:{},
      textshow: true,
      dynamic_px: 200,
      isCollapse:false
    };
  },
  methods: {
    changecollapse() {
      this.isCollapse = !this.isCollapse; //取消收缩
      if (this.isCollapse) {
        this.dynamic_px = 56;
        this.collapsebtn = "el-icon-s-unfold";
        this.textshow = false;
      } else {
        this.dynamic_px = 200;
        this.collapsebtn = "el-icon-s-fold";
        this.textshow = true;
      }
    },
    
  },
  created() {
    this.textshow=true
    user.getUnpass_UserCount().then(res=>{
      cookie.set("notify_count", res.data.count, { domain: `${ServerIp}` });
    })
  },
  components:{
    Aside,
    Header
  }
};
</script>
