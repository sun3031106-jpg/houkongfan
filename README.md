# AI海龟汤游戏

使用React + TypeScript + Tailwind CSS开发的AI海龟汤游戏网站。

## 项目结构

```
.
├── backend/         # 后端代码
│   ├── server.js    # Express服务器
│   └── package.json # 后端依赖
├── frontend/        # 前端代码
│   ├── src/         # 源代码
│   ├── public/      # 静态资源
│   ├── package.json # 前端依赖
│   └── vite.config.ts # Vite配置
└── README.md        # 项目说明
```

## 开发环境

### 前端
1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

### 后端
1. 进入后端目录：`cd backend`
2. 安装依赖：`npm install`
3. 启动服务器：`node server.js`

## 部署

### Vercel部署
1. 登录Vercel控制台
2. 点击"Add New Project"
3. 选择GitHub仓库
4. 配置项目：
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 点击"Deploy"

### 环境变量
- `VITE_AI_API_URL`: 后端API地址（生产环境）

## 游戏玩法
1. 选择一个海龟汤故事
2. 通过提问来推理故事的真相
3. AI会回答"是"、"否"或"无关"
4. 当你认为已经了解真相时，点击"查看汤底"