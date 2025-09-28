---
layout: default
title: 記事一覧 - Rui Software
---

## 記事一覧

### noteに寄稿している記事一覧

<div id="note" />

<div id="scripts">
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
      .then(response => {
        // ステータスが正常かチェック
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // XMLデータを文字列として取得
      })
      .then(xmlText => {
        const parser = new DOMParser();
        // DOMParserを使用して文字列をXMLDocumentオブジェクトにパース（解析）
        const xmlDoc = parser.parseFromString(xmlText, "text/xml"); 
        
        // xmlDocはXMLDocument（DOM構造）になったデータ
        viewXML(xmlDoc);
      })
      .catch(error => {
        console.error('FetchまたはXMLパース中にエラーが発生しました:', error);
      });
    </script>
</div>
