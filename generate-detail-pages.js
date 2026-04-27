// 生成企业详情页的脚本
const fs = require('fs');
const path = require('path');

// 读取企业数据
const companiesPath = path.join(__dirname, 'source/_data/companies.json');
const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf-8'));

// 读取模板
const templatePath = path.join(__dirname, 'detail-template.html');
let template = fs.readFileSync(templatePath, 'utf-8');

// 生成每个企业的详情页
companies.forEach(company => {
  let html = template;
  
  // 替换占位符
  html = html.replace(/\{\{company_name\}\}/g, company.name);
  html = html.replace(/\{\{address\}\}/g, company.address || '暂无');
  html = html.replace(/\{\{business\}\}/g, company.business || '暂无');
  html = html.replace(/\{\{posts\}\}/g, company.posts);
  html = html.replace(/\{\{salary\}\}/g, company.salary || '暂无');
  
  // 处理评分
  const stars = generateStarsHTML(company.rating);
  html = html.replace('{{rating_stars}}', stars);
  
  // 处理点评
  if (company.summary) {
    html = html.replace('{{#reviews}}', '');
    html = html.replace('{{/reviews}}', '');
    html = html.replace('{{type}}', '综合评价');
    html = html.replace('{{content}}', company.summary);
  } else {
    html = html.replace('{{#reviews}}', '');
    html = html.replace('{{/reviews}}', '');
    html = html.replace('{{type}}', '暂无评价');
    html = html.replace('{{content}}', '暂无详细点评，欢迎投稿补充');
  }
  
  // 处理加班情况
  if (company.overtime) {
    html = html.replace('{{#overtime}}', '');
    html = html.replace('{{/overtime}}', '');
    html = html.replace('{{overtime}}', company.overtime);
  } else {
    html = html.replace('{{#overtime}}', '');
    html = html.replace('{{/overtime}}', '');
    html = html.replace('{{overtime}}', '暂无加班相关评价');
  }
  
  // 移除Handlebars残留
  html = html.replace(/\{\{[^}]+\}\}/g, '');
  
  // 更新标题
  html = html.replace(
    '<title>{{company_name}} - 济企通</title>',
    `<title>${company.name} - 济企通</title>`
  );
  
  // 写入文件
  const outputPath = path.join(__dirname, 'source/companies', `${company.id}.html`);
  fs.writeFileSync(outputPath, html);
  console.log(`Generated: ${company.id}.html - ${company.name}`);
});

function generateStarsHTML(rating) {
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

console.log('All company detail pages generated!');
