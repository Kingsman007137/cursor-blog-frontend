<template>
  <div>
    <!-- 导航栏 -->
    <nav class="backdrop-blur-md border-b border-gray-300 fixed top-0 left-0 right-0 z-50" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(3px); border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-gray-900 hover:text-black">首页</router-link>
            </div>
          </div>
          <!-- 提示图标 -->
          <div class="relative group">
            <div class="cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-800 hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <!-- 悬停提示卡片 -->
            <div class="absolute right-0 w-96 p-6 mt-2 bg-white/30 backdrop-blur-lg rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 text-lg font-bold text-gray-800 whitespace-nowrap text-center">
              彩蛋：刷新页面可以体验不一样的背景哦✨
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="mt-16">
      <router-view></router-view>
    </main>
  </div>
</template> 