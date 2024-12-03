<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">我的文章</h1>
    
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
    <div v-else class="grid gap-4">
      <article v-for="blog in blogs" :key="blog.id" 
        class="blog-card rounded-lg overflow-hidden border border-white/20 transition-all duration-300"
        style="backdrop-filter: blur(8px); background: rgba(255, 255, 255, 0.3);">
        <div class="px-6 py-4">
          <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ blog.title }}</h2>
          <p class="text-gray-600 mb-2 line-clamp-2">{{ getContentPreview(blog.content) }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ formatDate(blog.createdAt) }}</span>
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
      blogs.value = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
  if (!dateString) return '暂无更新时间'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '日期格式错误'
  }
}

// 获取内容预览
const getContentPreview = (content) => {
  if (!content) return '暂无内容'
  // 移除Markdown语法标记
  const plainText = content
    .replace(/#{1,6} /g, '')     // 移除标题
    .replace(/\*\*/g, '')        // 移除加粗
    .replace(/\*/g, '')          // 移除斜体
    .replace(/`{3}[\s\S]*?`{3}/g, '') // 移除代码块
    .replace(/`.*?`/g, '')      // 移除行内代码
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/>/g, '')          // 移除引用
    .trim()
  return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText
}

onMounted(() => {
  fetchBlogs()
})
</script> 