# Vercel部署指南

## 步骤1：删除当前项目（如果存在）
1. 登录Vercel控制台
2. 找到当前的项目（houkongfan）
3. 点击项目设置
4. 滚动到页面底部，点击"Delete Project"
5. 确认删除

## 步骤2：重新创建项目
1. 点击"Add New Project"
2. 选择GitHub仓库：`sun3031106-jpg/houkongfan`
3. 点击"Import"

## 步骤3：配置构建选项
1. **Root Directory**: 输入 `frontend`
2. **Build Command**: 输入 `npm run build`
3. **Output Directory**: 输入 `dist`
4. 点击"Deploy"

## 步骤4：等待部署完成
1. 部署过程中，Vercel会自动安装依赖并构建项目
2. 部署完成后，Vercel会提供一个访问链接

## 步骤5：测试访问
1. 点击Vercel提供的访问链接
2. 确保游戏能够正常加载和运行

## 注意事项
- 确保GitHub仓库中的代码是完整的，包括frontend目录下的所有文件
- 如果部署失败，检查构建日志以了解具体的错误原因
- 确保构建选项配置正确，特别是Root Directory、Build Command和Output Directory