---
layout: default
title: プロジェクト管理 (Kimi K2.6) - Rui Software
---

<style>
/* ============================================
   Project Manager - Kimi K2.6
   ============================================ */
.pm-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: #333;
}

.pm-wrap h2 {
  font-size: 1.4em;
  font-weight: 400;
  border-left: 6px solid #2e8b57;
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
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 4px;
}

.pm-controls .ctrl-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pm-controls .ctrl-sep {
  color: #aaccbb;
  margin: 0 4px;
}

.pm-btn {
  display: inline-block;
  padding: 5px 12px;
  border: 1px solid #2e8b57;
  background: #2e8b57;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.9em;
  transition: .2s;
  text-decoration: none;
}

.pm-btn:hover {
  background: #1a5c38;
  border-color: #1a5c38;
  color: #fff;
}

.pm-btn.secondary {
  background: #fff;
  color: #2e8b57;
}

.pm-btn.secondary:hover {
  background: #eaf3ee;
}

.pm-btn.danger {
  background: #dc3545;
  border-color: #dc3545;
}

.pm-btn.danger:hover {
  background: #a71d2a;
  border-color: #a71d2a;
}

.pm-btn.small {
  padding: 3px 8px;
  font-size: 0.8em;
}

.pm-tab-group {
  display: flex;
  gap: 2px;
}

.pm-tab {
  padding: 5px 14px;
  border: 1px solid #aaccbb;
  background: #fff;
  color: #333;
  border-radius: 3px 3px 0 0;
  cursor: pointer;
  font-size: 0.9em;
  border-bottom: none;
  position: relative;
  top: 1px;
}

.pm-tab.active {
  background: #f7faf8;
  border-color: #2e8b57;
  color: #2e8b57;
  font-weight: bold;
  border-bottom: 1px solid #f7faf8;
  z-index: 2;
}

.pm-tab:hover:not(.active) {
  background: #eaf3ee;
}

.pm-filter-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pm-filter-group select,
.pm-filter-group input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.85em;
  font-family: inherit;
}

.pm-search-box {
  min-width: 160px;
}

/* View Containers */
.pm-view-container {
  border: 1px solid #dde8e2;
  border-radius: 0 4px 4px 4px;
  background: #fff;
  min-height: 400px;
  overflow: auto;
}

.pm-view {
  display: none;
  padding: 12px;
}

.pm-view.active {
  display: block;
}

/* List View */
.pm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

.pm-table th,
.pm-table td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.pm-table th {
  background: #f7faf8;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.pm-table th:hover {
  background: #eaf3ee;
}

.pm-table th .sort-indicator {
  margin-left: 4px;
  color: #999;
}

.pm-table th.sort-asc .sort-indicator::after { content: ' ▲'; }
.pm-table th.sort-desc .sort-indicator::after { content: ' ▼'; }

.pm-table tr:hover td {
  background: #f7faf8;
}

.pm-table td {
  vertical-align: middle;
}

.pm-table .col-check {
  width: 30px;
  text-align: center;
}

.pm-table .col-actions {
  width: 100px;
  text-align: center;
  white-space: nowrap;
}

.pm-table .col-actions .pm-btn {
  padding: 2px 6px;
  font-size: 0.75em;
  margin: 0 1px;
}

/* Priority Badges */
.pm-priority {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.8em;
  font-weight: 600;
}

.pm-priority.high {
  background: #f8d7da;
  color: #721c24;
}

.pm-priority.medium {
  background: #fff3cd;
  color: #856404;
}

.pm-priority.low {
  background: #d4edda;
  color: #155724;
}

/* Status Badges */
.pm-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.8em;
}

.pm-status.todo {
  background: #e2e3e5;
  color: #383d41;
}

.pm-status.doing {
  background: #cce5ff;
  color: #004085;
}

.pm-status.done {
  background: #d4edda;
  color: #155724;
}

/* Progress Bar */
.pm-progress-wrap {
  width: 100px;
  background: #e9ecef;
  border-radius: 3px;
  height: 14px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
}

.pm-progress-bar {
  height: 100%;
  background: #2e8b57;
  border-radius: 3px;
  transition: width .3s;
}

.pm-progress-text {
  font-size: 0.8em;
  margin-left: 6px;
  color: #666;
}

/* Tags */
.pm-tag {
  display: inline-block;
  padding: 1px 6px;
  margin: 1px;
  background: #eaf3ee;
  color: #2e8b57;
  border-radius: 3px;
  font-size: 0.75em;
}

/* Gantt Chart */
.pm-gantt-wrap {
  overflow-x: auto;
  min-height: 300px;
}

.pm-gantt-grid {
  display: grid;
  grid-template-columns: 200px repeat(var(--week-count), 1fr);
  gap: 1px;
  background: #ddd;
  border: 1px solid #ddd;
  min-width: 600px;
}

.pm-gantt-header {
  background: #f7faf8;
  padding: 6px 8px;
  font-weight: 600;
  font-size: 0.85em;
  text-align: center;
  white-space: nowrap;
}

.pm-gantt-header.task-col {
  text-align: left;
  position: sticky;
  left: 0;
  z-index: 2;
  background: #f7faf8;
}

.pm-gantt-row {
  background: #fff;
  padding: 6px 8px;
  font-size: 0.85em;
  position: relative;
}

.pm-gantt-row.task-col {
  position: sticky;
  left: 0;
  z-index: 1;
  background: #fff;
  border-right: 1px solid #ddd;
}

.pm-gantt-row.task-col:hover {
  background: #f7faf8;
}

.pm-gantt-bar {
  position: absolute;
  top: 4px;
  height: calc(100% - 8px);
  border-radius: 3px;
  min-width: 4px;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity .2s;
  display: flex;
  align-items: center;
  padding: 0 4px;
  font-size: 0.75em;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pm-gantt-bar:hover {
  opacity: 1;
  z-index: 10;
}

.pm-gantt-bar.high { background: #dc3545; }
.pm-gantt-bar.medium { background: #ffc107; color: #333; }
.pm-gantt-bar.low { background: #2e8b57; }

.pm-gantt-today {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e74c3c;
  z-index: 5;
  pointer-events: none;
}

.pm-gantt-milestone {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: #9b59b6;
  z-index: 6;
  cursor: pointer;
}

/* Kanban Board */
.pm-kanban-board {
  display: flex;
  gap: 12px;
  min-height: 400px;
  overflow-x: auto;
}

.pm-kanban-col {
  flex: 1;
  min-width: 260px;
  max-width: 320px;
  background: #f7faf8;
  border-radius: 4px;
  border: 1px solid #dde8e2;
  display: flex;
  flex-direction: column;
}

.pm-kanban-header {
  padding: 10px 12px;
  font-weight: 600;
  font-size: 0.95em;
  border-bottom: 2px solid #dde8e2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pm-kanban-header .count-badge {
  background: #2e8b57;
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8em;
}

.pm-kanban-body {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  min-height: 100px;
}

.pm-kanban-body.drag-over {
  background: #eaf3ee;
  border: 2px dashed #2e8b57;
}

.pm-kanban-card {
  background: #fff;
  border: 1px solid #dde8e2;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
  cursor: grab;
  transition: box-shadow .2s, transform .2s;
}

.pm-kanban-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pm-kanban-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.pm-kanban-card .card-title {
  font-weight: 600;
  font-size: 0.9em;
  margin-bottom: 6px;
  word-break: break-word;
}

.pm-kanban-card .card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-size: 0.8em;
  color: #666;
  margin-bottom: 4px;
}

.pm-kanban-card .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #eee;
}

.pm-kanban-card .card-progress {
  width: 60px;
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

.pm-modal-overlay.active {
  display: flex;
}

.pm-modal {
  background: #fff;
  border-radius: 4px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.pm-modal-header {
  padding: 14px 18px;
  border-bottom: 1px solid #dde8e2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pm-modal-header h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: 600;
}

.pm-modal-close {
  background: none;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.pm-modal-close:hover {
  color: #333;
}

.pm-modal-body {
  padding: 16px 18px;
}

.pm-form-row {
  margin-bottom: 12px;
}

.pm-form-row label {
  display: block;
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 4px;
  color: #555;
}

.pm-form-row input[type="text"],
.pm-form-row input[type="date"],
.pm-form-row input[type="number"],
.pm-form-row select,
.pm-form-row textarea {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-family: inherit;
  font-size: 0.9em;
  box-sizing: border-box;
}

.pm-form-row textarea {
  min-height: 80px;
  resize: vertical;
}

.pm-form-row input[type="range"] {
  width: 100%;
}

.pm-form-row .range-value {
  display: inline-block;
  margin-left: 8px;
  font-weight: 600;
  color: #2e8b57;
}

.pm-form-row .error-msg {
  color: #dc3545;
  font-size: 0.8em;
  margin-top: 4px;
  display: none;
}

.pm-form-row.has-error input,
.pm-form-row.has-error select,
.pm-form-row.has-error textarea {
  border-color: #dc3545;
}

.pm-form-row.has-error .error-msg {
  display: block;
}

.pm-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pm-modal-footer {
  padding: 12px 18px;
  border-top: 1px solid #dde8e2;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Settings Panel */
.pm-settings-panel {
  display: none;
  padding: 12px;
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 4px;
  margin-bottom: 12px;
}

.pm-settings-panel.active {
  display: block;
}

/* Activity Log */
.pm-activity-log {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 3px;
  padding: 8px;
  background: #fafafa;
}

.pm-activity-item {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.85em;
  color: #666;
}

.pm-activity-item:last-child {
  border-bottom: none;
}

.pm-activity-item .time {
  color: #999;
  font-size: 0.85em;
}

/* Subtasks */
.pm-subtask-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pm-subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

.pm-subtask-item input[type="checkbox"] {
  margin: 0;
}

.pm-subtask-item .subtask-text {
  flex: 1;
  font-size: 0.9em;
}

.pm-subtask-item .subtask-text.done {
  text-decoration: line-through;
  color: #999;
}

.pm-subtask-item .subtask-delete {
  color: #dc3545;
  cursor: pointer;
  font-size: 0.85em;
}

/* Snapshot */
.pm-snapshot-list {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 3px;
  padding: 8px;
}

.pm-snapshot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.85em;
}

/* Dark Theme */
.pm-wrap.dark-theme {
  color: #e0e0e0;
}

.pm-wrap.dark-theme .pm-controls,
.pm-wrap.dark-theme .pm-table th,
.pm-wrap.dark-theme .pm-gantt-header,
.pm-wrap.dark-theme .pm-kanban-col,
.pm-wrap.dark-theme .pm-settings-panel,
.pm-wrap.dark-theme .pm-activity-log,
.pm-wrap.dark-theme .pm-snapshot-list {
  background: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}

.pm-wrap.dark-theme .pm-view-container,
.pm-wrap.dark-theme .pm-modal,
.pm-wrap.dark-theme .pm-kanban-card,
.pm-wrap.dark-theme .pm-table td {
  background: #333;
  color: #e0e0e0;
}

.pm-wrap.dark-theme .pm-table tr:hover td,
.pm-wrap.dark-theme .pm-gantt-row.task-col:hover {
  background: #3a3a3a;
}

.pm-wrap.dark-theme .pm-kanban-card {
  border-color: #444;
}

.pm-wrap.dark-theme .pm-kanban-card .card-footer {
  border-color: #444;
}

.pm-wrap.dark-theme .pm-tag {
  background: #2e8b57;
  color: #fff;
}

/* Empty State */
.pm-empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.pm-empty-state .icon {
  font-size: 3em;
  margin-bottom: 12px;
}

/* Bulk Actions Bar */
.pm-bulk-bar {
  display: none;
  padding: 8px 12px;
  background: #eaf3ee;
  border: 1px solid #2e8b57;
  border-radius: 4px;
  margin-bottom: 8px;
  align-items: center;
  gap: 10px;
}

.pm-bulk-bar.active {
  display: flex;
}

.pm-bulk-bar .selected-count {
  font-weight: 600;
  color: #2e8b57;
}

/* Calendar View */
.pm-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ddd;
  border: 1px solid #ddd;
}

.pm-calendar-header {
  background: #f7faf8;
  padding: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.85em;
}

.pm-calendar-day {
  background: #fff;
  min-height: 80px;
  padding: 6px;
  font-size: 0.8em;
  position: relative;
}

.pm-calendar-day .day-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.pm-calendar-day .day-tasks {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pm-calendar-day .day-task-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.pm-calendar-day.today {
  background: #eaf3ee;
}

.pm-calendar-day.other-month {
  background: #f9f9f9;
  color: #bbb;
}

/* Responsive */
@media (max-width: 768px) {
  .pm-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .pm-form-grid {
    grid-template-columns: 1fr;
  }

  .pm-kanban-board {
    flex-direction: column;
  }

  .pm-kanban-col {
    max-width: 100%;
  }

  .pm-gantt-grid {
    grid-template-columns: 120px repeat(var(--week-count), minmax(40px, 1fr));
  }
}
</style>

<div class="pm-wrap" id="pmApp">
  <h2>プロジェクト管理 (Kimi K2.6)</h2>

  <!-- Controls -->
  <div class="pm-controls">
    <div class="ctrl-group">
      <button class="pm-btn" id="btnNewTask">＋ 新規タスク</button>
      <span class="ctrl-sep">|</span>
      <div class="pm-tab-group">
        <button class="pm-tab active" data-view="list">リスト</button>
        <button class="pm-tab" data-view="gantt">ガント</button>
        <button class="pm-tab" data-view="kanban">看板</button>
        <button class="pm-tab" data-view="calendar">カレンダー</button>
      </div>
    </div>
    <div class="ctrl-group" style="margin-left:auto;">
      <input type="text" class="pm-search-box" id="searchBox" placeholder="🔍 検索...">
      <span class="ctrl-sep">|</span>
      <select id="filterStatus">
        <option value="">すべてのステータス</option>
        <option value="todo">ToDo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <select id="filterPriority">
        <option value="">すべての優先度</option>
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <select id="filterAssignee">
        <option value="">すべての担当者</option>
      </select>
      <select id="filterMilestone">
        <option value="">すべてのマイルストーン</option>
      </select>
      <span class="ctrl-sep">|</span>
      <button class="pm-btn secondary small" id="btnExportJson">JSON出力</button>
      <button class="pm-btn secondary small" id="btnExportCsv">CSV出力</button>
      <label class="pm-btn secondary small" style="cursor:pointer;">
        読込
        <input type="file" id="btnImport" accept=".json,.csv" style="display:none;">
      </label>
      <span class="ctrl-sep">|</span>
      <button class="pm-btn secondary small" id="btnSettings">⚙️ 設定</button>
      <button class="pm-btn secondary small" id="btnTheme">🌓</button>
    </div>
  </div>

  <!-- Bulk Actions Bar -->
  <div class="pm-bulk-bar" id="bulkBar">
    <span class="selected-count" id="selectedCount">0 件選択</span>
    <button class="pm-btn small" id="btnBulkStatus">一括ステータス変更</button>
    <button class="pm-btn small" id="btnBulkDelete">一括削除</button>
    <button class="pm-btn small" id="btnBulkGithub">一括GitHub Issue化</button>
    <button class="pm-btn secondary small" id="btnBulkClear">選択解除</button>
  </div>

  <!-- Settings Panel -->
  <div class="pm-settings-panel" id="settingsPanel">
    <h4>設定</h4>
    <div class="pm-form-grid">
      <div class="pm-form-row">
        <label>GitHub Personal Access Token</label>
        <input type="text" id="githubToken" placeholder="ghp_xxxxxxxxxxxx">
      </div>
      <div class="pm-form-row">
        <label>デフォルト オーナー/リポジトリ</label>
        <input type="text" id="githubRepo" placeholder="owner/repo">
      </div>
    </div>
    <div class="pm-form-row" style="margin-top:10px;">
      <button class="pm-btn small" id="btnSaveSettings">保存</button>
      <button class="pm-btn secondary small" id="btnCloseSettings">閉じる</button>
    </div>
    <hr>
    <h4>スナップショット</h4>
    <div class="pm-form-row">
      <input type="text" id="snapshotName" placeholder="スナップショット名" style="width:200px;display:inline-block;">
      <button class="pm-btn small" id="btnSaveSnapshot">保存</button>
    </div>
    <div class="pm-snapshot-list" id="snapshotList"></div>
  </div>

  <!-- Views -->
  <div class="pm-view-container">
    <!-- List View -->
    <div class="pm-view active" id="viewList">
      <div id="listContent"></div>
    </div>

    <!-- Gantt View -->
    <div class="pm-view" id="viewGantt">
      <div id="ganttContent"></div>
    </div>

    <!-- Kanban View -->
    <div class="pm-view" id="viewKanban">
      <div class="pm-kanban-board" id="kanbanContent"></div>
    </div>

    <!-- Calendar View -->
    <div class="pm-view" id="viewCalendar">
      <div id="calendarContent"></div>
    </div>
  </div>
</div>

<!-- Task Modal -->
<div class="pm-modal-overlay" id="taskModal">
  <div class="pm-modal">
    <div class="pm-modal-header">
      <h3 id="modalTitle">新規タスク</h3>
      <button class="pm-modal-close" id="modalClose">&times;</button>
    </div>
    <div class="pm-modal-body">
      <form id="taskForm">
        <input type="hidden" id="taskId">
        <div class="pm-form-row">
          <label>タイトル *</label>
          <input type="text" id="taskTitle" required>
          <span class="error-msg">タイトルを入力してください</span>
        </div>
        <div class="pm-form-row">
          <label>詳細</label>
          <textarea id="taskDesc"></textarea>
        </div>
        <div class="pm-form-grid">
          <div class="pm-form-row">
            <label>ステータス</label>
            <select id="taskStatus">
              <option value="todo">ToDo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div class="pm-form-row">
            <label>優先度</label>
            <select id="taskPriority">
              <option value="high">高</option>
              <option value="medium" selected>中</option>
              <option value="low">低</option>
            </select>
          </div>
          <div class="pm-form-row">
            <label>担当者</label>
            <input type="text" id="taskAssignee" placeholder="名前">
          </div>
          <div class="pm-form-row">
            <label>マイルストーン</label>
            <input type="text" id="taskMilestone" placeholder="マイルストーン名">
          </div>
          <div class="pm-form-row">
            <label>開始日</label>
            <input type="date" id="taskStartDate">
          </div>
          <div class="pm-form-row">
            <label>締切日</label>
            <input type="date" id="taskDueDate">
          </div>
          <div class="pm-form-row">
            <label>予定工数 (時間)</label>
            <input type="number" id="taskEstimated" min="0" step="0.5" placeholder="0">
          </div>
          <div class="pm-form-row">
            <label>実績工数 (時間)</label>
            <input type="number" id="taskActual" min="0" step="0.5" placeholder="0">
          </div>
        </div>
        <div class="pm-form-row">
          <label>進捗率 <span class="range-value" id="progressValue">0%</span></label>
          <input type="range" id="taskProgress" min="0" max="100" value="0">
        </div>
        <div class="pm-form-row">
          <label>タグ（カンマ区切り）</label>
          <input type="text" id="taskTags" placeholder="bug, feature, docs">
        </div>
        <div class="pm-form-row">
          <label>サブタスク</label>
          <div id="subtaskContainer">
            <ul class="pm-subtask-list" id="subtaskList"></ul>
            <div style="display:flex;gap:6px;margin-top:6px;">
              <input type="text" id="newSubtask" placeholder="新しいサブタスク" style="flex:1;">
              <button type="button" class="pm-btn small" id="btnAddSubtask">追加</button>
            </div>
          </div>
        </div>
        <div class="pm-form-row">
          <label>依存タスク</label>
          <select id="taskPredecessors" multiple style="min-height:80px;">
          </select>
          <small style="color:#999;">Ctrl+クリックで複数選択</small>
        </div>
        <div class="pm-form-row" id="githubIssueRow" style="display:none;">
          <label>GitHub Issue</label>
          <div id="githubIssueLink"></div>
        </div>
        <div class="pm-form-row">
          <label>アクティビティ履歴</label>
          <div class="pm-activity-log" id="activityLog"></div>
        </div>
      </form>
    </div>
    <div class="pm-modal-footer">
      <button class="pm-btn danger small" id="btnDeleteTask" style="display:none;margin-right:auto;">削除</button>
      <button class="pm-btn secondary" id="btnCancel">キャンセル</button>
      <button class="pm-btn" id="btnSaveTask">保存</button>
      <button class="pm-btn secondary" id="btnCreateGithub" style="display:none;">GitHub Issue作成</button>
    </div>
  </div>
</div>

<script>
(function(){
  'use strict';

  // ==========================================
  // Constants & Config
  // ==========================================
  const STORAGE_KEY = 'rui-pm-tasks';
  const SETTINGS_KEY = 'rui-pm-settings';
  const GITHUB_KEY = 'rui-pm-github';
  const SNAPSHOT_KEY = 'rui-pm-snapshots';
  const ACTIVITY_KEY = 'rui-pm-activity';

  const STATUS_LABELS = { todo: 'ToDo', doing: 'Doing', done: 'Done' };
  const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' };
  const PRIORITY_COLORS = { high: '#dc3545', medium: '#ffc107', low: '#2e8b57' };

  // ==========================================
  // Utility Functions
  // ==========================================
  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ja-JP');
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('ja-JP');
  }

  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'})[m];
    });
  }

  function parseTags(tagStr) {
    if (!tagStr) return [];
    return tagStr.split(/[,，、]/).map(t => t.trim()).filter(t => t);
  }

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function diffDays(a, b) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((new Date(b) - new Date(a)) / msPerDay);
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }

  // ==========================================
  // Activity Log
  // ==========================================
  const ActivityLog = {
    load() {
      try {
        return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
      } catch (e) { return []; }
    },
    save(logs) {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs.slice(-500)));
    },
    add(taskId, action, detail) {
      const logs = this.load();
      logs.push({ taskId, action, detail, time: new Date().toISOString() });
      this.save(logs);
    },
    getForTask(taskId) {
      return this.load().filter(l => l.taskId === taskId).reverse();
    }
  };

  // ==========================================
  // Settings
  // ==========================================
  const Settings = {
    load() {
      try {
        return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      } catch (e) { return {}; }
    },
    save(data) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    },
    get(key, def) {
      const s = this.load();
      return s[key] !== undefined ? s[key] : def;
    },
    set(key, val) {
      const s = this.load();
      s[key] = val;
      this.save(s);
    }
  };

  // ==========================================
  // GitHub Config
  // ==========================================
  const GithubConfig = {
    load() {
      try {
        return JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
      } catch (e) { return {}; }
    },
    save(data) {
      localStorage.setItem(GITHUB_KEY, JSON.stringify(data));
    }
  };

  // ==========================================
  // Snapshots
  // ==========================================
  const Snapshots = {
    load() {
      try {
        return JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || '[]');
      } catch (e) { return []; }
    },
    save(list) {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(list));
    },
    add(name, tasks) {
      const list = this.load();
      list.push({ name, tasks: JSON.parse(JSON.stringify(tasks)), createdAt: new Date().toISOString() });
      this.save(list);
    },
    get(name) {
      return this.load().find(s => s.name === name);
    },
    delete(name) {
      const list = this.load().filter(s => s.name !== name);
      this.save(list);
    }
  };

  // ==========================================
  // Task Manager
  // ==========================================
  const TaskManager = {
    tasks: [],

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        this.tasks = raw ? JSON.parse(raw) : [];
      } catch (e) {
        this.tasks = [];
      }
      return this.tasks;
    },

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    },

    add(task) {
      const now = new Date().toISOString();
      const newTask = {
        id: generateId(),
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: '',
        startDate: '',
        dueDate: '',
        progress: 0,
        tags: [],
        estimatedHours: 0,
        actualHours: 0,
        milestone: '',
        subtasks: [],
        predecessors: [],
        githubIssueUrl: '',
        createdAt: now,
        updatedAt: now,
        ...task
      };
      this.tasks.push(newTask);
      this.save();
      ActivityLog.add(newTask.id, '作成', `タスク「${newTask.title}」を作成`);
      return newTask;
    },

    update(id, updates) {
      const idx = this.tasks.findIndex(t => t.id === id);
      if (idx === -1) return null;
      const old = { ...this.tasks[idx] };
      this.tasks[idx] = { ...old, ...updates, updatedAt: new Date().toISOString() };
      this.save();
      const changes = [];
      for (const k in updates) {
        if (old[k] !== updates[k]) changes.push(`${k}: ${old[k]} → ${updates[k]}`);
      }
      if (changes.length) {
        ActivityLog.add(id, '更新', changes.join(', '));
      }
      return this.tasks[idx];
    },

    delete(id) {
      const task = this.tasks.find(t => t.id === id);
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.save();
      if (task) ActivityLog.add(id, '削除', `タスク「${task.title}」を削除`);
      return task;
    },

    getById(id) {
      return this.tasks.find(t => t.id === id);
    },

    getAll() {
      return this.tasks;
    },

    getFiltered(filters) {
      let result = [...this.tasks];
      if (filters.status) result = result.filter(t => t.status === filters.status);
      if (filters.priority) result = result.filter(t => t.priority === filters.priority);
      if (filters.assignee) result = result.filter(t => t.assignee === filters.assignee);
      if (filters.milestone) result = result.filter(t => t.milestone === filters.milestone);
      if (filters.search) {
        const s = filters.search.toLowerCase();
        result = result.filter(t =>
          (t.title && t.title.toLowerCase().includes(s)) ||
          (t.description && t.description.toLowerCase().includes(s)) ||
          (t.assignee && t.assignee.toLowerCase().includes(s)) ||
          (t.milestone && t.milestone.toLowerCase().includes(s)) ||
          (t.tags && t.tags.some(tag => tag.toLowerCase().includes(s)))
        );
      }
      return result;
    },

    sortBy(field, asc) {
      const dir = asc ? 1 : -1;
      this.tasks.sort((a, b) => {
        let va = a[field], vb = b[field];
        if (field === 'dueDate' || field === 'startDate') {
          va = va || '9999-12-31';
          vb = vb || '9999-12-31';
        }
        if (va === undefined) va = '';
        if (vb === undefined) vb = '';
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
    },

    exportJSON() {
      return JSON.stringify(this.tasks, null, 2);
    },

    exportCSV() {
      const headers = ['id','title','description','status','priority','assignee','startDate','dueDate','progress','tags','estimatedHours','actualHours','milestone','createdAt','updatedAt'];
      const rows = this.tasks.map(t => [
        t.id, t.title, t.description, t.status, t.priority, t.assignee,
        t.startDate, t.dueDate, t.progress, (t.tags || []).join(';'),
        t.estimatedHours, t.actualHours, t.milestone, t.createdAt, t.updatedAt
      ].map(v => {
        const s = String(v ?? '');
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      }));
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    importJSON(jsonStr) {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data)) throw new Error('Invalid format');
      return data;
    },

    importCSV(csvStr) {
      const lines = csvStr.trim().split('\n');
      if (lines.length < 2) throw new Error('No data');
      const headers = parseCSVLine(lines[0]);
      const tasks = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i]);
        const task = {};
        headers.forEach((h, idx) => {
          let v = vals[idx] || '';
          if (h === 'tags') v = v.split(';').filter(t => t);
          if (h === 'progress' || h === 'estimatedHours' || h === 'actualHours') v = parseFloat(v) || 0;
          task[h] = v;
        });
        tasks.push(task);
      }
      return tasks;
    },

    merge(tasks, overwrite) {
      let added = 0, updated = 0;
      for (const t of tasks) {
        const existing = this.tasks.find(x => x.id === t.id);
        if (existing) {
          if (overwrite) {
            Object.assign(existing, t, { updatedAt: new Date().toISOString() });
            updated++;
          }
        } else {
          this.tasks.push({
            ...t,
            id: t.id || generateId(),
            createdAt: t.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          added++;
        }
      }
      this.save();
      return { added, updated };
    },

    checkCircularDeps(taskId, predecessors, visited) {
      if (!predecessors || !predecessors.length) return false;
      visited = visited || new Set();
      if (visited.has(taskId)) return true;
      visited.add(taskId);
      for (const pid of predecessors) {
        const p = this.getById(pid);
        if (p && p.predecessors) {
          if (this.checkCircularDeps(pid, p.predecessors, new Set(visited))) return true;
        }
      }
      return false;
    }
  };

  function parseCSVLine(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  }

  // ==========================================
  // GitHub API
  // ==========================================
  const GithubAPI = {
    async createIssue(task, token, repo) {
      const [owner, repository] = repo.split('/');
      if (!owner || !repository) throw new Error('Invalid repo format. Use owner/repo');
      const body = `## タスク情報\n\n- **優先度**: ${PRIORITY_LABELS[task.priority] || task.priority}\n- **担当者**: ${task.assignee || '未設定'}\n- **開始日**: ${task.startDate || '未設定'}\n- **締切日**: ${task.dueDate || '未設定'}\n- **進捗**: ${task.progress}%\n- **予定工数**: ${task.estimatedHours || 0}h\n- **実績工数**: ${task.actualHours || 0}h\n- **マイルストーン**: ${task.milestone || '未設定'}\n\n## 詳細\n\n${task.description || '（詳細なし）'}\n\n---\n*Created from Project Manager (Kimi K2.6)*`;
      const res = await fetch(`https://api.github.com/repos/${owner}/${repository}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: task.title, body })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      return await res.json();
    }
  };

  // ==========================================
  // UI State
  // ==========================================
  let currentView = Settings.get('view', 'list');
  let currentSort = { field: 'updatedAt', asc: false };
  let selectedTasks = new Set();
  let currentFilters = {};
  let editingTaskId = null;

  // ==========================================
  // DOM References
  // ==========================================
  const $ = id => document.getElementById(id);

  // ==========================================
  // Render Functions
  // ==========================================
  function renderList() {
    const tasks = TaskManager.getFiltered(currentFilters);
    const container = $('listContent');
    if (!tasks.length) {
      container.innerHTML = '<div class="pm-empty-state"><div class="icon">📋</div><p>タスクがありません。「新規タスク」ボタンから追加してください。</p></div>';
      return;
    }
    const assignees = [...new Set(TaskManager.getAll().map(t => t.assignee).filter(Boolean))].sort();
    const milestones = [...new Set(TaskManager.getAll().map(t => t.milestone).filter(Boolean))].sort();
    updateFilterOptions(assignees, milestones);

    let html = '<table class="pm-table"><thead><tr>';
    html += '<th class="col-check"><input type="checkbox" id="selectAll"></th>';
    const headers = [
      { key: 'title', label: 'タイトル' },
      { key: 'status', label: 'ステータス' },
      { key: 'priority', label: '優先度' },
      { key: 'assignee', label: '担当者' },
      { key: 'dueDate', label: '締切日' },
      { key: 'progress', label: '進捗' },
      { key: 'tags', label: 'タグ' },
      { key: 'estimatedHours', label: '工数' },
    ];
    for (const h of headers) {
      const sortClass = currentSort.field === h.key ? (currentSort.asc ? 'sort-asc' : 'sort-desc') : '';
      html += `<th class="${sortClass}" data-sort="${h.key}">${h.label}<span class="sort-indicator"></span></th>`;
    }
    html += '<th class="col-actions">操作</th></tr></thead><tbody>';
    for (const t of tasks) {
      const tagsHtml = (t.tags || []).map(tag => `<span class="pm-tag">${escapeHtml(tag)}</span>`).join('');
      const hours = t.estimatedHours ? `${t.estimatedHours}h` : '-';
      html += `<tr data-id="${t.id}">`;
      html += `<td class="col-check"><input type="checkbox" class="task-check" data-id="${t.id}"${selectedTasks.has(t.id) ? ' checked' : ''}></td>`;
      html += `<td>${escapeHtml(t.title)}${t.githubIssueUrl ? ' <a href="'+escapeHtml(t.githubIssueUrl)+'" target="_blank" title="GitHub Issue">🔗</a>' : ''}</td>`;
      html += `<td><span class="pm-status ${t.status}">${STATUS_LABELS[t.status]}</span></td>`;
      html += `<td><span class="pm-priority ${t.priority}">${PRIORITY_LABELS[t.priority]}</span></td>`;
      html += `<td>${escapeHtml(t.assignee || '-')}</td>`;
      html += `<td>${formatDate(t.dueDate) || '-'}</td>`;
      html += `<td><div class="pm-progress-wrap"><div class="pm-progress-bar" style="width:${t.progress}%"></div></div><span class="pm-progress-text">${t.progress}%</span></td>`;
      html += `<td>${tagsHtml}</td>`;
      html += `<td>${hours}</td>`;
      html += `<td class="col-actions"><button class="pm-btn small btn-edit" data-id="${t.id}">編集</button><button class="pm-btn small secondary btn-github" data-id="${t.id}">GitHub</button></td>`;
      html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;

    // Event delegation for list
    container.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (currentSort.field === field) {
          currentSort.asc = !currentSort.asc;
        } else {
          currentSort = { field, asc: true };
        }
        TaskManager.sortBy(field, currentSort.asc);
        renderList();
      });
    });

    $('selectAll').addEventListener('change', e => {
      container.querySelectorAll('.task-check').forEach(cb => {
        cb.checked = e.target.checked;
        if (e.target.checked) selectedTasks.add(cb.dataset.id);
        else selectedTasks.delete(cb.dataset.id);
      });
      updateBulkBar();
    });

    container.querySelectorAll('.task-check').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) selectedTasks.add(cb.dataset.id);
        else selectedTasks.delete(cb.dataset.id);
        updateBulkBar();
      });
    });

    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.id));
    });

    container.querySelectorAll('.btn-github').forEach(btn => {
      btn.addEventListener('click', () => createGithubIssue(btn.dataset.id));
    });
  }

  function renderGantt() {
    const tasks = TaskManager.getFiltered(currentFilters).filter(t => t.startDate && t.dueDate);
    const container = $('ganttContent');
    if (!tasks.length) {
      container.innerHTML = '<div class="pm-empty-state"><div class="icon">📊</div><p>ガントチャートを表示するには、タスクに開始日と締切日を設定してください。</p></div>';
      return;
    }

    let minDate = new Date(tasks[0].startDate);
    let maxDate = new Date(tasks[0].dueDate);
    for (const t of tasks) {
      const s = new Date(t.startDate);
      const d = new Date(t.dueDate);
      if (s < minDate) minDate = s;
      if (d > maxDate) maxDate = d;
    }
    minDate = getMonday(minDate);
    maxDate = getMonday(addDays(maxDate, 7));
    const totalWeeks = Math.max(4, Math.ceil(diffDays(minDate, maxDate) / 7));

    container.style.setProperty('--week-count', totalWeeks);
    let html = '<div class="pm-gantt-wrap"><div class="pm-gantt-grid">';
    html += '<div class="pm-gantt-header task-col">タスク</div>';
    for (let i = 0; i < totalWeeks; i++) {
      const weekStart = addDays(minDate, i * 7);
      const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      html += `<div class="pm-gantt-header">${label}</div>`;
    }

    const today = new Date();
    const todayOffset = diffDays(minDate, today) / 7;

    for (const t of tasks) {
      html += `<div class="pm-gantt-row task-col" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>`;
      const startOffset = diffDays(minDate, new Date(t.startDate)) / 7;
      const duration = Math.max(0.5, diffDays(new Date(t.startDate), new Date(t.dueDate)) / 7);
      const leftPct = (startOffset / totalWeeks) * 100;
      const widthPct = (duration / totalWeeks) * 100;
      const colorClass = t.priority;

      for (let i = 0; i < totalWeeks; i++) {
        html += '<div class="pm-gantt-row" style="position:relative;">';
        if (i === 0) {
          html += `<div class="pm-gantt-bar ${colorClass}" style="left:${leftPct}%;width:${widthPct}%;" data-id="${t.id}">${escapeHtml(t.title)}</div>`;
          if (t.milestone) {
            const milestoneOffset = diffDays(minDate, new Date(t.dueDate)) / 7;
            const milestonePct = (milestoneOffset / totalWeeks) * 100;
            html += `<div class="pm-gantt-milestone" style="left:${milestonePct}%;" title="マイルストーン: ${escapeHtml(t.milestone)}"></div>`;
          }
        }
        if (Math.abs(i - todayOffset) < 0.5) {
          html += `<div class="pm-gantt-today" style="left:50%;"></div>`;
        }
        html += '</div>';
      }
    }
    html += '</div></div>';
    container.innerHTML = html;

    container.querySelectorAll('.pm-gantt-bar').forEach(bar => {
      bar.addEventListener('click', () => openModal(bar.dataset.id));
    });
  }

  function renderKanban() {
    const tasks = TaskManager.getFiltered(currentFilters);
    const cols = [
      { key: 'todo', label: 'ToDo', color: '#e2e3e5' },
      { key: 'doing', label: 'Doing', color: '#cce5ff' },
      { key: 'done', label: 'Done', color: '#d4edda' }
    ];
    const container = $('kanbanContent');
    let html = '';
    for (const col of cols) {
      const colTasks = tasks.filter(t => t.status === col.key);
      html += `<div class="pm-kanban-col" data-status="${col.key}">`;
      html += `<div class="pm-kanban-header"><span>${col.label}</span><span class="count-badge">${colTasks.length}</span></div>`;
      html += `<div class="pm-kanban-body" data-status="${col.key}">`;
      for (const t of colTasks) {
        const tagsHtml = (t.tags || []).slice(0, 3).map(tag => `<span class="pm-tag">${escapeHtml(tag)}</span>`).join('');
        html += `<div class="pm-kanban-card" draggable="true" data-id="${t.id}">`;
        html += `<div class="card-title">${escapeHtml(t.title)}</div>`;
        html += `<div class="card-meta">`;
        html += `<span class="pm-priority ${t.priority}">${PRIORITY_LABELS[t.priority]}</span>`;
        if (t.assignee) html += `<span>👤 ${escapeHtml(t.assignee)}</span>`;
        if (t.dueDate) html += `<span>📅 ${formatDate(t.dueDate)}</span>`;
        html += '</div>';
        if (tagsHtml) html += `<div>${tagsHtml}</div>`;
        html += `<div class="card-footer">`;
        html += `<div class="pm-progress-wrap card-progress"><div class="pm-progress-bar" style="width:${t.progress}%"></div></div>`;
        html += `<button class="pm-btn small secondary btn-edit" data-id="${t.id}">編集</button>`;
        html += '</div>';
        html += '</div>';
      }
      html += '</div></div>';
    }
    container.innerHTML = html;

    // Drag and drop
    container.querySelectorAll('.pm-kanban-card').forEach(card => {
      card.addEventListener('dragstart', e => {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', card.dataset.id);
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });
    });

    container.querySelectorAll('.pm-kanban-body').forEach(body => {
      body.addEventListener('dragover', e => {
        e.preventDefault();
        body.classList.add('drag-over');
      });
      body.addEventListener('dragleave', () => {
        body.classList.remove('drag-over');
      });
      body.addEventListener('drop', e => {
        e.preventDefault();
        body.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        const newStatus = body.dataset.status;
        const task = TaskManager.getById(id);
        if (task && task.status !== newStatus) {
          TaskManager.update(id, { status: newStatus, progress: newStatus === 'done' ? 100 : task.progress });
          ActivityLog.add(id, 'ステータス変更', `${STATUS_LABELS[task.status]} → ${STATUS_LABELS[newStatus]}`);
          renderCurrentView();
        }
      });
    });

    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        openModal(btn.dataset.id);
      });
    });
  }

  function renderCalendar() {
    const tasks = TaskManager.getFiltered(currentFilters);
    const container = $('calendarContent');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
    let html = '<div class="pm-calendar-grid">';
    for (const d of dayNames) html += `<div class="pm-calendar-header">${d}</div>`;

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startOffset + 1;
      const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
      const dateStr = isCurrentMonth ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` : '';
      const isToday = isCurrentMonth && dayNum === now.getDate();
      const dayTasks = isCurrentMonth ? tasks.filter(t => {
        if (!t.startDate || !t.dueDate) return false;
        return dateStr >= t.startDate && dateStr <= t.dueDate;
      }) : [];

      html += `<div class="pm-calendar-day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}">`;
      html += `<div class="day-number">${isCurrentMonth ? dayNum : ''}</div>`;
      html += `<div class="day-tasks">`;
      for (const t of dayTasks.slice(0, 5)) {
        html += `<span class="day-task-dot" style="background:${PRIORITY_COLORS[t.priority]};" title="${escapeHtml(t.title)}"></span>`;
      }
      if (dayTasks.length > 5) html += `<span style="font-size:0.7em;color:#999;">+${dayTasks.length - 5}</span>`;
      html += '</div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  function renderCurrentView() {
    document.querySelectorAll('.pm-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
    $(`view${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`).classList.add('active');
    document.querySelector(`.pm-tab[data-view="${currentView}"]`).classList.add('active');

    switch (currentView) {
      case 'list': renderList(); break;
      case 'gantt': renderGantt(); break;
      case 'kanban': renderKanban(); break;
      case 'calendar': renderCalendar(); break;
    }
  }

  function updateFilterOptions(assignees, milestones) {
    const assigneeSel = $('filterAssignee');
    const currentAssignee = assigneeSel.value;
    assigneeSel.innerHTML = '<option value="">すべての担当者</option>';
    for (const a of assignees) {
      assigneeSel.innerHTML += `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`;
    }
    assigneeSel.value = currentAssignee;

    const milestoneSel = $('filterMilestone');
    const currentMilestone = milestoneSel.value;
    milestoneSel.innerHTML = '<option value="">すべてのマイルストーン</option>';
    for (const m of milestones) {
      milestoneSel.innerHTML += `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`;
    }
    milestoneSel.value = currentMilestone;
  }

  function updateBulkBar() {
    const bar = $('bulkBar');
    const count = selectedTasks.size;
    if (count > 0) {
      bar.classList.add('active');
      $('selectedCount').textContent = `${count} 件選択`;
    } else {
      bar.classList.remove('active');
    }
  }

  // ==========================================
  // Modal Functions
  // ==========================================
  function openModal(taskId) {
    editingTaskId = taskId || null;
    const isEdit = !!taskId;
    const task = isEdit ? TaskManager.getById(taskId) : null;

    $('modalTitle').textContent = isEdit ? 'タスク編集' : '新規タスク';
    $('taskId').value = task ? task.id : '';
    $('taskTitle').value = task ? task.title : '';
    $('taskDesc').value = task ? task.description : '';
    $('taskStatus').value = task ? task.status : 'todo';
    $('taskPriority').value = task ? task.priority : 'medium';
    $('taskAssignee').value = task ? task.assignee : '';
    $('taskMilestone').value = task ? task.milestone : '';
    $('taskStartDate').value = task ? task.startDate : '';
    $('taskDueDate').value = task ? task.dueDate : '';
    $('taskEstimated').value = task ? task.estimatedHours : '';
    $('taskActual').value = task ? task.actualHours : '';
    $('taskProgress').value = task ? task.progress : 0;
    $('progressValue').textContent = (task ? task.progress : 0) + '%';
    $('taskTags').value = task ? (task.tags || []).join(', ') : '';
    $('btnDeleteTask').style.display = isEdit ? 'inline-block' : 'none';
    $('btnCreateGithub').style.display = isEdit ? 'inline-block' : 'none';

    // Subtasks
    const subtaskList = $('subtaskList');
    subtaskList.innerHTML = '';
    if (task && task.subtasks) {
      for (const st of task.subtasks) {
        const li = document.createElement('li');
        li.className = 'pm-subtask-item';
        li.innerHTML = `<input type="checkbox" ${st.done ? 'checked' : ''}><span class="subtask-text ${st.done ? 'done' : ''}">${escapeHtml(st.text)}</span><span class="subtask-delete">🗑️</span>`;
        li.querySelector('input').addEventListener('change', e => {
          st.done = e.target.checked;
          li.querySelector('.subtask-text').classList.toggle('done', st.done);
        });
        li.querySelector('.subtask-delete').addEventListener('click', () => li.remove());
        subtaskList.appendChild(li);
      }
    }

    // Predecessors
    const predSel = $('taskPredecessors');
    predSel.innerHTML = '';
    const allTasks = TaskManager.getAll().filter(t => t.id !== taskId);
    for (const t of allTasks) {
      const selected = task && task.predecessors && task.predecessors.includes(t.id);
      predSel.innerHTML += `<option value="${t.id}"${selected ? ' selected' : ''}>${escapeHtml(t.title)}</option>`;
    }

    // GitHub Issue link
    const ghRow = $('githubIssueRow');
    const ghLink = $('githubIssueLink');
    if (task && task.githubIssueUrl) {
      ghRow.style.display = 'block';
      ghLink.innerHTML = `<a href="${escapeHtml(task.githubIssueUrl)}" target="_blank">${escapeHtml(task.githubIssueUrl)}</a>`;
    } else {
      ghRow.style.display = 'none';
      ghLink.innerHTML = '';
    }

    // Activity log
    const logDiv = $('activityLog');
    const logs = ActivityLog.getForTask(taskId);
    if (logs.length) {
      logDiv.innerHTML = logs.map(l => `<div class="pm-activity-item"><span class="time">${formatDateTime(l.time)}</span> — ${escapeHtml(l.action)}: ${escapeHtml(l.detail)}</div>`).join('');
    } else {
      logDiv.innerHTML = '<div class="pm-activity-item">（履歴なし）</div>';
    }

    // Clear errors
    document.querySelectorAll('.pm-form-row').forEach(r => r.classList.remove('has-error'));

    $('taskModal').classList.add('active');
  }

  function closeModal() {
    $('taskModal').classList.remove('active');
    editingTaskId = null;
  }

  function saveTask() {
    const title = $('taskTitle').value.trim();
    if (!title) {
      $('taskTitle').closest('.pm-form-row').classList.add('has-error');
      return;
    }
    document.querySelectorAll('.pm-form-row').forEach(r => r.classList.remove('has-error'));

    const startDate = $('taskStartDate').value;
    const dueDate = $('taskDueDate').value;
    if (startDate && dueDate && startDate > dueDate) {
      alert('開始日は締切日より前である必要があります');
      return;
    }

    const subtasks = [];
    $('subtaskList').querySelectorAll('.pm-subtask-item').forEach(li => {
      subtasks.push({
        text: li.querySelector('.subtask-text').textContent,
        done: li.querySelector('input').checked
      });
    });

    const predecessors = Array.from($('taskPredecessors').selectedOptions).map(o => o.value);
    if (TaskManager.checkCircularDeps(editingTaskId || generateId(), predecessors)) {
      alert('循環依存が検出されました。依存関係を見直してください。');
      return;
    }

    const data = {
      title,
      description: $('taskDesc').value.trim(),
      status: $('taskStatus').value,
      priority: $('taskPriority').value,
      assignee: $('taskAssignee').value.trim(),
      milestone: $('taskMilestone').value.trim(),
      startDate,
      dueDate,
      estimatedHours: parseFloat($('taskEstimated').value) || 0,
      actualHours: parseFloat($('taskActual').value) || 0,
      progress: parseInt($('taskProgress').value) || 0,
      tags: parseTags($('taskTags').value),
      subtasks,
      predecessors
    };

    if (editingTaskId) {
      TaskManager.update(editingTaskId, data);
    } else {
      TaskManager.add(data);
    }

    closeModal();
    renderCurrentView();
  }

  async function createGithubIssue(taskId) {
    const task = TaskManager.getById(taskId);
    if (!task) return;
    const gh = GithubConfig.load();
    if (!gh.token || !gh.repo) {
      alert('GitHub設定が未設定です。設定パネルでTokenとリポジトリを設定してください。');
      $('settingsPanel').classList.add('active');
      return;
    }
    try {
      const issue = await GithubAPI.createIssue(task, gh.token, gh.repo);
      TaskManager.update(taskId, { githubIssueUrl: issue.html_url });
      ActivityLog.add(taskId, 'GitHub Issue作成', issue.html_url);
      alert(`GitHub Issueを作成しました:\n${issue.html_url}`);
      if (editingTaskId === taskId) openModal(taskId);
      renderCurrentView();
    } catch (e) {
      alert('GitHub Issue作成に失敗しました:\n' + e.message);
    }
  }

  // ==========================================
  // Snapshot Functions
  // ==========================================
  function renderSnapshots() {
    const list = $('snapshotList');
    const snaps = Snapshots.load();
    if (!snaps.length) {
      list.innerHTML = '<div style="color:#999;font-size:0.85em;">スナップショットはありません</div>';
      return;
    }
    list.innerHTML = snaps.map(s => `
      <div class="pm-snapshot-item">
        <span>${escapeHtml(s.name)} <small style="color:#999;">(${formatDateTime(s.createdAt)})</small></span>
        <div>
          <button class="pm-btn small secondary btn-restore" data-name="${escapeHtml(s.name)}">復元</button>
          <button class="pm-btn small danger btn-delete-snap" data-name="${escapeHtml(s.name)}">削除</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.btn-restore').forEach(btn => {
      btn.addEventListener('click', () => {
        const snap = Snapshots.get(btn.dataset.name);
        if (snap && confirm(`「${snap.name}」を復元しますか？現在のタスクは上書きされます。`)) {
          TaskManager.tasks = JSON.parse(JSON.stringify(snap.tasks));
          TaskManager.save();
          renderCurrentView();
        }
      });
    });

    list.querySelectorAll('.btn-delete-snap').forEach(btn => {
      btn.addEventListener('click', () => {
        Snapshots.delete(btn.dataset.name);
        renderSnapshots();
      });
    });
  }

  // ==========================================
  // Event Listeners
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    TaskManager.load();

    // View tabs
    document.querySelectorAll('.pm-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        currentView = tab.dataset.view;
        Settings.set('view', currentView);
        renderCurrentView();
      });
    });

    // Filters
    ['filterStatus', 'filterPriority', 'filterAssignee', 'filterMilestone'].forEach(id => {
      $(id).addEventListener('change', () => {
        currentFilters = {
          status: $('filterStatus').value,
          priority: $('filterPriority').value,
          assignee: $('filterAssignee').value,
          milestone: $('filterMilestone').value,
          search: $('searchBox').value.trim()
        };
        renderCurrentView();
      });
    });

    $('searchBox').addEventListener('input', () => {
      currentFilters.search = $('searchBox').value.trim();
      renderCurrentView();
    });

    // New task
    $('btnNewTask').addEventListener('click', () => openModal());

    // Modal
    $('modalClose').addEventListener('click', closeModal);
    $('btnCancel').addEventListener('click', closeModal);
    $('btnSaveTask').addEventListener('click', saveTask);
    $('btnDeleteTask').addEventListener('click', () => {
      if (editingTaskId && confirm('このタスクを削除しますか？')) {
        TaskManager.delete(editingTaskId);
        closeModal();
        renderCurrentView();
      }
    });
    $('btnCreateGithub').addEventListener('click', () => {
      if (editingTaskId) createGithubIssue(editingTaskId);
    });

    $('taskProgress').addEventListener('input', e => {
      $('progressValue').textContent = e.target.value + '%';
    });

    $('btnAddSubtask').addEventListener('click', () => {
      const text = $('newSubtask').value.trim();
      if (!text) return;
      const li = document.createElement('li');
      li.className = 'pm-subtask-item';
      li.innerHTML = `<input type="checkbox"><span class="subtask-text">${escapeHtml(text)}</span><span class="subtask-delete">🗑️</span>`;
      li.querySelector('.subtask-delete').addEventListener('click', () => li.remove());
      $('subtaskList').appendChild(li);
      $('newSubtask').value = '';
    });

    // Export
    $('btnExportJson').addEventListener('click', () => {
      const json = TaskManager.exportJSON();
      downloadBlob(json, `rui-pm-tasks-${todayStr()}.json`, 'application/json');
    });

    $('btnExportCsv').addEventListener('click', () => {
      const csv = TaskManager.exportCSV();
      downloadBlob('\uFEFF' + csv, `rui-pm-tasks-${todayStr()}.csv`, 'text/csv;charset=utf-8');
    });

    // Import
    $('btnImport').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          let tasks;
          if (file.name.endsWith('.json')) {
            tasks = TaskManager.importJSON(ev.target.result);
          } else {
            tasks = TaskManager.importCSV(ev.target.result);
          }
          const overwrite = confirm('同じIDのタスクが存在する場合、上書きしますか？\n「キャンセル」を選択すると、新規タスクのみ追加されます。');
          const result = TaskManager.merge(tasks, overwrite);
          alert(`インポート完了: ${result.added}件追加, ${result.updated}件更新`);
          renderCurrentView();
        } catch (err) {
          alert('インポートに失敗しました: ' + err.message);
        }
        $('btnImport').value = '';
      };
      reader.readAsText(file);
    });

    // Settings
    $('btnSettings').addEventListener('click', () => {
      $('settingsPanel').classList.toggle('active');
      const gh = GithubConfig.load();
      $('githubToken').value = gh.token || '';
      $('githubRepo').value = gh.repo || '';
      renderSnapshots();
    });

    $('btnSaveSettings').addEventListener('click', () => {
      GithubConfig.save({
        token: $('githubToken').value.trim(),
        repo: $('githubRepo').value.trim()
      });
      alert('設定を保存しました');
    });

    $('btnCloseSettings').addEventListener('click', () => {
      $('settingsPanel').classList.remove('active');
    });

    $('btnSaveSnapshot').addEventListener('click', () => {
      const name = $('snapshotName').value.trim();
      if (!name) return;
      Snapshots.add(name, TaskManager.getAll());
      $('snapshotName').value = '';
      renderSnapshots();
    });

    // Theme
    $('btnTheme').addEventListener('click', () => {
      const wrap = $('pmApp');
      wrap.classList.toggle('dark-theme');
      Settings.set('darkTheme', wrap.classList.contains('dark-theme'));
    });

    // Bulk actions
    $('btnBulkClear').addEventListener('click', () => {
      selectedTasks.clear();
      renderCurrentView();
      updateBulkBar();
    });

    $('btnBulkDelete').addEventListener('click', () => {
      if (!selectedTasks.size) return;
      if (confirm(`${selectedTasks.size}件のタスクを削除しますか？`)) {
        for (const id of selectedTasks) TaskManager.delete(id);
        selectedTasks.clear();
        updateBulkBar();
        renderCurrentView();
      }
    });

    $('btnBulkStatus').addEventListener('click', () => {
      if (!selectedTasks.size) return;
      const newStatus = prompt('新しいステータスを入力してください (todo / doing / done):', 'doing');
      if (!newStatus || !STATUS_LABELS[newStatus]) return;
      for (const id of selectedTasks) {
        TaskManager.update(id, { status: newStatus });
      }
      renderCurrentView();
    });

    $('btnBulkGithub').addEventListener('click', () => {
      if (!selectedTasks.size) return;
      const gh = GithubConfig.load();
      if (!gh.token || !gh.repo) {
        alert('GitHub設定が未設定です。');
        return;
      }
      let count = 0;
      for (const id of selectedTasks) {
        createGithubIssue(id);
        count++;
      }
      alert(`${count}件のGitHub Issue作成を開始しました`);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'n') {
          e.preventDefault();
          openModal();
        }
      }
      if (e.key === 'Escape') {
        if ($('taskModal').classList.contains('active')) {
          closeModal();
        }
      }
      if (e.key === '/') {
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          $('searchBox').focus();
        }
      }
    });

    // Init
    if (Settings.get('darkTheme')) {
      $('pmApp').classList.add('dark-theme');
    }
    renderCurrentView();
  });
})();
</script>
