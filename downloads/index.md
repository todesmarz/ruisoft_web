---
layout: default
title: ダウンロード - Rui Software
---
## ダウンロード

{% assign download_files = site.static_files | where_exp: 'item', "item.path contains '/downloads/files/'" | sort: 'path' %}
{% if download_files.size > 0 %}
<ul>
{% for file in download_files %}
  {% assign filename = file.path | split: '/' | last %}
  <li><a href="{{ site.baseurl }}{{ file.path }}">{{ filename }}</a></li>
{% endfor %}
</ul>
{% else %}
<p>公開中のダウンロードファイルはありません。</p>
{% endif %}
