// Cart.jsからインポートしてくる
import Cart from './Cart.js';

// windowが開かれた時非同期通信でfunctionが実行される
window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productIndex = urlParams.get('index');
    const productDetail = document.getElementById('productDetail');
    const addToCartButton = document.getElementById('addToCartButton');
    const myCart = new Cart();

    const response = await fetch('../data/data.json');
    const data = await response.json();
    const item = data.items[productIndex];

    productDetail.innerHTML = `
            <h2>${item.name}</h2>
            <p>価格: ${item.price}円</p>
            <img src="../img/${item.img}" alt="${item.name}">
            <p>${item.detail}</p>
        `;

    // カートにいれるボタンをおしたときの処理
    addToCartButton.addEventListener('click', () => {
        // myCartのadditemのファンクション(Cart.jsの処理)をitemを用いて行う
        myCart.addItem(item);
        window.close();     // windowをクローズする

        // 親ウィンドウ（index.html）にaddItemToCartされたことを通知する
        if (window.opener) {
            window.opener.postMessage({ type: 'addItemToCart', item: item }, '*');
        }
    })
}