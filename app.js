// ============================================================
// app.js - 教材在庫管理システムのロジック
// ============================================================

// ========== ログイン機能 ==========
const USERS = [
  { id: "okazaki@kato-seminar.jp", password: "testtest2026" }
];

const loginScreen   = document.getElementById('loginScreen');
const loginForm     = document.getElementById('loginForm');
const loginIdInput  = document.getElementById('loginId');
const loginPwInput  = document.getElementById('loginPassword');
const loginError    = document.getElementById('loginError');

if (sessionStorage.getItem('loggedIn')) {
  loginScreen.classList.add('hidden');
  document.body.classList.remove('app-hidden');
} else {
  document.body.classList.add('app-hidden');
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = loginIdInput.value.trim();
  const pw = loginPwInput.value;
  const user = USERS.find(u => u.id === id && u.password === pw);
  if (user) {
    sessionStorage.setItem('loggedIn', 'true');
    loginScreen.classList.add('hidden');
    document.body.classList.remove('app-hidden');
    loginError.textContent = '';
  } else {
    loginError.textContent = 'IDまたはパスワードが正しくありません';
    loginPwInput.value = '';
    loginPwInput.focus();
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('loggedIn');
  location.reload();
});


// ========== ページ切り替え ==========
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const pages = document.querySelectorAll('.page');

sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    const targetPage = link.dataset.page;

    // サイドバーのアクティブ切り替え
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // ページの表示切り替え
    pages.forEach(p => p.classList.add('hidden'));
    document.getElementById('page-' + targetPage).classList.remove('hidden');

    // ページごとの描画
    if (targetPage === 'dashboard') renderDashboard();
    if (targetPage === 'inventory') renderInventory();
    if (targetPage === 'alerts') renderAlerts();
    if (targetPage === 'history') renderHistory();
  });
});


// ========== 状態管理 ==========
let state = {
  searchQuery: "",
  subjectFilter: "すべて",
  stockFilter: "all",
  sortKey: null,
  sortAsc: true,
  editingId: null,
  adjustingId: null,
  deletingId: null,
  historyTypeFilter: "all",
  historySubjectFilter: "すべて"
};


// ========== DOM要素 ==========
const searchInput     = document.getElementById('searchInput');
const subjectFilter   = document.getElementById('subjectFilter');
const stockFilter     = document.getElementById('stockFilter');
const summaryCards    = document.getElementById('summaryCards');
const alertSection    = document.getElementById('alertSection');
const inventoryBody   = document.getElementById('inventoryBody');
const resultCount     = document.getElementById('resultCount');
const addNewBtn       = document.getElementById('addNewBtn');

// 入出庫モーダル
const stockModal        = document.getElementById('stockModal');
const stockModalOverlay = document.getElementById('stockModalOverlay');
const stockModalClose   = document.getElementById('stockModalClose');
const stockItemName     = document.getElementById('stockItemName');
const stockCurrent      = document.getElementById('stockCurrent');
const adjustAmount      = document.getElementById('adjustAmount');
const adjustMinus       = document.getElementById('adjustMinus');
const adjustPlus        = document.getElementById('adjustPlus');
const btnStockIn        = document.getElementById('btnStockIn');
const btnStockOut       = document.getElementById('btnStockOut');

// 編集モーダル
const editModal        = document.getElementById('editModal');
const editModalOverlay = document.getElementById('editModalOverlay');
const editModalClose   = document.getElementById('editModalClose');
const editModalTitle   = document.getElementById('editModalTitle');
const editForm         = document.getElementById('editForm');
const editCancel       = document.getElementById('editCancel');
const editSubmit       = document.getElementById('editSubmit');
const formName         = document.getElementById('formName');
const formSubject      = document.getElementById('formSubject');
const formStock        = document.getElementById('formStock');
const formMinStock     = document.getElementById('formMinStock');
const formPrice        = document.getElementById('formPrice');
const formNote         = document.getElementById('formNote');

// 削除モーダル
const deleteModal        = document.getElementById('deleteModal');
const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const deleteModalClose   = document.getElementById('deleteModalClose');
const deleteTargetName   = document.getElementById('deleteTargetName');
const deleteCancelBtn    = document.getElementById('deleteCancelBtn');
const deleteConfirmBtn   = document.getElementById('deleteConfirmBtn');

// 履歴フィルター
const historyTypeFilter    = document.getElementById('historyTypeFilter');
const historySubjectFilter = document.getElementById('historySubjectFilter');


// ========== 初期化 ==========
renderDashboard();


// ========== ダッシュボード ==========
function renderDashboard() {
  renderSummary();
  renderDashboardAlerts();
  renderDashboardTable();
}

function renderSummary() {
  const totalItems = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = inventory.filter(item => item.stock > 0 && item.stock < item.minStock).length;
  const outOfStockItems = inventory.filter(item => item.stock === 0).length;

  summaryCards.innerHTML = `
    <div class="summary-card">
      <div class="summary-icon blue"></div>
      <div class="summary-info">
        <span class="summary-label">登録教材数</span>
        <span class="summary-value">${totalItems}</span>
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-icon green"></div>
      <div class="summary-info">
        <span class="summary-label">総在庫数</span>
        <span class="summary-value">${totalStock.toLocaleString()}</span>
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-icon orange"></div>
      <div class="summary-info">
        <span class="summary-label">在庫少</span>
        <span class="summary-value">${lowStockItems}</span>
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-icon red"></div>
      <div class="summary-info">
        <span class="summary-label">在庫切れ</span>
        <span class="summary-value">${outOfStockItems}</span>
      </div>
    </div>
  `;
}

function renderDashboardAlerts() {
  const outOfStock = inventory.filter(item => item.stock === 0);
  const lowStock = inventory.filter(item => item.stock > 0 && item.stock < item.minStock);
  let html = '';

  outOfStock.forEach(item => {
    html += `
      <div class="alert-bar danger">
        <span class="alert-text"><strong>${item.name}</strong> が在庫切れです${item.note ? '（' + item.note + '）' : ''}</span>
        <button class="alert-action" onclick="openStockModal(${item.id})">入庫する</button>
      </div>
    `;
  });

  lowStock.forEach(item => {
    html += `
      <div class="alert-bar warning">
        <span class="alert-text"><strong>${item.name}</strong> の在庫が残り ${item.stock} 個です（最低: ${item.minStock}）</span>
        <button class="alert-action" onclick="openStockModal(${item.id})">入庫する</button>
      </div>
    `;
  });

  alertSection.innerHTML = html;
}

function renderDashboardTable() {
  const body = document.getElementById('dashboardTableBody');
  body.innerHTML = inventory.map(item => {
    let statusText = '十分';
    let statusClass = 'status-ok';
    if (item.stock === 0) {
      statusText = '在庫切れ';
      statusClass = 'status-out';
    } else if (item.stock < item.minStock) {
      statusText = '在庫少';
      statusClass = 'status-low';
    }

    return `
      <tr>
        <td><div class="item-name">${item.name}</div></td>
        <td>${item.subject}</td>
        <td>
          <div class="stock-cell">
            <span class="stock-indicator ${item.stock === 0 ? 'stock-out' : item.stock < item.minStock ? 'stock-low' : 'stock-ok'}"></span>
            <span class="stock-number ${item.stock === 0 ? 'is-out' : item.stock < item.minStock ? 'is-low' : ''}">${item.stock}</span>
          </div>
        </td>
        <td>${item.minStock}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('');
}


// ========== 在庫一覧 ==========
function renderInventory() {
  let filtered = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchSubject = state.subjectFilter === "すべて" || item.subject === state.subjectFilter;
    let matchStock = true;
    if (state.stockFilter === "low") matchStock = item.stock > 0 && item.stock < item.minStock;
    else if (state.stockFilter === "out") matchStock = item.stock === 0;
    else if (state.stockFilter === "ok") matchStock = item.stock >= item.minStock;
    return matchSearch && matchSubject && matchStock;
  });

  if (state.sortKey) {
    filtered.sort((a, b) => {
      let valA = a[state.sortKey];
      let valB = b[state.sortKey];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return state.sortAsc ? -1 : 1;
      if (valA > valB) return state.sortAsc ? 1 : -1;
      return 0;
    });
  }

  resultCount.textContent = `${filtered.length} 件の教材`;

  if (filtered.length === 0) {
    inventoryBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:var(--color-gray-400);">該当する教材がありません</td></tr>`;
    return;
  }

  inventoryBody.innerHTML = filtered.map(item => {
    let stockClass = 'stock-ok';
    let numberClass = '';
    if (item.stock === 0) { stockClass = 'stock-out'; numberClass = 'is-out'; }
    else if (item.stock < item.minStock) { stockClass = 'stock-low'; numberClass = 'is-low'; }

    return `
      <tr>
        <td>
          <div class="item-name">${item.name}</div>
          ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
        </td>
        <td>${item.subject}</td>
        <td>
          <div class="stock-cell">
            <span class="stock-indicator ${stockClass}"></span>
            <span class="stock-number ${numberClass}">${item.stock}</span>
          </div>
        </td>
        <td>${item.minStock}</td>
        <td>${item.price.toLocaleString()}円</td>
        <td>
          <div class="actions-cell">
            <button class="btn-action btn-action-stock" onclick="openStockModal(${item.id})">入出庫</button>
            <button class="btn-action btn-action-edit" onclick="openEditModal(${item.id})">編集</button>
            <button class="btn-action btn-action-delete" onclick="openDeleteModal(${item.id})">削除</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


// ========== 発注アラート ==========
function renderAlerts() {
  const outOfStock = inventory.filter(item => item.stock === 0);
  const lowStock = inventory.filter(item => item.stock > 0 && item.stock < item.minStock);

  // サマリー
  document.getElementById('alertSummaryRow').innerHTML = `
    <div class="alert-summary-card danger-card">
      <span class="alert-summary-number">${outOfStock.length}</span>
      <span class="alert-summary-label">在庫切れ</span>
    </div>
    <div class="alert-summary-card warning-card">
      <span class="alert-summary-number">${lowStock.length}</span>
      <span class="alert-summary-label">在庫少</span>
    </div>
    <div class="alert-summary-card info-card">
      <span class="alert-summary-number">${outOfStock.length + lowStock.length}</span>
      <span class="alert-summary-label">要対応 合計</span>
    </div>
  `;

  // 在庫切れテーブル
  const outBody = document.getElementById('alertOutBody');
  if (outOfStock.length === 0) {
    outBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--color-gray-400);">在庫切れの教材はありません</td></tr>`;
  } else {
    outBody.innerHTML = outOfStock.map(item => `
      <tr>
        <td><div class="item-name">${item.name}</div></td>
        <td>${item.subject}</td>
        <td><span class="stock-number is-out">0</span></td>
        <td>${item.minStock}</td>
        <td><span class="stock-number is-out">${item.minStock}</span></td>
        <td>${item.note || '−'}</td>
        <td><button class="btn-action btn-action-stock" onclick="openStockModal(${item.id})">入庫する</button></td>
      </tr>
    `).join('');
  }

  // 在庫少テーブル
  const lowBody = document.getElementById('alertLowBody');
  if (lowStock.length === 0) {
    lowBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--color-gray-400);">在庫少の教材はありません</td></tr>`;
  } else {
    lowBody.innerHTML = lowStock.map(item => `
      <tr>
        <td><div class="item-name">${item.name}</div></td>
        <td>${item.subject}</td>
        <td>
          <div class="stock-cell">
            <span class="stock-indicator stock-low"></span>
            <span class="stock-number is-low">${item.stock}</span>
          </div>
        </td>
        <td>${item.minStock}</td>
        <td><span class="stock-number is-low">${item.minStock - item.stock}</span></td>
        <td>${item.note || '−'}</td>
        <td><button class="btn-action btn-action-stock" onclick="openStockModal(${item.id})">入庫する</button></td>
      </tr>
    `).join('');
  }
}


// ========== 入出庫履歴 ==========
function getFilteredHistory() {
  return stockHistory.filter(entry => {
    const matchType = state.historyTypeFilter === "all" || entry.type === state.historyTypeFilter;
    const matchSubject = state.historySubjectFilter === "すべて" || entry.subject === state.historySubjectFilter;
    return matchType && matchSubject;
  });
}

function renderHistory() {
  const filtered = getFilteredHistory();

  document.getElementById('historyCount').textContent = `${filtered.length} 件の履歴`;

  const body = document.getElementById('historyBody');
  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:var(--color-gray-400);">該当する履歴がありません</td></tr>`;
    return;
  }

  body.innerHTML = filtered.map(entry => `
    <tr>
      <td>${entry.date}</td>
      <td><span class="type-badge ${entry.type === 'in' ? 'type-in' : 'type-out'}">${entry.type === 'in' ? '入庫' : '出庫'}</span></td>
      <td><div class="item-name">${entry.itemName}</div></td>
      <td>${entry.subject}</td>
      <td>${entry.type === 'in' ? '+' : '-'}${entry.amount}</td>
      <td>${entry.afterStock}</td>
    </tr>
  `).join('');
}

// CSVダウンロード
document.getElementById('csvDownloadBtn').addEventListener('click', () => {
  const filtered = getFilteredHistory();

  // BOM付きUTF-8でExcelでも文字化けしない
  const bom = '\uFEFF';
  const header = '日時,種別,教材名,科目,数量,変更後在庫';
  const rows = filtered.map(entry => {
    const type = entry.type === 'in' ? '入庫' : '出庫';
    const amount = (entry.type === 'in' ? '+' : '-') + entry.amount;
    // カンマを含む可能性があるフィールドはダブルクォートで囲む
    return `${entry.date},${type},"${entry.itemName}",${entry.subject},${amount},${entry.afterStock}`;
  });

  const csv = bom + header + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const today = new Date().toISOString().slice(0, 10);
  a.download = `入出庫履歴_${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});


// ========== フィルター・検索 ==========
searchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  renderInventory();
});

subjectFilter.addEventListener('change', (e) => {
  state.subjectFilter = e.target.value;
  renderInventory();
});

stockFilter.addEventListener('change', (e) => {
  state.stockFilter = e.target.value;
  renderInventory();
});

historyTypeFilter.addEventListener('change', (e) => {
  state.historyTypeFilter = e.target.value;
  renderHistory();
});

historySubjectFilter.addEventListener('change', (e) => {
  state.historySubjectFilter = e.target.value;
  renderHistory();
});

document.querySelectorAll('.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (state.sortKey === key) {
      state.sortAsc = !state.sortAsc;
    } else {
      state.sortKey = key;
      state.sortAsc = true;
    }
    renderInventory();
  });
});


// ========== 入出庫モーダル ==========
function openStockModal(id) {
  const item = inventory.find(i => i.id === id);
  if (!item) return;

  state.adjustingId = id;
  stockItemName.textContent = item.name;
  stockCurrent.textContent = item.stock;
  adjustAmount.value = 1;

  stockModal.classList.add('active');
  stockModalOverlay.classList.add('active');
}

function closeStockModal() {
  stockModal.classList.remove('active');
  stockModalOverlay.classList.remove('active');
  state.adjustingId = null;
}

btnStockIn.addEventListener('click', () => {
  const item = inventory.find(i => i.id === state.adjustingId);
  if (!item) return;
  const amount = parseInt(adjustAmount.value) || 0;
  if (amount <= 0) return;

  item.stock += amount;

  // 履歴に追加
  stockHistory.unshift({
    id: nextHistoryId++,
    date: new Date().toLocaleString('ja-JP', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(/\//g, '-'),
    type: "in",
    itemName: item.name,
    subject: item.subject,
    amount: amount,
    afterStock: item.stock
  });

  closeStockModal();
  refreshCurrentPage();
});

btnStockOut.addEventListener('click', () => {
  const item = inventory.find(i => i.id === state.adjustingId);
  if (!item) return;
  const amount = parseInt(adjustAmount.value) || 0;
  if (amount <= 0) return;

  item.stock = Math.max(0, item.stock - amount);

  // 履歴に追加
  stockHistory.unshift({
    id: nextHistoryId++,
    date: new Date().toLocaleString('ja-JP', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(/\//g, '-'),
    type: "out",
    itemName: item.name,
    subject: item.subject,
    amount: amount,
    afterStock: item.stock
  });

  closeStockModal();
  refreshCurrentPage();
});

adjustMinus.addEventListener('click', () => {
  const current = parseInt(adjustAmount.value) || 1;
  adjustAmount.value = Math.max(1, current - 1);
});

adjustPlus.addEventListener('click', () => {
  const current = parseInt(adjustAmount.value) || 0;
  adjustAmount.value = current + 1;
});

stockModalClose.addEventListener('click', closeStockModal);
stockModalOverlay.addEventListener('click', closeStockModal);


// ========== 編集・新規登録モーダル ==========
addNewBtn.addEventListener('click', () => openEditModal(null));

function openEditModal(id) {
  if (id === null) {
    state.editingId = null;
    editModalTitle.textContent = '新規教材登録';
    editSubmit.textContent = '登録';
    formName.value = '';
    formSubject.value = '憲法';
    formStock.value = 0;
    formMinStock.value = 10;
    formPrice.value = 0;
    formNote.value = '';
  } else {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    state.editingId = id;
    editModalTitle.textContent = '教材情報の編集';
    editSubmit.textContent = '更新';
    formName.value = item.name;
    formSubject.value = item.subject;
    formStock.value = item.stock;
    formMinStock.value = item.minStock;
    formPrice.value = item.price;
    formNote.value = item.note;
  }
  editModal.classList.add('active');
  editModalOverlay.classList.add('active');
}

function closeEditModal() {
  editModal.classList.remove('active');
  editModalOverlay.classList.remove('active');
  state.editingId = null;
}

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: formName.value.trim(),
    subject: formSubject.value,
    stock: parseInt(formStock.value) || 0,
    minStock: parseInt(formMinStock.value) || 0,
    price: parseInt(formPrice.value) || 0,
    note: formNote.value.trim()
  };
  if (!data.name) return;

  if (state.editingId === null) {
    inventory.push({ id: nextId++, ...data });
  } else {
    const item = inventory.find(i => i.id === state.editingId);
    if (!item) return;
    Object.assign(item, data);
  }
  closeEditModal();
  refreshCurrentPage();
});

editCancel.addEventListener('click', closeEditModal);
editModalClose.addEventListener('click', closeEditModal);
editModalOverlay.addEventListener('click', closeEditModal);


// ========== 削除モーダル ==========
function openDeleteModal(id) {
  const item = inventory.find(i => i.id === id);
  if (!item) return;
  state.deletingId = id;
  deleteTargetName.textContent = item.name;
  deleteModal.classList.add('active');
  deleteModalOverlay.classList.add('active');
}

function closeDeleteModal() {
  deleteModal.classList.remove('active');
  deleteModalOverlay.classList.remove('active');
  state.deletingId = null;
}

deleteConfirmBtn.addEventListener('click', () => {
  if (state.deletingId === null) return;
  inventory = inventory.filter(i => i.id !== state.deletingId);
  closeDeleteModal();
  refreshCurrentPage();
});

deleteCancelBtn.addEventListener('click', closeDeleteModal);
deleteModalClose.addEventListener('click', closeDeleteModal);
deleteModalOverlay.addEventListener('click', closeDeleteModal);


// ========== 共通 ==========
function getCurrentPage() {
  const active = document.querySelector('.sidebar-link.active');
  return active ? active.dataset.page : 'dashboard';
}

function refreshCurrentPage() {
  const page = getCurrentPage();
  if (page === 'dashboard') renderDashboard();
  if (page === 'inventory') renderInventory();
  if (page === 'alerts') renderAlerts();
  if (page === 'history') renderHistory();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStockModal();
    closeEditModal();
    closeDeleteModal();
  }
});
