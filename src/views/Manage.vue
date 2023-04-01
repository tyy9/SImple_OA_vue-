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
    getUserList(page = 1) {//分页
      this.page = page;
      user.pageUser(this.page, this.limit, this.sysUser).then((res) => {
        console.log(res);
        this.userdata = res.data.data;
        this.total = res.data.total;
      });
    },
    onsubmit() {//按需查询
      user.pageUser(this.page, this.limit, this.sysUser).then((res) => {
        console.log(res);
        this.userdata = res.data.data;
        this.total = res.data.total;
      });
    },
    addUser(){
      user.addUser(this.form).then(res=>{
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.dialogFormVisible=false
        this.getUserList()
      })
    },
    //回显
    findUserById(id){
      this.dialogFormVisible=true
      user.findUserById(id).then(res=>{
        console.log(res)
        this.form=res.data.user
      })
    },
    //更新与添加通用接口
    addORupadte(){
      if(!this.form.id){
        this.addUser()
      }else{
          this.updateUser()
      }
    },
    //更新
    updatedUser() {
      user.updateUser(this.form).then(res=>{
        this.$message({
          showClose: true,
          message: '更新成功',
          type: 'success'
        })
        this.dialogFormVisible=false
        this.getUserList()
      })
    },
    //删除弹窗
    open(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          user.deleteUser(id).then(res=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getUserList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  created() {
    this.getUserList();
    this.textshow=true
  },
  components:{
    Aside,
    Header
  }
};
</script>
