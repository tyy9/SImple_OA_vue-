import request from "@/utils/request"
export default{
    addComment(comment){
        return request({
            url:`/my_oa/comment/addComment`,
            method:"post",
            data:comment
        })
    },
    getCourseComment(id){
        return request({
            url:`/my_oa/comment/getCommentByCourseId/${id}`,
            method:"post",
        })
    },
    getCommentByTeacherId(id){
        return request({
            url:`/my_oa/comment/getCommentByTeacherId/${id}`,
            method:"post",
        })
    },
    deleteCommentById(id){
        return request({
            url:`/my_oa/comment/${id}`,
            method:"delete",
        })
    },
    deleteCommentbatch(ids){
        return request({
            url:`/my_oa/comment/deletebatch/`,
            method:"delete",
            data:ids
        })
    },
    pageComment_Course(page,limit,comment){
        return request({
            url:`/my_oa/comment/pageComment_Course/${page}/${limit}`,
            method:"post",
            data:comment
        })
    },
    pageComment_Teacher(page,limit,comment){
        return request({
            url:`/my_oa/comment/pageComment_Teacher/${page}/${limit}`,
            method:"post",
            data:comment
        })
    },
    pageUser_Comment(page,limit,search){
        return request({
            url:`/my_oa/comment/pageUser_Comment/${page}/${limit}`,
            method:"post",
            data:search
        })
    },
    findCommentById(id){
        return request({
            url:`/my_oa/comment/findCommentById/${id}`,
            method:"post",
        })
    }   
}