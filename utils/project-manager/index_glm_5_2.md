---
layout: default
title: プロジェクト管理 (GLM 5.2) - Rui Software
---

<style>
/* ============================================
   Project Manager - GLM 5.2
   SPEC: utils/project-manager/SPEC.md
   ============================================ */

/* ===== CSS Variables (Color Palette per SPEC §6.1) ===== */
.pm-wrap {
  --pm-accent: #2e8b57;
  --pm-accent-dark: #1a5c38;
  --pm-accent-light: #eaf3ee;
  --pm-panel-bg: #f7faf8;
  --pm-panel-border: #dde8e2;
  --pm-border-strong: #aaccbb;
  --pm-hover-bg: #eaf3ee;
  --pm-text: #333;
  --pm-text-muted: #666;
  --pm-white: #fff;
  --pm-priority-high: #dc3545;
  --pm-priority-medium: #ffc107;
  --pm-priority-low: #2e8b57;
  --pm-status-todo-bg: #e2e3e5;
  --pm-status-todo-text: #383d41;
  --pm-status-doing-bg: #cce5ff;
  --pm-status-doing-text: #004085;
  --pm-status-done-bg: #d4edda;
  --pm-status-done-text: #155724;
  --pm-modal-overlay: rgba(0, 0, 0, 0.5);
  --pm-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  --pm-today-line: #dc3545;
  --pm-weekend-bg: #fafbfa;
  --pm-grid-line: #dde8e2;
}

/* ===== Dark Theme (SPEC §4.2 #16) ===== */
.pm-wrap.dark-theme {
  --pm-accent: #3cb371;
  --pm-accent-dark: #2e8b57;
  --pm-accent-light: #1a3a2a;
  --pm-panel-bg: #1e2a23;
  --pm-panel-border: #2e4a3a;
  --pm-border-strong: #3a5a4a;
  --pm-hover-bg: #2a3a30;
  --pm-text: #e0e8e4;
  --pm-text-muted: #a0b0a8;
  --pm-white: #2a3a30;
  --pm-status-todo-bg: #3a3d41;
  --pm-status-todo-text: #c0c4c8;
  --pm-status-doing-bg: #1a3a5a;
  --pm-status-doing-text: #8ab4e0;
  --pm-status-done-bg: #1a3a2a;
  --pm-status-done-text: #8ad4a0;
  --pm-modal-overlay: rgba(0, 0, 0, 0.7);
  --pm-weekend-bg: #1a2a20;
  --pm-grid-line: #2e4a3a;
}

/* ===== Root Container ===== */
.pm-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 0 40px;
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  color: var(--pm-text);
  box-sizing: border-box;
}
.pm-wrap *, .pm-wrap *::before, .pm-wrap *::after {
  box-sizing: border-box;
}
.pm-wrap h1 {
  font-size: 1.5em;
  font-weight: 400;
  border-left: 6px solid var(--pm-accent);
  padding-left: 10px;
  margin-bottom: 16px;
  color: var(--pm-text);
}
.pm-wrap h2 {
  font-size: 1.2em;
  font-weight: 400;
  border-left: 4px solid var(--pm-accent);
  padding-left: 8px;
  margin: 20px 0 10px;
  color: var(--pm-text);
}

/* ===== Controls Bar ===== */
.pm-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
  padding: 10px 12px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
}
.pm-controls .pm-ctrl-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pm-controls .pm-ctrl-sep {
  color: var(--pm-border-strong);
  margin: 0 4px;
}
.pm-controls .pm-search {
  flex: 1;
  min-width: 160px;
  padding: 6px 10px;
  border: 1px solid var(--pm-border-strong);
  border-radius: 3px;
  font-size: 14px;
  background: var(--pm-white);
  color: var(--pm-text);
}
.pm-controls select {
  padding: 5px 8px;
  border: 1px solid var(--pm-border-strong);
  border-radius: 3px;
  font-size: 13px;
  background: var(--pm-white);
  color: var(--pm-text);
}

/* ===== Buttons ===== */
.pm-btn {
  display: inline-block;
  padding: 6px 14px;
  font-size: 13px;
  border: 1px solid var(--pm-accent);
  border-radius: 3px;
  background: var(--pm-accent);
  color: var(--pm-white);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
  font-family: inherit;
  line-height: 1.4;
}
.pm-btn:hover {
  background: var(--pm-accent-dark);
  border-color: var(--pm-accent-dark);
  color: var(--pm-white);
}
.pm-btn.secondary {
  background: var(--pm-white);
  color: var(--pm-accent);
}
.pm-btn.secondary:hover {
  background: var(--pm-hover-bg);
  color: var(--pm-accent);
}
.pm-btn.danger {
  background: var(--pm-priority-high);
  border-color: var(--pm-priority-high);
  color: var(--pm-white);
}
.pm-btn.danger:hover {
  background: #b02a37;
  border-color: #b02a37;
}
.pm-btn.small {
  padding: 3px 8px;
  font-size: 12px;
}
.pm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== Tab Group ===== */
.pm-tab-group {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--pm-panel-border);
  margin-bottom: 12px;
}
.pm-tab {
  padding: 8px 18px;
  cursor: pointer;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  font-size: 14px;
  color: var(--pm-text-muted);
  background: transparent;
  transition: all 0.15s;
  font-family: inherit;
}
.pm-tab:hover {
  color: var(--pm-accent);
  background: var(--pm-hover-bg);
}
.pm-tab.active {
  color: var(--pm-accent);
  background: var(--pm-panel-bg);
  border-color: var(--pm-panel-border);
  border-bottom: 2px solid var(--pm-panel-bg);
  margin-bottom: -2px;
  font-weight: bold;
}

/* ===== View Container ===== */
.pm-view-container {
  position: relative;
  min-height: 300px;
}
.pm-view {
  display: none;
}
.pm-view.active {
  display: block;
}

/* ===== Bulk Action Bar (SPEC §4.2 #13) ===== */
.pm-bulk-bar {
  display: none;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: var(--pm-accent-light);
  border: 1px solid var(--pm-accent);
  border-radius: 4px;
}
.pm-bulk-bar.show {
  display: flex;
}
.pm-bulk-bar .pm-bulk-count {
  font-weight: bold;
  color: var(--pm-accent);
  margin-right: auto;
}

/* ===== Settings Panel (collapsible) ===== */
.pm-settings-panel {
  display: none;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
}
.pm-settings-panel.show {
  display: block;
}
.pm-settings-panel h3 {
  margin: 0 0 8px;
  font-size: 1em;
  color: var(--pm-accent);
}
.pm-settings-panel .pm-settings-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}
.pm-settings-panel .pm-settings-row label {
  font-size: 13px;
  color: var(--pm-text);
  display: flex;
  align-items: center;
  gap: 4px;
}
.pm-settings-panel input[type="text"],
.pm-settings-panel input[type="password"] {
  padding: 5px 8px;
  border: 1px solid var(--pm-border-strong);
  border-radius: 3px;
  font-size: 13px;
  background: var(--pm-white);
  color: var(--pm-text);
}
.pm-settings-panel .pm-security-note {
  font-size: 12px;
  color: var(--pm-priority-high);
  margin-top: 4px;
}

/* ===== Table (List View) ===== */
.pm-table-wrap {
  overflow-x: auto;
}
.pm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.pm-table th, .pm-table td {
  padding: 6px 10px;
  border: 1px solid var(--pm-panel-border);
  text-align: left;
  white-space: nowrap;
}
.pm-table th {
  background: var(--pm-panel-bg);
  color: var(--pm-accent);
  cursor: pointer;
  user-select: none;
  position: relative;
}
.pm-table th .pm-sort-arrow {
  font-size: 10px;
  margin-left: 4px;
  opacity: 0.4;
}
.pm-table th.sorted .pm-sort-arrow {
  opacity: 1;
}
.pm-table tbody tr:hover td {
  background: var(--pm-hover-bg);
}
.pm-table .pm-col-check {
  width: 30px;
  text-align: center;
}
.pm-table .pm-col-actions {
  width: 90px;
  text-align: center;
}
.pm-table .pm-row-done td {
  opacity: 0.6;
  text-decoration: line-through;
}

/* ===== Badges ===== */
.pm-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
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
.pm-priority {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
}
.pm-priority.high {
  background: var(--pm-priority-high);
  color: var(--pm-white);
}
.pm-priority.medium {
  background: var(--pm-priority-medium);
  color: #333;
}
.pm-priority.low {
  background: var(--pm-priority-low);
  color: var(--pm-white);
}
.pm-tag {
  display: inline-block;
  padding: 1px 6px;
  margin: 1px;
  border-radius: 8px;
  font-size: 11px;
  background: var(--pm-accent-light);
  color: var(--pm-accent);
  border: 1px solid var(--pm-border-strong);
}

/* ===== Progress Bar ===== */
.pm-progress-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pm-progress-bar {
  flex: 1;
  height: 8px;
  background: var(--pm-status-todo-bg);
  border-radius: 4px;
  overflow: hidden;
  min-width: 50px;
}
.pm-progress-fill {
  height: 100%;
  background: var(--pm-accent);
  border-radius: 4px;
  transition: width 0.3s;
}
.pm-progress-text {
  font-size: 11px;
  min-width: 32px;
  text-align: right;
}

/* ===== Modal (SPEC §5.2) ===== */
.pm-modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--pm-modal-overlay);
  z-index: 1000;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
  overflow-y: auto;
}
.pm-modal-overlay.show {
  display: flex;
}
.pm-modal {
  background: var(--pm-white);
  border-radius: 6px;
  width: 95%;
  max-width: 700px;
  padding: 20px;
  box-shadow: var(--pm-shadow);
  color: var(--pm-text);
}
.pm-modal h2 {
  margin: 0 0 16px;
  font-size: 1.3em;
  border-left: 4px solid var(--pm-accent);
  padding-left: 8px;
}
.pm-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--pm-panel-border);
}

/* ===== Form ===== */
.pm-form-group {
  margin-bottom: 12px;
}
.pm-form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 13px;
  color: var(--pm-accent);
}
.pm-form-group input[type="text"],
.pm-form-group input[type="date"],
.pm-form-group input[type="number"],
.pm-form-group input[type="range"],
.pm-form-group textarea,
.pm-form-group select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--pm-border-strong);
  border-radius: 3px;
  font-size: 14px;
  font-family: inherit;
  background: var(--pm-white);
  color: var(--pm-text);
}
.pm-form-group textarea {
  min-height: 60px;
  resize: vertical;
}
.pm-form-group input[type="range"] {
  padding: 0;
}
.pm-form-row {
  display: flex;
  gap: 12px;
}
.pm-form-row .pm-form-group {
  flex: 1;
}
.pm-form-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pm-form-inline input[type="range"] {
  flex: 1;
}
.pm-form-inline .pm-progress-label {
  font-size: 13px;
  min-width: 40px;
  text-align: right;
  color: var(--pm-accent);
  font-weight: bold;
}

/* ===== Subtask Editor (SPEC §4.2 #11) ===== */
.pm-subtask-list {
  list-style: none;
  padding: 0;
  margin: 4px 0;
}
.pm-subtask-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  font-size: 13px;
}
.pm-subtask-item input[type="checkbox"] {
  margin: 0;
}
.pm-subtask-item input[type="text"] {
  flex: 1;
  padding: 3px 6px;
  border: 1px solid var(--pm-border-strong);
  border-radius: 3px;
  font-size: 13px;
  background: var(--pm-white);
  color: var(--pm-text);
}
.pm-subtask-item .pm-subtask-del {
  cursor: pointer;
  color: var(--pm-priority-high);
  font-size: 16px;
  padding: 0 4px;
}

/* ===== Activity Log (SPEC §4.2 #14) ===== */
.pm-activity-list {
  list-style: none;
  padding: 0;
  margin: 4px 0;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid var(--pm-panel-border);
  border-radius: 3px;
  background: var(--pm-panel-bg);
}
.pm-activity-item {
  padding: 4px 8px;
  font-size: 12px;
  border-bottom: 1px solid var(--pm-panel-border);
  color: var(--pm-text-muted);
}
.pm-activity-item:last-child {
  border-bottom: none;
}
.pm-activity-item .pm-activity-time {
  color: var(--pm-accent);
  font-weight: bold;
}

/* ===== Gantt Chart (SPEC §4.1 #3, §8.2) ===== */
.pm-gantt-wrap {
  overflow-x: auto;
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
  background: var(--pm-white);
}
.pm-gantt {
  min-width: 100%;
  position: relative;
}
.pm-gantt-header {
  display: grid;
  border-bottom: 2px solid var(--pm-panel-border);
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--pm-panel-bg);
}
.pm-gantt-week {
  padding: 6px 4px;
  text-align: center;
  font-size: 12px;
  color: var(--pm-accent);
  border-right: 1px solid var(--pm-panel-border);
}
.pm-gantt-week:last-child {
  border-right: none;
}
.pm-gantt-row {
  display: grid;
  position: relative;
  border-bottom: 1px solid var(--pm-grid-line);
  min-height: 32px;
}
.pm-gantt-cell {
  border-right: 1px solid var(--pm-grid-line);
}
.pm-gantt-cell.weekend {
  background: var(--pm-weekend-bg);
}
.pm-gantt-task-label {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--pm-text);
  z-index: 1;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
}
.pm-gantt-bar {
  position: absolute;
  top: 6px;
  height: 20px;
  border-radius: 3px;
  background: var(--pm-accent);
  color: var(--pm-white);
  font-size: 11px;
  padding: 2px 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  z-index: 2;
}
.pm-gantt-bar.priority-high { background: var(--pm-priority-high); }
.pm-gantt-bar.priority-medium { background: var(--pm-priority-medium); color: #333; }
.pm-gantt-bar.priority-low { background: var(--pm-priority-low); }
.pm-gantt-bar.status-done { opacity: 0.6; }
.pm-gantt-today {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--pm-today-line);
  z-index: 3;
  pointer-events: none;
}
.pm-gantt-milestone {
  position: absolute;
  top: 6px;
  width: 16px;
  height: 16px;
  background: var(--pm-accent);
  transform: rotate(45deg);
  z-index: 2;
  cursor: pointer;
}
.pm-gantt-dep-arrow {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

/* ===== Kanban (SPEC §4.1 #4) ===== */
.pm-kanban {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.pm-kanban-column {
  flex: 1;
  min-width: 250px;
  background: var(--pm-panel-bg);
  border: 1px solid var(--pm-panel-border);
  border-radius: 4px;
  padding: 8px;
}
.pm-kanban-column-header {
  font-weight: bold;
  font-size: 14px;
  color: var(--pm-accent);
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--pm-accent);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pm-kanban-column-count {
  font-size: 12px;
  color: var(--pm-text-muted);
  font-weight: normal;
}
.pm-kanban-cards {
  min-height: 50px;
}
.pm-kanban-card {
  background: var(--pm-white);
  border: 1px solid var(--pm-panel-border);
  border-left: 4px solid var(--pm-accent);
  border-radius: 3px;
  padding: 8px;
  margin-bottom: 8px;
  cursor: grab;
  font-size: 13px;
}
.pm-kanban-card:active {
  cursor: grabbing;
}
.pm-kanban-card.dragging {
  opacity: 0.5;
}
.pm-kanban-card.priority-high { border-left-color: var(--pm-priority-high); }
.pm-kanban-card.priority-medium { border-left-color: var(--pm-priority-medium); }
.pm-kanban-card.priority-low { border-left-color: var(--pm-priority-low); }
.pm-kanban-card-title {
  font-weight: bold;
  margin-bottom: 4px;
  word-break: break-word;
}
.pm-kanban-card-meta {
  font-size: 11px;
  color: var(--pm-text-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.pm-kanban-drop-zone {
  border: 2px dashed transparent;
  transition: border 0.15s;
}
.pm-kanban-drop-zone.drag-over {
  border: 2px dashed var(--pm-accent);
  background: var(--pm-accent-light);
}

/* ===== Calendar (SPEC §4.1 #5) ===== */
.pm-calendar {
  width: 100%;
  border-collapse: collapse;
}
.pm-calendar th, .pm-calendar td {
  border: 1px solid var(--pm-panel-border);
  width: 14.28%;
  height: 80px;
  vertical-align: top;
  padding: 4px;
}
.pm-calendar th {
  background: var(--pm-panel-bg);
  color: var(--pm-accent);
  font-size: 13px;
  text-align: center;
  height: auto;
  padding: 8px;
}
.pm-calendar-day {
  font-size: 12px;
  color: var(--pm-text);
  font-weight: bold;
  margin-bottom: 4px;
}
.pm-calendar-day.other-month {
  color: var(--pm-text-muted);
  opacity: 0.5;
}
.pm-calendar-day.today {
  display: inline-block;
  background: var(--pm-accent);
  color: var(--pm-white);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
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
  background: var(--pm-accent);
  cursor: pointer;
}
.pm-calendar-dot.priority-high { background: var(--pm-priority-high); }
.pm-calendar-dot.priority-medium { background: var(--pm-priority-medium); }
.pm-calendar-dot.priority-low { background: var(--pm-priority-low); }
.pm-calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.pm-calendar-title {
  font-size: 1.1em;
  font-weight: bold;
  color: var(--pm-accent);
}

/* ===== Snapshots (SPEC §4.2 #15) ===== */
.pm-snapshot-list {
  list-style: none;
  padding: 0;
  margin: 4px 0;
  max-height: 120px;
  overflow-y: auto;
}
.pm-snapshot-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--pm-panel-border);
}
.pm-snapshot-item:last-child {
  border-bottom: none;
}
.pm-snapshot-item .pm-snapshot-name {
  flex: 1;
}

/* ===== Empty State ===== */
.pm-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--pm-text-muted);
  font-size: 14px;
}

/* ===== Utility ===== */
.pm-hidden {
  display: none !important;
}
.pm-clearfix::after {
  content: "";
  display: table;
  clear: both;
}
</style>

<div class="pm-wrap" id="pmApp">
  <h1>プロジェクト管理 <small style="font-size:0.6em;color:var(--pm-text-muted)">(GLM 5.2)</small></h1>

  <!-- Controls Bar (SPEC §5.1) -->
  <div class="pm-controls">
    <button class="pm-btn" id="btnNew" title="新規タスク (Ctrl+N)">＋ 新規</button>
    <span class="pm-ctrl-sep">|</span>
    <div class="pm-tab-group" style="border-bottom:none;margin-bottom:0">
      <button class="pm-tab active" data-view="list">リスト</button>
      <button class="pm-tab" data-view="gantt">ガント</button>
      <button class="pm-tab" data-view="kanban">看板</button>
      <button class="pm-tab" data-view="calendar">カレンダー</button>
    </div>
    <span class="pm-ctrl-sep">|</span>
    <input type="text" class="pm-search" id="searchBox" placeholder="検索... (/ でフォーカス)">
    <select id="filterStatus" title="ステータス">
      <option value="">ステータス: 全て</option>
      <option value="todo">ToDo</option>
      <option value="doing">Doing</option>
      <option value="done">Done</option>
    </select>
    <select id="filterPriority" title="優先度">
      <option value="">優先度: 全て</option>
      <option value="high">高</option>
      <option value="medium">中</option>
      <option value="low">低</option>
    </select>
    <select id="filterAssignee" title="担当者">
      <option value="">担当者: 全て</option>
    </select>
    <select id="filterMilestone" title="マイルストーン">
      <option value="">マイルストーン: 全て</option>
    </select>
    <span class="pm-ctrl-sep">|</span>
    <button class="pm-btn secondary small" id="btnExportJson">JSON出力</button>
    <button class="pm-btn secondary small" id="btnExportCsv">CSV出力</button>
    <button class="pm-btn secondary small" id="btnImport">読込</button>
    <input type="file" id="importFile" class="pm-hidden" accept=".json,.csv">
    <button class="pm-btn secondary small" id="btnSettings">⚙️設定</button>
    <button class="pm-btn secondary small" id="btnTheme" title="テーマ切替">🌓</button>
  </div>

  <!-- Bulk Action Bar (SPEC §4.2 #13) -->
  <div class="pm-bulk-bar" id="bulkBar">
    <span class="pm-bulk-count" id="bulkCount">0件選択</span>
    <button class="pm-btn danger small" id="btnBulkDelete">一括削除</button>
    <select id="bulkStatus" class="pm-controls select">
      <option value="">ステータス変更...</option>
      <option value="todo">ToDo</option>
      <option value="doing">Doing</option>
      <option value="done">Done</option>
    </select>
    <button class="pm-btn small" id="btnBulkStatus">適用</button>
    <button class="pm-btn small" id="btnBulkGithub">一括GitHub Issue化</button>
  </div>

  <!-- Settings Panel (collapsible, SPEC §4.2 #10, #15) -->
  <div class="pm-settings-panel" id="settingsPanel">
    <h3>⚙️ 設定</h3>
    <div class="pm-settings-row">
      <label>GitHub PAT: <input type="password" id="ghToken" placeholder="ghp_xxx"></label>
      <label>リポジトリ: <input type="text" id="ghRepo" placeholder="owner/repo"></label>
      <button class="pm-btn small" id="btnSaveGithub">保存</button>
      <button class="pm-btn secondary small" id="btnTestGithub">接続テスト</button>
    </div>
    <div class="pm-security-note">⚠️ トークンはlocalStorageに保存されます。公開環境での使用に注意してください。</div>
    <hr style="margin:12px 0;border:none;border-top:1px solid var(--pm-panel-border)">
    <h3>📸 スナップショット</h3>
    <div class="pm-settings-row">
      <input type="text" id="snapshotName" placeholder="スナップショット名">
      <button class="pm-btn small" id="btnSaveSnapshot">保存</button>
    </div>
    <ul class="pm-snapshot-list" id="snapshotList"></ul>
    <hr style="margin:12px 0;border:none;border-top:1px solid var(--pm-panel-border)">
    <h3>📋 アクティビティログ</h3>
    <ul class="pm-activity-list" id="activityLog"></ul>
  </div>

  <!-- View Container (SPEC §5.1) -->
  <div class="pm-view-container">
    <div class="pm-view active" id="view-list">
      <div class="pm-table-wrap">
        <table class="pm-table" id="taskTable">
          <thead>
            <tr>
              <th class="pm-col-check"><input type="checkbox" id="checkAll"></th>
              <th data-sort="title">タイトル <span class="pm-sort-arrow"></span></th>
              <th data-sort="status">ステータス <span class="pm-sort-arrow"></span></th>
              <th data-sort="priority">優先度 <span class="pm-sort-arrow"></span></th>
              <th data-sort="assignee">担当者 <span class="pm-sort-arrow"></span></th>
              <th data-sort="startDate">開始日 <span class="pm-sort-arrow"></span></th>
              <th data-sort="dueDate">締切日 <span class="pm-sort-arrow"></span></th>
              <th data-sort="progress">進捗 <span class="pm-sort-arrow"></span></th>
              <th class="pm-col-actions">操作</th>
            </tr>
          </thead>
          <tbody id="taskTableBody"></tbody>
        </table>
      </div>
      <div class="pm-empty pm-hidden" id="listEmpty">タスクがありません。「＋ 新規」で追加してください。</div>
    </div>
    <div class="pm-view" id="view-gantt">
      <div class="pm-gantt-wrap" id="ganttWrap"></div>
    </div>
    <div class="pm-view" id="view-kanban">
      <div class="pm-kanban" id="kanbanBoard"></div>
    </div>
    <div class="pm-view" id="view-calendar">
      <div class="pm-calendar-nav">
        <button class="pm-btn secondary small" id="calPrev">◀ 前月</button>
        <span class="pm-calendar-title" id="calTitle"></span>
        <button class="pm-btn secondary small" id="calNext">翌月 ▶</button>
      </div>
      <table class="pm-calendar" id="calendarTable"></table>
    </div>
  </div>
</div>

<!-- Task Modal (SPEC §5.2) -->
<div class="pm-modal-overlay" id="taskModal">
  <div class="pm-modal">
    <h2 id="modalTitle">新規タスク</h2>
    <form id="taskForm">
      <input type="hidden" id="f_id">
      <div class="pm-form-group">
        <label>タイトル <span style="color:var(--pm-priority-high)">*</span></label>
        <input type="text" id="f_title" required>
      </div>
      <div class="pm-form-group">
        <label>詳細</label>
        <textarea id="f_description"></textarea>
      </div>
      <div class="pm-form-row">
        <div class="pm-form-group">
          <label>ステータス</label>
          <select id="f_status">
            <option value="todo">ToDo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="pm-form-group">
          <label>優先度</label>
          <select id="f_priority">
            <option value="high">高</option>
            <option value="medium" selected>中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>
      <div class="pm-form-row">
        <div class="pm-form-group">
          <label>担当者</label>
          <input type="text" id="f_assignee">
        </div>
        <div class="pm-form-group">
          <label>マイルストーン</label>
          <input type="text" id="f_milestone">
        </div>
      </div>
      <div class="pm-form-row">
        <div class="pm-form-group">
          <label>開始日</label>
          <input type="date" id="f_startDate">
        </div>
        <div class="pm-form-group">
          <label>締切日</label>
          <input type="date" id="f_dueDate">
        </div>
      </div>
      <div class="pm-form-row">
        <div class="pm-form-group">
          <label>予定工数 (h)</label>
          <input type="number" id="f_estimatedHours" step="0.5" min="0" value="0">
        </div>
        <div class="pm-form-group">
          <label>実績工数 (h)</label>
          <input type="number" id="f_actualHours" step="0.5" min="0" value="0">
        </div>
      </div>
      <div class="pm-form-group">
        <label>進捗率</label>
        <div class="pm-form-inline">
          <input type="range" id="f_progress" min="0" max="100" step="1" value="0">
          <span class="pm-progress-label" id="f_progressLabel">0%</span>
        </div>
      </div>
      <div class="pm-form-group">
        <label>タグ (カンマ区切り)</label>
        <input type="text" id="f_tags" placeholder="tag1, tag2, tag3">
      </div>
      <div class="pm-form-group">
        <label>サブタスク</label>
        <ul class="pm-subtask-list" id="f_subtaskList"></ul>
        <button type="button" class="pm-btn secondary small" id="btnAddSubtask">＋ サブタスク追加</button>
      </div>
      <div class="pm-form-group">
        <label>依存タスク (先行タスク)</label>
        <select id="f_predecessors" multiple size="4" style="width:100%"></select>
      </div>
      <div class="pm-form-group pm-hidden" id="githubLinkGroup">
        <label>GitHub Issue リンク</label>
        <input type="text" id="f_githubIssueUrl" readonly>
      </div>
      <div class="pm-form-group pm-hidden" id="activityGroup">
        <label>アクティビティ履歴</label>
        <ul class="pm-activity-list" id="modalActivityList"></ul>
      </div>
      <div class="pm-modal-actions">
        <button type="button" class="pm-btn small" id="btnGithubIssue" style="margin-right:auto">GitHub Issue作成</button>
        <button type="button" class="pm-btn danger small" id="btnDelete">削除</button>
        <button type="button" class="pm-btn secondary small" id="btnCancel">キャンセル</button>
        <button type="submit" class="pm-btn small">保存</button>
      </div>
    </form>
  </div>
</div>

<script>
(function () {
  'use strict';

  // ============================================
  // Constants & State (SPEC §3)
  // ============================================
  var STORAGE_KEYS = {
    tasks: 'rui-pm-tasks',
    settings: 'rui-pm-settings',
    github: 'rui-pm-github',
    snapshots: 'rui-pm-snapshots',
    activity: 'rui-pm-activity'
  };

  var PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
  var STATUS_ORDER = { todo: 0, doing: 1, done: 2 };
  var STATUS_LABELS = { todo: 'ToDo', doing: 'Doing', done: 'Done' };
  var PRIORITY_LABELS = { high: '高', medium: '中', low: '低' };

  var state = {
    tasks: [],
    currentView: 'list',
    sortColumn: 'dueDate',
    sortDir: 'asc',
    filters: { search: '', status: '', priority: '', assignee: '', milestone: '' },
    selectedIds: new Set(),
    calendarMonth: new Date(),
    editingId: null
  };

  // ============================================
  // Utility Functions (SPEC §8.4)
  // ============================================
  function $(id) { return document.getElementById(id); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(d) {
    if (!d) return '';
    var dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt.getTime())) return '';
    var y = dt.getFullYear();
    var m = ('0' + (dt.getMonth() + 1)).slice(-2);
    var day = ('0' + dt.getDate()).slice(-2);
    return y + '-' + m + '-' + day;
  }

  function parseDate(str) {
    if (!str) return null;
    var parts = str.split('-');
    if (parts.length !== 3) return new Date(str);
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  function diffDays(d1, d2) {
    var a = parseDate(d1);
    var b = parseDate(d2);
    if (!a || !b) return 0;
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  function getMonday(d) {
    var dt = (d instanceof Date) ? new Date(d) : parseDate(d);
    if (!dt) return new Date();
    var day = dt.getDay();
    var diff = dt.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(dt.getFullYear(), dt.getMonth(), diff);
  }

  function addDays(d, n) {
    var dt = (d instanceof Date) ? new Date(d) : parseDate(d);
    if (!dt) return new Date();
    dt.setDate(dt.getDate() + n);
    return dt;
  }

  function todayStr() {
    return formatDate(new Date());
  }

  function nowISO() {
    return new Date().toISOString();
  }

  // ============================================
  // Storage Layer (SPEC §3.2)
  // ============================================
  var Storage = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage save failed:', e);
      }
    },
    getTasks: function () { return this.get(STORAGE_KEYS.tasks, []); },
    setTasks: function (t) { this.set(STORAGE_KEYS.tasks, t); },
    getSettings: function () { return this.get(STORAGE_KEYS.settings, {}); },
    setSettings: function (s) { this.set(STORAGE_KEYS.settings, s); },
    getGithub: function () { return this.get(STORAGE_KEYS.github, { token: '', repo: '' }); },
    setGithub: function (g) { this.set(STORAGE_KEYS.github, g); },
    getSnapshots: function () { return this.get(STORAGE_KEYS.snapshots, []); },
    setSnapshots: function (s) { this.set(STORAGE_KEYS.snapshots, s); },
    getActivity: function () { return this.get(STORAGE_KEYS.activity, []); },
    setActivity: function (a) { this.set(STORAGE_KEYS.activity, a); }
  };

  // ============================================
  // Activity Log (SPEC §4.2 #14)
  // ============================================
  function logActivity(taskId, action, detail) {
    var log = Storage.getActivity();
    log.unshift({
      id: uuid(),
      taskId: taskId,
      action: action,
      detail: detail || '',
      time: nowISO()
    });
    if (log.length > 200) log = log.slice(0, 200);
    Storage.setActivity(log);
  }

  function getActivityForTask(taskId) {
    return Storage.getActivity().filter(function (a) { return a.taskId === taskId; });
  }

  // ============================================
  // Task Factory (SPEC §3.1)
  // ============================================
  function createTask(data) {
    data = data || {};
    var now = nowISO();
    return {
      id: data.id || uuid(),
      title: data.title || '',
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      assignee: data.assignee || '',
      startDate: data.startDate || '',
      dueDate: data.dueDate || '',
      progress: data.progress != null ? data.progress : 0,
      tags: data.tags || [],
      estimatedHours: data.estimatedHours != null ? data.estimatedHours : 0,
      actualHours: data.actualHours != null ? data.actualHours : 0,
      milestone: data.milestone || '',
      subtasks: data.subtasks || [],
      predecessors: data.predecessors || [],
      githubIssueUrl: data.githubIssueUrl || '',
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
  }

  function findTask(id) {
    for (var i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === id) return state.tasks[i];
    }
    return null;
  }

  function saveTasks() {
    Storage.setTasks(state.tasks);
  }

  // ============================================
  // Filtering (SPEC §4.1 #6)
  // ============================================
  function getFilteredTasks() {
    var f = state.filters;
    return state.tasks.filter(function (t) {
      if (f.status && t.status !== f.status) return false;
      if (f.priority && t.priority !== f.priority) return false;
      if (f.assignee && t.assignee !== f.assignee) return false;
      if (f.milestone && t.milestone !== f.milestone) return false;
      if (f.search) {
        var q = f.search.toLowerCase();
        var hay = (t.title + ' ' + t.description + ' ' + t.assignee + ' ' + t.milestone + ' ' + t.tags.join(' ')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function getSortedTasks(tasks) {
    var col = state.sortColumn;
    var dir = state.sortDir === 'asc' ? 1 : -1;
    return tasks.slice().sort(function (a, b) {
      var va, vb;
      if (col === 'priority') {
        va = PRIORITY_ORDER[a.priority]; vb = PRIORITY_ORDER[b.priority];
      } else if (col === 'status') {
        va = STATUS_ORDER[a.status]; vb = STATUS_ORDER[b.status];
      } else if (col === 'progress') {
        va = a.progress; vb = b.progress;
      } else {
        va = a[col] || ''; vb = b[col] || '';
      }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }

  // ============================================
  // View Switching
  // ============================================
  function switchView(view) {
    state.currentView = view;
    $$('.pm-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-view') === view);
    });
    $$('.pm-view').forEach(function (v) { v.classList.remove('active'); });
    $('view-' + view).classList.add('active');
    var settings = Storage.getSettings();
    settings.currentView = view;
    Storage.setSettings(settings);
    renderCurrentView();
  }

  function renderCurrentView() {
    if (state.currentView === 'list') renderList();
    else if (state.currentView === 'gantt') renderGantt();
    else if (state.currentView === 'kanban') renderKanban();
    else if (state.currentView === 'calendar') renderCalendar();
  }

  // ============================================
  // List View (SPEC §4.1 #2)
  // ============================================
  function renderList() {
    var tasks = getSortedTasks(getFilteredTasks());
    var tbody = $('taskTableBody');
    if (tasks.length === 0) {
      tbody.innerHTML = '';
      $('listEmpty').classList.remove('pm-hidden');
    } else {
      $('listEmpty').classList.add('pm-hidden');
      tbody.innerHTML = tasks.map(function (t) {
        var checked = state.selectedIds.has(t.id) ? 'checked' : '';
        var rowClass = t.status === 'done' ? 'pm-row-done' : '';
        return '<tr class="' + rowClass + '" data-id="' + t.id + '">' +
          '<td class="pm-col-check"><input type="checkbox" class="row-check" data-id="' + t.id + '" ' + checked + '></td>' +
          '<td onclick="pm.editTask(\'' + t.id + '\')" style="cursor:pointer">' + escapeHtml(t.title) + '</td>' +
          '<td><span class="pm-status ' + t.status + '">' + STATUS_LABELS[t.status] + '</span></td>' +
          '<td><span class="pm-priority ' + t.priority + '">' + PRIORITY_LABELS[t.priority] + '</span></td>' +
          '<td>' + escapeHtml(t.assignee) + '</td>' +
          '<td>' + escapeHtml(t.startDate) + '</td>' +
          '<td>' + escapeHtml(t.dueDate) + '</td>' +
          '<td><div class="pm-progress-wrap"><div class="pm-progress-bar"><div class="pm-progress-fill" style="width:' + t.progress + '%"></div></div><span class="pm-progress-text">' + t.progress + '%</span></div></td>' +
          '<td class="pm-col-actions"><button class="pm-btn secondary small" onclick="pm.editTask(\'' + t.id + '\')">編集</button> <button class="pm-btn danger small" onclick="pm.deleteTask(\'' + t.id + '\')">削除</button></td>' +
          '</tr>';
      }).join('');
    }
    updateSortIndicators();
    updateBulkBar();
  }

  function updateSortIndicators() {
    $$('#taskTable th[data-sort]').forEach(function (th) {
      var col = th.getAttribute('data-sort');
      var arrow = th.querySelector('.pm-sort-arrow');
      if (col === state.sortColumn) {
        th.classList.add('sorted');
        arrow.textContent = state.sortDir === 'asc' ? '▲' : '▼';
      } else {
        th.classList.remove('sorted');
        arrow.textContent = '';
      }
    });
  }

  function updateBulkBar() {
    var count = state.selectedIds.size;
    $('bulkBar').classList.toggle('show', count > 0);
    $('bulkCount').textContent = count + '件選択';
    $('checkAll').checked = count > 0 && count === state.tasks.length;
  }

  // ============================================
  // Gantt Chart (SPEC §4.1 #3, §8.2)
  // ============================================
  function renderGantt() {
    var tasks = getFilteredTasks();
    var wrap = $('ganttWrap');
    if (tasks.length === 0) {
      wrap.innerHTML = '<div class="pm-empty">タスクがありません。</div>';
      return;
    }

    // Determine date range: min start date to max due date, min 4 weeks
    var minDate = null, maxDate = null;
    tasks.forEach(function (t) {
      if (t.startDate) {
        var s = parseDate(t.startDate);
        if (!minDate || s < minDate) minDate = s;
      }
      if (t.dueDate) {
        var e = parseDate(t.dueDate);
        if (!maxDate || e > maxDate) maxDate = e;
      }
    });
    if (!minDate) minDate = getMonday(new Date());
    if (!maxDate) maxDate = addDays(minDate, 28);
    minDate = getMonday(minDate);
    maxDate = getMonday(maxDate);
    // Ensure at least 4 weeks
    if (diffDays(formatDate(minDate), formatDate(maxDate)) < 21) {
      maxDate = addDays(minDate, 28);
    } else {
      maxDate = addDays(maxDate, 7);
    }

    var totalDays = diffDays(formatDate(minDate), formatDate(maxDate)) + 1;
    var weekCount = Math.ceil(totalDays / 7);
    var dayWidth = 24;
    var weekWidth = dayWidth * 7;

    // Build header
    var headerHtml = '';
    for (var w = 0; w < weekCount; w++) {
      var wkStart = addDays(minDate, w * 7);
      var wkEnd = addDays(wkStart, 6);
      headerHtml += '<div class="pm-gantt-week" style="min-width:' + weekWidth + 'px">' +
        (wkStart.getMonth() + 1) + '/' + wkStart.getDate() + '〜' +
        (wkEnd.getMonth() + 1) + '/' + wkEnd.getDate() + '</div>';
    }

    // Build rows
    var rowsHtml = '';
    var today = todayStr();
    var todayOffset = diffDays(formatDate(minDate), today);

    tasks.forEach(function (t) {
      var cellsHtml = '';
      for (var d = 0; d < weekCount * 7; d++) {
        var dt = addDays(minDate, d);
        var isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
        cellsHtml += '<div class="pm-gantt-cell' + (isWeekend ? ' weekend' : '') + '" style="min-width:' + dayWidth + 'px"></div>';
      }

      var barHtml = '';
      var labelHtml = '<div class="pm-gantt-task-label">' + escapeHtml(t.title) + '</div>';

      if (t.startDate && t.dueDate) {
        var startOff = diffDays(formatDate(minDate), t.startDate);
        var endOff = diffDays(formatDate(minDate), t.dueDate);
        if (startOff < 0) startOff = 0;
        if (endOff > weekCount * 7 - 1) endOff = weekCount * 7 - 1;
        var barLeft = startOff * dayWidth + 4;
        var barWidth = Math.max((endOff - startOff + 1) * dayWidth - 8, 30);
        barHtml = '<div class="pm-gantt-bar priority-' + t.priority + (t.status === 'done' ? ' status-done' : '') +
          '" style="left:' + barLeft + 'px;width:' + barWidth + 'px" onclick="pm.editTask(\'' + t.id + '\')" title="' + escapeHtml(t.title) + '">' +
          escapeHtml(t.title) + '</div>';
      }

      // Milestone diamond (SPEC §4.1 #3)
      if (t.milestone && t.dueDate) {
        var msOff = diffDays(formatDate(minDate), t.dueDate);
        if (msOff >= 0 && msOff < weekCount * 7) {
          var msLeft = msOff * dayWidth + dayWidth / 2 - 8;
          barHtml += '<div class="pm-gantt-milestone" style="left:' + msLeft + 'px" onclick="pm.editTask(\'' + t.id + '\')" title="マイルストーン: ' + escapeHtml(t.milestone) + '"></div>';
        }
      }

      // Dependency arrows (SPEC §4.2 #12)
      t.predecessors.forEach(function (pid) {
        var pred = findTask(pid);
        if (pred && pred.dueDate && t.startDate) {
          var predEnd = diffDays(formatDate(minDate), pred.dueDate);
          var taskStart = diffDays(formatDate(minDate), t.startDate);
          if (predEnd >= 0 && taskStart >= 0 && predEnd < taskStart) {
            var arrowLeft = predEnd * dayWidth + dayWidth / 2;
            var arrowWidth = (taskStart - predEnd) * dayWidth;
            barHtml += '<div class="pm-gantt-dep-arrow" style="left:' + arrowLeft + 'px;width:' + arrowWidth + 'px;height:100%;border-top:1px dashed var(--pm-text-muted);top:50%"></div>';
          }
        }
      });

      rowsHtml += '<div class="pm-gantt-row" style="min-width:' + (weekWidth * weekCount) + 'px">' +
        cellsHtml + labelHtml + barHtml + '</div>';
    });

    // Today line
    var todayLineHtml = '';
    if (todayOffset >= 0 && todayOffset < weekCount * 7) {
      todayLineHtml = '<div class="pm-gantt-today" style="left:' + (todayOffset * dayWidth + dayWidth / 2) + 'px"></div>';
    }

    wrap.innerHTML = '<div class="pm-gantt" style="width:' + (weekWidth * weekCount + 20) + 'px">' +
      '<div class="pm-gantt-header" style="grid-template-columns:repeat(' + weekCount + ',' + weekWidth + 'px)">' + headerHtml + '</div>' +
      '<div style="position:relative">' + rowsHtml + todayLineHtml + '</div>' +
      '</div>';
  }

  // ============================================
  // Kanban View (SPEC §4.1 #4)
  // ============================================
  function renderKanban() {
    var tasks = getFilteredTasks();
    var columns = ['todo', 'doing', 'done'];
    var board = $('kanbanBoard');
    board.innerHTML = columns.map(function (col) {
      var colTasks = tasks.filter(function (t) { return t.status === col; });
      var cards = colTasks.map(function (t) {
        return '<div class="pm-kanban-card priority-' + t.priority + '" draggable="true" data-id="' + t.id + '">' +
          '<div class="pm-kanban-card-title">' + escapeHtml(t.title) + '</div>' +
          '<div class="pm-kanban-card-meta">' +
          (t.assignee ? '<span>👤 ' + escapeHtml(t.assignee) + '</span>' : '') +
          (t.dueDate ? '<span>📅 ' + escapeHtml(t.dueDate) + '</span>' : '') +
          '<span class="pm-priority ' + t.priority + '">' + PRIORITY_LABELS[t.priority] + '</span>' +
          '</div>' +
          (t.progress > 0 ? '<div class="pm-progress-wrap" style="margin-top:4px"><div class="pm-progress-bar"><div class="pm-progress-fill" style="width:' + t.progress + '%"></div></div><span class="pm-progress-text">' + t.progress + '%</span></div>' : '') +
          '</div>';
      }).join('');
      return '<div class="pm-kanban-column">' +
        '<div class="pm-kanban-column-header">' + STATUS_LABELS[col] +
        '<span class="pm-kanban-column-count">' + colTasks.length + '件</span></div>' +
        '<div class="pm-kanban-cards pm-kanban-drop-zone" data-status="' + col + '">' + cards + '</div>' +
        '</div>';
    }).join('');
    setupKanbanDnD();
  }

  function setupKanbanDnD() {
    var cards = $$('.pm-kanban-card');
    var zones = $$('.pm-kanban-drop-zone');

    cards.forEach(function (card) {
      card.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', function () {
        card.classList.remove('dragging');
      });
      card.addEventListener('click', function () {
        pm.editTask(card.getAttribute('data-id'));
      });
    });

    zones.forEach(function (zone) {
      zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', function () {
        zone.classList.remove('drag-over');
      });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('drag-over');
        var id = e.dataTransfer.getData('text/plain');
        var newStatus = zone.getAttribute('data-status');
        var task = findTask(id);
        if (task && task.status !== newStatus) {
          var oldStatus = task.status;
          task.status = newStatus;
          if (newStatus === 'done') task.progress = 100;
          task.updatedAt = nowISO();
          saveTasks();
          logActivity(id, 'ステータス変更', STATUS_LABELS[oldStatus] + ' → ' + STATUS_LABELS[newStatus]);
          renderKanban();
        }
      });
    });
  }

  // ============================================
  // Calendar View (SPEC §4.1 #5)
  // ============================================
  function renderCalendar() {
    var tasks = getFilteredTasks();
    var month = state.calendarMonth;
    var year = month.getFullYear();
    var mon = month.getMonth();
    $('calTitle').textContent = year + '年 ' + (mon + 1) + '月';

    var firstDay = new Date(year, mon, 1);
    var lastDay = new Date(year, mon + 1, 0);
    var startWeekday = firstDay.getDay();
    var daysInMonth = lastDay.getDate();
    var prevLastDay = new Date(year, mon, 0).getDate();

    var weeks = [];
    var currentWeek = [];
    // Leading days from prev month
    for (var i = startWeekday - 1; i >= 0; i--) {
      currentWeek.push({ day: prevLastDay - i, otherMonth: true, date: new Date(year, mon - 1, prevLastDay - i) });
    }
    for (var d = 1; d <= daysInMonth; d++) {
      currentWeek.push({ day: d, otherMonth: false, date: new Date(year, mon, d) });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    // Trailing days
    var nextDay = 1;
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: nextDay, otherMonth: true, date: new Date(year, mon + 1, nextDay) });
      nextDay++;
    }
    if (currentWeek.length === 7) weeks.push(currentWeek);

    var today = todayStr();
    var dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
    var html = '<thead><tr>' + dayLabels.map(function (l) { return '<th>' + l + '</th>'; }).join('') + '</tr></thead><tbody>';
    weeks.forEach(function (week) {
      html += '<tr>';
      week.forEach(function (d) {
        var dateStr = formatDate(d.date);
        var isToday = dateStr === today;
        var dayClass = 'pm-calendar-day' + (d.otherMonth ? ' other-month' : '') + (isToday ? ' today' : '');
        // Find tasks spanning this day
        var dayTasks = tasks.filter(function (t) {
          if (!t.startDate || !t.dueDate) return false;
          return dateStr >= t.startDate && dateStr <= t.dueDate;
        });
        var dots = dayTasks.map(function (t) {
          return '<span class="pm-calendar-dot priority-' + t.priority + '" onclick="pm.editTask(\'' + t.id + '\')" title="' + escapeHtml(t.title) + '"></span>';
        }).join('');
        html += '<td><div class="' + dayClass + '">' + d.day + '</div><div class="pm-calendar-dots">' + dots + '</div></td>';
      });
      html += '</tr>';
    });
    html += '</tbody>';
    $('calendarTable').innerHTML = html;
  }

  // ============================================
  // Filter Dropdowns Update
  // ============================================
  function updateFilterDropdowns() {
    var assignees = {}, milestones = {};
    state.tasks.forEach(function (t) {
      if (t.assignee) assignees[t.assignee] = true;
      if (t.milestone) milestones[t.milestone] = true;
    });
    var curA = state.filters.assignee;
    var curM = state.filters.milestone;
    $('filterAssignee').innerHTML = '<option value="">担当者: 全て</option>' +
      Object.keys(assignees).sort().map(function (a) {
        return '<option value="' + escapeHtml(a) + '"' + (a === curA ? ' selected' : '') + '>' + escapeHtml(a) + '</option>';
      }).join('');
    $('filterMilestone').innerHTML = '<option value="">マイルストーン: 全て</option>' +
      Object.keys(milestones).sort().map(function (m) {
        return '<option value="' + escapeHtml(m) + '"' + (m === curM ? ' selected' : '') + '>' + escapeHtml(m) + '</option>';
      }).join('');
  }

  // ============================================
  // Modal (SPEC §5.2)
  // ============================================
  function openModal(taskId) {
    state.editingId = taskId || null;
    var task = taskId ? findTask(taskId) : null;
    if (taskId && !task) return;

    $('modalTitle').textContent = task ? 'タスク編集' : '新規タスク';
    $('f_id').value = task ? task.id : '';
    $('f_title').value = task ? task.title : '';
    $('f_description').value = task ? task.description : '';
    $('f_status').value = task ? task.status : 'todo';
    $('f_priority').value = task ? task.priority : 'medium';
    $('f_assignee').value = task ? task.assignee : '';
    $('f_milestone').value = task ? task.milestone : '';
    $('f_startDate').value = task ? task.startDate : '';
    $('f_dueDate').value = task ? task.dueDate : '';
    $('f_estimatedHours').value = task ? task.estimatedHours : 0;
    $('f_actualHours').value = task ? task.actualHours : 0;
    $('f_progress').value = task ? task.progress : 0;
    $('f_progressLabel').textContent = (task ? task.progress : 0) + '%';
    $('f_tags').value = task ? task.tags.join(', ') : '';
    $('f_githubIssueUrl').value = task ? task.githubIssueUrl : '';

    renderSubtaskEditor(task ? task.subtasks : []);
    renderPredecessorSelect(task);
    renderModalActivity(task);

    if (task) {
      $('githubLinkGroup').classList.remove('pm-hidden');
      $('activityGroup').classList.remove('pm-hidden');
      $('btnDelete').classList.remove('pm-hidden');
      $('btnGithubIssue').classList.remove('pm-hidden');
    } else {
      $('githubLinkGroup').classList.add('pm-hidden');
      $('activityGroup').classList.add('pm-hidden');
      $('btnDelete').classList.add('pm-hidden');
      $('btnGithubIssue').classList.add('pm-hidden');
    }

    $('taskModal').classList.add('show');
    setTimeout(function () { $('f_title').focus(); }, 50);
  }

  function closeModal() {
    $('taskModal').classList.remove('show');
    state.editingId = null;
  }

  function renderSubtaskEditor(subtasks) {
    var list = $('f_subtaskList');
    subtasks = subtasks || [];
    if (subtasks.length === 0) {
      list.innerHTML = '<li class="pm-subtask-item"><input type="checkbox"><input type="text" placeholder="サブタスクを入力"></li>';
    } else {
      list.innerHTML = subtasks.map(function (st) {
        return '<li class="pm-subtask-item"><input type="checkbox"' + (st.done ? ' checked' : '') + '><input type="text" value="' + escapeHtml(st.text) + '"><span class="pm-subtask-del" onclick="this.parentElement.remove()">×</span></li>';
      }).join('');
    }
  }

  function addSubtaskRow() {
    var list = $('f_subtaskList');
    var li = document.createElement('li');
    li.className = 'pm-subtask-item';
    li.innerHTML = '<input type="checkbox"><input type="text" placeholder="サブタスクを入力"><span class="pm-subtask-del">×</span>';
    li.querySelector('.pm-subtask-del').onclick = function () { li.remove(); };
    list.appendChild(li);
  }

  function renderPredecessorSelect(task) {
    var sel = $('f_predecessors');
    var others = state.tasks.filter(function (t) { return t.id !== (task ? task.id : null); });
    sel.innerHTML = others.map(function (t) {
      var selected = task && task.predecessors.indexOf(t.id) !== -1 ? ' selected' : '';
      return '<option value="' + t.id + '"' + selected + '>' + escapeHtml(t.title) + '</option>';
    }).join('');
  }

  function renderModalActivity(task) {
    var list = $('modalActivityList');
    if (!task) { list.innerHTML = ''; return; }
    var acts = getActivityForTask(task.id);
    if (acts.length === 0) {
      list.innerHTML = '<li class="pm-activity-item">履歴がありません</li>';
      return;
    }
    list.innerHTML = acts.map(function (a) {
      var dt = new Date(a.time);
      return '<li class="pm-activity-item"><span class="pm-activity-time">' + dt.toLocaleString('ja-JP') + '</span> ' + escapeHtml(a.action) + (a.detail ? ' (' + escapeHtml(a.detail) + ')' : '') + '</li>';
    }).join('');
  }

  function collectSubtasks() {
    var items = $$('#f_subtaskList .pm-subtask-item');
    return items.map(function (li) {
      var cb = li.querySelector('input[type="checkbox"]');
      var txt = li.querySelector('input[type="text"]');
      return { text: txt.value.trim(), done: cb.checked };
    }).filter(function (st) { return st.text; });
  }

  function collectPredecessors() {
    var sel = $('f_predecessors');
    return $$('option', sel).filter(function (o) { return o.selected; }).map(function (o) { return o.value; });
  }

  // ============================================
  // CRUD Operations (SPEC §4.1 #1)
  // ============================================
  function saveTaskFromForm() {
    var title = $('f_title').value.trim();
    if (!title) {
      alert('タイトルは必須です');
      return;
    }
    var id = $('f_id').value;
    var isNew = !id;
    var task = isNew ? createTask() : findTask(id);
    if (!isNew && !task) return;

    var oldStatus = task.status;
    task.title = title;
    task.description = $('f_description').value.trim();
    task.status = $('f_status').value;
    task.priority = $('f_priority').value;
    task.assignee = $('f_assignee').value.trim();
    task.milestone = $('f_milestone').value.trim();
    task.startDate = $('f_startDate').value;
    task.dueDate = $('f_dueDate').value;
    task.estimatedHours = parseFloat($('f_estimatedHours').value) || 0;
    task.actualHours = parseFloat($('f_actualHours').value) || 0;
    task.progress = parseInt($('f_progress').value, 10) || 0;
    task.tags = $('f_tags').value.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
    task.subtasks = collectSubtasks();
    task.predecessors = collectPredecessors();

    // Auto-calc progress from subtasks (SPEC §4.2 #11)
    if (task.subtasks.length > 0) {
      var doneCount = task.subtasks.filter(function (st) { return st.done; }).length;
      task.progress = Math.round((doneCount / task.subtasks.length) * 100);
    }

    // Auto-set progress to 100 if status is done
    if (task.status === 'done' && task.progress < 100) {
      task.progress = 100;
    }

    task.updatedAt = nowISO();

    if (isNew) {
      state.tasks.push(task);
      logActivity(task.id, '作成', task.title);
    } else {
      if (oldStatus !== task.status) {
        logActivity(task.id, 'ステータス変更', STATUS_LABELS[oldStatus] + ' → ' + STATUS_LABELS[task.status]);
      }
      logActivity(task.id, '更新', task.title);
    }

    saveTasks();
    updateFilterDropdowns();
    closeModal();
    renderCurrentView();
  }

  function deleteTask(id) {
    var task = findTask(id);
    if (!task) return;
    if (!confirm('「' + task.title + '」を削除しますか？')) return;
    state.tasks = state.tasks.filter(function (t) { return t.id !== id; });
    state.selectedIds.delete(id);
    saveTasks();
    logActivity(id, '削除', task.title);
    updateFilterDropdowns();
    renderCurrentView();
  }

  // ============================================
  // Export/Import (SPEC §4.1 #7, #8, §8.5)
  // ============================================
  function downloadFile(filename, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    var data = JSON.stringify(state.tasks, null, 2);
    downloadFile('tasks-' + todayStr() + '.json', data, 'application/json;charset=utf-8');
  }

  function csvEscape(val) {
    if (val == null) val = '';
    val = String(val);
    if (val.indexOf(',') !== -1 || val.indexOf('\n') !== -1 || val.indexOf('"') !== -1) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }

  function exportCsv() {
    var headers = ['id', 'title', 'description', 'status', 'priority', 'assignee', 'startDate', 'dueDate', 'progress', 'tags', 'estimatedHours', 'actualHours', 'milestone', 'githubIssueUrl', 'createdAt', 'updatedAt'];
    var rows = [headers.join(',')];
    state.tasks.forEach(function (t) {
      var row = [
        t.id, t.title, t.description, t.status, t.priority, t.assignee,
        t.startDate, t.dueDate, t.progress, t.tags.join(';'),
        t.estimatedHours, t.actualHours, t.milestone, t.githubIssueUrl,
        t.createdAt, t.updatedAt
      ];
      rows.push(row.map(csvEscape).join(','));
    });
    // UTF-8 BOM (SPEC §8.5)
    var csv = '\uFEFF' + rows.join('\n');
    downloadFile('tasks-' + todayStr() + '.csv', csv, 'text/csv;charset=utf-8');
  }

  function parseCsv(text) {
    text = text.replace(/^\uFEFF/, '');
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else { field += c; }
      } else {
        if (c === '"') { inQuotes = true; }
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
        else if (c === '\r') { /* skip */ }
        else { field += c; }
      }
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function importFile(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var content = e.target.result;
      var imported = [];
      try {
        if (file.name.endsWith('.json')) {
          imported = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          var rows = parseCsv(content);
          if (rows.length < 2) { alert('CSVデータが不正です'); return; }
          var headers = rows[0];
          for (var r = 1; r < rows.length; r++) {
            var obj = {};
            for (var c = 0; c < headers.length; c++) {
              obj[headers[c]] = rows[r][c];
            }
            if (obj.tags) obj.tags = obj.tags.split(';').filter(function (s) { return s; });
            if (obj.progress) obj.progress = parseInt(obj.progress, 10) || 0;
            if (obj.estimatedHours) obj.estimatedHours = parseFloat(obj.estimatedHours) || 0;
            if (obj.actualHours) obj.actualHours = parseFloat(obj.actualHours) || 0;
            imported.push(obj);
          }
        } else {
          alert('対応形式: .json, .csv');
          return;
        }
      } catch (err) {
        alert('インポートエラー: ' + err.message);
        return;
      }

      if (!Array.isArray(imported)) { alert('データ形式が不正です'); return; }

      var mode = prompt('ID重複時の処理: 上書き=1, スキップ=2', '1');
      var overwrite = mode !== '2';
      var added = 0, updated = 0, skipped = 0;

      imported.forEach(function (imp) {
        if (!imp.title) return;
        var existing = findTask(imp.id);
        if (existing) {
          if (overwrite) {
            var idx = state.tasks.indexOf(existing);
            state.tasks[idx] = createTask(imp);
            updated++;
          } else {
            skipped++;
          }
        } else {
          state.tasks.push(createTask(imp));
          added++;
        }
      });

      saveTasks();
      updateFilterDropdowns();
      renderCurrentView();
      alert('インポート完了: 追加' + added + '件, 更新' + updated + '件, スキップ' + skipped + '件');
    };
    reader.readAsText(file, 'UTF-8');
  }

  // ============================================
  // GitHub Issue Integration (SPEC §4.2 #10, §8.3)
  // ============================================
  function createGithubIssue(taskId) {
    var task = findTask(taskId);
    if (!task) return;
    var gh = Storage.getGithub();
    if (!gh.token || !gh.repo) {
      alert('GitHub設定が未設定です。設定パネルでPATとリポジトリを入力してください。');
      $('settingsPanel').classList.add('show');
      return;
    }
    var body = task.description + '\n\n---\n';
    body += 'ステータス: ' + STATUS_LABELS[task.status] + '\n';
    body += '優先度: ' + PRIORITY_LABELS[task.priority] + '\n';
    body += '担当者: ' + (task.assignee || '-') + '\n';
    body += '開始日: ' + (task.startDate || '-') + '\n';
    body += '締切日: ' + (task.dueDate || '-') + '\n';
    body += '進捗: ' + task.progress + '%\n';
    if (task.tags.length) body += 'タグ: ' + task.tags.join(', ') + '\n';

    var labels = [];
    if (task.priority) labels.push('priority:' + task.priority);
    task.tags.forEach(function (t) { labels.push(t); });

    fetch('https://api.github.com/repos/' + gh.repo + '/issues', {
      method: 'POST',
      headers: {
        'Authorization': 'token ' + gh.token,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: task.title,
        body: body,
        labels: labels
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('GitHub API error: ' + res.status);
      return res.json();
    }).then(function (data) {
      task.githubIssueUrl = data.html_url;
      task.updatedAt = nowISO();
      saveTasks();
      logActivity(task.id, 'GitHub Issue作成', data.html_url);
      if (state.editingId === taskId) {
        $('f_githubIssueUrl').value = data.html_url;
      }
      alert('Issue作成: ' + data.html_url);
      renderCurrentView();
    }).catch(function (err) {
      alert('Issue作成失敗: ' + err.message);
    });
  }

  function testGithubConnection() {
    var gh = Storage.getGithub();
    if (!gh.token || !gh.repo) {
      alert('PATとリポジトリを入力してください。');
      return;
    }
    fetch('https://api.github.com/repos/' + gh.repo, {
      headers: { 'Authorization': 'token ' + gh.token, 'Accept': 'application/vnd.github.v3+json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      alert('接続成功: ' + data.full_name + ' (private: ' + data.private + ')');
    }).catch(function (err) {
      alert('接続失敗: ' + err.message);
    });
  }

  // ============================================
  // Bulk Operations (SPEC §4.2 #13)
  // ============================================
  function bulkDelete() {
    if (state.selectedIds.size === 0) return;
    if (!confirm(state.selectedIds.size + '件のタスクを削除しますか？')) return;
    var ids = Array.from(state.selectedIds);
    state.tasks = state.tasks.filter(function (t) { return !state.selectedIds.has(t.id); });
    ids.forEach(function (id) { logActivity(id, '一括削除', ''); });
    state.selectedIds.clear();
    saveTasks();
    updateFilterDropdowns();
    renderCurrentView();
  }

  function bulkChangeStatus() {
    var newStatus = $('bulkStatus').value;
    if (!newStatus || state.selectedIds.size === 0) return;
    state.tasks.forEach(function (t) {
      if (state.selectedIds.has(t.id)) {
        var old = t.status;
        t.status = newStatus;
        if (newStatus === 'done') t.progress = 100;
        t.updatedAt = nowISO();
        logActivity(t.id, '一括ステータス変更', STATUS_LABELS[old] + ' → ' + STATUS_LABELS[newStatus]);
      }
    });
    saveTasks();
    renderCurrentView();
  }

  function bulkGithubIssue() {
    if (state.selectedIds.size === 0) return;
    var gh = Storage.getGithub();
    if (!gh.token || !gh.repo) {
      alert('GitHub設定が未設定です。');
      return;
    }
    var count = 0;
    state.selectedIds.forEach(function (id) {
      createGithubIssue(id);
      count++;
    });
    alert(count + '件のIssue作成を開始しました');
  }

  // ============================================
  // Snapshots (SPEC §4.2 #15)
  // ============================================
  function saveSnapshot() {
    var name = $('snapshotName').value.trim();
    if (!name) { alert('スナップショット名を入力してください'); return; }
    var snaps = Storage.getSnapshots();
    snaps.unshift({
      id: uuid(),
      name: name,
      tasks: JSON.parse(JSON.stringify(state.tasks)),
      time: nowISO()
    });
    if (snaps.length > 20) snaps = snaps.slice(0, 20);
    Storage.setSnapshots(snaps);
    $('snapshotName').value = '';
    renderSnapshotList();
  }

  function restoreSnapshot(id) {
    var snaps = Storage.getSnapshots();
    var snap = snaps.filter(function (s) { return s.id === id; })[0];
    if (!snap) return;
    if (!confirm('スナップショット「' + snap.name + '」を復元しますか？現在のデータは上書きされます。')) return;
    state.tasks = JSON.parse(JSON.stringify(snap.tasks));
    saveTasks();
    updateFilterDropdowns();
    renderCurrentView();
    alert('復元完了: ' + snap.name);
  }

  function deleteSnapshot(id) {
    var snaps = Storage.getSnapshots();
    Storage.setSnapshots(snaps.filter(function (s) { return s.id !== id; }));
    renderSnapshotList();
  }

  function renderSnapshotList() {
    var snaps = Storage.getSnapshots();
    var list = $('snapshotList');
    if (snaps.length === 0) {
      list.innerHTML = '<li class="pm-snapshot-item" style="color:var(--pm-text-muted)">スナップショットがありません</li>';
      return;
    }
    list.innerHTML = snaps.map(function (s) {
      var dt = new Date(s.time);
      return '<li class="pm-snapshot-item"><span class="pm-snapshot-name">' + escapeHtml(s.name) + ' <small>(' + s.tasks.length + '件, ' + dt.toLocaleString('ja-JP') + ')</small></span>' +
        '<button class="pm-btn secondary small" onclick="pm.restoreSnapshot(\'' + s.id + '\')">復元</button>' +
        '<button class="pm-btn danger small" onclick="pm.deleteSnapshot(\'' + s.id + '\')">削除</button></li>';
    }).join('');
  }

  function renderActivityLog() {
    var log = Storage.getActivity();
    var list = $('activityLog');
    if (log.length === 0) {
      list.innerHTML = '<li class="pm-activity-item">アクティビティがありません</li>';
      return;
    }
    list.innerHTML = log.slice(0, 50).map(function (a) {
      var dt = new Date(a.time);
      var task = findTask(a.taskId);
      var taskTitle = task ? task.title : '(削除済み)';
      return '<li class="pm-activity-item"><span class="pm-activity-time">' + dt.toLocaleString('ja-JP') + '</span> ' + escapeHtml(a.action) + ' - ' + escapeHtml(taskTitle) + '</li>';
    }).join('');
  }

  // ============================================
  // Dependency Cycle Detection (SPEC §4.2 #12)
  // ============================================
  function hasCycle(taskId, visited, stack) {
    visited = visited || {};
    stack = stack || {};
    if (stack[taskId]) return true;
    if (visited[taskId]) return false;
    visited[taskId] = true;
    stack[taskId] = true;
    var task = findTask(taskId);
    if (!task) return false;
    // Check successors
    for (var i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].predecessors.indexOf(taskId) !== -1) {
        if (hasCycle(state.tasks[i].id, visited, stack)) return true;
      }
    }
    stack[taskId] = false;
    return false;
  }

  function checkDependencyCycle(taskId) {
    if (hasCycle(taskId)) {
      alert('警告: 循環依存が検出されました。依存関係を確認してください。');
      return true;
    }
    return false;
  }

  // ============================================
  // Dark Theme (SPEC §4.2 #16)
  // ============================================
  function toggleTheme() {
    var app = $('pmApp');
    var isDark = app.classList.toggle('dark-theme');
    var settings = Storage.getSettings();
    settings.darkTheme = isDark;
    Storage.setSettings(settings);
  }

  // ============================================
  // Event Bindings
  // ============================================
  function bindEvents() {
    // New task
    $('btnNew').addEventListener('click', function () { openModal(null); });

    // View tabs
    $$('.pm-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { switchView(tab.getAttribute('data-view')); });
    });

    // Filters
    $('searchBox').addEventListener('input', function () {
      state.filters.search = this.value;
      renderCurrentView();
    });
    $('filterStatus').addEventListener('change', function () {
      state.filters.status = this.value;
      renderCurrentView();
    });
    $('filterPriority').addEventListener('change', function () {
      state.filters.priority = this.value;
      renderCurrentView();
    });
    $('filterAssignee').addEventListener('change', function () {
      state.filters.assignee = this.value;
      renderCurrentView();
    });
    $('filterMilestone').addEventListener('change', function () {
      state.filters.milestone = this.value;
      renderCurrentView();
    });

    // Sort
    $$('#taskTable th[data-sort]').forEach(function (th) {
      th.addEventListener('click', function () {
        var col = th.getAttribute('data-sort');
        if (state.sortColumn === col) {
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortColumn = col;
          state.sortDir = 'asc';
        }
        renderList();
      });
    });

    // Check all
    $('checkAll').addEventListener('change', function () {
      if (this.checked) {
        state.tasks.forEach(function (t) { state.selectedIds.add(t.id); });
      } else {
        state.selectedIds.clear();
      }
      renderList();
    });

    // Row checkbox (delegated)
    $('taskTableBody').addEventListener('change', function (e) {
      if (e.target.classList.contains('row-check')) {
        var id = e.target.getAttribute('data-id');
        if (e.target.checked) state.selectedIds.add(id);
        else state.selectedIds.delete(id);
        updateBulkBar();
      }
    });

    // Export/Import
    $('btnExportJson').addEventListener('click', exportJson);
    $('btnExportCsv').addEventListener('click', exportCsv);
    $('btnImport').addEventListener('click', function () { $('importFile').click(); });
    $('importFile').addEventListener('change', function () {
      if (this.files[0]) importFile(this.files[0]);
      this.value = '';
    });

    // Settings & Theme
    $('btnSettings').addEventListener('click', function () {
      $('settingsPanel').classList.toggle('show');
      renderSnapshotList();
      renderActivityLog();
    });
    $('btnTheme').addEventListener('click', toggleTheme);

    // GitHub settings
    $('btnSaveGithub').addEventListener('click', function () {
      Storage.setGithub({ token: $('ghToken').value.trim(), repo: $('ghRepo').value.trim() });
      alert('GitHub設定を保存しました');
    });
    $('btnTestGithub').addEventListener('click', testGithubConnection);

    // Snapshots
    $('btnSaveSnapshot').addEventListener('click', saveSnapshot);

    // Bulk operations
    $('btnBulkDelete').addEventListener('click', bulkDelete);
    $('btnBulkStatus').addEventListener('click', bulkChangeStatus);
    $('btnBulkGithub').addEventListener('click', bulkGithubIssue);

    // Calendar navigation
    $('calPrev').addEventListener('click', function () {
      state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() - 1, 1);
      renderCalendar();
    });
    $('calNext').addEventListener('click', function () {
      state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + 1, 1);
      renderCalendar();
    });

    // Modal
    $('taskForm').addEventListener('submit', function (e) {
      e.preventDefault();
      saveTaskFromForm();
    });
    $('btnCancel').addEventListener('click', closeModal);
    $('btnDelete').addEventListener('click', function () {
      if (state.editingId) {
        deleteTask(state.editingId);
        closeModal();
      }
    });
    $('btnAddSubtask').addEventListener('click', addSubtaskRow);
    $('btnGithubIssue').addEventListener('click', function () {
      if (state.editingId) createGithubIssue(state.editingId);
    });
    $('f_progress').addEventListener('input', function () {
      $('f_progressLabel').textContent = this.value + '%';
    });

    // Modal overlay click to close
    $('taskModal').addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });

    // Keyboard shortcuts (SPEC §4.2 #17)
    document.addEventListener('keydown', function (e) {
      // Ctrl+N: new task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openModal(null);
        return;
      }
      // Ctrl+1/2/3/4: view switch
      if ((e.ctrlKey || e.metaKey) && ['1', '2', '3', '4'].indexOf(e.key) !== -1) {
        e.preventDefault();
        var views = ['list', 'gantt', 'kanban', 'calendar'];
        switchView(views[parseInt(e.key, 10) - 1]);
        return;
      }
      // / : search focus
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'SELECT') {
        e.preventDefault();
        $('searchBox').focus();
        return;
      }
      // Esc: close modal
      if (e.key === 'Escape') {
        if ($('taskModal').classList.contains('show')) {
          closeModal();
        }
        return;
      }
    });
  }

  // ============================================
  // Public API (for inline onclick handlers)
  // ============================================
  window.pm = {
    editTask: function (id) { openModal(id); },
    deleteTask: deleteTask,
    restoreSnapshot: restoreSnapshot,
    deleteSnapshot: deleteSnapshot
  };

  // ============================================
  // Init
  // ============================================
  function init() {
    // Load tasks
    state.tasks = Storage.getTasks().map(function (t) {
      return createTask(t);
    });

    // Load settings
    var settings = Storage.getSettings();
    if (settings.currentView) state.currentView = settings.currentView;
    if (settings.darkTheme) $('pmApp').classList.add('dark-theme');

    // Load GitHub settings
    var gh = Storage.getGithub();
    $('ghToken').value = gh.token || '';
    $('ghRepo').value = gh.repo || '';

    bindEvents();
    updateFilterDropdowns();
    switchView(state.currentView);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
