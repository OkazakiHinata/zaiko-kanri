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


// ========== ログアウト ==========
document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('loggedIn');
  location.reload();
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
  deletingId: null
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
const stockModalTitle   = document.getElementById('stockModalTitle');
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


// ========== 初期化 ==========
function init() {
  renderSummary();
  renderAlerts();
  renderTable();
}

init();


// ========== サマリーカード ==========
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


// ========== アラート ==========
function renderAlerts() {
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


// ========== テーブル描画 ==========
function renderTable() {
  let filtered = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchSubject = state.subjectFilter === "すべて" || item.subject === state.subjectFilter;

    let matchStock = true;
    if (state.stockFilter === "low") {
      matchStock = item.stock > 0 && item.stock < item.minStock;
    } else if (state.stockFilter === "out") {
      matchStock = item.stock === 0;
    } else if (state.stockFilter === "ok") {
      matchStock = item.stock >= item.minStock;
    }

    return matchSearch && matchSubject && matchStock;
  });

  // ソート
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
    inventoryBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:40px; color:var(--color-gray-400);">
          該当する教材がありません
        </td>
      </tr>
    `;
    return;
  }

  inventoryBody.innerHTML = filtered.map(item => {
    let stockClass = 'stock-ok';
    let numberClass = '';
    if (item.stock === 0) {
      stockClass = 'stock-out';
      numberClass = 'is-out';
    } else if (item.stock < item.minStock) {
      stockClass = 'stock-low';
      numberClass = 'is-low';
    }

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
        <td>
          <div class="actions-cell">
            <button class="btn-action btn-action-stock" title="入出庫" onclick="openStockModal(${item.id})">入出庫</button>
            <button class="btn-action btn-action-edit" title="編集" onclick="openEditModal(${item.id})">編集</button>
            <button class="btn-action btn-action-delete" title="削除" onclick="openDeleteModal(${item.id})">削除</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


// ========== フィルター・検索 ==========
searchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  renderTable();
});

subjectFilter.addEventListener('change', (e) => {
  state.subjectFilter = e.target.value;
  renderTable();
});

stockFilter.addEventListener('change', (e) => {
  state.stockFilter = e.target.value;
  renderTable();
});

// テーブルヘッダーのソート
document.querySelectorAll('.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (state.sortKey === key) {
      state.sortAsc = !state.sortAsc;
    } else {
      state.sortKey = key;
      state.sortAsc = true;
    }
    renderTable();
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

  closeStockModal();
  refreshAll();
});

btnStockOut.addEventListener('click', () => {
  const item = inventory.find(i => i.id === state.adjustingId);
  if (!item) return;

  const amount = parseInt(adjustAmount.value) || 0;
  if (amount <= 0) return;

  item.stock = Math.max(0, item.stock - amount);

  closeStockModal();
  refreshAll();
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
    inventory.push({
      id: nextId++,
      ...data
    });
  } else {
    const item = inventory.find(i => i.id === state.editingId);
    if (!item) return;
    Object.assign(item, data);
  }

  closeEditModal();
  refreshAll();
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
  refreshAll();
});

deleteCancelBtn.addEventListener('click', closeDeleteModal);
deleteModalClose.addEventListener('click', closeDeleteModal);
deleteModalOverlay.addEventListener('click', closeDeleteModal);


// ========== 共通 ==========
function refreshAll() {
  renderSummary();
  renderAlerts();
  renderTable();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStockModal();
    closeEditModal();
    closeDeleteModal();
  }
});
