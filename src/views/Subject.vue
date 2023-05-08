<template>
    <div>
      <div class="tittle" style="margin-bottom: 10px">
        <b>课程分类管理</b>
      </div>
      <div class="tools" style="margin-top: 10px;margin-bottom: 10px;">
              <el-button type="primary" @click="dialogFormVisible = true"
                >新增课程</el-button
              >
              <el-button type="danger" slot="reference" @click="deletebatch"
          >批量删除 <i class="el-icon-remove-outline"></i
        ></el-button>
          </div>
      <el-table
        :data="SubjectData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- <el-table-column prop="id" label="id" sortable width="180">
        </el-table-column> -->
        <el-table-column prop="title" label="课程标题" sortable width="700">
        </el-table-column>
        <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="addchildSubject(scope.row.id)"
                    v-show="scope.row.parentId==0?true:false"
                    >添加子课程分类</el-button
                  >
                  <el-button
                    size="mini"
                    @click="findSubjectById(scope.row.id)"
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
      <el-dialog :title="!form.id?'课程分类添加':'课程分类编辑'" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-width="120px">
          <el-form-item label="课程主分类标题" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"></el-input>
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
  import subject from "@/api/Subject";
  export default {
    data() {
      return {
        Menusearch: {},
        SubjectData: [],
        dialogFormVisible:false,
        form:{},
        multiselect: {},
        menuRolelist:{}
      };
    },
    methods: {
      getSubjectList() {
        subject.getAllSubject().then((res) => {
          console.log(res);
          this.SubjectData = res.data.subjectList;
          console.log("SubjectData=>", this.SubjectData);
        });
      },
      addORupadte(){
        if(!this.form.id){
          this.addSubject()
        }else{
            this.updatedSubject()
        }
      },
      addSubject(){
          subject.addSubject(this.form).then(res=>{
              console.log(res)
              this.dialogFormVisible=false
              this.getSubjectList()
              
          })
      },
      addchildSubject(id){
          this.form.parentId=id
          this.dialogFormVisible=true
      },
      findSubjectById(id) {
        this.dialogFormVisible = true;
        subject.findSubjectById(id).then((res) => {
          console.log(res);
          this.form = res.data.subject;
        });
      },
      updatedSubject(){
          subject.updateSubject(this.form).then((res) => {
          this.$message({
            showClose: true,
            message: "更新成功",
            type: "success",
          });
          this.form=""
          this.dialogFormVisible = false;
          this.getSubjectList();
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
            subject.deleteSubject(id).then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getSubjectList();
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
              subject.deletebatch(ids).then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getSubjectList();
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
      this.getSubjectList();
    },
  };
  </script>