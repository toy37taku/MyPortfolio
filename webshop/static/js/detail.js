// Cart.jsからインポートしてくる
import Cart from './Cart.js';

// windowが開かれた時非同期通信でfunctionが実行される
window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productIndex = parseInt(urlParams.get('index'), 10); // インデックスを整数に変換
    const productDetail = document.getElementById('productDetail');
    const addToCartButton = document.getElementById('addToCartButton');
    const myCart = new Cart();

    try {
        const response = await fetch('http://127.0.0.1:8000/api/products');
        if (!response.ok) {
            throw new Error('ネットワークのレスポンスが異常です');
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        if (!data.items || isNaN(productIndex) || productIndex < 0 || productIndex >= data.items.length) {
            throw new Error('商品のフォーマットが正しくありません');
        }

        const item = data.items[productIndex];
        console.log('Product item:', item);

        productDetail.innerHTML = `
            <h2>${item.name}</h2>
            <p>価格: ${item.price}円</p>
            <img src="/MyPortfolio/webshop/static/img/${item.img}" alt="${item.name}" class="product-card">
            <p>${item.detail}</p>
        `;

        addToCartButton.addEventListener('click', () => {
            myCart.addItem(item);
            window.close();

            if (window.opener) {
                window.opener.postMessage({ type: 'addItemToCart', item: item }, '*');
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        productDetail.innerHTML = `<p>情報取得中にエラーが発生しました</p>`;
    }
};
