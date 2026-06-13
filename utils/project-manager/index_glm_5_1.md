---
layout: default
title: プロジェクト管理 (GLM 5.1) - Rui Software
---

<style>
/* ===== pm-wrap: Root Container ===== */
.pm-wrap{max-width:1200px;margin:0 auto;padding:10px;font-family:Ricty,'Hiragino Kaku Gothic ProN',Meiryo,sans-serif;color:#333}
.pm-wrap *{box-sizing:border-box}
.pm-wrap h1{border-left:6px solid #2e8b57;padding-left:10px;font-size:1.5em;margin-bottom:16px}
.pm-wrap h2{border-left:4px solid #2e8b57;padding-left:8px;font-size:1.2em;margin:20px 0 10px}

/* ===== Controls Bar ===== */
.pm-controls{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px;padding:8px;background:#f7faf8;border:1px solid #dde8e2;border-radius:4px}
.pm-controls .pm-search{flex:1;min-width:180px;padding:6px 10px;border:1px solid #aaccbb;border-radius:3px;font-size:14px}
.pm-controls select{padding:5px 8px;border:1px solid #aaccbb;border-radius:3px;font-size:13px;background:#fff}

/* ===== Buttons ===== */
.pm-btn{display:inline-block;padding:6px 14px;font-size:13px;border:1px solid #aaccbb;border-radius:3px;background:#fff;color:#2e8b57;cursor:pointer;text-decoration:none;transition:all .15s}
.pm-btn:hover{background:#2e8b57;color:#fff}
.pm-btn.primary{background:#2e8b57;color:#fff;border-color:#2e8b57}
.pm-btn.primary:hover{background:#247349;border-color:#247349}
.pm-btn.danger{color:#dc3545;border-color:#dc3545}
.pm-btn.danger:hover{background:#dc3545;color:#fff}
.pm-btn.small{padding:3px 8px;font-size:12px}
.pm-btn:disabled{opacity:.5;cursor:not-allowed}

/* ===== Tab Group ===== */
.pm-tab-group{display:flex;gap:0;border-bottom:2px solid #dde8e2;margin-bottom:12px}
.pm-tab{padding:8px 18px;cursor:pointer;border:1px solid transparent;border-bottom:none;border-radius:4px 4px 0 0;font-size:14px;color:#666;background:transparent;transition:all .15s}
.pm-tab:hover{color:#2e8b57;background:#eaf3ee}
.pm-tab.active{color:#2e8b57;background:#f7faf8;border-color:#dde8e2;border-bottom:2px solid #f7faf8;margin-bottom:-2px;font-weight:bold}

/* ===== View Container ===== */
.pm-view-container{position:relative;min-height:300px}
.pm-view{display:none}
.pm-view.active{display:block}

/* ===== Table (List View) ===== */
.pm-table-wrap{overflow-x:auto}
.pm-table{width:100%;border-collapse:collapse;font-size:13px}
.pm-table th,.pm-table td{padding:6px 10px;border:1px solid #dde8e2;text-align:left;white-space:nowrap}
.pm-table th{background:#f7faf8;color:#2e8b57;cursor:pointer;user-select:none;position:relative}
.pm-table th .pm-sort-arrow{font-size:10px;margin-left:4px;opacity:.4}
.pm-table th.sorted .pm-sort-arrow{opacity:1}
.pm-table tr:hover td{background:#eaf3ee}
.pm-table .pm-col-check{width:30px;text-align:center}
.pm-table .pm-col-actions{width:80px;text-align:center}

/* ===== Badges ===== */
.pm-status{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:bold}
.pm-status.todo{background:#e2e3e5;color:#383d41}
.pm-status.doing{background:#cce5ff;color:#004085}
.pm-status.done{background:#d4edda;color:#155724}
.pm-priority{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:bold}
.pm-priority.high{background:#dc3545;color:#fff}
.pm-priority.medium{background:#ffc107;color:#333}
.pm-priority.low{background:#2e8b57;color:#fff}
.pm-tag{display:inline-block;padding:1px 6px;margin:1px;border-radius:8px;font-size:11px;background:#eaf3ee;color:#2e8b57;border:1px solid #aaccbb}

/* ===== Progress Bar ===== */
.pm-progress-wrap{display:flex;align-items:center;gap:6px}
.pm-progress-bar{flex:1;height:8px;background:#e2e3e5;border-radius:4px;overflow:hidden;min-width:50px}
.pm-progress-fill{height:100%;background:#2e8b57;border-radius:4px;transition:width .3s}
.pm-progress-text{font-size:11px;min-width:32px;text-align:right}

/* ===== Modal ===== */
.pm-modal-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:1000;justify-content:center;align-items:center}
.pm-modal-overlay.show{display:flex}
.pm-modal{background:#fff;border-radius:6px;width:95%;max-width:700px;max-height:90vh;overflow-y:auto;padding:20px;box-shadow:0 4px 20px rgba(0,0,0,.2)}
.pm-modal h2{margin:0 0 16px;font-size:1.3em;border-left:4px solid #2e8b57;padding-left:8px}
.pm-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:12px;border-top:1px solid #dde8e2}

/* ===== Form ===== */
.pm-form-group{margin-bottom:12px}
.pm-form-group label{display:block;font-weight:bold;margin-bottom:4px;font-size:13px;color:#2e8b57}
.pm-form-group input[type=text],.pm-form-group input[type=date],.pm-form-group input[type=number],.pm-form-group textarea,.pm-form-group select{width:100%;padding:6px 10px;border:1px solid #aaccbb;border-radius:3px;font-size:14px;font-family:inherit}
.pm-form-group textarea{min-height:60px;resize:vertical}
.pm-form-row{display:flex;gap:12px}
.pm-form-row .pm-form-group{flex:1}
.pm-form-group .pm-range-display{display:flex;align-items:center;gap:8px}
.pm-form-group input[type=range]{flex:1}

/* ===== Subtask List ===== */
.pm-subtask-list{list-style:none;padding:0;margin:0}
.pm-subtask-item{display:flex;align-items:center;gap:6px;margin-bottom:4px}
.pm-subtask-item input[type=checkbox]{margin:0}
.pm-subtask-item input[type=text]{flex:1;padding:4px 8px;border:1px solid #aaccbb;border-radius:3px;font-size:13px}
.pm-subtask-item .pm-btn{padding:2px 6px;font-size:11px}

/* ===== Kanban ===== */
.pm-kanban{display:flex;gap:12px;min-height:400px}
.pm-kanban-col{flex:1;background:#f7faf8;border:1px solid #dde8e2;border-radius:6px;padding:8px;min-width:0}
.pm-kanban-col h3{text-align:center;margin:0 0 8px;font-size:14px;padding-bottom:6px;border-bottom:2px solid #2e8b57}
.pm-kanban-col.todo-col h3{border-bottom-color:#383d41}
.pm-kanban-col.doing-col h3{border-bottom-color:#004085}
.pm-kanban-col.done-col h3{border-bottom-color:#155724}
.pm-kanban-cards{min-height:60px}
.pm-kanban-card{background:#fff;border:1px solid #dde8e2;border-radius:4px;padding:8px;margin-bottom:8px;cursor:grab;transition:box-shadow .15s}
.pm-kanban-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.12)}
.pm-kanban-card.dragging{opacity:.5}
.pm-kanban-card .pm-card-title{font-weight:bold;font-size:13px;margin-bottom:4px}
.pm-kanban-card .pm-card-meta{font-size:11px;color:#666}
.pm-kanban-col.drag-over{background:#eaf3ee;border-color:#2e8b57}

/* ===== Gantt ===== */
.pm-gantt{overflow-x:auto}
.pm-gantt-header-row{display:flex;border-bottom:2px solid #2e8b57;position:sticky;top:0;z-index:2;background:#f7faf8}
.pm-gantt-task-label{min-width:180px;max-width:180px;padding:4px 8px;font-size:12px;font-weight:bold;border-right:1px solid #dde8e2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pm-gantt-weeks{display:flex;flex:1}
.pm-gantt-week{min-width:60px;flex:1;text-align:center;font-size:11px;padding:4px 2px;border-right:1px solid #eee}
.pm-gantt-row{display:flex;border-bottom:1px solid #eee;position:relative}
.pm-gantt-row-label{min-width:180px;max-width:180px;padding:4px 8px;font-size:12px;border-right:1px solid #dde8e2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pm-gantt-row-bars{position:relative;flex:1;height:28px}
.pm-gantt-bar{position:absolute;height:18px;top:5px;border-radius:3px;font-size:10px;color:#fff;padding:0 4px;line-height:18px;overflow:hidden;white-space:nowrap;cursor:pointer}
.pm-gantt-bar.high{background:#dc3545}
.pm-gantt-bar.medium{background:#ffc107;color:#333}
.pm-gantt-bar.low{background:#2e8b57}
.pm-gantt-today{position:absolute;top:0;bottom:0;width:2px;background:#dc3545;z-index:1;pointer-events:none}
.pm-gantt-milestone{position:absolute;top:2px;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:12px solid #ffc107;z-index:2;cursor:pointer}

/* ===== Calendar ===== */
.pm-calendar{border:1px solid #dde8e2;border-radius:4px;overflow:hidden}
.pm-calendar-header{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f7faf8;border-bottom:1px solid #dde8e2}
.pm-calendar-header h3{margin:0;font-size:16px}
.pm-calendar-grid{display:grid;grid-template-columns:repeat(7,1fr)}
.pm-calendar-day-name{text-align:center;padding:6px;font-size:12px;font-weight:bold;color:#2e8b57;background:#f7faf8;border-bottom:1px solid #dde8e2}
.pm-calendar-cell{min-height:80px;padding:4px;border:1px solid #eee;font-size:12px;position:relative;background:#fff}
.pm-calendar-cell.other-month{background:#fafafa;color:#aaa}
.pm-calendar-cell.today{background:#eaf3ee;font-weight:bold}
.pm-calendar-cell .pm-cal-date{font-weight:bold;margin-bottom:2px}
.pm-calendar-cell .pm-cal-dot{display:inline-block;width:6px;height:6px;border-radius:50%;margin:1px}
.pm-calendar-cell .pm-cal-dot.high{background:#dc3545}
.pm-calendar-cell .pm-cal-dot.medium{background:#ffc107}
.pm-calendar-cell .pm-cal-dot.low{background:#2e8b57}

/* ===== Bulk Action Bar ===== */
.pm-bulk-bar{display:none;padding:8px 12px;background:#cce5ff;border:1px solid #004085;border-radius:4px;margin-bottom:8px;align-items:center;gap:8px;font-size:13px}
.pm-bulk-bar.show{display:flex}

/* ===== Settings Panel ===== */
.pm-settings{border:1px solid #dde8e2;border-radius:4px;margin-bottom:12px;overflow:hidden}
.pm-settings-header{padding:8px 12px;background:#f7faf8;cursor:pointer;font-weight:bold;color:#2e8b57;display:flex;justify-content:space-between;align-items:center}
.pm-settings-body{display:none;padding:12px}
.pm-settings-body.show{display:block}
.pm-settings-body .pm-form-group{margin-bottom:8px}
.pm-settings-body .pm-form-group label{font-size:12px}
.pm-settings-body .pm-form-group input{font-size:13px}

/* ===== Activity Log ===== */
.pm-activity-log{max-height:200px;overflow-y:auto;border:1px solid #dde8e2;border-radius:3px;padding:8px;font-size:12px;background:#fafafa}
.pm-activity-item{padding:4px 0;border-bottom:1px solid #eee}
.pm-activity-item:last-child{border-bottom:none}
.pm-activity-time{color:#999;font-size:11px}

/* ===== Dark Theme ===== */
.pm-wrap.dark{background:#1a1a2e;color:#e0e0e0}
.pm-wrap.dark .pm-controls{background:#16213e;border-color:#0f3460}
.pm-wrap.dark .pm-controls .pm-search{background:#1a1a2e;color:#e0e0e0;border-color:#0f3460}
.pm-wrap.dark .pm-controls select{background:#1a1a2e;color:#e0e0e0;border-color:#0f3460}
.pm-wrap.dark .pm-btn{background:#16213e;color:#e0e0e0;border-color:#0f3460}
.pm-wrap.dark .pm-btn:hover{background:#2e8b57;color:#fff}
.pm-wrap.dark .pm-btn.primary{background:#2e8b57;color:#fff}
.pm-wrap.dark .pm-tab{color:#aaa;background:transparent}
.pm-wrap.dark .pm-tab:hover{color:#2e8b57;background:#16213e}
.pm-wrap.dark .pm-tab.active{color:#2e8b57;background:#1a1a2e;border-color:#0f3460}
.pm-wrap.dark .pm-table th{background:#16213e;color:#2e8b57;border-color:#0f3460}
.pm-wrap.dark .pm-table td{border-color:#0f3460}
.pm-wrap.dark .pm-table tr:hover td{background:#16213e}
.pm-wrap.dark .pm-modal{background:#1a1a2e;color:#e0e0e0}
.pm-wrap.dark .pm-form-group label{color:#2e8b57}
.pm-wrap.dark .pm-form-group input,.pm-wrap.dark .pm-form-group textarea,.pm-wrap.dark .pm-form-group select{background:#16213e;color:#e0e0e0;border-color:#0f3460}
.pm-wrap.dark .pm-kanban-col{background:#16213e;border-color:#0f3460}
.pm-wrap.dark .pm-kanban-card{background:#1a1a2e;border-color:#0f3460}
.pm-wrap.dark .pm-gantt-header-row{background:#16213e}
.pm-wrap.dark .pm-gantt-task-label,.pm-wrap.dark .pm-gantt-row-label{border-color:#0f3460}
.pm-wrap.dark .pm-calendar{border-color:#0f3460}
.pm-wrap.dark .pm-calendar-header{background:#16213e;border-color:#0f3460}
.pm-wrap.dark .pm-calendar-day-name{background:#16213e;border-color:#0f3460;color:#2e8b57}
.pm-wrap.dark .pm-calendar-cell{background:#1a1a2e;border-color:#0f3460;color:#e0e0e0}
.pm-wrap.dark .pm-calendar-cell.other-month{background:#16213e;color:#666}
.pm-wrap.dark .pm-calendar-cell.today{background:#16213e}
.pm-wrap.dark .pm-settings{border-color:#0f3460}
.pm-wrap.dark .pm-settings-header{background:#16213e;color:#2e8b57}
.pm-wrap.dark .pm-settings-body{background:#1a1a2e}
.pm-wrap.dark .pm-bulk-bar{background:#16213e;border-color:#004085}
.pm-wrap.dark .pm-activity-log{background:#16213e;border-color:#0f3460;color:#e0e0e0}

/* ===== Responsive ===== */
@media(max-width:768px){
  .pm-kanban{flex-direction:column}
  .pm-kanban-col{min-width:100%}
  .pm-form-row{flex-direction:column;gap:0}
  .pm-controls{flex-direction:column}
  .pm-controls .pm-search{min-width:100%}
  .pm-gantt-task-label,.pm-gantt-row-label{min-width:120px;max-width:120px}
}
</style>

<div class="pm-wrap" id="pm-app">
  <h1>プロジェクト管理 <small style="font-size:.5em;color:#999">(GLM 5.1)</small></h1>

  <!-- Controls Bar -->
  <div class="pm-controls">
    <button class="pm-btn primary" onclick="pm.openAddModal()">＋ 新規タスク</button>
    <div class="pm-tab-group" id="pm-tabs">
      <div class="pm-tab active" data-view="list" onclick="pm.switchView('list')">リスト</div>
      <div class="pm-tab" data-view="gantt" onclick="pm.switchView('gantt')">ガント</div>
      <div class="pm-tab" data-view="kanban" onclick="pm.switchView('kanban')">看板</div>
      <div class="pm-tab" data-view="calendar" onclick="pm.switchView('calendar')">カレンダー</div>
    </div>
    <input type="text" class="pm-search" id="pm-search" placeholder="検索..." oninput="pm.onFilterChange()">
    <select id="pm-filter-status" onchange="pm.onFilterChange()"><option value="">ステータス</option><option value="todo">ToDo</option><option value="doing">Doing</option><option value="done">Done</option></select>
    <select id="pm-filter-priority" onchange="pm.onFilterChange()"><option value="">優先度</option><option value="high">高</option><option value="medium">中</option><option value="low">低</option></select>
    <select id="pm-filter-assignee" onchange="pm.onFilterChange()"><option value="">担当者</option></select>
    <select id="pm-filter-milestone" onchange="pm.onFilterChange()"><option value="">マイルストーン</option></select>
    <button class="pm-btn small" onclick="pm.exportJSON()">JSON出力</button>
    <button class="pm-btn small" onclick="pm.exportCSV()">CSV出力</button>
    <button class="pm-btn small" onclick="pm.triggerImport()">読込</button>
    <input type="file" id="pm-import-file" style="display:none" accept=".json,.csv" onchange="pm.handleImport(event)">
    <button class="pm-btn small" onclick="pm.toggleSettings()">⚙️設定</button>
    <button class="pm-btn small" onclick="pm.toggleTheme()">🌓</button>
  </div>

  <!-- Bulk Action Bar -->
  <div class="pm-bulk-bar" id="pm-bulk-bar">
    <span id="pm-bulk-count">0件選択中</span>
    <button class="pm-btn small" onclick="pm.bulkDelete()">一括削除</button>
    <select id="pm-bulk-status" onchange="pm.bulkStatusChange(this.value)"><option value="">ステータス変更...</option><option value="todo">ToDo</option><option value="doing">Doing</option><option value="done">Done</option></select>
    <button class="pm-btn small" onclick="pm.bulkCreateIssues()">GitHub Issue化</button>
  </div>

  <!-- Settings Panel -->
  <div class="pm-settings" id="pm-settings">
    <div class="pm-settings-header" onclick="pm.toggleSettingsBody()">
      <span>⚙️ 設定</span><span id="pm-settings-arrow">▼</span>
    </div>
    <div class="pm-settings-body" id="pm-settings-body">
      <div class="pm-form-group">
        <label>GitHub Personal Access Token</label>
        <input type="password" id="pm-github-token" placeholder="ghp_xxxxx...">
        <small style="color:#dc3545;display:block;margin-top:4px">⚠️ トークンはlocalStorageに平文保存されます。取り扱いにご注意ください。</small>
      </div>
      <div class="pm-form-group">
        <label>GitHub リポジトリ (owner/repo)</label>
        <input type="text" id="pm-github-repo" placeholder="owner/repo">
      </div>
      <div class="pm-form-group">
        <label>スナップショット</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" id="pm-snapshot-name" placeholder="スナップショット名">
          <button class="pm-btn small" onclick="pm.saveSnapshot()">保存</button>
          <select id="pm-snapshot-list" onchange="pm.loadSnapshot(this.value)"><option value="">復元...</option></select>
          <button class="pm-btn small danger" onclick="pm.deleteSnapshot()">削除</button>
        </div>
      </div>
      <button class="pm-btn small" onclick="pm.saveSettings()">保存</button>
    </div>
  </div>

  <!-- View Container -->
  <div class="pm-view-container">
    <div class="pm-view active" id="pm-view-list">
      <div class="pm-table-wrap">
        <table class="pm-table" id="pm-table">
          <thead>
            <tr>
              <th class="pm-col-check"><input type="checkbox" id="pm-check-all" onchange="pm.toggleAllChecks(this.checked)"></th>
              <th onclick="pm.sortBy('title')">タイトル <span class="pm-sort-arrow">↕</span></th>
              <th onclick="pm.sortBy('status')">ステータス <span class="pm-sort-arrow">↕</span></th>
              <th onclick="pm.sortBy('priority')">優先度 <span class="pm-sort-arrow">↕</span></th>
              <th onclick="pm.sortBy('assignee')">担当者 <span class="pm-sort-arrow">↕</span></th>
              <th onclick="pm.sortBy('milestone')">マイルストーン <span class="pm-sort-arrow">↕</span></th>
              <th onclick="pm.sortBy('startDate')">開始日 <span class="pm-sort-arrow">↕</span></th>
              <th onclick="pm.sortBy('dueDate')">締切日 <span class="pm-sort-arrow">↕</span></th>
              <th onclick="pm.sortBy('progress')">進捗 <span class="pm-sort-arrow">↕</span></th>
              <th class="pm-col-actions">操作</th>
            </tr>
          </thead>
          <tbody id="pm-table-body"></tbody>
        </table>
      </div>
    </div>

    <div class="pm-view" id="pm-view-gantt">
      <div class="pm-gantt" id="pm-gantt"></div>
    </div>

    <div class="pm-view" id="pm-view-kanban">
      <div class="pm-kanban" id="pm-kanban">
        <div class="pm-kanban-col todo-col">
          <h3>ToDo</h3>
          <div class="pm-kanban-cards" id="pm-kanban-todo" ondragover="pm.onDragOver(event)" ondrop="pm.onDrop(event,'todo')" ondragleave="pm.onDragLeave(event)"></div>
        </div>
        <div class="pm-kanban-col doing-col">
          <h3>Doing</h3>
          <div class="pm-kanban-cards" id="pm-kanban-doing" ondragover="pm.onDragOver(event)" ondrop="pm.onDrop(event,'doing')" ondragleave="pm.onDragLeave(event)"></div>
        </div>
        <div class="pm-kanban-col done-col">
          <h3>Done</h3>
          <div class="pm-kanban-cards" id="pm-kanban-done" ondragover="pm.onDragOver(event)" ondrop="pm.onDrop(event,'done')" ondragleave="pm.onDragLeave(event)"></div>
        </div>
      </div>
    </div>

    <div class="pm-view" id="pm-view-calendar">
      <div class="pm-calendar" id="pm-calendar"></div>
    </div>
  </div>
</div>

<!-- Task Modal -->
<div class="pm-modal-overlay" id="pm-modal-overlay" onclick="pm.onModalOverlayClick(event)">
  <div class="pm-modal" id="pm-modal">
    <h2 id="pm-modal-title">新規タスク</h2>
    <input type="hidden" id="pm-task-id">
    <div class="pm-form-group">
      <label>タイトル <span style="color:#dc3545">*</span></label>
      <input type="text" id="pm-field-title" required>
    </div>
    <div class="pm-form-group">
      <label>詳細</label>
      <textarea id="pm-field-description"></textarea>
    </div>
    <div class="pm-form-row">
      <div class="pm-form-group">
        <label>ステータス</label>
        <select id="pm-field-status"><option value="todo">ToDo</option><option value="doing">Doing</option><option value="done">Done</option></select>
      </div>
      <div class="pm-form-group">
        <label>優先度</label>
        <select id="pm-field-priority"><option value="medium">中</option><option value="high">高</option><option value="low">低</option></select>
      </div>
    </div>
    <div class="pm-form-row">
      <div class="pm-form-group">
        <label>担当者</label>
        <input type="text" id="pm-field-assignee">
      </div>
      <div class="pm-form-group">
        <label>マイルストーン</label>
        <input type="text" id="pm-field-milestone">
      </div>
    </div>
    <div class="pm-form-row">
      <div class="pm-form-group">
        <label>開始日</label>
        <input type="date" id="pm-field-startDate">
      </div>
      <div class="pm-form-group">
        <label>締切日</label>
        <input type="date" id="pm-field-dueDate">
      </div>
    </div>
    <div class="pm-form-row">
      <div class="pm-form-group">
        <label>予定工数(h)</label>
        <input type="number" id="pm-field-estimatedHours" step="0.5" min="0">
      </div>
      <div class="pm-form-group">
        <label>実績工数(h)</label>
        <input type="number" id="pm-field-actualHours" step="0.5" min="0">
      </div>
    </div>
    <div class="pm-form-group">
      <label>進捗率: <span id="pm-progress-value">0</span>%</label>
      <div class="pm-range-display">
        <input type="range" id="pm-field-progress" min="0" max="100" value="0" oninput="document.getElementById('pm-progress-value').textContent=this.value">
      </div>
    </div>
    <div class="pm-form-group">
      <label>タグ（カンマ区切り）</label>
      <input type="text" id="pm-field-tags" placeholder="tag1, tag2, ...">
    </div>
    <div class="pm-form-group">
      <label>サブタスク</label>
      <ul class="pm-subtask-list" id="pm-subtask-list"></ul>
      <button class="pm-btn small" type="button" onclick="pm.addSubtaskField()">＋ サブタスク追加</button>
    </div>
    <div class="pm-form-group">
      <label>依存タスク（先行タスク）</label>
      <select id="pm-field-predecessors" multiple style="height:80px"></select>
    </div>
    <div class="pm-form-group" id="pm-github-url-group" style="display:none">
      <label>GitHub Issue URL</label>
      <input type="text" id="pm-field-githubIssueUrl" readonly style="background:#f0f0f0">
    </div>
    <div id="pm-activity-section" style="display:none">
      <div class="pm-form-group">
        <label>アクティビティ履歴</label>
        <div class="pm-activity-log" id="pm-activity-log"></div>
      </div>
    </div>
    <div class="pm-modal-actions">
      <button class="pm-btn" onclick="pm.closeModal()">キャンセル</button>
      <button class="pm-btn primary" onclick="pm.saveTask()">保存</button>
    </div>
  </div>
</div>

<!-- Delete Confirm Modal -->
<div class="pm-modal-overlay" id="pm-delete-overlay" onclick="pm.onDeleteOverlayClick(event)">
  <div class="pm-modal" style="max-width:400px">
    <h2>削除確認</h2>
    <p id="pm-delete-msg">このタスクを削除しますか？</p>
    <div class="pm-modal-actions">
      <button class="pm-btn" onclick="pm.closeDeleteModal()">キャンセル</button>
      <button class="pm-btn danger" onclick="pm.confirmDelete()">削除</button>
    </div>
  </div>
</div>

<!-- Import Conflict Modal -->
<div class="pm-modal-overlay" id="pm-import-overlay" onclick="pm.closeImportConflict()">
  <div class="pm-modal" style="max-width:400px">
    <h2>インポート競合</h2>
    <p id="pm-import-msg"></p>
    <div class="pm-modal-actions">
      <button class="pm-btn" onclick="pm.importSkipAll()">すべてスキップ</button>
      <button class="pm-btn primary" onclick="pm.importOverwriteAll()">すべて上書き</button>
    </div>
  </div>
</div>

<script>
(function(){
'use strict';

// ===== Utility Functions =====
function genId(){
  if(typeof crypto!=='undefined'&&crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16)});
}
function now(){return new Date().toISOString()}
function escHtml(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function formatDate(d){if(!d)return '';var dt=new Date(d);return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0')}

// ===== Storage =====
var STORAGE_KEYS={tasks:'rui-pm-tasks',settings:'rui-pm-settings',github:'rui-pm-github',snapshots:'rui-pm-snapshots',activity:'rui-pm-activity'};
function load(key){try{return JSON.parse(localStorage.getItem(key))||null}catch(e){return null}}
function save(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch(e){console.error('localStorage save error',e)}}

// ===== State =====
var tasks=load(STORAGE_KEYS.tasks)||[];
var settings=load(STORAGE_KEYS.settings)||{view:'list',theme:'light',sortField:'createdAt',sortDir:'desc'};
var github=load(STORAGE_KEYS.github)||{token:'',repo:''};
var snapshots=load(STORAGE_KEYS.snapshots)||[];
var activity=load(STORAGE_KEYS.activity)||[];
var currentView=settings.view||'list';
var currentTheme=settings.theme||'light';
var sortField=settings.sortField||'createdAt';
var sortDir=settings.sortDir||'desc';
var selectedIds={};
var deleteTargetId=null;
var importQueue=[];
var calendarDate=new Date();

// ===== Activity Log =====
function logActivity(taskId,action,detail){
  activity.push({taskId:taskId,action:action,detail:detail||'',timestamp:now()});
  if(activity.length>500) activity=activity.slice(-500);
  save(STORAGE_KEYS.activity,activity);
}

// ===== Task CRUD =====
function createTask(data){
  var task={
    id:genId(),title:data.title||'',description:data.description||'',
    status:data.status||'todo',priority:data.priority||'medium',
    assignee:data.assignee||'',startDate:data.startDate||'',dueDate:data.dueDate||'',
    progress:data.progress||0,tags:data.tags||[],
    estimatedHours:data.estimatedHours||0,actualHours:data.actualHours||0,
    milestone:data.milestone||'',subtasks:data.subtasks||[],
    predecessors:data.predecessors||[],githubIssueUrl:data.githubIssueUrl||'',
    createdAt:now(),updatedAt:now()
  };
  tasks.push(task);
  logActivity(task.id,'created','タスクを作成');
  saveAll();
  return task;
}
function updateTask(id,data){
  var t=findTask(id);if(!t)return null;
  var changes=[];
  for(var k in data){if(data.hasOwnProperty(k)&&k!=='id'&&k!=='createdAt'){
    if(JSON.stringify(t[k])!==JSON.stringify(data[k])){
      changes.push(k+': '+JSON.stringify(t[k])+' → '+JSON.stringify(data[k]));
      t[k]=data[k];
    }
  }}
  t.updatedAt=now();
  if(changes.length) logActivity(id,'updated',changes.join(', '));
  saveAll();
  return t;
}
function deleteTask(id){
  tasks=tasks.filter(function(t){return t.id!==id});
  logActivity(id,'deleted','タスクを削除');
  delete selectedIds[id];
  saveAll();
}
function findTask(id){return tasks.find(function(t){return t.id===id})||null}
function saveAll(){save(STORAGE_KEYS.tasks,tasks);save(STORAGE_KEYS.settings,settings);save(STORAGE_KEYS.github,github)}

// ===== Filter & Sort =====
function getFiltered(){
  var s=document.getElementById('pm-filter-status').value;
  var p=document.getElementById('pm-filter-priority').value;
  var a=document.getElementById('pm-filter-assignee').value;
  var m=document.getElementById('pm-filter-milestone').value;
  var q=document.getElementById('pm-search').value.toLowerCase();
  return tasks.filter(function(t){
    if(s&&t.status!==s)return false;
    if(p&&t.priority!==p)return false;
    if(a&&t.assignee!==a)return false;
    if(m&&t.milestone!==m)return false;
    if(q){
      var text=(t.title+' '+t.description+' '+t.assignee+' '+t.milestone+' '+t.tags.join(' ')).toLowerCase();
      if(text.indexOf(q)===-1)return false;
    }
    return true;
  });
}
function getSorted(list){
  var field=sortField;
  var dir=sortDir==='asc'?1:-1;
  return list.slice().sort(function(a,b){
    var va=a[field]||'',vb=b[field]||'';
    if(field==='progress'||field==='estimatedHours'||field==='actualHours'){va=Number(va)||0;vb=Number(vb)||0}
    if(typeof va==='string') va=va.toLowerCase();
    if(typeof vb==='string') vb=vb.toLowerCase();
    if(va<vb)return -1*dir;if(va>vb)return 1*dir;return 0;
  });
}

// ===== Render: List View =====
function renderList(){
  var tbody=document.getElementById('pm-table-body');
  var filtered=getSorted(getFiltered());
  var html='';
  filtered.forEach(function(t){
    var checked=selectedIds[t.id]?'checked':'';
    html+='<tr data-id="'+t.id+'">';
    html+='<td class="pm-col-check"><input type="checkbox" class="pm-row-check" data-id="'+t.id+'" '+checked+' onchange="pm.toggleCheck(\''+t.id+'\',this.checked)"></td>';
    html+='<td>'+escHtml(t.title)+'</td>';
    html+='<td><span class="pm-status '+t.status+'">'+statusLabel(t.status)+'</span></td>';
    html+='<td><span class="pm-priority '+t.priority+'">'+priorityLabel(t.priority)+'</span></td>';
    html+='<td>'+escHtml(t.assignee)+'</td>';
    html+='<td>'+escHtml(t.milestone)+'</td>';
    html+='<td>'+formatDate(t.startDate)+'</td>';
    html+='<td>'+formatDate(t.dueDate)+'</td>';
    html+='<td><div class="pm-progress-wrap"><div class="pm-progress-bar"><div class="pm-progress-fill" style="width:'+t.progress+'%"></div></div><span class="pm-progress-text">'+t.progress+'%</span></div></td>';
    html+='<td class="pm-col-actions"><button class="pm-btn small" onclick="pm.openEditModal(\''+t.id+'\')">編集</button> <button class="pm-btn small danger" onclick="pm.askDelete(\''+t.id+'\')">削除</button></td>';
    html+='</tr>';
  });
  tbody.innerHTML=html;
  updateBulkBar();
  // Update sort arrows
  document.querySelectorAll('.pm-table th').forEach(function(th){
    th.classList.remove('sorted');
    var arrow=th.querySelector('.pm-sort-arrow');
    if(arrow) arrow.textContent='↕';
  });
  var sortHeaders={title:1,status:2,priority:3,assignee:4,milestone:5,startDate:6,dueDate:7,progress:8};
  var idx=sortHeaders[sortField];
  if(idx){
    var ths=document.querySelectorAll('.pm-table th');
    if(ths[idx]){ths[idx].classList.add('sorted');var ar=ths[idx].querySelector('.pm-sort-arrow');if(ar)ar.textContent=sortDir==='asc'?'↑':'↓'}
  }
}
function statusLabel(s){return{todo:'ToDo',doing:'Doing',done:'Done'}[s]||s}
function priorityLabel(p){return{high:'高',medium:'中',low:'低'}[p]||p}

// ===== Render: Kanban View =====
function renderKanban(){
  var filtered=getFiltered();
  var cols={todo:[],doing:[],done:[]};
  filtered.forEach(function(t){if(cols[t.status])cols[t.status].push(t)});
  ['todo','doing','done'].forEach(function(status){
    var container=document.getElementById('pm-kanban-'+status);
    var html='';
    cols[status].forEach(function(t){
      html+='<div class="pm-kanban-card" draggable="true" data-id="'+t.id+'" ondragstart="pm.onDragStart(event,\''+t.id+'\')" ondragend="pm.onDragEnd(event)">';
      html+='<div class="pm-card-title">'+escHtml(t.title)+'</div>';
      html+='<div class="pm-card-meta"><span class="pm-priority '+t.priority+'">'+priorityLabel(t.priority)+'</span> ';
      if(t.assignee) html+=escHtml(t.assignee)+' ';
      html+='<div class="pm-progress-wrap" style="margin-top:4px"><div class="pm-progress-bar"><div class="pm-progress-fill" style="width:'+t.progress+'%"></div></div><span class="pm-progress-text">'+t.progress+'%</span></div>';
      html+='</div></div>';
    });
    container.innerHTML=html;
  });
}

// ===== Render: Gantt View =====
function renderGantt(){
  var filtered=getSorted(getFiltered());
  var container=document.getElementById('pm-gantt');
  if(!filtered.length){container.innerHTML='<p style="text-align:center;color:#999;padding:40px">タスクがありません</p>';return}
  // Calculate date range
  var minDate=Infinity,maxDate=-Infinity;
  filtered.forEach(function(t){
    if(t.startDate){var d=new Date(t.startDate).getTime();if(d<minDate)minDate=d}
    if(t.dueDate){var d=new Date(t.dueDate).getTime();if(d>maxDate)maxDate=d}
  });
  if(minDate===Infinity){minDate=new Date().getTime();maxDate=minDate+28*86400000}
  // Ensure at least 4 weeks
  var rangeEnd=Math.max(maxDate,minDate+28*86400000);
  var rangeStart=minDate-7*86400000;
  // Get Monday of start
  var startDate=new Date(rangeStart);
  startDate.setDate(startDate.getDate()-((startDate.getDay()+6)%7));
  startDate.setHours(0,0,0,0);
  var endDate=new Date(rangeEnd+7*86400000);
  // Build weeks
  var weeks=[];
  var d=new Date(startDate);
  while(d<=endDate){
    weeks.push({label:(d.getMonth()+1)+'/'+d.getDate(),start:new Date(d)});
    d.setDate(d.getDate()+7);
  }
  if(weeks.length<4){for(var i=weeks.length;i<4;i++){var nd=new Date(startDate);nd.setDate(nd.getDate()+(i+1)*7);weeks.push({label:(nd.getMonth()+1)+'/'+nd.getDate(),start:new Date(nd)})}}
  var totalDays=weeks.length*7;
  var today=new Date();today.setHours(0,0,0,0);
  // Header
  var html='<div class="pm-gantt-header-row"><div class="pm-gantt-task-label">タスク</div><div class="pm-gantt-weeks">';
  weeks.forEach(function(w){html+='<div class="pm-gantt-week">'+w.label+'</div>'});
  html+='</div></div>';
  // Rows
  filtered.forEach(function(t){
    html+='<div class="pm-gantt-row"><div class="pm-gantt-row-label" title="'+escHtml(t.title)+'">'+escHtml(t.title)+'</div><div class="pm-gantt-row-bars">';
    // Task bar
    if(t.startDate&&t.dueDate){
      var ts=new Date(t.startDate).getTime();
      var te=new Date(t.dueDate).getTime();
      var leftPct=((ts-startDate.getTime())/(totalDays*86400000))*100;
      var widthPct=Math.max(((te-ts)/(totalDays*86400000))*100,2);
      html+='<div class="pm-gantt-bar '+t.priority+'" style="left:'+leftPct+'%;width:'+widthPct+'%" title="'+escHtml(t.title)+' ('+formatDate(t.startDate)+'〜'+formatDate(t.dueDate)+')">'+escHtml(t.title)+'</div>';
    }
    // Milestone diamond
    if(t.milestone&&t.dueDate){
      var ms=new Date(t.dueDate).getTime();
      var msPct=((ms-startDate.getTime())/(totalDays*86400000))*100;
      html+='<div class="pm-gantt-milestone" style="left:calc('+msPct+'% - 8px)" title="マイルストーン: '+escHtml(t.milestone)+'"></div>';
    }
    // Today line
    var todayMs=today.getTime();
    if(todayMs>=startDate.getTime()&&todayMs<=startDate.getTime()+totalDays*86400000){
      var todayPct=((todayMs-startDate.getTime())/(totalDays*86400000))*100;
      html+='<div class="pm-gantt-today" style="left:'+todayPct+'%"></div>';
    }
    html+='</div></div>';
  });
  container.innerHTML=html;
}

// ===== Render: Calendar View =====
function renderCalendar(){
  var container=document.getElementById('pm-calendar');
  var y=calendarDate.getFullYear(),m=calendarDate.getMonth();
  var firstDay=new Date(y,m,1);
  var lastDay=new Date(y,m+1,0);
  var startDow=(firstDay.getDay()+6)%7; // Monday=0
  var filtered=getFiltered();
  // Header
  var monthNames=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var html='<div class="pm-calendar-header"><button class="pm-btn small" onclick="pm.calPrev()">◀</button><h3>'+y+'年 '+monthNames[m]+'</h3><button class="pm-btn small" onclick="pm.calNext()">▶</button></div>';
  html+='<div class="pm-calendar-grid">';
  // Day names
  var dayNames=['月','火','水','木','金','土','日'];
  dayNames.forEach(function(d){html+='<div class="pm-calendar-day-name">'+d+'</div>'});
  // Previous month days
  var prevLast=new Date(y,m,0).getDate();
  for(var i=startDow-1;i>=0;i--){
    html+='<div class="pm-calendar-cell other-month"><div class="pm-cal-date">'+(prevLast-i)+'</div></div>';
  }
  // Current month days
  for(var d=1;d<=lastDay.getDate();d++){
    var dateStr=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var isToday=dateStr===formatDate(new Date());
    var dayTasks=filtered.filter(function(t){
      if(!t.startDate&&!t.dueDate)return false;
      var start=t.startDate||'0000-00-00';
      var end=t.dueDate||'9999-99-99';
      return dateStr>=start&&dateStr<=end;
    });
    html+='<div class="pm-calendar-cell'+(isToday?' today':'')+'"><div class="pm-cal-date">'+d+'</div>';
    dayTasks.forEach(function(t){html+='<span class="pm-cal-dot '+t.priority+'" title="'+escHtml(t.title)+'"></span>'});
    html+='</div>';
  }
  // Next month days
  var totalCells=startDow+lastDay.getDate();
  var remaining=7-(totalCells%7);
  if(remaining<7){for(var i=1;i<=remaining;i++){html+='<div class="pm-calendar-cell other-month"><div class="pm-cal-date">'+i+'</div></div>'}}
  html+='</div>';
  container.innerHTML=html;
}

// ===== Render All =====
function renderAll(){
  updateFilterOptions();
  if(currentView==='list') renderList();
  else if(currentView==='gantt') renderGantt();
  else if(currentView==='kanban') renderKanban();
  else if(currentView==='calendar') renderCalendar();
}

// ===== Filter Options =====
function updateFilterOptions(){
  var assignees=[],milestones=[];
  tasks.forEach(function(t){
    if(t.assignee&&assignees.indexOf(t.assignee)===-1)assignees.push(t.assignee);
    if(t.milestone&&milestones.indexOf(t.milestone)===-1)milestones.push(t.milestone);
  });
  var asel=document.getElementById('pm-filter-assignee');
  var aval=asel.value;
  asel.innerHTML='<option value="">担当者</option>';
  assignees.sort().forEach(function(a){asel.innerHTML+='<option value="'+escHtml(a)+'"'+(a===aval?' selected':'')+'>'+escHtml(a)+'</option>'});
  var msel=document.getElementById('pm-filter-milestone');
  var mval=msel.value;
  msel.innerHTML='<option value="">マイルストーン</option>';
  milestones.sort().forEach(function(m){msel.innerHTML+='<option value="'+escHtml(m)+'"'+(m===mval?' selected':'')+'>'+escHtml(m)+'</option>'});
}

// ===== View Switching =====
function switchView(view){
  currentView=view;
  settings.view=view;
  saveAll();
  document.querySelectorAll('.pm-tab').forEach(function(t){t.classList.toggle('active',t.dataset.view===view)});
  document.querySelectorAll('.pm-view').forEach(function(v){v.classList.toggle('active',v.id==='pm-view-'+view)});
  renderAll();
}

// ===== Sort =====
function sortBy(field){
  if(sortField===field) sortDir=sortDir==='asc'?'desc':'asc';
  else{sortField=field;sortDir='asc'}
  settings.sortField=sortField;settings.sortDir=sortDir;
  saveAll();
  renderAll();
}

// ===== Checkbox & Bulk =====
function toggleCheck(id,checked){
  if(checked)selectedIds[id]=true;else delete selectedIds[id];
  updateBulkBar();
}
function toggleAllChecks(checked){
  var filtered=getFiltered();
  filtered.forEach(function(t){
    if(checked)selectedIds[t.id]=true;else delete selectedIds[t.id];
  });
  document.querySelectorAll('.pm-row-check').forEach(function(cb){cb.checked=checked});
  updateBulkBar();
}
function updateBulkBar(){
  var count=Object.keys(selectedIds).length;
  var bar=document.getElementById('pm-bulk-bar');
  bar.classList.toggle('show',count>0);
  document.getElementById('pm-bulk-count').textContent=count+'件選択中';
}
function bulkDelete(){
  var ids=Object.keys(selectedIds);
  if(!ids.length)return;
  if(!confirm(ids.length+'件のタスクを削除しますか？'))return;
  ids.forEach(function(id){deleteTask(id)});
  selectedIds={};
  renderAll();
}
function bulkStatusChange(status){
  if(!status)return;
  var ids=Object.keys(selectedIds);
  ids.forEach(function(id){
    var t=findTask(id);if(t){updateTask(id,{status:status})}
  });
  document.getElementById('pm-bulk-status').value='';
  renderAll();
}
function bulkCreateIssues(){
  var ids=Object.keys(selectedIds);
  if(!ids.length)return;
  if(!github.token||!github.repo){alert('設定パネルでGitHub PATとリポジトリを設定してください');return}
  ids.forEach(function(id){
    var t=findTask(id);if(t&&!t.githubIssueUrl) createGitHubIssue(t);
  });
}

// ===== Modal =====
function openAddModal(){
  document.getElementById('pm-modal-title').textContent='新規タスク';
  document.getElementById('pm-task-id').value='';
  clearModalFields();
  document.getElementById('pm-github-url-group').style.display='none';
  document.getElementById('pm-activity-section').style.display='none';
  updatePredecessorOptions('');
  document.getElementById('pm-modal-overlay').classList.add('show');
}
function openEditModal(id){
  var t=findTask(id);if(!t)return;
  document.getElementById('pm-modal-title').textContent='タスク編集';
  document.getElementById('pm-task-id').value=t.id;
  document.getElementById('pm-field-title').value=t.title;
  document.getElementById('pm-field-description').value=t.description;
  document.getElementById('pm-field-status').value=t.status;
  document.getElementById('pm-field-priority').value=t.priority;
  document.getElementById('pm-field-assignee').value=t.assignee;
  document.getElementById('pm-field-milestone').value=t.milestone;
  document.getElementById('pm-field-startDate').value=t.startDate;
  document.getElementById('pm-field-dueDate').value=t.dueDate;
  document.getElementById('pm-field-estimatedHours').value=t.estimatedHours;
  document.getElementById('pm-field-actualHours').value=t.actualHours;
  document.getElementById('pm-field-progress').value=t.progress;
  document.getElementById('pm-progress-value').textContent=t.progress;
  document.getElementById('pm-field-tags').value=(t.tags||[]).join(', ');
  document.getElementById('pm-field-githubIssueUrl').value=t.githubIssueUrl||'';
  document.getElementById('pm-github-url-group').style.display=t.githubIssueUrl?'block':'none';
  document.getElementById('pm-activity-section').style.display='block';
  // Subtasks
  renderSubtaskFields(t.subtasks||[]);
  // Predecessors
  updatePredecessorOptions(t.id);
  var predSel=document.getElementById('pm-field-predecessors');
  (t.predecessors||[]).forEach(function(pid){
    for(var i=0;i<predSel.options.length;i++){if(predSel.options[i].value===pid)predSel.options[i].selected=true}
  });
  // Activity log
  renderActivityLog(id);
  document.getElementById('pm-modal-overlay').classList.add('show');
}
function closeModal(){document.getElementById('pm-modal-overlay').classList.remove('show')}
function onModalOverlayClick(e){if(e.target===document.getElementById('pm-modal-overlay'))closeModal()}
function clearModalFields(){
  ['pm-field-title','pm-field-description','pm-field-assignee','pm-field-milestone','pm-field-startDate','pm-field-dueDate','pm-field-tags','pm-field-githubIssueUrl'].forEach(function(id){document.getElementById(id).value=''});
  document.getElementById('pm-field-status').value='todo';
  document.getElementById('pm-field-priority').value='medium';
  document.getElementById('pm-field-estimatedHours').value='';
  document.getElementById('pm-field-actualHours').value='';
  document.getElementById('pm-field-progress').value=0;
  document.getElementById('pm-progress-value').textContent='0';
  document.getElementById('pm-subtask-list').innerHTML='';
  document.getElementById('pm-field-predecessors').innerHTML='';
}
function saveTask(){
  var id=document.getElementById('pm-task-id').value;
  var title=document.getElementById('pm-field-title').value.trim();
  if(!title){alert('タイトルは必須です');return}
  var data={
    title:title,
    description:document.getElementById('pm-field-description').value,
    status:document.getElementById('pm-field-status').value,
    priority:document.getElementById('pm-field-priority').value,
    assignee:document.getElementById('pm-field-assignee').value.trim(),
    milestone:document.getElementById('pm-field-milestone').value.trim(),
    startDate:document.getElementById('pm-field-startDate').value,
    dueDate:document.getElementById('pm-field-dueDate').value,
    estimatedHours:parseFloat(document.getElementById('pm-field-estimatedHours').value)||0,
    actualHours:parseFloat(document.getElementById('pm-field-actualHours').value)||0,
    progress:parseInt(document.getElementById('pm-field-progress').value)||0,
    tags:document.getElementById('pm-field-tags').value.split(',').map(function(s){return s.trim()}).filter(Boolean),
    subtasks:getSubtasksFromFields(),
    predecessors:getSelectedPredecessors()
  };
  // Auto-calculate progress from subtasks
  if(data.subtasks&&data.subtasks.length>0){
    var doneCount=data.subtasks.filter(function(st){return st.done}).length;
    data.progress=Math.round((doneCount/data.subtasks.length)*100);
  }
  if(id){updateTask(id,data)}
  else{createTask(data)}
  closeModal();
  renderAll();
}

// ===== Subtask Fields =====
function addSubtaskField(text,done){
  var li=document.createElement('li');li.className='pm-subtask-item';
  li.innerHTML='<input type="checkbox"'+(done?' checked':'')+'><input type="text" value="'+escHtml(text||'')+'"><button class="pm-btn small danger" onclick="this.parentElement.remove()">✕</button>';
  document.getElementById('pm-subtask-list').appendChild(li);
}
function renderSubtaskFields(subtasks){
  var list=document.getElementById('pm-subtask-list');list.innerHTML='';
  (subtasks||[]).forEach(function(st){addSubtaskField(st.text,st.done)});
}
function getSubtasksFromFields(){
  var items=document.querySelectorAll('#pm-subtask-list .pm-subtask-item');
  return Array.from(items).map(function(li){
    return{text:li.querySelector('input[type=text]').value.trim(),done:li.querySelector('input[type=checkbox]').checked};
  }).filter(function(st){return st.text});
}

// ===== Predecessor Options =====
function updatePredecessorOptions(excludeId){
  var sel=document.getElementById('pm-field-predecessors');
  sel.innerHTML='';
  tasks.forEach(function(t){
    if(t.id!==excludeId){
      var opt=document.createElement('option');opt.value=t.id;opt.textContent=t.title;sel.appendChild(opt);
    }
  });
}
function getSelectedPredecessors(){
  var sel=document.getElementById('pm-field-predecessors');
  return Array.from(sel.selectedOptions).map(function(o){return o.value});
}

// ===== Activity Log =====
function renderActivityLog(taskId){
  var log=document.getElementById('pm-activity-log');
  var items=activity.filter(function(a){return a.taskId===taskId}).reverse().slice(0,50);
  log.innerHTML=items.map(function(a){
    return '<div class="pm-activity-item"><span class="pm-activity-time">'+new Date(a.timestamp).toLocaleString()+'</span> '+escHtml(a.action)+(a.detail?' — '+escHtml(a.detail):'')+'</div>';
  }).join('')||'<div style="color:#999">履歴なし</div>';
}

// ===== Delete =====
function askDelete(id){deleteTargetId=id;document.getElementById('pm-delete-msg').textContent='「'+findTask(id).title+'」を削除しますか？';document.getElementById('pm-delete-overlay').classList.add('show')}
function closeDeleteModal(){document.getElementById('pm-delete-overlay').classList.remove('show');deleteTargetId=null}
function confirmDelete(){if(deleteTargetId){deleteTask(deleteTargetId);closeDeleteModal();renderAll()}}
function onDeleteOverlayClick(e){if(e.target===document.getElementById('pm-delete-overlay'))closeDeleteModal()}

// ===== Drag & Drop (Kanban) =====
var dragId=null;
function onDragStart(e,id){dragId=id;e.dataTransfer.effectAllowed='move';e.target.classList.add('dragging')}
function onDragEnd(e){e.target.classList.remove('dragging')}
function onDragOver(e){e.preventDefault();e.currentTarget.classList.add('drag-over')}
function onDragLeave(e){e.currentTarget.classList.remove('drag-over')}
function onDrop(e,status){
  e.preventDefault();e.currentTarget.classList.remove('drag-over');
  if(dragId){updateTask(dragId,{status:status});dragId=null;renderAll()}
}

// ===== Export =====
function exportJSON(){
  var blob=new Blob([JSON.stringify(tasks,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='project-tasks.json';a.click();URL.revokeObjectURL(a.href);
}
function exportCSV(){
  var headers=['id','title','description','status','priority','assignee','startDate','dueDate','progress','tags','estimatedHours','actualHours','milestone','subtasks','predecessors','githubIssueUrl','createdAt','updatedAt'];
  var rows=[headers.join(',')];
  tasks.forEach(function(t){
    var row=[
      '"'+(t.id||'')+'"',
      '"'+(t.title||'').replace(/"/g,'""')+'"',
      '"'+(t.description||'').replace(/"/g,'""').replace(/\n/g,' ')+'"',
      t.status,t.priority,
      '"'+(t.assignee||'')+'"',
      t.startDate,t.dueDate,
      t.progress,
      '"'+(t.tags||[]).join(';')+'"',
      t.estimatedHours,t.actualHours,
      '"'+(t.milestone||'')+'"',
      '"'+JSON.stringify(t.subtasks||[]).replace(/"/g,'""')+'"',
      '"'+(t.predecessors||[]).join(';')+'"',
      '"'+(t.githubIssueUrl||'')+'"',
      t.createdAt,t.updatedAt
    ];
    rows.push(row.join(','));
  });
  var bom='\uFEFF';
  var blob=new Blob([bom+rows.join('\n')],{type:'text/csv;charset=utf-8'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='project-tasks.csv';a.click();URL.revokeObjectURL(a.href);
}

// ===== Import =====
function triggerImport(){document.getElementById('pm-import-file').click()}
function handleImport(e){
  var file=e.target.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(ev){
    var content=ev.target.result;
    if(file.name.endsWith('.json')){importJSON(content)}
    else if(file.name.endsWith('.csv')){importCSV(content)}
    else{alert('対応形式: .json, .csv')}
  };
  reader.readAsText(file);
  e.target.value='';
}
function importJSON(content){
  try{
    var data=JSON.parse(content);
    if(!Array.isArray(data)){alert('無効なJSON形式です');return}
    var conflicts=data.filter(function(nt){return tasks.some(function(t){return t.id===nt.id})});
    if(conflicts.length>0){
      importQueue=data;importConflictMode=null;
      document.getElementById('pm-import-msg').textContent=conflicts.length+'件のID重複があります。どうしますか？';
      document.getElementById('pm-import-overlay').classList.add('show');
    }else{
      data.forEach(function(nt){tasks.push(Object.assign({},nt));logActivity(nt.id,'imported','インポート')});
      saveAll();renderAll();
    }
  }catch(err){alert('JSONパースエラー: '+err.message)}
}
function importCSV(content){
  try{
    var lines=content.replace(/^\uFEFF/,'').split('\n').filter(function(l){return l.trim()});
    if(lines.length<2){alert('CSVデータがありません');return}
    var headers=parseCSVLine(lines[0]);
    var imported=0;
    for(var i=1;i<lines.length;i++){
      var vals=parseCSVLine(lines[i]);
      var obj={};
      headers.forEach(function(h,idx){obj[h]=vals[idx]||''});
      obj.progress=parseInt(obj.progress)||0;
      obj.estimatedHours=parseFloat(obj.estimatedHours)||0;
      obj.actualHours=parseFloat(obj.actualHours)||0;
      obj.tags=(obj.tags||'').split(';').filter(Boolean);
      try{obj.subtasks=JSON.parse(obj.subtasks||'[]')}catch(e){obj.subtasks=[]}
      obj.predecessors=(obj.predecessors||'').split(';').filter(Boolean);
      if(!obj.id)obj.id=genId();
      var existing=findTask(obj.id);
      if(existing) Object.assign(existing,obj);
      else tasks.push(obj);
      imported++;
    }
    saveAll();renderAll();
    alert(imported+'件インポートしました');
  }catch(err){alert('CSVパースエラー: '+err.message)}
}
function parseCSVLine(line){
  var result=[],current='',inQuotes=false;
  for(var i=0;i<line.length;i++){
    var c=line[i];
    if(inQuotes){
      if(c==='"'&&line[i+1]==='"'){current+='"';i++}
      else if(c==='"'){inQuotes=false}
      else{current+=c}
    }else{
      if(c==='"'){inQuotes=true}
      else if(c===','){result.push(current);current=''}
      else{current+=c}
    }
  }
  result.push(current);return result;
}
function importOverwriteAll(){
  importQueue.forEach(function(nt){
    var idx=tasks.findIndex(function(t){return t.id===nt.id});
    if(idx>=0)tasks[idx]=Object.assign({},nt);
    else tasks.push(Object.assign({},nt));
    logActivity(nt.id,'imported','インポート（上書き）');
  });
  importQueue=[];
  document.getElementById('pm-import-overlay').classList.remove('show');
  saveAll();renderAll();
}
function importSkipAll(){
  importQueue.forEach(function(nt){
    if(!findTask(nt.id)){tasks.push(Object.assign({},nt));logActivity(nt.id,'imported','インポート')}
  });
  importQueue=[];
  document.getElementById('pm-import-overlay').classList.remove('show');
  saveAll();renderAll();
}
function closeImportConflict(){document.getElementById('pm-import-overlay').classList.remove('show');importQueue=[]}

// ===== GitHub Issue =====
function createGitHubIssue(task){
  if(!github.token||!github.repo)return;
  var parts=github.repo.split('/');
  var owner=parts[0],repo=parts[1];
  if(!owner||!repo){alert('リポジトリ形式: owner/repo');return}
  var body='**詳細:** '+task.description+'\n\n**優先度:** '+priorityLabel(task.priority)+'\n**担当者:** '+task.assignee+'\n**進捗:** '+task.progress+'%';
  if(task.startDate)body+='\n**開始日:** '+task.startDate;
  if(task.dueDate)body+='\n**締切日:** '+task.dueDate;
  fetch('https://api.github.com/repos/'+owner+'/'+repo+'/issues',{
    method:'POST',
    headers:{'Authorization':'token '+github.token,'Content-Type':'application/json'},
    body:JSON.stringify({title:task.title,body:body,labels:['project-manager']})
  }).then(function(r){return r.json()}).then(function(data){
    if(data.html_url){
      updateTask(task.id,{githubIssueUrl:data.html_url});
      logActivity(task.id,'github_issue','Issue作成: '+data.html_url);
      renderAll();
    }else{alert('Issue作成エラー: '+(data.message||'不明なエラー'))}
  }).catch(function(err){alert('GitHub API エラー: '+err.message)});
}

// ===== Settings =====
function toggleSettings(){document.getElementById('pm-settings').classList.toggle('show')}
function toggleSettingsBody(){
  var body=document.getElementById('pm-settings-body');
  var arrow=document.getElementById('pm-settings-arrow');
  body.classList.toggle('show');
  arrow.textContent=body.classList.contains('show')?'▲':'▼';
}
function saveSettings(){
  github.token=document.getElementById('pm-github-token').value;
  github.repo=document.getElementById('pm-github-repo').value;
  save(STORAGE_KEYS.github,github);
  alert('設定を保存しました');
}

// ===== Snapshots =====
function saveSnapshot(){
  var name=document.getElementById('pm-snapshot-name').value.trim();
  if(!name){alert('スナップショット名を入力してください');return}
  var snap={name:name,data:JSON.parse(JSON.stringify(tasks)),timestamp:now()};
  snapshots.push(snap);
  save(STORAGE_KEYS.snapshots,snapshots);
  document.getElementById('pm-snapshot-name').value='';
  updateSnapshotList();
  alert('スナップショット「'+name+'」を保存しました');
}
function loadSnapshot(name){
  if(!name)return;
  var snap=snapshots.find(function(s){return s.name===name});
  if(!snap)return;
  if(!confirm('スナップショット「'+name+'」を復元しますか？現在のデータは上書きされます。'))return;
  tasks=JSON.parse(JSON.stringify(snap.data));
  saveAll();renderAll();
}
function deleteSnapshot(){
  var sel=document.getElementById('pm-snapshot-list');
  var name=sel.value;if(!name)return;
  if(!confirm('スナップショット「'+name+'」を削除しますか？'))return;
  snapshots=snapshots.filter(function(s){return s.name!==name});
  save(STORAGE_KEYS.snapshots,snapshots);
  updateSnapshotList();
}
function updateSnapshotList(){
  var sel=document.getElementById('pm-snapshot-list');
  sel.innerHTML='<option value="">復元...</option>';
  snapshots.forEach(function(s){sel.innerHTML+='<option value="'+escHtml(s.name)+'">'+escHtml(s.name)+' ('+new Date(s.timestamp).toLocaleString()+')</option>'});
}

// ===== Theme =====
function toggleTheme(){
  currentTheme=currentTheme==='light'?'dark':'light';
  settings.theme=currentTheme;
  saveAll();
  document.getElementById('pm-app').classList.toggle('dark',currentTheme==='dark');
}

// ===== Calendar Navigation =====
function calPrev(){calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar()}
function calNext(){calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar()}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown',function(e){
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
  if(e.ctrlKey&&e.key==='n'){e.preventDefault();openAddModal()}
  if(e.ctrlKey&&e.key==='1'){e.preventDefault();switchView('list')}
  if(e.ctrlKey&&e.key==='2'){e.preventDefault();switchView('gantt')}
  if(e.ctrlKey&&e.key==='3'){e.preventDefault();switchView('kanban')}
  if(e.ctrlKey&&e.key==='4'){e.preventDefault();switchView('calendar')}
  if(e.key==='/'){e.preventDefault();document.getElementById('pm-search').focus()}
  if(e.key==='Escape'){closeModal();closeDeleteModal();closeImportConflict()}
});

// ===== Init =====
function init(){
  // Apply theme
  if(currentTheme==='dark') document.getElementById('pm-app').classList.add('dark');
  // Apply saved view
  switchView(currentView);
  // Load settings into form
  document.getElementById('pm-github-token').value=github.token||'';
  document.getElementById('pm-github-repo').value=github.repo||'';
  updateSnapshotList();
  renderAll();
}

// ===== Public API =====
window.pm={
  openAddModal:openAddModal,openEditModal:openEditModal,closeModal:closeModal,
  onModalOverlayClick:onModalOverlayClick,saveTask:saveTask,
  addSubtaskField:addSubtaskField,
  askDelete:askDelete,closeDeleteModal:closeDeleteModal,confirmDelete:confirmDelete,
  onDeleteOverlayClick:onDeleteOverlayClick,
  switchView:switchView,sortBy:sortBy,onFilterChange:renderAll,
  toggleCheck:toggleCheck,toggleAllChecks:toggleAllChecks,
  bulkDelete:bulkDelete,bulkStatusChange:bulkStatusChange,bulkCreateIssues:bulkCreateIssues,
  onDragStart:onDragStart,onDragEnd:onDragEnd,onDragOver:onDragOver,onDrop:onDrop,onDragLeave:onDragLeave,
  exportJSON:exportJSON,exportCSV:exportCSV,triggerImport:triggerImport,handleImport:handleImport,
  importOverwriteAll:importOverwriteAll,importSkipAll:importSkipAll,closeImportConflict:closeImportConflict,
  toggleSettings:toggleSettings,toggleSettingsBody:toggleSettingsBody,saveSettings:saveSettings,
  saveSnapshot:saveSnapshot,loadSnapshot:loadSnapshot,deleteSnapshot:deleteSnapshot,
  toggleTheme:toggleTheme,calPrev:calPrev,calNext:calNext
};

init();
})();
</script>