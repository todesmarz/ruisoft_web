---
layout: default
title: 記事一覧 - Rui Software
---

## 記事一覧

### noteに寄稿している記事一覧

<div id="note" />

<script type="text/javascript">
let viewXML = (xmlDocument) => {
    //XML形式に変換
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlDocument, "text/xml");
    let rss = doc.documentElement.getElementsByTagName("item");

    //HTMLタグの作成
    for(let i = 0;i < rss.length;i++){
        //RSSから取得したタイトルとリンク情報を格納
        let rssTitle = rss[i].getElementsByTagName("title")[0].textContent;
        let rssLink   = rss[i].getElementsByTagName("link")[0].textContent;

        //テンプレート文字列を使ってアンカータグを作成
        const tagString = `<a href="${rssLink}">${rssTitle}</a><br/>`;

        //body以下にアンカータグを挿入
        document.getElelemntbyId("note").insertAdjacentHTML('beforeend',tagString );
    }
};
const URL = 'https://note.com/todesmarz/rss';
fetch(URL)
.then( response => response.text())
.then( xmlData => viewXML(xmlData));
</script>
