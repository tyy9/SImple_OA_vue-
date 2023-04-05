<template>
  <div>
    <div class="tittle" style="margin-bottom: 10px">
      <b>用户管理</b>
    </div>
    <div class="search_header">
      <el-input
        v-model="sysRole.name"
        placeholder="请输入角色名称"
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
    <el-table :data="roledata" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="id" width="140"> </el-table-column>
      <el-table-column prop="name" label="名称" width="120"> </el-table-column>
      <el-table-column prop="description" label="介绍"> </el-table-column>
      <el-table-column prop="flag" label="标志"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="dialogMenuFormVisible = true"
            >管理菜单</el-button
          >
          <el-button size="mini" @click="findRoleById(scope.row.id)"
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
      @current-change="getUserList"
      :current-page.sync="page"
      :page-size="limit"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-dialog :title="!form.id?'角色添加':'角色编辑'" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="120px">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色标志" :label-width="formLabelWidth">
          <el-input v-model="form.flag" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addORupadte">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配菜单" :visible.sync="dialogMenuFormVisible">
      <div class="custom-tree-container">
        <div class="block">
          <p>菜单列表</p>
          <el-tree
            :data="treedata"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
          >
          </el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addORupadte">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import user from "@/api/user";
import role from "@/api/Role";
export default {
  name: "User",
  data() {
    return {
      roledata: {},
      collapsebtn: "el-icon-s-fold",
      total: 0,
      page: 1,
      limit: 5,
      sysRole: {},
      dialogFormVisible: false,
      form: {},
      textshow: true,
      dynamic_px: 200,
      isCollapse: false,
      multiselect: {},
      dialogMenuFormVisible: false,
      treedata: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
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
    getRoleList(page = 1) {
      //分页
      this.page = page;
      role.pageRole(this.page, this.limit, this.sysRole).then((res) => {
        console.log(res);
        this.roledata = res.data.data;
        this.total = res.data.total;
      });
    },
    onsubmit() {
      //按需查询
      role.pageRole(this.page, this.limit, this.sysRole).then((res) => {
        console.log(res);
        this.roledata = res.data.data;
        this.total = res.data.total;
      });
    },
    addRole() {
      role.addRole(this.form).then((res) => {
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success",
        });
        this.dialogFormVisible = false;
        this.getRoleList();
      });
    },
    //回显
    findRoleById(id) {
      this.dialogFormVisible = true;
      role.findRoleById(id).then((res) => {
        console.log(res);
        this.form = res.data.role;
      });
    },
    //更新与添加通用接口
    addORupadte() {
      if (!this.form.id) {
        this.addRole();
      } else {
        this.updatedRole();
      }
    },
    //更新
    updatedRole() {
      role.updateRole(this.form).then((res) => {
        this.$message({
          showClose: true,
          message: "更新成功",
          type: "success",
        });
        this.dialogFormVisible = false;
        this.getRoleList();
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
          role.deleteRole(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getRoleList();
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
          role.deleteUserbatch(ids).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getRoleList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.getRoleList();
    this.textshow = true;
  },
};
</script>