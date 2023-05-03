<template>
    <div>
      <div class="tittle" style="margin-bottom: 10px;">
        <b>课程管理</b>
    </div>
        <div class="search_header">
            <el-input
              v-model="course.name"
              placeholder="请输入名字"
              style="width: 200px; margin-right: 5px"
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="onsubmit"
              >搜索</el-button
            >
          </div>
          <div class="tools" style="margin-top: 5px">
            <el-button type="primary" @click="openadd_dialog()"
              >新增</el-button
            >
            <el-button type="danger" slot="reference" @click="deletebatch">批量删除 <i class="el-icon-remove-outline"></i></el-button>
          </div>
          <el-table :data="coursedata"   @selection-change="handleSelectionChange">
                  <el-table-column
            type="selection"
            width="55">
          </el-table-column>
            <el-table-column prop="id" label="课程id" width="140">
            </el-table-column>
            <el-table-column prop="name" label="课程名称" width="120">
            </el-table-column>
            <el-table-column prop="score" label="学分" width="120">
            </el-table-column>
            <el-table-column prop="times" label="学时" width="120">
            </el-table-column>
            <el-table-column prop="state" label="课程状态">
              <template slot-scope="scope">
                <span v-if="scope.row.state == 0">未开课</span>  
                <span v-else>已开课</span>
              </template>

            </el-table-column>
            <el-table-column prop="price" label="价格" width="120">
            
            </el-table-column>
            <el-table-column prop="buycount" label="购买数量" width="120">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="findCourseById(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="open(scope.row.id,scope.row.avatar)"
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
          <el-dialog :title="!form.id?'课程添加':'课程编辑'" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="120px">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程学时" :label-width="formLabelWidth">
          <el-input v-model="form.times" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程学分" :label-width="formLabelWidth">
          <el-input v-model="form.score" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程封面(点击+上传)" :label-width="formLabelWidth">
            <el-upload
        class="avatar-uploader"
        action="http://localhost:8001/my_oa/oss/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :headers="requestHeader"
        :before-upload="beforeAvatarUpload"
        
      >
        <img v-if="form.avatar" :src="form.avatar" class="avatar"  style="width: 700px;height: 500px;"/>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
        </el-form-item>
        <el-form-item label="课程主分类" :label-width="formLabelWidth">
          <el-select v-model="form.subjectId" placeholder="请选择课程主分类" @change="getsubject_childrenList">
            <el-option v-for="item in subjectList" :key="item.id" :label="item.title" :value="item.id"></el-option>
    </el-select>
        </el-form-item>
        <el-form-item label="课程子分类" :label-width="formLabelWidth">
          <el-select v-model="form.subjectParentid" placeholder="请选择课程子分类">
      <el-option v-for="item in subject_childrenList" :key="item.id" :label="item.title"  :value="item.id"></el-option>
    </el-select>
        </el-form-item>
        <el-form-item label="教师分配" :label-width="formLabelWidth">
          <el-select v-model="form.teacherId" placeholder="请选择教师">
            <el-option v-for="item in teacherList" :key="item.id" :label="item.username"  :value="item.id"></el-option>
    </el-select>
        </el-form-item>
        <p>课程简介</p>
        <VueTinymce id="tinymce"  v-model="form.description" ></VueTinymce>
      </el-form>
      
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
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
import Course from "../api/Course";
import oss from "@/api/Oss"
import subject from "@/api/Subject"
import file from "@/api/file"
export default {
    name: "User",
  data() {
    return {
      coursedata: {},
      collapsebtn: "el-icon-s-fold",
      total: 0,
      page: 1,
      limit: 5,
      course: {},
      dialogFormVisible: false,
      form:{},
      textshow: true,
      dynamic_px: 200,
      isCollapse:false,
      multiselect:{},
      multiselect2:{},
      file_flag:false,//标记是否上传过文件
      file_object:{},
      subjectList:{},
      subject_childrenList:[],
      teacherList:[],
      filedata:{},
      requestHeader: {  //未上传图片的请求头加token
          Authorization: cookie.get("token")
        }
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
    getCourseList(page = 1) {//分页
      this.page = page;
      Course.pageCourse(this.page, this.limit, this.course).then((res) => {
        console.log(res);
        this.coursedata = res.data.data;
        this.total=parseInt(res.data.total)  
      });
    },
    onsubmit() {//按需查询
      Course.pageCourse(this.page, this.limit, this.course).then((res) => {
        console.log(res);
        this.coursedata = res.data.data;
        this.total=parseInt(res.data.total)  
      });
    },
    addCourse(){
      Course.addCourse(this.form).then(res=>{
        
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.dialogFormVisible=false
        this.file_flag=false
        this.getCourseList()
      })
    },
    openadd_dialog(){
        this.dialogFormVisible=true
        //课程分类获取
        subject.getAllSubject().then(res=>{
            this.subjectList=res.data.subjectList
            console.log("subjectinfo=>",res.data.subjectList)
        })
        //教师信息获取
        user.getUserByRole("ROLE_TEACHER").then(res=>{
            this.teacherList=res.data.userlist
        })
    },
    //------------------------
      //课程分类获取
      //子分类获取
    getsubject_childrenList(value){
        console.log(value)//获取所选的父类别id
        for(let i=0;i<this.subjectList.length;i++){
            if(this.subjectList[i].id===value){
                console.log(this.subjectList[i].id)
                this.subject_childrenList=this.subjectList[i].children
            }
        }
        console.log(this.subject_childrenList)
    },
    //-------------------------
    //回显
    findCourseById(id){
      Course.findCourseById(id).then(res=>{
        console.log(res)
        this.form=res.data.course
        
      })
      //课程分类获取
     
      subject.getAllSubject().then(res=>{
            this.subjectList=res.data.subjectList
            this.getsubject_childrenList(this.form.subjectId)
            console.log("subjectinfo=>",res.data.subjectList)
        })
        
        //教师信息获取
        user.getUserByRole("ROLE_TEACHER").then(res=>{
            this.teacherList=res.data.userlist
        })
        
      this.dialogFormVisible=true
      
      this.$forceUpdate()
    },
    //更新与添加通用接口
    addORupadte(){
      if(!this.form.id){
        this.addCourse()
      }else{
          this.updateCourse()
      }
    },
    //更新
    updateCourse() {
     Course.updateCourse(this.form).then(res=>{
        this.$message({
          showClose: true,
          message: '更新成功',
          type: 'success'
        })
        this.dialogFormVisible=false
        this.getCourseList()
      })
    },
    //删除弹窗
    open(id,url){
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          Course.deleteCourse(id).then(res=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          if(url){
            console.log("url=>",url)
            this.filedata.url=url
            file.deletefileByUrl(this.filedata).then(res=>{
                console.lof(res)
            })
          }
          
          this.getCourseList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleSelectionChange(val){
      this.multiselect2=val
      this.multiselect=val
      console.log(this.multiselect)
    },
    deletebatch(){
      let ids=this.multiselect.map(v=>v.id)
      let fileids=this.multiselect2.map(v=>v.avatar)
      let fileids_exist=[]
      fileids.forEach(item => {
        if(item){
            fileids_exist.push(item)
        }
      });
      console.log(fileids_exist)
      this.$confirm('此操作将永久删除所选课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Course.deleteCoursebatch(ids).then(res=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          fileids_exist.forEach(item=>{
            this.filedata.url=item
            file.deletefileByUrl(this.filedata).then(res=>{
                console.log(res)
            })
          })
          this.getCourseList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //---------------------------
    //oss服务
    handleAvatarSuccess(res, file) {
      console.log(res.data)
        this.form.avatar=res.data.url
        this.file_object.url=res.data.url
        this.$forceUpdate()
      },
      beforeAvatarUpload(file) {
        if(file.size>0){
          console.log("upload=>",file)
          this.file_flag=true
        }
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 1000;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      cancel(){
        if(this.file_flag){
          oss.deletefile(this.file_object).then(res=>{
            console.log("deletefile=>",res)
          })
        }
        this.file_flag=false
        this.form={}
        this.getCourseList()
         this.dialogFormVisible=false
      },
      
  },
  created() {
    this.getCourseList();
    this.textshow=true
  },
};
</script>
<style>
/* 在el-dialog中tinymce z-index 被太小而被遮挡时要加这两句 */
.tox-tinymce-aux{z-index:99999 !important;}
.tinymce.ui.FloatPanel{z-Index: 99;}
</style>