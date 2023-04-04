<template>
  <div>
    <div class="tittle" style="margin-bottom: 10px">
      <b>文件管理</b>
    </div>
    <div class="searchheader">
      <el-input
        v-model="file_namesearch.name"
        placeholder="请输入文件名"
        style="width: 300px; margin-right: 10px"
      ></el-input>
      <el-button type="success" icon="el-icon-search" @click="onsubmit">搜索</el-button>
    </div>
    <div class="tools" style="margin-top: 5px">
      <el-button type="primary" @click="dialogFormVisible = true"
        >上传文件</el-button
      >
      <el-button type="danger" slot="reference" @click="deletebatch"
        >批量删除 <i class="el-icon-remove-outline"></i
      ></el-button>
    </div>
    <el-table
      :data="filedata"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="id" sortable width="180">
      </el-table-column>
      <el-table-column prop="name" label="文件名" sortable width="180">
      </el-table-column>
      <el-table-column prop="size" label="文件大小" sortable width="180">
      </el-table-column>
      <el-table-column prop="type" label="类型" :formatter="formatter">
      </el-table-column>
      
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="download(scope.row.url)"
            >下载</el-button
          >
          <el-button size="mini" type="danger" @click="filedelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getfileList"
      :current-page.sync="page"
      :page-size="limit"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    
    <el-dialog title="上传文件" :visible.sync="dialogFormVisible">
      <el-form :model="uploadfile" label-width="120px">
        <el-form-item label="文件名称" :label-width="formLabelWidth"> 
            <!-- 存到数据库的名字，不是传到oss的文件名 -->
          <el-input v-model="uploadfile.name" ></el-input>
        </el-form-item>
        <el-form-item label="文件大小(kb)" :label-width="formLabelWidth">
          <el-input v-model="uploadfile.size"  auto-complete="true" disabled="true"></el-input>
        </el-form-item>
        <div class="upload">
            <el-upload
          class="upload-demo"
          action="http://localhost:8001/my_oa/oss/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :on-success="handleUploadSuccess"
          
        >
            <div class="uploadtext" style="margin-left: 50px;">
                <el-button size="small" type="primary" >点击上传文件</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
            </div>
          
        </el-upload>
        </div>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelupload">取 消</el-button>
        <el-button type="primary" @click="upload_oss">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import file from "@/api/file";
import oss from "@/api/Oss";
import axios from "axios";
export default {
  data() {
    return {
      filedata: {},
      page: 1,
      limit: 30,
      total: 0,
      file_namesearch: {},
      multiselect: {},
      uploadfile: {},
      dialogFormVisible: false,
    };
  },
  methods: {        
    //分页
    getfileList(page = 1) {
      this.page = page;
      console.log("limit=>",this.limit)
      file.pagefile(this.page, this.limit, this.file_namesearch).then((res) => {
        this.filedata = res.data.data;
        this.total = res.data.total;
        console.log(res);
      });
    },
    //按需查询
    onsubmit(){
      file.pagefile(this.page, this.limit, this.file_namesearch).then((res) => {
        this.filedata = res.data.data;
        this.total = res.data.total;
        console.log(res);
      });
    },
    filedelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          file.deletefile(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getfileList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //批量删除
    deletebatch() {
      let ids = this.multiselect.map((v) => v.id);
      this.$confirm("此操作将永久删除所选文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          file.deletefilebatch(ids).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getfileList();
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
      this.multiselect = val;
    },
    //文件上传函数
    handleRemove(file, fileList) {
        console.log("remove=>",file);
        this.uploadfile.url=file.response.data.url
        this.uploadfile.name=""
        oss.deletefile(this.uploadfile).then(res=>{
            console.log(res)
        })
      },
      handlePreview(file) {
        this.uploadfile.name=file.name
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleUploadSuccess(response, file, fileList){
        console.log("response=>",response)
        console.log("file",file)
        this.uploadfile.name=file.name
        console.log(this.uploadfile)
        this.uploadfile.size=response.data.size
        this.uploadfile.url=response.data.url
        this.uploadfile.type=response.data.type
        
        this.$forceUpdate();
      },
      //点击取消按钮事件
      cancelupload(){
        oss.deletefile(this.uploadfile).then(res=>{
            console.log(res)
            this.uploadfile=""
            this.dialogFormVisible=false
            this.fileList = []
        })
      },
      //确定事件
      upload_oss(){
        file.addFile(this.uploadfile).then(res=>{
            console.log("添加=>",res)
            this.dialogFormVisible=false
            this.fileList = []//清楚上传列表的文件显示
            this.uploadfile=""
            this.getfileList();
        })
      },
      //下载
      download(url){
        window.open(url)
      }
  },
  created() {
    this.getfileList();
  },
};
</script>