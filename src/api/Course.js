import request from "@/utils/request"
export default {
    pageCourse(page, limit, course) {
        return request({
            url: `/my_oa/course/pageCourse/${page}/${limit}`,
            method: 'post',
            data: course
        })
    },
    addCourse(formdata) {
        return request({
            url: `/my_oa/course/addCourse`,
            method: 'post',
            data: formdata
        })
    },
    findCourseById(id) {
        return request({
            url: `/my_oa/course/findCourseById/${id}`,
            method: 'post',
        })
    },
    updateCourse(course) {
        return request({
            url: '/my_oa/course/updateCourse/',
            method: 'post',
            data: course
        })
    },
    deleteCourse(id) {
        return request({
            url: `/my_oa/course/deleteCourse/${id}`,
            method: 'delete'
        })
    },
    deleteCoursebatch(ids) {
        return request({
            url: `/my_oa/course/deletebatch/`,
            method: "delete",
            data: ids
        })
    },
    

}