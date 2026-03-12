// ============================================================
// data.js - 教材の在庫ダミーデータ
//
// 司法試験・予備試験予備校で扱う教材を想定。
// テキスト、問題集、レジュメ、模試など物理的に在庫管理が必要なもの。
// ============================================================

let inventory = [
  {
    id: 1,
    name: "予備試験 総合テキスト 憲法",
    category: "テキスト",
    subject: "憲法",
    stock: 45,
    minStock: 20,
    price: 4800,
    location: "棚A-1",
    lastRestocked: "2026-03-01",
    note: ""
  },
  {
    id: 2,
    name: "予備試験 総合テキスト 民法",
    category: "テキスト",
    subject: "民法",
    stock: 12,
    minStock: 20,
    price: 5800,
    location: "棚A-2",
    lastRestocked: "2026-02-15",
    note: "改訂版3月末入荷予定"
  },
  {
    id: 3,
    name: "予備試験 総合テキスト 刑法",
    category: "テキスト",
    subject: "刑法",
    stock: 38,
    minStock: 20,
    price: 4800,
    location: "棚A-3",
    lastRestocked: "2026-03-05",
    note: ""
  },
  {
    id: 4,
    name: "短答過去問 憲法 2026年版",
    category: "問題集",
    subject: "憲法",
    stock: 8,
    minStock: 15,
    price: 3200,
    location: "棚B-1",
    lastRestocked: "2026-01-20",
    note: ""
  },
  {
    id: 5,
    name: "短答過去問 民法 2026年版",
    category: "問題集",
    subject: "民法",
    stock: 3,
    minStock: 15,
    price: 3800,
    location: "棚B-2",
    lastRestocked: "2026-01-20",
    note: "在庫少 要発注"
  },
  {
    id: 6,
    name: "短答過去問 刑法 2026年版",
    category: "問題集",
    subject: "刑法",
    stock: 22,
    minStock: 15,
    price: 3200,
    location: "棚B-3",
    lastRestocked: "2026-02-28",
    note: ""
  },
  {
    id: 7,
    name: "論文答案用紙セット（100枚）",
    category: "消耗品",
    subject: "共通",
    stock: 150,
    minStock: 50,
    price: 1200,
    location: "棚D-1",
    lastRestocked: "2026-03-10",
    note: ""
  },
  {
    id: 8,
    name: "論文対策レジュメ 民事系",
    category: "レジュメ",
    subject: "民法",
    stock: 0,
    minStock: 30,
    price: 2400,
    location: "棚C-1",
    lastRestocked: "2025-12-10",
    note: "在庫切れ 印刷発注済み"
  },
  {
    id: 9,
    name: "論文対策レジュメ 刑事系",
    category: "レジュメ",
    subject: "刑法",
    stock: 25,
    minStock: 30,
    price: 2400,
    location: "棚C-2",
    lastRestocked: "2026-02-20",
    note: ""
  },
  {
    id: 10,
    name: "予備試験模試 第1回（問題＋解説）",
    category: "模試",
    subject: "共通",
    stock: 60,
    minStock: 40,
    price: 3500,
    location: "棚E-1",
    lastRestocked: "2026-03-08",
    note: ""
  },
  {
    id: 11,
    name: "予備試験模試 第2回（問題＋解説）",
    category: "模試",
    subject: "共通",
    stock: 5,
    minStock: 40,
    price: 3500,
    location: "棚E-2",
    lastRestocked: "2026-01-15",
    note: "直前期で消費が早い"
  },
  {
    id: 12,
    name: "判例百選ノート 行政法",
    category: "レジュメ",
    subject: "行政法",
    stock: 18,
    minStock: 10,
    price: 1800,
    location: "棚C-3",
    lastRestocked: "2026-02-25",
    note: ""
  },
  {
    id: 13,
    name: "商法・会社法 条文集",
    category: "テキスト",
    subject: "商法",
    stock: 30,
    minStock: 15,
    price: 2200,
    location: "棚A-4",
    lastRestocked: "2026-03-01",
    note: ""
  },
  {
    id: 14,
    name: "民事訴訟法 基礎テキスト",
    category: "テキスト",
    subject: "民訴",
    stock: 14,
    minStock: 15,
    price: 4200,
    location: "棚A-5",
    lastRestocked: "2026-02-10",
    note: ""
  },
  {
    id: 15,
    name: "刑事訴訟法 基礎テキスト",
    category: "テキスト",
    subject: "刑訴",
    stock: 20,
    minStock: 15,
    price: 4200,
    location: "棚A-6",
    lastRestocked: "2026-02-10",
    note: ""
  }
];

const categoryList = ["すべて", "テキスト", "問題集", "レジュメ", "模試", "消耗品"];
const subjectList = ["すべて", "憲法", "民法", "刑法", "行政法", "商法", "民訴", "刑訴", "共通"];

// ID採番用カウンター
let nextId = 16;
