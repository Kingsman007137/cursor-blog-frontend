<template>
  <div class="min-h-screen">
    <!-- 主要内容区域 -->
    <div class="py-6">
      <div :class="{
        'mx-auto px-4': true,
        'max-w-7xl': !isEditPage
      }">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

// 判断是否是编辑或写博客页面
const isEditPage = computed(() => {
  return route.path.includes('/blogs/edit/') || route.path.includes('/blogs/create')
})

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/adm/login')
}
</script> 