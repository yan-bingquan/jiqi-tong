// 济企通静态网站生成器
const fs = require('fs');
const path = require('path');

const BASE = '/jiqi-tong';
const COMPANIES = JSON.parse(fs.readFileSync(path.join(__dirname, 'source/_data/companies.json'), 'utf-8'));

// 确保输出目录存在
const outputDir = path.join(__dirname, 'public');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 生成星星HTML
function generateStars(rating) {
    const r = Math.round(rating || 0);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
}

// 评分颜色
function getRatingColor(rating) {
    if (rating >= 4) return '#52c41a';
    if (rating >= 3) return '#faad14';
    if (rating >= 2) return '#fa8c16';
    return '#ff4d4f';
}

// 首页HTML
function generateIndexHTML() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>济企通 - 济南求职避坑指南</title>
  <meta name="description" content="济企通是济南企业点评平台，让求职者少踩坑，让好企业被看见">
  <link rel="stylesheet" href="${BASE}/css/style.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <a href="${BASE}/" class="logo">
          <div class="logo-icon">济</div>
          <div class="logo-text">济企通</div>
        </a>
        <nav class="nav">
          <a href="${BASE}/" class="active">首页</a>
          <a href="${BASE}/companies.html">企业列表</a>
          <a href="${BASE}/#contribute">投稿</a>
        </nav>
      </div>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <h1>济企通</h1>
      <p class="subtitle">济南求职避坑指南 | 让求职者少踩坑，让好企业被看见</p>
      <div class="search-box">
        <input type="text" id="search-input" placeholder="搜索企业名称...">
        <button onclick="performSearch()">搜索</button>
      </div>
    </div>
  </section>

  <section class="stats-bar">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="number">${COMPANIES.length}0+</div>
          <div class="label">收录企业</div>
        </div>
        <div class="stat-item">
          <div class="number">5000+</div>
          <div class="label">真实点评</div>
        </div>
        <div class="stat-item">
          <div class="number">100%</div>
          <div class="label">免费查看</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="section-title">🔥 热门企业</h2>
      <div class="companies-grid">
        ${COMPANIES.slice(0, 12).map(c => `
        <a href="${BASE}/companies/${c.id}.html" class="company-card">
          <div class="company-header">
            <h3 class="company-name">${c.name}</h3>
            <span class="company-posts">${c.posts}条讨论</span>
          </div>
          ${c.business ? `<p class="company-business">${c.business}</p>` : ''}
          <div class="company-tags">
            ${c.hasOvertime ? '<span class="tag tag-warning">有加班讨论</span>' : ''}
            ${c.hasSalary ? '<span class="tag tag-info">有薪资讨论</span>' : ''}
          </div>
          ${c.summary ? `<p class="company-summary">${c.summary.substring(0, 60)}${c.summary.length > 60 ? '...' : ''}</p>` : ''}
        </a>`).join('')}
      </div>
      <div class="more-link">
        <a href="${BASE}/companies.html">查看全部 ${COMPANIES.length} 家企业 →</a>
      </div>
    </div>
  </section>

  <section class="section" id="contribute">
    <div class="container">
      <div class="contribute-section">
        <h3>📝 帮助更多人避坑</h3>
        <p>你在济南工作过哪些公司？分享你的真实经历，让求职者少走弯路。</p>
        <a href="https://www.xiaohongshu.com" target="_blank" class="contribute-btn">
          <span>🔍 微博搜索「颜究僧」</span>
          <span>小红书评论投稿</span>
        </a>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于济企通</h4>
          <p>济企通是济南本地企业点评平台，致力于为求职者提供真实、客观的企业评价信息。</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <a href="${BASE}/">首页</a>
          <a href="${BASE}/companies.html">企业列表</a>
          <a href="${BASE}/#contribute">投稿入口</a>
        </div>
        <div class="footer-section">
          <h4>免责说明</h4>
          <p>本站所有内容均来自用户分享，仅供参考。求职前请多方核实。</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 济企通 JiqiTong.com | 济南求职避坑指南</p>
      </div>
    </div>
  </footer>

  <script src="${BASE}/js/main.js"></script>
  <script>
    function performSearch() {
      const q = document.getElementById('search-input').value.trim().toLowerCase();
      if (!q) return;
      window.location.href = '${BASE}/companies.html?search=' + encodeURIComponent(q);
    }
    document.getElementById('search-input').addEventListener('keypress', e => {
      if (e.key === 'Enter') performSearch();
    });
  </script>
</body>
</html>`;
}

// 企业列表页HTML
function generateListHTML() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>企业列表 - 济企通</title>
  <meta name="description" content="济南企业点评列表，查看企业薪资、加班、评价">
  <link rel="stylesheet" href="${BASE}/css/style.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <a href="${BASE}/" class="logo">
          <div class="logo-icon">济</div>
          <div class="logo-text">济企通</div>
        </a>
        <nav class="nav">
          <a href="${BASE}/">首页</a>
          <a href="${BASE}/companies.html" class="active">企业列表</a>
          <a href="${BASE}/#contribute">投稿</a>
        </nav>
      </div>
    </div>
  </header>

  <section class="page-header">
    <div class="container">
      <h1>济南企业列表</h1>
      <p>共 ${COMPANIES.length} 家企业 | 数据来源：用户真实讨论</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="filter-bar">
        <input type="text" id="search-input" placeholder="搜索企业名称..." class="search-input">
        <select id="sort-select" class="sort-select">
          <option value="posts">按热度排序</option>
          <option value="name">按名称排序</option>
        </select>
      </div>
      <div class="companies-grid" id="companies-list">
        ${COMPANIES.map(c => `
        <a href="${BASE}/companies/${c.id}.html" class="company-card">
          <div class="company-header">
            <h3 class="company-name">${c.name}</h3>
            <span class="company-posts">${c.posts}条讨论</span>
          </div>
          ${c.business ? `<p class="company-business">${c.business}</p>` : ''}
          <div class="company-tags">
            ${c.hasOvertime ? '<span class="tag tag-warning">有加班讨论</span>' : ''}
            ${c.hasSalary ? '<span class="tag tag-info">有薪资讨论</span>' : ''}
          </div>
          ${c.summary ? `<p class="company-summary">${c.summary.substring(0, 60)}${c.summary.length > 60 ? '...' : ''}</p>` : ''}
        </a>`).join('')}
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p>© 2024 济企通 JiqiTong.com | 济南求职避坑指南</p>
      </div>
    </div>
  </footer>

  <script src="${BASE}/js/main.js"></script>
  <script>
    // 简单的客户端筛选
    const allCards = document.querySelectorAll('.company-card');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const list = document.getElementById('companies-list');
    
    // URL参数搜索
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get('search') || '';
    if (initialSearch) searchInput.value = initialSearch;
    
    function filterCards() {
      const q = searchInput.value.toLowerCase();
      let cards = Array.from(allCards);
      
      // 搜索过滤
      if (q) {
        cards = cards.filter(card => card.querySelector('.company-name').textContent.toLowerCase().includes(q));
      }
      
      // 排序
      if (sortSelect.value === 'name') {
        cards.sort((a, b) => a.querySelector('.company-name').textContent.localeCompare(b.querySelector('.company-name').textContent));
      }
      
      list.innerHTML = '';
      cards.forEach(card => list.appendChild(card));
    }
    
    searchInput.addEventListener('input', filterCards);
    sortSelect.addEventListener('change', filterCards);
    filterCards();
  </script>
</body>
</html>`;
}

// 企业详情页HTML
function generateDetailHTML(company) {
    const rating = company.rating || 3;
    const ratingColor = getRatingColor(rating);
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${company.name} - 济企通</title>
  <meta name="description" content="${company.name}怎么样？查看真实评价、薪资、加班情况">
  <link rel="stylesheet" href="${BASE}/css/style.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <a href="${BASE}/" class="logo">
          <div class="logo-icon">济</div>
          <div class="logo-text">济企通</div>
        </a>
        <nav class="nav">
          <a href="${BASE}/">首页</a>
          <a href="${BASE}/companies.html">企业列表</a>
          <a href="${BASE}/#contribute">投稿</a>
        </nav>
      </div>
    </div>
  </header>

  <section class="page-header">
    <div class="container">
      <a href="${BASE}/companies.html" class="back-link">← 返回企业列表</a>
      <h1>${company.name}</h1>
      <div class="company-meta">
        ${company.business ? `<span class="meta-item">📍 ${company.business}</span>` : ''}
        <span class="meta-item">💬 ${company.posts}条讨论</span>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="detail-grid">
        <div class="detail-main">
          <!-- 点评摘要 -->
          <div class="detail-card">
            <h3>💬 点评摘要</h3>
            ${company.summary ? `<p class="summary-text">${company.summary}</p>` : '<p class="empty-text">暂无详细点评</p>'}
          </div>

          <!-- 加班情况 -->
          <div class="detail-card">
            <h3>⏰ 加班情况</h3>
            ${company.overtime ? `<p class="overtime-text">${company.overtime}</p>` : '<p class="empty-text">暂无加班相关讨论</p>'}
          </div>

          <!-- 投递建议 -->
          <div class="detail-card">
            <h3>💡 求值建议</h3>
            <ul class="advice-list">
              ${company.hasSalary ? '<li>✅ 有用户分享过薪资信息</li>' : '<li>❓ 暂无薪资信息，建议面试时询问</li>'}
              ${company.hasOvertime ? '<li>✅ 有用户讨论过加班情况</li>' : '<li>❓ 暂无加班讨论，建议多方打听</li>'}
              <li>🔍 建议通过多个渠道核实信息</li>
            </ul>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="sidebar-card">
            <h4>基本信息</h4>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">企业名称</span>
                <span class="info-value">${company.name}</span>
              </div>
              ${company.address ? `<div class="info-item">
                <span class="info-label">地址</span>
                <span class="info-value">${company.address}</span>
              </div>` : ''}
              ${company.business ? `<div class="info-item">
                <span class="info-label">主营业务</span>
                <span class="info-value">${company.business}</span>
              </div>` : ''}
              <div class="info-item">
                <span class="info-label">数据来源</span>
                <span class="info-value">${company.posts}条用户讨论</span>
              </div>
            </div>
          </div>

          <div class="sidebar-card contribute-card">
            <h4>📝 补充信息</h4>
            <p>你是这家公司的员工吗？分享你的真实经历</p>
            <a href="https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(company.name)}" target="_blank" class="contribute-link">
              小红书搜索「${company.name}」
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p>© 2024 济企通 JiqiTong.com | 济南求职避坑指南</p>
      </div>
    </div>
  </footer>

  <script src="${BASE}/js/main.js"></script>
</body>
</html>`;
}

// 创建子目录
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// 生成所有页面
console.log('🚀 开始生成济企通静态网站...\n');

// 生成首页
fs.writeFileSync(path.join(outputDir, 'index.html'), generateIndexHTML());
console.log('✅ 生成 index.html');

// 生成企业列表页
fs.writeFileSync(path.join(outputDir, 'companies.html'), generateListHTML());
console.log('✅ 生成 companies.html');

// 生成企业详情页
ensureDir(path.join(outputDir, 'companies'));
COMPANIES.forEach(company => {
    fs.writeFileSync(path.join(outputDir, 'companies', `${company.id}.html`), generateDetailHTML(company));
    console.log(`✅ 生成 companies/${company.id}.html - ${company.name}`);
});

console.log('\n✨ 网站生成完成！');
console.log(`📁 输出目录: ${outputDir}`);
console.log('\n部署方式：');
console.log('1. 将 public/ 目录内容推送到 GitHub Pages');
console.log('2. 或使用 vercel/netlify 直接部署');
