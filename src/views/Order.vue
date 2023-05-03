<template>
  <div>
    <div class="tittle" style="margin-bottom: 10px">
      <b>订单管理</b>
    </div>
    <div class="search_header">
      <el-input
        v-model="order.courseName"
        placeholder="请输入课程名字"
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
      <el-button type="danger" slot="reference" @click="deletebatch"
        >批量删除 <i class="el-icon-remove-outline"></i
      ></el-button>
    </div>
    <el-table :data="orderdata" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="gmtCreate" label="日期" width="140">
      </el-table-column>
      <el-table-column prop="courseName" label="课程名称" width="120">
      </el-table-column>
      <el-table-column prop="username" label="购买用户" width="120">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="120"> </el-table-column>
      <el-table-column prop="time_count" sortable label="倒计时" width="120">
        <template slot-scope="scope">
          {{ scope.row.time_count == null ? "无" : scope.row.time_count + "s" }}
        </template>
      </el-table-column>
      <el-table-column prop="status" sortable label="购买状态" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.status == 1" style="color: orange"
            >已购买</span
          >
          <span v-show="scope.row.status == 0" style="color: red">未付款</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :type="scope.row.status == 0 ? 'danger' : 'primary'"
            @click="status_update(scope.row.id, scope.row.status)"
            >{{ scope.row.status == 0 ? "支付" : "已支付" }}</el-button
          >
          <el-button size="mini" @click="findOrderById(scope.row.id)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="open(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getOrderList"
      :current-page.sync="page"
      :page-size="limit"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="!form.id ? '订单添加' : '订单编辑'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="课程选择" :label-width="formLabelWidth">
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
        <el-form-item label="用户id" :label-width="formLabelWidth">
          <el-input v-model="form.userId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单封面 " :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8001/my_oa/oss/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="requestHeader"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.courseAvatar" :src="form.courseAvatar" class="avatar" width="400px" height="300px" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="支付状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择支付状态">
      <el-option label="立即支付" value=true></el-option>
      <el-option label="稍后支付" value=false></el-option>
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
import user from "@/api/user";
import cookie from "js-cookie";
import order from "@/api/Order";
import course from "@/api/Course";
import { Message, MessageBox } from "element-ui";
export default {
  name: "User",
  data() {
    return {
      orderdata: {},
      collapsebtn: "el-icon-s-fold",
      total: 0,
      page: 1,
      limit: 5,
      order: {},
      dialogFormVisible: false,
      form: {},
      textshow: true,
      dynamic_px: 200,
      isCollapse: false,
      multiselect: {},
      coursedata: {},
      order_temp: "",
      requestHeader: {
        //未上传图片的请求头加token
        Authorization: cookie.get("token"),
      },
      description: "",
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
    getOrderList(page = 1) {
      //分页
      this.page = page;
      order.pageOrder(this.page, this.limit, this.order).then((res) => {
        console.log(res);
        this.orderdata = res.data.data;
        this.total = parseInt(res.data.total);
      });
      //获取课程数据
      course.findAllCourse().then((res) => {
        this.coursedata = res.data.data;
      });
    },
    onsubmit() {
      //按需查询
      order.pageOrder(this.page, this.limit, this.order).then((res) => {
        console.log(res);
        this.orderdata = res.data.data;
        this.total = parseInt(res.data.total);
      });
    },
    addOrder() {
      if(this.form.status){
        this.form.time=0
      }else{
        this.form.time=1
      }
      order.addOrder(this.form).then((res) => {
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success",
        });
        this.dialogFormVisible = false;
        this.getOrderList();
      });
    },
    //回显
    findOrderById(id) {
      this.dialogFormVisible = true;
      order.findOrderById(id).then((res) => {
        console.log(res);
        this.form = res.data.order;
      });
    },
    //更新与添加通用接口
    addORupadte() {
      if (!this.form.id) {
        this.addOrder();
      } else {
        this.updatedOrder();
      }
    },
    //更新
    updatedOrder() {
      console.log(this.description);
      order.updateOrder(this.form).then((res) => {
        this.$message({
          showClose: true,
          message: "更新成功",
          type: "success",
        });
        this.dialogFormVisible = false;
        this.getOrderList();
      });
    },
    //删除弹窗
    open(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          order.deleteOrderByid(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getOrderList();
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
    },
    deletebatch() {
      let ids = this.multiselect.map((v) => v.id);
      console.log(ids);
      this.$confirm("此操作将永久删除所选文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          order.deleteOrderByids(ids).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getOrderList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //OSS
    handleAvatarSuccess(res, file) {
      console.log(res.data);
      this.form.avatarUrl = res.data.url;
      this.$forceUpdate();
    },
    beforeAvatarUpload(file) {
      if (file.size > 0) {
        console.log("upload=>", file);
        this.file_flag = true;
      }
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 100;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    status_update(id, status) {
      order.findOrderById(id).then((res) => {
        console.log(res);
        this.order_temp = res.data.order;
        if (status) {
          this.order_temp.status = 0;
        } else {
          this.order_temp.status = 1;
        }
        order.updateOrder(this.order_temp).then((res) => {
          this.$message({
            message: "状态修改成功",
            type: "success",
          });
          this.getOrderList();
        });
      });
    },
    //根据课程多选框id寻找课程名字
    findCourse(val){
       course.findCourseById(val).then(res=>{
          const course=res.data.course
          this.form.courseName=course.name
          this.form.price=course.price
          this.form.courseAvatar=course.avatar 
          this.$forceUpdate() 
       })
    }
  },
  created() {
    this.getOrderList();
    this.textshow = true;
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