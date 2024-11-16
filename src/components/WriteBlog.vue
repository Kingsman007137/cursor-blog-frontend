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

        <!-- 发布按钮 -->
        <div class="mt-6 flex justify-end">
          <button 
            @click="saveDraft"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg mr-4 hover:bg-gray-200">
            保存草稿
          </button>
          <button 
            @click="publishBlog"
            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            发布文章
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'

const router = useRouter()
const md = new MarkdownIt()

const blog = ref({
  title: '',
  content: '',
  tags: [],
  coverImage: null
})

const newTag = ref('')

// 计算属性：渲染markdown内容
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
    // 这里可以处理图片上传
    const reader = new FileReader()
    reader.onload = (e) => {
      blog.value.coverImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function getRandomImage() {
  const id = Math.floor(Math.random() * 1000)
  return `https://picsum.photos/seed/${id}/800/400`
}

const publishBlog = () => {
  const blogId = Date.now()
  let coverImage = blog.value.coverImage

  // 如果没有上传封面，生成一个随机封面并保存
  if (!coverImage) {
    // 获取已存储的封面图片
    let blogCovers = JSON.parse(localStorage.getItem('defaultBlogCovers') || '{}')
    // 为新博客生成并保存封面
    coverImage = getRandomImage()
    blogCovers[blogId] = coverImage
    localStorage.setItem('defaultBlogCovers', JSON.stringify(blogCovers))
  }

  const newBlog = {
    id: blogId,
    title: blog.value.title,
    content: blog.value.content,
    summary: blog.value.content.slice(0, 200) + '...',
    coverImage: coverImage,  // 使用保存的封面图片
    date: new Date().toISOString().split('T')[0],
    author: '当前用户',
    tags: blog.value.tags
  }

  const existingBlogs = JSON.parse(localStorage.getItem('blogs') || '[]')
  existingBlogs.unshift(newBlog)
  localStorage.setItem('blogs', JSON.stringify(existingBlogs))
  router.push('/')
}

const saveDraft = () => {
  // 保存草稿逻辑
  console.log('保存草稿:', blog.value)
}
</script>

<style>
/* 添加markdown样式 */
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