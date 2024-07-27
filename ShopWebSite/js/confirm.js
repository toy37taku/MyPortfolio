// Cart.jsからインポート
import Cart from './Cart.js';

// windowが表示されたとき自動で起こるファンクション
window.onload = function () {
    const cartItems = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const purchaseButton = document.getElementById('purchaseButton');
    const returnButton = document.getElementById('returnButton');

    // カートインスタンスを作成
    const myCart = new Cart();

    // storedCartItemsという変数(カートの商品一覧)にsessionStorageで保存しておいたcartItemsを持ってきて表示するファンクション
    function displayCartItems() {
        const storedCartItems = sessionStorage.getItem('cartItems');
        let itemList;
        if (storedCartItems) {
            itemList = JSON.parse(storedCartItems);
            // カートに商品を追加
            itemList.forEach(item => myCart.addItem(item));
        } else {
            itemList = [];
        }

        if (itemList.length == 0) {
            cartItems.innerHTML = '<p>カートに商品がありません。</p>';
            totalPriceElement.textContent = '合計金額: 0円';
            return;
        }

        // カート一覧と合計金額(totalPrice)を出力する処理
        let totalPrice = 0;
        cartItems.innerHTML = '<ul>';
        itemList.forEach(item => {
            cartItems.innerHTML += `<li>${item.name} - 価格: ${item.price}円</li>`;
            totalPrice += item.price;
        });
        cartItems.innerHTML += '</ul>';

        totalPriceElement.textContent = `合計金額: ${totalPrice}円`;
    }

    // ページにカートの商品たちを表示させる
    displayCartItems();
    // ここまでがカートの中身を"表示させる"だけの処理


    // ここから"購入するボタンを押した時"の処理
    purchaseButton.addEventListener('click', () => {
        const items = myCart.getItems();
        if (items.length == 0) {
            alert('カートに商品がありません。');
            return;
        }

        // カートの中身をクリア=Cart.jsのpurchaseメソッドを使って購入処理を行う(今回はmyCartを空にする処理)
        myCart.purchase();
        sessionStorage.removeItem('cartItems');

        // 購入完了画面に遷移
        window.location.href = '../html/complete.html';
    });

    // トップに戻るボタンのクリックイベント
    returnButton.addEventListener('click', () => {
        console.log('トップに戻るがクリックされました');
        window.location.href = '../html/index.html'; // index.html に戻る
    });
};
