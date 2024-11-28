<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? '编辑博客' : '新建博客' }}
      </h2>
    </div>

    <div class="bg-white shadow sm:rounded-lg p-6">
      <div v-if="errorMsg" class="mb-4 text-red-500 text-center">
        {{ errorMsg }}
      </div>
      <form @submit.prevent="handleSubmit">
        <!-- 标题输入 -->
        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            标题
          </label>
          <input
            id="title"
            v-model="blog.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入博客标题"
          >
        </div>

        <!-- 内容编辑器 -->
        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <textarea
            id="content"
            v-model="blog.content"
            rows="15"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入博客内容"
          ></textarea>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="router.back()"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isSubmitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isSubmitting = ref(false)
const errorMsg = ref('')

const blog = ref({
  title: '',
  content: ''
})

const isEdit = computed(() => route.params.id !== undefined)

// 获取博客详情
const fetchBlog = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/adm/blogs/${id}`, {
      headers: {
        'Accept': 'application/json',
        'token': localStorage.getItem('token')
      }
    })
    if (response.status === 401) {
      localStorage.removeItem('token')
      router.replace('/adm/login')
      return
    }
    const data = await response.json()
    if (data.code === 1) {
      blog.value = data.data
    } else {
      if (data.msg === 'NOT_LOGIN') {
        localStorage.removeItem('token')
        router.replace('/adm/login')
        return
      }
      errorMsg.value = data.msg || '获取博客详情失败'
      router.push('/adm/blogs')
    }
  } catch (error) {
    console.error('获取博客详情失败:', error)
    errorMsg.value = '获取博客详情失败'
    router.push('/adm/blogs')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    const url = isEdit.value 
      ? `${import.meta.env.VITE_API_BASE_URL}/adm/blogs/${route.params.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/adm/blogs`
    
    const response = await fetch(url, {
      method: isEdit.value ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      },
      body: JSON.stringify(blog.value)
    })
    
    const data = await response.json()
    if (data.code === 1) {
      router.push('/adm/blogs')
    } else {
      if (data.msg === 'NOT_LOGIN') {
        localStorage.removeItem('token')
        router.replace('/adm/login')
        return
      }
      errorMsg.value = '保存失败，请稍后重试'
    }
  } catch (error) {
    console.error('保存失败:', error)
    errorMsg.value = '保存失败，请稍后重试'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // 如果是编辑模式，获取博客详情
  if (isEdit.value) {
    fetchBlog(route.params.id)
  }
})
</script>