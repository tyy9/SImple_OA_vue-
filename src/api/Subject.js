import request from "@/utils/request"
export default{
    getAllSubject(){
        return request({
            url:`/my_oa/subject/getAllSubject`,
            method:'get'
        })
    }
}