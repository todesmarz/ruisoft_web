---
title: <API名> API仕様書
description: <API名>のエンドポイント・リクエスト/レスポンス・認証方式を解説するAPI仕様書
last_updated: <YYYY-MM-DD>
document_type: api-spec
target_audience: 開発者
---

# <API名> API仕様書

<!-- 記入ガイド:
- 想定読者: 開発者（システムを開発・拡張する人）
- 目的: APIの利用方法を正確に伝える
- 技術用語OK・略語OK
- OpenAPI（YAML）のサマリとして使用。詳細は openapi.yaml を参照
- コード例は実行可能に
-->

## 概要

<API名> は、<目的・用途> を提供するREST APIです。

- **ベースURL**: `<ベースURL>`
- **対応形式**: JSON
- **認証方式**: Bearer Token（JWT） / API Key
- **OpenAPI仕様書**: [openapi.yaml](openapi.yaml)

## 認証方式

### Bearer Token（JWT）

```http
Authorization: Bearer <JWTトークン>
```

<トークン取得方法・有効期限等>

### API Key

```http
X-API-Key: <APIキー>
```

<APIキー取得方法>

## 共通仕様

### エラーレスポンス形式

すべてのエラーレスポンスは以下の形式です。

```json
{
  "code": "<エラーコード>",
  "message": "<エラーメッセージ>",
  "details": [
    {
      "field": "<フィールド名>",
      "issue": "<エラー詳細>"
    }
  ]
}
```

### HTTPステータスコード

| ステータスコード | 説明 |
|---|---|
| 200 OK | リクエスト成功 |
| 201 Created | リソース作成成功 |
| 204 No Content | リクエスト成功（レスポンスボディなし） |
| 400 Bad Request | リクエストパラメータ不正 |
| 401 Unauthorized | 認証エラー |
| 403 Forbidden | 認可エラー |
| 404 Not Found | リソース未検出 |
| 429 Too Many Requests | レートリミット超過 |
| 500 Internal Server Error | サーバーエラー |

### レートリミット

- **制限**: <リクエスト数> 回 / <期間>
- **ヘッダー**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## エンドポイント一覧

### 1. <エンドポイント1名>

<!-- 各エンドポイントの構成: 概要 → リクエスト → レスポンス → エラー → 例 -->

**概要:** <エンドポイントの説明>

```
GET /<パス>
```

**パラメータ:**

| パラメータ | 場所 | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `<パラメータ1>` | query | string | はい | <説明> |
| `<パラメータ2>` | query | integer | いいえ | <説明>（デフォルト: <値>） |

**リクエスト例:**

```bash
curl -X GET "<ベースURL>/<パス>?<パラメータ1>=<値>" \
  -H "Authorization: Bearer <トークン>"
```

**レスポンス（200 OK）:**

```json
{
  "<フィールド1>": "<値1>",
  "<フィールド2>": "<値2>"
}
```

**エラー:**

| ステータス | コード | 説明 |
|---|---|---|
| 400 | INVALID_PARAMETER | <説明> |
| 401 | UNAUTHORIZED | <説明> |
| 404 | NOT_FOUND | <説明> |

### 2. <エンドポイント2名>

**概要:** <エンドポイントの説明>

```
POST /<パス>
```

**リクエストボディ:**

```json
{
  "<フィールド1>": "<値1>",
  "<フィールド2>": "<値2>"
}
```

**リクエスト例:**

```bash
curl -X POST "<ベースURL>/<パス>" \
  -H "Authorization: Bearer <トークン>" \
  -H "Content-Type: application/json" \
  -d '{"<フィールド1>": "<値1>"}'
```

**レスポンス（201 Created）:**

```json
{
  "id": "<ID>",
  "<フィールド1>": "<値1>"
}
```

## データモデル

### <モデル名1>

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | string | はい | <説明> |
| `<フィールド1>` | string | はい | <説明> |
| `<フィールド2>` | integer | いいえ | <説明> |
| `created_at` | string (date-time) | はい | 作成日時 |
| `updated_at` | string (date-time) | はい | 更新日時 |

## 変更履歴

| バージョン | 日付 | 変更内容 |
|---|---|---|
| 1.0.0 | <YYYY-MM-DD> | 初版 |

---

*この仕様書の最終更新日: <YYYY-MM-DD>*
*APIバージョン: <バージョン>*