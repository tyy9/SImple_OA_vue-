import request from"@/utils/request"
export default{
    pagefile(page,limit,file){
        return request({
            url:`/my_oa/sys-file/filepage/${page}/${limit}`,
            method:"post",
            data:file
        })
    },
    deletefile(id){
        return request({
            url:`/my_oa/sys-file/${id}`,
            method:'delete'
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