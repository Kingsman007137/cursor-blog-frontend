# 使用Cursor完成的博客系统前端

一个 Vue 3 + Vite + Tailwind CSS 构建的简洁博客系统前端。

## 环境要求

- Node.js >= 18.0.0
- npm >= 10.2.3

## 依赖

- Vue 3
- Vue Router
- Tailwind CSS
- markdown-it (Markdown 渲染)
- @tailwindcss/typography (Markdown 样式)

## 运行

```bash
# 安装依赖
npm install
# 安装markdown依赖
npm install markdown-it
# 启动开发服务器
npm run dev
# 构建生产版本
npm run build

# 设置淘宝镜像（可选，如果下载太慢）
npm config set registry https://registry.npmmirror.com
```

## 项目结构

### 前台
- 博客列表展示
- 博客详情页面

### 后台管理
- 管理员登录
- 博客的增删改查
- Markdown 编辑器

## TODO

- [x] 完善写博客和博客编辑功能（如保存草稿，图片操作）
- [x] 完善图片的上传和显示
- [ ] 更改主页样式，加入封面
- [ ] 文章按月份分类功能
- [ ] 首页下拉分页查询
- [ ] 文章搜索功能
- [ ] 等等......
