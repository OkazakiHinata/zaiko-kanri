// ============================================================
// data.js - 教材の在庫ダミーデータ + 入出庫履歴
// ============================================================

let inventory = [
  { id: 1, name: "予備試験 総合テキスト 憲法", subject: "憲法", stock: 45, minStock: 20, price: 4800, note: "" },
  { id: 2, name: "予備試験 総合テキスト 民法", subject: "民法", stock: 12, minStock: 20, price: 5800, note: "改訂版3月末入荷予定" },
  { id: 3, name: "予備試験 総合テキスト 刑法", subject: "刑法", stock: 38, minStock: 20, price: 4800, note: "" },
  { id: 4, name: "短答過去問 憲法 2026年版", subject: "憲法", stock: 8, minStock: 15, price: 3200, note: "" },
  { id: 5, name: "短答過去問 民法 2026年版", subject: "民法", stock: 3, minStock: 15, price: 3800, note: "在庫少 要発注" },
  { id: 6, name: "短答過去問 刑法 2026年版", subject: "刑法", stock: 22, minStock: 15, price: 3200, note: "" },
  { id: 7, name: "論文答案用紙セット（100枚）", subject: "共通", stock: 150, minStock: 50, price: 1200, note: "" },
  { id: 8, name: "論文対策レジュメ 民事系", subject: "民法", stock: 0, minStock: 30, price: 2400, note: "在庫切れ 印刷発注済み" },
  { id: 9, name: "論文対策レジュメ 刑事系", subject: "刑法", stock: 25, minStock: 30, price: 2400, note: "" },
  { id: 10, name: "予備試験模試 第1回（問題＋解説）", subject: "共通", stock: 60, minStock: 40, price: 3500, note: "" },
  { id: 11, name: "予備試験模試 第2回（問題＋解説）", subject: "共通", stock: 5, minStock: 40, price: 3500, note: "直前期で消費が早い" },
  { id: 12, name: "判例百選ノート 行政法", subject: "行政法", stock: 18, minStock: 10, price: 1800, note: "" },
  { id: 13, name: "商法・会社法 条文集", subject: "商法", stock: 30, minStock: 15, price: 2200, note: "" },
  { id: 14, name: "民事訴訟法 基礎テキスト", subject: "民訴", stock: 14, minStock: 15, price: 4200, note: "" },
  { id: 15, name: "刑事訴訟法 基礎テキスト", subject: "刑訴", stock: 20, minStock: 15, price: 4200, note: "" }
];

const subjectList = ["すべて", "憲法", "民法", "刑法", "行政法", "商法", "民訴", "刑訴", "共通"];

let nextId = 16;

// 入出庫履歴のダミーデータ
let stockHistory = [
  { id: 1, date: "2026-03-12 09:30", type: "in", itemName: "予備試験 総合テキスト 憲法", subject: "憲法", amount: 20, afterStock: 45, staff: "岡崎" },
  { id: 2, date: "2026-03-12 09:15", type: "out", itemName: "予備試験模試 第2回（問題＋解説）", subject: "共通", amount: 15, afterStock: 5, staff: "田中" },
  { id: 3, date: "2026-03-11 16:40", type: "out", itemName: "短答過去問 民法 2026年版", subject: "民法", amount: 10, afterStock: 3, staff: "佐藤" },
  { id: 4, date: "2026-03-11 14:20", type: "in", itemName: "短答過去問 刑法 2026年版", subject: "刑法", amount: 30, afterStock: 22, staff: "岡崎" },
  { id: 5, date: "2026-03-11 10:00", type: "out", itemName: "論文答案用紙セット（100枚）", subject: "共通", amount: 50, afterStock: 150, staff: "田中" },
  { id: 6, date: "2026-03-10 17:30", type: "in", itemName: "論文答案用紙セット（100枚）", subject: "共通", amount: 100, afterStock: 200, staff: "岡崎" },
  { id: 7, date: "2026-03-10 15:00", type: "out", itemName: "予備試験 総合テキスト 民法", subject: "民法", amount: 8, afterStock: 12, staff: "佐藤" },
  { id: 8, date: "2026-03-10 11:20", type: "out", itemName: "論文対策レジュメ 民事系", subject: "民法", amount: 5, afterStock: 0, staff: "田中" },
  { id: 9, date: "2026-03-09 16:00", type: "in", itemName: "予備試験模試 第1回（問題＋解説）", subject: "共通", amount: 40, afterStock: 60, staff: "岡崎" },
  { id: 10, date: "2026-03-09 14:30", type: "out", itemName: "予備試験 総合テキスト 刑法", subject: "刑法", amount: 12, afterStock: 38, staff: "佐藤" },
  { id: 11, date: "2026-03-08 10:00", type: "in", itemName: "判例百選ノート 行政法", subject: "行政法", amount: 10, afterStock: 18, staff: "岡崎" },
  { id: 12, date: "2026-03-08 09:00", type: "out", itemName: "商法・会社法 条文集", subject: "商法", amount: 5, afterStock: 30, staff: "田中" },
  { id: 13, date: "2026-03-07 15:30", type: "in", itemName: "民事訴訟法 基礎テキスト", subject: "民訴", amount: 20, afterStock: 14, staff: "岡崎" },
  { id: 14, date: "2026-03-07 11:00", type: "out", itemName: "短答過去問 憲法 2026年版", subject: "憲法", amount: 7, afterStock: 8, staff: "佐藤" },
  { id: 15, date: "2026-03-06 16:45", type: "in", itemName: "刑事訴訟法 基礎テキスト", subject: "刑訴", amount: 15, afterStock: 20, staff: "岡崎" },
  { id: 16, date: "2026-03-06 13:00", type: "out", itemName: "論文対策レジュメ 刑事系", subject: "刑法", amount: 5, afterStock: 25, staff: "田中" },
  { id: 17, date: "2026-03-05 10:30", type: "in", itemName: "予備試験 総合テキスト 刑法", subject: "刑法", amount: 50, afterStock: 50, staff: "岡崎" },
  { id: 18, date: "2026-03-05 09:00", type: "out", itemName: "予備試験 総合テキスト 憲法", subject: "憲法", amount: 5, afterStock: 25, staff: "佐藤" },
];

let nextHistoryId = 19;
