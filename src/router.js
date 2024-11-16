import { createRouter, createWebHistory } from 'vue-router'
import BlogList from './components/BlogList.vue'
import BlogDetail from './components/BlogDetail.vue'
import WriteBlog from './components/WriteBlog.vue'
import EditBlog from './components/EditBlog.vue'

const routes = [
  {
    path: '/',
    component: BlogList
  },
  {
    path: '/blog/:id',
    component: BlogDetail
  },
  {
    path: '/write',
    component: WriteBlog
  },
  {
    path: '/edit/:id',
    component: EditBlog
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
}) 