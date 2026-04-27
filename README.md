# 济企通 - 济南求职避坑指南

济南企业点评平台，帮你了解真实的公司情况。

**在线访问**：https://yankuseng.github.io/jiqi-tong/

## 项目结构

```
jiqi-tong-site/
├── source/_data/companies.json   # 企业数据（20家济南企业）
├── generate-site.js              # 静态网站生成器
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── package.json
└── README.md
```

## 快速开始

### 生成网站

```bash
node generate-site.js
```

生成后的静态文件在当前目录（直接在本地打开 `index.html` 也能正常访问）。

### 部署到 GitHub Pages

推送代码到 `main` 分支，GitHub Actions 会自动构建并部署到：
https://yankuseng.github.io/jiqi-tong/

### 添加新企业

编辑 `source/_data/companies.json`，添加企业数据后重新执行 `node generate-site.js` 生成页面。

## 技术说明

- **生成器**：`generate-site.js`（Node.js，无需额外依赖）
- **样式**：`css/style.css`（生成时自动复制）
- **数据**：`source/_data/companies.json`
- **BASE 路径**：`/jiqi-tong`（适配 GitHub Pages 子路径部署）

## GitHub 仓库

https://github.com/yankuseng/jiqi-tong
