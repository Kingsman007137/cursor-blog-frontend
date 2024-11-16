<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 顶部标题和写博客按钮 -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">所有文章</h1>
      <router-link to="/write" 
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        写博客
      </router-link>
    </div>
    
    <!-- 博客列表 -->
    <div class="grid grid-cols-1 gap-8">
      <article v-for="blog in blogs" :key="blog.id" 
        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="md:flex">
          <div class="md:w-1/3">
            <img :src="blog.coverImage" :alt="blog.title" 
              class="w-full h-48 md:h-full object-cover"/>
          </div>
          <div class="md:w-2/3 p-6">
            <div class="flex items-center mb-2">
              <span class="text-sm text-gray-500">{{ blog.date }}</span>
              <span class="mx-2 text-gray-300">|</span>
              <span class="text-sm text-gray-600">{{ blog.author }}</span>
            </div>
            <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ blog.title }}</h2>
            <p class="text-gray-600 mb-4 line-clamp-3">{{ blog.summary }}</p>
            <div class="flex items-center justify-between">
              <div class="flex gap-2">
                <span v-for="tag in blog.tags" :key="tag"
                  class="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full">
                  {{ tag }}
                </span>
              </div>
              <router-link :to="'/blog/' + blog.id" 
                class="text-blue-600 hover:text-blue-800 font-medium">
                阅读更多 →
              </router-link>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const blogs = ref([
  {
    id: 1,
    title: '开始Vue之旅',
    summary: 'Vue3的新特性和基础知识介绍，包括组合式API、响应式系统、生命周期钩子等核心概念的详细讲解...',
    coverImage: 'https://picsum.photos/800/400',
    date: '2024-03-20',
    author: '张三',
    tags: ['Vue', '前端', '教程']
  },
  {
    id: 2,
    title: 'Tailwind CSS使用技巧',
    summary: '如何高效使用Tailwind CSS构建现代化界面，包括常用类名、响应式设计、自定义配置等实用技巧...',
    coverImage: 'https://picsum.photos/800/400?random=2',
    date: '2024-03-19',
    author: '李四',
    tags: ['CSS', 'Tailwind', '设计']
  },
])

onMounted(() => {
  // 从localStorage读取博客数据
  const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]')
  // 将新发布的博客与默认博客合并
  blogs.value = [...savedBlogs, ...blogs.value]
})
</script> 