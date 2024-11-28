<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">博客列表</h1>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="errorMsg" class="text-center py-12">
      <p class="text-red-500">{{ errorMsg }}</p>
      <button 
        @click="fetchBlogs" 
        class="mt-4 text-blue-600 hover:text-blue-800"
      >
        重试
      </button>
    </div>
    
    <!-- 博客列表 -->
    <div v-else class="grid gap-8">
      <article v-for="blog in blogs" :key="blog.id" 
        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <span class="text-sm text-gray-500">{{ formatDate(blog.created_at) }}</span>
          </div>
          <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ blog.title }}</h2>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ blog.content }}</p>
          <div class="flex justify-end">
            <router-link :to="`/blogs/${blog.id}`" 
              class="text-blue-600 hover:text-blue-800 font-medium">
              阅读更多 →
            </router-link>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const blogs = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

const fetchBlogs = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const data = await response.json()
    if (data.code === 1) {
      blogs.value = data.data
    } else {
      errorMsg.value = data.msg || '获取博客列表失败'
    }
  } catch (error) {
    console.error('获取博客列表失败:', error)
    errorMsg.value = '网络错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchBlogs()
})
</script> 