// ============================================================
// data.js - 教材の在庫ダミーデータ
// ============================================================

let inventory = [
  {
    id: 1,
    name: "予備試験 総合テキスト 憲法",
    subject: "憲法",
    stock: 45,
    minStock: 20,
    price: 4800,
    note: ""
  },
  {
    id: 2,
    name: "予備試験 総合テキスト 民法",
    subject: "民法",
    stock: 12,
    minStock: 20,
    price: 5800,
    note: "改訂版3月末入荷予定"
  },
  {
    id: 3,
    name: "予備試験 総合テキスト 刑法",
    subject: "刑法",
    stock: 38,
    minStock: 20,
    price: 4800,
    note: ""
  },
  {
    id: 4,
    name: "短答過去問 憲法 2026年版",
    subject: "憲法",
    stock: 8,
    minStock: 15,
    price: 3200,
    note: ""
  },
  {
    id: 5,
    name: "短答過去問 民法 2026年版",
    subject: "民法",
    stock: 3,
    minStock: 15,
    price: 3800,
    note: "在庫少 要発注"
  },
  {
    id: 6,
    name: "短答過去問 刑法 2026年版",
    subject: "刑法",
    stock: 22,
    minStock: 15,
    price: 3200,
    note: ""
  },
  {
    id: 7,
    name: "論文答案用紙セット（100枚）",
    subject: "共通",
    stock: 150,
    minStock: 50,
    price: 1200,
    note: ""
  },
  {
    id: 8,
    name: "論文対策レジュメ 民事系",
    subject: "民法",
    stock: 0,
    minStock: 30,
    price: 2400,
    note: "在庫切れ 印刷発注済み"
  },
  {
    id: 9,
    name: "論文対策レジュメ 刑事系",
    subject: "刑法",
    stock: 25,
    minStock: 30,
    price: 2400,
    note: ""
  },
  {
    id: 10,
    name: "予備試験模試 第1回（問題＋解説）",
    subject: "共通",
    stock: 60,
    minStock: 40,
    price: 3500,
    note: ""
  },
  {
    id: 11,
    name: "予備試験模試 第2回（問題＋解説）",
    subject: "共通",
    stock: 5,
    minStock: 40,
    price: 3500,
    note: "直前期で消費が早い"
  },
  {
    id: 12,
    name: "判例百選ノート 行政法",
    subject: "行政法",
    stock: 18,
    minStock: 10,
    price: 1800,
    note: ""
  },
  {
    id: 13,
    name: "商法・会社法 条文集",
    subject: "商法",
    stock: 30,
    minStock: 15,
    price: 2200,
    note: ""
  },
  {
    id: 14,
    name: "民事訴訟法 基礎テキスト",
    subject: "民訴",
    stock: 14,
    minStock: 15,
    price: 4200,
    note: ""
  },
  {
    id: 15,
    name: "刑事訴訟法 基礎テキスト",
    subject: "刑訴",
    stock: 20,
    minStock: 15,
    price: 4200,
    note: ""
  }
];

const subjectList = ["すべて", "憲法", "民法", "刑法", "行政法", "商法", "民訴", "刑訴", "共通"];

let nextId = 16;
