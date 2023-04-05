<template>
  <div>
    <div class="tittle" style="margin-bottom: 10px">
      <b>菜单管理</b>
    </div>
    <div class="tools" style="margin-top: 10px;margin-bottom: 10px;">
            <el-button type="primary" @click="dialogFormVisible = true"
              >新增菜单</el-button
            >
            <el-button type="danger" slot="reference" @click="deletebatch"
        >批量删除 <i class="el-icon-remove-outline"></i
      ></el-button>
        </div>
    <el-table
      :data="MenuData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="id" sortable width="180">
      </el-table-column>
      <el-table-column prop="name" label="菜单名称" sortable width="180">
      </el-table-column>
      <el-table-column prop="path" label="菜单路径"> </el-table-column>
      <el-table-column prop="description" label="菜单介绍"> </el-table-column>
      <el-table-column prop="pagePath" label="页面路径"> </el-table-column>
      <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="addchildMenu(scope.row.id)"
                  :disabled="scope.row.pid"
                  >添加子菜单</el-button
                >
                <el-button
                  size="mini"
                  @click="findMenuById(scope.row.id)"
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
    <el-dialog :title="!form.id?'菜单添加':'菜单编辑'" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="120px">
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" :label-width="formLabelWidth">
          <el-input v-model="form.path" autocomplete="off" placeholder="/****"></el-input>
        </el-form-item>
        <el-form-item label="菜单介绍" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面路径" :label-width="formLabelWidth">
          <el-input v-model="form.pagePath" autocomplete="off"></el-input>
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
import menu from "@/api/Menu";
export default {
  data() {
    return {
      Menusearch: {},
      MenuData: [{}],
      dialogFormVisible:false,
      form:{},
      multiselect: {},
    };
  },
  methods: {
    getMenuList() {
      menu.findMenu().then((res) => {
        console.log(res);
        this.MenuData = res.data.menu;
        console.log("MenuData=>", this.MenuData);
      });
    },
    addORupadte(){
      if(!this.form.id){
        this.addMenu()
      }else{
          this.updatedMenu()
      }
    },
    addMenu(){
        //先将字符串分离
        const split=this.form.pagePath.split("")
        console.log(split)
        //将首字母大写
        const Upword=split[0].toUpperCase();
        //获取剩下字符
        const res=split.slice(1)
        const res2=res.join("")
        //拼接返回
        this.form.pagePath=Upword+res2
        menu.addMenu(this.form).then(res=>{
            console.log(res)
            this.dialogFormVisible=false
            this.getMenuList()
            
        })
    },
    addchildMenu(id){
        this.form.pid=id
        this.dialogFormVisible=true
    },
    findMenuById(id) {
      this.dialogFormVisible = true;
      menu.findMenuById(id).then((res) => {
        console.log(res);
        this.form = res.data.menu;
      });
    },
    updatedMenu(){
        menu.updateMenu(this.form).then((res) => {
        this.$message({
          showClose: true,
          message: "更新成功",
          type: "success",
        });
        this.form=""
        this.dialogFormVisible = false;
        this.getMenuList();
      });
    },
     //删除弹窗
     open(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          menu.deleteMenu(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getMenuList();
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
      console.log(ids);
      this.$confirm("此操作将永久删除所选菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            menu.deletebatch(ids).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getMenuList();
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
  },
  created() {
    this.getMenuList();
  },
};
</script>