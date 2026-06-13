---
layout: default
title: プロジェクト管理 (Mimo v2.5 Pro) - Rui Software
---

<style>
/* ============================================================
   Project Manager - Mimo v2.5 Pro
   Scoped under .pm-wrap to avoid conflicts
   ============================================================ */

/* --- CSS Variables (Light Theme Default) --- */
.pm-wrap {
  --pm-accent: #2e8b57;
  --pm-accent-hover: #246b45;
  --pm-btn-text: #fff;
  --pm-bg: #f7faf8;
  --pm-bg-alt: #eaf3ee;
  --pm-border: #dde8e2;
  --pm-border-strong: #aaccbb;
  --pm-text: #333;
  --pm-text-muted: #666;
  --pm-panel-bg: #fff;
  --pm-card-bg: #fff;
  --pm-table-stripe: #f9fcfa;
  --pm-table-header-bg: #2e8b57;
  --pm-table-header-text: #fff;
  --pm-priority-high: #dc3545;
  --pm-priority-medium: #ffc107;
  --pm-priority-low: #2e8b57;
  --pm-status-todo-bg: #e2e3e5;
  --pm-status-todo-text: #383d41;
  --pm-status-doing-bg: #cce5ff;
  --pm-status-doing-text: #004085;
  --pm-status-done-bg: #d4edda;
  --pm-status-done-text: #155724;
  --pm-modal-overlay: rgba(0,0,0,0.5);
  --pm-shadow: 0 2px 8px rgba(0,0,0,0.12);
  --pm-radius: 6px;
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
}

/* --- Dark Theme --- */
.pm-wrap.dark {
  --pm-accent: #4ecb71;
  --pm-accent-hover: #3ba85c;
  --pm-btn-text: #111;
  --pm-bg: #1a1a2e;
  --pm-bg-alt: #22223a;
  --pm-border: #333355;
  --pm-border-strong: #444477;
  --pm-text: #e0e0e0;
  --pm-text-muted: #999;
  --pm-panel-bg: #22223a;
  --pm-card-bg: #2a2a45;
  --pm-table-stripe: #22223a;
  --pm-table-header-bg: #1b5e3a;
  --pm-table-header-text: #e0e0e0;
  --pm-status-todo-bg: #3a3a55;
  --pm-status-todo-text: #ccc;
  --pm-status-doing-bg: #1a3a66;
  --pm-status-doing-text: #8ab4f8;
  --pm-status-done-bg: #1a4a2a;
  --pm-status-done-text: #6fcf7c;
  --pm-modal-overlay: rgba(0,0,0,0.7);
  --pm-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

/* --- Reset inside .pm-wrap --- */
.pm-wrap *, .pm-wrap *::before, .pm-wrap *::after {
  box-sizing: border-box;
}

.pm-wrap {
  background: var(--pm-bg);
  color: var(--pm-text);
  padding: 15px;
  border-radius: var(--pm-radius);
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

/* --- Header / Title --- */
.pm-title {
  font-size: 1.6em;
  font-weight: bold;
  color: var(--pm-accent);
  margin: 0 0 12px 0;
}

/* --- Controls Bar --- */
.pm-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 10px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-border);
  border-radius: var(--pm-radius);
  margin-bottom: 10px;
}

/* --- Buttons --- */
.pm-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 14px;
  border: 1px solid var(--pm-accent);
  background: var(--pm-accent);
  color: var(--pm-btn-text);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  font-family: inherit;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
}
.pm-btn:hover { background: var(--pm-accent-hover); }
.pm-btn:active { transform: scale(0.97); }
.pm-btn.secondary {
  background: transparent;
  color: var(--pm-accent);
}
.pm-btn.secondary:hover { background: var(--pm-bg-alt); }
.pm-btn.danger {
  background: var(--pm-priority-high);
  border-color: var(--pm-priority-high);
  color: #fff;
}
.pm-btn.danger:hover { background: #c82333; }
.pm-btn.small { padding: 3px 8px; font-size: 0.78em; }

/* --- Tab Group --- */
.pm-tab-group {
  display: inline-flex;
  gap: 0;
  border: 1px solid var(--pm-accent);
  border-radius: 4px;
  overflow: hidden;
}
.pm-tab {
  padding: 5px 14px;
  cursor: pointer;
  font-size: 0.85em;
  background: transparent;
  color: var(--pm-accent);
  border: none;
  border-right: 1px solid var(--pm-accent);
  font-family: inherit;
  transition: background 0.2s;
}
.pm-tab:last-child { border-right: none; }
.pm-tab:hover { background: var(--pm-bg-alt); }
.pm-tab.active {
  background: var(--pm-accent);
  color: var(--pm-btn-text);
}

/* --- Inputs / Selects --- */
.pm-input, .pm-select {
  padding: 5px 10px;
  border: 1px solid var(--pm-border-strong);
  border-radius: 4px;
  font-size: 0.85em;
  font-family: inherit;
  background: var(--pm-card-bg);
  color: var(--pm-text);
}
.pm-input:focus, .pm-select:focus {
  outline: none;
  border-color: var(--pm-accent);
  box-shadow: 0 0 0 2px rgba(46,139,87,0.15);
}
.pm-search { width: 180px; }
.pm-filter-select { min-width: 100px; }

/* --- Bulk Action Bar --- */
.pm-bulk-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--pm-accent);
  color: var(--pm-btn-text);
  border-radius: var(--pm-radius);
  margin-bottom: 10px;
  font-size: 0.85em;
}
.pm-bulk-bar .pm-btn {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.4);
  color: #fff;
}
.pm-bulk-bar .pm-btn:hover { background: rgba(255,255,255,0.3); }

/* --- Settings Panel --- */
.pm-settings-panel {
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-border);
  border-radius: var(--pm-radius);
  padding: 15px;
  margin-bottom: 10px;
}
.pm-settings-panel label {
  display: block;
  font-size: 0.82em;
  font-weight: bold;
  margin: 8px 0 3px;
  color: var(--pm-text-muted);
}
.pm-settings-panel .pm-input { width: 100%; max-width: 400px; }
.pm-settings-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

/* --- View Container --- */
.pm-view-container { position: relative; }
.pm-view { display: none; }
.pm-view.active { display: block; }

/* --- Table (List View) --- */
.pm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;
}
.pm-table thead th {
  background: var(--pm-table-header-bg);
  color: var(--pm-table-header-text);
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}
.pm-table thead th:hover { opacity: 0.9; }
.pm-table thead th .sort-arrow { margin-left: 4px; font-size: 0.75em; }
.pm-table tbody tr { border-bottom: 1px solid var(--pm-border); }
.pm-table tbody tr:nth-child(even) { background: var(--pm-table-stripe); }
.pm-table tbody tr:hover { background: var(--pm-bg-alt); }
.pm-table td { padding: 6px 10px; vertical-align: middle; }
.pm-table .pm-checkbox { margin: 0; cursor: pointer; }
.pm-table .pm-task-title {
  color: var(--pm-accent);
  cursor: pointer;
  font-weight: bold;
}
.pm-table .pm-task-title:hover { text-decoration: underline; }
.pm-table-actions { display: flex; gap: 4px; }

/* --- Badges --- */
.pm-priority {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.78em;
  font-weight: bold;
  color: #fff;
}
.pm-priority.high { background: var(--pm-priority-high); }
.pm-priority.medium { background: var(--pm-priority-medium); color: #333; }
.pm-priority.low { background: var(--pm-priority-low); }

.pm-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.78em;
  font-weight: bold;
}
.pm-status.todo { background: var(--pm-status-todo-bg); color: var(--pm-status-todo-text); }
.pm-status.doing { background: var(--pm-status-doing-bg); color: var(--pm-status-doing-text); }
.pm-status.done { background: var(--pm-status-done-bg); color: var(--pm-status-done-text); }

.pm-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.72em;
  background: var(--pm-bg-alt);
  border: 1px solid var(--pm-border);
  margin: 1px 2px;
  color: var(--pm-text-muted);
}

/* --- Progress Bar --- */
.pm-progress-bar {
  width: 60px;
  height: 8px;
  background: var(--pm-border);
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
}
.pm-progress-bar-inner {
  height: 100%;
  background: var(--pm-accent);
  border-radius: 4px;
  transition: width 0.3s;
}
.pm-progress-text {
  font-size: 0.75em;
  margin-left: 4px;
  color: var(--pm-text-muted);
}

/* --- Gantt Chart --- */
.pm-gantt-wrapper {
  overflow-x: auto;
  border: 1px solid var(--pm-border);
  border-radius: var(--pm-radius);
  background: var(--pm-panel-bg);
  position: relative;
}
.pm-gantt-header {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--pm-table-header-bg);
  color: var(--pm-table-header-text);
  font-size: 0.78em;
}
.pm-gantt-label-col {
  min-width: 200px;
  max-width: 200px;
  padding: 6px 10px;
  font-weight: bold;
  border-right: 1px solid var(--pm-border-strong);
  flex-shrink: 0;
}
.pm-gantt-timeline {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.pm-gantt-week-header {
  min-width: 80px;
  padding: 6px 4px;
  text-align: center;
  border-right: 1px solid rgba(255,255,255,0.15);
  white-space: nowrap;
}
.pm-gantt-body { position: relative; }
.pm-gantt-row {
  display: flex;
  border-bottom: 1px solid var(--pm-border);
  min-height: 32px;
  align-items: center;
}
.pm-gantt-row:hover { background: var(--pm-bg-alt); }
.pm-gantt-row-label {
  min-width: 200px;
  max-width: 200px;
  padding: 4px 10px;
  font-size: 0.82em;
  border-right: 1px solid var(--pm-border);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  color: var(--pm-accent);
}
.pm-gantt-row-timeline {
  position: relative;
  flex: 1;
  height: 32px;
}
.pm-gantt-bar {
  position: absolute;
  height: 20px;
  top: 6px;
  border-radius: 3px;
  opacity: 0.85;
  cursor: pointer;
  min-width: 4px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  font-size: 0.7em;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pm-gantt-bar:hover { opacity: 1; }
.pm-gantt-bar.high { background: var(--pm-priority-high); }
.pm-gantt-bar.medium { background: var(--pm-priority-medium); }
.pm-gantt-bar.low { background: var(--pm-priority-low); }
.pm-gantt-today {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--pm-priority-high);
  z-index: 1;
}
.pm-gantt-milestone {
  position: absolute;
  width: 14px;
  height: 14px;
  top: 9px;
  transform: rotate(45deg);
  background: var(--pm-priority-high);
  cursor: pointer;
  z-index: 1;
}
.pm-gantt-week-col {
  position: absolute;
  top: 0;
  bottom: 0;
  border-right: 1px solid var(--pm-border);
}
.pm-gantt-arrow {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
.pm-gantt-nav {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

/* --- Kanban --- */
.pm-kanban {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.pm-kanban-col {
  flex: 1;
  min-width: 220px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-border);
  border-radius: var(--pm-radius);
  overflow: hidden;
}
.pm-kanban-col-header {
  padding: 10px;
  font-weight: bold;
  font-size: 0.9em;
  text-align: center;
  color: #fff;
}
.pm-kanban-col-header.todo { background: var(--pm-status-todo-bg); color: var(--pm-status-todo-text); }
.pm-kanban-col-header.doing { background: var(--pm-status-doing-bg); color: var(--pm-status-doing-text); }
.pm-kanban-col-header.done { background: var(--pm-status-done-bg); color: var(--pm-status-done-text); }
.pm-kanban-cards {
  padding: 8px;
  min-height: 100px;
}
.pm-kanban-cards.drag-over {
  background: var(--pm-bg-alt);
  border: 2px dashed var(--pm-accent);
  border-radius: 4px;
}
.pm-kanban-card {
  background: var(--pm-card-bg);
  border: 1px solid var(--pm-border);
  border-radius: 4px;
  padding: 8px 10px;
  margin-bottom: 8px;
  cursor: grab;
  font-size: 0.82em;
  box-shadow: var(--pm-shadow);
  transition: transform 0.15s;
}
.pm-kanban-card:hover { transform: translateY(-1px); }
.pm-kanban-card:active { cursor: grabbing; }
.pm-kanban-card-title {
  font-weight: bold;
  color: var(--pm-accent);
  cursor: pointer;
  margin-bottom: 4px;
}
.pm-kanban-card-title:hover { text-decoration: underline; }
.pm-kanban-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  margin-top: 4px;
  font-size: 0.85em;
  color: var(--pm-text-muted);
}

/* --- Calendar --- */
.pm-calendar-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.pm-calendar-month-title {
  font-size: 1.1em;
  font-weight: bold;
  color: var(--pm-accent);
}
.pm-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--pm-border);
  border: 1px solid var(--pm-border);
  border-radius: var(--pm-radius);
  overflow: hidden;
}
.pm-calendar-day-header {
  background: var(--pm-table-header-bg);
  color: var(--pm-table-header-text);
  padding: 6px;
  text-align: center;
  font-size: 0.82em;
  font-weight: bold;
}
.pm-calendar-day {
  background: var(--pm-panel-bg);
  padding: 4px 6px;
  min-height: 80px;
  font-size: 0.78em;
  cursor: pointer;
  transition: background 0.2s;
}
.pm-calendar-day:hover { background: var(--pm-bg-alt); }
.pm-calendar-day.other-month { opacity: 0.4; }
.pm-calendar-day.today {
  background: var(--pm-bg-alt);
  border: 2px solid var(--pm-accent);
}
.pm-calendar-day-num {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 1.1em;
}
.pm-calendar-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin: 1px;
}
.pm-calendar-dot.high { background: var(--pm-priority-high); }
.pm-calendar-dot.medium { background: var(--pm-priority-medium); }
.pm-calendar-dot.low { background: var(--pm-priority-low); }

/* --- Modal --- */
.pm-modal-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--pm-modal-overlay);
  z-index: 9999;
  justify-content: center;
  align-items: flex-start;
  padding: 30px;
  overflow-y: auto;
}
.pm-modal-overlay.show { display: flex; }
.pm-modal {
  background: var(--pm-panel-bg);
  border-radius: var(--pm-radius);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 700px;
  padding: 20px;
  color: var(--pm-text);
}
.pm-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--pm-border);
}
.pm-modal-title {
  font-size: 1.2em;
  font-weight: bold;
  color: var(--pm-accent);
  margin: 0;
}
.pm-modal-close {
  background: none;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  color: var(--pm-text-muted);
  padding: 0 4px;
}
.pm-modal-close:hover { color: var(--pm-priority-high); }
.pm-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid var(--pm-border);
}

/* --- Form --- */
.pm-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.pm-form-group {
  display: flex;
  flex-direction: column;
}
.pm-form-group.full { grid-column: 1 / -1; }
.pm-form-group label {
  font-size: 0.82em;
  font-weight: bold;
  margin-bottom: 3px;
  color: var(--pm-text-muted);
}
.pm-form-group .pm-input,
.pm-form-group .pm-select,
.pm-form-group textarea {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--pm-border-strong);
  border-radius: 4px;
  font-size: 0.85em;
  font-family: inherit;
  background: var(--pm-card-bg);
  color: var(--pm-text);
}
.pm-form-group textarea { min-height: 60px; resize: vertical; }
.pm-form-group input[type="range"] { width: 100%; }
.pm-range-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pm-range-value {
  font-size: 0.85em;
  min-width: 36px;
  text-align: right;
  color: var(--pm-accent);
  font-weight: bold;
}

/* --- Subtask list in form --- */
.pm-subtask-list { list-style: none; padding: 0; margin: 4px 0; }
.pm-subtask-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
  font-size: 0.85em;
}
.pm-subtask-item input[type="checkbox"] { cursor: pointer; }
.pm-subtask-item input[type="text"] {
  flex: 1;
  border: 1px solid var(--pm-border);
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.9em;
  background: var(--pm-card-bg);
  color: var(--pm-text);
}
.pm-subtask-remove {
  cursor: pointer;
  color: var(--pm-priority-high);
  font-weight: bold;
  border: none;
  background: none;
  font-size: 1em;
}
.pm-subtask-remove:hover { opacity: 0.7; }

/* --- Activity Log (readonly in modal) --- */
.pm-activity-list {
  list-style: none;
  padding: 0;
  margin: 4px 0;
  max-height: 150px;
  overflow-y: auto;
  font-size: 0.78em;
}
.pm-activity-item {
  padding: 3px 0;
  border-bottom: 1px dotted var(--pm-border);
  color: var(--pm-text-muted);
}
.pm-activity-item .pm-activity-time {
  color: var(--pm-accent);
  font-weight: bold;
  margin-right: 6px;
}

/* --- Toast Notification --- */
.pm-toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pm-toast {
  padding: 10px 16px;
  border-radius: 4px;
  color: #fff;
  font-size: 0.85em;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  animation: pmToastIn 0.3s ease;
  max-width: 350px;
}
.pm-toast.success { background: var(--pm-accent); }
.pm-toast.error { background: var(--pm-priority-high); }
.pm-toast.info { background: #17a2b8; }
@keyframes pmToastIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* --- Snapshot Panel --- */
.pm-snapshot-list {
  list-style: none;
  padding: 0;
  margin: 8px 0;
}
.pm-snapshot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid var(--pm-border);
  font-size: 0.85em;
}
.pm-snapshot-item:hover { background: var(--pm-bg-alt); }

/* --- Import Modal --- */
.pm-import-options {
  margin: 10px 0;
  display: flex;
  gap: 10px;
}

/* --- Empty State --- */
.pm-empty {
  text-align: center;
  padding: 40px;
  color: var(--pm-text-muted);
  font-size: 0.95em;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .pm-controls { flex-direction: column; align-items: stretch; }
  .pm-tab-group { width: 100%; }
  .pm-tab { flex: 1; text-align: center; }
  .pm-search { width: 100%; }
  .pm-kanban { flex-direction: column; }
  .pm-form-grid { grid-template-columns: 1fr; }
  .pm-gantt-label-col, .pm-gantt-row-label { min-width: 120px; max-width: 120px; }
}
</style>

<div class="pm-wrap light" id="pmRoot">
  <!-- Title -->
  <h2 class="pm-title">📋 プロジェクト管理 (Mimo v2.5 Pro)</h2>

  <!-- Controls Bar -->
  <div class="pm-controls">
    <button class="pm-btn" id="pmAddBtn">＋ 新規タスク</button>
    <div class="pm-tab-group">
      <button class="pm-tab active" data-view="list">リスト</button>
      <button class="pm-tab" data-view="gantt">ガント</button>
      <button class="pm-tab" data-view="kanban">看板</button>
      <button class="pm-tab" data-view="calendar">カレンダー</button>
    </div>
    <input type="text" class="pm-input pm-search" id="pmSearch" placeholder="🔍 検索...">
    <select class="pm-select pm-filter-select" id="pmFilterStatus">
      <option value="">ｽﾃｰﾀｽ</option>
      <option value="todo">ToDo</option>
      <option value="doing">Doing</option>
      <option value="done">Done</option>
    </select>
    <select class="pm-select pm-filter-select" id="pmFilterPriority">
      <option value="">優先度</option>
      <option value="high">高</option>
      <option value="medium">中</option>
      <option value="low">低</option>
    </select>
    <select class="pm-select pm-filter-select" id="pmFilterAssignee">
      <option value="">担当者</option>
    </select>
    <select class="pm-select pm-filter-select" id="pmFilterMilestone">
      <option value="">ﾏｲﾙｽﾄｰﾝ</option>
    </select>
    <button class="pm-btn secondary" id="pmExportJSON">JSON出力</button>
    <button class="pm-btn secondary" id="pmExportCSV">CSV出力</button>
    <button class="pm-btn secondary" id="pmImportBtn">読込</button>
    <button class="pm-btn secondary" id="pmSnapshotBtn">📸</button>
    <button class="pm-btn secondary" id="pmSettingsBtn">⚙️</button>
    <button class="pm-btn secondary" id="pmThemeBtn">🌓</button>
  </div>

  <!-- Bulk Action Bar -->
  <div class="pm-bulk-bar" id="pmBulkBar" style="display:none">
    <span id="pmBulkCount">0件選択中</span>
    <button class="pm-btn small" id="pmBulkDelete">一括削除</button>
    <button class="pm-btn small" id="pmBulkStatusTodo">→ ToDo</button>
    <button class="pm-btn small" id="pmBulkStatusDoing">→ Doing</button>
    <button class="pm-btn small" id="pmBulkStatusDone">→ Done</button>
    <button class="pm-btn small" id="pmBulkIssue">一括Issue化</button>
  </div>

  <!-- Settings Panel -->
  <div class="pm-settings-panel" id="pmSettingsPanel" style="display:none">
    <h3 style="margin:0 0 8px;color:var(--pm-accent)">⚙️ GitHub連携設定</h3>
    <div class="pm-settings-row">
      <div class="pm-form-group">
        <label>Personal Access Token</label>
        <input type="password" class="pm-input" id="pmGithubToken" placeholder="ghp_...">
      </div>
      <div class="pm-form-group">
        <label>リポジトリ (owner/repo)</label>
        <input type="text" class="pm-input" id="pmGithubRepo" placeholder="user/repo">
      </div>
      <button class="pm-btn" id="pmGithubSave">保存</button>
    </div>
  </div>

  <!-- View Container -->
  <div class="pm-view-container">
    <!-- List View -->
    <div class="pm-view active" id="pmListView">
      <table class="pm-table" id="pmTable">
        <thead>
          <tr>
            <th style="width:30px"><input type="checkbox" class="pm-checkbox" id="pmSelectAll"></th>
            <th data-sort="title">タイトル <span class="sort-arrow"></span></th>
            <th data-sort="status">ｽﾃｰﾀｽ <span class="sort-arrow"></span></th>
            <th data-sort="priority">優先度 <span class="sort-arrow"></span></th>
            <th data-sort="assignee">担当者 <span class="sort-arrow"></span></th>
            <th data-sort="startDate">開始日 <span class="sort-arrow"></span></th>
            <th data-sort="dueDate">締切日 <span class="sort-arrow"></span></th>
            <th data-sort="progress">進捗 <span class="sort-arrow"></span></th>
            <th>タグ</th>
            <th style="width:80px">操作</th>
          </tr>
        </thead>
        <tbody id="pmTableBody"></tbody>
      </table>
      <div class="pm-empty" id="pmListEmpty" style="display:none">
        タスクがありません。「＋ 新規タスク」から追加してください。
      </div>
    </div>

    <!-- Gantt View -->
    <div class="pm-view" id="pmGanttView">
      <div class="pm-gantt-nav">
        <button class="pm-btn small secondary" id="pmGanttPrev">◀ 前</button>
        <span id="pmGanttRange" style="font-size:0.85em;color:var(--pm-text-muted)"></span>
        <button class="pm-btn small secondary" id="pmGanttNext">次 ▶</button>
        <button class="pm-btn small secondary" id="pmGanttToday">今日</button>
      </div>
      <div class="pm-gantt-wrapper" id="pmGanttWrapper"></div>
    </div>

    <!-- Kanban View -->
    <div class="pm-view" id="pmKanbanView">
      <div class="pm-kanban" id="pmKanban"></div>
    </div>

    <!-- Calendar View -->
    <div class="pm-view" id="pmCalendarView">
      <div class="pm-calendar-nav">
        <button class="pm-btn small secondary" id="pmCalPrev">◀ 前月</button>
        <span class="pm-calendar-month-title" id="pmCalTitle"></span>
        <button class="pm-btn small secondary" id="pmCalNext">翌月 ▶</button>
        <button class="pm-btn small secondary" id="pmCalToday">今月</button>
      </div>
      <div class="pm-calendar-grid" id="pmCalendarGrid"></div>
    </div>
  </div>

  <!-- Task Modal -->
  <div class="pm-modal-overlay" id="pmTaskModal">
    <div class="pm-modal">
      <div class="pm-modal-header">
        <h3 class="pm-modal-title" id="pmModalTitle">新規タスク</h3>
        <button class="pm-modal-close" id="pmModalClose">&times;</button>
      </div>
      <form id="pmTaskForm">
        <input type="hidden" id="pmTaskId">
        <div class="pm-form-grid">
          <div class="pm-form-group full">
            <label>タイトル *</label>
            <input type="text" class="pm-input" id="pmTaskTitle" required>
          </div>
          <div class="pm-form-group full">
            <label>詳細</label>
            <textarea id="pmTaskDesc" rows="3"></textarea>
          </div>
          <div class="pm-form-group">
            <label>ステータス</label>
            <select class="pm-select" id="pmTaskStatus">
              <option value="todo">ToDo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div class="pm-form-group">
            <label>優先度</label>
            <select class="pm-select" id="pmTaskPriority">
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="low">低</option>
            </select>
          </div>
          <div class="pm-form-group">
            <label>担当者</label>
            <input type="text" class="pm-input" id="pmTaskAssignee">
          </div>
          <div class="pm-form-group">
            <label>マイルストーン</label>
            <input type="text" class="pm-input" id="pmTaskMilestone">
          </div>
          <div class="pm-form-group">
            <label>開始日</label>
            <input type="date" class="pm-input" id="pmTaskStart">
          </div>
          <div class="pm-form-group">
            <label>締切日</label>
            <input type="date" class="pm-input" id="pmTaskDue">
          </div>
          <div class="pm-form-group">
            <label>予定工数 (h)</label>
            <input type="number" class="pm-input" id="pmTaskEstHours" step="0.5" min="0">
          </div>
          <div class="pm-form-group">
            <label>実績工数 (h)</label>
            <input type="number" class="pm-input" id="pmTaskActHours" step="0.5" min="0">
          </div>
          <div class="pm-form-group full">
            <label>進捗率</label>
            <div class="pm-range-row">
              <input type="range" id="pmTaskProgress" min="0" max="100" value="0">
              <span class="pm-range-value" id="pmTaskProgressVal">0%</span>
            </div>
          </div>
          <div class="pm-form-group full">
            <label>タグ（カンマ区切り）</label>
            <input type="text" class="pm-input" id="pmTaskTags" placeholder="tag1, tag2, ...">
          </div>
          <div class="pm-form-group full">
            <label>サブタスク</label>
            <ul class="pm-subtask-list" id="pmSubtaskList"></ul>
            <button type="button" class="pm-btn small secondary" id="pmSubtaskAdd">＋ サブタスク追加</button>
          </div>
          <div class="pm-form-group full">
            <label>依存タスク</label>
            <select class="pm-select" id="pmTaskPredecessors" multiple style="min-height:60px"></select>
          </div>
          <div class="pm-form-group full" id="pmGithubIssueGroup" style="display:none">
            <label>GitHub Issue</label>
            <input type="text" class="pm-input" id="pmTaskGithubUrl" readonly>
          </div>
          <div class="pm-form-group full" id="pmActivityGroup" style="display:none">
            <label>アクティビティ履歴</label>
            <ul class="pm-activity-list" id="pmTaskActivity"></ul>
          </div>
        </div>
        <div class="pm-modal-footer">
          <button type="button" class="pm-btn secondary" id="pmModalCancel">キャンセル</button>
          <button type="submit" class="pm-btn" id="pmModalSave">保存</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Import Modal -->
  <div class="pm-modal-overlay" id="pmImportModal">
    <div class="pm-modal" style="max-width:450px">
      <div class="pm-modal-header">
        <h3 class="pm-modal-title">📥 データ読込</h3>
        <button class="pm-modal-close" id="pmImportClose">&times;</button>
      </div>
      <div class="pm-form-group">
        <label>ファイル選択（JSON / CSV）</label>
        <input type="file" id="pmImportFile" accept=".json,.csv" style="margin:8px 0">
      </div>
      <div class="pm-import-options" id="pmImportOptions" style="display:none">
        <label><input type="radio" name="pmImportMode" value="overwrite" checked> 上書き</label>
        <label><input type="radio" name="pmImportMode" value="skip"> スキップ</label>
      </div>
      <div class="pm-modal-footer">
        <button class="pm-btn secondary" id="pmImportCancel">キャンセル</button>
        <button class="pm-btn" id="pmImportExec">読込実行</button>
      </div>
    </div>
  </div>

  <!-- Snapshot Modal -->
  <div class="pm-modal-overlay" id="pmSnapshotModal">
    <div class="pm-modal" style="max-width:450px">
      <div class="pm-modal-header">
        <h3 class="pm-modal-title">📸 スナップショット</h3>
        <button class="pm-modal-close" id="pmSnapshotClose">&times;</button>
      </div>
      <div class="pm-form-group" style="margin-bottom:10px">
        <label>スナップショット名</label>
        <div style="display:flex;gap:8px">
          <input type="text" class="pm-input" id="pmSnapshotName" placeholder="例: v1.0 リリース前">
          <button class="pm-btn" id="pmSnapshotSave">保存</button>
        </div>
      </div>
      <h4 style="margin:10px 0 5px;color:var(--pm-accent)">保存済みスナップショット</h4>
      <ul class="pm-snapshot-list" id="pmSnapshotList"></ul>
    </div>
  </div>

  <!-- Confirm Modal -->
  <div class="pm-modal-overlay" id="pmConfirmModal">
    <div class="pm-modal" style="max-width:380px">
      <div class="pm-modal-header">
        <h3 class="pm-modal-title" id="pmConfirmTitle">確認</h3>
        <button class="pm-modal-close" id="pmConfirmClose">&times;</button>
      </div>
      <p id="pmConfirmMsg"></p>
      <div class="pm-modal-footer">
        <button class="pm-btn secondary" id="pmConfirmCancel">キャンセル</button>
        <button class="pm-btn danger" id="pmConfirmOk">OK</button>
      </div>
    </div>
  </div>

  <!-- Toast Container -->
  <div class="pm-toast-container" id="pmToastContainer"></div>
</div>

<script>
/* ============================================================
   Project Manager - Mimo v2.5 Pro
   Full implementation per SPEC.md
   ============================================================ */
(function() {
'use strict';

// ---- Namespace ----
var pm = {};

// ---- Constants ----
var KEYS = {
  tasks: 'rui-pm-tasks',
  settings: 'rui-pm-settings',
  github: 'rui-pm-github',
  snapshots: 'rui-pm-snapshots',
  activity: 'rui-pm-activity'
};

var STATUS_LABELS = { todo: 'ToDo', doing: 'Doing', done: 'Done' };
var PRIORITY_LABELS = { high: '高', medium: '中', low: '低' };
var PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
var STATUS_ORDER = { todo: 0, doing: 1, done: 2 };

// ---- State ----
pm.tasks = [];
pm.settings = { view: 'list', theme: 'light' };
pm.github = { token: '', repo: '' };
pm.snapshots = [];
pm.activity = [];
pm.currentView = 'list';
pm.sortColumn = null;
pm.sortDir = 'asc';
pm.filters = { status: '', priority: '', assignee: '', milestone: '', search: '' };
pm.selectedIds = new Set();
pm.editingTaskId = null;
pm.calendarDate = new Date();
pm.ganttOffset = 0;

// ---- Utility ----
pm.generateId = function() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxx-xxxx-xxxx'.replace(/x/g, function() {
    return Math.floor(Math.random() * 16).toString(16);
  });
};

pm.now = function() { return new Date().toISOString(); };

pm.today = function() {
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
};

pm.parseDate = function(str) {
  if (!str) return null;
  var parts = str.split('-');
  if (parts.length !== 3) return null;
  return new Date(+parts[0], +parts[1] - 1, +parts[2]);
};

pm.formatDate = function(str) {
  if (!str) return '';
  return str;
};

pm.clone = function(obj) { return JSON.parse(JSON.stringify(obj)); };

pm.escHtml = function(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
};

pm.weekStart = function(date) {
  var d = new Date(date);
  var day = d.getDay();
  var diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0,0,0,0);
  return d;
};

pm.dateStr = function(offset) {
  var d = new Date();
  d.setDate(d.getDate() + offset);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
};

// ---- Storage ----
pm.save = function(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { pm.toast('保存に失敗しました', 'error'); }
};

pm.load = function(key) {
  try {
    var s = localStorage.getItem(key);
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
};

pm.saveTasks = function() { pm.save(KEYS.tasks, pm.tasks); };
pm.saveSettings = function() { pm.save(KEYS.settings, pm.settings); };
pm.saveGithub = function() { pm.save(KEYS.github, pm.github); };
pm.saveSnapshots = function() { pm.save(KEYS.snapshots, pm.snapshots); };
pm.saveActivity = function() { pm.save(KEYS.activity, pm.activity); };

pm.loadAll = function() {
  pm.tasks = pm.load(KEYS.tasks) || [];
  pm.settings = pm.load(KEYS.settings) || { view: 'list', theme: 'light' };
  pm.github = pm.load(KEYS.github) || { token: '', repo: '' };
  pm.snapshots = pm.load(KEYS.snapshots) || [];
  pm.activity = pm.load(KEYS.activity) || [];
};

// ---- Toast ----
pm.toast = function(msg, type) {
  type = type || 'info';
  var container = document.getElementById('pmToastContainer');
  var el = document.createElement('div');
  el.className = 'pm-toast ' + type;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(function() { el.remove(); }, 3000);
};

// ---- Confirm ----
pm.confirm = function(title, msg) {
  return new Promise(function(resolve) {
    var overlay = document.getElementById('pmConfirmModal');
    document.getElementById('pmConfirmTitle').textContent = title;
    document.getElementById('pmConfirmMsg').textContent = msg;
    overlay.classList.add('show');
    var okBtn = document.getElementById('pmConfirmOk');
    var cancelBtn = document.getElementById('pmConfirmCancel');
    var closeBtn = document.getElementById('pmConfirmClose');
    function cleanup(ok) {
      overlay.classList.remove('show');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      closeBtn.removeEventListener('click', onCancel);
      resolve(ok);
    }
    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    closeBtn.addEventListener('click', onCancel);
  });
};

// ---- Activity Logging ----
pm.logActivity = function(taskId, action, detail) {
  pm.activity.push({
    taskId: taskId,
    action: action,
    detail: detail || '',
    timestamp: pm.now()
  });
  pm.saveActivity();
};

pm.getTaskActivity = function(taskId) {
  return pm.activity.filter(function(a) { return a.taskId === taskId; })
    .sort(function(a, b) { return b.timestamp.localeCompare(a.timestamp); });
};

// ---- CRUD ----
pm.createTask = function(data) {
  var task = {
    id: pm.generateId(),
    title: data.title || '',
    description: data.description || '',
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    assignee: data.assignee || '',
    startDate: data.startDate || '',
    dueDate: data.dueDate || '',
    progress: data.progress || 0,
    tags: data.tags || [],
    estimatedHours: data.estimatedHours || 0,
    actualHours: data.actualHours || 0,
    milestone: data.milestone || '',
    subtasks: data.subtasks || [],
    predecessors: data.predecessors || [],
    githubIssueUrl: data.githubIssueUrl || '',
    createdAt: pm.now(),
    updatedAt: pm.now()
  };
  pm.tasks.push(task);
  pm.saveTasks();
  pm.logActivity(task.id, 'created', 'タスクを作成');
  return task;
};

pm.updateTask = function(id, data) {
  var idx = pm.tasks.findIndex(function(t) { return t.id === id; });
  if (idx === -1) return null;
  var old = pm.clone(pm.tasks[idx]);
  var task = pm.tasks[idx];
  var changes = [];
  Object.keys(data).forEach(function(k) {
    if (k === 'id' || k === 'createdAt') return;
    if (JSON.stringify(task[k]) !== JSON.stringify(data[k])) {
      changes.push(k);
    }
    task[k] = data[k];
  });
  task.updatedAt = pm.now();
  pm.saveTasks();
  if (changes.length > 0) {
    pm.logActivity(id, 'updated', '更新: ' + changes.join(', '));
    if (changes.indexOf('status') !== -1) {
      pm.logActivity(id, 'status_changed', STATUS_LABELS[old.status] + ' → ' + STATUS_LABELS[task.status]);
    }
  }
  return task;
};

pm.deleteTask = function(id) {
  pm.tasks = pm.tasks.filter(function(t) { return t.id !== id; });
  pm.saveTasks();
  pm.activity = pm.activity.filter(function(a) { return a.taskId !== id; });
  pm.saveActivity();
};

pm.getTask = function(id) {
  return pm.tasks.find(function(t) { return t.id === id; });
};

pm.getAssignees = function() {
  var set = {};
  pm.tasks.forEach(function(t) { if (t.assignee) set[t.assignee] = true; });
  return Object.keys(set).sort();
};

pm.getMilestones = function() {
  var set = {};
  pm.tasks.forEach(function(t) { if (t.milestone) set[t.milestone] = true; });
  return Object.keys(set).sort();
};

pm.calcSubtaskProgress = function(subtasks) {
  if (!subtasks || subtasks.length === 0) return null;
  var done = subtasks.filter(function(s) { return s.done; }).length;
  return Math.round(done / subtasks.length * 100);
};

// ---- Filtering & Sorting ----
pm.getFilteredTasks = function() {
  var f = pm.filters;
  return pm.tasks.filter(function(t) {
    if (f.status && t.status !== f.status) return false;
    if (f.priority && t.priority !== f.priority) return false;
    if (f.assignee && t.assignee !== f.assignee) return false;
    if (f.milestone && t.milestone !== f.milestone) return false;
    if (f.search) {
      var q = f.search.toLowerCase();
      var hay = (t.title + ' ' + t.description + ' ' + (t.tags || []).join(' ')).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
};

pm.getSortedTasks = function(tasks) {
  if (!pm.sortColumn) return tasks;
  var col = pm.sortColumn;
  var dir = pm.sortDir === 'asc' ? 1 : -1;
  return tasks.slice().sort(function(a, b) {
    var va = a[col], vb = b[col];
    if (col === 'priority') { va = PRIORITY_ORDER[va]; vb = PRIORITY_ORDER[vb]; }
    else if (col === 'status') { va = STATUS_ORDER[va]; vb = STATUS_ORDER[vb]; }
    else if (col === 'progress' || col === 'estimatedHours' || col === 'actualHours') {
      va = Number(va) || 0; vb = Number(vb) || 0;
    }
    if (va == null) va = '';
    if (vb == null) vb = '';
    if (typeof va === 'string') return va.localeCompare(vb) * dir;
    return (va - vb) * dir;
  });
};

// ---- Dependency Check (Circular) ----
pm.hasCircularDep = function(taskId, predecessors) {
  var visited = {};
  function dfs(id) {
    if (visited[id]) return true;
    visited[id] = true;
    var t = pm.getTask(id);
    if (!t) return false;
    for (var i = 0; i < t.predecessors.length; i++) {
      if (dfs(t.predecessors[i])) return true;
    }
    visited[id] = false;
    return false;
  }
  visited[taskId] = true;
  for (var i = 0; i < predecessors.length; i++) {
    if (predecessors[i] === taskId) return true;
    if (dfs(predecessors[i])) return true;
  }
  return false;
};

// ---- List View ----
pm.renderList = function() {
  var tasks = pm.getSortedTasks(pm.getFilteredTasks());
  var tbody = document.getElementById('pmTableBody');
  var empty = document.getElementById('pmListEmpty');
  tbody.innerHTML = '';
  if (tasks.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tasks.forEach(function(t) {
    var tr = document.createElement('tr');
    var tagsHtml = (t.tags || []).map(function(tag) {
      return '<span class="pm-tag">' + pm.escHtml(tag) + '</span>';
    }).join('');
    tr.innerHTML =
      '<td><input type="checkbox" class="pm-checkbox pm-row-check" data-id="' + t.id + '"' +
        (pm.selectedIds.has(t.id) ? ' checked' : '') + '></td>' +
      '<td><span class="pm-task-title" data-id="' + t.id + '">' + pm.escHtml(t.title) + '</span></td>' +
      '<td><span class="pm-status ' + t.status + '">' + STATUS_LABELS[t.status] + '</span></td>' +
      '<td><span class="pm-priority ' + t.priority + '">' + PRIORITY_LABELS[t.priority] + '</span></td>' +
      '<td>' + pm.escHtml(t.assignee) + '</td>' +
      '<td>' + pm.formatDate(t.startDate) + '</td>' +
      '<td>' + pm.formatDate(t.dueDate) + '</td>' +
      '<td><div class="pm-progress-bar"><div class="pm-progress-bar-inner" style="width:' + t.progress + '%"></div></div><span class="pm-progress-text">' + t.progress + '%</span></td>' +
      '<td>' + tagsHtml + '</td>' +
      '<td class="pm-table-actions">' +
        '<button class="pm-btn small secondary pm-edit-btn" data-id="' + t.id + '">✏️</button>' +
        '<button class="pm-btn small danger pm-del-btn" data-id="' + t.id + '">🗑</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
};

// ---- Gantt View ----
pm.renderGantt = function() {
  var tasks = pm.getFilteredTasks().filter(function(t) { return t.startDate && t.dueDate; });
  if (tasks.length === 0) {
    document.getElementById('pmGanttWrapper').innerHTML = '<div class="pm-empty">表示できるタスクがありません（開始日・締切日を設定してください）。</div>';
    return;
  }

  var today = new Date();
  today.setHours(0,0,0,0);
  var baseStart = pm.weekStart(new Date(today.getTime() + pm.ganttOffset * 7 * 86400000));
  var weekCount = 12;
  var weekWidth = 80;
  var labelWidth = 200;

  // Build header
  var headerHtml = '<div class="pm-gantt-header">' +
    '<div class="pm-gantt-label-col">タスク</div>' +
    '<div class="pm-gantt-timeline">';
  var weekDates = [];
  for (var w = 0; w < weekCount; w++) {
    var wd = new Date(baseStart.getTime() + w * 7 * 86400000);
    weekDates.push(wd);
    var m = wd.getMonth() + 1;
    var d = wd.getDate();
    headerHtml += '<div class="pm-gantt-week-header" style="min-width:' + weekWidth + 'px">' +
      m + '/' + d + '</div>';
  }
  headerHtml += '</div></div>';

  var rangeEnd = new Date(baseStart.getTime() + (weekCount - 1) * 7 * 86400000);
  document.getElementById('pmGanttRange').textContent =
    baseStart.getFullYear() + '/' + (baseStart.getMonth()+1) + '/' + baseStart.getDate() +
    ' 〜 ' + rangeEnd.getFullYear() + '/' + (rangeEnd.getMonth()+1) + '/' + rangeEnd.getDate();

  var timelineStart = baseStart.getTime();
  var timelineEnd = baseStart.getTime() + weekCount * 7 * 86400000;
  var totalWidth = weekCount * weekWidth;

  // Build body
  var bodyHtml = '<div class="pm-gantt-body" style="position:relative">';
  for (var w = 0; w < weekCount; w++) {
    bodyHtml += '<div class="pm-gantt-week-col" style="left:' + (labelWidth + w * weekWidth) + 'px;width:' + weekWidth + 'px"></div>';
  }

  tasks.forEach(function(t) {
    var tStart = pm.parseDate(t.startDate).getTime();
    var tEnd = pm.parseDate(t.dueDate).getTime() + 86400000;
    var left = Math.max(0, (tStart - timelineStart) / (timelineEnd - timelineStart) * totalWidth);
    var right = Math.min(totalWidth, (tEnd - timelineStart) / (timelineEnd - timelineStart) * totalWidth);
    var width = Math.max(4, right - left);

    bodyHtml += '<div class="pm-gantt-row">' +
      '<div class="pm-gantt-row-label" data-id="' + t.id + '">' + pm.escHtml(t.title) + '</div>' +
      '<div class="pm-gantt-row-timeline" style="position:relative;width:' + totalWidth + 'px">';
    bodyHtml += '<div class="pm-gantt-bar ' + t.priority + '" data-id="' + t.id + '" ' +
      'style="left:' + left + 'px;width:' + width + 'px" ' +
      'title="' + pm.escHtml(t.title) + ' (' + t.progress + '%)">' +
      pm.escHtml(t.title) + '</div>';

    if (t.milestone) {
      var mLeft = Math.min(totalWidth - 14, (tEnd - 86400000 - timelineStart) / (timelineEnd - timelineStart) * totalWidth);
      bodyHtml += '<div class="pm-gantt-milestone" style="left:' + mLeft + 'px" title="' + pm.escHtml(t.milestone) + '"></div>';
    }
    bodyHtml += '</div></div>';
  });

  // Today line
  var todayPos = (today.getTime() - timelineStart) / (timelineEnd - timelineStart) * totalWidth;
  if (todayPos >= 0 && todayPos <= totalWidth) {
    bodyHtml += '<div class="pm-gantt-today" style="left:' + (labelWidth + todayPos) + 'px"></div>';
  }
  bodyHtml += '</div>';

  document.getElementById('pmGanttWrapper').innerHTML =
    '<div style="display:flex;flex-direction:column">' +
    '<div style="display:flex"><div style="min-width:' + labelWidth + 'px;max-width:' + labelWidth + 'px"></div></div>' +
    headerHtml + bodyHtml + '</div>';

  // Dependency arrows (SVG)
  var svgArrows = [];
  tasks.forEach(function(t) {
    if (!t.predecessors || t.predecessors.length === 0) return;
    t.predecessors.forEach(function(pid) {
      var pred = pm.getTask(pid);
      if (!pred || !pred.startDate || !pred.dueDate) return;
      var predIdx = tasks.indexOf(pred);
      if (predIdx === -1) return;
      var succIdx = tasks.indexOf(t);
      var predEnd = pm.parseDate(pred.dueDate).getTime() + 86400000;
      var succStart = pm.parseDate(t.startDate).getTime();
      var x1 = labelWidth + Math.min(totalWidth, (predEnd - timelineStart) / (timelineEnd - timelineStart) * totalWidth);
      var y1 = 32 * predIdx + 16;
      var x2 = labelWidth + Math.max(0, (succStart - timelineStart) / (timelineEnd - timelineStart) * totalWidth);
      var y2 = 32 * succIdx + 16;
      svgArrows.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
    });
  });

  if (svgArrows.length > 0) {
    var wrapper = document.getElementById('pmGanttWrapper');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '3';
    svg.setAttribute('class', 'pm-gantt-arrow');
    svgArrows.forEach(function(a) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var mx = (a.x1 + a.x2) / 2;
      var d = 'M' + a.x1 + ',' + a.y1 + ' C' + mx + ',' + a.y1 + ' ' + mx + ',' + a.y2 + ' ' + a.x2 + ',' + a.y2;
      path.setAttribute('d', d);
      path.setAttribute('stroke', '#999');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('fill', 'none');
      path.setAttribute('marker-end', 'url(#pmArrow)');
      svg.appendChild(path);
    });
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'pmArrow');
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '8');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', '0 0, 8 3, 0 6');
    poly.setAttribute('fill', '#999');
    marker.appendChild(poly);
    defs.appendChild(marker);
    svg.appendChild(defs);
    wrapper.style.position = 'relative';
    wrapper.appendChild(svg);
  }
};

// ---- Kanban View ----
pm.renderKanban = function() {
  var tasks = pm.getFilteredTasks();
  var columns = ['todo', 'doing', 'done'];
  var html = '';
  columns.forEach(function(status) {
    var colTasks = tasks.filter(function(t) { return t.status === status; });
    html += '<div class="pm-kanban-col">' +
      '<div class="pm-kanban-col-header ' + status + '">' +
        STATUS_LABELS[status] + ' (' + colTasks.length + ')' +
      '</div>' +
      '<div class="pm-kanban-cards" data-status="' + status + '">';
    colTasks.forEach(function(t) {
      var tagsHtml = (t.tags || []).map(function(tag) {
        return '<span class="pm-tag">' + pm.escHtml(tag) + '</span>';
      }).join('');
      html += '<div class="pm-kanban-card" draggable="true" data-id="' + t.id + '">' +
        '<div class="pm-kanban-card-title" data-id="' + t.id + '">' + pm.escHtml(t.title) + '</div>' +
        '<div class="pm-kanban-card-meta">' +
          '<span class="pm-priority ' + t.priority + '">' + PRIORITY_LABELS[t.priority] + '</span>' +
          (t.dueDate ? '<span>📅 ' + t.dueDate + '</span>' : '') +
          (t.assignee ? '<span>👤 ' + pm.escHtml(t.assignee) + '</span>' : '') +
        '</div>' +
        '<div class="pm-kanban-card-meta">' +
          '<div class="pm-progress-bar"><div class="pm-progress-bar-inner" style="width:' + t.progress + '%"></div></div>' +
          '<span class="pm-progress-text">' + t.progress + '%</span>' +
          tagsHtml +
        '</div>' +
        '</div>';
    });
    if (colTasks.length === 0) {
      html += '<div style="text-align:center;color:var(--pm-text-muted);font-size:0.82em;padding:20px">タスクなし</div>';
    }
    html += '</div></div>';
  });
  document.getElementById('pmKanban').innerHTML = html;

  // Drag & Drop
  var cards = document.querySelectorAll('.pm-kanban-card');
  cards.forEach(function(card) {
    card.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', card.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      card.style.opacity = '0.5';
    });
    card.addEventListener('dragend', function() {
      card.style.opacity = '1';
      document.querySelectorAll('.pm-kanban-cards').forEach(function(c) {
        c.classList.remove('drag-over');
      });
    });
  });
  var containers = document.querySelectorAll('.pm-kanban-cards');
  containers.forEach(function(cont) {
    cont.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      cont.classList.add('drag-over');
    });
    cont.addEventListener('dragleave', function() {
      cont.classList.remove('drag-over');
    });
    cont.addEventListener('drop', function(e) {
      e.preventDefault();
      cont.classList.remove('drag-over');
      var taskId = e.dataTransfer.getData('text/plain');
      var newStatus = cont.dataset.status;
      if (taskId && newStatus) {
        pm.updateTask(taskId, { status: newStatus });
        pm.renderCurrentView();
        pm.toast('ステータスを「' + STATUS_LABELS[newStatus] + '」に変更しました', 'success');
      }
    });
  });
};

// ---- Calendar View ----
pm.renderCalendar = function() {
  var year = pm.calendarDate.getFullYear();
  var month = pm.calendarDate.getMonth();
  document.getElementById('pmCalTitle').textContent = year + '年' + (month + 1) + '月';

  var firstDay = new Date(year, month, 1);
  var lastDay = new Date(year, month + 1, 0);
  var startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  var daysInMonth = lastDay.getDate();

  var todayStr = pm.today();
  var tasks = pm.getFilteredTasks();

  var html = '';
  var dowNames = ['月','火','水','木','金','土','日'];
  dowNames.forEach(function(n) {
    html += '<div class="pm-calendar-day-header">' + n + '</div>';
  });

  var prevLast = new Date(year, month, 0).getDate();
  for (var i = startDow - 1; i >= 0; i--) {
    html += '<div class="pm-calendar-day other-month"><div class="pm-calendar-day-num">' + (prevLast - i) + '</div></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = year + '-' + String(month + 1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    var isToday = dateStr === todayStr;
    var dayTasks = tasks.filter(function(t) {
      if (!t.startDate || !t.dueDate) return false;
      return t.startDate <= dateStr && t.dueDate >= dateStr;
    });
    html += '<div class="pm-calendar-day' + (isToday ? ' today' : '') + '" data-date="' + dateStr + '">' +
      '<div class="pm-calendar-day-num">' + d + '</div>';
    dayTasks.forEach(function(t) {
      html += '<span class="pm-calendar-dot ' + t.priority + '" title="' + pm.escHtml(t.title) + '"></span>';
    });
    html += '</div>';
  }

  var totalCells = startDow + daysInMonth;
  var remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (var i = 1; i <= remaining; i++) {
    html += '<div class="pm-calendar-day other-month"><div class="pm-calendar-day-num">' + i + '</div></div>';
  }

  document.getElementById('pmCalendarGrid').innerHTML = html;
};

// ---- Export ----
pm.exportJSON = function() {
  var data = JSON.stringify(pm.tasks, null, 2);
  var blob = new Blob([data], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'project-manager-tasks-' + pm.today() + '.json';
  a.click();
  URL.revokeObjectURL(url);
  pm.toast('JSONをエクスポートしました', 'success');
};

pm.exportCSV = function() {
  var headers = ['id','title','description','status','priority','assignee','startDate','dueDate','progress','tags','estimatedHours','actualHours','milestone','githubIssueUrl','createdAt','updatedAt'];
  var rows = [headers.join(',')];
  pm.tasks.forEach(function(t) {
    var row = headers.map(function(h) {
      var v = t[h];
      if (Array.isArray(v)) v = v.join(';');
      if (v == null) v = '';
      v = String(v).replace(/"/g, '""');
      return '"' + v + '"';
    });
    rows.push(row.join(','));
  });
  var csv = rows.join('\n');
  var bom = '\uFEFF';
  var blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'project-manager-tasks-' + pm.today() + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  pm.toast('CSVをエクスポートしました', 'success');
};

// ---- Import ----
pm.importData = function(content, isCSV, mode) {
  var imported;
  if (isCSV) {
    imported = pm.parseCSV(content);
  } else {
    try { imported = JSON.parse(content); } catch(e) { pm.toast('JSONのパースに失敗しました', 'error'); return; }
  }
  if (!Array.isArray(imported)) { pm.toast('データ形式が正しくありません', 'error'); return; }

  var added = 0, updated = 0, skipped = 0;
  imported.forEach(function(item) {
    if (!item.id) item.id = pm.generateId();
    var exists = pm.getTask(item.id);
    if (exists) {
      if (mode === 'overwrite') {
        pm.updateTask(item.id, item);
        updated++;
      } else {
        skipped++;
      }
    } else {
      item.createdAt = item.createdAt || pm.now();
      item.updatedAt = pm.now();
      pm.tasks.push(item);
      added++;
    }
  });
  pm.saveTasks();
  pm.toast('読込完了: 追加' + added + '件, 更新' + updated + '件, スキップ' + skipped + '件', 'success');
  pm.renderCurrentView();
  pm.updateFilterOptions();
};

pm.parseCSV = function(text) {
  var lines = text.replace(/^\uFEFF/, '').split('\n').filter(function(l) { return l.trim(); });
  if (lines.length < 2) return [];
  var headers = pm.parseCSVLine(lines[0]);
  var result = [];
  for (var i = 1; i < lines.length; i++) {
    var vals = pm.parseCSVLine(lines[i]);
    var obj = {};
    headers.forEach(function(h, idx) {
      var v = vals[idx] || '';
      if (h === 'tags') obj[h] = v.split(';').filter(Boolean);
      else if (h === 'progress' || h === 'estimatedHours' || h === 'actualHours') obj[h] = Number(v) || 0;
      else obj[h] = v;
    });
    result.push(obj);
  }
  return result;
};

pm.parseCSVLine = function(line) {
  var result = [];
  var current = '';
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i+1] === '"') { current += '"'; i++; }
        else { inQuotes = false; }
      } else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { result.push(current); current = ''; }
      else { current += ch; }
    }
  }
  result.push(current);
  return result;
};

// ---- GitHub Issue ----
pm.createGitHubIssue = function(task) {
  if (!pm.github.token || !pm.github.repo) {
    pm.toast('GitHub設定を確認してください', 'error');
    return Promise.reject('No config');
  }
  var url = 'https://api.github.com/repos/' + pm.github.repo + '/issues';
  var labels = [];
  if (task.priority === 'high') labels.push('high priority');
  else if (task.priority === 'medium') labels.push('medium priority');
  else labels.push('low priority');
  var body = task.description || '';
  if (task.subtasks && task.subtasks.length > 0) {
    body += '\n\n## サブタスク\n';
    task.subtasks.forEach(function(s) {
      body += (s.done ? '- [x] ' : '- [ ] ') + s.text + '\n';
    });
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'token ' + pm.github.token,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: task.title,
      body: body,
      labels: labels
    })
  }).then(function(res) {
    if (!res.ok) throw new Error('GitHub API error: ' + res.status);
    return res.json();
  }).then(function(data) {
    pm.updateTask(task.id, { githubIssueUrl: data.html_url });
    return data.html_url;
  });
};

// ---- Snapshots ----
pm.saveSnapshot = function(name) {
  pm.snapshots.push({
    id: pm.generateId(),
    name: name || 'Snapshot ' + pm.snapshots.length,
    date: pm.now(),
    data: pm.clone(pm.tasks)
  });
  pm.saveSnapshots();
  pm.toast('スナップショットを保存しました', 'success');
};

pm.loadSnapshot = function(id) {
  var snap = pm.snapshots.find(function(s) { return s.id === id; });
  if (!snap) return;
  pm.tasks = pm.clone(snap.data);
  pm.saveTasks();
  pm.logActivity('', 'snapshot_restored', 'スナップショット「' + snap.name + '」から復元');
  pm.toast('スナップショット「' + snap.name + '」を復元しました', 'success');
  pm.renderCurrentView();
  pm.updateFilterOptions();
};

pm.deleteSnapshot = function(id) {
  pm.snapshots = pm.snapshots.filter(function(s) { return s.id !== id; });
  pm.saveSnapshots();
};

// ---- View Management ----
pm.switchView = function(view) {
  pm.currentView = view;
  pm.settings.view = view;
  pm.saveSettings();
  document.querySelectorAll('.pm-view').forEach(function(v) { v.classList.remove('active'); });
  document.querySelectorAll('.pm-tab').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById('pm' + view.charAt(0).toUpperCase() + view.slice(1) + 'View').classList.add('active');
  document.querySelector('.pm-tab[data-view="' + view + '"]').classList.add('active');
  pm.renderCurrentView();
};

pm.renderCurrentView = function() {
  switch(pm.currentView) {
    case 'list': pm.renderList(); break;
    case 'gantt': pm.renderGantt(); break;
    case 'kanban': pm.renderKanban(); break;
    case 'calendar': pm.renderCalendar(); break;
  }
};

// ---- Filter Options ----
pm.updateFilterOptions = function() {
  var assignees = pm.getAssignees();
  var milestones = pm.getMilestones();
  var assigneeSel = document.getElementById('pmFilterAssignee');
  var milestoneSel = document.getElementById('pmFilterMilestone');
  var currentAssignee = assigneeSel.value;
  var currentMilestone = milestoneSel.value;
  assigneeSel.innerHTML = '<option value="">担当者</option>';
  assignees.forEach(function(a) {
    assigneeSel.innerHTML += '<option value="' + pm.escHtml(a) + '">' + pm.escHtml(a) + '</option>';
  });
  assigneeSel.value = currentAssignee;
  milestoneSel.innerHTML = '<option value="">ﾏｲﾙｽﾄｰﾝ</option>';
  milestones.forEach(function(m) {
    milestoneSel.innerHTML += '<option value="' + pm.escHtml(m) + '">' + pm.escHtml(m) + '</option>';
  });
  milestoneSel.value = currentMilestone;
};

// ---- Task Modal ----
pm.openTaskModal = function(taskId) {
  var modal = document.getElementById('pmTaskModal');
  var form = document.getElementById('pmTaskForm');
  form.reset();
  document.getElementById('pmSubtaskList').innerHTML = '';

  var predSel = document.getElementById('pmTaskPredecessors');
  predSel.innerHTML = '';
  pm.tasks.forEach(function(t) {
    if (t.id !== taskId) {
      predSel.innerHTML += '<option value="' + t.id + '">' + pm.escHtml(t.title) + '</option>';
    }
  });

  if (taskId) {
    pm.editingTaskId = taskId;
    var t = pm.getTask(taskId);
    if (!t) return;
    document.getElementById('pmModalTitle').textContent = 'タスク編集';
    document.getElementById('pmTaskId').value = t.id;
    document.getElementById('pmTaskTitle').value = t.title;
    document.getElementById('pmTaskDesc').value = t.description;
    document.getElementById('pmTaskStatus').value = t.status;
    document.getElementById('pmTaskPriority').value = t.priority;
    document.getElementById('pmTaskAssignee').value = t.assignee;
    document.getElementById('pmTaskMilestone').value = t.milestone;
    document.getElementById('pmTaskStart').value = t.startDate;
    document.getElementById('pmTaskDue').value = t.dueDate;
    document.getElementById('pmTaskEstHours').value = t.estimatedHours || '';
    document.getElementById('pmTaskActHours').value = t.actualHours || '';
    document.getElementById('pmTaskProgress').value = t.progress;
    document.getElementById('pmTaskProgressVal').textContent = t.progress + '%';
    document.getElementById('pmTaskTags').value = (t.tags || []).join(', ');

    (t.subtasks || []).forEach(function(s) {
      pm.addSubtaskItem(s.text, s.done);
    });

    (t.predecessors || []).forEach(function(pid) {
      var opt = predSel.querySelector('option[value="' + pid + '"]');
      if (opt) opt.selected = true;
    });

    var ghGroup = document.getElementById('pmGithubIssueGroup');
    if (t.githubIssueUrl) {
      ghGroup.style.display = '';
      document.getElementById('pmTaskGithubUrl').value = t.githubIssueUrl;
    } else {
      ghGroup.style.display = 'none';
    }

    var actGroup = document.getElementById('pmActivityGroup');
    var taskAct = pm.getTaskActivity(t.id);
    if (taskAct.length > 0) {
      actGroup.style.display = '';
      var actList = document.getElementById('pmTaskActivity');
      actList.innerHTML = '';
      taskAct.forEach(function(a) {
        var li = document.createElement('li');
        li.className = 'pm-activity-item';
        var d = new Date(a.timestamp);
        var timeStr = d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' ' +
          String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
        li.innerHTML = '<span class="pm-activity-time">' + timeStr + '</span>' +
          pm.escHtml(a.action) + (a.detail ? ' - ' + pm.escHtml(a.detail) : '');
        actList.appendChild(li);
      });
    } else {
      actGroup.style.display = 'none';
    }
  } else {
    pm.editingTaskId = null;
    document.getElementById('pmModalTitle').textContent = '新規タスク';
    document.getElementById('pmTaskId').value = '';
    document.getElementById('pmGithubIssueGroup').style.display = 'none';
    document.getElementById('pmActivityGroup').style.display = 'none';
  }

  modal.classList.add('show');
  document.getElementById('pmTaskTitle').focus();
};

pm.closeTaskModal = function() {
  document.getElementById('pmTaskModal').classList.remove('show');
  pm.editingTaskId = null;
};

pm.addSubtaskItem = function(text, done) {
  var list = document.getElementById('pmSubtaskList');
  var li = document.createElement('li');
  li.className = 'pm-subtask-item';
  li.innerHTML = '<input type="checkbox"' + (done ? ' checked' : '') + '>' +
    '<input type="text" value="' + pm.escHtml(text || '') + '" placeholder="サブタスク">' +
    '<button type="button" class="pm-subtask-remove">&times;</button>';
  li.querySelector('.pm-subtask-remove').addEventListener('click', function() { li.remove(); });
  list.appendChild(li);
};

pm.collectSubtasks = function() {
  var items = document.querySelectorAll('#pmSubtaskList .pm-subtask-item');
  var result = [];
  items.forEach(function(item) {
    var text = item.querySelector('input[type="text"]').value.trim();
    var done = item.querySelector('input[type="checkbox"]').checked;
    if (text) result.push({ text: text, done: done });
  });
  return result;
};

pm.collectForm = function() {
  var predSel = document.getElementById('pmTaskPredecessors');
  var predecessors = [];
  for (var i = 0; i < predSel.options.length; i++) {
    if (predSel.options[i].selected) predecessors.push(predSel.options[i].value);
  }
  var tagsStr = document.getElementById('pmTaskTags').value;
  var tags = tagsStr ? tagsStr.split(',').map(function(t) { return t.trim(); }).filter(Boolean) : [];

  return {
    title: document.getElementById('pmTaskTitle').value.trim(),
    description: document.getElementById('pmTaskDesc').value.trim(),
    status: document.getElementById('pmTaskStatus').value,
    priority: document.getElementById('pmTaskPriority').value,
    assignee: document.getElementById('pmTaskAssignee').value.trim(),
    milestone: document.getElementById('pmTaskMilestone').value.trim(),
    startDate: document.getElementById('pmTaskStart').value,
    dueDate: document.getElementById('pmTaskDue').value,
    estimatedHours: Number(document.getElementById('pmTaskEstHours').value) || 0,
    actualHours: Number(document.getElementById('pmTaskActHours').value) || 0,
    progress: Number(document.getElementById('pmTaskProgress').value),
    tags: tags,
    subtasks: pm.collectSubtasks(),
    predecessors: predecessors
  };
};

// ---- Bulk Operations ----
pm.updateBulkBar = function() {
  var bar = document.getElementById('pmBulkBar');
  var count = pm.selectedIds.size;
  if (count > 0) {
    bar.style.display = 'flex';
    document.getElementById('pmBulkCount').textContent = count + '件選択中';
  } else {
    bar.style.display = 'none';
  }
};

pm.bulkDelete = function() {
  pm.confirm('一括削除', pm.selectedIds.size + '件のタスクを削除しますか？').then(function(ok) {
    if (!ok) return;
    pm.selectedIds.forEach(function(id) { pm.deleteTask(id); });
    pm.selectedIds.clear();
    pm.updateBulkBar();
    pm.renderCurrentView();
    pm.updateFilterOptions();
    pm.toast('削除しました', 'success');
  });
};

pm.bulkStatus = function(status) {
  pm.selectedIds.forEach(function(id) { pm.updateTask(id, { status: status }); });
  pm.selectedIds.clear();
  pm.updateBulkBar();
  pm.renderCurrentView();
  pm.toast('ステータスを一括変更しました', 'success');
};

pm.bulkIssue = function() {
  if (!pm.github.token || !pm.github.repo) {
    pm.toast('GitHub設定を確認してください', 'error');
    return;
  }
  var count = 0;
  var promises = [];
  pm.selectedIds.forEach(function(id) {
    var t = pm.getTask(id);
    if (t && !t.githubIssueUrl) {
      promises.push(pm.createGitHubIssue(t).then(function() { count++; }).catch(function() {}));
    }
  });
  Promise.all(promises).then(function() {
    pm.selectedIds.clear();
    pm.updateBulkBar();
    pm.renderCurrentView();
    pm.toast(count + '件のIssueを作成しました', 'success');
  });
};

// ---- Settings ----
pm.toggleSettings = function() {
  var panel = document.getElementById('pmSettingsPanel');
  if (panel.style.display === 'none') {
    panel.style.display = '';
    document.getElementById('pmGithubToken').value = pm.github.token;
    document.getElementById('pmGithubRepo').value = pm.github.repo;
  } else {
    panel.style.display = 'none';
  }
};

pm.saveGithubSettings = function() {
  pm.github.token = document.getElementById('pmGithubToken').value.trim();
  pm.github.repo = document.getElementById('pmGithubRepo').value.trim();
  pm.saveGithub();
  pm.toast('GitHub設定を保存しました', 'success');
  document.getElementById('pmSettingsPanel').style.display = 'none';
};

// ---- Theme ----
pm.toggleTheme = function() {
  var root = document.getElementById('pmRoot');
  if (root.classList.contains('light')) {
    root.classList.remove('light');
    root.classList.add('dark');
    pm.settings.theme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    pm.settings.theme = 'light';
  }
  pm.saveSettings();
};

// ---- Keyboard Shortcuts ----
pm.handleKeyboard = function(e) {
  var tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    if (e.key === 'Escape') {
      e.target.blur();
      pm.closeTaskModal();
    }
    return;
  }

  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      pm.openTaskModal();
    } else if (e.key === '1') {
      e.preventDefault();
      pm.switchView('list');
    } else if (e.key === '2') {
      e.preventDefault();
      pm.switchView('gantt');
    } else if (e.key === '3') {
      e.preventDefault();
      pm.switchView('kanban');
    } else if (e.key === '4') {
      e.preventDefault();
      pm.switchView('calendar');
    }
  } else if (e.key === '/') {
    e.preventDefault();
    document.getElementById('pmSearch').focus();
  } else if (e.key === 'Escape') {
    pm.closeTaskModal();
    document.getElementById('pmImportModal').classList.remove('show');
    document.getElementById('pmSnapshotModal').classList.remove('show');
    document.getElementById('pmConfirmModal').classList.remove('show');
  }
};

// ---- Event Binding ----
pm.bindEvents = function() {
  // Add task
  document.getElementById('pmAddBtn').addEventListener('click', function() { pm.openTaskModal(); });

  // View tabs
  document.querySelectorAll('.pm-tab').forEach(function(tab) {
    tab.addEventListener('click', function() { pm.switchView(tab.dataset.view); });
  });

  // Filters
  document.getElementById('pmSearch').addEventListener('input', function() {
    pm.filters.search = this.value;
    pm.renderCurrentView();
  });
  document.getElementById('pmFilterStatus').addEventListener('change', function() {
    pm.filters.status = this.value;
    pm.renderCurrentView();
  });
  document.getElementById('pmFilterPriority').addEventListener('change', function() {
    pm.filters.priority = this.value;
    pm.renderCurrentView();
  });
  document.getElementById('pmFilterAssignee').addEventListener('change', function() {
    pm.filters.assignee = this.value;
    pm.renderCurrentView();
  });
  document.getElementById('pmFilterMilestone').addEventListener('change', function() {
    pm.filters.milestone = this.value;
    pm.renderCurrentView();
  });

  // Sort
  document.querySelectorAll('#pmTable thead th[data-sort]').forEach(function(th) {
    th.addEventListener('click', function() {
      var col = th.dataset.sort;
      if (pm.sortColumn === col) {
        pm.sortDir = pm.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        pm.sortColumn = col;
        pm.sortDir = 'asc';
      }
      document.querySelectorAll('#pmTable thead th .sort-arrow').forEach(function(a) { a.textContent = ''; });
      th.querySelector('.sort-arrow').textContent = pm.sortDir === 'asc' ? ' ▲' : ' ▼';
      pm.renderList();
    });
  });

  // Select all
  document.getElementById('pmSelectAll').addEventListener('change', function() {
    var checked = this.checked;
    pm.selectedIds.clear();
    if (checked) {
      document.querySelectorAll('.pm-row-check').forEach(function(cb) {
        cb.checked = true;
        pm.selectedIds.add(cb.dataset.id);
      });
    } else {
      document.querySelectorAll('.pm-row-check').forEach(function(cb) { cb.checked = false; });
    }
    pm.updateBulkBar();
  });

  // Delegated click on table body
  document.getElementById('pmTableBody').addEventListener('click', function(e) {
    var target = e.target;
    if (target.classList.contains('pm-row-check')) {
      if (target.checked) pm.selectedIds.add(target.dataset.id);
      else pm.selectedIds.delete(target.dataset.id);
      pm.updateBulkBar();
      return;
    }
    if (target.classList.contains('pm-task-title')) {
      pm.openTaskModal(target.dataset.id);
      return;
    }
    var editBtn = target.closest('.pm-edit-btn');
    if (editBtn) {
      pm.openTaskModal(editBtn.dataset.id);
      return;
    }
    var delBtn = target.closest('.pm-del-btn');
    if (delBtn) {
      var id = delBtn.dataset.id;
      var task = pm.getTask(id);
      pm.confirm('タスク削除', '「' + (task ? task.title : '') + '」を削除しますか？').then(function(ok) {
        if (ok) {
          pm.deleteTask(id);
          pm.renderCurrentView();
          pm.updateFilterOptions();
          pm.toast('タスクを削除しました', 'success');
        }
      });
      return;
    }
  });

  // Gantt clicks
  document.getElementById('pmGanttWrapper').addEventListener('click', function(e) {
    var label = e.target.closest('.pm-gantt-row-label');
    if (label) { pm.openTaskModal(label.dataset.id); return; }
    var bar = e.target.closest('.pm-gantt-bar');
    if (bar) { pm.openTaskModal(bar.dataset.id); return; }
  });

  // Kanban clicks
  document.getElementById('pmKanban').addEventListener('click', function(e) {
    var title = e.target.closest('.pm-kanban-card-title');
    if (title) { pm.openTaskModal(title.dataset.id); }
  });

  // Gantt navigation
  document.getElementById('pmGanttPrev').addEventListener('click', function() {
    pm.ganttOffset -= 4;
    pm.renderGantt();
  });
  document.getElementById('pmGanttNext').addEventListener('click', function() {
    pm.ganttOffset += 4;
    pm.renderGantt();
  });
  document.getElementById('pmGanttToday').addEventListener('click', function() {
    pm.ganttOffset = 0;
    pm.renderGantt();
  });

  // Calendar navigation
  document.getElementById('pmCalPrev').addEventListener('click', function() {
    pm.calendarDate.setMonth(pm.calendarDate.getMonth() - 1);
    pm.renderCalendar();
  });
  document.getElementById('pmCalNext').addEventListener('click', function() {
    pm.calendarDate.setMonth(pm.calendarDate.getMonth() + 1);
    pm.renderCalendar();
  });
  document.getElementById('pmCalToday').addEventListener('click', function() {
    pm.calendarDate = new Date();
    pm.renderCalendar();
  });

  // Export
  document.getElementById('pmExportJSON').addEventListener('click', pm.exportJSON);
  document.getElementById('pmExportCSV').addEventListener('click', pm.exportCSV);

  // Import
  document.getElementById('pmImportBtn').addEventListener('click', function() {
    document.getElementById('pmImportFile').value = '';
    document.getElementById('pmImportOptions').style.display = 'none';
    document.getElementById('pmImportModal').classList.add('show');
  });
  document.getElementById('pmImportClose').addEventListener('click', function() {
    document.getElementById('pmImportModal').classList.remove('show');
  });
  document.getElementById('pmImportCancel').addEventListener('click', function() {
    document.getElementById('pmImportModal').classList.remove('show');
  });
  document.getElementById('pmImportFile').addEventListener('change', function() {
    if (this.files.length > 0) {
      document.getElementById('pmImportOptions').style.display = '';
    }
  });
  document.getElementById('pmImportExec').addEventListener('click', function() {
    var fileInput = document.getElementById('pmImportFile');
    if (!fileInput.files.length) { pm.toast('ファイルを選択してください', 'error'); return; }
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var isCSV = file.name.endsWith('.csv');
      var mode = document.querySelector('input[name="pmImportMode"]:checked').value;
      pm.importData(e.target.result, isCSV, mode);
      document.getElementById('pmImportModal').classList.remove('show');
    };
    reader.readAsText(file);
  });

  // Task Modal
  document.getElementById('pmModalClose').addEventListener('click', pm.closeTaskModal);
  document.getElementById('pmModalCancel').addEventListener('click', pm.closeTaskModal);
  document.getElementById('pmTaskModal').addEventListener('click', function(e) {
    if (e.target === this) pm.closeTaskModal();
  });

  // Progress range
  document.getElementById('pmTaskProgress').addEventListener('input', function() {
    document.getElementById('pmTaskProgressVal').textContent = this.value + '%';
  });

  // Subtask add
  document.getElementById('pmSubtaskAdd').addEventListener('click', function() {
    pm.addSubtaskItem('', false);
  });

  // Form submit
  document.getElementById('pmTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var data = pm.collectForm();
    if (!data.title) { pm.toast('タイトルは必須です', 'error'); return; }

    if (data.startDate && data.dueDate && data.startDate > data.dueDate) {
      pm.toast('開始日は締切日より前にしてください', 'error');
      return;
    }

    // Auto-calculate progress from subtasks
    var subProgress = pm.calcSubtaskProgress(data.subtasks);
    if (subProgress !== null && data.subtasks.length > 0) {
      var currentProgress = Number(document.getElementById('pmTaskProgress').value);
      if (currentProgress === 0) {
        data.progress = subProgress;
      }
    }

    if (pm.editingTaskId) {
      pm.updateTask(pm.editingTaskId, data);
      pm.toast('タスクを更新しました', 'success');
    } else {
      pm.createTask(data);
      pm.toast('タスクを作成しました', 'success');
    }
    pm.closeTaskModal();
    pm.renderCurrentView();
    pm.updateFilterOptions();
  });

  // Settings
  document.getElementById('pmSettingsBtn').addEventListener('click', pm.toggleSettings);
  document.getElementById('pmGithubSave').addEventListener('click', pm.saveGithubSettings);

  // Theme
  document.getElementById('pmThemeBtn').addEventListener('click', pm.toggleTheme);

  // Snapshot
  document.getElementById('pmSnapshotBtn').addEventListener('click', function() {
    pm.renderSnapshotList();
    document.getElementById('pmSnapshotModal').classList.add('show');
  });
  document.getElementById('pmSnapshotClose').addEventListener('click', function() {
    document.getElementById('pmSnapshotModal').classList.remove('show');
  });
  document.getElementById('pmSnapshotSave').addEventListener('click', function() {
    var name = document.getElementById('pmSnapshotName').value.trim();
    if (!name) { pm.toast('名前を入力してください', 'error'); return; }
    pm.saveSnapshot(name);
    document.getElementById('pmSnapshotName').value = '';
    pm.renderSnapshotList();
  });

  // Bulk operations
  document.getElementById('pmBulkDelete').addEventListener('click', pm.bulkDelete);
  document.getElementById('pmBulkStatusTodo').addEventListener('click', function() { pm.bulkStatus('todo'); });
  document.getElementById('pmBulkStatusDoing').addEventListener('click', function() { pm.bulkStatus('doing'); });
  document.getElementById('pmBulkStatusDone').addEventListener('click', function() { pm.bulkStatus('done'); });
  document.getElementById('pmBulkIssue').addEventListener('click', pm.bulkIssue);

  // Confirm modal close
  document.getElementById('pmConfirmClose').addEventListener('click', function() {
    document.getElementById('pmConfirmModal').classList.remove('show');
  });
  document.getElementById('pmConfirmCancel').addEventListener('click', function() {
    document.getElementById('pmConfirmModal').classList.remove('show');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', pm.handleKeyboard);
};

// ---- Snapshot List Render ----
pm.renderSnapshotList = function() {
  var list = document.getElementById('pmSnapshotList');
  if (pm.snapshots.length === 0) {
    list.innerHTML = '<li class="pm-empty" style="padding:15px;font-size:0.85em">保存済みスナップショットはありません</li>';
    return;
  }
  list.innerHTML = '';
  pm.snapshots.slice().reverse().forEach(function(s) {
    var d = new Date(s.date);
    var dateStr = d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' ' +
      String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
    var li = document.createElement('li');
    li.className = 'pm-snapshot-item';
    li.innerHTML = '<div><strong>' + pm.escHtml(s.name) + '</strong><br>' +
      '<span style="font-size:0.8em;color:var(--pm-text-muted)">' + dateStr + ' (' + s.data.length + '件)</span></div>' +
      '<div style="display:flex;gap:4px">' +
        '<button class="pm-btn small pm-snap-restore" data-id="' + s.id + '">復元</button>' +
        '<button class="pm-btn small danger pm-snap-delete" data-id="' + s.id + '">削除</button>' +
      '</div>';
    list.appendChild(li);
  });

  list.addEventListener('click', function(e) {
    var restoreBtn = e.target.closest('.pm-snap-restore');
    if (restoreBtn) {
      pm.confirm('スナップショット復元', '現在のタスクデータが上書きされます。続行しますか？').then(function(ok) {
        if (ok) pm.loadSnapshot(restoreBtn.dataset.id);
      });
      return;
    }
    var deleteBtn = e.target.closest('.pm-snap-delete');
    if (deleteBtn) {
      pm.confirm('スナップショット削除', 'このスナップショットを削除しますか？').then(function(ok) {
        if (ok) {
          pm.deleteSnapshot(deleteBtn.dataset.id);
          pm.renderSnapshotList();
          pm.toast('スナップショットを削除しました', 'success');
        }
      });
    }
  });
};

// ---- Demo Data ----
pm.loadDemoData = function() {
  if (pm.tasks.length > 0) return;
  var tasks = [
    { title: 'プロジェクト計画書作成', description: '要件定義とプロジェクト計画書のドラフト作成', status: 'done', priority: 'high', assignee: '田中', startDate: pm.dateStr(-14), dueDate: pm.dateStr(-7), progress: 100, tags: ['計画','管理'], milestone: 'v1.0', estimatedHours: 8, actualHours: 10, subtasks: [{text:'要件定義', done:true},{text:'WBS作成', done:true}] },
    { title: 'UIデザイン作成', description: 'ワイヤーフレームとモックアップ', status: 'doing', priority: 'high', assignee: '佐藤', startDate: pm.dateStr(-5), dueDate: pm.dateStr(3), progress: 60, tags: ['デザイン','UI'], milestone: 'v1.0', estimatedHours: 16, actualHours: 10, subtasks: [{text:'ワイヤーフレーム', done:true},{text:'モックアップ', done:false},{text:'デザインレビュー', done:false}] },
    { title: 'DB設計', description: 'データベーススキーマの設計', status: 'doing', priority: 'medium', assignee: '田中', startDate: pm.dateStr(-3), dueDate: pm.dateStr(5), progress: 40, tags: ['DB','設計'], milestone: 'v1.0', estimatedHours: 12, actualHours: 5 },
    { title: 'API実装', description: 'REST APIエンドポイントの実装', status: 'todo', priority: 'medium', assignee: '鈴木', startDate: pm.dateStr(2), dueDate: pm.dateStr(10), progress: 0, tags: ['API','開発'], milestone: 'v1.0', estimatedHours: 24, actualHours: 0 },
    { title: 'テスト計画', description: 'テスト戦略とテストケース作成', status: 'todo', priority: 'low', assignee: '高橋', startDate: pm.dateStr(5), dueDate: pm.dateStr(12), progress: 0, tags: ['テスト'], milestone: 'v1.0', estimatedHours: 8, actualHours: 0 },
    { title: 'ドキュメント作成', description: 'ユーザー向けマニュアル作成', status: 'todo', priority: 'low', assignee: '佐藤', startDate: pm.dateStr(8), dueDate: pm.dateStr(18), progress: 0, tags: ['ドキュメント'], milestone: 'v1.1', estimatedHours: 12, actualHours: 0 },
    { title: 'CI/CDパイプライン構築', description: 'GitHub Actionsで自動ビルド・デプロイ設定', status: 'doing', priority: 'high', assignee: '鈴木', startDate: pm.dateStr(-2), dueDate: pm.dateStr(4), progress: 30, tags: ['DevOps','CI/CD'], milestone: 'v1.0', estimatedHours: 10, actualHours: 3 },
    { title: 'セキュリティレビュー', description: 'OWASP Top 10に基づくセキュリティ確認', status: 'todo', priority: 'high', assignee: '', startDate: pm.dateStr(12), dueDate: pm.dateStr(16), progress: 0, tags: ['セキュリティ'], milestone: 'v1.0', estimatedHours: 6, actualHours: 0 }
  ];
  tasks.forEach(function(t) { pm.createTask(t); });

  // Set predecessors
  var ids = pm.tasks.map(function(t) { return t.id; });
  if (ids.length >= 5) {
    pm.updateTask(ids[1], { predecessors: [ids[0]] });
    pm.updateTask(ids[3], { predecessors: [ids[1], ids[2]] });
    pm.updateTask(ids[4], { predecessors: [ids[3]] });
  }
};

// ---- Initialize ----
pm.init = function() {
  pm.loadAll();

  // Apply theme
  var root = document.getElementById('pmRoot');
  root.classList.remove('light', 'dark');
  root.classList.add(pm.settings.theme || 'light');

  // Bind events
  pm.bindEvents();

  // Load demo data if empty
  pm.loadDemoData();

  // Initial render
  pm.updateFilterOptions();
  pm.switchView(pm.settings.view || 'list');
};

// ---- Start ----
$(function() {
  pm.init();
});

})();
</script>
