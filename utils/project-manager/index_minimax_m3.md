---
layout: default
title: プロジェクト管理 (MiniMax m3) - Rui Software
---

<div class="pm-wrap" id="pm-root">
  <h2 class="pm-title">プロジェクト管理ツール (MiniMax m3)</h2>
  <p class="pm-subtitle">ブラウザ完結型のプロジェクト管理 — 4ビュー(リスト/ガント/看板/カレンダー)+ GitHub Issue連携 + localStorage永続化</p>

  <!-- コントロールバー -->
  <div class="pm-controls">
    <button type="button" class="pm-btn primary" id="pm-btn-new" title="新規タスク (Ctrl+N)">+ 新規タスク</button>

    <div class="pm-tab-group" role="tablist" aria-label="ビュー切替">
      <button type="button" class="pm-tab active" data-view="list" role="tab">リスト</button>
      <button type="button" class="pm-tab" data-view="gantt" role="tab">ガント</button>
      <button type="button" class="pm-tab" data-view="kanban" role="tab">看板</button>
      <button type="button" class="pm-tab" data-view="calendar" role="tab">カレンダー</button>
    </div>

    <input type="search" id="pm-search" class="pm-search" placeholder="検索 (/)" aria-label="全文検索">

    <select id="pm-filter-status" class="pm-filter" aria-label="ステータスフィルタ">
      <option value="">ステータス: 全て</option>
      <option value="todo">ToDo</option>
      <option value="doing">Doing</option>
      <option value="done">Done</option>
    </select>
    <select id="pm-filter-priority" class="pm-filter" aria-label="優先度フィルタ">
      <option value="">優先度: 全て</option>
      <option value="high">高</option>
      <option value="medium">中</option>
      <option value="low">低</option>
    </select>
    <select id="pm-filter-assignee" class="pm-filter" aria-label="担当者フィルタ">
      <option value="">担当者: 全て</option>
    </select>
    <select id="pm-filter-milestone" class="pm-filter" aria-label="マイルストーンフィルタ">
      <option value="">マイルストーン: 全て</option>
    </select>

    <div class="pm-actions">
      <button type="button" class="pm-btn secondary small" id="pm-btn-export-json">JSON出力</button>
      <button type="button" class="pm-btn secondary small" id="pm-btn-export-csv">CSV出力</button>
      <button type="button" class="pm-btn secondary small" id="pm-btn-import">読込</button>
      <input type="file" id="pm-file-input" accept=".json,.csv" style="display:none">
      <button type="button" class="pm-btn secondary small" id="pm-btn-settings" aria-expanded="false">⚙ 設定</button>
      <button type="button" class="pm-btn secondary small" id="pm-btn-theme" title="テーマ切替">🌓</button>
    </div>
  </div>

  <!-- 一括操作バー -->
  <div class="pm-bulk-bar" id="pm-bulk-bar" style="display:none" role="region" aria-label="一括操作">
    <span id="pm-bulk-count" class="pm-bulk-count">0件選択中</span>
    <button type="button" class="pm-btn small" data-bulk-status="todo">ToDoに</button>
    <button type="button" class="pm-btn small" data-bulk-status="doing">Doingに</button>
    <button type="button" class="pm-btn small" data-bulk-status="done">Doneに</button>
    <button type="button" class="pm-btn small" id="pm-bulk-github">GitHub Issue化</button>
    <button type="button" class="pm-btn small danger" id="pm-bulk-delete">削除</button>
    <button type="button" class="pm-btn small secondary" id="pm-bulk-clear">選択解除</button>
  </div>

  <!-- 設定パネル -->
  <div class="pm-settings-panel" id="pm-settings-panel" style="display:none" role="region" aria-label="設定">
    <h3>設定</h3>

    <section class="pm-settings-section">
      <h4>GitHub連携</h4>
      <div class="pm-form-row">
        <label for="pm-gh-token">Personal Access Token</label>
        <input type="password" id="pm-gh-token" placeholder="ghp_..." autocomplete="off">
      </div>
      <div class="pm-form-row">
        <label for="pm-gh-repo">リポジトリ (owner/repo)</label>
        <input type="text" id="pm-gh-repo" placeholder="user/repo">
      </div>
      <button type="button" class="pm-btn small" id="pm-gh-save">保存</button>
      <button type="button" class="pm-btn small secondary" id="pm-gh-clear">クリア</button>
      <p class="pm-note">⚠ トークンは localStorage に平文保存されます。共有環境では使用しないでください。</p>
    </section>

    <section class="pm-settings-section">
      <h4>スナップショット</h4>
      <div class="pm-snapshot-save">
        <input type="text" id="pm-snap-name" placeholder="スナップショット名">
        <button type="button" class="pm-btn small" id="pm-snap-save">現在の状態を保存</button>
      </div>
      <ul class="pm-snapshot-list" id="pm-snapshot-list"></ul>
    </section>

    <section class="pm-settings-section">
      <h4>アクティビティログ (最新50件)</h4>
      <ul class="pm-activity-list" id="pm-activity-list"></ul>
      <button type="button" class="pm-btn small secondary" id="pm-activity-clear">ログをクリア</button>
    </section>

    <section class="pm-settings-section">
      <h4>データ管理</h4>
      <button type="button" class="pm-btn small danger" id="pm-btn-clear-all">全タスク削除</button>
    </section>
  </div>

  <!-- ビューコンテナ -->
  <div class="pm-view-container" id="pm-view-container">
    <div class="pm-view" id="pm-view-list" role="tabpanel"></div>
    <div class="pm-view" id="pm-view-gantt" role="tabpanel" style="display:none"></div>
    <div class="pm-view" id="pm-view-kanban" role="tabpanel" style="display:none"></div>
    <div class="pm-view" id="pm-view-calendar" role="tabpanel" style="display:none"></div>
  </div>

  <div class="pm-status-bar" id="pm-status-bar" role="status" aria-live="polite"></div>
</div>

<!-- モーダル: タスク追加/編集 -->
<div class="pm-modal" id="pm-modal" style="display:none" role="dialog" aria-modal="true" aria-labelledby="pm-modal-title">
  <div class="pm-modal-backdrop" data-close></div>
  <div class="pm-modal-dialog">
    <div class="pm-modal-header">
      <h3 id="pm-modal-title">新規タスク</h3>
      <button type="button" class="pm-modal-close" data-close aria-label="閉じる">×</button>
    </div>
    <div class="pm-modal-body">
      <form id="pm-form" class="pm-form" autocomplete="off">
        <input type="hidden" id="pm-task-id">

        <div class="pm-form-row">
          <label for="pm-title">タイトル <span class="pm-required">*</span></label>
          <input type="text" id="pm-title" required maxlength="200">
        </div>

        <div class="pm-form-row">
          <label for="pm-description">詳細</label>
          <textarea id="pm-description" rows="3"></textarea>
        </div>

        <div class="pm-form-row pm-form-grid">
          <div>
            <label for="pm-status">ステータス</label>
            <select id="pm-status">
              <option value="todo">ToDo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label for="pm-priority">優先度</label>
            <select id="pm-priority">
              <option value="high">高</option>
              <option value="medium" selected>中</option>
              <option value="low">低</option>
            </select>
          </div>
          <div>
            <label for="pm-assignee">担当者</label>
            <input type="text" id="pm-assignee" maxlength="100">
          </div>
          <div>
            <label for="pm-milestone">マイルストーン</label>
            <input type="text" id="pm-milestone" maxlength="100">
          </div>
        </div>

        <div class="pm-form-row pm-form-grid">
          <div>
            <label for="pm-start-date">開始日</label>
            <input type="date" id="pm-start-date">
          </div>
          <div>
            <label for="pm-due-date">締切日</label>
            <input type="date" id="pm-due-date">
          </div>
          <div>
            <label for="pm-estimated-hours">予定工数 (h)</label>
            <input type="number" id="pm-estimated-hours" min="0" step="0.5">
          </div>
          <div>
            <label for="pm-actual-hours">実績工数 (h)</label>
            <input type="number" id="pm-actual-hours" min="0" step="0.5">
          </div>
        </div>

        <div class="pm-form-row">
          <label for="pm-progress">進捗率: <span id="pm-progress-display">0</span>%</label>
          <input type="range" id="pm-progress" min="0" max="100" step="5" value="0">
        </div>

        <div class="pm-form-row">
          <label for="pm-tags">タグ (カンマ区切り)</label>
          <input type="text" id="pm-tags" placeholder="例: backend, urgent, release-v2">
        </div>

        <div class="pm-form-row">
          <label>サブタスク</label>
          <div class="pm-subtask-list" id="pm-subtask-list"></div>
          <button type="button" class="pm-btn small secondary" id="pm-subtask-add">+ サブタスク追加</button>
        </div>

        <div class="pm-form-row">
          <label for="pm-predecessors">依存タスク (複数選択可、Ctrl/⌘クリック)</label>
          <select id="pm-predecessors" multiple size="5"></select>
          <p class="pm-form-hint" id="pm-cycle-warning" style="display:none;color:var(--pm-priority-high)">⚠ 循環依存が検出されました</p>
        </div>

        <div class="pm-form-row" id="pm-github-row" style="display:none">
          <label>GitHub Issue</label>
          <a id="pm-github-link" href="#" target="_blank" rel="noopener"></a>
        </div>

        <div class="pm-form-row" id="pm-activity-row" style="display:none">
          <label>アクティビティ履歴</label>
          <ul class="pm-form-activity" id="pm-form-activity"></ul>
        </div>

        <div class="pm-form-actions">
          <button type="button" class="pm-btn secondary" data-close>キャンセル</button>
          <button type="button" class="pm-btn danger" id="pm-form-delete" style="display:none">削除</button>
          <button type="submit" class="pm-btn primary">保存</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- モーダル: 確認 -->
<div class="pm-modal" id="pm-confirm" style="display:none" role="dialog" aria-modal="true">
  <div class="pm-modal-backdrop" data-close></div>
  <div class="pm-modal-dialog pm-modal-sm">
    <div class="pm-modal-header">
      <h3 id="pm-confirm-title">確認</h3>
    </div>
    <div class="pm-modal-body">
      <p id="pm-confirm-message"></p>
      <div class="pm-form-actions">
        <button type="button" class="pm-btn secondary" data-close>キャンセル</button>
        <button type="button" class="pm-btn primary" id="pm-confirm-ok">OK</button>
      </div>
    </div>
  </div>
</div>

<!-- モーダル: インポート -->
<div class="pm-modal" id="pm-import-modal" style="display:none" role="dialog" aria-modal="true">
  <div class="pm-modal-backdrop" data-close></div>
  <div class="pm-modal-dialog">
    <div class="pm-modal-header">
      <h3>インポート</h3>
      <button type="button" class="pm-modal-close" data-close aria-label="閉じる">×</button>
    </div>
    <div class="pm-modal-body" id="pm-import-body"></div>
  </div>
</div>

<style>
/* ============================================================
   プロジェクト管理 (MiniMax m3) スタイル
   カラーパレット: SPEC §6.1 準拠
   ============================================================ */

.pm-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  color: var(--pm-text);
  background: var(--pm-bg);
  padding: 0.5em 0;
}
.pm-wrap *,
.pm-wrap *::before,
.pm-wrap *::after { box-sizing: border-box; }

.pm-title { margin: 0 0 0.25em 0; color: var(--pm-accent); }
.pm-subtitle { color: var(--pm-muted); font-size: 0.9em; margin: 0 0 1em 0; }

/* CSS変数 (ライト) */
:root {
  --pm-accent: #2e8b57;
  --pm-accent-fg: #fff;
  --pm-panel-bg: #f7faf8;
  --pm-panel-border: #dde8e2;
  --pm-panel-border-strong: #aaccbb;
  --pm-hover-bg: #eaf3ee;
  --pm-priority-high: #dc3545;
  --pm-priority-medium: #ffc107;
  --pm-priority-low: #2e8b57;
  --pm-status-todo-bg: #e2e3e5;
  --pm-status-todo-fg: #383d41;
  --pm-status-doing-bg: #cce5ff;
  --pm-status-doing-fg: #004085;
  --pm-status-done-bg: #d4edda;
  --pm-status-done-fg: #155724;
  --pm-text: #222;
  --pm-muted: #666;
  --pm-bg: #fff;
  --pm-input-bg: #fff;
  --pm-input-border: #ccc;
  --pm-shadow: 0 2px 4px rgba(0,0,0,.08);
  --pm-shadow-lg: 0 8px 24px rgba(0,0,0,.18);
  --pm-overlay: rgba(0,0,0,.4);
}

/* ダークテーマ */
body.pm-dark {
  --pm-accent: #3cb371;
  --pm-accent-fg: #15201b;
  --pm-panel-bg: #1f2a24;
  --pm-panel-border: #2e3d35;
  --pm-panel-border-strong: #3e5448;
  --pm-hover-bg: #2a3a32;
  --pm-priority-high: #ef5b65;
  --pm-priority-medium: #ffd454;
  --pm-priority-low: #3cb371;
  --pm-status-todo-bg: #2e3538;
  --pm-status-todo-fg: #b0b6ba;
  --pm-status-doing-bg: #1e3a5f;
  --pm-status-doing-fg: #b3d4ff;
  --pm-status-done-bg: #1e3a2a;
  --pm-status-done-fg: #a8e6b3;
  --pm-text: #e8e8e8;
  --pm-muted: #aaa;
  --pm-bg: #15201b;
  --pm-input-bg: #1f2a24;
  --pm-input-border: #3e5448;
  --pm-shadow: 0 2px 4px rgba(0,0,0,.4);
  --pm-shadow-lg: 0 8px 24px rgba(0,0,0,.6);
  --pm-overlay: rgba(0,0,0,.65);
}

/* コントロールバー */
.pm-controls {
  display: flex; flex-wrap: wrap; gap: 0.5em;
  padding: 0.75em; background: var(--pm-panel-bg);
  border: 1px solid var(--pm-panel-border); border-radius: 4px;
  margin-bottom: 0.75em; align-items: center;
}
.pm-controls .pm-search { flex: 1 1 160px; min-width: 120px; }
.pm-controls .pm-filter { flex: 0 0 auto; }
.pm-actions { display: flex; flex-wrap: wrap; gap: 0.25em; margin-left: auto; }

/* タブ */
.pm-tab-group { display: inline-flex; border: 1px solid var(--pm-panel-border-strong); border-radius: 4px; overflow: hidden; }
.pm-tab {
  background: var(--pm-bg); color: var(--pm-accent);
  border: none; border-right: 1px solid var(--pm-panel-border-strong);
  padding: 0.4em 0.9em; cursor: pointer; font-size: 0.9em;
}
.pm-tab:last-child { border-right: none; }
.pm-tab:hover { background: var(--pm-hover-bg); }
.pm-tab.active { background: var(--pm-accent); color: var(--pm-accent-fg); }

/* ボタン */
.pm-btn {
  background: var(--pm-accent); color: var(--pm-accent-fg);
  border: 1px solid var(--pm-accent); border-radius: 3px;
  padding: 0.4em 0.9em; cursor: pointer; font-size: 0.9em;
  font-family: inherit; transition: background .15s, color .15s;
}
.pm-btn:hover { filter: brightness(0.95); }
.pm-btn.secondary { background: var(--pm-bg); color: var(--pm-accent); }
.pm-btn.secondary:hover { background: var(--pm-hover-bg); }
.pm-btn.danger { background: var(--pm-priority-high); border-color: var(--pm-priority-high); color: #fff; }
.pm-btn.small { padding: 0.25em 0.6em; font-size: 0.85em; }
.pm-btn:disabled { opacity: .5; cursor: not-allowed; }

/* 入力 */
.pm-search, .pm-filter,
.pm-form input[type=text], .pm-form input[type=date], .pm-form input[type=number],
.pm-form input[type=password], .pm-form select, .pm-form textarea {
  background: var(--pm-input-bg); color: var(--pm-text);
  border: 1px solid var(--pm-input-border); border-radius: 3px;
  padding: 0.35em 0.5em; font-size: 0.9em;
  font-family: inherit; width: 100%;
}
.pm-form input:focus, .pm-form select:focus, .pm-form textarea:focus,
.pm-search:focus, .pm-filter:focus {
  outline: 2px solid var(--pm-accent); outline-offset: -1px;
}
.pm-snapshot-save { display: flex; gap: 0.5em; margin-bottom: 0.5em; }
.pm-snapshot-save input { flex: 1; }

/* 一括操作バー */
.pm-bulk-bar {
  display: flex; flex-wrap: wrap; gap: 0.4em; align-items: center;
  padding: 0.5em 0.75em; margin-bottom: 0.5em;
  background: var(--pm-hover-bg); border: 1px solid var(--pm-accent);
  border-radius: 4px;
}
.pm-bulk-count { font-weight: bold; margin-right: 0.5em; color: var(--pm-accent); }

/* 設定パネル */
.pm-settings-panel {
  background: var(--pm-panel-bg); border: 1px solid var(--pm-panel-border);
  border-radius: 4px; padding: 1em; margin-bottom: 0.75em;
}
.pm-settings-panel h3 { margin-top: 0; color: var(--pm-accent); }
.pm-settings-section { margin-bottom: 1.25em; padding-bottom: 1em; border-bottom: 1px solid var(--pm-panel-border); }
.pm-settings-section:last-child { border-bottom: none; padding-bottom: 0; }
.pm-settings-section h4 { margin: 0 0 0.5em 0; font-size: 1em; }
.pm-note { color: var(--pm-priority-high); font-size: 0.85em; margin: 0.5em 0 0 0; }
.pm-snapshot-list, .pm-activity-list { list-style: none; padding: 0; margin: 0.5em 0; max-height: 200px; overflow-y: auto; }
.pm-snapshot-list li, .pm-activity-list li {
  display: flex; justify-content: space-between; align-items: center; gap: 0.5em;
  padding: 0.35em 0.5em; border-bottom: 1px solid var(--pm-panel-border);
  font-size: 0.85em;
}
.pm-snapshot-list li:last-child, .pm-activity-list li:last-child { border-bottom: none; }
.pm-snapshot-name { flex: 1; }
.pm-snapshot-date { color: var(--pm-muted); font-size: 0.85em; }
.pm-activity-time { color: var(--pm-muted); white-space: nowrap; }
.pm-activity-text { flex: 1; }

/* ビュー共通 */
.pm-view-container { margin-top: 0.5em; }
.pm-view { background: var(--pm-bg); }
.pm-empty {
  text-align: center; color: var(--pm-muted);
  padding: 3em 1em; font-size: 1.05em;
  background: var(--pm-panel-bg); border: 1px dashed var(--pm-panel-border-strong);
  border-radius: 4px;
}

/* リストビュー */
.pm-table { width: 100%; border-collapse: collapse; background: var(--pm-bg); }
.pm-table th, .pm-table td {
  padding: 0.5em 0.6em; text-align: left;
  border-bottom: 1px solid var(--pm-panel-border); font-size: 0.9em;
  vertical-align: middle;
}
.pm-table th {
  background: var(--pm-panel-bg); color: var(--pm-text);
  font-weight: bold; cursor: pointer; user-select: none;
  position: sticky; top: 0; z-index: 1;
}
.pm-table th.pm-sortable:hover { background: var(--pm-hover-bg); }
.pm-table th.pm-sort-asc::after { content: ' ▲'; color: var(--pm-accent); }
.pm-table th.pm-sort-desc::after { content: ' ▼'; color: var(--pm-accent); }
.pm-table tr:hover td { background: var(--pm-hover-bg); }
.pm-table td.pm-title-cell { cursor: pointer; color: var(--pm-accent); }
.pm-table td.pm-title-cell:hover { text-decoration: underline; }
.pm-table input[type=checkbox] { cursor: pointer; }

/* プログレスバー */
.pm-progress-bar {
  display: inline-block; width: 80px; height: 12px;
  background: var(--pm-panel-border); border-radius: 6px; overflow: hidden;
  vertical-align: middle;
}
.pm-progress-fill {
  height: 100%; background: var(--pm-accent);
  transition: width .2s;
}
.pm-progress-text { font-size: 0.8em; margin-left: 0.3em; }

/* バッジ */
.pm-priority, .pm-status-badge {
  display: inline-block; padding: 0.15em 0.5em; border-radius: 3px;
  font-size: 0.8em; font-weight: bold; line-height: 1.4;
}
.pm-priority-high { background: var(--pm-priority-high); color: #fff; }
.pm-priority-medium { background: var(--pm-priority-medium); color: #333; }
.pm-priority-low { background: var(--pm-priority-low); color: #fff; }
.pm-status-badge.pm-status-todo { background: var(--pm-status-todo-bg); color: var(--pm-status-todo-fg); }
.pm-status-badge.pm-status-doing { background: var(--pm-status-doing-bg); color: var(--pm-status-doing-fg); }
.pm-status-badge.pm-status-done { background: var(--pm-status-done-bg); color: var(--pm-status-done-fg); }
.pm-tag {
  display: inline-block; padding: 0.1em 0.4em; margin: 0 0.2em 0.2em 0;
  background: var(--pm-panel-border); color: var(--pm-text);
  border-radius: 3px; font-size: 0.75em;
}
body.pm-dark .pm-tag { background: var(--pm-panel-border-strong); }

/* ガントチャート */
.pm-gantt-wrapper { overflow-x: auto; border: 1px solid var(--pm-panel-border); border-radius: 4px; background: var(--pm-bg); }
.pm-gantt { min-width: 100%; position: relative; }
.pm-gantt-header {
  display: grid; background: var(--pm-panel-bg);
  border-bottom: 2px solid var(--pm-panel-border-strong);
  font-size: 0.8em; font-weight: bold;
  position: sticky; top: 0; z-index: 2;
}
.pm-gantt-month { padding: 0.3em; text-align: center; border-right: 1px solid var(--pm-panel-border); }
.pm-gantt-week { padding: 0.3em; text-align: center; border-right: 1px solid var(--pm-panel-border); }
.pm-gantt-week.pm-current { background: var(--pm-accent); color: var(--pm-accent-fg); }
.pm-gantt-body { position: relative; }
.pm-gantt-row {
  position: relative; height: 36px;
  border-bottom: 1px solid var(--pm-panel-border);
}
.pm-gantt-row-label {
  position: sticky; left: 0; z-index: 1;
  background: var(--pm-bg); padding: 0.3em 0.5em;
  border-right: 1px solid var(--pm-panel-border-strong);
  font-size: 0.85em; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; max-width: 200px; cursor: pointer;
}
.pm-gantt-row-label:hover { color: var(--pm-accent); text-decoration: underline; }
.pm-gantt-grid-bg {
  position: absolute; top: 0; bottom: 0; left: 0; right: 0;
  display: grid; pointer-events: none;
}
.pm-gantt-grid-cell { border-right: 1px dashed var(--pm-panel-border); }
.pm-gantt-today {
  position: absolute; top: 0; bottom: 0; width: 2px;
  background: var(--pm-priority-high); z-index: 3; pointer-events: none;
}
.pm-gantt-today::before {
  content: '今日'; position: absolute; top: -18px; left: -10px;
  background: var(--pm-priority-high); color: #fff;
  font-size: 0.7em; padding: 0 4px; border-radius: 2px;
}
.pm-gantt-bar {
  position: absolute; top: 6px; height: 24px;
  border-radius: 3px; padding: 0 0.4em;
  color: #fff; font-size: 0.75em; line-height: 24px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  cursor: pointer; z-index: 2;
}
.pm-gantt-bar.priority-high { background: var(--pm-priority-high); }
.pm-gantt-bar.priority-medium { background: var(--pm-priority-medium); color: #333; }
.pm-gantt-bar.priority-low { background: var(--pm-priority-low); }
.pm-gantt-bar:hover { filter: brightness(1.1); box-shadow: var(--pm-shadow); }
.pm-gantt-milestone {
  position: absolute; top: 8px; width: 20px; height: 20px;
  background: var(--pm-accent); transform: rotate(45deg);
  z-index: 3; cursor: pointer; box-shadow: var(--pm-shadow);
}
.pm-gantt-milestone::after {
  content: '◆'; position: absolute; top: -3px; left: 2px;
  color: #fff; font-size: 0.7em; transform: rotate(-45deg);
}
.pm-gantt-svg { position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1; }
.pm-gantt-svg path { stroke: var(--pm-accent); stroke-width: 1.5; fill: none; marker-end: url(#pm-arrow); }

/* 看板ビュー */
.pm-kanban {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0.75em; min-height: 400px;
}
.pm-kanban-col {
  background: var(--pm-panel-bg); border: 1px solid var(--pm-panel-border);
  border-radius: 4px; padding: 0.5em; min-height: 200px;
}
.pm-kanban-col.pm-drag-over { background: var(--pm-hover-bg); border-color: var(--pm-accent); border-style: dashed; }
.pm-kanban-col-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.3em 0.5em; margin-bottom: 0.5em;
  font-weight: bold; color: var(--pm-accent);
  border-bottom: 2px solid currentColor;
}
.pm-kanban-col[data-status=todo] .pm-kanban-col-header { color: var(--pm-status-todo-fg); }
.pm-kanban-col[data-status=doing] .pm-kanban-col-header { color: var(--pm-status-doing-fg); }
.pm-kanban-col[data-status=done] .pm-kanban-col-header { color: var(--pm-status-done-fg); }
.pm-kanban-col-count { font-size: 0.85em; color: var(--pm-muted); font-weight: normal; }
.pm-kanban-list { min-height: 100px; }
.pm-kanban-card {
  background: var(--pm-bg); border: 1px solid var(--pm-panel-border);
  border-radius: 3px; padding: 0.5em; margin-bottom: 0.5em;
  cursor: grab; box-shadow: var(--pm-shadow);
  transition: transform .1s, box-shadow .1s;
}
.pm-kanban-card:hover { box-shadow: var(--pm-shadow-lg); transform: translateY(-1px); }
.pm-kanban-card.pm-dragging { opacity: .5; cursor: grabbing; }
.pm-kanban-card-title { font-weight: bold; margin-bottom: 0.3em; color: var(--pm-text); }
.pm-kanban-card-meta { display: flex; flex-wrap: wrap; gap: 0.3em; align-items: center; font-size: 0.8em; }
.pm-kanban-card-due { color: var(--pm-muted); font-size: 0.8em; margin-top: 0.3em; }
.pm-kanban-card-due.pm-overdue { color: var(--pm-priority-high); font-weight: bold; }

/* カレンダービュー */
.pm-cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5em; }
.pm-cal-header h3 { margin: 0; color: var(--pm-accent); }
.pm-cal-nav { display: flex; gap: 0.3em; }
.pm-cal-grid {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 1px; background: var(--pm-panel-border);
  border: 1px solid var(--pm-panel-border); border-radius: 4px;
  overflow: hidden;
}
.pm-cal-weekday {
  background: var(--pm-panel-bg); padding: 0.5em;
  text-align: center; font-weight: bold; font-size: 0.85em;
  color: var(--pm-accent);
}
.pm-cal-day {
  background: var(--pm-bg); min-height: 80px; padding: 0.3em;
  font-size: 0.8em; position: relative;
}
.pm-cal-day.pm-other-month { color: var(--pm-muted); background: var(--pm-panel-bg); }
.pm-cal-day.pm-today { background: var(--pm-hover-bg); }
.pm-cal-day-num { font-weight: bold; }
.pm-cal-day-dots { margin-top: 0.3em; display: flex; flex-wrap: wrap; gap: 2px; }
.pm-cal-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  cursor: pointer;
}
.pm-cal-dot.priority-high { background: var(--pm-priority-high); }
.pm-cal-dot.priority-medium { background: var(--pm-priority-medium); }
.pm-cal-dot.priority-low { background: var(--pm-priority-low); }

/* モーダル */
.pm-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; }
.pm-modal-backdrop { position: absolute; inset: 0; background: var(--pm-overlay); }
.pm-modal-dialog {
  position: relative; background: var(--pm-bg); color: var(--pm-text);
  border-radius: 6px; box-shadow: var(--pm-shadow-lg);
  max-width: 720px; width: 92%; max-height: 90vh; display: flex; flex-direction: column;
}
.pm-modal-dialog.pm-modal-sm { max-width: 480px; }
.pm-modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.75em 1em; border-bottom: 1px solid var(--pm-panel-border);
  background: var(--pm-panel-bg);
}
.pm-modal-header h3 { margin: 0; color: var(--pm-accent); }
.pm-modal-close {
  background: none; border: none; font-size: 1.5em; line-height: 1;
  cursor: pointer; color: var(--pm-muted);
}
.pm-modal-body { padding: 1em; overflow-y: auto; }

/* フォーム */
.pm-form-row { margin-bottom: 0.75em; }
.pm-form-row label { display: block; font-weight: bold; margin-bottom: 0.25em; font-size: 0.9em; }
.pm-form-row label .pm-required { color: var(--pm-priority-high); }
.pm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75em; }
.pm-form-grid > div { min-width: 0; }
.pm-form-hint { font-size: 0.85em; margin: 0.3em 0 0 0; }
.pm-form-actions { display: flex; justify-content: flex-end; gap: 0.5em; margin-top: 1em; padding-top: 1em; border-top: 1px solid var(--pm-panel-border); }
.pm-form-activity {
  list-style: none; padding: 0.5em; margin: 0;
  background: var(--pm-panel-bg); border: 1px solid var(--pm-panel-border);
  border-radius: 3px; max-height: 150px; overflow-y: auto; font-size: 0.85em;
}
.pm-form-activity li { padding: 0.2em 0; border-bottom: 1px dashed var(--pm-panel-border); }
.pm-form-activity li:last-child { border-bottom: none; }
.pm-form-activity time { color: var(--pm-muted); margin-right: 0.5em; }

/* サブタスク */
.pm-subtask-list { margin-bottom: 0.5em; }
.pm-subtask-row { display: flex; gap: 0.4em; align-items: center; margin-bottom: 0.3em; }
.pm-subtask-row input[type=text] { flex: 1; }
.pm-subtask-row input[type=checkbox] { width: auto; flex: 0 0 auto; }
.pm-subtask-row .pm-btn { flex: 0 0 auto; }

/* ステータスバー */
.pm-status-bar {
  position: fixed; bottom: 1em; right: 1em; z-index: 9998;
  background: var(--pm-accent); color: var(--pm-accent-fg);
  padding: 0.5em 1em; border-radius: 4px; box-shadow: var(--pm-shadow-lg);
  font-size: 0.9em; max-width: 360px;
  opacity: 0; transition: opacity .25s; pointer-events: none;
}
.pm-status-bar.pm-show { opacity: 1; }
.pm-status-bar.pm-error { background: var(--pm-priority-high); }
.pm-status-bar.pm-warn { background: var(--pm-priority-medium); color: #333; }

/* インポート選択UI */
.pm-import-choice { display: flex; flex-direction: column; gap: 0.5em; }
.pm-import-list { max-height: 200px; overflow-y: auto; border: 1px solid var(--pm-panel-border); border-radius: 3px; padding: 0.5em; }
.pm-import-list label { display: block; padding: 0.2em 0; font-weight: normal; font-size: 0.9em; }
.pm-import-conflicts { background: var(--pm-panel-bg); padding: 0.5em; border-radius: 3px; margin: 0.5em 0; }
.pm-import-conflicts h4 { margin: 0 0 0.5em 0; font-size: 0.95em; }

/* GitHubリンク */
#pm-github-link { color: var(--pm-accent); word-break: break-all; }

/* レスポンシブ */
@media (max-width: 768px) {
  .pm-controls { flex-direction: column; align-items: stretch; }
  .pm-actions { margin-left: 0; }
  .pm-form-grid { grid-template-columns: 1fr; }
  .pm-kanban { grid-template-columns: 1fr; }
  .pm-modal-dialog { max-height: 95vh; }
}
</style>

<script>
/* ============================================================
   プロジェクト管理 (MiniMax m3)
   単一ファイル実装 — 仕様: utils/project-manager/SPEC.md
   ============================================================ */
(function(global){
  'use strict';

  /* ---------- ストレージキー定数 (SPEC §3.2) ---------- */
  const KEYS = {
    tasks:     'rui-pm-tasks',
    settings:  'rui-pm-settings',
    github:    'rui-pm-github',
    snapshots: 'rui-pm-snapshots',
    activity:  'rui-pm-activity'
  };

  const STATUS_LABEL = { todo: 'ToDo', doing: 'Doing', done: 'Done' };
  const PRIORITY_LABEL = { high: '高', medium: '中', low: '低' };
  const ACTIVITY_CAP = 500;

  /* ---------- アプリケーション状態 ---------- */
  const state = {
    tasks: [],
    view: 'list',
    filters: { status: '', priority: '', assignee: '', milestone: '', search: '' },
    sort: { field: null, dir: 'asc' },
    selection: new Set(),
    settings: { theme: 'light', view: 'list' },
    github: { token: '', repo: '' },
    snapshots: [],
    activity: [],
    calendarMonth: null  // {year, month} 表示中の月
  };

  /* ---------- ストレージヘルパー ---------- */
  function loadStorage() {
    try {
      const t = localStorage.getItem(KEYS.tasks);
      if (t) state.tasks = JSON.parse(t) || [];
    } catch(e) { state.tasks = []; }
    try {
      const s = localStorage.getItem(KEYS.settings);
      if (s) {
        const obj = JSON.parse(s);
        if (obj && typeof obj === 'object') {
          state.settings = Object.assign(state.settings, obj);
          state.view = state.settings.view || 'list';
        }
      }
    } catch(e) { /* keep defaults */ }
    try {
      const g = localStorage.getItem(KEYS.github);
      if (g) state.github = Object.assign(state.github, JSON.parse(g) || {});
    } catch(e) { /* keep defaults */ }
    try {
      const sn = localStorage.getItem(KEYS.snapshots);
      if (sn) state.snapshots = JSON.parse(sn) || [];
    } catch(e) { state.snapshots = []; }
    try {
      const ac = localStorage.getItem(KEYS.activity);
      if (ac) state.activity = JSON.parse(ac) || [];
    } catch(e) { state.activity = []; }
  }
  function saveKey(key) {
    try {
      const map = {
        [KEYS.tasks]: state.tasks,
        [KEYS.settings]: { ...state.settings, view: state.view },
        [KEYS.github]: state.github,
        [KEYS.snapshots]: state.snapshots,
        [KEYS.activity]: state.activity
      };
      localStorage.setItem(key, JSON.stringify(map[key]));
    } catch(e) {
      toast('保存に失敗しました: ' + (e && e.message ? e.message : e), 'error');
    }
  }

  /* ---------- ユーティリティ ---------- */
  function uuid() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    // fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function todayYMD() {
    const d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function parseYMD(s) {
    if (!s || typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const [y, m, d] = s.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    if (isNaN(dt.getTime())) return null;
    return dt;
  }
  function formatYMD(dt) {
    if (!dt) return '';
    return dt.getFullYear() + '-' + pad2(dt.getMonth() + 1) + '-' + pad2(dt.getDate());
  }
  function getMonday(d) {
    const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dow = dt.getDay(); // 0=Sun..6=Sat
    const diff = dow === 0 ? -6 : 1 - dow; // 月曜基準
    dt.setDate(dt.getDate() + diff);
    return dt;
  }
  function diffDays(a, b) {
    const A = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const B = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((B - A) / 86400000);
  }
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function debounce(fn, ms) {
    let t;
    return function() {
      const args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(ctx, args), ms);
    };
  }
  function downloadFile(filename, mime, content) {
    const blob = (content instanceof Blob) ? content : new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error || new Error('読み込み失敗'));
      r.readAsText(file, 'utf-8');
    });
  }
  function toast(msg, kind) {
    const bar = document.getElementById('pm-status-bar');
    if (!bar) return;
    bar.textContent = msg;
    bar.className = 'pm-status-bar pm-show' + (kind ? ' pm-' + kind : '');
    clearTimeout(bar._timer);
    bar._timer = setTimeout(() => { bar.className = 'pm-status-bar'; }, 3000);
  }

  /* ---------- アクティビティログ ---------- */
  function logActivity(action, details) {
    const entry = {
      time: new Date().toISOString(),
      action: action,
      details: details || ''
    };
    state.activity.unshift(entry);
    if (state.activity.length > ACTIVITY_CAP) state.activity.length = ACTIVITY_CAP;
    saveKey(KEYS.activity);
    renderActivityList();
  }
  function renderActivityList() {
    const ul = document.getElementById('pm-activity-list');
    if (!ul) return;
    if (state.activity.length === 0) {
      ul.innerHTML = '<li class="pm-empty" style="padding:1em">アクティビティなし</li>';
      return;
    }
    const html = state.activity.slice(0, 50).map(e => {
      const t = new Date(e.time);
      const ts = t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate()) +
        ' ' + pad2(t.getHours()) + ':' + pad2(t.getMinutes());
      return '<li><span class="pm-activity-time">' + escapeHtml(ts) + '</span><span class="pm-activity-text"><strong>' +
        escapeHtml(e.action) + '</strong> ' + escapeHtml(e.details) + '</span></li>';
    }).join('');
    ul.innerHTML = html;
  }
  function renderFormActivity(taskId) {
    const ul = document.getElementById('pm-form-activity');
    if (!ul) return;
    const events = state.activity.filter(e => e.details && e.details.indexOf(taskId) !== -1).slice(0, 20);
    if (events.length === 0) { ul.innerHTML = '<li style="color:var(--pm-muted)">履歴なし</li>'; return; }
    ul.innerHTML = events.map(e => {
      const t = new Date(e.time);
      const ts = pad2(t.getMonth() + 1) + '/' + pad2(t.getDate()) + ' ' + pad2(t.getHours()) + ':' + pad2(t.getMinutes());
      return '<li><time>' + escapeHtml(ts) + '</time>' + escapeHtml(e.action) + ' ' + escapeHtml(e.details.replace(taskId, '')) + '</li>';
    }).join('');
  }

  /* ---------- タスクCRUD ---------- */
  function nowISO() { return new Date().toISOString(); }
  function newTaskObject(data) {
    return {
      id: uuid(),
      title: (data.title || '').trim(),
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      assignee: data.assignee || '',
      startDate: data.startDate || '',
      dueDate: data.dueDate || '',
      progress: typeof data.progress === 'number' ? data.progress : 0,
      tags: Array.isArray(data.tags) ? data.tags.slice() : [],
      estimatedHours: typeof data.estimatedHours === 'number' ? data.estimatedHours : 0,
      actualHours: typeof data.actualHours === 'number' ? data.actualHours : 0,
      milestone: data.milestone || '',
      subtasks: Array.isArray(data.subtasks) ? data.subtasks.map(s => ({ text: s.text || '', done: !!s.done })) : [],
      predecessors: Array.isArray(data.predecessors) ? data.predecessors.slice() : [],
      githubIssueUrl: data.githubIssueUrl || '',
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
  }
  function addTask(data) {
    const task = newTaskObject(data);
    state.tasks.push(task);
    saveKey(KEYS.tasks);
    logActivity('タスク作成', task.id);
    return task;
  }
  function updateTask(id, data) {
    const idx = state.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const before = state.tasks[idx];
    const updated = Object.assign({}, before, data, { id: id, updatedAt: nowISO() });
    state.tasks[idx] = updated;
    saveKey(KEYS.tasks);
    logActivity('タスク更新', id);
    return updated;
  }
  function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    // 関連依存を除去
    state.tasks.forEach(t => {
      if (t.predecessors && t.predecessors.indexOf(id) !== -1) {
        t.predecessors = t.predecessors.filter(p => p !== id);
      }
    });
    state.selection.delete(id);
    saveKey(KEYS.tasks);
    logActivity('タスク削除', id);
  }
  function getTask(id) { return state.tasks.find(t => t.id === id) || null; }

  /* ---------- 循環依存検出 (DFS) ---------- */
  function detectCycle(fromId, toId) {
    // fromId → toId の依存を足したとき、toId → fromId の経路があれば循環
    if (fromId === toId) return true;
    const adj = {};
    state.tasks.forEach(t => {
      adj[t.id] = (t.predecessors || []).slice();
    });
    adj[fromId] = (adj[fromId] || []).concat([toId]);
    // fromId から到達可能なノードに toId 自身(toId が依存元)がないか確認
    const visited = new Set();
    function dfs(u) {
      if (visited.has(u)) return false;
      visited.add(u);
      if (u === fromId) return true;
      for (const v of (adj[u] || [])) {
        if (dfs(v)) return true;
      }
      return false;
    }
    // toId から predecessors を逆に辿り fromId に到達できるか
    const rev = {};
    Object.keys(adj).forEach(k => {
      (adj[k] || []).forEach(v => {
        if (!rev[v]) rev[v] = [];
        rev[v].push(k);
      });
    });
    // toId の predecessors 側から fromId に到達できるか = fromId が toId の predecessors 経由の祖先なら循環
    // 簡略化: fromId を new edge で toId に繋いだとき、fromId → ... → fromId のループを探す
    // すなわち adj の DFS で fromId から到達可能で fromId 自身に戻る経路があるか
    function dfs2(u) {
      if (u === fromId && visited2.size > 0) return true;
      if (visited2.has(u)) return false;
      visited2.add(u);
      for (const v of (adj[u] || [])) {
        if (dfs2(v)) return true;
      }
      return false;
    }
    const visited2 = new Set();
    return dfs2(toId);
  }

  /* ---------- 親進捗自動計算 (SPEC §4.2.11) ---------- */
  function autoProgressFromSubtasks(task) {
    if (!task.subtasks || task.subtasks.length === 0) return;
    const done = task.subtasks.filter(s => s.done).length;
    return Math.round((done / task.subtasks.length) * 100);
  }

  /* ---------- フィルタ・検索 ---------- */
  function getFilteredTasks() {
    const f = state.filters;
    const q = (f.search || '').trim().toLowerCase();
    return state.tasks.filter(t => {
      if (f.status && t.status !== f.status) return false;
      if (f.priority && t.priority !== f.priority) return false;
      if (f.assignee && t.assignee !== f.assignee) return false;
      if (f.milestone && t.milestone !== f.milestone) return false;
      if (q) {
        const hay = (t.title + ' ' + t.description + ' ' + t.assignee + ' ' + t.milestone + ' ' + (t.tags || []).join(' ')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }
  function refreshFilterOptions() {
    const assignees = new Set(), milestones = new Set();
    state.tasks.forEach(t => {
      if (t.assignee) assignees.add(t.assignee);
      if (t.milestone) milestones.add(t.milestone);
    });
    const aSel = document.getElementById('pm-filter-assignee');
    const mSel = document.getElementById('pm-filter-milestone');
    const aVal = state.filters.assignee;
    const mVal = state.filters.milestone;
    aSel.innerHTML = '<option value="">担当者: 全て</option>' +
      Array.from(assignees).sort().map(a => '<option value="' + escapeHtml(a) + '"' +
      (a === aVal ? ' selected' : '') + '>' + escapeHtml(a) + '</option>').join('');
    mSel.innerHTML = '<option value="">マイルストーン: 全て</option>' +
      Array.from(milestones).sort().map(m => '<option value="' + escapeHtml(m) + '"' +
      (m === mVal ? ' selected' : '') + '>' + escapeHtml(m) + '</option>').join('');
  }

  /* ---------- ソート ---------- */
  function sortTasks(arr) {
    const { field, dir } = state.sort;
    if (!field) return arr;
    const sign = dir === 'desc' ? -1 : 1;
    return arr.slice().sort((a, b) => {
      const av = a[field], bv = b[field];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sign;
      return String(av).localeCompare(String(bv), 'ja') * sign;
    });
  }

  /* ============================================================
     ビュー描画
     ============================================================ */

  /* ---------- リストビュー ---------- */
  function renderList() {
    const el = document.getElementById('pm-view-list');
    let tasks = sortTasks(getFilteredTasks());
    if (tasks.length === 0) {
      el.innerHTML = '<div class="pm-empty">タスクがありません。「+ 新規タスク」から追加してください。</div>';
      return;
    }
    const head = ['__check', 'title', 'status', 'priority', 'assignee', 'startDate', 'dueDate', 'progress', '__actions'];
    const labels = {
      title: 'タイトル', status: 'ステータス', priority: '優先度',
      assignee: '担当者', startDate: '開始日', dueDate: '締切日', progress: '進捗'
    };
    const sf = state.sort.field, sd = state.sort.dir;
    const sortMark = (f) => f === sf ? (sd === 'desc' ? 'pm-sort-desc' : 'pm-sort-asc') : '';
    let html = '<div style="overflow-x:auto"><table class="pm-table"><thead><tr>';
    head.forEach(h => {
      if (h === '__check') html += '<th style="width:32px"><input type="checkbox" id="pm-check-all"></th>';
      else if (h === '__actions') html += '<th style="width:80px">操作</th>';
      else html += '<th class="pm-sortable ' + sortMark(h) + '" data-sort="' + h + '">' + labels[h] + '</th>';
    });
    html += '</tr></thead><tbody>';
    tasks.forEach(t => {
      const checked = state.selection.has(t.id) ? ' checked' : '';
      html += '<tr data-id="' + escapeHtml(t.id) + '">';
      html += '<td><input type="checkbox" class="pm-row-check" data-id="' + escapeHtml(t.id) + '"' + checked + '></td>';
      html += '<td class="pm-title-cell" data-id="' + escapeHtml(t.id) + '">' + escapeHtml(t.title) + '</td>';
      html += '<td><span class="pm-status-badge pm-status-' + t.status + '">' + STATUS_LABEL[t.status] + '</span></td>';
      html += '<td><span class="pm-priority pm-priority-' + t.priority + '">' + PRIORITY_LABEL[t.priority] + '</span></td>';
      html += '<td>' + escapeHtml(t.assignee || '-') + '</td>';
      html += '<td>' + escapeHtml(t.startDate || '-') + '</td>';
      html += '<td>' + escapeHtml(t.dueDate || '-') + '</td>';
      html += '<td><div class="pm-progress-bar"><div class="pm-progress-fill" style="width:' + t.progress + '%"></div></div><span class="pm-progress-text">' + t.progress + '%</span></td>';
      html += '<td><button class="pm-btn small secondary pm-edit-btn" data-id="' + escapeHtml(t.id) + '">編集</button> <button class="pm-btn small danger pm-del-btn" data-id="' + escapeHtml(t.id) + '">削除</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    el.innerHTML = html;
    bindListEvents();
  }
  function bindListEvents() {
    document.querySelectorAll('#pm-view-list .pm-title-cell').forEach(c => {
      c.addEventListener('click', () => openTaskModal(c.dataset.id));
    });
    document.querySelectorAll('#pm-view-list .pm-edit-btn').forEach(b => {
      b.addEventListener('click', e => { e.stopPropagation(); openTaskModal(b.dataset.id); });
    });
    document.querySelectorAll('#pm-view-list .pm-del-btn').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        confirmDialog('タスク削除', 'このタスクを削除しますか?', () => {
          deleteTask(b.dataset.id);
          renderAll();
          refreshBulkBar();
        });
      });
    });
    const ca = document.getElementById('pm-check-all');
    if (ca) {
      ca.addEventListener('change', () => {
        if (ca.checked) {
          getFilteredTasks().forEach(t => state.selection.add(t.id));
        } else {
          state.selection.clear();
        }
        renderList();
        refreshBulkBar();
      });
    }
    document.querySelectorAll('#pm-view-list .pm-row-check').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) state.selection.add(cb.dataset.id);
        else state.selection.delete(cb.dataset.id);
        refreshBulkBar();
      });
    });
    document.querySelectorAll('#pm-view-list th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const f = th.dataset.sort;
        if (state.sort.field === f) {
          state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sort.field = f; state.sort.dir = 'asc';
        }
        renderList();
      });
    });
  }

  /* ---------- ガントチャート ---------- */
  function renderGantt() {
    const el = document.getElementById('pm-view-gantt');
    let tasks = getFilteredTasks();
    if (tasks.length === 0) {
      el.innerHTML = '<div class="pm-empty">表示可能なタスクがありません。日付 (開始日/締切日) を設定してください。</div>';
      return;
    }
    // 期間決定: 全タスク + 今日のうち最古の月曜 〜 最大締切 + 4週
    const today = new Date();
    const dates = [];
    tasks.forEach(t => {
      if (t.startDate) { const d = parseYMD(t.startDate); if (d) dates.push(d); }
      if (t.dueDate)   { const d = parseYMD(t.dueDate);   if (d) dates.push(d); }
    });
    dates.push(today);
    let startMonday = getMonday(new Date(Math.min.apply(null, dates.map(d => d.getTime()))));
    let maxDate = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
    let endMonday = getMonday(new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 28));
    const totalDays = diffDays(startMonday, endMonday) + 7;
    const dayWidth = 24; // px
    const totalWidth = totalDays * dayWidth;
    const headerWeeks = [];
    const cur = new Date(startMonday);
    while (cur <= endMonday) {
      headerWeeks.push(new Date(cur));
      cur.setDate(cur.getDate() + 7);
    }
    const weekCount = headerWeeks.length;
    const todayDayOffset = diffDays(startMonday, today);

    // ヘッダー: 上段=月、下段=週
    let monthHeader = '';
    let weekHeader = '';
    let prevMonth = -1;
    headerWeeks.forEach((w, i) => {
      const m = w.getMonth();
      if (m !== prevMonth) {
        prevMonth = m;
        const monthName = (w.getMonth() + 1) + '月';
        monthHeader += '<div class="pm-gantt-month" style="grid-column: span 1;">' + escapeHtml(monthName) + '</div>';
      } else {
        monthHeader += '<div class="pm-gantt-month"></div>';
      }
      const isCurrent = w <= today && diffDays(w, today) < 7;
      weekHeader += '<div class="pm-gantt-week' + (isCurrent ? ' pm-current' : '') + '">' +
        (w.getMonth() + 1) + '/' + w.getDate() + '</div>';
    });

    // ソート: startDate → title
    tasks = tasks.slice().sort((a, b) => {
      const ad = a.startDate || '9999-99-99';
      const bd = b.startDate || '9999-99-99';
      if (ad !== bd) return ad < bd ? -1 : 1;
      return (a.title || '').localeCompare(b.title || '');
    });

    const labelColWidth = 200;
    const gridLeft = labelColWidth;

    // グリッド背景 (rows)
    let rowsHtml = '';
    let svgPaths = '';
    const rowHeight = 36;

    // SVG 矢印マーカー
    const svgHeader = '<svg class="pm-gantt-svg" width="' + totalWidth + '" height="' + (tasks.length * rowHeight) +
      '" style="left:' + gridLeft + 'px"><defs><marker id="pm-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="currentColor" style="fill:var(--pm-accent)"/></marker></defs>';

    tasks.forEach((t, idx) => {
      const sd = parseYMD(t.startDate);
      const dd = parseYMD(t.dueDate);
      const milestone = !!(t.milestone && t.milestone.trim());
      let barHtml = '';
      if (sd) {
        const offset = diffDays(startMonday, sd) * dayWidth;
        let widthDays = 1;
        if (dd && dd >= sd) widthDays = diffDays(sd, dd) + 1;
        else if (!dd) widthDays = 7;
        const width = Math.max(dayWidth, widthDays * dayWidth);
        const label = (t.title || '').slice(0, 30) + (t.progress > 0 ? ' (' + t.progress + '%)' : '');
        barHtml += '<div class="pm-gantt-bar priority-' + t.priority + '" data-id="' + escapeHtml(t.id) +
          '" style="left:' + gridLeft + 'px; margin-left:' + offset + 'px; width:' + width + 'px" title="' +
          escapeHtml(t.title) + '">' + escapeHtml(label) + '</div>';
      }
      if (milestone && dd) {
        const offset = diffDays(startMonday, dd) * dayWidth;
        barHtml += '<div class="pm-gantt-milestone" data-id="' + escapeHtml(t.id) +
          '" style="left:' + (gridLeft + offset) + 'px" title="マイルストーン: ' + escapeHtml(t.milestone) + '"></div>';
      }
      // 依存矢印
      (t.predecessors || []).forEach(pid => {
        const pred = getTask(pid);
        if (!pred) return;
        const pd = parseYMD(pred.dueDate) || parseYMD(pred.startDate);
        const myStart = sd || dd;
        if (!pd || !myStart) return;
        const predRow = tasks.findIndex(x => x.id === pid);
        const myRow = idx;
        if (predRow === -1) return;
        const x1 = gridLeft + diffDays(startMonday, pd) * dayWidth + dayWidth; // 矢印開始
        const y1 = predRow * rowHeight + rowHeight / 2;
        const x2 = gridLeft + diffDays(startMonday, myStart) * dayWidth;
        const y2 = myRow * rowHeight + rowHeight / 2;
        const midX = Math.max(x1, x2) + 8;
        svgPaths += '<path d="M' + x1 + ',' + y1 + ' C' + midX + ',' + y1 + ' ' + midX + ',' + y2 + ' ' + x2 + ',' + y2 + '"/>';
      });
      rowsHtml += '<div class="pm-gantt-row" style="height:' + rowHeight + 'px">' +
        '<div class="pm-gantt-row-label" data-id="' + escapeHtml(t.id) + '" title="' + escapeHtml(t.title) + '">' +
        escapeHtml(t.title) + '</div>' + barHtml + '</div>';
    });

    const todayLine = (todayDayOffset >= 0 && todayDayOffset <= totalDays)
      ? '<div class="pm-gantt-today" style="left:' + (gridLeft + todayDayOffset * dayWidth) + 'px; height:' + (tasks.length * rowHeight) + 'px"></div>'
      : '';

    const gridBg = '<div class="pm-gantt-grid-bg" style="left:' + gridLeft + 'px; grid-template-columns: repeat(' + totalDays + ', ' + dayWidth + 'px);">' +
      Array.from({ length: totalDays }, () => '<div class="pm-gantt-grid-cell"></div>').join('') + '</div>';

    const html = '<div class="pm-gantt-wrapper"><div class="pm-gantt" style="width:' + (gridLeft + totalWidth) + 'px">' +
      '<div class="pm-gantt-header" style="grid-template-columns: ' + labelColWidth + 'px repeat(' + weekCount + ', ' + (dayWidth * 7) + 'px)">' +
      '<div class="pm-gantt-month" style="grid-column: 1">タスク</div>' + monthHeader + '</div>' +
      '<div class="pm-gantt-header" style="grid-template-columns: ' + labelColWidth + 'px repeat(' + weekCount + ', ' + (dayWidth * 7) + 'px)">' +
      '<div class="pm-gantt-week">週</div>' + weekHeader + '</div>' +
      '<div class="pm-gantt-body">' + gridBg + rowsHtml + svgHeader + svgPaths + '</svg>' + todayLine + '</div>' +
      '</div></div>';

    el.innerHTML = html;
    el.querySelectorAll('.pm-gantt-bar, .pm-gantt-milestone, .pm-gantt-row-label').forEach(e => {
      e.addEventListener('click', () => openTaskModal(e.dataset.id));
    });
  }

  /* ---------- 看板ビュー ---------- */
  function renderKanban() {
    const el = document.getElementById('pm-view-kanban');
    const tasks = getFilteredTasks();
    const cols = ['todo', 'doing', 'done'];
    let html = '<div class="pm-kanban">';
    cols.forEach(s => {
      const list = tasks.filter(t => t.status === s);
      html += '<div class="pm-kanban-col" data-status="' + s + '">' +
        '<div class="pm-kanban-col-header"><span>' + STATUS_LABEL[s] + '</span><span class="pm-kanban-col-count">' + list.length + '</span></div>' +
        '<div class="pm-kanban-list" data-status="' + s + '">';
      if (list.length === 0) {
        html += '<div class="pm-empty" style="padding:1em;font-size:0.85em">タスクなし</div>';
      }
      list.forEach(t => {
        const dueClass = (t.dueDate && t.dueDate < todayYMD() && t.status !== 'done') ? ' pm-overdue' : '';
        html += '<div class="pm-kanban-card" draggable="true" data-id="' + escapeHtml(t.id) + '">' +
          '<div class="pm-kanban-card-title">' + escapeHtml(t.title) + '</div>' +
          '<div class="pm-kanban-card-meta">' +
            '<span class="pm-priority pm-priority-' + t.priority + '">' + PRIORITY_LABEL[t.priority] + '</span>' +
            (t.assignee ? '<span class="pm-tag">' + escapeHtml(t.assignee) + '</span>' : '') +
            (t.progress > 0 ? '<span class="pm-progress-text">(' + t.progress + '%)</span>' : '') +
          '</div>' +
          (t.dueDate ? '<div class="pm-kanban-card-due' + dueClass + '">締切: ' + escapeHtml(t.dueDate) + '</div>' : '') +
        '</div>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    bindKanbanDnD();
  }
  function bindKanbanDnD() {
    const cards = document.querySelectorAll('#pm-view-kanban .pm-kanban-card');
    cards.forEach(card => {
      card.addEventListener('dragstart', e => {
        card.classList.add('pm-dragging');
        e.dataTransfer.setData('text/plain', card.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
      });
      card.addEventListener('dragend', () => card.classList.remove('pm-dragging'));
      card.addEventListener('click', () => openTaskModal(card.dataset.id));
    });
    document.querySelectorAll('#pm-view-kanban .pm-kanban-col').forEach(col => {
      col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('pm-drag-over'); });
      col.addEventListener('dragleave', () => col.classList.remove('pm-drag-over'));
      col.addEventListener('drop', e => {
        e.preventDefault();
        col.classList.remove('pm-drag-over');
        const id = e.dataTransfer.getData('text/plain');
        if (!id) return;
        const newStatus = col.dataset.status;
        const t = getTask(id);
        if (!t || t.status === newStatus) return;
        const oldStatus = t.status;
        updateTask(id, { status: newStatus });
        logActivity('ステータス変更', id + ': ' + oldStatus + ' → ' + newStatus);
        renderAll();
      });
    });
  }

  /* ---------- カレンダービュー ---------- */
  function renderCalendar() {
    const el = document.getElementById('pm-view-calendar');
    const tasks = getFilteredTasks();
    if (!state.calendarMonth) {
      const d = new Date();
      state.calendarMonth = { year: d.getFullYear(), month: d.getMonth() };
    }
    const { year, month } = state.calendarMonth;
    const firstDow = new Date(year, month, 1).getDay();
    // 月曜起点: 日曜=0 → 6, 月曜=1 → 0
    const offset = (firstDow + 6) % 7;
    const startDate = new Date(year, month, 1 - offset);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      cells.push(d);
    }
    const today = todayYMD();
    const weekdays = ['月', '火', '水', '木', '金', '土', '日'];
    let html = '<div class="pm-cal-header">' +
      '<h3>' + year + '年 ' + (month + 1) + '月</h3>' +
      '<div class="pm-cal-nav">' +
        '<button type="button" class="pm-btn small secondary" id="pm-cal-prev">← 前月</button>' +
        '<button type="button" class="pm-btn small secondary" id="pm-cal-today">今日</button>' +
        '<button type="button" class="pm-btn small secondary" id="pm-cal-next">翌月 →</button>' +
      '</div></div>';
    html += '<div class="pm-cal-grid">';
    weekdays.forEach(w => { html += '<div class="pm-cal-weekday">' + w + '</div>'; });
    cells.forEach(d => {
      const ymd = formatYMD(d);
      const isOther = d.getMonth() !== month;
      const isToday = ymd === today;
      const dayTasks = tasks.filter(t => t.startDate && t.dueDate && t.startDate <= ymd && ymd <= t.dueDate);
      html += '<div class="pm-cal-day' + (isOther ? ' pm-other-month' : '') + (isToday ? ' pm-today' : '') + '" data-ymd="' + ymd + '">' +
        '<div class="pm-cal-day-num">' + d.getDate() + '</div>' +
        '<div class="pm-cal-day-dots">';
      dayTasks.slice(0, 12).forEach(t => {
        html += '<span class="pm-cal-dot priority-' + t.priority + '" data-id="' + escapeHtml(t.id) + '" title="' +
          escapeHtml(t.title) + '"></span>';
      });
      if (dayTasks.length > 12) html += '<span>+' + (dayTasks.length - 12) + '</span>';
      html += '</div></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    document.getElementById('pm-cal-prev').addEventListener('click', () => {
      state.calendarMonth.month--;
      if (state.calendarMonth.month < 0) { state.calendarMonth.month = 11; state.calendarMonth.year--; }
      renderCalendar();
    });
    document.getElementById('pm-cal-next').addEventListener('click', () => {
      state.calendarMonth.month++;
      if (state.calendarMonth.month > 11) { state.calendarMonth.month = 0; state.calendarMonth.year++; }
      renderCalendar();
    });
    document.getElementById('pm-cal-today').addEventListener('click', () => {
      const d = new Date();
      state.calendarMonth = { year: d.getFullYear(), month: d.getMonth() };
      renderCalendar();
    });
    el.querySelectorAll('.pm-cal-dot').forEach(dot => {
      dot.addEventListener('click', e => { e.stopPropagation(); openTaskModal(dot.dataset.id); });
    });
    el.querySelectorAll('.pm-cal-day').forEach(cell => {
      cell.addEventListener('click', e => {
        if (e.target.classList.contains('pm-cal-dot')) return;
        openTaskModal(null, { startDate: cell.dataset.ymd, dueDate: cell.dataset.ymd });
      });
    });
  }

  /* ---------- ビュー切替 ---------- */
  function switchView(view) {
    state.view = view;
    state.settings.view = view;
    saveKey(KEYS.settings);
    document.querySelectorAll('.pm-tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
    ['list', 'gantt', 'kanban', 'calendar'].forEach(v => {
      document.getElementById('pm-view-' + v).style.display = (v === view) ? 'block' : 'none';
    });
    renderActive();
  }
  function renderActive() {
    refreshFilterOptions();
    if (state.view === 'list') renderList();
    else if (state.view === 'gantt') renderGantt();
    else if (state.view === 'kanban') renderKanban();
    else if (state.view === 'calendar') renderCalendar();
  }
  function renderAll() {
    renderActive();
    renderSnapshotList();
  }

  /* ============================================================
     モーダル・フォーム
     ============================================================ */
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'flex';
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'none';
  }
  function openTaskModal(taskId, prefill) {
    const t = taskId ? getTask(taskId) : null;
    const isEdit = !!t;
    document.getElementById('pm-modal-title').textContent = isEdit ? 'タスク編集' : '新規タスク';
    document.getElementById('pm-task-id').value = t ? t.id : '';
    document.getElementById('pm-title').value = t ? t.title : (prefill && prefill.title || '');
    document.getElementById('pm-description').value = t ? t.description : '';
    document.getElementById('pm-status').value = t ? t.status : 'todo';
    document.getElementById('pm-priority').value = t ? t.priority : 'medium';
    document.getElementById('pm-assignee').value = t ? t.assignee : '';
    document.getElementById('pm-milestone').value = t ? t.milestone : '';
    document.getElementById('pm-start-date').value = t ? t.startDate : (prefill ? prefill.startDate || '' : '');
    document.getElementById('pm-due-date').value = t ? t.dueDate : (prefill ? prefill.dueDate || '' : '');
    document.getElementById('pm-estimated-hours').value = t ? t.estimatedHours : 0;
    document.getElementById('pm-actual-hours').value = t ? t.actualHours : 0;
    document.getElementById('pm-progress').value = t ? t.progress : 0;
    document.getElementById('pm-progress-display').textContent = t ? t.progress : 0;
    document.getElementById('pm-tags').value = t ? (t.tags || []).join(', ') : '';
    // サブタスク
    renderSubtaskEditor(t ? t.subtasks : []);
    // 依存タスク
    renderPredecessorsSelect(t ? t.predecessors : [], t ? t.id : null);
    // GitHub Issue
    const ghRow = document.getElementById('pm-github-row');
    const ghLink = document.getElementById('pm-github-link');
    if (isEdit && t.githubIssueUrl) {
      ghRow.style.display = 'block';
      ghLink.href = t.githubIssueUrl;
      ghLink.textContent = t.githubIssueUrl;
    } else {
      ghRow.style.display = 'none';
    }
    // アクティビティ履歴
    const actRow = document.getElementById('pm-activity-row');
    if (isEdit) {
      actRow.style.display = 'block';
      renderFormActivity(t.id);
    } else {
      actRow.style.display = 'none';
    }
    // 削除ボタン
    document.getElementById('pm-form-delete').style.display = isEdit ? 'inline-block' : 'none';
    document.getElementById('pm-cycle-warning').style.display = 'none';
    openModal('pm-modal');
    setTimeout(() => document.getElementById('pm-title').focus(), 50);
  }
  function renderSubtaskEditor(subs) {
    const list = document.getElementById('pm-subtask-list');
    list.innerHTML = '';
    (subs || []).forEach(s => addSubtaskRow(s.text, s.done));
  }
  function addSubtaskRow(text, done) {
    const list = document.getElementById('pm-subtask-list');
    const row = document.createElement('div');
    row.className = 'pm-subtask-row';
    row.innerHTML = '<input type="checkbox" class="pm-subtask-done" ' + (done ? 'checked' : '') + '>' +
      '<input type="text" class="pm-subtask-text" value="' + escapeHtml(text || '') + '" placeholder="サブタスク内容">' +
      '<button type="button" class="pm-btn small danger pm-subtask-remove">×</button>';
    list.appendChild(row);
    row.querySelector('.pm-subtask-remove').addEventListener('click', () => row.remove());
    row.querySelector('.pm-subtask-done').addEventListener('change', updateAutoProgress);
  }
  function updateAutoProgress() {
    const rows = document.querySelectorAll('#pm-subtask-list .pm-subtask-row');
    if (rows.length === 0) return;
    const done = document.querySelectorAll('#pm-subtask-list .pm-subtask-done:checked').length;
    const pct = Math.round((done / rows.length) * 100);
    document.getElementById('pm-progress').value = pct;
    document.getElementById('pm-progress-display').textContent = pct;
  }
  function readSubtasks() {
    const rows = document.querySelectorAll('#pm-subtask-list .pm-subtask-row');
    const out = [];
    rows.forEach(r => {
      const text = r.querySelector('.pm-subtask-text').value.trim();
      const done = r.querySelector('.pm-subtask-done').checked;
      if (text) out.push({ text: text, done: done });
    });
    return out;
  }
  function renderPredecessorsSelect(selected, selfId) {
    const sel = document.getElementById('pm-predecessors');
    const selArr = Array.isArray(selected) ? selected : [];
    sel.innerHTML = state.tasks
      .filter(t => t.id !== selfId)
      .map(t => {
        const s = selArr.indexOf(t.id) !== -1 ? ' selected' : '';
        return '<option value="' + escapeHtml(t.id) + '"' + s + '>' + escapeHtml(t.title) + '</option>';
      }).join('');
  }
  function readPredecessors() {
    const sel = document.getElementById('pm-predecessors');
    return Array.from(sel.selectedOptions).map(o => o.value);
  }

  function closeTaskModal() { closeModal('pm-modal'); }
  function confirmDialog(title, message, onOk) {
    document.getElementById('pm-confirm-title').textContent = title;
    document.getElementById('pm-confirm-message').textContent = message;
    const ok = document.getElementById('pm-confirm-ok');
    const handler = () => { onOk(); ok.removeEventListener('click', handler); closeModal('pm-confirm'); };
    ok.addEventListener('click', handler);
    openModal('pm-confirm');
  }

  function submitTaskForm(e) {
    e.preventDefault();
    const id = document.getElementById('pm-task-id').value;
    const title = document.getElementById('pm-title').value.trim();
    if (!title) { toast('タイトルは必須です', 'error'); return; }
    const subtasks = readSubtasks();
    let progress = parseInt(document.getElementById('pm-progress').value, 10) || 0;
    if (subtasks.length > 0) {
      // サブタスクがあれば自動計算で上書き
      const done = subtasks.filter(s => s.done).length;
      progress = Math.round((done / subtasks.length) * 100);
    }
    const tagsRaw = document.getElementById('pm-tags').value;
    const tags = tagsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const data = {
      title: title,
      description: document.getElementById('pm-description').value,
      status: document.getElementById('pm-status').value,
      priority: document.getElementById('pm-priority').value,
      assignee: document.getElementById('pm-assignee').value.trim(),
      milestone: document.getElementById('pm-milestone').value.trim(),
      startDate: document.getElementById('pm-start-date').value,
      dueDate: document.getElementById('pm-due-date').value,
      estimatedHours: parseFloat(document.getElementById('pm-estimated-hours').value) || 0,
      actualHours: parseFloat(document.getElementById('pm-actual-hours').value) || 0,
      progress: progress,
      tags: tags,
      subtasks: subtasks,
      predecessors: readPredecessors()
    };
    // 日付整合性
    if (data.startDate && data.dueDate && data.startDate > data.dueDate) {
      toast('開始日が締切日より後です', 'error'); return;
    }
    // 循環依存チェック
    if (id) {
      const newPreds = data.predecessors;
      for (const p of newPreds) {
        if (detectCycle(id, p)) {
          toast('循環依存となるため追加できません: ' + p, 'error');
          return;
        }
      }
    }
    if (id) {
      updateTask(id, data);
    } else {
      addTask(data);
    }
    closeTaskModal();
    renderAll();
    refreshFilterOptions();
    toast(id ? 'タスクを更新しました' : 'タスクを追加しました');
  }

  /* ============================================================
     エクスポート / インポート (SPEC §4.1.7, §4.1.8, §8.5)
     ============================================================ */
  function exportJSON() {
    const data = JSON.stringify({ version: 1, exportedAt: nowISO(), tasks: state.tasks }, null, 2);
    downloadFile('rui-pm-' + todayYMD() + '.json', 'application/json', data);
    toast('JSON を出力しました');
  }
  function csvEscape(v) {
    if (v == null) return '';
    const s = String(v);
    if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }
  function exportCSV() {
    const fields = ['id','title','description','status','priority','assignee','startDate','dueDate',
      'progress','estimatedHours','actualHours','milestone','tags','subtasks','predecessors','githubIssueUrl','createdAt','updatedAt'];
    const header = fields.join(',');
    const rows = state.tasks.map(t => {
      const sub = (t.subtasks || []).map(s => (s.done ? '[x]' : '[ ]') + ' ' + s.text).join(' | ');
      const preds = (t.predecessors || []).join(';');
      const tags = (t.tags || []).join(';');
      return [
        t.id, t.title, t.description, t.status, t.priority, t.assignee,
        t.startDate, t.dueDate, t.progress, t.estimatedHours, t.actualHours,
        t.milestone, tags, sub, preds, t.githubIssueUrl, t.createdAt, t.updatedAt
      ].map(csvEscape).join(',');
    });
    const csv = '\uFEFF' + header + '\n' + rows.join('\n');
    downloadFile('rui-pm-' + todayYMD() + '.csv', 'text/csv;charset=utf-8', csv);
    toast('CSV を出力しました');
  }
  function parseCSVLine(line) {
    const out = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i+1] === '"') { cur += '"'; i++; }
        else if (c === '"') { inQ = false; }
        else cur += c;
      } else {
        if (c === ',') { out.push(cur); cur = ''; }
        else if (c === '"') { inQ = true; }
        else cur += c;
      }
    }
    out.push(cur);
    return out;
  }
  function csvToTask(headers, row) {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] != null ? row[i] : ''; });
    const task = newTaskObject({
      title: obj.title || '(無題)',
      description: obj.description || '',
      status: ['todo','doing','done'].indexOf(obj.status) !== -1 ? obj.status : 'todo',
      priority: ['high','medium','low'].indexOf(obj.priority) !== -1 ? obj.priority : 'medium',
      assignee: obj.assignee || '',
      startDate: obj.startDate || '',
      dueDate: obj.dueDate || '',
      progress: parseInt(obj.progress, 10) || 0,
      estimatedHours: parseFloat(obj.estimatedHours) || 0,
      actualHours: parseFloat(obj.actualHours) || 0,
      milestone: obj.milestone || '',
      tags: obj.tags ? obj.tags.split(';').filter(Boolean) : [],
      subtasks: obj.subtasks ? obj.subtasks.split(' | ').map(s => {
        const m = /^\[( |x)\]\s*(.*)$/.exec(s);
        return m ? { text: m[2], done: m[1] === 'x' } : { text: s, done: false };
      }).filter(s => s.text) : [],
      predecessors: obj.predecessors ? obj.predecessors.split(';').filter(Boolean) : [],
      githubIssueUrl: obj.githubIssueUrl || ''
    });
    task.id = obj.id || task.id;
    task.createdAt = obj.createdAt || task.createdAt;
    task.updatedAt = obj.updatedAt || task.updatedAt;
    return task;
  }
  function importJSONData(jsonText) {
    let parsed;
    try { parsed = JSON.parse(jsonText); } catch(e) { toast('JSONパース失敗: ' + e.message, 'error'); return; }
    const tasks = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.tasks) ? parsed.tasks : null);
    if (!tasks) { toast('タスク配列が見つかりません', 'error'); return; }
    showImportConflictDialog(tasks, 'json');
  }
  function importCSVData(text) {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.length > 0);
    if (lines.length < 2) { toast('CSVが空です', 'error'); return; }
    const headers = parseCSVLine(lines[0]);
    const tasks = lines.slice(1).map(l => csvToTask(headers, parseCSVLine(l)));
    showImportConflictDialog(tasks, 'csv');
  }
  function showImportConflictDialog(incoming, kind) {
    const conflicts = incoming.filter(t => state.tasks.some(x => x.id === t.id));
    const body = document.getElementById('pm-import-body');
    if (incoming.length === 0) { body.innerHTML = '<p>読み込み可能なタスクがありません。</p>'; openModal('pm-import-modal'); return; }
    let html = '<p>読み込み: ' + incoming.length + '件 / 既存とID重複: ' + conflicts.length + '件</p>';
    if (conflicts.length > 0) {
      html += '<div class="pm-import-conflicts">' +
        '<h4>重複処理</h4>' +
        '<label><input type="radio" name="pm-imp-conflict" value="overwrite" checked> 上書き (既存タスクを置換)</label>' +
        '<label><input type="radio" name="pm-imp-conflict" value="skip"> スキップ (重複は無視)</label>' +
        '<label><input type="radio" name="pm-imp-conflict" value="keep-both"> 両方残す (重複分は新IDで追加)</label>' +
      '</div>';
    }
    html += '<div class="pm-form-actions">' +
      '<button type="button" class="pm-btn secondary" data-close>キャンセル</button>' +
      '<button type="button" class="pm-btn primary" id="pm-import-exec">インポート実行</button>' +
    '</div>';
    body.innerHTML = html;
    openModal('pm-import-modal');
    document.getElementById('pm-import-exec').addEventListener('click', () => {
      const mode = (document.querySelector('input[name="pm-imp-conflict]:checked') || { value: 'overwrite' }).value;
      let added = 0, replaced = 0, skipped = 0;
      incoming.forEach(t => {
        const idx = state.tasks.findIndex(x => x.id === t.id);
        if (idx === -1) { state.tasks.push(t); added++; }
        else if (mode === 'overwrite') { state.tasks[idx] = t; replaced++; }
        else if (mode === 'skip') { skipped++; }
        else if (mode === 'keep-both') { t.id = uuid(); state.tasks.push(t); added++; }
      });
      saveKey(KEYS.tasks);
      logActivity('インポート', '追加 ' + added + ' / 上書 ' + replaced + ' / スキップ ' + skipped);
      renderAll();
      closeModal('pm-import-modal');
      toast('インポート完了: +' + added + ' / =' + replaced + ' / -' + skipped);
    });
  }

  /* ============================================================
     GitHub Issue連携 (SPEC §4.2.10, §8.3)
     ============================================================ */
  async function createGithubIssue(task) {
    if (!state.github.token) { toast('GitHubトークンが未設定です', 'error'); return null; }
    if (!state.github.repo || state.github.repo.indexOf('/') === -1) { toast('リポジトリが未設定 (owner/repo 形式)', 'error'); return null; }
    const body = (task.description || '') +
      '\n\n---\n*このIssueは「プロジェクト管理 (MiniMax m3)」から自動作成されました。*\n' +
      '*タスクID: `' + task.id + '`*\n' +
      '*優先度: ' + PRIORITY_LABEL[task.priority] + ' / ステータス: ' + STATUS_LABEL[task.status] + '*\n' +
      (task.startDate ? '*開始: ' + task.startDate + '*\n' : '') +
      (task.dueDate ? '*締切: ' + task.dueDate + '*\n' : '') +
      (task.assignee ? '*担当: ' + task.assignee + '*\n' : '') +
      (task.estimatedHours ? '*予定工数: ' + task.estimatedHours + 'h*\n' : '') +
      (task.tags && task.tags.length ? '*タグ: ' + task.tags.map(t => '`' + t + '`').join(' ') + '*\n' : '');
    try {
      const res = await fetch('https://api.github.com/repos/' + encodeURIComponent(state.github.repo) + '/issues', {
        method: 'POST',
        headers: {
          'Authorization': 'token ' + state.github.token,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: task.title, body: body, labels: ['pm-task', task.priority] })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error('HTTP ' + res.status + ': ' + (err.message || res.statusText));
      }
      const json = await res.json();
      return json.html_url;
    } catch(e) {
      toast('GitHub Issue作成失敗: ' + e.message, 'error');
      return null;
    }
  }

  /* ============================================================
     一括操作 (SPEC §4.2.13)
     ============================================================ */
  function refreshBulkBar() {
    const bar = document.getElementById('pm-bulk-bar');
    const count = state.selection.size;
    bar.style.display = count > 0 ? 'flex' : 'none';
    document.getElementById('pm-bulk-count').textContent = count + '件選択中';
  }
  function bulkUpdateStatus(status) {
    const ids = Array.from(state.selection);
    ids.forEach(id => { const t = getTask(id); if (t) updateTask(id, { status: status }); });
    logActivity('一括ステータス変更', ids.length + '件 → ' + status);
    state.selection.clear();
    renderAll();
    refreshBulkBar();
    toast(ids.length + '件を更新しました');
  }
  function bulkDelete() {
    const ids = Array.from(state.selection);
    if (ids.length === 0) return;
    confirmDialog('一括削除', ids.length + '件のタスクを削除しますか?', () => {
      ids.forEach(id => deleteTask(id));
      state.selection.clear();
      renderAll();
      refreshBulkBar();
      toast(ids.length + '件を削除しました');
    });
  }
  async function bulkCreateGithubIssues() {
    const ids = Array.from(state.selection);
    if (ids.length === 0) return;
    if (!state.github.token || !state.github.repo) {
      toast('設定パネルでGitHubトークンとリポジトリを入力してください', 'warn');
      document.getElementById('pm-settings-panel').style.display = 'block';
      return;
    }
    toast('GitHub Issue作成中... ' + ids.length + '件');
    let ok = 0, ng = 0;
    for (const id of ids) {
      const t = getTask(id);
      if (!t) continue;
      const url = await createGithubIssue(t);
      if (url) { updateTask(id, { githubIssueUrl: url }); ok++; }
      else ng++;
    }
    state.selection.clear();
    renderAll();
    refreshBulkBar();
    toast('完了: 成功 ' + ok + ' / 失敗 ' + ng);
  }

  /* ============================================================
     スナップショット (SPEC §4.2.15)
     ============================================================ */
  function saveSnapshot(name) {
    const snap = {
      id: uuid(),
      name: name || ('Snapshot ' + new Date().toLocaleString('ja-JP')),
      createdAt: nowISO(),
      tasks: JSON.parse(JSON.stringify(state.tasks))
    };
    state.snapshots.unshift(snap);
    saveKey(KEYS.snapshots);
    logActivity('スナップショット保存', snap.name);
    renderSnapshotList();
    toast('スナップショットを保存しました');
  }
  function loadSnapshot(id) {
    const s = state.snapshots.find(x => x.id === id);
    if (!s) return;
    confirmDialog('スナップショット復元', '「' + s.name + '」を復元しますか?\n現在のタスクは失われます。', () => {
      state.tasks = JSON.parse(JSON.stringify(s.tasks));
      saveKey(KEYS.tasks);
      logActivity('スナップショット復元', s.name);
      renderAll();
      refreshFilterOptions();
      toast('スナップショットを復元しました');
    });
  }
  function deleteSnapshot(id) {
    state.snapshots = state.snapshots.filter(s => s.id !== id);
    saveKey(KEYS.snapshots);
    renderSnapshotList();
  }
  function renderSnapshotList() {
    const ul = document.getElementById('pm-snapshot-list');
    if (!ul) return;
    if (state.snapshots.length === 0) {
      ul.innerHTML = '<li style="color:var(--pm-muted);padding:0.5em">スナップショットなし</li>';
      return;
    }
    ul.innerHTML = state.snapshots.map(s => {
      const t = new Date(s.createdAt);
      const ts = (t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate()) + ' ' +
        pad2(t.getHours()) + ':' + pad2(t.getMinutes()));
      return '<li><span class="pm-snapshot-name">' + escapeHtml(s.name) + ' (' + s.tasks.length + '件)</span>' +
        '<span class="pm-snapshot-date">' + escapeHtml(ts) + '</span>' +
        '<button type="button" class="pm-btn small pm-snap-load" data-id="' + escapeHtml(s.id) + '">復元</button>' +
        '<button type="button" class="pm-btn small danger pm-snap-del" data-id="' + escapeHtml(s.id) + '">削除</button>' +
        '</li>';
    }).join('');
    ul.querySelectorAll('.pm-snap-load').forEach(b => b.addEventListener('click', () => loadSnapshot(b.dataset.id)));
    ul.querySelectorAll('.pm-snap-del').forEach(b => b.addEventListener('click', () => {
      confirmDialog('スナップショット削除', 'このスナップショットを削除しますか?', () => deleteSnapshot(b.dataset.id));
    }));
  }

  /* ============================================================
     テーマ (SPEC §4.2.16)
     ============================================================ */
  function setTheme(theme) {
    state.settings.theme = theme;
    document.body.classList.toggle('pm-dark', theme === 'dark');
    saveKey(KEYS.settings);
  }
  function toggleTheme() {
    setTheme(state.settings.theme === 'dark' ? 'light' : 'dark');
  }

  /* ============================================================
     キーボードショートカット (SPEC §4.2.17)
     ============================================================ */
  function isTypingTarget(t) {
    if (!t) return false;
    const tag = t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (t.isContentEditable) return true;
    return false;
  }
  function handleKeydown(e) {
    // Esc: モーダル閉じる
    if (e.key === 'Escape') {
      ['pm-modal', 'pm-confirm', 'pm-import-modal'].forEach(id => {
        if (document.getElementById(id).style.display !== 'none') closeModal(id);
      });
      return;
    }
    // Ctrl+N: 新規タスク (入力中は無効)
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !isTypingTarget(e.target)) {
      e.preventDefault();
      openTaskModal(null);
      return;
    }
    // Ctrl+1/2/3/4: ビュー切替 (入力中は無効)
    if ((e.ctrlKey || e.metaKey) && !isTypingTarget(e.target)) {
      const map = { '1': 'list', '2': 'gantt', '3': 'kanban', '4': 'calendar' };
      if (map[e.key]) { e.preventDefault(); switchView(map[e.key]); return; }
    }
    // /: 検索フォーカス (入力中は無効)
    if (e.key === '/' && !isTypingTarget(e.target)) {
      e.preventDefault();
      const s = document.getElementById('pm-search');
      if (s) { s.focus(); s.select(); }
      return;
    }
  }

  /* ============================================================
     初期化 (SPEC §4.1.9)
     ============================================================ */
  function init() {
    loadStorage();
    // テーマ適用
    setTheme(state.settings.theme || 'light');
    // フィルタ復元
    if (state.settings.filters) state.filters = Object.assign(state.filters, state.settings.filters);
    if (state.settings.sort) state.sort = Object.assign(state.sort, state.settings.sort);
    // コントロールバインド
    document.getElementById('pm-btn-new').addEventListener('click', () => openTaskModal(null));
    document.querySelectorAll('.pm-tab').forEach(t => {
      t.addEventListener('click', () => switchView(t.dataset.view));
    });
    const debouncedRender = debounce(() => { saveKey(KEYS.settings); renderActive(); }, 200);
    document.getElementById('pm-search').addEventListener('input', e => {
      state.filters.search = e.target.value;
      debouncedRender();
    });
    document.getElementById('pm-filter-status').addEventListener('change', e => {
      state.filters.status = e.target.value; saveKey(KEYS.settings); renderActive();
    });
    document.getElementById('pm-filter-priority').addEventListener('change', e => {
      state.filters.priority = e.target.value; saveKey(KEYS.settings); renderActive();
    });
    document.getElementById('pm-filter-assignee').addEventListener('change', e => {
      state.filters.assignee = e.target.value; saveKey(KEYS.settings); renderActive();
    });
    document.getElementById('pm-filter-milestone').addEventListener('change', e => {
      state.filters.milestone = e.target.value; saveKey(KEYS.settings); renderActive();
    });
    document.getElementById('pm-btn-export-json').addEventListener('click', exportJSON);
    document.getElementById('pm-btn-export-csv').addEventListener('click', exportCSV);
    document.getElementById('pm-btn-import').addEventListener('click', () => document.getElementById('pm-file-input').click());
    document.getElementById('pm-file-input').addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      const ext = f.name.split('.').pop().toLowerCase();
      readFile(f).then(text => {
        if (ext === 'json') importJSONData(text);
        else if (ext === 'csv') importCSVData(text);
        else toast('未対応の拡張子: ' + ext, 'error');
      }).catch(err => toast('ファイル読込失敗: ' + err.message, 'error'));
      e.target.value = '';
    });
    document.getElementById('pm-btn-settings').addEventListener('click', () => {
      const p = document.getElementById('pm-settings-panel');
      const isOpen = p.style.display !== 'none';
      p.style.display = isOpen ? 'none' : 'block';
      document.getElementById('pm-btn-settings').setAttribute('aria-expanded', String(!isOpen));
    });
    document.getElementById('pm-btn-theme').addEventListener('click', toggleTheme);
    // 設定パネル
    document.getElementById('pm-gh-token').value = state.github.token || '';
    document.getElementById('pm-gh-repo').value = state.github.repo || '';
    document.getElementById('pm-gh-save').addEventListener('click', () => {
      state.github.token = document.getElementById('pm-gh-token').value.trim();
      state.github.repo = document.getElementById('pm-gh-repo').value.trim();
      saveKey(KEYS.github);
      toast('GitHub設定を保存しました');
    });
    document.getElementById('pm-gh-clear').addEventListener('click', () => {
      state.github = { token: '', repo: '' };
      document.getElementById('pm-gh-token').value = '';
      document.getElementById('pm-gh-repo').value = '';
      saveKey(KEYS.github);
      toast('GitHub設定をクリアしました');
    });
    document.getElementById('pm-snap-save').addEventListener('click', () => {
      const name = document.getElementById('pm-snap-name').value.trim();
      saveSnapshot(name);
      document.getElementById('pm-snap-name').value = '';
    });
    document.getElementById('pm-activity-clear').addEventListener('click', () => {
      state.activity = []; saveKey(KEYS.activity); renderActivityList();
    });
    document.getElementById('pm-btn-clear-all').addEventListener('click', () => {
      confirmDialog('全タスク削除', 'すべてのタスクを削除しますか? この操作は元に戻せません。', () => {
        state.tasks = []; state.selection.clear();
        saveKey(KEYS.tasks);
        logActivity('全タスク削除', '');
        renderAll(); refreshBulkBar();
        toast('全タスクを削除しました');
      });
    });
    // 一括操作
    document.querySelectorAll('#pm-bulk-bar [data-bulk-status]').forEach(b => {
      b.addEventListener('click', () => bulkUpdateStatus(b.dataset.bulkStatus));
    });
    document.getElementById('pm-bulk-delete').addEventListener('click', bulkDelete);
    document.getElementById('pm-bulk-github').addEventListener('click', bulkCreateGithubIssues);
    document.getElementById('pm-bulk-clear').addEventListener('click', () => {
      state.selection.clear(); renderActive(); refreshBulkBar();
    });
    // モーダル
    document.querySelectorAll('#pm-modal [data-close]').forEach(el => {
      el.addEventListener('click', closeTaskModal);
    });
    document.querySelectorAll('#pm-confirm [data-close]').forEach(el => {
      el.addEventListener('click', () => closeModal('pm-confirm'));
    });
    document.querySelectorAll('#pm-import-modal [data-close]').forEach(el => {
      el.addEventListener('click', () => closeModal('pm-import-modal'));
    });
    document.getElementById('pm-form').addEventListener('submit', submitTaskForm);
    document.getElementById('pm-progress').addEventListener('input', e => {
      document.getElementById('pm-progress-display').textContent = e.target.value;
    });
    document.getElementById('pm-subtask-add').addEventListener('click', () => addSubtaskRow('', false));
    document.getElementById('pm-form-delete').addEventListener('click', () => {
      const id = document.getElementById('pm-task-id').value;
      if (!id) return;
      confirmDialog('タスク削除', 'このタスクを削除しますか?', () => {
        deleteTask(id);
        closeTaskModal();
        renderAll(); refreshBulkBar();
        toast('タスクを削除しました');
      });
    });
    // キーボード
    document.addEventListener('keydown', handleKeydown);
    // 初回描画
    switchView(state.view);
    refreshFilterOptions();
    renderActivityList();
    renderSnapshotList();
    refreshBulkBar();
  }

  // jQuery 初期化
  if (typeof global.jQuery !== 'undefined') {
    global.jQuery(function() { init(); });
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 公開API (デバッグ・テスト用)
  global.pm = {
    state: state, init: init, addTask: addTask, updateTask: updateTask, deleteTask: deleteTask,
    exportJSON: exportJSON, exportCSV: exportCSV, switchView: switchView,
    renderAll: renderAll, getTask: getTask, detectCycle: detectCycle
  };
})(window);
</script>
