import request from '@/utils/request'
export default({
    findMenuByRoleId(id){
        return request({
            url:`/my_oa/sys-role-menu/findMenuByRoleId/${id}`,
            method:'post'
        })
    },
    updateMenuRole(sysRoleMenu){
        return request({
            url:`/my_oa/sys-role-menu/addRoleMenu`,
            method:"post",
            data:sysRoleMenu
        })
    }
})