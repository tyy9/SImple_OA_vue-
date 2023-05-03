import request from '@/utils/request'
export default{
    addOrder(order){
        return request({
            url:`/my_oa/course-order/addOrder`,
            method:"post",
            data:order
        })
    },
    updateOrder(order){
        return request({
            url:`/my_oa/course-order/updateOrder`,
            method:"put",
            data:order
        })
    },
    findOrderById(id){
        return request({
            url:`/my_oa/course-order/findOrderById/${id}`,
            method:"post",
        })
    },
    deleteOrderByid(id){
        return request({
            url:`/my_oa/course-order/${id}`,
            method:"delete",
        })
    },
    deleteOrderByids(ids){
        return request({
            url:`/my_oa/course-order/deletebatch`,
            method:"delete",
            data:ids
        })
    },
    pageUserOrder(page,limit,order){
        return request({
            url:`/my_oa/course-order/PageUserOrder/${page}/${limit}`,
            method:"post",
            data:order
        })
    },
    pageOrder(page,limit,order){
        return request({
            url:`/my_oa/course-order/PageOrder/${page}/${limit}`,
            method:"post",
            data:order
        })
    }
}