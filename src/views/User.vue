<template>
    <div>
      <div class="tittle" style="margin-bottom: 10px;">
        <b>用户管理</b>
    </div>
        <div class="search_header">
            <el-input
              v-model="sysUser.username"
              placeholder="请输入名字"
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
            <el-button type="danger" slot="reference" @click="deletebatch">批量删除 <i class="el-icon-remove-outline"></i></el-button>
          </div>
          <el-table :data="userdata"   @selection-change="handleSelectionChange">
                  <el-table-column
            type="selection"
            width="55">
          </el-table-column>
            <el-table-column prop="createTime" label="日期" width="140">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="nickname" label="别名" width="120">
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="120">
            </el-table-column>
            <el-table-column prop="role" label="权限" width="120">
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
          <el-dialog :title="!form.id?'用户添加':'用户编辑'" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" :label-width="formLabelWidth">
          <el-select v-model="form.role" placeholder="请选择用户权限">
      <el-option label="管理员" value="ROLE_ADMIN"></el-option>
      <el-option label="学生" value="ROLE_STUDENT"></el-option>
      <el-option label="教师" value="ROLE_TEACHER"></el-option>
    </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addORupadte"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    </div>
</template>
<script>
import user from "@/api/user";
import cookie from "js-cookie";
import { Message, MessageBox } from 'element-ui'
export default {
    name: "User",
  data() {
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
      isCollapse:false,
      multiselect:{}
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
          this.updatedUser()
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
        //判断修改用户权限时，当前用户与被修改用户是否一致，如果是则需重新登录
        const Stringinfo = cookie.get("userinfo");
        //对string类型的信息进行json转换
        const userinfo = JSON.parse(Stringinfo);
        console.log(userinfo)
        if(this.form.id==userinfo.id){
          MessageBox.alert(res.message, '以修改当前登录用户的权限，请重新登录', {
                confirmButtonText: '确定',
                type: 'success'
            })
          cookie.set("token", "", { domain: "localhost" });
      cookie.set("userinfo", "", { domain: "localhost" });
      
      this.$router.push("/login");
      
        }
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
    },
    handleSelectionChange(val){
      console.log(val)
      this.multiselect=val
    },
    deletebatch(){
      let ids=this.multiselect.map(v=>v.id)
      console.log(ids)
      this.$confirm('此操作将永久删除所选文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          user.deleteUserbatch(ids).then(res=>{
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