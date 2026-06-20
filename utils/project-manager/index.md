---
layout: default
title: プロジェクト管理ツール - Rui Software
---

# プロジェクト管理ツール

このフォルダには、異なるAIモデルが同じ仕様（SPEC.md）に基づいて実装したプロジェクト管理ツールが配置されています。

各モデルの実装を比較することで、AIによるコード生成の特徴や違いを観察できます。

## 実装一覧

- [Qwen 3.7 実装](index_qwen_3_7.md) - 本次実装
- [Kimi K2.6 実装](index_kimi_k2_6.md)
- [DeepSeek V4 Pro 実装](index_deepseek_v4_pro.md)
- [GLM 5.1 実装](index_glm_5_1.md)
- [GLM 5.2 実装](index_glm_5_2.md)
- [MIMO V2.5 Pro 実装](index_mimo_v2_5_pro.md)
- [Minimax M3 実装](index_minimax_m3.md)

## 仕様書

- [共通仕様書 (SPEC.md)](SPEC.md) - すべての実装で共通の機能要件

## 機能概要

- **4つのビュー**: リスト、ガントチャート、看板、カレンダー
- **タスク管理**: CRUD、サブタスク、依存関係、進捗管理
- **フィルタ・ソート**: ステータス、優先度、担当者、マイルストーン
- **インポート/エクスポート**: JSON/CSV対応
- **GitHub連携**: Issue自動作成
