# -*- coding: utf-8 -*-
"""記事内SVG概念イラストの妥当性検証スクリプト。

検証内容:
1. 各ファイルのSVGがXMLとして well-formed か（ElementTreeでパース）
2. SVG内の id 属性が同一ファイル内で重複していないか
3. 概念イラスト（article-summary-diagram 以外）が存在するか
"""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(r"c:\Users\todes\OneDrive\Documents\21_Rui-Software\Project\ruisoft_web")

TARGETS = [
    "logs/agent_harness_guide_2026_04_08.md",
    "logs/ai_is_genai_or_not_engineer_skill.md",
    "logs/backward_compatibility_criteria.md",
    "logs/blue_collar_fitness_readiness_guide.md",
    "logs/chat_platform_selection_slack_discord_telegram.md",
    "logs/data_retention_for_analysis_strategy.md",
    "logs/genai_driven_development_design_patterns_practices.md",
    "logs/legacy_maintenance_genai_local_llm.md",
    "logs/metaverse_digital_twin_future_with_genai.md",
    "logs/mysql_to_postgresql_shift_factors.md",
    "logs/python_data_analysis_practical_guide.md",
    "logs/requirements_definition_practice_scope_control.md",
    "logs/user_attribute_ui_language_guide.md",
    "logs/what_engineers_should_learn_next.md",
]

SVG_RE = re.compile(r"<svg\b.*?</svg>", re.DOTALL)
ID_RE = re.compile(r'\bid="([^"]+)"')

errors = []
warnings = []

for rel in TARGETS:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    svgs = SVG_RE.findall(text)
    concept_svgs = [s for s in svgs if 'id="article-summary-diagram"' not in s]

    if not concept_svgs:
        errors.append(f"{rel}: 概念イラストが見つかりません")
        continue

    for idx, svg in enumerate(concept_svgs):
        # 1) XML妥当性
        try:
            ET.fromstring(svg)
        except ET.ParseError as exc:
            errors.append(f"{rel}: SVG#{idx + 1} がXMLとして不正: {exc}")
            continue

        # 2) ID重複チェック（ファイル全体の全SVGを対象）
        all_ids = ID_RE.findall(text)
        seen = {}
        for i in all_ids:
            seen[i] = seen.get(i, 0) + 1
        dups = [k for k, v in seen.items() if v > 1]
        if dups:
            errors.append(f"{rel}: ID重複: {dups}")

        # 3) アクセシビリティ属性
        if 'role="img"' not in svg:
            warnings.append(f"{rel}: SVG#{idx + 1} に role=\"img\" がありません")
        if "aria-labelledby" not in svg:
            warnings.append(f"{rel}: SVG#{idx + 1} に aria-labelledby がありません")
        if "<title" not in svg or "<desc" not in svg:
            warnings.append(f"{rel}: SVG#{idx + 1} に title/desc がありません")

print(f"検証対象: {len(TARGETS)} ファイル")
print(f"エラー: {len(errors)} 件 / 警告: {len(warnings)} 件")
for e in errors:
    print(f"  [ERROR] {e}")
for w in warnings:
    print(f"  [WARN]  {w}")
if not errors:
    print("すべてのSVGがXML妥当・ID一意・アクセシビリティ属性ありです。")
sys.exit(1 if errors else 0)
