// windowが表示されたとき自動で起こるファンクション
// この画面ではCart.jsは使わない(トップに戻るだけの処理なのでメソッド必要ないため)

// トップに戻るボタンのクリックイベント
const returnButton = document.getElementById('returnButton');
returnButton.addEventListener('click', () => {
    console.log('トップに戻るがクリックされました')
    window.location.href = '/./MyPortfolio/webshop/templates/user/index.html'; // index.html に戻る
});