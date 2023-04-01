<template>
  <div class="home" style="height: 100%">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside
        :width="dynamic_px + 'px'"
        style="background-color: rgb(238, 241, 246); height: 100%"
      >
        <el-menu
          :default-openeds="['1', '3']"
          style="height: 100%; overflow: hidden; overflow-x: hidden"
          background-color="rgb(48, 65, 86)"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse-transition="false"
          :collapse="isCollapse"
        >
          <div style="height: 60px; line-height: 60px; text-align: center">
            <b style="color: white" v-show="textshow">后台管理</b>
          </div>
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-message"></i>
              <span slot="title">导航一</span></template
            >
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-menu"></i>
              <span slot="title">导航二</span></template
            >
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"
              ><i class="el-icon-setting"></i>
              <span slot="title">导航三</span></template
            >
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="3-1">选项1</el-menu-item>
              <el-menu-item index="3-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="3-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="3-4">
              <template slot="title">选项4</template>
              <el-menu-item index="3-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header
          style="font-size: 12px;
            height: auto;
            display: flex;
            line-height: 60px;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;"
        >
          <div style="font-size: 20px; flex: 1">
            <span
              :class="collapsebtn"
              style="cursor: pointer"
              @click="changecollapse"
            ></span>
          </div>
          <el-dropdown style="width: 70px; cursor: pointer">
            <span> 王小虎</span>
            <i class="el-icon-arrow-down" style="margin-left;: 5px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <el-main>
          <div class="search_header">
            <el-input
              v-model="sysUser.username"
              placeholder="请输入内容"
              style="width: 200px; margin-right: 5px"
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="onsubmit"
              >搜索</el-button
            >
          </div>
          <div class="tools" style="margin-top: 5px">
            <el-button type="primary" @click="dialogFormVisible = true"
              >新增</el-button
            >
          </div>
          <el-table :data="userdata">
            <el-table-column prop="createTime" label="日期" width="140">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="findUserById(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="open(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="getUserList"
            :current-page.sync="page"
            :page-size="limit"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
          <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </div>
    </el-dialog>
        </el-main>
      </el-container>
    </el-container>
   
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import user from "@/api/user";
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
      dynamic_px: 200,
      textshow: true,
    };
    return {
      userdata: {},
      collapsebtn: "el-icon-s-fold",
      total: 0,
      page: 1,
      limit: 5,
      sysUser: {},
      dialogFormVisible: false,
      form:{}
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
};
</script>
