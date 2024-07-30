// Cart.jsからインポート
import Cart from './Cart.js';

window.onload = function () {
    const cartItemsElement = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const purchaseButton = document.getElementById('purchaseButton');
    const returnButton = document.getElementById('returnButton');

    // カートインスタンスを作成
    const myCart = new Cart();

    // カートの商品一覧を取得して表示する関数
    function displayCartItems() {
        const storedCartItems = sessionStorage.getItem('cartItems');
        let itemList = [];
        if (storedCartItems) {
            itemList = JSON.parse(storedCartItems);
            itemList.forEach(item => myCart.addItem(item));
        }

        if (itemList.length === 0) {
            cartItemsElement.innerHTML = '<p>カートに商品がありません。</p>';
            totalPriceElement.textContent = '合計金額: 0円';
            return;
        }

        // カート一覧と合計金額を出力する処理
        let totalPrice = 0;
        cartItemsElement.innerHTML = '<ul>';
        itemList.forEach(item => {
            cartItemsElement.innerHTML += `<li>${item.name} - 価格: ${item.price}円 × ${item.quantity}個</li>`;
            totalPrice += item.price * item.quantity;
        });
        cartItemsElement.innerHTML += '</ul>';

        totalPriceElement.textContent = `合計金額: ${totalPrice}円`;
    }

    // ページにカートの商品たちを表示させる
    displayCartItems();

    // 購入するボタンがクリックされた時の処理
    purchaseButton.addEventListener('click', () => {
        const items = myCart.getItems();
        if (items.length === 0) {
            alert('カートに商品がありません。');
            return;
        }

        // カートの中身をクリア
        myCart.purchase();
        sessionStorage.removeItem('cartItems');

        // 購入完了画面に遷移
        window.location.href = '/webshop/user/complete.html';
    });

    // トップに戻るボタンのクリックイベント
    returnButton.addEventListener('click', () => {
        window.location.href = '/webshop/user/webshop.html'; // index.html に戻る
    });
};
