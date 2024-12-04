<template>
  <div>
    <!-- 导航栏 -->
    <nav class="backdrop-blur-md border-b border-gray-300 fixed top-0 left-0 right-0 z-50" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(3px); border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-gray-900 hover:text-black">首页</router-link>
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