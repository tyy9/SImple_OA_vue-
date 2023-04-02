import request from "@/utils/request"
export default{
    login(sysUser){
        return request({
            url:`/my_oa/sys-user/login`,
            method:"post",
            data:sysUser
        })
    },
    register(sysUser){
        return request({
            url:`/my_oa/sys-user/register`,
            method:'post',
            data:sysUser
        })
    }
}