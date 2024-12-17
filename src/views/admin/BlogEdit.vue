<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? '编辑博客' : '写博客' }}
        <span v-if="draftTime" class="text-sm font-normal text-gray-500 ml-2">
          (草稿保存于 {{ draftTime }})
        </span>
      </h2>
      <div class="flex gap-4">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          取消
        </button>
        <button
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isSubmitting ? '发布中...' : '发布' }}
        </button>
      </div>
    </div>

    <div v-if="errorMsg" class="mb-4 text-red-500 text-center">
      {{ errorMsg }}
    </div>

    <!-- 标题输入 -->
    <div class="bg-white shadow-sm rounded-lg p-4 mb-2">
      <input
        v-model="blog.title"
        type="text"
        required
        class="w-full text-2xl font-bold px-3 py-2 border-b border-gray-200 focus:border-blue-500 outline-none"
        placeholder="请输入博客标题"
      >
    </div>

    <!-- Markdown编辑器 -->
    <div class="grid grid-cols-2 gap-0 bg-white shadow-lg rounded-lg">
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
          class="w-full h-[calc(100vh-180px)] p-4 font-mono text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
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
          class="w-full h-[calc(100vh-180px)] overflow-y-auto prose prose-sm max-w-none p-4 border rounded-lg"
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

    <!-- 链接输入对话框 -->
    <div v-if="showLinkDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium text-gray-900 mb-4">插入超链接</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">链接文本</label>
            <input
              v-model="linkText"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="显示的文本"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">链接地址</label>
            <input
              v-model="linkUrl"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://"
            >
          </div>
          <div v-if="linkError" class="text-red-500 text-sm">
            {{ linkError }}
          </div>
          <div class="flex justify-end gap-4">
            <button
              @click="showLinkDialog = false"
              class="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              取消
            </button>
            <button
              @click="handleLinkConfirm"
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
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

// 草稿相关函数
const DRAFT_KEY = 'blog_draft'

const saveDraft = () => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({
    title: blog.value.title,
    content: blog.value.content,
    lastSaved: new Date().toISOString()
  }))
}

const loadDraft = () => {
  const draft = localStorage.getItem(DRAFT_KEY)
  if (draft) {
    const { title, content } = JSON.parse(draft)
    blog.value.title = title
    blog.value.content = content
  }
}

const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY)
}

// 监听内容变化，自动保存草稿
watch(
  () => ({ title: blog.value.title, content: blog.value.content }),
  () => {
    if (!isEdit.value) {  // 只在写新博客时保存草稿
      saveDraft()
    }
  },
  { deep: true }
)

// 初始化markdown-it及其插件
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,  // 启用 typographer
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

// 自定义片渲染规则
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

// 快速插入的Markdown模板
const quickInserts = {
  table: {
    label: '表格',
    desc: '插入表格',
    template: null
  },
  image: {
    label: '图片',
    desc: '插入图片',
    template: null
  },
  link: {
    label: '链接',
    desc: '插入超链接',
    template: null
  },
  divider: {
    label: '分割线',
    desc: '插入分割线',
    template: '\n\n---\n\n'
  },
  code: {
    label: '代码块',
    desc: '插入代码块',
    template: '\n```java\n// 你的代码\n```\n'
  },
  quote: {
    label: '引用',
    desc: '插入引用文本',
    template: '\n> 引用的文本\n'
  }
}

// 表格对话框相关状态
const showTableDialog = ref(false)
const tableRows = ref(3)
const tableCols = ref(3)
const tableError = ref('')

// 链接对话框相关状态
const showLinkDialog = ref(false)
const linkText = ref('')
const linkUrl = ref('')
const linkError = ref('')

// 处理图片选择
const handleImageSelect = async (event) => {
  const textarea = document.querySelector('textarea')
  const cursorPosition = textarea.selectionStart
  const scrollTop = textarea.scrollTop  // 保存当前滚动位置
  
  const file = event.target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/adm/images/upload`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'token': localStorage.getItem('token')
      },
      body: formData
    })
    
    const data = await response.json()
    if (data.code === 1) {
      // 直接插入图片的Markdown语法
      const imageMarkdown = `![图片|50](${data.data})`
      const content = blog.value.content
      blog.value.content = content.substring(0, cursorPosition) + imageMarkdown + content.substring(cursorPosition)
      
      // 在下一个事件循环中设置光标位置和滚动位置
      nextTick(() => {
        textarea.focus()
        const newPosition = cursorPosition + imageMarkdown.length
        textarea.setSelectionRange(newPosition, newPosition)
        textarea.scrollTop = scrollTop  // 恢复滚动位置
      })
    } else {
      errorMsg.value = data.msg || '上传图片失败'
    }
  } catch (error) {
    console.error('上传图片失败:', error)
    errorMsg.value = '上传图片失败，请稍后重试'
  }
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
      errorMsg.value = data.msg || '获取客详情失败'
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
      clearDraft()  // 发布成功后清除草稿
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
    tableError.value = '请输入行数列数'
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
  e.preventDefault()  // 阻止默认的tab行为
  const textarea = e.target
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const scrollTop = textarea.scrollTop  // 保存当前滚动位置
  
  // 在光标位置插入4个空格
  blog.value.content = blog.value.content.substring(0, start) + '    ' + blog.value.content.substring(end)
  
  // 在下一个事件循环中设置光标位置和滚动位置
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + 4, start + 4)
    textarea.scrollTop = scrollTop  // 恢复滚动位置
  })
}

onMounted(() => {
  // 如果是编辑模式，获取博客详
  if (isEdit.value) {
    fetchBlog(route.params.id)
  } else {
    loadDraft()  // 果是写新博客，加载草稿
  }
})

// 添加提示信息
const getDraftTime = () => {
  const draft = localStorage.getItem(DRAFT_KEY)
  if (draft) {
    const { lastSaved } = JSON.parse(draft)
    return new Date(lastSaved).toLocaleString('zh-CN')
  }
  return null
}

const draftTime = computed(() => {
  return !isEdit.value && getDraftTime()
})

// 处理取消按钮
const handleCancel = () => {
  if (!isEdit.value) {  // 只在写新博客时清除草稿
    clearDraft()
  }
  router.back()
}

// 修改插入模板的函数
const insertTemplate = (template) => {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const scrollTop = textarea.scrollTop  // 保存当前滚动位置
  const content = blog.value.content
  
  blog.value.content = content.substring(0, start) + template + content.substring(end)
  
  // 在下一个事件循环中设置光标位置和滚动位置
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + template.length, start + template.length)
    textarea.scrollTop = scrollTop  // 恢复滚动位置
  })
}

// 修改插入Markdown的函数
const insertMarkdown = async (key) => {
  if (key === 'table') {
    showTableDialog.value = true
    tableRows.value = 3
    tableCols.value = 3
    tableError.value = ''
  } else if (key === 'image') {
    // 触发文件选择
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = handleImageSelect
    input.click()
  } else if (key === 'link') {
    showLinkDialog.value = true
    linkText.value = ''
    linkUrl.value = ''
    linkError.value = ''
  } else {
    insertTemplate(quickInserts[key].template)
  }
}

// 处理链接确认
const handleLinkConfirm = () => {
  if (!linkText.value || !linkUrl.value) {
    linkError.value = '请输入链接文本和地址'
    return
  }
  
  const linkMarkdown = `[${linkText.value}](${linkUrl.value})`
  insertTemplate(linkMarkdown)
  showLinkDialog.value = false
  linkText.value = ''
  linkUrl.value = ''
  linkError.value = ''
}

// 自定义行内代码渲染规则
md.renderer.rules.code_inline = function(tokens, idx) {
  return '<code>' + tokens[idx].content + '</code>';
}
</script>

<style>
.prose {
  @apply max-w-none;
}

/* 超链接样式 */
.prose a {
  @apply text-blue-600 hover:text-blue-800;
}

/* 正文字体大小 */
.prose p {
  @apply mb-4 text-base;
  font-size: 1.1em;
  line-height: 1.6;
  color: #1a1a1a;  /* 更深的字体颜色 */
}

/* 分割线样式 */
.prose hr {
  @apply my-8 border-0 border-b-2 border-gray-500;
}

/* 引用样式 */
.prose blockquote {
  @apply border-l-4 border-purple-500 pl-4 my-4 py-2;
  background: rgba(219, 234, 254, 0.2);
}

/* 引用文本样式 */
.prose blockquote p::before,
.prose blockquote p::after {
  content: none !important;
}

.prose blockquote p {
  @apply text-gray-800 not-italic;
}

/* 图片容器样式 */
.prose p:has(img) {
  @apply flex justify-center;
}

/* 图片样式 */
.prose img {
  @apply h-auto rounded-lg shadow-lg my-2;
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
.prose ul {
  @apply list-disc pl-5 mb-4;
}

.prose ul li {
  @apply text-gray-800 not-italic;
}

.prose ul li::marker {
  color: #4b5563;  /* 更浅的灰色标号 */
}

.prose ol {
  @apply list-decimal pl-5 mb-4;
}

.prose table {
  @apply w-full border-collapse mb-4;
}
.prose th,
.prose td {
  @apply border border-gray-500 p-2;
}
.prose th {
  @apply bg-gray-100;
  background: rgba(255, 255, 255, 0.1);  /* 淡色半透明背景 */
}
.prose mark {
  @apply px-1;
  background: rgba(247, 236, 13, 0.6);  /* 黄色半透明背景 */
}
.prose input[type="checkbox"] {
  @apply mr-2;
}
.prose pre {
  @apply bg-black rounded-lg p-4 mb-4 overflow-x-auto;
}
.prose pre code {
  @apply bg-transparent p-0 text-white;
  font-size: 1.1em;
  line-height: 1.5;
}
.prose code:not(pre code) {
  @apply rounded px-1 py-0.5 text-sm text-gray-800;
  background: rgba(229, 231, 235, 0.3);  /* 淡灰色半透明背景 */
}
.hljs {
  background: #1E1E1E !important;
  color: #D4D4D4 !important;
}
</style>