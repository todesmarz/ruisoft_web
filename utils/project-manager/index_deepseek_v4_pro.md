---
layout: default
title: プロジェクト管理 (DeepSeek v4 Pro) - Rui Software
---

<style>
/* ============================================
   Project Manager - DeepSeek v4 Pro
   Namespace: .pm-wrap / pm- prefix
   ============================================ */

/* --- Base --- */
.pm-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: #333;
  --pm-accent: #2e8b57;
  --pm-accent-hover: #1a5c38;
  --pm-panel-bg: #f7faf8;
  --pm-panel-border: #dde8e2;
  --pm-hover-bg: #eaf3ee;
  --pm-danger: #dc3545;
  --pm-warning: #ffc107;
  --pm-pri-high: #dc3545;
  --pm-pri-med: #ffc107;
  --pm-pri-low: #2e8b57;
}
.pm-wrap h2 { font-size:1.4em; font-weight:400; border-left:6px solid #2e8b57; padding-left:10px; margin-bottom:16px; }

/* --- Buttons --- */
.pm-btn {
  display:inline-block; padding:5px 12px; border:1px solid #2e8b57;
  background:#2e8b57; color:#fff; border-radius:3px; cursor:pointer;
  font-size:0.9em; transition:.2s; text-decoration:none; font-family:inherit;
}
.pm-btn:hover { background:#1a5c38; border-color:#1a5c38; color:#fff; }
.pm-btn.secondary { background:#fff; color:#2e8b57; }
.pm-btn.secondary:hover { background:#eaf3ee; }
.pm-btn.danger { background:#dc3545; border-color:#dc3545; }
.pm-btn.danger:hover { background:#a71d2a; border-color:#a71d2a; }
.pm-btn.small { padding:3px 8px; font-size:0.8em; }
.pm-btn:disabled { opacity:0.5; cursor:not-allowed; }

/* --- Controls Bar --- */
.pm-controls {
  display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:16px;
  padding:10px 12px; background:#f7faf8; border:1px solid #dde8e2; border-radius:4px;
}
.pm-controls .ctrl-group { display:flex; align-items:center; gap:6px; }
.pm-controls .ctrl-sep { color:#aaccbb; margin:0 4px; }

/* --- Tabs --- */
.pm-tab-group { display:flex; gap:2px; }
.pm-tab {
  padding:5px 14px; border:1px solid #aaccbb; background:#fff; color:#333;
  border-radius:3px 3px 0 0; cursor:pointer; font-size:0.9em;
  border-bottom:none; position:relative; top:1px; font-family:inherit;
}
.pm-tab.active { background:#f7faf8; border-color:#2e8b57; color:#2e8b57; font-weight:bold; border-bottom:1px solid #f7faf8; z-index:2; }
.pm-tab:hover:not(.active) { background:#eaf3ee; }

/* --- Filters --- */
.pm-filter-group { display:flex; gap:6px; flex-wrap:wrap; }
.pm-filter-group select, .pm-filter-group input {
  padding:4px 8px; border:1px solid #ccc; border-radius:3px; font-size:0.85em; font-family:inherit;
}
.pm-search-box { min-width:160px; }

/* --- View Container --- */
.pm-view-container { border:1px solid #dde8e2; border-radius:0 4px 4px 4px; background:#fff; min-height:400px; overflow:auto; }
.pm-view { display:none; padding:12px; }
.pm-view.active { display:block; }

/* --- List View / Table --- */
.pm-table { width:100%; border-collapse:collapse; font-size:0.9em; }
.pm-table th, .pm-table td { padding:8px 10px; text-align:left; border-bottom:1px solid #eee; }
.pm-table th { background:#f7faf8; font-weight:600; cursor:pointer; user-select:none; white-space:nowrap; }
.pm-table th:hover { background:#eaf3ee; }
.pm-table th .sort-arrow { margin-left:4px; color:#999; }
.pm-table th.sort-asc .sort-arrow::after { content:' ▲'; }
.pm-table th.sort-desc .sort-arrow::after { content:' ▼'; }
.pm-table tr:hover td { background:#f7faf8; }
.pm-table td { vertical-align:middle; }
.pm-table .col-check { width:30px; text-align:center; }
.pm-table .col-actions { width:110px; text-align:center; white-space:nowrap; }
.pm-table .col-actions .pm-btn { padding:2px 6px; font-size:0.75em; margin:0 1px; }

/* --- Badges --- */
.pm-priority { display:inline-block; padding:2px 8px; border-radius:3px; font-size:0.8em; font-weight:600; }
.pm-priority.high { background:#f8d7da; color:#721c24; }
.pm-priority.medium { background:#fff3cd; color:#856404; }
.pm-priority.low { background:#d4edda; color:#155724; }
.pm-status { display:inline-block; padding:2px 8px; border-radius:3px; font-size:0.8em; }
.pm-status.todo { background:#e2e3e5; color:#383d41; }
.pm-status.doing { background:#cce5ff; color:#004085; }
.pm-status.done { background:#d4edda; color:#155724; }
.pm-tag { display:inline-block; padding:1px 6px; margin:1px; background:#eaf3ee; color:#2e8b57; border-radius:3px; font-size:0.75em; }

/* --- Progress Bar --- */
.pm-progress-wrap { width:100px; background:#e9ecef; border-radius:3px; height:14px; overflow:hidden; display:inline-block; vertical-align:middle; }
.pm-progress-bar { height:100%; background:#2e8b57; border-radius:3px; transition:width .3s; }
.pm-progress-text { font-size:0.8em; margin-left:6px; color:#666; }

/* --- Bulk Bar --- */
.pm-bulk-bar { display:none; padding:8px 12px; background:#eaf3ee; border:1px solid #2e8b57; border-radius:4px; margin-bottom:8px; align-items:center; gap:10px; flex-wrap:wrap; }
.pm-bulk-bar.active { display:flex; }
.pm-bulk-bar .selected-count { font-weight:600; color:#2e8b57; }

/* --- Empty State --- */
.pm-empty-state { text-align:center; padding:60px 20px; color:#999; }
.pm-empty-state .icon { font-size:3em; margin-bottom:12px; }

/* --- Gantt Chart --- */
.pm-gantt-wrap { overflow-x:auto; min-height:300px; position:relative; }
.pm-gantt-grid { display:grid; gap:1px; background:#ddd; border:1px solid #ddd; min-width:600px; }
.pm-gantt-header { background:#f7faf8; padding:6px 8px; font-weight:600; font-size:0.85em; text-align:center; white-space:nowrap; }
.pm-gantt-header.task-col { text-align:left; position:sticky; left:0; z-index:2; background:#f7faf8; }
.pm-gantt-row { background:#fff; padding:6px 8px; font-size:0.85em; position:relative; min-height:32px; display:flex; align-items:center; }
.pm-gantt-row.task-col { position:sticky; left:0; z-index:1; background:#fff; border-right:1px solid #ddd; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pm-gantt-row.task-col:hover { background:#f7faf8; cursor:pointer; }
.pm-gantt-bar { position:absolute; top:4px; height:calc(100% - 8px); border-radius:3px; min-width:4px; cursor:pointer; opacity:0.85; transition:opacity .2s; display:flex; align-items:center; padding:0 4px; font-size:0.75em; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; z-index:3; }
.pm-gantt-bar:hover { opacity:1; z-index:10; }
.pm-gantt-bar.high { background:#dc3545; }
.pm-gantt-bar.medium { background:#ffc107; color:#333; }
.pm-gantt-bar.low { background:#2e8b57; }
.pm-gantt-today { position:absolute; top:0; bottom:0; width:2px; background:#e74c3c; z-index:5; pointer-events:none; }
.pm-gantt-milestone { position:absolute; top:50%; transform:translate(-50%,-50%) rotate(45deg); width:10px; height:10px; background:#9b59b6; z-index:6; cursor:pointer; }
.pm-gantt-svg { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:4; }
.pm-gantt-svg line { stroke:#888; stroke-width:1.5; marker-end:url(#arrowhead); }

/* --- Kanban Board --- */
.pm-kanban-board { display:flex; gap:12px; min-height:400px; overflow-x:auto; }
.pm-kanban-col { flex:1; min-width:260px; max-width:320px; background:#f7faf8; border-radius:4px; border:1px solid #dde8e2; display:flex; flex-direction:column; }
.pm-kanban-header { padding:10px 12px; font-weight:600; font-size:0.95em; border-bottom:2px solid #dde8e2; display:flex; justify-content:space-between; align-items:center; }
.pm-kanban-header .count-badge { background:#2e8b57; color:#fff; padding:2px 8px; border-radius:10px; font-size:0.8em; }
.pm-kanban-body { flex:1; padding:8px; overflow-y:auto; min-height:100px; transition:background .2s; }
.pm-kanban-body.drag-over { background:#eaf3ee; border:2px dashed #2e8b57; border-radius:4px; }
.pm-kanban-card { background:#fff; border:1px solid #dde8e2; border-radius:4px; padding:10px; margin-bottom:8px; cursor:grab; transition:box-shadow .2s, transform .2s; }
.pm-kanban-card:hover { box-shadow:0 2px 8px rgba(0,0,0,0.1); }
.pm-kanban-card.dragging { opacity:0.5; cursor:grabbing; }
.pm-kanban-card .card-title { font-weight:600; font-size:0.9em; margin-bottom:6px; word-break:break-word; }
.pm-kanban-card .card-meta { display:flex; flex-wrap:wrap; gap:4px; align-items:center; font-size:0.8em; color:#666; margin-bottom:4px; }
.pm-kanban-card .card-footer { display:flex; justify-content:space-between; align-items:center; margin-top:6px; padding-top:6px; border-top:1px solid #eee; }
.pm-kanban-card .card-progress { width:60px; }

/* --- Calendar --- */
.pm-calendar-nav { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.pm-calendar-nav .month-label { font-size:1.1em; font-weight:600; }
.pm-calendar-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:1px; background:#ddd; border:1px solid #ddd; }
.pm-calendar-header { background:#f7faf8; padding:8px; text-align:center; font-weight:600; font-size:0.85em; }
.pm-calendar-header.sun { color:#e74c3c; }
.pm-calendar-header.sat { color:#3498db; }
.pm-calendar-day { background:#fff; min-height:80px; padding:6px; font-size:0.8em; position:relative; }
.pm-calendar-day .day-number { font-weight:600; margin-bottom:4px; }
.pm-calendar-day .day-tasks { display:flex; flex-wrap:wrap; gap:3px; }
.pm-calendar-day .day-task-dot { width:8px; height:8px; border-radius:50%; display:inline-block; cursor:pointer; }
.pm-calendar-day.today { background:#eaf3ee; }
.pm-calendar-day.other-month { background:#f9f9f9; color:#bbb; }
.pm-calendar-day .day-task-more { font-size:0.7em; color:#999; cursor:pointer; }

/* --- Settings Panel --- */
.pm-settings-panel { display:none; padding:12px; background:#f7faf8; border:1px solid #dde8e2; border-radius:4px; margin-bottom:12px; }
.pm-settings-panel.active { display:block; }

/* --- Modal --- */
.pm-modal-overlay { display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center; }
.pm-modal-overlay.active { display:flex; }
.pm-modal { background:#fff; border-radius:4px; width:90%; max-width:620px; max-height:90vh; overflow-y:auto; box-shadow:0 4px 20px rgba(0,0,0,0.2); }
.pm-modal-header { padding:14px 18px; border-bottom:1px solid #dde8e2; display:flex; justify-content:space-between; align-items:center; }
.pm-modal-header h3 { margin:0; font-size:1.1em; font-weight:600; }
.pm-modal-close { background:none; border:none; font-size:1.4em; cursor:pointer; color:#999; line-height:1; }
.pm-modal-close:hover { color:#333; }
.pm-modal-body { padding:16px 18px; }
.pm-modal-footer { padding:12px 18px; border-top:1px solid #dde8e2; display:flex; justify-content:flex-end; gap:8px; }

/* --- Form --- */
.pm-form-row { margin-bottom:12px; }
.pm-form-row label { display:block; font-size:0.85em; font-weight:600; margin-bottom:4px; color:#555; }
.pm-form-row input[type="text"], .pm-form-row input[type="date"],
.pm-form-row input[type="number"], .pm-form-row select, .pm-form-row textarea {
  width:100%; padding:6px 10px; border:1px solid #ccc; border-radius:3px;
  font-family:inherit; font-size:0.9em; box-sizing:border-box;
}
.pm-form-row textarea { min-height:80px; resize:vertical; }
.pm-form-row input[type="range"] { width:100%; }
.pm-form-row .range-value { display:inline-block; margin-left:8px; font-weight:600; color:#2e8b57; }
.pm-form-row .error-msg { color:#dc3545; font-size:0.8em; margin-top:4px; display:none; }
.pm-form-row.has-error input, .pm-form-row.has-error select, .pm-form-row.has-error textarea { border-color:#dc3545; }
.pm-form-row.has-error .error-msg { display:block; }
.pm-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.pm-form-inline { display:flex; gap:6px; align-items:center; }

/* --- Activity Log --- */
.pm-activity-log { max-height:200px; overflow-y:auto; border:1px solid #eee; border-radius:3px; padding:8px; background:#fafafa; }
.pm-activity-item { padding:4px 0; border-bottom:1px solid #eee; font-size:0.85em; color:#666; }
.pm-activity-item:last-child { border-bottom:none; }
.pm-activity-item .time { color:#999; font-size:0.85em; }

/* --- Subtasks --- */
.pm-subtask-list { list-style:none; padding:0; margin:0; }
.pm-subtask-item { display:flex; align-items:center; gap:8px; padding:4px 0; border-bottom:1px solid #eee; }
.pm-subtask-item input[type="checkbox"] { margin:0; }
.pm-subtask-item .subtask-text { flex:1; font-size:0.9em; }
.pm-subtask-item .subtask-text.done { text-decoration:line-through; color:#999; }
.pm-subtask-delete { color:#dc3545; cursor:pointer; font-size:0.85em; background:none; border:none; }

/* --- Snapshot --- */
.pm-snapshot-list { max-height:150px; overflow-y:auto; border:1px solid #eee; border-radius:3px; padding:8px; }
.pm-snapshot-item { display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid #eee; font-size:0.85em; }
.pm-snapshot-item:last-child { border-bottom:none; }

/* --- Toast --- */
.pm-toast { position:fixed; bottom:24px; right:24px; background:#333; color:#fff; padding:10px 20px; border-radius:4px; z-index:2000; opacity:0; transition:opacity .3s; pointer-events:none; font-size:0.9em; }
.pm-toast.show { opacity:1; }

/* --- Dark Theme --- */
.pm-wrap.dark { color:#e0e0e0; }
.pm-wrap.dark .pm-controls,
.pm-wrap.dark .pm-table th,
.pm-wrap.dark .pm-gantt-header,
.pm-wrap.dark .pm-kanban-col,
.pm-wrap.dark .pm-settings-panel,
.pm-wrap.dark .pm-activity-log,
.pm-wrap.dark .pm-snapshot-list,
.pm-wrap.dark .pm-calendar-header { background:#2a2a2a; border-color:#444; color:#e0e0e0; }
.pm-wrap.dark .pm-view-container,
.pm-wrap.dark .pm-modal,
.pm-wrap.dark .pm-kanban-card,
.pm-wrap.dark .pm-table td,
.pm-wrap.dark .pm-calendar-day { background:#333; color:#e0e0e0; }
.pm-wrap.dark .pm-calendar-header.sun { color:#e74c3c; }
.pm-wrap.dark .pm-calendar-header.sat { color:#5dade2; }
.pm-wrap.dark .pm-table tr:hover td,
.pm-wrap.dark .pm-gantt-row.task-col:hover { background:#3a3a3a; }
.pm-wrap.dark .pm-kanban-card { border-color:#444; }
.pm-wrap.dark .pm-kanban-card .card-footer { border-color:#444; }
.pm-wrap.dark .pm-tag { background:#2e8b57; color:#fff; }
.pm-wrap.dark .pm-gantt-row { background:#333; }
.pm-wrap.dark .pm-gantt-grid { background:#2a2a2a; border-color:#555; }
.pm-wrap.dark .pm-gantt-row.task-col { background:#333; }
.pm-wrap.dark .pm-calendar-day.other-month { background:#2a2a2a; }
.pm-wrap.dark .pm-calendar-day.today { background:#3a4a3e; }
.pm-wrap.dark .pm-tab { background:#333; color:#ccc; border-color:#555; }
.pm-wrap.dark .pm-tab.active { background:#2a2a2a; color:#4ecb71; border-color:#4ecb71; border-bottom-color:#2a2a2a; }
.pm-wrap.dark .pm-tab:hover:not(.active) { background:#3a3a3a; }
.pm-wrap.dark .pm-form-row label { color:#aaa; }
.pm-wrap.dark .pm-form-row input,
.pm-wrap.dark .pm-form-row select,
.pm-wrap.dark .pm-form-row textarea { background:#2a2a2a; color:#e0e0e0; border-color:#555; }

/* --- Responsive --- */
@media (max-width:768px) {
  .pm-controls { flex-direction:column; align-items:stretch; }
  .pm-form-grid { grid-template-columns:1fr; }
  .pm-kanban-board { flex-direction:column; }
  .pm-kanban-col { max-width:100%; }
}
</style>

<div class="pm-wrap" id="pmApp">
  <h2>プロジェクト管理 (DeepSeek v4 Pro)</h2>

  <!-- Controls -->
  <div class="pm-controls">
    <div class="ctrl-group">
      <button class="pm-btn" id="btnNewTask">＋ 新規タスク</button>
      <span class="ctrl-sep">|</span>
      <div class="pm-tab-group" id="tabGroup">
        <button class="pm-tab active" data-view="list">リスト</button>
        <button class="pm-tab" data-view="gantt">ガント</button>
        <button class="pm-tab" data-view="kanban">看板</button>
        <button class="pm-tab" data-view="calendar">カレンダー</button>
      </div>
    </div>
    <div class="ctrl-group" style="margin-left:auto;">
      <input type="text" class="pm-search-box" id="searchBox" placeholder="🔍 検索...">
      <span class="ctrl-sep">|</span>
      <select id="filterStatus"><option value="">全ステータス</option><option value="todo">ToDo</option><option value="doing">Doing</option><option value="done">Done</option></select>
      <select id="filterPriority"><option value="">全優先度</option><option value="high">高</option><option value="medium">中</option><option value="low">低</option></select>
      <select id="filterAssignee"><option value="">全担当者</option></select>
      <select id="filterMilestone"><option value="">全マイルストーン</option></select>
      <span class="ctrl-sep">|</span>
      <button class="pm-btn secondary small" id="btnExportJson">JSON出力</button>
      <button class="pm-btn secondary small" id="btnExportCsv">CSV出力</button>
      <label class="pm-btn secondary small" style="cursor:pointer;">読込<input type="file" id="btnImport" accept=".json,.csv" style="display:none;"></label>
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
    <h4 style="margin-top:0;">⚙️ 設定</h4>
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
    <h4>📸 スナップショット</h4>
    <div class="pm-form-inline" style="margin-bottom:8px;">
      <input type="text" id="snapshotName" placeholder="スナップショット名" style="width:200px;">
      <button class="pm-btn small" id="btnSaveSnapshot">保存</button>
    </div>
    <div class="pm-snapshot-list" id="snapshotList"></div>
  </div>

  <!-- Views -->
  <div class="pm-view-container">
    <div class="pm-view active" id="viewList"><div id="listContent"></div></div>
    <div class="pm-view" id="viewGantt"><div id="ganttContent"></div></div>
    <div class="pm-view" id="viewKanban"><div class="pm-kanban-board" id="kanbanContent"></div></div>
    <div class="pm-view" id="viewCalendar"><div id="calendarContent"></div></div>
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
      <form id="taskForm" autocomplete="off">
        <input type="hidden" id="taskId">
        <div class="pm-form-row">
          <label>タイトル *</label>
          <input type="text" id="taskTitle" required>
          <span class="error-msg">タイトルを入力してください</span>
        </div>
        <div class="pm-form-row">
          <label>詳細</label>
          <textarea id="taskDesc" rows="3"></textarea>
        </div>
        <div class="pm-form-grid">
          <div class="pm-form-row"><label>ステータス</label><select id="taskStatus"><option value="todo">ToDo</option><option value="doing">Doing</option><option value="done">Done</option></select></div>
          <div class="pm-form-row"><label>優先度</label><select id="taskPriority"><option value="high">高</option><option value="medium" selected>中</option><option value="low">低</option></select></div>
          <div class="pm-form-row"><label>担当者</label><input type="text" id="taskAssignee" placeholder="名前"></div>
          <div class="pm-form-row"><label>マイルストーン</label><input type="text" id="taskMilestone" placeholder="マイルストーン名"></div>
          <div class="pm-form-row"><label>開始日</label><input type="date" id="taskStartDate"></div>
          <div class="pm-form-row"><label>締切日</label><input type="date" id="taskDueDate"></div>
          <div class="pm-form-row"><label>予定工数 (h)</label><input type="number" id="taskEstimated" min="0" step="0.5" placeholder="0"></div>
          <div class="pm-form-row"><label>実績工数 (h)</label><input type="number" id="taskActual" min="0" step="0.5" placeholder="0"></div>
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
          <ul class="pm-subtask-list" id="subtaskList"></ul>
          <div class="pm-form-inline" style="margin-top:6px;">
            <input type="text" id="newSubtask" placeholder="新しいサブタスク" style="flex:1;">
            <button type="button" class="pm-btn small" id="btnAddSubtask">追加</button>
          </div>
        </div>
        <div class="pm-form-row">
          <label>依存タスク（先行タスク）</label>
          <select id="taskPredecessors" multiple style="min-height:80px;"></select>
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
      <button class="pm-btn danger small" id="btnDeleteTask" style="display:none;margin-right:auto;">🗑️ 削除</button>
      <button class="pm-btn secondary" id="btnCancel">キャンセル</button>
      <button class="pm-btn secondary" id="btnCreateGithub" style="display:none;">GitHub Issue作成</button>
      <button type="button" class="pm-btn" id="btnSaveTask">保存</button>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="pm-toast" id="pmToast"></div>

<script>
(function(){
  'use strict';

  // ==========================================
  // Constants
  // ==========================================
  const LS_TASKS     = 'rui-pm-tasks';
  const LS_SETTINGS  = 'rui-pm-settings';
  const LS_GITHUB    = 'rui-pm-github';
  const LS_SNAPSHOTS = 'rui-pm-snapshots';
  const LS_ACTIVITY  = 'rui-pm-activity';

  const STATUS  = { todo:'ToDo', doing:'Doing', done:'Done' };
  const PRIORITY = { high:'高', medium:'中', low:'低' };
  const PRI_COLOR = { high:'#dc3545', medium:'#ffc107', low:'#2e8b57' };

  const $ = id => document.getElementById(id);

  // ==========================================
  // Utility Functions
  // ==========================================
  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function fmtDate(s) {
    if (!s) return '';
    const d = new Date(s + (s.length === 10 ? 'T00:00:00' : ''));
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('ja-JP');
  }

  function fmtDateTime(s) {
    if (!s) return '';
    const d = new Date(s);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('ja-JP');
  }

  function todayISO() { return new Date().toISOString().split('T')[0]; }

  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));
  }

  function parseTags(str) {
    if (!str) return [];
    return str.split(/[,，、]/).map(t => t.trim()).filter(Boolean);
  }

  function mondayOf(d) {
    const r = new Date(d);
    const day = r.getDay();
    r.setDate(r.getDate() - (day === 0 ? 6 : day - 1));
    return r;
  }

  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

  function dayDiff(a, b) {
    return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  }

  function downloadBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }

  function showToast(msg) {
    const t = $('pmToast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), 2500);
  }

  // CSV parse helper
  function parseCSVLine(line) {
    const result = []; let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === ',' && !inQ) { result.push(cur); cur = ''; }
      else cur += c;
    }
    result.push(cur);
    return result;
  }

  // ==========================================
  // Storage Helpers
  // ==========================================
  function lsGet(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  // ==========================================
  // Activity Log
  // ==========================================
  const ActivityLog = {
    all() { return lsGet(LS_ACTIVITY, []); },
    save(logs) { lsSet(LS_ACTIVITY, logs.slice(-500)); },
    add(taskId, action, detail) {
      const logs = this.all();
      logs.push({ taskId, action, detail, time: new Date().toISOString() });
      this.save(logs);
    },
    forTask(id) { return this.all().filter(l => l.taskId === id).reverse(); }
  };

  // ==========================================
  // Settings
  // ==========================================
  const Settings = {
    all() { return lsGet(LS_SETTINGS, {}); },
    save(s) { lsSet(LS_SETTINGS, s); },
    get(k, def) { const s = this.all(); return s[k] !== undefined ? s[k] : def; },
    set(k, v) { const s = this.all(); s[k] = v; this.save(s); }
  };

  // ==========================================
  // GitHub Config
  // ==========================================
  const GithubCfg = {
    all() { return lsGet(LS_GITHUB, {}); },
    save(d) { lsSet(LS_GITHUB, d); }
  };

  // ==========================================
  // Snapshots
  // ==========================================
  const Snapshots = {
    all() { return lsGet(LS_SNAPSHOTS, []); },
    save(list) { lsSet(LS_SNAPSHOTS, list); },
    add(name, tasks) {
      const list = this.all();
      list.push({ name, tasks: JSON.parse(JSON.stringify(tasks)), createdAt: new Date().toISOString() });
      this.save(list);
    },
    get(name) { return this.all().find(s => s.name === name); },
    remove(name) { this.save(this.all().filter(s => s.name !== name)); }
  };

  // ==========================================
  // Task Manager
  // ==========================================
  const TaskMgr = {
    _tasks: [],

    load() { this._tasks = lsGet(LS_TASKS, []); return this._tasks; },
    save() { lsSet(LS_TASKS, this._tasks); },

    all() { return this._tasks; },

    add(data) {
      const now = new Date().toISOString();
      const t = {
        id: uuid(), title: '', description: '', status: 'todo', priority: 'medium',
        assignee: '', startDate: '', dueDate: '', progress: 0, tags: [],
        estimatedHours: 0, actualHours: 0, milestone: '', subtasks: [],
        predecessors: [], githubIssueUrl: '', createdAt: now, updatedAt: now,
        ...data
      };
      // auto-calc progress from subtasks
      if (t.subtasks && t.subtasks.length) {
        const done = t.subtasks.filter(s => s.done).length;
        t.progress = Math.round((done / t.subtasks.length) * 100);
      }
      this._tasks.push(t);
      this.save();
      ActivityLog.add(t.id, '作成', `「${t.title}」を作成`);
      return t;
    },

    update(id, data) {
      const idx = this._tasks.findIndex(t => t.id === id);
      if (idx === -1) return null;
      const old = { ...this._tasks[idx] };
      // auto-calc progress from subtasks if subtasks provided
      if (data.subtasks && data.subtasks.length) {
        const done = data.subtasks.filter(s => s.done).length;
        data.progress = Math.round((done / data.subtasks.length) * 100);
      }
      const merged = { ...old, ...data, updatedAt: new Date().toISOString() };
      this._tasks[idx] = merged;
      this.save();
      const changes = [];
      for (const k of Object.keys(data)) {
        if (JSON.stringify(old[k]) !== JSON.stringify(data[k])) {
          changes.push(`${k}: ${JSON.stringify(old[k])} → ${JSON.stringify(data[k])}`);
        }
      }
      if (changes.length) ActivityLog.add(id, '更新', changes.join('; '));
      return merged;
    },

    remove(id) {
      const t = this._tasks.find(x => x.id === id);
      this._tasks = this._tasks.filter(x => x.id !== id);
      this.save();
      if (t) ActivityLog.add(id, '削除', `「${t.title}」を削除`);
      return t;
    },

    byId(id) { return this._tasks.find(t => t.id === id); },

    filtered(filters) {
      let r = [...this._tasks];
      if (filters.status) r = r.filter(t => t.status === filters.status);
      if (filters.priority) r = r.filter(t => t.priority === filters.priority);
      if (filters.assignee) r = r.filter(t => t.assignee === filters.assignee);
      if (filters.milestone) r = r.filter(t => t.milestone === filters.milestone);
      if (filters.search) {
        const s = filters.search.toLowerCase();
        r = r.filter(t =>
          (t.title && t.title.toLowerCase().includes(s)) ||
          (t.description && t.description.toLowerCase().includes(s)) ||
          (t.assignee && t.assignee.toLowerCase().includes(s)) ||
          (t.milestone && t.milestone.toLowerCase().includes(s)) ||
          (t.tags && t.tags.some(tg => tg.toLowerCase().includes(s)))
        );
      }
      return r;
    },

    sort(field, asc) {
      const dir = asc ? 1 : -1;
      this._tasks.sort((a, b) => {
        let va = a[field], vb = b[field];
        if (va === undefined || va === null) va = '';
        if (vb === undefined || vb === null) vb = '';
        if (field === 'dueDate' || field === 'startDate') {
          va = va || '9999-12-31'; vb = vb || '9999-12-31';
        }
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
    },

    exportJSON() { return JSON.stringify(this._tasks, null, 2); },

    exportCSV() {
      const cols = ['id','title','description','status','priority','assignee','startDate','dueDate','progress','tags','estimatedHours','actualHours','milestone','githubIssueUrl','createdAt','updatedAt'];
      const rows = this._tasks.map(t => cols.map(k => {
        const v = k === 'tags' ? (t.tags || []).join(';') : (t[k] ?? '');
        const s = String(v);
        return (s.includes(',') || s.includes('"') || s.includes('\n')) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }));
      return [cols.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    importJSON(raw) {
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) throw new Error('配列形式ではありません');
      return data;
    },

    importCSV(raw) {
      const lines = raw.trim().split('\n');
      if (lines.length < 2) throw new Error('データがありません');
      const headers = parseCSVLine(lines[0]);
      const result = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i]);
        const t = {};
        headers.forEach((h, j) => {
          let v = vals[j] || '';
          if (h === 'tags') v = v.split(';').filter(Boolean);
          if (['progress','estimatedHours','actualHours'].includes(h)) v = parseFloat(v) || 0;
          t[h] = v;
        });
        result.push(t);
      }
      return result;
    },

    merge(tasks, overwrite) {
      let added = 0, updated = 0;
      for (const t of tasks) {
        const ex = this._tasks.find(x => x.id === t.id);
        if (ex) {
          if (overwrite) { Object.assign(ex, t, { updatedAt: new Date().toISOString() }); updated++; }
        } else {
          this._tasks.push({ ...t, id: t.id || uuid(), createdAt: t.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
          added++;
        }
      }
      this.save();
      return { added, updated };
    },

    // Circular dependency detection
    hasCircular(taskId, predIds, visited) {
      if (!predIds || !predIds.length) return false;
      visited = visited || new Set();
      if (visited.has(taskId)) return true;
      visited.add(taskId);
      for (const pid of predIds) {
        const p = this.byId(pid);
        if (p && p.predecessors && this.hasCircular(pid, p.predecessors, new Set(visited))) return true;
      }
      return false;
    }
  };

  // ==========================================
  // GitHub API
  // ==========================================
  const GithubAPI = {
    async createIssue(task, token, repo) {
      const [owner, name] = repo.split('/');
      if (!owner || !name) throw new Error('リポジトリは owner/repo 形式で指定してください');
      const body = [
        '## タスク情報',
        '',
        `- **優先度**: ${PRIORITY[task.priority] || task.priority}`,
        `- **担当者**: ${task.assignee || '未設定'}`,
        `- **開始日**: ${task.startDate || '未設定'}`,
        `- **締切日**: ${task.dueDate || '未設定'}`,
        `- **進捗**: ${task.progress}%`,
        `- **予定工数**: ${task.estimatedHours || 0}h`,
        `- **実績工数**: ${task.actualHours || 0}h`,
        `- **マイルストーン**: ${task.milestone || '未設定'}`,
        '',
        '## 詳細',
        '',
        task.description || '（詳細なし）',
        '',
        '---',
        '*Created from Project Manager (DeepSeek v4 Pro)*'
      ].join('\n');
      const res = await fetch(`https://api.github.com/repos/${owner}/${name}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: task.title, body })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      return res.json();
    }
  };

  // ==========================================
  // UI State
  // ==========================================
  let currentView   = Settings.get('view', 'list');
  let currentSort   = { field: 'updatedAt', asc: false };
  let selectedIds   = new Set();
  let currentFilters = {};
  let editingId     = null;
  let calendarYear, calendarMonth; // for calendar navigation

  // ==========================================
  // Render: List View
  // ==========================================
  function renderList() {
    const tasks = TaskMgr.filtered(currentFilters);
    const container = $('listContent');
    if (!tasks.length) {
      container.innerHTML = '<div class="pm-empty-state"><div class="icon">📋</div><p>タスクがありません。「＋ 新規タスク」から追加してください。</p></div>';
      return;
    }

    // Update filter dropdowns
    const all = TaskMgr.all();
    const assignees = [...new Set(all.map(t => t.assignee).filter(Boolean))].sort();
    const milestones = [...new Set(all.map(t => t.milestone).filter(Boolean))].sort();
    updateFilterOpts('filterAssignee', assignees);
    updateFilterOpts('filterMilestone', milestones);

    const cols = [
      { key:'title', label:'タイトル' },
      { key:'status', label:'ステータス' },
      { key:'priority', label:'優先度' },
      { key:'assignee', label:'担当者' },
      { key:'dueDate', label:'締切日' },
      { key:'progress', label:'進捗' },
      { key:'tags', label:'タグ' },
      { key:'estimatedHours', label:'工数' }
    ];

    let h = '<table class="pm-table"><thead><tr>';
    h += '<th class="col-check"><input type="checkbox" id="selectAll"></th>';
    for (const c of cols) {
      const cls = currentSort.field === c.key ? (currentSort.asc ? 'sort-asc' : 'sort-desc') : '';
      h += `<th class="${cls}" data-sort="${c.key}">${c.label}<span class="sort-arrow"></span></th>`;
    }
    h += '<th class="col-actions">操作</th></tr></thead><tbody>';

    for (const t of tasks) {
      const tagsHtml = (t.tags || []).map(tg => `<span class="pm-tag">${escHtml(tg)}</span>`).join('');
      const hrs = t.estimatedHours ? `${t.estimatedHours}h` : '-';
      const ghLink = t.githubIssueUrl ? ` <a href="${escHtml(t.githubIssueUrl)}" target="_blank" title="GitHub">🔗</a>` : '';
      h += `<tr data-id="${t.id}">`;
      h += `<td class="col-check"><input type="checkbox" class="task-check" data-id="${t.id}"${selectedIds.has(t.id)?' checked':''}></td>`;
      h += `<td>${escHtml(t.title)}${ghLink}</td>`;
      h += `<td><span class="pm-status ${t.status}">${STATUS[t.status]}</span></td>`;
      h += `<td><span class="pm-priority ${t.priority}">${PRIORITY[t.priority]}</span></td>`;
      h += `<td>${escHtml(t.assignee || '-')}</td>`;
      h += `<td>${fmtDate(t.dueDate) || '-'}</td>`;
      h += `<td><div class="pm-progress-wrap"><div class="pm-progress-bar" style="width:${t.progress}%"></div></div><span class="pm-progress-text">${t.progress}%</span></td>`;
      h += `<td>${tagsHtml}</td>`;
      h += `<td>${hrs}</td>`;
      h += `<td class="col-actions"><button class="pm-btn small btn-edit" data-id="${t.id}">編集</button><button class="pm-btn small secondary btn-gh" data-id="${t.id}">GH</button></td>`;
      h += '</tr>';
    }
    h += '</tbody></table>';
    container.innerHTML = h;

    // Sort headers
    container.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const f = th.dataset.sort;
        currentSort = (currentSort.field === f) ? { field: f, asc: !currentSort.asc } : { field: f, asc: true };
        TaskMgr.sort(f, currentSort.asc);
        renderList();
      });
    });

    // Select all
    $('selectAll').addEventListener('change', e => {
      container.querySelectorAll('.task-check').forEach(cb => {
        cb.checked = e.target.checked;
        if (e.target.checked) selectedIds.add(cb.dataset.id); else selectedIds.delete(cb.dataset.id);
      });
      updateBulkBar();
    });

    // Individual checkboxes
    container.querySelectorAll('.task-check').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) selectedIds.add(cb.dataset.id); else selectedIds.delete(cb.dataset.id);
        updateBulkBar();
      });
    });

    // Edit buttons
    container.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => openModal(b.dataset.id)));
    // GH buttons
    container.querySelectorAll('.btn-gh').forEach(b => b.addEventListener('click', () => createGHIssue(b.dataset.id)));
  }

  function updateFilterOpts(elId, values) {
    const sel = $(elId);
    const cur = sel.value;
    sel.innerHTML = `<option value="">${sel.dataset.all || 'すべて'}</option>`;
    for (const v of values) sel.innerHTML += `<option value="${escHtml(v)}">${escHtml(v)}</option>`;
    sel.value = cur;
  }

  // ==========================================
  // Render: Gantt Chart
  // ==========================================
  function renderGantt() {
    const tasks = TaskMgr.filtered(currentFilters).filter(t => t.startDate && t.dueDate);
    const container = $('ganttContent');
    if (!tasks.length) {
      container.innerHTML = '<div class="pm-empty-state"><div class="icon">📊</div><p>ガントチャートを表示するには開始日と締切日を設定してください。</p></div>';
      return;
    }

    let minD = new Date(tasks[0].startDate + 'T00:00:00');
    let maxD = new Date(tasks[0].dueDate + 'T00:00:00');
    for (const t of tasks) {
      const s = new Date(t.startDate + 'T00:00:00'), d = new Date(t.dueDate + 'T00:00:00');
      if (s < minD) minD = s; if (d > maxD) maxD = d;
    }
    minD = mondayOf(minD);
    maxD = mondayOf(addDays(maxD, 7));
    const totalWeeks = Math.max(4, Math.ceil(dayDiff(minD.toISOString().split('T')[0], maxD.toISOString().split('T')[0]) / 7));
    const minDateStr = minD.toISOString().split('T')[0];

    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'pm-gantt-wrap';

    const grid = document.createElement('div');
    grid.className = 'pm-gantt-grid';
    grid.style.gridTemplateColumns = `200px repeat(${totalWeeks}, 1fr)`;

    // Header
    const hTask = document.createElement('div');
    hTask.className = 'pm-gantt-header task-col'; hTask.textContent = 'タスク';
    grid.appendChild(hTask);
    for (let i = 0; i < totalWeeks; i++) {
      const ws = addDays(minD, i * 7);
      const hd = document.createElement('div');
      hd.className = 'pm-gantt-header'; hd.textContent = `${ws.getMonth()+1}/${ws.getDate()}`;
      grid.appendChild(hd);
    }

    const today = new Date();
    const todayOff = dayDiff(minDateStr, todayISO());
    const ganttRows = []; // store row data for SVG arrows

    for (const t of tasks) {
      const startOff = dayDiff(minDateStr, t.startDate);
      const duration = Math.max(0.5, dayDiff(t.startDate, t.dueDate));
      const leftPct = (startOff / (totalWeeks * 7)) * 100;
      const widthPct = (duration / (totalWeeks * 7)) * 100;

      // Task name cell
      const nameCell = document.createElement('div');
      nameCell.className = 'pm-gantt-row task-col';
      nameCell.textContent = t.title;
      nameCell.title = t.title;
      nameCell.addEventListener('click', () => openModal(t.id));
      grid.appendChild(nameCell);

      // Week cells
      for (let i = 0; i < totalWeeks; i++) {
        const cell = document.createElement('div');
        cell.className = 'pm-gantt-row';
        cell.style.position = 'relative';

        if (i === 0) {
          // Bar
          const bar = document.createElement('div');
          bar.className = `pm-gantt-bar ${t.priority}`;
          bar.style.left = leftPct + '%';
          bar.style.width = Math.max(widthPct, 1) + '%';
          bar.textContent = t.title;
          bar.dataset.id = t.id;
          bar.addEventListener('click', e => { e.stopPropagation(); openModal(t.id); });
          cell.appendChild(bar);

          // Milestone diamond
          if (t.milestone) {
            const msOff = dayDiff(minDateStr, t.dueDate);
            const msPct = (msOff / (totalWeeks * 7)) * 100;
            const ms = document.createElement('div');
            ms.className = 'pm-gantt-milestone';
            ms.style.left = msPct + '%';
            ms.title = 'マイルストーン: ' + t.milestone;
            cell.appendChild(ms);
          }
        }

        // Today line
        if (todayOff >= i * 7 && todayOff < (i + 1) * 7) {
          const line = document.createElement('div');
          line.className = 'pm-gantt-today';
          const dayInWeek = todayOff - i * 7;
          line.style.left = (dayInWeek / 7 * 100) + '%';
          cell.appendChild(line);
        }
        grid.appendChild(cell);
      }

      // Store for arrows
      ganttRows.push({
        id: t.id,
        leftPct, widthPct,
        startOff, duration,
        predecessors: t.predecessors || [],
        rowIdx: ganttRows.length
      });
    }

    wrap.appendChild(grid);
    container.appendChild(wrap);

    // SVG overlay for dependency arrows (must be after DOM insertion for offsetWidth)
    if (ganttRows.some(r => r.predecessors.length)) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('pm-gantt-svg');
      svg.style.position = 'absolute'; svg.style.top = '0'; svg.style.left = '0';
      svg.style.width = '100%'; svg.style.height = '100%'; svg.style.pointerEvents = 'none'; svg.style.zIndex = '4';

      // Arrow marker
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrowhead');
      marker.setAttribute('markerWidth', '8'); marker.setAttribute('markerHeight', '6');
      marker.setAttribute('refX', '8'); marker.setAttribute('refY', '3');
      marker.setAttribute('orient', 'auto');
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', '0 0, 8 3, 0 6');
      poly.setAttribute('fill', '#888');
      marker.appendChild(poly);
      defs.appendChild(marker);
      svg.appendChild(defs);

      const rowHeight = 33; // approximate row height
      const headerH = 33;
      const taskColW = 200;

      for (const row of ganttRows) {
        for (const predId of row.predecessors) {
          const predRow = ganttRows.find(r => r.id === predId);
          if (!predRow) continue;
          const x1 = taskColW + (predRow.leftPct + predRow.widthPct) / 100 * (grid.offsetWidth - taskColW);
          const y1 = headerH + predRow.rowIdx * rowHeight + rowHeight / 2;
          const x2 = taskColW + row.leftPct / 100 * (grid.offsetWidth - taskColW);
          const y2 = headerH + row.rowIdx * rowHeight + rowHeight / 2;
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x1); line.setAttribute('y1', y1);
          line.setAttribute('x2', x2 - 4); line.setAttribute('y2', y2);
          line.setAttribute('stroke', '#888'); line.setAttribute('stroke-width', '1.5');
          line.setAttribute('marker-end', 'url(#arrowhead)');
          svg.appendChild(line);
        }
      }
      wrap.appendChild(svg);
    }
  }

  // ==========================================
  // Render: Kanban Board
  // ==========================================
  function renderKanban() {
    const tasks = TaskMgr.filtered(currentFilters);
    const cols = [
      { key:'todo', label:'ToDo', color:'#e2e3e5' },
      { key:'doing', label:'Doing', color:'#cce5ff' },
      { key:'done', label:'Done', color:'#d4edda' }
    ];
    const container = $('kanbanContent');
    container.innerHTML = '';

    for (const col of cols) {
      const colTasks = tasks.filter(t => t.status === col.key);
      const colDiv = document.createElement('div');
      colDiv.className = 'pm-kanban-col';
      colDiv.dataset.status = col.key;
      colDiv.innerHTML = `<div class="pm-kanban-header"><span>${col.label}</span><span class="count-badge">${colTasks.length}</span></div>`;
      const body = document.createElement('div');
      body.className = 'pm-kanban-body';
      body.dataset.status = col.key;

      for (const t of colTasks) {
        const card = document.createElement('div');
        card.className = 'pm-kanban-card';
        card.draggable = true;
        card.dataset.id = t.id;
        const tagsHtml = (t.tags || []).slice(0,3).map(tg => `<span class="pm-tag">${escHtml(tg)}</span>`).join('');
        card.innerHTML = `
          <div class="card-title">${escHtml(t.title)}</div>
          <div class="card-meta">
            <span class="pm-priority ${t.priority}">${PRIORITY[t.priority]}</span>
            ${t.assignee ? `<span>👤 ${escHtml(t.assignee)}</span>` : ''}
            ${t.dueDate ? `<span>📅 ${fmtDate(t.dueDate)}</span>` : ''}
          </div>
          ${tagsHtml ? `<div>${tagsHtml}</div>` : ''}
          <div class="card-footer">
            <div class="pm-progress-wrap card-progress"><div class="pm-progress-bar" style="width:${t.progress}%"></div></div>
            <button class="pm-btn small secondary btn-edit" data-id="${t.id}">編集</button>
          </div>`;
        body.appendChild(card);
      }

      colDiv.appendChild(body);
      container.appendChild(colDiv);
    }

    // Drag & Drop
    container.querySelectorAll('.pm-kanban-card').forEach(card => {
      card.addEventListener('dragstart', e => {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', card.dataset.id);
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });

    container.querySelectorAll('.pm-kanban-body').forEach(body => {
      body.addEventListener('dragover', e => { e.preventDefault(); body.classList.add('drag-over'); });
      body.addEventListener('dragleave', () => body.classList.remove('drag-over'));
      body.addEventListener('drop', e => {
        e.preventDefault();
        body.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        const newStatus = body.dataset.status;
        const task = TaskMgr.byId(id);
        if (task && task.status !== newStatus) {
          const newProgress = newStatus === 'done' ? 100 : (task.progress === 100 ? 50 : task.progress);
          TaskMgr.update(id, { status: newStatus, progress: newProgress });
          ActivityLog.add(id, 'ステータス変更', `${STATUS[task.status]} → ${STATUS[newStatus]}`);
          renderCurrentView();
        }
      });
    });

    container.querySelectorAll('.btn-edit').forEach(b => {
      b.addEventListener('click', e => { e.stopPropagation(); openModal(b.dataset.id); });
    });
  }

  // ==========================================
  // Render: Calendar View
  // ==========================================
  function renderCalendar() {
    const now = new Date();
    if (!calendarYear) { calendarYear = now.getFullYear(); calendarMonth = now.getMonth(); }

    const tasks = TaskMgr.filtered(currentFilters);
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
    const startDow = firstDay.getDay();
    const startOff = startDow === 0 ? 6 : startDow - 1; // Monday start
    const totalCells = Math.ceil((startOff + lastDay.getDate()) / 7) * 7;

    const container = $('calendarContent');
    const dayNames = ['月','火','水','木','金','土','日'];
    const monthLabel = `${calendarYear}年 ${calendarMonth + 1}月`;

    let html = `<div class="pm-calendar-nav">
      <button class="pm-btn small secondary" id="calPrev">◀ 前月</button>
      <span class="month-label">${monthLabel}</span>
      <button class="pm-btn small secondary" id="calNext">次月 ▶</button>
    </div>`;
    html += '<div class="pm-calendar-grid">';
    for (let i = 0; i < 7; i++) {
      html += `<div class="pm-calendar-header${i===6?' sun':''}${i===5?' sat':''}">${dayNames[i]}</div>`;
    }
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startOff + 1;
      const isCur = dayNum >= 1 && dayNum <= lastDay.getDate();
      const dateStr = isCur ? `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}` : '';
      const isToday = isCur && dateStr === todayISO();
      const dayTasks = isCur ? tasks.filter(t => t.startDate && t.dueDate && dateStr >= t.startDate && dateStr <= t.dueDate) : [];
      html += `<div class="pm-calendar-day${isToday?' today':''}${!isCur?' other-month':''}">`;
      html += `<div class="day-number">${isCur ? dayNum : ''}</div><div class="day-tasks">`;
      for (const dt of dayTasks.slice(0, 8)) {
        html += `<span class="day-task-dot" style="background:${PRI_COLOR[dt.priority]};" title="${escHtml(dt.title)}"></span>`;
      }
      if (dayTasks.length > 8) html += `<span class="day-task-more">+${dayTasks.length - 8}</span>`;
      html += '</div></div>';
    }
    html += '</div>';
    container.innerHTML = html;

    $('calPrev').addEventListener('click', () => {
      if (--calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
      renderCalendar();
    });
    $('calNext').addEventListener('click', () => {
      if (++calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
      renderCalendar();
    });
  }

  // ==========================================
  // Render dispatcher
  // ==========================================
  function renderCurrentView() {
    document.querySelectorAll('.pm-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));

    const viewMap = { list:'viewList', gantt:'viewGantt', kanban:'viewKanban', calendar:'viewCalendar' };
    $(viewMap[currentView]).classList.add('active');
    document.querySelector(`.pm-tab[data-view="${currentView}"]`).classList.add('active');

    switch (currentView) {
      case 'list': renderList(); break;
      case 'gantt': renderGantt(); break;
      case 'kanban': renderKanban(); break;
      case 'calendar': renderCalendar(); break;
    }
  }

  function updateBulkBar() {
    const bar = $('bulkBar');
    const n = selectedIds.size;
    if (n > 0) { bar.classList.add('active'); $('selectedCount').textContent = `${n} 件選択`; }
    else bar.classList.remove('active');
  }

  // ==========================================
  // Modal
  // ==========================================
  function openModal(taskId) {
    editingId = taskId || null;
    const isEdit = !!taskId;
    const t = isEdit ? TaskMgr.byId(taskId) : null;

    $('modalTitle').textContent = isEdit ? 'タスク編集' : '新規タスク';
    $('taskId').value = t ? t.id : '';
    $('taskTitle').value = t ? t.title : '';
    $('taskDesc').value = t ? t.description : '';
    $('taskStatus').value = t ? t.status : 'todo';
    $('taskPriority').value = t ? t.priority : 'medium';
    $('taskAssignee').value = t ? t.assignee : '';
    $('taskMilestone').value = t ? t.milestone : '';
    $('taskStartDate').value = t ? t.startDate : '';
    $('taskDueDate').value = t ? t.dueDate : '';
    $('taskEstimated').value = t ? t.estimatedHours : '';
    $('taskActual').value = t ? t.actualHours : '';
    $('taskProgress').value = t ? t.progress : 0;
    $('progressValue').textContent = (t ? t.progress : 0) + '%';
    $('taskTags').value = t ? (t.tags || []).join(', ') : '';
    $('btnDeleteTask').style.display = isEdit ? '' : 'none';
    $('btnCreateGithub').style.display = isEdit ? '' : 'none';

    // Subtasks
    const stList = $('subtaskList');
    stList.innerHTML = '';
    if (t && t.subtasks) {
      for (const st of t.subtasks) {
        addSubtaskRow(st.text, st.done);
      }
    }

    // Predecessors
    const predSel = $('taskPredecessors');
    predSel.innerHTML = '';
    for (const ot of TaskMgr.all()) {
      if (ot.id === taskId) continue;
      const sel = t && t.predecessors && t.predecessors.includes(ot.id);
      predSel.innerHTML += `<option value="${ot.id}"${sel?' selected':''}>${escHtml(ot.title)}</option>`;
    }

    // GitHub link
    const ghRow = $('githubIssueRow');
    const ghLink = $('githubIssueLink');
    if (t && t.githubIssueUrl) {
      ghRow.style.display = 'block';
      ghLink.innerHTML = `<a href="${escHtml(t.githubIssueUrl)}" target="_blank">${escHtml(t.githubIssueUrl)}</a>`;
    } else { ghRow.style.display = 'none'; ghLink.innerHTML = ''; }

    // Activity log
    const logs = ActivityLog.forTask(taskId || '');
    $('activityLog').innerHTML = logs.length
      ? logs.map(l => `<div class="pm-activity-item"><span class="time">${fmtDateTime(l.time)}</span> — ${escHtml(l.action)}: ${escHtml(l.detail)}</div>`).join('')
      : '<div class="pm-activity-item">（履歴なし）</div>';

    // Clear errors
    document.querySelectorAll('.pm-form-row').forEach(r => r.classList.remove('has-error'));

    $('taskModal').classList.add('active');
    setTimeout(() => $('taskTitle').focus(), 100);
  }

  function addSubtaskRow(text, done) {
    const li = document.createElement('li');
    li.className = 'pm-subtask-item';
    li.innerHTML = `<input type="checkbox"${done?' checked':''}><span class="subtask-text${done?' done':''}">${escHtml(text)}</span><button type="button" class="pm-subtask-delete">🗑️</button>`;
    li.querySelector('input').addEventListener('change', e => {
      li.querySelector('.subtask-text').classList.toggle('done', e.target.checked);
    });
    li.querySelector('.pm-subtask-delete').addEventListener('click', () => li.remove());
    $('subtaskList').appendChild(li);
  }

  function closeModal() { $('taskModal').classList.remove('active'); editingId = null; }

  function saveTask() {
    const title = $('taskTitle').value.trim();
    if (!title) { $('taskTitle').closest('.pm-form-row').classList.add('has-error'); return; }
    document.querySelectorAll('.pm-form-row').forEach(r => r.classList.remove('has-error'));

    const startDate = $('taskStartDate').value;
    const dueDate = $('taskDueDate').value;
    if (startDate && dueDate && startDate > dueDate) {
      showToast('⚠️ 開始日は締切日より前である必要があります');
      return;
    }

    const subtasks = [];
    $('subtaskList').querySelectorAll('.pm-subtask-item').forEach(li => {
      subtasks.push({ text: li.querySelector('.subtask-text').textContent, done: li.querySelector('input').checked });
    });

    const predecessors = Array.from($('taskPredecessors').selectedOptions).map(o => o.value);
    if (TaskMgr.hasCircular(editingId, predecessors)) {
      showToast('⚠️ 循環依存が検出されました');
      return;
    }

    const data = {
      title, description: $('taskDesc').value.trim(),
      status: $('taskStatus').value, priority: $('taskPriority').value,
      assignee: $('taskAssignee').value.trim(), milestone: $('taskMilestone').value.trim(),
      startDate, dueDate,
      estimatedHours: parseFloat($('taskEstimated').value) || 0,
      actualHours: parseFloat($('taskActual').value) || 0,
      progress: parseInt($('taskProgress').value) || 0,
      tags: parseTags($('taskTags').value), subtasks, predecessors
    };

    if (editingId) TaskMgr.update(editingId, data);
    else TaskMgr.add(data);

    closeModal();
    renderCurrentView();
  }

  async function createGHIssue(taskId) {
    const t = TaskMgr.byId(taskId);
    if (!t) return;
    const gh = GithubCfg.all();
    if (!gh.token || !gh.repo) {
      alert('GitHub設定が未設定です。設定パネルでTokenとリポジトリを設定してください。');
      $('settingsPanel').classList.add('active');
      return;
    }
    try {
      const issue = await GithubAPI.createIssue(t, gh.token, gh.repo);
      TaskMgr.update(taskId, { githubIssueUrl: issue.html_url });
      ActivityLog.add(taskId, 'GitHub Issue作成', issue.html_url);
      showToast('✅ GitHub Issue を作成しました');
      if (editingId === taskId) openModal(taskId);
      renderCurrentView();
    } catch (e) {
      showToast('❌ GitHub Issue 作成失敗: ' + e.message);
    }
  }

  // ==========================================
  // Snapshots UI
  // ==========================================
  function renderSnapshots() {
    const list = $('snapshotList');
    const snaps = Snapshots.all();
    if (!snaps.length) { list.innerHTML = '<div style="color:#999;font-size:0.85em;">スナップショットはありません</div>'; return; }
    list.innerHTML = snaps.map(s => `
      <div class="pm-snapshot-item">
        <span>${escHtml(s.name)} <small style="color:#999;">(${fmtDateTime(s.createdAt)})</small></span>
        <div>
          <button class="pm-btn small secondary btn-restore" data-name="${escHtml(s.name)}">復元</button>
          <button class="pm-btn small danger btn-del-snap" data-name="${escHtml(s.name)}">削除</button>
        </div>
      </div>`).join('');
    list.querySelectorAll('.btn-restore').forEach(b => b.addEventListener('click', () => {
      const snap = Snapshots.get(b.dataset.name);
      if (snap && confirm(`「${snap.name}」を復元しますか？（現在のタスクは上書きされます）`)) {
        TaskMgr._tasks = JSON.parse(JSON.stringify(snap.tasks));
        TaskMgr.save();
        renderCurrentView();
        showToast('✅ スナップショットを復元しました');
      }
    }));
    list.querySelectorAll('.btn-del-snap').forEach(b => b.addEventListener('click', () => {
      Snapshots.remove(b.dataset.name); renderSnapshots();
    }));
  }

  // ==========================================
  // Init & Event Binding
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    TaskMgr.load();

    // View tabs
    document.querySelectorAll('.pm-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        currentView = tab.dataset.view;
        Settings.set('view', currentView);
        renderCurrentView();
      });
    });

    // Filters
    const filterIds = ['filterStatus','filterPriority','filterAssignee','filterMilestone'];
    filterIds.forEach(id => {
      $(id).addEventListener('change', applyFilters);
    });
    $('searchBox').addEventListener('input', applyFilters);

    function applyFilters() {
      currentFilters = {
        status: $('filterStatus').value,
        priority: $('filterPriority').value,
        assignee: $('filterAssignee').value,
        milestone: $('filterMilestone').value,
        search: $('searchBox').value.trim()
      };
      renderCurrentView();
    }

    // New task
    $('btnNewTask').addEventListener('click', () => openModal());

    // Modal
    $('modalClose').addEventListener('click', closeModal);
    $('btnCancel').addEventListener('click', closeModal);
    $('taskModal').addEventListener('click', e => { if (e.target === $('taskModal')) closeModal(); });
    $('btnSaveTask').addEventListener('click', saveTask);
    $('btnDeleteTask').addEventListener('click', () => {
      if (editingId && confirm('このタスクを削除しますか？')) {
        TaskMgr.remove(editingId);
        closeModal();
        renderCurrentView();
      }
    });
    $('btnCreateGithub').addEventListener('click', () => { if (editingId) createGHIssue(editingId); });

    // Progress slider
    $('taskProgress').addEventListener('input', e => { $('progressValue').textContent = e.target.value + '%'; });

    // Subtask add
    $('btnAddSubtask').addEventListener('click', () => {
      const text = $('newSubtask').value.trim();
      if (!text) return;
      addSubtaskRow(text, false);
      $('newSubtask').value = '';
    });
    $('newSubtask').addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); $('btnAddSubtask').click(); }
    });

    // Export
    $('btnExportJson').addEventListener('click', () => {
      downloadBlob(TaskMgr.exportJSON(), `rui-pm-tasks-${todayISO()}.json`, 'application/json');
      showToast('✅ JSON をエクスポートしました');
    });
    $('btnExportCsv').addEventListener('click', () => {
      downloadBlob('\uFEFF' + TaskMgr.exportCSV(), `rui-pm-tasks-${todayISO()}.csv`, 'text/csv;charset=utf-8');
      showToast('✅ CSV をエクスポートしました');
    });

    // Import
    $('btnImport').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          let imported;
          if (file.name.endsWith('.json')) imported = TaskMgr.importJSON(ev.target.result);
          else imported = TaskMgr.importCSV(ev.target.result);
          const overwrite = confirm('同じIDのタスクが存在する場合、上書きしますか？\n「キャンセル」で新規タスクのみ追加します。');
          const r = TaskMgr.merge(imported, overwrite);
          showToast(`✅ インポート完了: ${r.added}件追加, ${r.updated}件更新`);
          renderCurrentView();
        } catch (err) { showToast('❌ インポート失敗: ' + err.message); }
        e.target.value = '';
      };
      reader.readAsText(file);
    });

    // Settings
    $('btnSettings').addEventListener('click', () => {
      $('settingsPanel').classList.toggle('active');
      if ($('settingsPanel').classList.contains('active')) {
        const gh = GithubCfg.all();
        $('githubToken').value = gh.token || '';
        $('githubRepo').value = gh.repo || '';
        renderSnapshots();
      }
    });
    $('btnSaveSettings').addEventListener('click', () => {
      GithubCfg.save({ token: $('githubToken').value.trim(), repo: $('githubRepo').value.trim() });
      showToast('✅ 設定を保存しました');
    });
    $('btnCloseSettings').addEventListener('click', () => $('settingsPanel').classList.remove('active'));
    $('btnSaveSnapshot').addEventListener('click', () => {
      const name = $('snapshotName').value.trim();
      if (!name) return;
      Snapshots.add(name, TaskMgr.all());
      $('snapshotName').value = '';
      renderSnapshots();
      showToast('✅ スナップショットを保存しました');
    });

    // Theme
    $('btnTheme').addEventListener('click', () => {
      const wrap = $('pmApp');
      wrap.classList.toggle('dark');
      Settings.set('darkTheme', wrap.classList.contains('dark'));
    });

    // Bulk operations
    $('btnBulkClear').addEventListener('click', () => { selectedIds.clear(); renderCurrentView(); updateBulkBar(); });
    $('btnBulkDelete').addEventListener('click', () => {
      if (!selectedIds.size) return;
      if (confirm(`${selectedIds.size}件のタスクを削除しますか？`)) {
        for (const id of selectedIds) TaskMgr.remove(id);
        selectedIds.clear();
        updateBulkBar();
        renderCurrentView();
      }
    });
    $('btnBulkStatus').addEventListener('click', () => {
      if (!selectedIds.size) return;
      const st = prompt('新しいステータス (todo / doing / done):', 'doing');
      if (!st || !STATUS[st]) return;
      for (const id of selectedIds) TaskMgr.update(id, { status: st });
      renderCurrentView();
    });
    $('btnBulkGithub').addEventListener('click', () => {
      if (!selectedIds.size) return;
      const gh = GithubCfg.all();
      if (!gh.token || !gh.repo) { alert('GitHub設定が未設定です。'); return; }
      for (const id of selectedIds) createGHIssue(id);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'n') { e.preventDefault(); openModal(); return; }
        const vm = { '1':'list', '2':'gantt', '3':'kanban', '4':'calendar' };
        if (vm[e.key]) { e.preventDefault(); currentView = vm[e.key]; Settings.set('view', currentView); renderCurrentView(); return; }
      }
      if (e.key === 'Escape' && $('taskModal').classList.contains('active')) { closeModal(); return; }
      if (e.key === '/' && document.activeElement && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault(); $('searchBox').focus();
      }
    });

    // Init
    if (Settings.get('darkTheme')) $('pmApp').classList.add('dark');
    // Set filter dropdown defaults
    $('filterAssignee').dataset.all = '全担当者';
    $('filterMilestone').dataset.all = '全マイルストーン';
    renderCurrentView();
  });
})();
</script>
