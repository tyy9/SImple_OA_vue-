<template>
    <div style="line-height: 60px; display: flex">
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
              <el-dropdown-item>
                <router-link to="/login" style="text-decoration: none;color: black  ;">退出</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
    </div>
</template>
<script>
export default {
    props: {
        collapsebtn:String,
    },
    methods:{
        changecollapse(){
            this.$emit("parentMethod")
        },
        register(){
          console.log(1)
          this.$router.push("/login")
        }
    }
}
</script>