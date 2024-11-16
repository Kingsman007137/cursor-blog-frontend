<template>
  <div class="min-h-screen bg-white">
    <nav class="border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <router-link to="/" class="text-xl font-medium text-gray-800 hover:text-gray-600">
          首页
        </router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template> 