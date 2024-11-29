<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? '编辑博客' : '写博客' }}
      </h2>
      <div class="flex gap-4">
        <button
          type="button"
          @click="router.back()"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          取消
        </button>
        <button
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isSubmitting ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <div v-if="errorMsg" class="mb-4 text-red-500 text-center">
      {{ errorMsg }}
    </div>

    <!-- 标题输入 -->
    <div class="bg-white shadow-sm rounded-lg p-4 mb-4">
      <input
        v-model="blog.title"
        type="text"
        required
        class="w-full text-2xl font-bold px-3 py-2 border-b border-gray-200 focus:border-blue-500 outline-none"
        placeholder="请输入博客标题"
      >
    </div>

    <!-- Markdown编辑器 -->
    <div class="grid grid-cols-2 gap-4 bg-white shadow-lg rounded-lg">
      <!-- 编辑区 -->
      <div class="p-4 border-r">
        <div class="mb-2 flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">编辑</span>
          <div class="space-x-2">
            <button
              v-for="(item, key) in quickInserts"
              :key="key"
              @click="insertMarkdown(key)"
              class="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              :title="item.desc"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
        <textarea
          v-model="blog.content"
          class="w-full h-[calc(100vh-300px)] p-4 font-mono text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="使用Markdown语法编写文章..."
          @keydown.tab.prevent="handleTab"
        ></textarea>
      </div>

      <!-- 预览区 -->
      <div class="p-4">
        <div class="mb-2">
          <span class="text-sm font-medium text-gray-700">预览</span>
        </div>
        <div 
          class="w-full h-[calc(100vh-300px)] overflow-y-auto prose prose-sm max-w-none p-4 border rounded-lg"
          v-html="renderedContent"
        >
        </div>
      </div>
    </div>

    <!-- 表格行列输入对话框 -->
    <div v-if="showTableDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-80">
        <h3 class="text-lg font-medium text-gray-900 mb-4">插入表格</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">行数</label>
            <input
              v-model.number="tableRows"
              type="number"
              min="1"
              max="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">列数</label>
            <input
              v-model.number="tableCols"
              type="number"
              min="1"
              max="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div v-if="tableError" class="text-red-500 text-sm">
            {{ tableError }}
          </div>
          <div class="flex justify-end gap-4">
            <button
              @click="showTableDialog = false"
              class="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              取消
            </button>
            <button
              @click="handleTableConfirm"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItMark from 'markdown-it-mark'
import markdownItMultimdTable from 'markdown-it-multimd-table'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

const router = useRouter()
const route = useRoute()
const isSubmitting = ref(false)
const errorMsg = ref('')

const blog = ref({
  title: '',
  content: ''
})

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
  .use(markdownItTaskLists)
  .use(markdownItMark)
  .use(markdownItMultimdTable)

// 快速插入的Markdown模板
const quickInserts = {
  table: {
    label: '表格',
    desc: '插入表格',
    template: null
  },
  code: {
    label: '代码块',
    desc: '插入代码块',
    template: '\n```java\n// 你的代码\n```\n'
  },
  quote: {
    label: '引用',
    desc: '插入引用文本',
    template: '\n> 引用文本\n'
  }
}

// 表格对话框相关状态
const showTableDialog = ref(false)
const tableRows = ref(3)
const tableCols = ref(3)
const tableError = ref('')

// 修改插入Markdown的函数
const insertMarkdown = async (key) => {
  if (key === 'table') {
    showTableDialog.value = true
    tableRows.value = 3
    tableCols.value = 3
    tableError.value = ''
  } else {
    insertTemplate(quickInserts[key].template)
  }
}

// 实际插入模板的函数
const insertTemplate = (template) => {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const content = blog.value.content
  blog.value.content = content.substring(0, start) + template + content.substring(end)
  // 插入后将光标移动到合适位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + template.length, start + template.length)
  }, 0)
}

const isEdit = computed(() => route.params.id !== undefined)

// 渲染Markdown内容
const renderedContent = computed(() => {
  return md.render(blog.value.content || '')
})

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
    
    if (response.status === 401) {
      localStorage.removeItem('token')
      router.replace('/adm/login')
      return
    }
    
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

// 处理表格确认
const handleTableConfirm = () => {
  if (!tableRows.value || !tableCols.value) {
    tableError.value = '请输入行数和列数'
    return
  }
  
  if (tableRows.value > 30 || tableCols.value > 30) {
    tableError.value = '行数和列数不能超过30'
    return
  }
  
  if (tableRows.value < 1 || tableCols.value < 1) {
    tableError.value = '行数和列数必须大于0'
    return
  }
  
  // 生成表格模板
  let template = '\n|'
  // 表头
  for (let i = 0; i < tableCols.value; i++) {
    template += ` 标题${i + 1} |`
  }
  // 对齐行
  template += '\n|'
  for (let i = 0; i < tableCols.value; i++) {
    template += '-------|'
  }
  // 数据行
  for (let i = 0; i < tableRows.value; i++) {
    template += '\n|'
    for (let j = 0; j < tableCols.value; j++) {
      template += ` 内容${i + 1}-${j + 1} |`
    }
  }
  template += '\n'
  
  insertTemplate(template)
  showTableDialog.value = false
}

// 处理Tab键
const handleTab = (e) => {
  const textarea = e.target
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  // 在光标位置插入4个空格
  blog.value.content = blog.value.content.substring(0, start) + '    ' + blog.value.content.substring(end)
  
  // 将光标移动到插入空格后的位置
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 4
  }, 0)
}

onMounted(() => {
  // 如果是编辑模式，获取博客详情
  if (isEdit.value) {
    fetchBlog(route.params.id)
  }
})
</script>

<style>
/* Markdown 预览样式 */
.prose {
  @apply max-w-none;
}
.prose h1 {
  @apply text-2xl font-bold mb-4;
}
.prose h2 {
  @apply text-xl font-bold mb-3;
}
.prose h3 {
  @apply text-lg font-bold mb-2;
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
.prose table {
  @apply w-full border-collapse mb-4;
}
.prose th,
.prose td {
  @apply border border-gray-300 p-2;
}
.prose th {
  @apply bg-gray-50;
}
.prose mark {
  @apply bg-yellow-200 px-1;
}
.prose input[type="checkbox"] {
  @apply mr-2;
}
.prose blockquote {
  @apply border-l-4 border-gray-200 pl-4 italic my-4;
}
.prose pre {
  @apply bg-[#1E1E1E] rounded-lg p-4 mb-4 overflow-x-auto;
}
.prose pre code {
  @apply bg-transparent p-0 text-white;
  font-size: 0.9em;
  line-height: 1.5;
}
.prose code:not(pre code) {
  @apply bg-gray-200 rounded px-1 py-0.5 text-sm text-gray-800;
}
.hljs {
  background: #1E1E1E !important;
  color: #D4D4D4 !important;
}
</style>