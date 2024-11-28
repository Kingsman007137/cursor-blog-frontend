import { createRouter, createWebHistory } from 'vue-router'
import BlogList from './views/front/BlogList.vue'
import BlogDetail from './views/front/BlogDetail.vue'
import AdminLayout from './views/admin/Layout.vue'
import AdminLogin from './views/admin/Login.vue'
import AdminBlogList from './views/admin/BlogList.vue'
import AdminBlogEdit from './views/admin/BlogEdit.vue'

const routes = [
  // 前台路由
  {
    path: '/',
    redirect: '/blogs'
  },
  {
    path: '/blogs',
    component: BlogList
  },
  {
    path: '/blogs/:id',
    component: BlogDetail
  },
  
  // 后台路由
  {
    path: '/adm/login',
    component: AdminLogin
  },
  {
    path: '/adm',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirect: '/adm/blogs'
      },
      {
        path: 'blogs',
        component: AdminBlogList
      },
      {
        path: 'blogs/create',
        component: AdminBlogEdit
      },
      {
        path: 'blogs/edit/:id',
        component: AdminBlogEdit
      }
    ],
    beforeEnter: async (to, from, next) => {
      const token = localStorage.getItem('token')
      if (!token) {
        next('/adm/login')
        return
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/adm/authCheck`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'token': localStorage.getItem('token')
          }
        })
        if (!response.ok) {
          localStorage.removeItem('token')
          next('/adm/login')
          return
        }
        next()
      } catch (error) {
        localStorage.removeItem('token')
        next('/adm/login')
      }
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局导航守卫
router.beforeEach(async (to, from, next) => {
  if (to.path.startsWith('/adm') && to.path !== '/adm/login') {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/adm/login')
      return
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/adm/authCheck`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'token': localStorage.getItem('token')
        }
      })
      if (!response.ok) {
        localStorage.removeItem('token')
        next('/adm/login')
        return
      }
      next()
    } catch (error) {
      localStorage.removeItem('token')
      next('/adm/login')
    }
    return
  }
  next()
}) 