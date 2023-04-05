import request from '@/utils/request'

// export function pageUser(page,limit,sysUser){
//     return request({
//         url:`/my_oa/sys-user/pageUser/${page}/${limit}`,
//         method:'post',
//         data:sysUser
//     })
// }
export default{
    pageRole(page,limit,sysRole){
            return request({
                url:`/my_oa/sys-role/pageRole/${page}/${limit}`,
                method:'post',
                data:sysRole
            })
        }
    ,
    addRole(formdata){
        return request({
            url:`/my_oa/sys-role/addRole`,
            method:'post',
            data:formdata
        })
    },
    findRoleById(id){
        return request({
            url:`/my_oa/sys-role/findRoleById/${id}`,
            method:'post',
        })
    },
    updateRole(sysRole){
        return request({
            url:'/my_oa/sys-role/updateRole/',
            method:'post',
            data:sysRole
        })
    },
    deleteRole(id){
        return request({
            url:`/my_oa/sys-role/deleteRole/${id}`,
            method:'delete'
        })
    },
    deleteUserbatch(ids){
        return request({
            url:`/my_oa/sys-role/deletebatch/`,
            method:"delete",
            data:ids
        })
    }
}