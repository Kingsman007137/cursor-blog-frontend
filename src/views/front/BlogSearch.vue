<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">搜索结果</h1>
      <!-- 搜索框 -->
      <div class="relative flex items-center">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索文章..."
          class="w-64 px-4 py-2 pr-10 rounded-lg border border-gray-300/50 bg-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 placeholder-gray-500 shadow-inner"
        />
        <button 
          @click="handleSearch"
          class="absolute right-2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
        >
          <svg
            class="h-5 w-5 text-gray-600 hover:text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="errorMsg" class="text-center py-12">
      <p class="text-red-500 text-xl font-bold">{{ errorMsg }}</p>
    </div>
    
    <!-- 博客列表 -->
    <div v-else class="grid gap-4">
      <article v-for="blog in blogs" :key="blog.id" 
        class="blog-card rounded-lg overflow-hidden border border-white/20 transition-all duration-300"
        style="backdrop-filter: blur(8px); background: rgba(255, 255, 255, 0.3);">
        <div class="px-6 py-3">
          <h2>
            <router-link 
              :to="`/blogs/${blog.id}`" 
              class="text-2xl font-bold text-gray-800 hover:text-gray-900"
            >
              {{ blog.title }}
            </router-link>
          </h2>
          <div class="mt-2">
            <span class="text-sm text-gray-500">{{ formatDate(blog.createdAt) }}</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const blogs = ref([])
const isLoading = ref(true)
const errorMsg = ref('')
const searchQuery = ref('')

// 处理搜索
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    router.push('/blogs')
    return
  }
  await fetchSearchResults()
}

const fetchSearchResults = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/blogs/search?title=${encodeURIComponent(searchQuery.value)}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    const data = await response.json()
    if (data.code === 1) {
      blogs.value = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else {
      blogs.value = []
      errorMsg.value = data.msg || '没有找到匹配的博客'
    }
  } catch (error) {
    console.error('搜索博客失败:', error)
    errorMsg.value = '搜索失败，请稍后重试'
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

onMounted(() => {
  searchQuery.value = route.query.title || ''
  if (searchQuery.value) {
    fetchSearchResults()
  }
})
</script> 