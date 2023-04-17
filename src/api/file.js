import request from"@/utils/request"
export default{
    pagefile(page,limit,file){
        return request({
            url:`/my_oa/sys-file/filepage/${page}/${limit}`,
            method:"post",
            data:file
        })
    },
    geturlListByUrl(file){
        return request({
            url:`/my_oa/sys-file/geturlListByUrl/`,
            method:'post',
            parmas:file
        })
    },
    deletefile(id){
        return request({
            url:`/my_oa/sys-file/${id}`,
            method:'delete'
        })
    },
    deletefileByUrl(file){
        return request({
            url:`/my_oa/sys-file/deletefileByUrl/`,
            method:'delete',
            data:file
        })
    },
    deletefilebatch(ids){
        return request({
            url:`/my_oa/sys-file/deletebatch`,
            method:"delete",
            data:ids
        })
    },
    addFile(file){
        return request({
            url:`/my_oa/sys-file/addFile`,
            method:"post",
            data:file
        })
    }
}