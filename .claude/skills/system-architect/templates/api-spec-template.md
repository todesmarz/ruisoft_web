---
template: api-spec
name: API仕様書テンプレート
description: |
  system-architect スキルが出力するAPI仕様書の空テンプレート。
  OpenAPI 3.0 互換の記述が可能。REST / GraphQL / gRPC いずれにも適用可能。
  エンドポイントごとにセクションを繰り返して使用する。
---

# API仕様書：{API名}

> **メタ情報**
> - ドキュメントID: {API-XXX}
> - バージョン: {1.0}
> - 作成日: {YYYY-MM-DD}
> - 最終更新: {YYYY-MM-DD}
> - 作成者: {名前}
> - レビュー状況: {Draft / Reviewed / Approved}
> - 関連基本設計書: {DOC-XXX}
> - APIスタイル: {REST / GraphQL / gRPC}
> - ベースURL: {https://api.example.com/v1}

---

## 1. 概要

### 1-1. 目的
{APIが提供する機能・用途}

### 1-2. 適用範囲
{含むエンドポイント / 含まないエンドポイント}

### 1-3. 共通仕様

#### 認証認可
| 方式 | 対象 | 認証情報 |
|---|---|---|
| {Bearer Token} | {全エンドポイント} | {Authorization: Bearer {token}} |
| {API Key} | {特定EP} | {X-API-Key: {key}} |

#### 共通ヘッダ
| ヘッダ | 必須 | 説明 |
|---|---|---|
| Authorization | ○ | {認証トークン} |
| Content-Type | ○ | application/json |
| X-Request-Id | × | {リクエスト追跡ID} |

#### 共通レスポンス形式
```json
{
  "status": "success",
  "data": { },
  "error": null,
  "meta": { "requestId": "", "timestamp": "" }
}
```

#### 共通エラーレスポンス
| ステータス | コード | 名称 | 説明 |
|---|---|---|---|
| 400 | E400 | Bad Request | {入力不備} |
| 401 | E401 | Unauthorized | {認証失敗} |
| 403 | E403 | Forbidden | {認可失敗} |
| 404 | E404 | Not Found | {リソース不存在} |
| 409 | E409 | Conflict | {状態競合} |
| 422 | E422 | Unprocessable Entity | {バリデーションエラー} |
| 429 | E429 | Too Many Requests | {レートリミット超過} |
| 500 | E500 | Internal Server Error | {サーバー内部エラー} |
| 503 | E503 | Service Unavailable | {メンテナンス・障害} |

#### レートリミット
- {100 req/min per user}
- {超過時: 429 + Retry-After ヘッダ}

#### バージョニング
- 方式: {URI / Header}
- 現行: {v1}
- 後方互換: {追加可・削除非推奨・型変更不可}

---

## 2. エンドポイント一覧

| IF ID | パス | メソッド | 概要 | 認可 |
|---|---|---|---|---|
| IF-001 | {/resources} | GET | {リソース一覧取得} | {要認証} |
| IF-002 | {/resources/{id}} | GET | {リソース詳細取得} | {要認証} |
| IF-003 | {/resources} | POST | {リソース作成} | {要認証・管理者} |
| IF-004 | {/resources/{id}} | PUT | {リソース更新} | {要認証・管理者} |
| IF-005 | {/resources/{id}} | DELETE | {リソース削除} | {要認証・管理者} |

---

## 3. エンドポイント詳細

### IF-001: {リソース一覧取得}

#### エンドポイント
- **パス**: `{/resources}`
- **メソッド**: `GET`
- **概要**: {リソース一覧を取得する}

#### 認可
{要認証・ロール要件}

#### リクエスト

##### クエリパラメータ
| 名前 | 型 | 必須 | デフォルト | 説明 |
|---|---|---|---|---|
| page | integer | × | 1 | {ページ番号} |
| per_page | integer | × | 20 | {1ページ件数（max 100）} |
| sort | string | × | -created_at | {ソート順（- 降順）} |
| filter[{field}] | string | × | — | {フィルタ条件} |

##### リクエストヘッダ
| ヘッダ | 必須 | 説明 |
|---|---|---|
| Authorization | ○ | Bearer {token} |

##### リクエストボディ
{なし}

#### レスポンス

##### 成功（200 OK）
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

##### レスポンススキーマ
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| data | array | ○ | {リソース配列} |
| data[].id | string | ○ | {リソースID（UUID）} |
| data[].name | string | ○ | {リソース名（1〜100文字）} |
| data[].created_at | string | ○ | {作成日時（ISO8601）} |
| meta | object | ○ | {ページネーション情報} |

##### エラー
| ステータス | コード | 説明 |
|---|---|---|
| 400 | E400 | {クエリパラメータ不正} |
| 401 | E401 | {認証トークン無効} |

#### 境界値・制約
- per_page: {1〜100}
- sort: {指定可能フィールド: created_at, name}
- フィルタ: {部分一致}

#### 例
```http
GET /v1/resources?page=1&per_page=20&sort=-created_at
Authorization: Bearer {token}
```

---

### IF-002: {リソース詳細取得}
{同フォーマットで繰り返し}

---

## 4. データモデル

### 4-1. 共通スキーマ

#### Resource
| フィールド | 型 | 必須 | 説明 | 制約 |
|---|---|---|---|---|
| id | string | ○ | {ID} | {UUID} |
| name | string | ○ | {名前} | {1〜100文字} |
| created_at | string | ○ | {作成日時} | {ISO8601} |
| updated_at | string | ○ | {更新日時} | {ISO8601} |

### 4-2. 列挙型
| 列挙型 | 値 |
|---|---|
| {Status} | {active, inactive, archived} |

---

## 5. Webhook / イベント（非同期IFがある場合）

### 5-1. イベント一覧
| イベント名 | トリガー | ペイロード | 送信先 |
|---|---|---|---|
| {resource.created} | {リソース作成時} | {Resource} | {Webhook URL} |

### 5-2. ペイロード形式
```json
{
  "event": "resource.created",
  "data": { },
  "timestamp": "ISO8601"
}
```

### 5-3. 再送ポリシー
{リトライ回数・バックオフ・冪等性要件}

---

## 6. 非機能要件

| 項目 | 目標値 |
|---|---|
| 応答時間 | P95 {1秒以内} |
| スループット | {100 req/sec} |
| 可用性 | {99.9%} |
| タイムアウト | {クライアント30秒・サーバー10秒} |

---

## 7. 要件との対応

| 要件ID | 対応IF | 備考 |
|---|---|---|
| {US-001} | IF-001, IF-002 | {対応内容} |

---

## 8. 未解決事項・後追い課題

- [ ] {課題1}

---

## 変更履歴

| バージョン | 日付 | 変更者 | 変更内容 |
|---|---|---|---|
| 1.0 | {YYYY-MM-DD} | {名前} | 初版作成 |