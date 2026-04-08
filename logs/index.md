---
layout: default
title: 記事一覧 - Rui Software
---

## 記事一覧

### AIニュース（日次）

- [AI・テックニュース 2026-04-07](./ai-news-2026-04-07.html)


### amebloの記事

<div id="ameblo-container">
    <ul id="blog-list-ul">
        <li class="loading">記事を読み込んでいます...</li>
    </ul>
</div>

<style>
/* 簡易的なスタイリング（お好みで調整してください） */
#blog-list-ul {
    list-style: none;
    padding: 0;
}
.blog-item {
    margin-bottom: 15px;
    padding: 10px;
    border-bottom: 1px solid #eee;
}
.blog-item a {
    text-decoration: none;
    color: #333;
    display: block;
}
.blog-item a:hover {
    background-color: #f9f9f9;
}
.blog-date {
    font-size: 0.85em;
    color: #888;
}
.blog-title {
    font-weight: bold;
    margin-top: 5px;
}
</style>

<script>
/**
 * AmebaブログのRSSを取得して一覧表示する処理
 */
async function fetchAmebaRSS() {
    const amebaId = 'todesmarz'; // ブログID
    const rssUrl = `https://rssblog.ameba.jp/${amebaId}/rss20.xml`;
    
    // AllOriginsプロキシを使用（cachebustingのためにランダムな値を付与すると最新を取得しやすくなります）
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}&_=${Date.now()}`;

    const listElement = document.getElementById('blog-list-ul');

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('ネットワークエラーが発生しました');
        
        const data = await response.json();
        
        // 文字列のXMLをDOMオブジェクトに変換
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        
        // パースエラーのチェック
        const parserError = xmlDoc.getElementsByTagName("parsererror");
        if (parserError.length > 0) throw new Error("XMLのパースに失敗しました");

        const items = xmlDoc.querySelectorAll("item");

        // リストをクリア
        listElement.innerHTML = '';

        if (items.length === 0) {
            listElement.innerHTML = '<li>記事が見つかりませんでした。</li>';
            return;
        }

        // 記事をループしてHTMLを生成
        items.forEach(item => {
            // querySelectorでうまく取れない場合があるため、getElementsByTagNameを併用
            const title = item.getElementsByTagName("title")[0]?.textContent || "無題";
            const link = item.getElementsByTagName("link")[0]?.textContent || "#";
            const pubDateStr = item.getElementsByTagName("pubDate")[0]?.textContent || "";
            
            // 日付のフォーマット (例: 2026/03/07)
            let dateDisplay = "";
            if (pubDateStr) {
                const pubDate = new Date(pubDateStr);
                dateDisplay = `${pubDate.getFullYear()}/${(pubDate.getMonth() + 1).toString().padStart(2, '0')}/${pubDate.getDate().toString().padStart(2, '0')}`;
            }

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
        listElement.innerHTML = '<li class="error">記事の取得に失敗しました。時間をおいて再度お試しください。</li>';
    }
}

// ページ読み込み完了後に実行
document.addEventListener('DOMContentLoaded', fetchAmebaRSS);
</script>
