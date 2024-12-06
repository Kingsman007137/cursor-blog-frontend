<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-bold text-gray-900">博客管理</h2>
        <button
          v-if="isSearching"
          @click="handleBack"
          class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回全部博客
        </button>
      </div>
      <div class="flex items-center gap-4">
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
        <router-link 
          to="/adm/blogs/create"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          写博客 
        </router-link>
        <button 
          @click="handleLogout"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          退出登录
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMsg" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600 text-xl font-bold">{{ errorMsg }}</p>
    </div>

    <!-- 博客列表 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="blog in blogs" :key="blog.id" class="hover:bg-gray-50">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-lg font-medium text-gray-900 truncate">
                  {{ blog.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  发布时间：{{ formatDate(blog.createdAt) }}
                </p>
              </div>
              <div class="flex gap-2">
                <router-link 
                  :to="`/adm/blogs/edit/${blog.id}`"
                  class="text-blue-600 hover:text-blue-800 px-3 py-1"
                >
                  编辑
                </router-link>
                <button 
                  @click="confirmDelete(blog)"
                  class="text-red-600 hover:text-red-800 px-3 py-1"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">确认删除</h3>
        <p class="text-gray-500 mb-6">确定要删除这篇博客吗？此操作无法撤销。</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            取消
          </button>
          <button 
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const blogs = ref([])
const showDeleteModal = ref(false)
const blogToDelete = ref(null)
const errorMsg = ref('')
const searchQuery = ref('')
const isSearching = ref(false)

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/adm/login')
}

// 获取博客列表
const fetchBlogs = async () => {
  try {
    // 先检查是否有token
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/adm/login')
      return
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/adm/blogs`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'token': token
      }
    })
    if (response.status === 404) {
      errorMsg.value = '没有找到博客列表'
      blogs.value = []
      return
    }
    const data = await response.json()
    if (data.code === 1) {
      // 按更新时间倒序排列
      blogs.value = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else {
      if (data.msg === 'NOT_LOGIN') {
        localStorage.removeItem('token')
        router.replace('/adm/login')
        return
      }
      errorMsg.value = data.msg
    }
  } catch (error) {
    console.error('获取博客列表失败:', error)
    errorMsg.value = '网络错误，请稍后重试'
  }
}

// 确认删除
const confirmDelete = (blog) => {
  blogToDelete.value = blog
  showDeleteModal.value = true
}

// 执行删除
const handleDelete = async () => {
  if (!blogToDelete.value) return
  
  // 先检查是否有token
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/adm/login')
    return
  }
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/adm/blogs/${blogToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'token': token
      }
    })
    if (response.status === 401) {
      localStorage.removeItem('token')
      router.replace('/adm/login')
      return
    }
    const data = await response.json()
    if (data.code === 1) {
      await fetchBlogs() // 重新获取列表
      showDeleteModal.value = false
      blogToDelete.value = null
    } else {
      errorMsg.value = data.msg || '删除失败'
    }
  } catch (error) {
    console.error('删除失败:', error)
    errorMsg.value = '删除失败，请稍后重试'
  }
}

// 格式化日期
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
    return '日期式错误'
  }
}

// 处理搜索
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    isSearching.value = false
    await fetchBlogs()
    return
  }
  
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/adm/login')
      return
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/adm/blogs/search?title=${encodeURIComponent(searchQuery.value)}`,
      {
        headers: {
          'Accept': 'application/json',
          'token': token
        }
      }
    )
    if (response.status === 401) {
      localStorage.removeItem('token')
      router.replace('/adm/login')
      return
    }
    const data = await response.json()
    if (data.code === 1) {
      blogs.value = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      isSearching.value = true
    } else {
      blogs.value = []
      errorMsg.value = data.msg || '没有找到匹配的博客'
      isSearching.value = true
    }
  } catch (error) {
    console.error('搜索博客失败:', error)
    errorMsg.value = '搜索失败，请稍后重试'
  }
}

// 处理返回
const handleBack = () => {
  searchQuery.value = ''
  isSearching.value = false
  errorMsg.value = ''
  fetchBlogs()
}

onMounted(() => {
  // 确保组件挂载时也检查token
  const token = localStorage.getItem('token')
  if (token) {
    fetchBlogs()
  } else {
    router.replace('/adm/login')
  }
})
</script>