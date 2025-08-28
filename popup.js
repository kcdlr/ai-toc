// ポップアップが開かれたときに実行
document.addEventListener('DOMContentLoaded', () => {
  // 現在開いているタブに「目次データをください」とメッセージを送る
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_TOC_DATA' }, (response) => {
      const tocList = document.getElementById('toc-list');
      tocList.innerHTML = ''; // 「読み込み中...」をクリア

      if (response && response.length > 0) {
        // 受け取ったデータからリンクのリストを作成
        response.forEach(item => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#';
          a.textContent = item.text;
          a.dataset.elementId = item.id; // data属性にIDを保存

          // リンクがクリックされたときの動作
          a.addEventListener('click', (event) => {
            event.preventDefault();
            // content.jsに「このIDの要素までスクロールして」とメッセージを送る
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'SCROLL_TO_ELEMENT',
              elementId: event.target.dataset.elementId
            });
            window.close(); // クリックしたらポップアップを閉じる
          });

          li.appendChild(a);
          tocList.appendChild(li);
        });
      } else {
        tocList.innerHTML = '<li>目次が見つかりませんでした。</li>';
      }
    });
  });
});
