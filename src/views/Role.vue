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
          <el-button size="mini" @click="getMenuList(scope.row.id)"
            >分配菜单</el-button
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
    <el-dialog
      :title="!form.id ? '角色添加' : '角色编辑'"
      :visible.sync="dialogFormVisible"
    >
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
          <div class="block">
            <el-tree
              :data="MenuData"
              show-checkbox
              node-key="id"
              :default-expanded-keys="selectobject.c_select"
              :default-checked-keys="selectobject.f_select"
              :expand-on-click-node="false"
              :props="defaultProps"
              @check="getCurrentNode"
              ref="tree"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="updateMenuRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import user from "@/api/user";
import role from "@/api/Role";
import menu from "@/api/Menu";
import rolemenu from "@/api/RoleMenu";
import { isRegExp } from "util";
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
      MenuData: [{}],
      defaultProps: {
        children: "children",
        label: "name",
      },
      selectobject: {
        f_select: [],
        c_select: [],
      },
      //当前所选key数组
      currentobject: [],
      currentroleId: "",
      //当前菜单的父菜单与子菜单id数组
      current_fmenu_idArray:[],
      current_cmenu_idArray:[]
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
    //获取菜单列表
    getMenuList(id) {
      this.dialogMenuFormVisible = true;
      this.currentroleId = id;
      menu.findMenu().then((res) => {
        console.log(res);
        this.MenuData = res.data.menu;
        console.log("MenuData=>", this.MenuData);
        //=========================================
        //获取当前菜单的父菜单与子菜单对象数组
        const menudata = res.data.menu;
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
          console.log("filter=>", filter);
          this.current_fmenu_idArray=filter
          this.current_cmenu_idArray=childrenmenu_idArray
          //提供默认值
          
          filter.forEach((item, index) => {
          const RoleMenuObject = {
            roleId: this.currentroleId,
            menuId: "",
          };
          RoleMenuObject.menuId = item;
          this.currentobject.push(RoleMenuObject);
          console.log("defalut=>",this.currentobject)
        });

          console.log("current_fmenu_idArray=>,current_cmenu_idArray=>",this.current_fmenu_idArray,this.current_cmenu_idArray)
          //=============================
        //获取该角色的菜单关系信息
        rolemenu.findMenuByRoleId(id).then((res) => {
          const menudata = res.data.menu_total;
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
          console.log("filter=>", filter);
          //赋值
          this.selectobject.c_select = childrenmenu_idArray;
          this.selectobject.f_select = filter;
          
          console.log("currentobject=>", this.currentobject);
        });
      });
    },
    //更新角色菜单信息
    updateMenuRole() {
      rolemenu.updateMenuRole(this.currentobject).then(res=>{
        console.log(res)
        this.dialogMenuFormVisible=false
        this.$message({
          type:"success",
          message:"菜单权限修改成功"
        })
      })
    },
    cancle() {
      this.test = "";
      this.selectobject.c_select = "";
      this.selectobject.f_select = "";
      this.currentobject = [];
      this.dialogMenuFormVisible = false;
    },
    getCurrentNode(nodeObj, nodeState) {
      //判断当前状态是选中还是取消选中
      const isCheck = this.$refs.tree.getCheckedNodes().indexOf(nodeObj) > -1;
      let changeCurrentMenuObject = function () {};
      if (isCheck) {
        this.currentobject = [];
        //获取所有所选的菜单id
        const total = this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys());
        //获取所有所选的父菜单id数组
        const filter = total.filter((item) =>
            this.current_cmenu_idArray.every((x) => x != item)
          );
          filter.forEach((item, index) => {
          const RoleMenuObject = {
            roleId: this.currentroleId,
            menuId: "",
          };
          console.log(item);
          RoleMenuObject.menuId = item;
          this.currentobject.push(RoleMenuObject);
        });
        console.log("激活")
        console.log("filter=>", filter);
        console.log("currentobject=>", this.currentobject);
      } else {
        this.currentobject = [];
        //获取所有所选的菜单id
        const total = this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys());
        //获取所有所选的父菜单id数组
        const filter = total.filter((item) =>
            this.current_cmenu_idArray.every((x) => x != item)
          );
          filter.forEach((item, index) => {
          const RoleMenuObject = {
            roleId: this.currentroleId,
            menuId: "",
          };
          console.log(item);
          RoleMenuObject.menuId = item;
          this.currentobject.push(RoleMenuObject);
        });
        console.log("失活")
        console.log("filter=>", filter);
        console.log("currentobject=>", this.currentobject);
      }
    },
  },
  created() {
    this.getRoleList();
    this.textshow = true;
  },
};
</script>