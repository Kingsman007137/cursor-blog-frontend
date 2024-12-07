<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- 使用 grid 进行左右布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- 左侧图片区域 -->
      <div class="grid grid-cols-3 gap-[3px] w-full ml-8" style="max-width: 30rem;">
        <!-- 第一张大图 -->
        <div class="col-span-2 row-span-2 aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="border-top-left-radius: 0.375rem;">
          <img 
            src="@/assets/nine-grid/0.jpg" 
            alt="Main Photo" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
        <!-- 右上小图 -->
        <div class="aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="border-top-right-radius: 0.375rem; animation-delay: 100ms;">
          <img 
            src="@/assets/nine-grid/1.jpg" 
            alt="Grid Photo 1" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
        <!-- 右下小图 -->
        <div class="aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="animation-delay: 200ms;">
          <img 
            src="@/assets/nine-grid/2.jpg" 
            alt="Grid Photo 2" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
        <!-- 中间三张小图 -->
        <div class="aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="animation-delay: 300ms;">
          <img 
            src="@/assets/nine-grid/3.jpg" 
            alt="Grid Photo 3" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
        <div class="aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="animation-delay: 400ms;">
          <img 
            src="@/assets/nine-grid/4.jpg" 
            alt="Grid Photo 4" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
        <div class="aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="animation-delay: 500ms;">
          <img 
            src="@/assets/nine-grid/5.jpg" 
            alt="Grid Photo 5" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
        <!-- 底部三张小图 -->
        <div class="aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="border-bottom-left-radius: 0.375rem; animation-delay: 600ms;">
          <img 
            src="@/assets/nine-grid/6.jpg" 
            alt="Grid Photo 6" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
        <div class="aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="animation-delay: 700ms;">
          <img 
            src="@/assets/nine-grid/7.jpg" 
            alt="Grid Photo 7" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
        <div class="aspect-square overflow-hidden shadow-md animate-fade-scale" 
             style="border-bottom-right-radius: 0.375rem; animation-delay: 800ms;">
          <img 
            src="@/assets/nine-grid/8.jpg" 
            alt="Grid Photo 8" 
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
      </div>

      <!-- 右侧文字区域 -->
      <div class="flex flex-col justify-center lg:pl-8">
        <div class="w-full backdrop-blur-xl bg-white/10 rounded-md shadow-md p-8 relative" 
             style="max-width: 30rem; backdrop-filter: blur(20px) saturate(180%); background: rgba(255, 255, 255, 0.1); height: calc(30rem + 10rem);">
          <!-- 名字部分位置保持不变 -->
          <h1 class="font-bold text-gray-900 custom-font" 
              style="margin-top: 0.5rem; font-size: 3.5rem;">
            Kingsman Pan
          </h1>
          
          <!-- 使用绝对定位控制文字位置 -->
          <div class="absolute left-8 right-8" style="top: 25%;">
            <p 
              ref="textElement" 
              class="text-xl text-gray-800 leading-relaxed opacity-0"
            >
              {{ fullText }}
            </p>
            <p 
              class="text-xl text-gray-800 leading-relaxed absolute top-0 left-0 right-0"
              v-html="displayText + '<span class=\'animate-blink\'>|</span>'"
            >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const texts = [
  // 第一阶段：前两段（作为一个整体）
  [`你好，我是 Kingsman Pan，一位目前什么都还不是的人。欢迎来到我的个人空间！😁`,
   `我在全栈开发、Web3开发、云计算、量化和价投等领域有所涉猎，热衷于探索，创造有趣的项目。`],
  // 第二阶段：第三段
  `好了，没什么可介绍的了，这一行用来凑字数。。。`,
  // 第三阶段：最后一段
  `哦，对了，感谢Cursor，没有它我这个网站做不了这么好看的前端。🔆`
]

const displayText = ref('')
const textElement = ref(null)

const typeText = async () => {
  // 第一阶段：两段同时打字
  const maxLength = Math.max(texts[0][0].length, texts[0][1].length)
  for (let i = 0; i <= maxLength; i++) {
    const firstPart = texts[0][0].slice(0, i)
    const secondPart = texts[0][1].slice(0, i)
    displayText.value = `${firstPart}\n\n${secondPart}`
    await new Promise(resolve => setTimeout(resolve, 80))
  }
  
  // 暂停一下
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 第二阶段：显示第三段
  const secondPhase = displayText.value + '\n\n' + texts[1]
  for (let i = displayText.value.length; i <= secondPhase.length; i++) {
    displayText.value = secondPhase.slice(0, i)
    await new Promise(resolve => setTimeout(resolve, 80))
  }
  
  // 再次暂停
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 第三阶段：显示最后一段
  const finalText = secondPhase + '\n\n' + texts[2]
  for (let i = secondPhase.length; i <= finalText.length; i++) {
    displayText.value = finalText.slice(0, i)
    await new Promise(resolve => setTimeout(resolve, 80))
  }

  // 打字完成后，将 Cursor 转换为链接
  displayText.value = displayText.value.replace(
    'Cursor',
    '<a href="https://www.cursor.com/" target="_blank" class="text-blue-500 hover:text-blue-700">Cursor</a>'
  )
}

onMounted(() => {
  typeText()
})
</script>

<style scoped>
@font-face {
  font-family: 'CustomFont';
  src: url('@/assets/fonts/ClickSpeed.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

.custom-font {
  font-family: 'CustomFont', sans-serif;
}

/* 添加正文字体样式 */
p {
  white-space: pre-line;
  font-family: 'Chakra Petch', sans-serif;
  letter-spacing: 0.01em;  /* 稍微增加字间距 */
  line-height: 1.5;  /* 调整行高 */
  font-weight: 400;  /* 使用常规字重 */
}

.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-scale {
  animation: fadeScale 0.6s ease-out forwards;
  opacity: 0;
}
</style>