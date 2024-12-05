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
              <svg class="h-7 w-7 text-gray-800 hover:text-black" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M454.4 387.1L319.3 555.8l-135-75.1c-13.7 53.6-20.8 101.2-20.8 133.9 0 190.5 154.4 344.9 344.8 345.1h0.2c190.5-0.2 344.8-154.6 344.8-345.1 0-62.9-26.3-180.6-75.2-291l-135 168.6-188.7-105.1zM330.9 
                784.5L312 811.3l-9.8-31.3-31.4-9.7 26.7-19-0.5-32.8 26.3 19.5 31-10.6-10.3 31.2 19.7 26.2-32.8-0.3z m232.5-40.3L547.3 796 516 751.7l-54.2 0.7 32.4-43.4-17.4-51.3 51.3 17.4 43.4-32.4-0.7 54.2 44.2 31.3-51.6 
                16z m131.3-153.8l16.2-34.7 17.7 33.9 38 4.7-26.8 27.3 7.3 37.6-34.2-17.1-33.5 18.5 5.7-37.8-28-26.1 37.6-6.3zM412.1 171.6l188.8 105 86-107.4C637.3 108 577.4 65.8 508.6 63.9h-0.1-0.1c-117.4 3.2-208.8 124-268 
                256l36.6 20.4 135.1-168.7z M444 334l188.8 105 125.7-157c-13.9-27.5-29.3-54-46.1-78.5l-101 126.3-188.8-105-135.2 168.6-63.2-35.2c-10.9 27.4-20.4 54.9-28.4 81.5l113.1 62.9L444 334z" fill="currentColor"/>
              </svg>
            </div>
            <!-- 悬停提示卡片 -->
            <div class="absolute right-0 w-96 p-6 mt-2 bg-white/10 backdrop-blur-2xl rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 text-lg font-bold text-gray-800 whitespace-nowrap text-center">
              彩蛋：<span class="text-blue-600 hover:text-blue-800 cursor-pointer" onclick="window.location.reload()">刷新</span>页面可以体验不一样的背景哦✨
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