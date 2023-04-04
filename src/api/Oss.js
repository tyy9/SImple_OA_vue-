import request from '@/utils/request'
export default{
    deletefile(file){
        return request({
                url:`/my_oa/oss/delete/`,
                method:"post",
                data:file
        })
    }
}