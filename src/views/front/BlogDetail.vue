<template>
  <div class="container mx-auto px-4 min-h-[calc(100vh-4rem)] mt-16">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <!-- ... loading SVG ... -->
    </div>

    <!-- 错误提示 -->
    <div v-else-if="errorMsg" class="text-center py-12">
      <!-- ... error message ... -->
    </div>

    <!-- 博客内容 -->
    <article v-else class="prose mx-auto bg-white/10 backdrop-blur-[7px] p-8 max-w-5xl min-h-[calc(100vh-4rem-4rem)]">
      <h1 class="blog-title font-bold text-gray-900 mb-4">{{ blog.title }}</h1>
      <div class="text-base text-gray-500 mb-8 flex items-center gap-2">
        <span>发布于 {{ formatDate(blog.createdAt) }}</span>
        <span v-if="blog.updatedAt && blog.updatedAt !== blog.createdAt">
          · 修改于 {{ formatDate(blog.updatedAt) }}
        </span>
      </div>
      <div class="markdown-body" v-html="renderedContent"></div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import markdownItMark from 'markdown-it-mark'
import markdownItTaskLists from 'markdown-it-task-lists'
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
  typographer: true,
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
.use(markdownItMark)
.use(markdownItTaskLists)

// 自定义行内代码渲染规则
md.renderer.rules.code_inline = function(tokens, idx) {
  return '<code>' + tokens[idx].content + '</code>';
}

// 自定义图片渲染规则
md.renderer.rules.image = function (tokens, idx, options, env, slf) {
  const token = tokens[idx]
  // 获取图片地址和替代文本
  const src = token.attrGet('src')
  let alt = token.content
  
  // 检查是否包含大小信息
  const match = alt.match(/^(.+?)\|(\d+)$/)
  if (match) {
    // 提取图片名称和大小
    alt = match[1]
    const size = match[2]
    // 返回带有宽度样式的img标签
    return `<img src="${src}" alt="${alt}" style="width: ${size}%" />`
  }
  
  // 如果没有大小信息，返回普通img标签
  return `<img src="${src}" alt="${alt}" />`
}

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
  window.scrollTo(0, 0)
})
</script>

<style>
.container {
  @apply max-w-full;
}
.prose {
  @apply max-w-none;
}
.prose p:has(img) {
  @apply flex justify-center;
}
.prose img {
  @apply h-auto rounded-lg shadow-lg my-2;
}
.prose h1 {
  @apply text-2xl font-bold mb-4;
  margin-top: 1em;
}
.prose h2 {
  @apply text-xl font-bold mb-3;
  margin-top: 0.8em;
}
.prose p {
  @apply mb-4 text-base;
  font-size: 1.1em;
  line-height: 1.6;
  color: #1a1a1a;
}
.prose pre {
  @apply bg-transparent;
}
.prose code {
  @apply bg-transparent;
}
.prose pre code {
  @apply bg-transparent p-0 text-white;
  font-size: 1.1em;
  line-height: 1.5;
}
.prose code:not(pre code) {
  @apply bg-gray-200 rounded px-1 py-0.5 text-sm text-gray-800;
  font-size: 1em;
}
article {
  @apply bg-white;
}

/* 超链接样式 */
.prose a {
  @apply text-blue-600 hover:text-blue-800;
}

/* 代码块背景 */
.prose pre {
  background: #1e1e1e !important;
  backdrop-filter: blur(4px);
}

/* 分割线样式 */
.prose hr {
  @apply my-8 border-0 border-b-2 border-gray-500;
}

/* 表格样式 */
.prose table {
  @apply w-full border-collapse mb-4;
}
.prose th,
.prose td {
  @apply border border-gray-500 p-2;
}
.prose th {
  @apply bg-gray-100;
}

/* 引用样式 */
.prose blockquote {
  @apply border-l-4 border-purple-500 pl-4 my-4 py-2;
  background: rgba(219, 234, 254, 0.2);
}

/* 高亮显示样式 */
.prose mark {
  @apply px-1;
  background: rgba(250, 253, 39, 0.6);
}

/* 列表样式 */
.prose ul {
  @apply list-disc pl-5 mb-1;
}

.prose ul li::marker {
  color: #4b5563;
}

.prose ul li,
.prose ol li {
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}

.prose ol {
  @apply list-decimal pl-5 mb-1;
}

.prose ul.contains-task-list {
  @apply mb-1;
}

.prose ul.contains-task-list li {
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}
</style>

<style scoped>
.blog-title {
  font-size: 2rem;  /* 96px */
  line-height: 1.2;
}
</style> 