import request from '@/utils/request'

// export function pageUser(page,limit,sysUser){
//     return request({
//         url:`/my_oa/sys-user/pageUser/${page}/${limit}`,
//         method:'post',
//         data:sysUser
//     })
// }
export default{
    pageUser(page,limit,sysUser){
            return request({
                url:`/my_oa/sys-user/pageUser/${page}/${limit}`,
                method:'post',
                data:sysUser
            })
        }
    ,
    addUser(formdata){
        return request({
            url:`/my_oa/sys-user/addUser`,
            method:'post',
            data:formdata
        })
    },
    findUserById(id){
        return request({
            url:`/my_oa/sys-user/findUserById/${id}`,
            method:'post',
        })
    },
    updateUser(sysUser){
        return request({
            url:'/my_oa/sys-user/updateUser/',
            method:'post',
            data:sysUser
        })
    },
    deleteUser(id){
        return request({
            url:`/my_oa/sys-user/deleteUser/${id}`,
            method:'delete'
        })
    },
    deleteUserbatch(ids){
        return request({
            url:`/my_oa/sys-user/deletebatch/`,
            method:"delete",
            data:ids
        })
    },
    getUserMenu(sysUser){
        return request({
            url:`/my_oa/sys-user/getUserMenu/`,
            method:"post",
            data:sysUser
        })
    },
    getUserByRole(role){
        return request({
            url:`/my_oa/sys-user/getUserByRole/${role}`,
            method:"post",
        })
    }
}