import request from "@/utils/request"
export default{
    getAllSubject(){
        return request({
            url:`/my_oa/subject/getAllSubject`,
            method:'get'
        })
    },
    addSubject(subject){
        return request({
            url:`/my_oa/subject/addSubject`,
            method:"post",
            data:subject
        })
    },
    findSubjectById(id){
        return request({
            url:`/my_oa/subject/findSubjectById/${id}`,
            method:'post',
        })
    },
    updateSubject(subject){
        return request({
            url:'/my_oa/subject/updateSubject/',
            method:'post',
            data:subject
        })
    },
    deleteSubject(id){
        return request({
            url:`/my_oa/subject/deleteSubject/${id}`,
            method:'delete'
        })
    },
    deletebatch(ids){
        return request({
            url:`/my_oa/subject/deletebatch/`,
            method:"delete",
            data:ids
        })
    }
}