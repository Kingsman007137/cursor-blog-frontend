<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <article class="prose lg:prose-lg mx-auto">
      <div class="flex justify-between items-start mb-6 not-prose">
        <h1 class="text-4xl font-bold text-gray-900">{{ blog.title }}</h1>
        <div class="flex gap-2">
          <button @click="editBlog" 
            class="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50">
            编辑
          </button>
          <button @click="confirmDelete" 
            class="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-600 rounded-lg hover:bg-red-50">
            删除
          </button>
        </div>
      </div>
      <div class="text-gray-600 mb-8 not-prose">
        <span>{{ blog.date }}</span>
        <span class="mx-2">·</span>
        <span>{{ blog.author }}</span>
        <div class="flex gap-2 mt-3">
          <span v-for="tag in blog.tags" :key="tag"
            class="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full">
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="not-prose mb-8">
        <img :src="blog.coverImage" :alt="blog.title" 
          class="w-full aspect-[21/9] object-cover rounded-lg"/>
      </div>
      <div v-html="renderedContent">
      </div>
    </article>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-semibold mb-4">确认删除</h3>
        <p class="text-gray-600 mb-6">确定要删除这篇博客吗？此操作无法撤销。</p>
        <div class="flex justify-end gap-4">
          <button @click="showDeleteModal = false" 
            class="px-4 py-2 text-gray-600 hover:text-gray-800">
            取消
          </button>
          <button @click="deleteBlog" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const router = useRouter()
const md = new MarkdownIt()
const blog = ref({})
const showDeleteModal = ref(false)

const renderedContent = computed(() => {
  return md.render(blog.value.content || '')
})

onMounted(() => {
  const allBlogs = JSON.parse(localStorage.getItem('blogs') || '[]')
  const currentBlog = allBlogs.find(b => b.id.toString() === route.params.id)
  
  if (currentBlog) {
    blog.value = currentBlog
  } else {
    const defaultBlogCovers = JSON.parse(localStorage.getItem('defaultBlogCovers') || '{}')
    
    const defaultBlogs = [
      {
        id: 1,
        title: '开始Vue之旅',
        content: '# Vue3的新特性\n\nVue3带来了许多激动人心的新特性...',
        coverImage: defaultBlogCovers[1],
        date: '2024-03-20',
        author: '张三',
        tags: ['Vue', '前端', '教程']
      },
      {
        id: 2,
        title: 'Tailwind CSS使用技巧',
        content: '# Tailwind CSS 入门指南\n\n本文将介绍如何高效使用Tailwind CSS...',
        coverImage: defaultBlogCovers[2],
        date: '2024-03-19',
        author: '李四',
        tags: ['CSS', 'Tailwind', '设计']
      }
    ]
    blog.value = defaultBlogs.find(b => b.id.toString() === route.params.id) || {
      title: '博客未找到',
      content: '抱歉，找不到该博客内容',
      date: '',
      author: '',
      tags: []
    }
  }
})

const editBlog = () => {
  localStorage.setItem('editingBlog', JSON.stringify(blog.value))
  router.push(`/edit/${blog.value.id}`)
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const deleteBlog = () => {
  const allBlogs = JSON.parse(localStorage.getItem('blogs') || '[]')
  const updatedBlogs = allBlogs.filter(b => b.id.toString() !== route.params.id)
  localStorage.setItem('blogs', JSON.stringify(updatedBlogs))
  showDeleteModal.value = false
  router.push('/')
}
</script>

<style>
.prose {
  @apply max-w-3xl !important;
}
.prose h1 {
  @apply text-3xl font-bold mb-6 text-gray-900;
}
.prose h2 {
  @apply text-2xl font-bold mb-4 mt-8 text-gray-900;
}
.prose h3 {
  @apply text-xl font-bold mb-3 mt-6 text-gray-900;
}
.prose p {
  @apply mb-6 text-gray-700 leading-relaxed;
}
.prose ul {
  @apply list-disc pl-6 mb-6 text-gray-700;
}
.prose ol {
  @apply list-decimal pl-6 mb-6 text-gray-700;
}
.prose a {
  @apply text-blue-600 hover:text-blue-800 underline;
}
.prose blockquote {
  @apply border-l-4 border-gray-200 pl-4 italic my-6 text-gray-600;
}
.prose code {
  @apply bg-gray-100 rounded px-1 py-0.5 text-sm text-gray-800;
}
.prose pre {
  @apply bg-gray-100 rounded-lg p-4 mb-6 overflow-x-auto;
}

.not-prose {
  @apply max-w-3xl mx-auto w-full;
}
</style> 