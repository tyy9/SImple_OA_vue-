import request from '@/utils/request'
export default({
    findMenu(){
        return request({
            url:`/my_oa/sys-menu/findMenu`,
            method:"get"
        })
    },
    addMenu(sysMenu){
        return request({
            url:`/my_oa/sys-menu/addMenu`,
            method:"post",
            data:sysMenu
        })
    },
    findMenuById(id){
        return request({
            url:`/my_oa/sys-menu/findMenuById/${id}`,
            method:'post',
        })
    },
    updateMenu(sysRole){
        return request({
            url:'/my_oa/sys-menu/updateMenu/',
            method:'post',
            data:sysRole
        })
    },
    deleteMenu(id){
        return request({
            url:`/my_oa/sys-menu/deleteMenu/${id}`,
            method:'delete'
        })
    },
    deletebatch(ids){
        return request({
            url:`/my_oa/sys-menu/deletebatch/`,
            method:"delete",
            data:ids
        })
    }
})