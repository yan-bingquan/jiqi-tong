// 济企通 - 核心JavaScript

// 全局变量
let allCompanies = [];
let filteredCompanies = [];
let currentPage = 1;
const itemsPerPage = 20;
let currentFilter = 'hot'; // 'hot' or 'rating'

// 加载数据
async function loadCompanies() {
  try {
    const response = await fetch('/source/_data/companies.json');
    allCompanies = await response.json();
    filteredCompanies = [...allCompanies];
    return allCompanies;
  } catch (error) {
    console.error('加载企业数据失败:', error);
    return [];
  }
}

// 搜索企业
function searchCompanies(keyword) {
  if (!keyword.trim()) {
    filteredCompanies = [...allCompanies];
  } else {
    const lowerKeyword = keyword.toLowerCase();
    filteredCompanies = allCompanies.filter(company => 
      company.name.toLowerCase().includes(lowerKeyword) ||
      (company.business && company.business.toLowerCase().includes(lowerKeyword))
    );
  }
  currentPage = 1;
  return filteredCompanies;
}

// 筛选企业
function filterCompanies(type) {
  currentFilter = type;
  if (type === 'hot') {
    filteredCompanies = [...allCompanies].sort((a, b) => b.posts - a.posts);
  } else if (type === 'rating') {
    filteredCompanies = [...allCompanies].sort((a, b) => b.rating - a.rating);
  }
  currentPage = 1;
  return filteredCompanies;
}

// 生成分页
function getPaginatedCompanies() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCompanies.slice(start, end);
}

// 获取总页数
function getTotalPages() {
  return Math.ceil(filteredCompanies.length / itemsPerPage);
}

// 渲染企业卡片
function renderCompanyCard(company) {
  const stars = generateStars(company.rating);
  const overtimeTag = company.hasOvertime ? '<span class="overtime-tag">有加班评价</span>' : '';
  const salaryTag = company.hasSalary ? '<span class="salary-tag">有薪资数据</span>' : '';
  
  return `
    <a href="/companies/${company.id}.html" class="company-card">
      <div class="card-header">
        <div>
          <div class="company-name">${company.name}</div>
          <div class="company-posts">${company.posts}条讨论</div>
        </div>
        <div class="rating">
          ${stars}
          <span class="rating-text">${company.rating.toFixed(1)}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="business">${company.business || '主营业务未知'}</div>
        <div class="address">${company.address || '地址未知'}</div>
      </div>
      <div class="card-footer">
        <div class="summary">${company.summary || '暂无评价'}</div>
        <div class="tags">
          ${overtimeTag}
          ${salaryTag}
        </div>
      </div>
    </a>
  `;
}

// 生成星星
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star">★</span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="star empty">★</span>';
  }
  return stars;
}

// 渲染企业列表
function renderCompanyList(companies, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (companies.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h3>未找到相关企业</h3>
        <p>请尝试其他搜索词</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = companies.map(renderCompanyCard).join('');
}

// 渲染分页
function renderPagination(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const totalPages = getTotalPages();
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // 上一页
  if (currentPage > 1) {
    html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">上一页</button>`;
  }
  
  // 页码
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  if (startPage > 1) {
    html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
    if (startPage > 2) {
      html += `<span class="page-btn" style="cursor:default">...</span>`;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const active = i === currentPage ? 'active' : '';
    html += `<button class="page-btn ${active}" onclick="goToPage(${i})">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<span class="page-btn" style="cursor:default">...</span>`;
    }
    html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }
  
  // 下一页
  if (currentPage < totalPages) {
    html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">下一页</button>`;
  }
  
  container.innerHTML = html;
}

// 跳转页面
function goToPage(page) {
  currentPage = page;
  renderCurrentPage();
}

// 渲染当前页
function renderCurrentPage() {
  const companies = getPaginatedCompanies();
  renderCompanyList(companies, 'companies-grid');
  renderPagination('pagination');
}

// 初始化首页
async function initIndexPage() {
  await loadCompanies();
  
  // 默认按热度排序
  filterCompanies('hot');
  renderCurrentPage();
  
  // 绑定搜索事件
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchCompanies(searchInput.value);
      renderCurrentPage();
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchCompanies(searchInput.value);
        renderCurrentPage();
      }
    });
  }
}

// 初始化列表页
async function initListPage() {
  await loadCompanies();
  
  // 绑定筛选事件
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCompanies(btn.dataset.filter);
      renderCurrentPage();
    });
  });
  
  // 默认按热度排序
  filterCompanies('hot');
  renderCurrentPage();
}

// 搜索功能（用于首页搜索框）
function performSearch() {
  const keyword = document.getElementById('search-input')?.value || '';
  searchCompanies(keyword);
  renderCurrentPage();
  
  // 如果有结果，滚动到列表
  const listSection = document.getElementById('companies-section');
  if (listSection) {
    listSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// 导出函数供全局使用
window.goToPage = goToPage;
window.searchCompanies = searchCompanies;
window.filterCompanies = filterCompanies;
