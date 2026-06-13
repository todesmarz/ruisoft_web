---
layout: default
title: プロジェクト管理 (Qwen 3.7) - Rui Software
---

<style>
/* ============================================
   Project Manager - Qwen 3.7
   ============================================ */

/* CSS Variables */
:root {
  --pm-primary: #2e8b57;
  --pm-primary-hover: #257048;
  --pm-primary-text: #fff;
  --pm-secondary-bg: #fff;
  --pm-secondary-text: #2e8b57;
  --pm-secondary-border: #2e8b57;
  --pm-panel-bg: #f7faf8;
  --pm-panel-border: #dde8e2;
  --pm-panel-border-dark: #aaccbb;
  --pm-hover-bg: #eaf3ee;
  --pm-text: #333;
  --pm-text-muted: #666;
  --pm-border: #ddd;
  --pm-bg: #fff;
  --pm-priority-high: #dc3545;
  --pm-priority-medium: #ffc107;
  --pm-priority-low: #2e8b57;
  --pm-status-todo-bg: #e2e3e5;
  --pm-status-todo-text: #383d41;
  --pm-status-doing-bg: #cce5ff;
  --pm-status-doing-text: #004085;
  --pm-status-done-bg: #d4edda;
  --pm-status-done-text: #155724;
  --pm-danger: #dc3545;
  --pm-danger-hover: #c82333;
  --pm-shadow: rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --pm-primary: #3da86a;
  --pm-primary-hover: #2e8b57;
  --pm-primary-text: #fff;
  --pm-secondary-bg: #2d2d2d;
  --pm-secondary-text: #3da86a;
  --pm-secondary-border: #3da86a;
  --pm-panel-bg: #1e1e1e;
  --pm-panel-border: #444;
  --pm-panel-border-dark: #555;
  --pm-hover-bg: #2a2a2a;
  --pm-text: #e0e0e0;
  --pm-text-muted: #aaa;
  --pm-border: #444;
  --pm-bg: #1a1a1a;
  --pm-status-todo-bg: #3a3a3a;
  --pm-status-todo-text: #ccc;
  --pm-status-doing-bg: #1a3a5c;
  --pm-status-doing-text: #8ab4f8;
  --pm-status-done-bg: #1a3a2a;
  --pm-status-done-text: #81c995;
  --pm-shadow: rgba(0,0,0,0.3);
}

.pm-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: var(--pm-text);
  background: var(--pm-bg);
}

.pm-wrap * {
  box-sizing: border-box;
}

.pm-wrap h2 {
  font-size: 1.4em;
  font-weight: 400;
  border-left: 6px solid var(--pm-primary);
  padding-left: 10px;
  margin-bottom: 16px;
}

/* Controls Bar */
.pm-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
  padding: 10px 12px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
}

.pm-controls .ctrl-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pm-controls .ctrl-sep {
  color: var(--pm-panel-border-dark);
  margin: 0 4px;
}

.pm-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--pm-primary);
  border-radius: 3px;
  background: var(--pm-primary);
  color: var(--pm-primary-text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.pm-btn:hover {
  background: var(--pm-primary-hover);
  border-color: var(--pm-primary-hover);
  text-decoration: none;
  color: var(--pm-primary-text);
}

.pm-btn.secondary {
  background: var(--pm-secondary-bg);
  color: var(--pm-secondary-text);
  border-color: var(--pm-secondary-border);
}

.pm-btn.secondary:hover {
  background: var(--pm-hover-bg);
}

.pm-btn.danger {
  background: var(--pm-danger);
  border-color: var(--pm-danger);
  color: #fff;
}

.pm-btn.danger:hover {
  background: var(--pm-danger-hover);
  border-color: var(--pm-danger-hover);
}

.pm-btn.small {
  padding: 3px 8px;
  font-size: 12px;
}

.pm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tab Group */
.pm-tab-group {
  display: flex;
  gap: 2px;
  background: var(--pm-panel-border);
  padding: 2px;
  border-radius: 4px;
}

.pm-tab {
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: var(--pm-text-muted);
  font-size: 13px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s;
}

.pm-tab:hover {
  background: var(--pm-hover-bg);
  color: var(--pm-text);
}

.pm-tab.active {
  background: var(--pm-primary);
  color: var(--pm-primary-text);
}

/* Filter Inputs */
.pm-filter-input,
.pm-filter-select {
  padding: 5px 8px;
  border: 1px solid var(--pm-border);
  border-radius: 3px;
  font-size: 13px;
  background: var(--pm-bg);
  color: var(--pm-text);
}

.pm-filter-input {
  width: 160px;
}

.pm-filter-input:focus,
.pm-filter-select:focus {
  outline: none;
  border-color: var(--pm-primary);
  box-shadow: 0 0 0 2px rgba(46,139,87,0.2);
}

/* Bulk Action Bar */
.pm-bulk-bar {
  display: none;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: var(--pm-status-doing-bg);
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
}

.pm-bulk-bar.visible {
  display: flex;
}

.pm-bulk-bar .count {
  font-weight: bold;
  color: var(--pm-status-doing-text);
}

/* Settings Panel */
.pm-settings-panel {
  display: none;
  padding: 12px;
  margin-bottom: 16px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
}

.pm-settings-panel.visible {
  display: block;
}

.pm-settings-panel h3 {
  font-size: 14px;
  margin: 0 0 10px;
  color: var(--pm-text);
}

.pm-settings-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.pm-settings-row label {
  min-width: 120px;
  font-size: 13px;
  color: var(--pm-text-muted);
}

.pm-settings-row input {
  flex: 1;
  padding: 5px 8px;
  border: 1px solid var(--pm-border);
  border-radius: 3px;
  font-size: 13px;
  background: var(--pm-bg);
  color: var(--pm-text);
}

/* View Container */
.pm-view-container {
  min-height: 400px;
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
  background: var(--pm-bg);
  overflow: hidden;
}

.pm-view {
  display: none;
  padding: 16px;
}

.pm-view.active {
  display: block;
}

/* List View */
.pm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.pm-table th,
.pm-table td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid var(--pm-border);
}

.pm-table th {
  background: var(--pm-panel-bg);
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.pm-table th:hover {
  background: var(--pm-hover-bg);
}

.pm-table th .sort-icon {
  margin-left: 4px;
  opacity: 0.4;
}

.pm-table th.sorted .sort-icon {
  opacity: 1;
}

.pm-table tr:hover {
  background: var(--pm-hover-bg);
}

.pm-table .cb-cell {
  width: 30px;
  text-align: center;
}

.pm-table .actions-cell {
  width: 80px;
  text-align: center;
}

/* Priority Badge */
.pm-priority {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

.pm-priority.high {
  background: var(--pm-priority-high);
  color: #fff;
}

.pm-priority.medium {
  background: var(--pm-priority-medium);
  color: #333;
}

.pm-priority.low {
  background: var(--pm-priority-low);
  color: #fff;
}

/* Status Badge */
.pm-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

.pm-status.todo {
  background: var(--pm-status-todo-bg);
  color: var(--pm-status-todo-text);
}

.pm-status.doing {
  background: var(--pm-status-doing-bg);
  color: var(--pm-status-doing-text);
}

.pm-status.done {
  background: var(--pm-status-done-bg);
  color: var(--pm-status-done-text);
}

/* Tag */
.pm-tag {
  display: inline-block;
  padding: 1px 6px;
  margin: 1px 2px;
  border-radius: 10px;
  font-size: 10px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-panel-border);
  color: var(--pm-text-muted);
}

/* Progress Bar */
.pm-progress-bar {
  width: 60px;
  height: 8px;
  background: var(--pm-panel-border);
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
}

.pm-progress-fill {
  height: 100%;
  background: var(--pm-primary);
  transition: width 0.3s;
}

.pm-progress-text {
  font-size: 11px;
  margin-left: 4px;
  color: var(--pm-text-muted);
}

/* Gantt Chart */
.pm-gantt-container {
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
}

.pm-gantt {
  display: flex;
  flex-direction: column;
  min-width: 100%;
  position: relative;
}

.pm-gantt-header {
  display: flex;
  border-bottom: 2px solid var(--pm-panel-border);
  background: var(--pm-panel-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.pm-gantt-header-cell {
  min-width: 40px;
  padding: 6px 4px;
  text-align: center;
  font-size: 11px;
  border-right: 1px solid var(--pm-border);
  color: var(--pm-text-muted);
}

.pm-gantt-header-cell.weekend {
  background: var(--pm-hover-bg);
}

.pm-gantt-header-cell.today {
  background: rgba(220,53,69,0.1);
  color: var(--pm-priority-high);
  font-weight: bold;
}

.pm-gantt-row {
  display: flex;
  border-bottom: 1px solid var(--pm-border);
  min-height: 32px;
  position: relative;
}

.pm-gantt-row:hover {
  background: var(--pm-hover-bg);
}

.pm-gantt-cell {
  min-width: 40px;
  border-right: 1px solid var(--pm-border);
  position: relative;
}

.pm-gantt-cell.weekend {
  background: var(--pm-hover-bg);
}

.pm-gantt-bar {
  position: absolute;
  top: 4px;
  height: 24px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-size: 11px;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  z-index: 5;
}

.pm-gantt-bar.high {
  background: var(--pm-priority-high);
}

.pm-gantt-bar.medium {
  background: var(--pm-priority-medium);
  color: #333;
}

.pm-gantt-bar.low {
  background: var(--pm-priority-low);
}

.pm-gantt-milestone {
  position: absolute;
  top: 8px;
  width: 16px;
  height: 16px;
  background: var(--pm-primary);
  transform: rotate(45deg);
  cursor: pointer;
  z-index: 5;
}

.pm-gantt-today-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--pm-priority-high);
  z-index: 8;
  pointer-events: none;
}

.pm-gantt-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 6;
}

.pm-gantt-svg path {
  fill: none;
  stroke: var(--pm-text-muted);
  stroke-width: 1.5;
  marker-end: url(#arrowhead);
}

/* Kanban View */
.pm-kanban {
  display: flex;
  gap: 16px;
  min-height: 400px;
}

.pm-kanban-column {
  flex: 1;
  min-width: 250px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.pm-kanban-header {
  padding: 10px 12px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--pm-panel-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pm-kanban-header .count {
  font-size: 12px;
  font-weight: normal;
  color: var(--pm-text-muted);
  background: var(--pm-bg);
  padding: 2px 8px;
  border-radius: 10px;
}

.pm-kanban-cards {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  min-height: 100px;
}

.pm-kanban-cards.drag-over {
  background: var(--pm-hover-bg);
  border: 2px dashed var(--pm-primary);
}

.pm-kanban-card {
  padding: 10px;
  margin-bottom: 8px;
  background: var(--pm-bg);
  border: 1px solid var(--pm-border);
  border-radius: 4px;
  cursor: grab;
  transition: box-shadow 0.2s;
}

.pm-kanban-card:hover {
  box-shadow: 0 2px 8px var(--pm-shadow);
}

.pm-kanban-card.dragging {
  opacity: 0.5;
}

.pm-kanban-card .card-title {
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 13px;
}

.pm-kanban-card .card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 11px;
  color: var(--pm-text-muted);
}

/* Calendar View */
.pm-calendar {
  width: 100%;
}

.pm-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pm-calendar-header h3 {
  margin: 0;
  font-size: 18px;
}

.pm-calendar-nav {
  display: flex;
  gap: 8px;
}

.pm-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--pm-border);
  border: 1px solid var(--pm-border);
  border-radius: 4px;
  overflow: hidden;
}

.pm-calendar-day-header {
  padding: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  background: var(--pm-panel-bg);
  color: var(--pm-text-muted);
}

.pm-calendar-day {
  min-height: 80px;
  padding: 4px;
  background: var(--pm-bg);
  position: relative;
}

.pm-calendar-day.other-month {
  background: var(--pm-panel-bg);
  opacity: 0.5;
}

.pm-calendar-day.today {
  background: rgba(46,139,87,0.05);
}

.pm-calendar-day .day-number {
  font-size: 12px;
  color: var(--pm-text-muted);
  margin-bottom: 4px;
}

.pm-calendar-day.today .day-number {
  color: var(--pm-primary);
  font-weight: bold;
}

.pm-calendar-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.pm-calendar-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
}

.pm-calendar-dot.high {
  background: var(--pm-priority-high);
}

.pm-calendar-dot.medium {
  background: var(--pm-priority-medium);
}

.pm-calendar-dot.low {
  background: var(--pm-priority-low);
}

/* Modal */
.pm-modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}

.pm-modal-overlay.visible {
  display: flex;
}

.pm-modal {
  background: var(--pm-bg);
  border-radius: 6px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px var(--pm-shadow);
}

.pm-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--pm-border);
}

.pm-modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.pm-modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--pm-text-muted);
  padding: 0;
  line-height: 1;
}

.pm-modal-close:hover {
  color: var(--pm-text);
}

.pm-modal-body {
  padding: 20px;
}

.pm-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid var(--pm-border);
}

/* Form */
.pm-form-group {
  margin-bottom: 14px;
}

.pm-form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--pm-text);
}

.pm-form-group label .required {
  color: var(--pm-danger);
  margin-left: 2px;
}

.pm-form-control {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--pm-border);
  border-radius: 4px;
  font-size: 13px;
  background: var(--pm-bg);
  color: var(--pm-text);
}

.pm-form-control:focus {
  outline: none;
  border-color: var(--pm-primary);
  box-shadow: 0 0 0 2px rgba(46,139,87,0.2);
}

textarea.pm-form-control {
  min-height: 80px;
  resize: vertical;
}

.pm-form-row {
  display: flex;
  gap: 12px;
}

.pm-form-row .pm-form-group {
  flex: 1;
}

.pm-form-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pm-form-range input[type="range"] {
  flex: 1;
}

.pm-form-range .range-value {
  min-width: 40px;
  text-align: right;
  font-weight: 500;
}

/* Subtasks */
.pm-subtasks {
  border: 1px solid var(--pm-border);
  border-radius: 4px;
  padding: 8px;
}

.pm-subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.pm-subtask-item input[type="checkbox"] {
  margin: 0;
}

.pm-subtask-item input[type="text"] {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid var(--pm-border);
  border-radius: 3px;
  font-size: 13px;
  background: var(--pm-bg);
  color: var(--pm-text);
}

.pm-subtask-item .remove-btn {
  background: none;
  border: none;
  color: var(--pm-danger);
  cursor: pointer;
  font-size: 16px;
  padding: 0 4px;
}

.pm-subtask-add {
  margin-top: 8px;
}

/* Activity Log */
.pm-activity-log {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid var(--pm-border);
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
}

.pm-activity-item {
  padding: 4px 0;
  border-bottom: 1px solid var(--pm-border);
  color: var(--pm-text-muted);
}

.pm-activity-item:last-child {
  border-bottom: none;
}

.pm-activity-item .time {
  color: var(--pm-text-muted);
  margin-right: 8px;
}

/* Snapshot List */
.pm-snapshot-list {
  max-height: 300px;
  overflow-y: auto;
}

.pm-snapshot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--pm-border);
  border-radius: 4px;
  margin-bottom: 8px;
}

.pm-snapshot-item .name {
  font-weight: 500;
}

.pm-snapshot-item .date {
  font-size: 12px;
  color: var(--pm-text-muted);
}

.pm-snapshot-item .actions {
  display: flex;
  gap: 6px;
}

/* Empty State */
.pm-empty {
  text-align: center;
  padding: 40px;
  color: var(--pm-text-muted);
}

.pm-empty .icon {
  font-size: 48px;
  margin-bottom: 10px;
  opacity: 0.3;
}

/* Responsive */
@media (max-width: 768px) {
  .pm-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pm-controls .ctrl-group {
    flex-wrap: wrap;
  }
  
  .pm-kanban {
    flex-direction: column;
  }
  
  .pm-form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>

<div class="pm-wrap" id="pmApp">
  <h2>プロジェクト管理 <small style="font-size:0.7em;color:var(--pm-text-muted);">(Qwen 3.7)</small></h2>
  
  <!-- Controls Bar -->
  <div class="pm-controls">
    <div class="ctrl-group">
      <button class="pm-btn" id="btnNewTask">＋ 新規</button>
    </div>
    
    <div class="ctrl-sep">|</div>
    
    <div class="ctrl-group">
      <div class="pm-tab-group">
        <button class="pm-tab active" data-view="list">リスト</button>
        <button class="pm-tab" data-view="gantt">ガント</button>
        <button class="pm-tab" data-view="kanban">看板</button>
        <button class="pm-tab" data-view="calendar">カレンダー</button>
      </div>
    </div>
    
    <div class="ctrl-sep">|</div>
    
    <div class="ctrl-group">
      <input type="text" class="pm-filter-input" id="filterSearch" placeholder="検索...">
      <select class="pm-filter-select" id="filterStatus">
        <option value="">ステータス</option>
        <option value="todo">ToDo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <select class="pm-filter-select" id="filterPriority">
        <option value="">優先度</option>
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <input type="text" class="pm-filter-input" id="filterAssignee" placeholder="担当者">
      <input type="text" class="pm-filter-input" id="filterMilestone" placeholder="マイルストーン">
    </div>
    
    <div class="ctrl-sep">|</div>
    
    <div class="ctrl-group">
      <button class="pm-btn secondary" id="btnExportJson">JSON出力</button>
      <button class="pm-btn secondary" id="btnExportCsv">CSV出力</button>
      <button class="pm-btn secondary" id="btnImport">読込</button>
      <button class="pm-btn secondary" id="btnSettings">⚙️ 設定</button>
      <button class="pm-btn secondary" id="btnSnapshots">📸</button>
      <button class="pm-btn secondary" id="btnTheme">🌓</button>
    </div>
  </div>
  
  <!-- Bulk Action Bar -->
  <div class="pm-bulk-bar" id="bulkBar">
    <span class="count" id="bulkCount">0件選択</span>
    <button class="pm-btn small" id="bulkStatus">ステータス変更</button>
    <button class="pm-btn small danger" id="bulkDelete">一括削除</button>
    <button class="pm-btn small secondary" id="bulkGithub">GitHub Issue化</button>
  </div>
  
  <!-- Settings Panel -->
  <div class="pm-settings-panel" id="settingsPanel">
    <h3>GitHub設定</h3>
    <div class="pm-settings-row">
      <label>PAT (Personal Access Token)</label>
      <input type="password" id="githubToken" placeholder="ghp_...">
    </div>
    <div class="pm-settings-row">
      <label>リポジトリ (owner/repo)</label>
      <input type="text" id="githubRepo" placeholder="username/repo">
    </div>
    <button class="pm-btn small" id="btnSaveGithub">保存</button>
  </div>
  
  <!-- View Container -->
  <div class="pm-view-container">
    <!-- List View -->
    <div class="pm-view active" id="viewList">
      <table class="pm-table" id="taskTable">
        <thead>
          <tr>
            <th class="cb-cell"><input type="checkbox" id="selectAll"></th>
            <th data-sort="title">タイトル <span class="sort-icon">↕</span></th>
            <th data-sort="status">ステータス <span class="sort-icon">↕</span></th>
            <th data-sort="priority">優先度 <span class="sort-icon">↕</span></th>
            <th data-sort="assignee">担当者 <span class="sort-icon">↕</span></th>
            <th data-sort="dueDate">締切 <span class="sort-icon">↕</span></th>
            <th data-sort="progress">進捗 <span class="sort-icon">↕</span></th>
            <th data-sort="milestone">マイルストーン <span class="sort-icon">↕</span></th>
            <th>タグ</th>
            <th class="actions-cell">操作</th>
          </tr>
        </thead>
        <tbody id="taskTableBody"></tbody>
      </table>
      <div class="pm-empty" id="listEmpty" style="display:none;">
        <div class="icon">📋</div>
        <div>タスクがありません</div>
      </div>
    </div>
    
    <!-- Gantt View -->
    <div class="pm-view" id="viewGantt">
      <div class="pm-gantt-container" id="ganttContainer">
        <div class="pm-gantt" id="ganttChart"></div>
      </div>
      <div class="pm-empty" id="ganttEmpty" style="display:none;">
        <div class="icon">📊</div>
        <div>日付が設定されたタスクがありません</div>
      </div>
    </div>
    
    <!-- Kanban View -->
    <div class="pm-view" id="viewKanban">
      <div class="pm-kanban" id="kanbanBoard">
        <div class="pm-kanban-column" data-status="todo">
          <div class="pm-kanban-header">
            <span>ToDo</span>
            <span class="count" id="kanbanCountTodo">0</span>
          </div>
          <div class="pm-kanban-cards" id="kanbanTodo"></div>
        </div>
        <div class="pm-kanban-column" data-status="doing">
          <div class="pm-kanban-header">
            <span>Doing</span>
            <span class="count" id="kanbanCountDoing">0</span>
          </div>
          <div class="pm-kanban-cards" id="kanbanDoing"></div>
        </div>
        <div class="pm-kanban-column" data-status="done">
          <div class="pm-kanban-header">
            <span>Done</span>
            <span class="count" id="kanbanCountDone">0</span>
          </div>
          <div class="pm-kanban-cards" id="kanbanDone"></div>
        </div>
      </div>
    </div>
    
    <!-- Calendar View -->
    <div class="pm-view" id="viewCalendar">
      <div class="pm-calendar">
        <div class="pm-calendar-header">
          <div class="pm-calendar-nav">
            <button class="pm-btn small secondary" id="calPrev">◀</button>
          </div>
          <h3 id="calTitle">2026年6月</h3>
          <div class="pm-calendar-nav">
            <button class="pm-btn small secondary" id="calToday">今日</button>
            <button class="pm-btn small secondary" id="calNext">▶</button>
          </div>
        </div>
        <div class="pm-calendar-grid" id="calendarGrid"></div>
      </div>
    </div>
  </div>
</div>

<!-- Task Modal -->
<div class="pm-modal-overlay" id="taskModal">
  <div class="pm-modal">
    <div class="pm-modal-header">
      <h3 id="taskModalTitle">新規タスク</h3>
      <button class="pm-modal-close" data-close="taskModal">&times;</button>
    </div>
    <div class="pm-modal-body">
      <input type="hidden" id="taskId">
      
      <div class="pm-form-group">
        <label>タイトル <span class="required">*</span></label>
        <input type="text" class="pm-form-control" id="taskTitle" required>
      </div>
      
      <div class="pm-form-group">
        <label>詳細</label>
        <textarea class="pm-form-control" id="taskDescription"></textarea>
      </div>
      
      <div class="pm-form-row">
        <div class="pm-form-group">
          <label>ステータス</label>
          <select class="pm-form-control" id="taskStatus">
            <option value="todo">ToDo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="pm-form-group">
          <label>優先度</label>
          <select class="pm-form-control" id="taskPriority">
            <option value="medium">中</option>
            <option value="high">高</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>
      
      <div class="pm-form-row">
        <div class="pm-form-group">
          <label>担当者</label>
          <input type="text" class="pm-form-control" id="taskAssignee">
        </div>
        <div class="pm-form-group">
          <label>マイルストーン</label>
          <input type="text" class="pm-form-control" id="taskMilestone">
        </div>
      </div>
      
      <div class="pm-form-row">
        <div class="pm-form-group">
          <label>開始日</label>
          <input type="date" class="pm-form-control" id="taskStartDate">
        </div>
        <div class="pm-form-group">
          <label>締切日</label>
          <input type="date" class="pm-form-control" id="taskDueDate">
        </div>
      </div>
      
      <div class="pm-form-row">
        <div class="pm-form-group">
          <label>予定工数 (h)</label>
          <input type="number" class="pm-form-control" id="taskEstimatedHours" step="0.5" min="0">
        </div>
        <div class="pm-form-group">
          <label>実績工数 (h)</label>
          <input type="number" class="pm-form-control" id="taskActualHours" step="0.5" min="0">
        </div>
      </div>
      
      <div class="pm-form-group">
        <label>進捗率</label>
        <div class="pm-form-range">
          <input type="range" id="taskProgress" min="0" max="100" value="0">
          <span class="range-value" id="taskProgressValue">0%</span>
        </div>
      </div>
      
      <div class="pm-form-group">
        <label>タグ (カンマ区切り)</label>
        <input type="text" class="pm-form-control" id="taskTags" placeholder="tag1, tag2, tag3">
      </div>
      
      <div class="pm-form-group">
        <label>サブタスク</label>
        <div class="pm-subtasks" id="taskSubtasks"></div>
        <button class="pm-btn small secondary pm-subtask-add" id="btnAddSubtask">＋ サブタスク追加</button>
      </div>
      
      <div class="pm-form-group">
        <label>依存タスク</label>
        <select class="pm-form-control" id="taskPredecessors" multiple size="4"></select>
      </div>
      
      <div class="pm-form-group" id="githubIssueGroup" style="display:none;">
        <label>GitHub Issue</label>
        <input type="text" class="pm-form-control" id="taskGithubIssueUrl" readonly>
      </div>
      
      <div class="pm-form-group" id="activityGroup" style="display:none;">
        <label>アクティビティ履歴</label>
        <div class="pm-activity-log" id="taskActivityLog"></div>
      </div>
    </div>
    <div class="pm-modal-footer">
      <button class="pm-btn secondary" data-close="taskModal">キャンセル</button>
      <button class="pm-btn" id="btnSaveTask">保存</button>
    </div>
  </div>
</div>

<!-- Import Modal -->
<div class="pm-modal-overlay" id="importModal">
  <div class="pm-modal">
    <div class="pm-modal-header">
      <h3>データ読込</h3>
      <button class="pm-modal-close" data-close="importModal">&times;</button>
    </div>
    <div class="pm-modal-body">
      <div class="pm-form-group">
        <label>ファイル選択 (JSON / CSV)</label>
        <input type="file" class="pm-form-control" id="importFile" accept=".json,.csv">
      </div>
      <div id="importPreview"></div>
    </div>
    <div class="pm-modal-footer">
      <button class="pm-btn secondary" data-close="importModal">キャンセル</button>
      <button class="pm-btn" id="btnDoImport" disabled>読込実行</button>
    </div>
  </div>
</div>

<!-- Snapshot Modal -->
<div class="pm-modal-overlay" id="snapshotModal">
  <div class="pm-modal">
    <div class="pm-modal-header">
      <h3>スナップショット</h3>
      <button class="pm-modal-close" data-close="snapshotModal">&times;</button>
    </div>
    <div class="pm-modal-body">
      <div class="pm-form-group">
        <label>新規スナップショット名</label>
        <div style="display:flex;gap:8px;">
          <input type="text" class="pm-form-control" id="snapshotName" placeholder="スナップショット名">
          <button class="pm-btn" id="btnSaveSnapshot">保存</button>
        </div>
      </div>
      <h4>保存済みスナップショット</h4>
      <div class="pm-snapshot-list" id="snapshotList"></div>
    </div>
  </div>
</div>

<!-- Confirm Modal -->
<div class="pm-modal-overlay" id="confirmModal">
  <div class="pm-modal" style="max-width:400px;">
    <div class="pm-modal-header">
      <h3 id="confirmTitle">確認</h3>
    </div>
    <div class="pm-modal-body">
      <p id="confirmMessage"></p>
    </div>
    <div class="pm-modal-footer">
      <button class="pm-btn secondary" data-close="confirmModal">キャンセル</button>
      <button class="pm-btn danger" id="btnConfirmOk">OK</button>
    </div>
  </div>
</div>

<!-- SVG Defs for Gantt arrows -->
<svg style="position:absolute;width:0;height:0;">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="var(--pm-text-muted)"/>
    </marker>
  </defs>
</svg>

<script>
(function() {
  'use strict';
  
  // ============================================
  // PM Namespace
  // ============================================
  const PM = window.PM = {};
  
  // ============================================
  // PM.Data - Data Layer
  // ============================================
  PM.Data = {
    STORAGE_KEYS: {
      tasks: 'rui-pm-tasks',
      settings: 'rui-pm-settings',
      github: 'rui-pm-github',
      snapshots: 'rui-pm-snapshots',
      activity: 'rui-pm-activity'
    },
    
    generateId: function() {
      if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    
    load: function(key) {
      try {
        const data = localStorage.getItem(this.STORAGE_KEYS[key]);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
        return null;
      }
    },
    
    save: function(key, data) {
      try {
        localStorage.setItem(this.STORAGE_KEYS[key], JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    },
    
    loadTasks: function() {
      return this.load('tasks') || [];
    },
    
    saveTasks: function(tasks) {
      this.save('tasks', tasks);
    },
    
    loadSettings: function() {
      return this.load('settings') || { view: 'list', theme: 'light' };
    },
    
    saveSettings: function(settings) {
      this.save('settings', settings);
    },
    
    loadGithub: function() {
      return this.load('github') || { token: '', repo: '' };
    },
    
    saveGithub: function(github) {
      this.save('github', github);
    },
    
    loadSnapshots: function() {
      return this.load('snapshots') || [];
    },
    
    saveSnapshots: function(snapshots) {
      this.save('snapshots', snapshots);
    },
    
    loadActivity: function() {
      return this.load('activity') || [];
    },
    
    saveActivity: function(activity) {
      this.save('activity', activity);
    },
    
    addActivity: function(taskId, action, details) {
      const activity = this.loadActivity();
      activity.unshift({
        id: this.generateId(),
        taskId: taskId,
        action: action,
        details: details,
        timestamp: new Date().toISOString()
      });
      if (activity.length > 1000) activity.length = 1000;
      this.saveActivity(activity);
    },
    
    getActivityForTask: function(taskId) {
      return this.loadActivity().filter(a => a.taskId === taskId);
    }
  };
  
  // ============================================
  // PM.Utils - Utilities
  // ============================================
  PM.Utils = {
    formatDate: function(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.getFullYear() + '-' + 
             String(d.getMonth() + 1).padStart(2, '0') + '-' + 
             String(d.getDate()).padStart(2, '0');
    },
    
    formatDateTime: function(isoStr) {
      if (!isoStr) return '';
      const d = new Date(isoStr);
      return d.toLocaleString('ja-JP');
    },
    
    parseDate: function(str) {
      if (!str) return null;
      // YYYY-MM-DD形式をローカルタイムでパース（UTCずれ防止）
      const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
        return isNaN(d.getTime()) ? null : d;
      }
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    },
    
    daysBetween: function(start, end) {
      const s = this.parseDate(start);
      const e = this.parseDate(end);
      if (!s || !e) return 0;
      return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    },
    
    addDays: function(dateStr, days) {
      const d = this.parseDate(dateStr);
      if (!d) return null;
      d.setDate(d.getDate() + days);
      return this.formatDate(d.toISOString());
    },
    
    isWeekend: function(dateStr) {
      const d = this.parseDate(dateStr);
      if (!d) return false;
      const day = d.getDay();
      return day === 0 || day === 6;
    },
    
    isToday: function(dateStr) {
      const today = new Date();
      const todayStr = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0');
      return this.formatDate(dateStr) === todayStr;
    },
    
    escapeHtml: function(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },
    
    detectCycle: function(tasks, taskId, predecessors) {
      const visited = new Set();
      const stack = new Set();
      
      const dfs = (id) => {
        if (id === taskId) return true;
        if (visited.has(id)) return false;
        visited.add(id);
        stack.add(id);
        
        const task = tasks.find(t => t.id === id);
        if (task && task.predecessors) {
          for (const pred of task.predecessors) {
            if (stack.has(pred)) return true;
            if (dfs(pred)) return true;
          }
        }
        
        stack.delete(id);
        return false;
      };
      
      for (const pred of predecessors) {
        visited.clear();
        stack.clear();
        if (dfs(pred)) return true;
      }
      
      return false;
    }
  };
  
  // ============================================
  // PM.State - Application State
  // ============================================
  PM.State = {
    tasks: [],
    settings: {},
    currentView: 'list',
    filters: {
      search: '',
      status: '',
      priority: '',
      assignee: '',
      milestone: ''
    },
    sort: {
      field: 'dueDate',
      direction: 'asc'
    },
    selectedIds: new Set(),
    calendarDate: new Date(),
    editingTaskId: null
  };
  
  // ============================================
  // PM.Filter - Filtering Logic
  // ============================================
  PM.Filter = {
    apply: function(tasks) {
      const f = PM.State.filters;
      return tasks.filter(task => {
        if (f.search) {
          const s = f.search.toLowerCase();
          const searchable = [
            task.title,
            task.description,
            task.assignee,
            task.milestone,
            (task.tags || []).join(' ')
          ].join(' ').toLowerCase();
          if (!searchable.includes(s)) return false;
        }
        if (f.status && task.status !== f.status) return false;
        if (f.priority && task.priority !== f.priority) return false;
        if (f.assignee && !task.assignee.toLowerCase().includes(f.assignee.toLowerCase())) return false;
        if (f.milestone && !task.milestone.toLowerCase().includes(f.milestone.toLowerCase())) return false;
        return true;
      });
    },
    
    sort: function(tasks) {
      const { field, direction } = PM.State.sort;
      return [...tasks].sort((a, b) => {
        let va = a[field] || '';
        let vb = b[field] || '';
        
        if (field === 'priority') {
          const order = { high: 0, medium: 1, low: 2 };
          va = order[va] ?? 1;
          vb = order[vb] ?? 1;
        } else if (field === 'progress' || field === 'estimatedHours' || field === 'actualHours') {
          va = Number(va) || 0;
          vb = Number(vb) || 0;
        } else {
          va = String(va).toLowerCase();
          vb = String(vb).toLowerCase();
        }
        
        if (va < vb) return direction === 'asc' ? -1 : 1;
        if (va > vb) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  };
  
  // ============================================
  // PM.UI - UI Helpers
  // ============================================
  PM.UI = {
    showModal: function(id) {
      document.getElementById(id).classList.add('visible');
    },
    
    hideModal: function(id) {
      document.getElementById(id).classList.remove('visible');
    },
    
    confirm: function(title, message) {
      return new Promise((resolve) => {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        this.showModal('confirmModal');
        
        const btn = document.getElementById('btnConfirmOk');
        const handler = () => {
          this.hideModal('confirmModal');
          btn.removeEventListener('click', handler);
          resolve(true);
        };
        btn.addEventListener('click', handler);
        
        const overlay = document.getElementById('confirmModal');
        const closeHandler = (e) => {
          if (e.target === overlay || e.target.hasAttribute('data-close')) {
            btn.removeEventListener('click', handler);
            overlay.removeEventListener('click', closeHandler);
            resolve(false);
          }
        };
        overlay.addEventListener('click', closeHandler);
      });
    },
    
    updateBulkBar: function() {
      const bar = document.getElementById('bulkBar');
      const count = PM.State.selectedIds.size;
      if (count > 0) {
        bar.classList.add('visible');
        document.getElementById('bulkCount').textContent = count + '件選択';
      } else {
        bar.classList.remove('visible');
      }
    },
    
    switchView: function(view) {
      PM.State.currentView = view;
      document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`.pm-tab[data-view="${view}"]`).classList.add('active');
      
      document.querySelectorAll('.pm-view').forEach(v => v.classList.remove('active'));
      document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1)).classList.add('active');
      
      PM.Data.saveSettings({ ...PM.State.settings, view: view });
      PM.Views.render();
    }
  };
  
  // ============================================
  // PM.Views - View Renderers
  // ============================================
  PM.Views = {
    render: function() {
      const view = PM.State.currentView;
      if (view === 'list') this.renderList();
      else if (view === 'gantt') this.renderGantt();
      else if (view === 'kanban') this.renderKanban();
      else if (view === 'calendar') this.renderCalendar();
    },
    
    renderList: function() {
      const tasks = PM.Filter.sort(PM.Filter.apply(PM.State.tasks));
      const tbody = document.getElementById('taskTableBody');
      const empty = document.getElementById('listEmpty');
      
      if (tasks.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      
      empty.style.display = 'none';
      tbody.innerHTML = tasks.map(task => {
        const checked = PM.State.selectedIds.has(task.id) ? 'checked' : '';
        const tags = (task.tags || []).map(t => `<span class="pm-tag">${PM.Utils.escapeHtml(t)}</span>`).join('');
        const progress = task.progress || 0;
        
        return `
          <tr data-id="${task.id}">
            <td class="cb-cell"><input type="checkbox" class="task-cb" data-id="${task.id}" ${checked}></td>
            <td><strong>${PM.Utils.escapeHtml(task.title)}</strong></td>
            <td><span class="pm-status ${task.status}">${task.status.toUpperCase()}</span></td>
            <td><span class="pm-priority ${task.priority}">${task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}</span></td>
            <td>${PM.Utils.escapeHtml(task.assignee || '')}</td>
            <td>${task.dueDate || ''}</td>
            <td>
              <div class="pm-progress-bar"><div class="pm-progress-fill" style="width:${progress}%"></div></div>
              <span class="pm-progress-text">${progress}%</span>
            </td>
            <td>${PM.Utils.escapeHtml(task.milestone || '')}</td>
            <td>${tags}</td>
            <td class="actions-cell">
              <button class="pm-btn small secondary btn-edit" data-id="${task.id}">編集</button>
              <button class="pm-btn small danger btn-delete" data-id="${task.id}">✕</button>
            </td>
          </tr>
        `;
      }).join('');
      
      tbody.querySelectorAll('.task-cb').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const id = e.target.dataset.id;
          if (e.target.checked) {
            PM.State.selectedIds.add(id);
          } else {
            PM.State.selectedIds.delete(id);
          }
          PM.UI.updateBulkBar();
        });
      });
      
      tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
          PM.Task.edit(e.target.dataset.id);
        });
      });
      
      tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          PM.Task.delete(e.target.dataset.id);
        });
      });
    },
    
    renderGantt: function() {
      const tasks = PM.Filter.apply(PM.State.tasks).filter(t => t.startDate && t.dueDate);
      const container = document.getElementById('ganttContainer');
      const chart = document.getElementById('ganttChart');
      const empty = document.getElementById('ganttEmpty');
      
      if (tasks.length === 0) {
        chart.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      
      empty.style.display = 'none';
      
      let minDate = null, maxDate = null;
      tasks.forEach(t => {
        const s = PM.Utils.parseDate(t.startDate);
        const e = PM.Utils.parseDate(t.dueDate);
        if (!minDate || s < minDate) minDate = s;
        if (!maxDate || e > maxDate) maxDate = e;
      });
      
      minDate.setDate(minDate.getDate() - 7);
      maxDate.setDate(maxDate.getDate() + 7);
      
      const days = [];
      const d = new Date(minDate);
      while (d <= maxDate) {
        days.push(new Date(d));
        d.setDate(d.getDate() + 1);
      }
      
      const cellWidth = 40;
      // 月表示ヘッダー
      const monthHeaders = [];
      let currentMonth = null;
      let monthStart = 0;
      days.forEach((day, i) => {
        const month = day.getMonth();
        if (currentMonth === null) {
          currentMonth = month;
          monthStart = i;
        } else if (month !== currentMonth) {
          const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
          const span = i - monthStart;
          monthHeaders.push({ name: monthNames[currentMonth], span: span });
          currentMonth = month;
          monthStart = i;
        }
      });
      // 最後の月
      if (currentMonth !== null) {
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        const span = days.length - monthStart;
        monthHeaders.push({ name: monthNames[currentMonth], span: span });
      }
      
      const monthHeaderHtml = monthHeaders.map(m => 
        `<div class="pm-gantt-header-cell" style="width:${m.span * cellWidth}px;min-width:${m.span * cellWidth}px;font-weight:bold;">${m.name}</div>`
      ).join('');
      
      const dayHeaderHtml = days.map(day => {
        const dateStr = day.getFullYear() + '-' + 
                        String(day.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(day.getDate()).padStart(2, '0');
        const isWeekend = PM.Utils.isWeekend(dateStr);
        const isToday = PM.Utils.isToday(dateStr);
        const cls = isWeekend ? 'weekend' : (isToday ? 'today' : '');
        return `<div class="pm-gantt-header-cell ${cls}" style="width:${cellWidth}px;min-width:${cellWidth}px;">${day.getDate()}</div>`;
      }).join('');
      
      const rowsHtml = tasks.map(task => {
        const cells = days.map(day => {
          const dateStr = day.getFullYear() + '-' + 
                          String(day.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(day.getDate()).padStart(2, '0');
          const isWeekend = PM.Utils.isWeekend(dateStr);
          return `<div class="pm-gantt-cell ${isWeekend ? 'weekend' : ''}" style="width:${cellWidth}px;min-width:${cellWidth}px;"></div>`;
        }).join('');
        
        const startDay = Math.floor((PM.Utils.parseDate(task.startDate) - minDate) / (1000 * 60 * 60 * 24));
        const endDay = Math.floor((PM.Utils.parseDate(task.dueDate) - minDate) / (1000 * 60 * 60 * 24));
        const left = startDay * cellWidth;
        const width = (endDay - startDay + 1) * cellWidth;
        
        const barHtml = task.milestone 
          ? `<div class="pm-gantt-milestone" style="left:${left + width/2 - 8}px;" data-id="${task.id}" title="${PM.Utils.escapeHtml(task.title)}"></div>`
          : `<div class="pm-gantt-bar ${task.priority}" style="left:${left}px;width:${width}px;" data-id="${task.id}" title="${PM.Utils.escapeHtml(task.title)}">${PM.Utils.escapeHtml(task.title)}</div>`;
        
        return `<div class="pm-gantt-row">${cells}${barHtml}</div>`;
      }).join('');
      
      const todayIndex = days.findIndex(d => PM.Utils.isToday(d.toISOString()));
      const todayLine = todayIndex >= 0 
        ? `<div class="pm-gantt-today-line" style="left:${todayIndex * cellWidth + cellWidth/2}px;"></div>`
        : '';
      
      const svgHeight = tasks.length * 32;
      chart.innerHTML = `
        <div class="pm-gantt-header" style="flex-direction:column;">
          <div style="display:flex;">${monthHeaderHtml}</div>
          <div style="display:flex;">${dayHeaderHtml}</div>
        </div>
        <div style="position:relative;">
          ${rowsHtml}
          ${todayLine}
          <svg class="pm-gantt-svg" id="ganttSvg" style="height:${svgHeight}px;"></svg>
        </div>
      `;
      
      this.renderGanttArrows(tasks, days, minDate, cellWidth);
      
      chart.querySelectorAll('.pm-gantt-bar, .pm-gantt-milestone').forEach(el => {
        el.addEventListener('click', () => PM.Task.edit(el.dataset.id));
      });
    },
    
    renderGanttArrows: function(tasks, days, minDate, cellWidth) {
      const svg = document.getElementById('ganttSvg');
      if (!svg) return;
      
      const taskPositions = {};
      tasks.forEach((task, i) => {
        const startDay = Math.floor((PM.Utils.parseDate(task.startDate) - minDate) / (1000 * 60 * 60 * 24));
        const endDay = Math.floor((PM.Utils.parseDate(task.dueDate) - minDate) / (1000 * 60 * 60 * 24));
        taskPositions[task.id] = {
          row: i,
          startX: startDay * cellWidth,
          endX: (endDay + 1) * cellWidth,
          y: i * 32 + 16
        };
      });
      
      let paths = '';
      tasks.forEach(task => {
        if (task.predecessors && task.predecessors.length > 0) {
          task.predecessors.forEach(predId => {
            const from = taskPositions[predId];
            const to = taskPositions[task.id];
            if (from && to) {
              const x1 = from.endX;
              const y1 = from.y;
              const x2 = to.startX;
              const y2 = to.y;
              paths += `<path d="M${x1},${y1} C${x1+20},${y1} ${x2-20},${y2} ${x2},${y2}"/>`;
            }
          });
        }
      });
      
      svg.innerHTML = paths;
    },
    
    renderKanban: function() {
      const tasks = PM.Filter.apply(PM.State.tasks);
      const columns = { todo: [], doing: [], done: [] };
      
      tasks.forEach(task => {
        if (columns[task.status]) {
          columns[task.status].push(task);
        }
      });
      
      ['todo', 'doing', 'done'].forEach(status => {
        const container = document.getElementById('kanban' + status.charAt(0).toUpperCase() + status.slice(1));
        const countEl = document.getElementById('kanbanCount' + status.charAt(0).toUpperCase() + status.slice(1));
        
        countEl.textContent = columns[status].length;
        
        container.innerHTML = columns[status].map(task => {
          const tags = (task.tags || []).map(t => `<span class="pm-tag">${PM.Utils.escapeHtml(t)}</span>`).join('');
          return `
            <div class="pm-kanban-card" draggable="true" data-id="${task.id}">
              <div class="card-title">${PM.Utils.escapeHtml(task.title)}</div>
              <div class="card-meta">
                <span class="pm-priority ${task.priority}">${task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}</span>
                ${task.assignee ? `<span>${PM.Utils.escapeHtml(task.assignee)}</span>` : ''}
                ${task.dueDate ? `<span>${task.dueDate}</span>` : ''}
                ${tags}
              </div>
            </div>
          `;
        }).join('');
        
        container.querySelectorAll('.pm-kanban-card').forEach(card => {
          card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', card.dataset.id);
            card.classList.add('dragging');
          });
          
          card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
          });
          
          card.addEventListener('click', () => {
            PM.Task.edit(card.dataset.id);
          });
        });
      });
      
      document.querySelectorAll('.pm-kanban-cards').forEach(col => {
        col.addEventListener('dragover', (e) => {
          e.preventDefault();
          col.classList.add('drag-over');
        });
        
        col.addEventListener('dragleave', () => {
          col.classList.remove('drag-over');
        });
        
        col.addEventListener('drop', (e) => {
          e.preventDefault();
          col.classList.remove('drag-over');
          
          const taskId = e.dataTransfer.getData('text/plain');
          const newStatus = col.closest('.pm-kanban-column').dataset.status;
          
          PM.Task.updateStatus(taskId, newStatus);
        });
      });
    },
    
    renderCalendar: function() {
      const date = PM.State.calendarDate;
      const year = date.getFullYear();
      const month = date.getMonth();
      
      document.getElementById('calTitle').textContent = `${year}年${month + 1}月`;
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDay = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      
      const prevMonthDays = new Date(year, month, 0).getDate();
      
      const grid = document.getElementById('calendarGrid');
      const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
      
      let html = dayNames.map(d => `<div class="pm-calendar-day-header">${d}</div>`).join('');
      
      const tasks = PM.Filter.apply(PM.State.tasks);
      
      for (let i = 0; i < startDay; i++) {
        const day = prevMonthDays - startDay + 1 + i;
        html += `<div class="pm-calendar-day other-month"><div class="day-number">${day}</div></div>`;
      }
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = PM.Utils.isToday(dateStr);
        
        const dayTasks = tasks.filter(t => {
          if (!t.startDate || !t.dueDate) return false;
          const start = PM.Utils.parseDate(t.startDate);
          const end = PM.Utils.parseDate(t.dueDate);
          const current = PM.Utils.parseDate(dateStr);
          return current >= start && current <= end;
        });
        
        const dots = dayTasks.map(t => 
          `<div class="pm-calendar-dot ${t.priority}" data-id="${t.id}" title="${PM.Utils.escapeHtml(t.title)}"></div>`
        ).join('');
        
        html += `
          <div class="pm-calendar-day ${isToday ? 'today' : ''}">
            <div class="day-number">${day}</div>
            <div class="pm-calendar-dots">${dots}</div>
          </div>
        `;
      }
      
      const totalCells = startDay + daysInMonth;
      const remaining = 7 - (totalCells % 7);
      if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
          html += `<div class="pm-calendar-day other-month"><div class="day-number">${i}</div></div>`;
        }
      }
      
      grid.innerHTML = html;
      
      grid.querySelectorAll('.pm-calendar-dot').forEach(dot => {
        dot.addEventListener('click', () => PM.Task.edit(dot.dataset.id));
      });
    }
  };
  
  // ============================================
  // PM.Task - Task Operations
  // ============================================
  PM.Task = {
    create: function() {
      PM.State.editingTaskId = null;
      document.getElementById('taskModalTitle').textContent = '新規タスク';
      this.resetForm();
      this.populatePredecessors();
      document.getElementById('githubIssueGroup').style.display = 'none';
      document.getElementById('activityGroup').style.display = 'none';
      PM.UI.showModal('taskModal');
    },
    
    edit: function(id) {
      const task = PM.State.tasks.find(t => t.id === id);
      if (!task) return;
      
      PM.State.editingTaskId = id;
      document.getElementById('taskModalTitle').textContent = 'タスク編集';
      
      document.getElementById('taskId').value = task.id;
      document.getElementById('taskTitle').value = task.title || '';
      document.getElementById('taskDescription').value = task.description || '';
      document.getElementById('taskStatus').value = task.status || 'todo';
      document.getElementById('taskPriority').value = task.priority || 'medium';
      document.getElementById('taskAssignee').value = task.assignee || '';
      document.getElementById('taskMilestone').value = task.milestone || '';
      document.getElementById('taskStartDate').value = task.startDate || '';
      document.getElementById('taskDueDate').value = task.dueDate || '';
      document.getElementById('taskEstimatedHours').value = task.estimatedHours || '';
      document.getElementById('taskActualHours').value = task.actualHours || '';
      document.getElementById('taskProgress').value = task.progress || 0;
      document.getElementById('taskProgressValue').textContent = (task.progress || 0) + '%';
      document.getElementById('taskTags').value = (task.tags || []).join(', ');
      document.getElementById('taskGithubIssueUrl').value = task.githubIssueUrl || '';
      
      this.renderSubtasks(task.subtasks || []);
      this.populatePredecessors(task.predecessors || []);
      
      const activity = PM.Data.getActivityForTask(id);
      const logEl = document.getElementById('taskActivityLog');
      logEl.innerHTML = activity.map(a => 
        `<div class="pm-activity-item"><span class="time">${PM.Utils.formatDateTime(a.timestamp)}</span>${a.action}: ${a.details}</div>`
      ).join('') || '<div class="pm-activity-item">履歴なし</div>';
      
      document.getElementById('githubIssueGroup').style.display = task.githubIssueUrl ? 'block' : 'none';
      document.getElementById('activityGroup').style.display = 'block';
      
      PM.UI.showModal('taskModal');
    },
    
    save: function() {
      const title = document.getElementById('taskTitle').value.trim();
      if (!title) {
        alert('タイトルは必須です');
        return;
      }
      
      const tagsStr = document.getElementById('taskTags').value;
      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];
      
      const subtasks = [];
      document.querySelectorAll('#taskSubtasks .pm-subtask-item').forEach(item => {
        const text = item.querySelector('input[type="text"]').value.trim();
        const done = item.querySelector('input[type="checkbox"]').checked;
        if (text) subtasks.push({ text, done });
      });
      
      const predecessors = Array.from(document.getElementById('taskPredecessors').selectedOptions).map(o => o.value);
      
      const taskId = document.getElementById('taskId').value;
      const isEdit = !!taskId;
      
      if (predecessors.length > 0 && PM.Utils.detectCycle(PM.State.tasks, taskId, predecessors)) {
        alert('循環依存が検出されました。依存関係を見直してください。');
        return;
      }
      
      // 進捗率はスライダーの値を使用（サブタスクのチェック状態は別途イベントで自動更新）
      let progress = parseInt(document.getElementById('taskProgress').value) || 0;
      
      const taskData = {
        title: title,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value,
        assignee: document.getElementById('taskAssignee').value,
        milestone: document.getElementById('taskMilestone').value,
        startDate: document.getElementById('taskStartDate').value,
        dueDate: document.getElementById('taskDueDate').value,
        estimatedHours: parseFloat(document.getElementById('taskEstimatedHours').value) || 0,
        actualHours: parseFloat(document.getElementById('taskActualHours').value) || 0,
        progress: progress,
        tags: tags,
        subtasks: subtasks,
        predecessors: predecessors,
        updatedAt: new Date().toISOString()
      };
      
      if (isEdit) {
        const index = PM.State.tasks.findIndex(t => t.id === taskId);
        if (index >= 0) {
          const oldTask = PM.State.tasks[index];
          PM.State.tasks[index] = { ...oldTask, ...taskData };
          
          if (oldTask.status !== taskData.status) {
            PM.Data.addActivity(taskId, 'ステータス変更', `${oldTask.status} → ${taskData.status}`);
          }
          PM.Data.addActivity(taskId, '更新', taskData.title);
        }
      } else {
        const newTask = {
          id: PM.Data.generateId(),
          ...taskData,
          githubIssueUrl: '',
          createdAt: new Date().toISOString()
        };
        PM.State.tasks.push(newTask);
        PM.Data.addActivity(newTask.id, '作成', newTask.title);
      }
      
      PM.Data.saveTasks(PM.State.tasks);
      PM.UI.hideModal('taskModal');
      PM.Views.render();
    },
    
    delete: async function(id) {
      const task = PM.State.tasks.find(t => t.id === id);
      if (!task) return;
      
      const ok = await PM.UI.confirm('削除確認', `「${task.title}」を削除しますか？`);
      if (!ok) return;
      
      PM.State.tasks = PM.State.tasks.filter(t => t.id !== id);
      PM.Data.saveTasks(PM.State.tasks);
      PM.Data.addActivity(id, '削除', task.title);
      PM.Views.render();
    },
    
    updateStatus: function(id, newStatus) {
      const task = PM.State.tasks.find(t => t.id === id);
      if (!task || task.status === newStatus) return;
      
      const oldStatus = task.status;
      task.status = newStatus;
      task.updatedAt = new Date().toISOString();
      
      PM.Data.saveTasks(PM.State.tasks);
      PM.Data.addActivity(id, 'ステータス変更', `${oldStatus} → ${newStatus}`);
      PM.Views.render();
    },
    
    resetForm: function() {
      document.getElementById('taskId').value = '';
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDescription').value = '';
      document.getElementById('taskStatus').value = 'todo';
      document.getElementById('taskPriority').value = 'medium';
      document.getElementById('taskAssignee').value = '';
      document.getElementById('taskMilestone').value = '';
      document.getElementById('taskStartDate').value = '';
      document.getElementById('taskDueDate').value = '';
      document.getElementById('taskEstimatedHours').value = '';
      document.getElementById('taskActualHours').value = '';
      document.getElementById('taskProgress').value = 0;
      document.getElementById('taskProgressValue').textContent = '0%';
      document.getElementById('taskTags').value = '';
      document.getElementById('taskGithubIssueUrl').value = '';
      document.getElementById('taskSubtasks').innerHTML = '';
    },
    
    renderSubtasks: function(subtasks) {
      const container = document.getElementById('taskSubtasks');
      container.innerHTML = subtasks.map((st, i) => `
        <div class="pm-subtask-item">
          <input type="checkbox" ${st.done ? 'checked' : ''}>
          <input type="text" value="${PM.Utils.escapeHtml(st.text)}">
          <button class="remove-btn" data-index="${i}">&times;</button>
        </div>
      `).join('');
      
      container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => btn.parentElement.remove());
      });
      
      // サブタスクのチェックボックス変更時に進捗率を自動更新
      container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => this.updateProgressFromSubtasks());
      });
    },
    
    addSubtask: function() {
      const container = document.getElementById('taskSubtasks');
      const div = document.createElement('div');
      div.className = 'pm-subtask-item';
      div.innerHTML = `
        <input type="checkbox">
        <input type="text" placeholder="サブタスク名">
        <button class="remove-btn">&times;</button>
      `;
      container.appendChild(div);
      
      div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
      div.querySelector('input[type="checkbox"]').addEventListener('change', () => this.updateProgressFromSubtasks());
    },
    
    updateProgressFromSubtasks: function() {
      const container = document.getElementById('taskSubtasks');
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      const total = checkboxes.length;
      if (total === 0) return;
      
      const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
      const progress = Math.round((checked / total) * 100);
      
      document.getElementById('taskProgress').value = progress;
      document.getElementById('taskProgressValue').textContent = progress + '%';
    },
    
    populatePredecessors: function(selected = []) {
      const select = document.getElementById('taskPredecessors');
      const currentId = PM.State.editingTaskId;
      
      const options = PM.State.tasks
        .filter(t => t.id !== currentId)
        .map(t => `<option value="${t.id}" ${selected.includes(t.id) ? 'selected' : ''}>${PM.Utils.escapeHtml(t.title)}</option>`)
        .join('');
      
      select.innerHTML = options;
    }
  };
  
  // ============================================
  // PM.ImportExport - Import/Export
  // ============================================
  PM.ImportExport = {
    exportJson: function() {
      const data = JSON.stringify(PM.State.tasks, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      this.download(blob, 'tasks.json');
    },
    
    exportCsv: function() {
      const headers = ['id', 'title', 'description', 'status', 'priority', 'assignee', 'milestone', 
                       'startDate', 'dueDate', 'estimatedHours', 'actualHours', 'progress', 'tags', 
                       'githubIssueUrl', 'createdAt', 'updatedAt'];
      
      const rows = PM.State.tasks.map(task => {
        return headers.map(h => {
          let val = task[h];
          if (Array.isArray(val)) val = val.join(';');
          if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
            val = '"' + val.replace(/"/g, '""') + '"';
          }
          return val ?? '';
        }).join(',');
      });
      
      const csv = [headers.join(','), ...rows].join('\n');
      // BOMを追加してExcelでの文字化けを防ぐ
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8' });
      this.download(blob, 'tasks.csv');
    },
    
    download: function(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    import: function() {
      PM.UI.showModal('importModal');
      document.getElementById('importFile').value = '';
      document.getElementById('importPreview').innerHTML = '';
      document.getElementById('btnDoImport').disabled = true;
    },
    
    handleFile: function(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        let tasks = [];
        
        try {
          if (file.name.endsWith('.json')) {
            tasks = JSON.parse(content);
          } else if (file.name.endsWith('.csv')) {
            tasks = this.parseCsv(content);
          }
          
          if (!Array.isArray(tasks)) {
            throw new Error('Invalid format');
          }
          
          document.getElementById('importPreview').innerHTML = `<p>${tasks.length}件のタスクを検出</p>`;
          document.getElementById('btnDoImport').disabled = false;
          document.getElementById('btnDoImport').onclick = () => this.doImport(tasks);
        } catch (err) {
          document.getElementById('importPreview').innerHTML = `<p style="color:red;">ファイルの解析に失敗しました: ${err.message}</p>`;
        }
      };
      reader.readAsText(file);
    },
    
    parseCsv: function(csv) {
      const lines = csv.split('\n').filter(l => l.trim());
      if (lines.length < 2) return [];
      
      const headers = lines[0].split(',').map(h => h.trim());
      const tasks = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCsvLine(lines[i]);
        const task = {};
        headers.forEach((h, idx) => {
          let val = values[idx] || '';
          if (h === 'tags') {
            val = val.split(';').map(t => t.trim()).filter(t => t);
          } else if (['estimatedHours', 'actualHours', 'progress'].includes(h)) {
            val = parseFloat(val) || 0;
          }
          task[h] = val;
        });
        if (task.title) tasks.push(task);
      }
      
      return tasks;
    },
    
    parseCsvLine: function(line) {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      
      return result;
    },
    
    doImport: async function(newTasks) {
      const existingIds = new Set(PM.State.tasks.map(t => t.id));
      const duplicates = newTasks.filter(t => existingIds.has(t.id));
      
      if (duplicates.length > 0) {
        const overwrite = await PM.UI.confirm(
          'ID重複',
          `${duplicates.length}件のタスクが既存IDと重複しています。上書きしますか？（キャンセル場合はスキップ）`
        );
        
        if (overwrite) {
          newTasks.forEach(newTask => {
            const index = PM.State.tasks.findIndex(t => t.id === newTask.id);
            if (index >= 0) {
              PM.State.tasks[index] = { ...PM.State.tasks[index], ...newTask };
            } else {
              PM.State.tasks.push(newTask);
            }
          });
        } else {
          newTasks.forEach(newTask => {
            if (!existingIds.has(newTask.id)) {
              PM.State.tasks.push(newTask);
            }
          });
        }
      } else {
        PM.State.tasks = PM.State.tasks.concat(newTasks);
      }
      
      PM.Data.saveTasks(PM.State.tasks);
      PM.UI.hideModal('importModal');
      PM.Views.render();
      alert(`${newTasks.length}件のタスクをインポートしました`);
    }
  };
  
  // ============================================
  // PM.GitHub - GitHub Integration
  // ============================================
  PM.GitHub = {
    createIssue: async function(task) {
      const github = PM.Data.loadGithub();
      if (!github.token || !github.repo) {
        alert('GitHub設定でPATとリポジトリを設定してください');
        return null;
      }
      
      try {
        const [owner, repo] = github.repo.split('/');
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${github.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: task.title,
            body: task.description || '',
            labels: [task.priority]
          })
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const issue = await response.json();
        return issue.html_url;
      } catch (err) {
        alert('GitHub Issue作成に失敗しました: ' + err.message);
        return null;
      }
    },
    
    createIssuesForSelected: async function() {
      const selectedTasks = PM.State.tasks.filter(t => PM.State.selectedIds.has(t.id));
      if (selectedTasks.length === 0) return;
      
      for (const task of selectedTasks) {
        if (task.githubIssueUrl) continue;
        
        const url = await this.createIssue(task);
        if (url) {
          task.githubIssueUrl = url;
          task.updatedAt = new Date().toISOString();
          PM.Data.addActivity(task.id, 'GitHub Issue作成', url);
        }
      }
      
      PM.Data.saveTasks(PM.State.tasks);
      PM.State.selectedIds.clear();
      PM.UI.updateBulkBar();
      PM.Views.render();
      alert('GitHub Issue作成が完了しました');
    },
    
    saveSettings: function() {
      const token = document.getElementById('githubToken').value;
      const repo = document.getElementById('githubRepo').value;
      PM.Data.saveGithub({ token, repo });
      alert('GitHub設定を保存しました');
    },
    
    loadSettings: function() {
      const github = PM.Data.loadGithub();
      document.getElementById('githubToken').value = github.token || '';
      document.getElementById('githubRepo').value = github.repo || '';
    }
  };
  
  // ============================================
  // PM.Snapshot - Snapshot Management
  // ============================================
  PM.Snapshot = {
    show: function() {
      PM.UI.showModal('snapshotModal');
      this.renderList();
    },
    
    save: function() {
      const name = document.getElementById('snapshotName').value.trim();
      if (!name) {
        alert('スナップショット名を入力してください');
        return;
      }
      
      const snapshots = PM.Data.loadSnapshots();
      snapshots.push({
        id: PM.Data.generateId(),
        name: name,
        tasks: JSON.parse(JSON.stringify(PM.State.tasks)),
        createdAt: new Date().toISOString()
      });
      
      PM.Data.saveSnapshots(snapshots);
      document.getElementById('snapshotName').value = '';
      this.renderList();
      alert('スナップショットを保存しました');
    },
    
    restore: async function(id) {
      const snapshots = PM.Data.loadSnapshots();
      const snapshot = snapshots.find(s => s.id === id);
      if (!snapshot) return;
      
      const ok = await PM.UI.confirm('復元確認', `「${snapshot.name}」に復元しますか？現在のタスクは上書きされます。`);
      if (!ok) return;
      
      PM.State.tasks = JSON.parse(JSON.stringify(snapshot.tasks));
      PM.Data.saveTasks(PM.State.tasks);
      PM.UI.hideModal('snapshotModal');
      PM.Views.render();
      alert('スナップショットに復元しました');
    },
    
    delete: async function(id) {
      const snapshots = PM.Data.loadSnapshots();
      const snapshot = snapshots.find(s => s.id === id);
      if (!snapshot) return;
      
      const ok = await PM.UI.confirm('削除確認', `「${snapshot.name}」を削除しますか？`);
      if (!ok) return;
      
      const filtered = snapshots.filter(s => s.id !== id);
      PM.Data.saveSnapshots(filtered);
      this.renderList();
    },
    
    renderList: function() {
      const snapshots = PM.Data.loadSnapshots();
      const list = document.getElementById('snapshotList');
      
      if (snapshots.length === 0) {
        list.innerHTML = '<p>保存済みスナップショットはありません</p>';
        return;
      }
      
      list.innerHTML = snapshots.map(s => `
        <div class="pm-snapshot-item">
          <div>
            <div class="name">${PM.Utils.escapeHtml(s.name)}</div>
            <div class="date">${PM.Utils.formatDateTime(s.createdAt)}</div>
          </div>
          <div class="actions">
            <button class="pm-btn small" onclick="PM.Snapshot.restore('${s.id}')">復元</button>
            <button class="pm-btn small danger" onclick="PM.Snapshot.delete('${s.id}')">削除</button>
          </div>
        </div>
      `).join('');
    }
  };
  
  // ============================================
  // PM.Theme - Theme Management
  // ============================================
  PM.Theme = {
    toggle: function() {
      const current = PM.State.settings.theme || 'light';
      const newTheme = current === 'light' ? 'dark' : 'light';
      this.apply(newTheme);
      PM.State.settings.theme = newTheme;
      PM.Data.saveSettings(PM.State.settings);
    },
    
    apply: function(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    },
    
    load: function() {
      const settings = PM.Data.loadSettings();
      PM.State.settings = settings;
      this.apply(settings.theme || 'light');
    }
  };
  
  // ============================================
  // PM.Shortcuts - Keyboard Shortcuts
  // ============================================
  PM.Shortcuts = {
    init: function() {
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
          return;
        }
        
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'n') {
            e.preventDefault();
            PM.Task.create();
          } else if (e.key === '1') {
            e.preventDefault();
            PM.UI.switchView('list');
          } else if (e.key === '2') {
            e.preventDefault();
            PM.UI.switchView('gantt');
          } else if (e.key === '3') {
            e.preventDefault();
            PM.UI.switchView('kanban');
          } else if (e.key === '4') {
            e.preventDefault();
            PM.UI.switchView('calendar');
          }
        } else if (e.key === '/') {
          e.preventDefault();
          document.getElementById('filterSearch').focus();
        } else if (e.key === 'Escape') {
          document.querySelectorAll('.pm-modal-overlay.visible').forEach(m => {
            PM.UI.hideModal(m.id);
          });
        }
      });
    }
  };
  
  // ============================================
  // PM.Bulk - Bulk Operations
  // ============================================
  PM.Bulk = {
    delete: async function() {
      if (PM.State.selectedIds.size === 0) return;
      
      const ok = await PM.UI.confirm('一括削除', `${PM.State.selectedIds.size}件のタスクを削除しますか？`);
      if (!ok) return;
      
      PM.State.tasks = PM.State.tasks.filter(t => !PM.State.selectedIds.has(t.id));
      PM.Data.saveTasks(PM.State.tasks);
      PM.State.selectedIds.clear();
      PM.UI.updateBulkBar();
      PM.Views.render();
    },
    
    changeStatus: async function() {
      if (PM.State.selectedIds.size === 0) return;
      
      const status = prompt('新しいステータスを入力 (todo/doing/done):');
      if (!status || !['todo', 'doing', 'done'].includes(status)) return;
      
      PM.State.tasks.forEach(task => {
        if (PM.State.selectedIds.has(task.id)) {
          const oldStatus = task.status;
          task.status = status;
          task.updatedAt = new Date().toISOString();
          PM.Data.addActivity(task.id, 'ステータス変更', `${oldStatus} → ${status}`);
        }
      });
      
      PM.Data.saveTasks(PM.State.tasks);
      PM.State.selectedIds.clear();
      PM.UI.updateBulkBar();
      PM.Views.render();
    }
  };
  
  // ============================================
  // Initialize
  // ============================================
  function init() {
    PM.State.tasks = PM.Data.loadTasks();
    PM.Theme.load();
    PM.GitHub.loadSettings();
    
    const settings = PM.State.settings;
    if (settings.view) {
      PM.UI.switchView(settings.view);
    }
    
    document.getElementById('btnNewTask').addEventListener('click', () => PM.Task.create());
    document.getElementById('btnSaveTask').addEventListener('click', () => PM.Task.save());
    
    document.querySelectorAll('.pm-tab').forEach(tab => {
      tab.addEventListener('click', () => PM.UI.switchView(tab.dataset.view));
    });
    
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => PM.UI.hideModal(btn.dataset.close));
    });
    
    document.querySelectorAll('.pm-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) PM.UI.hideModal(overlay.id);
      });
    });
    
    document.getElementById('filterSearch').addEventListener('input', (e) => {
      PM.State.filters.search = e.target.value;
      PM.Views.render();
    });
    
    document.getElementById('filterStatus').addEventListener('change', (e) => {
      PM.State.filters.status = e.target.value;
      PM.Views.render();
    });
    
    document.getElementById('filterPriority').addEventListener('change', (e) => {
      PM.State.filters.priority = e.target.value;
      PM.Views.render();
    });
    
    document.getElementById('filterAssignee').addEventListener('input', (e) => {
      PM.State.filters.assignee = e.target.value;
      PM.Views.render();
    });
    
    document.getElementById('filterMilestone').addEventListener('input', (e) => {
      PM.State.filters.milestone = e.target.value;
      PM.Views.render();
    });
    
    document.querySelectorAll('.pm-table th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (PM.State.sort.field === field) {
          PM.State.sort.direction = PM.State.sort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          PM.State.sort.field = field;
          PM.State.sort.direction = 'asc';
        }
        // ソート方向の視覚的フィードバック
        document.querySelectorAll('.pm-table th[data-sort]').forEach(h => {
          h.classList.remove('sorted');
          h.querySelector('.sort-icon').textContent = '↕';
        });
        th.classList.add('sorted');
        th.querySelector('.sort-icon').textContent = PM.State.sort.direction === 'asc' ? '↑' : '↓';
        PM.Views.render();
      });
    });
    
    document.getElementById('selectAll').addEventListener('change', (e) => {
      const checked = e.target.checked;
      document.querySelectorAll('.task-cb').forEach(cb => {
        cb.checked = checked;
        const id = cb.dataset.id;
        if (checked) {
          PM.State.selectedIds.add(id);
        } else {
          PM.State.selectedIds.delete(id);
        }
      });
      PM.UI.updateBulkBar();
    });
    
    document.getElementById('btnExportJson').addEventListener('click', () => PM.ImportExport.exportJson());
    document.getElementById('btnExportCsv').addEventListener('click', () => PM.ImportExport.exportCsv());
    document.getElementById('btnImport').addEventListener('click', () => PM.ImportExport.import());
    
    document.getElementById('importFile').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) PM.ImportExport.handleFile(file);
    });
    
    document.getElementById('btnSettings').addEventListener('click', () => {
      document.getElementById('settingsPanel').classList.toggle('visible');
    });
    
    document.getElementById('btnSaveGithub').addEventListener('click', () => PM.GitHub.saveSettings());
    
    document.getElementById('btnSnapshots').addEventListener('click', () => PM.Snapshot.show());
    document.getElementById('btnSaveSnapshot').addEventListener('click', () => PM.Snapshot.save());
    
    document.getElementById('btnTheme').addEventListener('click', () => PM.Theme.toggle());
    
    document.getElementById('taskProgress').addEventListener('input', (e) => {
      document.getElementById('taskProgressValue').textContent = e.target.value + '%';
    });
    
    document.getElementById('btnAddSubtask').addEventListener('click', () => PM.Task.addSubtask());
    
    document.getElementById('bulkDelete').addEventListener('click', () => PM.Bulk.delete());
    document.getElementById('bulkStatus').addEventListener('click', () => PM.Bulk.changeStatus());
    document.getElementById('bulkGithub').addEventListener('click', () => PM.GitHub.createIssuesForSelected());
    
    document.getElementById('calPrev').addEventListener('click', () => {
      PM.State.calendarDate.setMonth(PM.State.calendarDate.getMonth() - 1);
      PM.Views.renderCalendar();
    });
    
    document.getElementById('calNext').addEventListener('click', () => {
      PM.State.calendarDate.setMonth(PM.State.calendarDate.getMonth() + 1);
      PM.Views.renderCalendar();
    });
    
    document.getElementById('calToday').addEventListener('click', () => {
      PM.State.calendarDate = new Date();
      PM.Views.renderCalendar();
    });
    
    PM.Shortcuts.init();
    PM.Views.render();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
