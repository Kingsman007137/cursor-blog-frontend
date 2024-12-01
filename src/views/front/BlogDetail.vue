<template>
  <div class="container mx-auto px-4 py-8">
    <article class="max-w-5xl mx-auto bg-white rounded-lg overflow-hidden w-4/5">
      <div class="p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ blog.title }}</h1>
        <div class="text-gray-500 mb-8">
          {{ formatDate(blog.updatedAt) }}
        </div>
        <div class="prose max-w-none" v-html="renderedContent"></div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

const route = useRoute()
const router = useRouter()
const blog = ref({})

// 初始化markdown-it及其插件
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})

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

// 计算属性用于渲染Markdown内容
const renderedContent = computed(() => {
  return md.render(blog.value.content || '')
})

onMounted(() => {
  fetchBlog(route.params.id)
})
</script>

<style>
.container {
  @apply max-w-full;
}
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
.prose pre {
  @apply bg-transparent;
}
.prose code {
  @apply bg-transparent;
}
article {
  @apply bg-white;
}
</style> 