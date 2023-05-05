<template>
  <div>
    <div class="tittle" style="margin-bottom: 10px">
      <b>评论管理</b>
    </div>
    <el-input
      v-model="search.username"
      placeholder="请输入用户名"
      style="width: 200px; margin-right: 5px"
    ></el-input>

      <el-input
      v-model="search.content"
      placeholder="请输入评论内容"
      style="width: 200px;margin-left: 5px;"
    ></el-input>
    <el-button type="primary" icon="el-icon-search" @click="onsubmit"
      >搜索</el-button>

      <!-- 搜索头 -->
    <div class="tools" style="margin-top: 10px; margin-bottom: 10px">
      <el-button type="danger" slot="reference" @click="deletebatch"
        >批量删除 <i class="el-icon-remove-outline"></i
      ></el-button>
    </div>
    <el-table
      :data="UserCommentData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      height="500"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="checkSelectable"
       
      >
      </el-table-column>
      <el-table-column prop="id" label="用户id/评论id" sortable width="100" >
      </el-table-column>
      <el-table-column prop="username" label="用户名称" sortable width="180">
      </el-table-column>
      <el-table-column prop="avatarUrl" label="用户头像" sortable width="100">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" width="50px" height="50px" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户别名" sortable width="100">
      </el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        height="200"
        style="overflow: hidden"
      >
        <template slot-scope="scope">
          <span v-html="scope.row.content">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reply_id" label="回复用户id" width="100"> </el-table-column>
      <el-table-column prop="replyuser_username" label="回复用户名" width="100">
      </el-table-column>
      <el-table-column prop="replyuser_nickname" label="回复别名" width="100">
      </el-table-column>
      <el-table-column prop="reply_content" label="回复用户评论" width="100" height="200"
        style="overflow: hidden">
        <template slot-scope="scope">
          <span v-html="scope.row.reply_content">{{ scope.row.reply_content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="addchildcomment(scope.row.id)"
            style="margin-bottom: 5px"
            v-show="scope.row.content ? false : true"
            >添加评论</el-button
          >
          <el-button
            size="mini"
            @click="findCommentById(scope.row.id)"
            style="margin-bottom: 5px"
            v-show="!scope.row.content ? false : true"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="open(scope.row.id)"
            style="margin-bottom: 5px"
            v-show="!scope.row.content ? false : true"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getUserCommentList"
        :current-page.sync="page"
        :page-size="limit"
        layout="total, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getUserCommentList"
      :current-page.sync="page"
      :page-size="limit"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="!form.id ? '评论添加' : '评论编辑'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="评论内容" :label-width="formLabelWidth"> 
            <VueTinymce id="tinymce" v-model="form.content"></VueTinymce>
        </el-form-item>
        <el-form-item label="评论教师" :label-width="formLabelWidth">
          <el-select v-model="form.teacherId" placeholder="请选择教师">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论课程" :label-width="formLabelWidth">
          <el-select
            v-model="form.courseId"
            placeholder="请选择课程"
            @change="findCourse"
          >
            <el-option
              v-for="item in coursedata"
              :key="item"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addORupadte">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  <script>
import menu from "@/api/Menu";
import Comment from "../api/Comment";
import user from '@/api/user';
import course from "@/api/Course";
export default {
  data() {
    return {
      Menusearch: {},
      UserCommentData: [{}],
      dialogFormVisible: false,
      form: {},
      multiselect: {},
      rolemenu_idlist: {},
      total: 0,
      limit: 5,
      page: 1,
      search:{},
      reply_userlist:[],
      selected:""
    };
  },
  methods: {
    //防止选择用户id
    checkSelectable(val) {
      if (val.content != null) {
        return true;
      } else {
        return false;
      }
    },
    getUserCommentList() {
      Comment.pageUser_Comment(this.page, this.limit, this.search).then(
        (res) => {
          console.log(res);
          this.UserCommentData = res.data.data.records;
          this.total = res.data.data.total;
          console.log("MenuData=>", this.MenuData);
        }
      );
    },
    //按需查询
    onsubmit(){
        Comment.pageUser_Comment(this.page, this.limit, this.search).then(
        (res) => {
          console.log(res);
          this.UserCommentData = res.data.data.records;
          this.total = res.data.data.total;
          console.log("MenuData=>", this.MenuData);
        }
      );
    },
    addORupadte() {
      if (!this.form.id) {
        this.addComment();
      } else {
        this.updatedMenu();
      }
    },
    addComment() {
        
      Comment.addComment(this.form).then((res) => {
        this.$message({
          message: "成功发布",
          type: "success",
        });
        console.log(res);
        this.dialogFormVisible = false;
        this.getUserCommentList()
      });
    },
    addchildcomment(id) {
      this.form.userId=id
      this.dialogFormVisible = true;
      user.getUserByRole("ROLE_TEACHER").then((res) => {
        this.teacherList = res.data.userlist;
      });
      course.findAllCourse().then((res) => {
        this.coursedata = res.data.data;
      });
    },
    findCommentById(id) {
      this.dialogFormVisible = true;
      user.getUserByRole("ROLE_TEACHER").then((res) => {
        this.teacherList = res.data.userlist;
      });
      course.findAllCourse().then((res) => {
        this.coursedata = res.data.data;
      });
      Comment.findCommentById(id).then((res) => {
        console.log(res);
        this.form = res.data.comment;
      });
    },
    updatedMenu() {
      menu.updateMenu(this.form).then((res) => {
        this.$message({
          showClose: true,
          message: "更新成功",
          type: "success",
        });
        this.form = "";
        this.dialogFormVisible = false;
        this.getMenuList();
      });
    },
    //删除弹窗
    open(id) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Comment.deleteCommentById(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getUserCommentList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deletebatch() {
      let ids = this.multiselect.map((v) => v.id);
      console.log("tolemenu_idlist=>", this.rolemenu_idlist);
      console.log(ids);
      this.$confirm("此操作将永久删除所选菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Comment.deleteCommentbatch(ids).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getUserCommentList();
          });   
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multiselect = val;
      //=========================================
      //获取当前菜单的父菜单与子菜单对象数组
      const menudata = val;
      console.log("data=>", menudata);
      const totalmenu_idArray = menudata.map((v) => v.id);
      console.log("totalmenu_idArray=>", totalmenu_idArray);
      const childrenmenu_Array = menudata.map((v) => v.children);
      console.log("childrenmenu_Array=>", childrenmenu_Array);
      const childrenmenu_idArray = [];
      //获取子菜单的id
      childrenmenu_Array.forEach((item, index) => {
        if (item.length > 0) {
          item.forEach((item2, index2) => {
            childrenmenu_idArray.push(item2.id);
          });
        }
      });
      console.log("childrenmenu_idArray=>", childrenmenu_idArray);
      //去重
      const filter = totalmenu_idArray.filter((item) =>
        childrenmenu_idArray.every((x) => x != item)
      );
      this.rolemenu_idlist = filter;
      console.log("tolemenu_idlist=>", this.rolemenu_idlist);
    },
  },
  created() {
    this.getUserCommentList();
  },
};
</script>
<style>
/* 在el-dialog中tinymce z-index 被太小而被遮挡时要加这两句 */
.tox-tinymce-aux {
  z-index: 99999 !important;
}
.tinymce.ui.FloatPanel {
  z-index: 99;
}
</style>