---
layout: default
title: 記事一覧 - Rui Software
---

## 記事一覧

### amebloの記事

<div id="note" />

<div id="scripts">
<script>
/**
 * AmebaブログのRSSを取得して一覧表示する処理
 */
async function fetchAmebaRSS() {
    const amebaId = 'todesmarz'; // ブログID
    const rssUrl = `https://rssblog.ameba.jp/${amebaId}/rss20.xml`;
    
    // ブラウザのCORS制限を回避するためのプロキシURL
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

    const listElement = document.getElementById('blog-list-ul');

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('ネットワークエラーが発生しました');
        
        const data = await response.json();
        
        // 文字列のXMLをDOMオブジェクトに変換
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        // リストをクリア
        listElement.innerHTML = '';

        if (items.length === 0) {
            listElement.innerHTML = '<li>記事が見つかりませんでした。</li>';
            return;
        }

        // 記事をループしてHTMLを生成
        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const pubDateStr = item.querySelector("pubDate").textContent;
            
            // 日付のフォーマット (例: 2023/10/25)
            const pubDate = new Date(pubDateStr);
            const dateDisplay = `${pubDate.getFullYear()}/${(pubDate.getMonth() + 1).toString().padStart(2, '0')}/${pubDate.getDate().toString().padStart(2, '0')}`;

            const li = document.createElement('li');
            li.className = 'blog-item';
            li.innerHTML = `
                <a href="${link}" target="_blank" rel="noopener noreferrer">
                    <div class="blog-date">${dateDisplay}</div>
                    <div class="blog-title">${title}</div>
                </a>
            `;
            listElement.appendChild(li);
        });

    } catch (error) {
        console.error('Error:', error);
        listElement.innerHTML = '<div class="loading">記事の取得に失敗しました。</div>';
    }
}

// 実行
fetchAmebaRSS();
</script>
</div>
