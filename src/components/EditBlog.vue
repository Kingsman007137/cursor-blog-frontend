<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <!-- 标题输入 -->
        <input 
          v-model="blog.title"
          type="text"
          placeholder="输入文章标题..."
          class="w-full text-3xl font-bold mb-4 p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
        >
        
        <!-- 封面图片 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">封面图片</label>
          <img v-if="blog.coverImage" :src="blog.coverImage" class="w-full h-48 object-cover rounded mb-2">
          <input 
            type="file" 
            accept="image/*"
            @change="handleImageUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          >
        </div>

        <!-- 标签输入 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in blog.tags" :key="tag"
              class="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
              {{ tag }}
              <button @click="removeTag(tag)" class="ml-2 text-gray-500 hover:text-red-500">×</button>
            </span>
            <input 
              v-model="newTag"
              @keyup.enter="addTag"
              type="text"
              placeholder="输入标签按回车添加"
              class="px-3 py-1 text-sm border rounded-full focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>

        <!-- Markdown编辑器 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Markdown编辑</label>
            <textarea
              v-model="blog.content"
              class="w-full h-[500px] p-4 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="使用Markdown语法编写文章..."
            ></textarea>
          </div>
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">预览</label>
            <div class="w-full h-[500px] p-4 border rounded-lg overflow-y-auto prose prose-sm"
              v-html="renderedContent">
            </div>
          </div>
        </div>

        <!-- 更新按钮 -->
        <div class="mt-6 flex justify-end gap-4">
          <button 
            @click="cancelEdit"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            取消
          </button>
          <button 
            @click="updateBlog"
            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            更新文章
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

const router = useRouter()
const route = useRoute()
const md = new MarkdownIt()

const blog = ref({
  title: '',
  content: '',
  tags: [],
  coverImage: null
})

const newTag = ref('')

onMounted(() => {
  // 从 localStorage 获取编辑的博客数据
  const editingBlog = JSON.parse(localStorage.getItem('editingBlog'))
  if (editingBlog) {
    blog.value = editingBlog
  }
})

const renderedContent = computed(() => {
  return md.render(blog.value.content)
})

const addTag = () => {
  if (newTag.value && !blog.value.tags.includes(newTag.value)) {
    blog.value.tags.push(newTag.value)
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  blog.value.tags = blog.value.tags.filter(t => t !== tag)
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      blog.value.coverImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const updateBlog = () => {
  // 获取所有博客
  const allBlogs = JSON.parse(localStorage.getItem('blogs') || '[]')
  // 找到并更新当前博客
  const index = allBlogs.findIndex(b => b.id.toString() === route.params.id)
  if (index !== -1) {
    allBlogs[index] = {
      ...blog.value,
      summary: blog.value.content.slice(0, 200) + '...',
      date: new Date().toISOString().split('T')[0] + ' (已编辑)'
    }
    // 保存更新后的博客列表
    localStorage.setItem('blogs', JSON.stringify(allBlogs))
  }
  // 清除编辑状态
  localStorage.removeItem('editingBlog')
  // 返回博客详情页
  router.push(`/blog/${route.params.id}`)
}

const cancelEdit = () => {
  // 清除编辑状态
  localStorage.removeItem('editingBlog')
  // 返回博客详情页
  router.push(`/blog/${route.params.id}`)
}
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
.prose ul {
  @apply list-disc pl-5 mb-4;
}
.prose ol {
  @apply list-decimal pl-5 mb-4;
}
</style> 