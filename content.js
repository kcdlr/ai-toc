// ポップアップからのメッセージを待つリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 「目次データをください」というリクエストが来た場合
  if (request.type === 'GET_TOC_DATA') {
    // ページ内からユーザーの質問要素をすべて探し出す
    const queryElements = document.querySelectorAll('.query-text');
    const tocData = [];

    queryElements.forEach((el, index) => {
      // 各質問要素にユニークなIDを付与する
      const uniqueId = `toc-item-${index}`;
      el.id = uniqueId;

      // 要素のテキストを取得（長すぎる場合は最初の50文字に短縮）
      const text = el.textContent.trim().substring(0, 50);
      if (text) {
        tocData.push({ id: uniqueId, text: text + '...' });
      }
    });

    // 収集した目次データをポップアップに送り返す
    sendResponse(tocData);
  }
  // 「この要素までスクロールして」というリクエストが来た場合
  else if (request.type === 'SCROLL_TO_ELEMENT') {
    const element = document.getElementById(request.elementId);
    if (element) {
      // 該当要素までスムーズにスクロール
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 見つけやすいように一時的にハイライトする（おまけ機能）
      element.style.transition = 'background-color 0.5s';
      element.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 1500);
    }
  }
});
