<template>
  <div>
    <!-- 导航栏 -->
    <nav class="backdrop-blur-md border-b border-gray-300 fixed top-0 left-0 right-0 z-50" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(3px); border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex space-x-8">
            <div class="flex-shrink-0 flex items-center">
              <a 
                href="javascript:void(0)" 
                @click="handleHomeClick" 
                class="text-2xl font-bold text-gray-900 hover:text-black cursor-pointer"
              >
                首页
              </a>
            </div>
            <div class="flex-shrink-0 flex items-center">
              <router-link 
                to="/blogs/about" 
                class="text-2xl font-bold text-gray-900 hover:text-black"
              >
                关于
              </router-link>
            </div>
          </div>
          <!-- 右侧图标区域 -->
          <div class="flex items-center space-x-6">
            <!-- 提示图标 -->
            <div class="relative group">
              <div>
                <svg class="h-7 w-7 text-gray-800 hover:text-black" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M512 0C398.472533 0 291.953778 84.343467 209.271467 220.7744 136.840533 340.2752 91.022222 488.561778 91.022222 603.022222c0 232.504889 188.472889 420.977778 420.977778 420.977778s420.977778-188.472889 420.977778-420.977778c0-114.460444-45.818311-262.747022-118.249245-382.247822C732.0576 84.343467 625.516089 0 512 0z m0 68.266667c84.662044 0 172.760178 69.745778 244.349156 187.881244C822.601956 365.488356 864.711111 501.737244 864.711111 603.022222c0 194.787556-157.923556 352.711111-352.711111 352.711111C317.212444 955.733333 159.288889 797.809778 159.288889 603.022222c0-101.284978 42.097778-237.533867 108.361955-346.874311C339.239822 138.012444 427.337956 68.266667 512 68.266667z" fill="currentColor"/>
                  <path d="M443.733333 762.311111m-68.266666 0a68.266667 68.266667 0 1 0 136.533333 0 68.266667 68.266667 0 1 0-136.533333 0Z" fill="currentColor"/>
                  <path d="M318.577778 603.022222m-56.888889 0a56.888889 56.888889 0 1 0 113.777778 0 56.888889 56.888889 0 1 0-113.777778 0Z" fill="currentColor"/>
                </svg>
              </div>
              <!-- 彩蛋提示卡片 -->
              <div class="absolute right-0 w-96 p-6 mt-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 text-lg font-bold text-gray-800 whitespace-nowrap text-center"
                   style="backdrop-filter: blur(20px) saturate(180%); background: rgba(255, 255, 255, 0.5);">
                彩蛋：<span class="text-blue-600 hover:text-blue-800 cursor-pointer" onclick="window.location.reload()">刷新</span>页面可以体验不一样背景哦✨
              </div>
            </div>

            <!-- 打赏图标 -->
            <div class="relative group">
              <div>
                <svg class="h-7 w-7 text-gray-800 hover:text-black" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M512.512 2.048C229.888 2.048 0 231.424 0 513.024S229.888 1024 512.512 1024 1025.536 794.624 1025.536 513.024 795.648 2.048 512.512 2.048z m0 954.88c-245.76 0-445.44-199.168-445.44-443.904s199.68-443.904 445.44-443.904 445.44 199.168 445.44 443.904-199.68 443.904-445.44 443.904z" fill="currentColor"/>
                  <path d="M654.336 489.472c18.432 0 33.792-14.848 33.792-33.28s-14.848-33.28-33.792-33.28h-115.712v-5.632L662.016 307.712c12.8-12.288 13.312-32.768 1.536-46.08-11.776-13.312-32.256-14.848-46.08-4.096L506.368 356.352 404.48 258.56c-13.824-11.264-33.792-10.752-46.08 2.048-12.288 12.8-12.288 32.768-0.512 46.08l113.664 108.544v7.168H355.328c-18.432 0-33.792 14.848-33.792 33.28s14.848 33.28 33.792 33.28h115.712v52.224H355.328c-18.432 0-33.792 14.848-33.792 33.28s14.848 33.28 33.792 33.28h115.712V752.64c-0.512 12.288 5.632 24.064 16.384 30.208 10.752 6.144 24.064 6.144 34.304 0 10.752-6.144 16.896-17.92 16.384-30.208v-144.896h115.712c18.432 0 33.792-14.848 33.792-33.28s-14.848-33.28-33.792-33.28h-115.712V489.472h116.224z" fill="currentColor"/>
                </svg>
              </div>
              <!-- 打赏面板 -->
              <div class="absolute right-0 w-80 p-6 mt-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                   style="backdrop-filter: blur(20px) saturate(180%); background: rgba(255, 255, 255, 0.9);">
                <img src="@/assets/wechat-pay.jpg" alt="微信打赏码" class="w-full rounded-lg shadow-md">
                <p class="mt-3 text-center text-gray-800 font-medium text-lg">感谢您的支持 ❤️</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="mt-16">
      <router-view ref="currentView"></router-view>
    </main>
  </div>
</template> 

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const currentView = ref(null)

const handleHomeClick = () => {
  if (route.path === '/blogs' && currentView.value?.resetAndFetch) {
    currentView.value.resetAndFetch()
  } else {
    router.push('/')
  }
}
</script> 