import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Manage.vue'
import cookie from"js-cookie"
import { Message, MessageBox } from 'element-ui'
import { ServerIp } from '../../public/config'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Manage',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Manage.vue'),
  //   redirect: "/home",
  //   children:[
  //     {path: 'home',
  //     name: '首页',
  //     component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')},
  //     {path: 'user',
  //     name: '用户管理',
  //     component: () => import(/* webpackChunkName: "about" */ '../views/User.vue')},
  //     {path: 'userinfo',
  //     name: '个人信息',
  //     component: () => import(/* webpackChunkName: "about" */ '../views/UserInfo.vue')},
  //     {path: 'file',
  //     name: '文件管理',
  //     component: () => import(/* webpackChunkName: "about" */ '../views/File.vue')},
  //     {path: 'role',
  //     name: '角色管理',
  //     component: () => import(/* webpackChunkName: "about" */ '../views/Role.vue')},
  //     {path: 'menu',
  //     name: '菜单管理',
  //     component: () => import(/* webpackChunkName: "about" */ '../views/Menu.vue')}

  //   ]
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


//设置动态路由
export const setRoutes=()=>{
        const storemenu=cookie.get("menuList")
        if(storemenu){
          const Manage={
            path: '/',
            name: 'Manage',
            component: () => import(/* webpackChunkName: "about" */ '../views/Manage.vue'),
            redirect: "/home",
            children:[]
          }
          const menu=JSON.parse(storemenu)
          menu.forEach(item=>{
            console.log(item)
            if(item.path){
              const itemmenu={
                path: item.path,
                name: item.name,
                component: () => import(/* webpackChunkName: "about" */ '../views/'+item.pagePath+'.vue'),
                children:[]
              }
              Manage.children.push(itemmenu)
            }else  if(item.children.length){
              item.children.forEach(item=>{
                const itemmenu_children={
                  path: item.path,
                  name: item.name,
                  component: () => import(/* webpackChunkName: "about" */ '../views/'+item.pagePath+'.vue')
                }
                Manage.children.push(itemmenu_children)
              })
            }
          })
          console.log("Manage=>",Manage)
    
          //获取当前路由信息
          const currentRouter=router.getRoutes().map(v=>v.name)
          if(!currentRouter.includes("Manage")){
            router.addRoute(Manage)
          }
          
        }

      
   
}

//每次重置路由就刷新一次路由
setRoutes()

//强制登录
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    //如果从login开始则删除cookie里的所有值
    cookie.set("token", "", { domain: `${ServerIp}` });
    cookie.set("userinfo", "", { domain: `${ServerIp}` });
      next()
  } else if(to.path.startsWith('/register')){
    //如果从register开始则删除cookie里的所有值
    cookie.set("token", "", { domain: `${ServerIp}` });
    cookie.set("userinfo", "", { domain: `${ServerIp}` });
    next()
  }
  else {
      if (!cookie.get("token")) {
        //如果不是则判断cookie里的token值是否存在
        MessageBox.alert("未登录", '未登录', {
          confirmButtonText: '确定',
          type: 'error'
      })
          next({
              path: '/login'
          })
      } else {
          next()
      }
  }
});

export default router
