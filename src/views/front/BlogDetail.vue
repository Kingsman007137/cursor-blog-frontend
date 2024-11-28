<template>
  <div class="container mx-auto px-4 py-8">
    <article class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ blog.title }}</h1>
        <div class="text-gray-500 mb-8">
          {{ formatDate(blog.created_at) }}
        </div>
        <div class="prose max-w-none">
          {{ blog.content }}
        </div>
      </div>
    </article>
    
    <div class="max-w-3xl mx-auto mt-8">
      <router-link to="/blogs" 
        class="text-blue-600 hover:text-blue-800 font-medium">
        ← 返回列表
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const blog = ref({})

const fetchBlog = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs/${id}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const data = await response.json()
    if (data.code === 1) {
      blog.value = data.data
    } else {
      console.error('获取博客详情失败:', data.msg)
      router.push('/blogs')
    }
  } catch (error) {
    console.error('获取博客详情失败:', error)
    router.push('/blogs')
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
  fetchBlog(route.params.id)
})
</script>

<style>
.prose {
  @apply max-w-none;
}
.prose h1 {
  @apply text-2xl font-bold mb-4;
}
.prose h2 {
  @apply text-xl font-bold mb-3;
}
.prose p {
  @apply mb-4;
}
</style> 