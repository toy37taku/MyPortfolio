// Cart.jsからインポート
import Cart from './Cart.js';

window.onload = async function () {
    const output = document.getElementById('output');
    const cartItemsElement = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const buyItemButton = document.getElementById('buyItem');
    const myCart = new Cart();

    const storedCartItems = sessionStorage.getItem('cartItems');
    if (storedCartItems) {
        const items = JSON.parse(storedCartItems);
        items.forEach(item => myCart.addItem(item));
    }
    updateCartOutput();

    let data = '';

    fetch('https://my-portfolio-toy37tak.vercel.app/api/products')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;

            data.items.forEach((item, index) => {
                // 各商品情報を表示するためのカードを作成
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('col-md-4', 'mb-4'); // Bootstrapのグリッドクラスを使用
                itemDiv.innerHTML = `
                <div class="card">
                    <img src="/webshop/static/img/${item.img}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">価格: ${item.price}円</p>
                        <p class="card-text">${item.detail}</p>
                        <button class="btn btn-primary" onclick="openDetail(${index})">詳細</button>
                    </div>
                </div>
            `;
                output.appendChild(itemDiv);
            });
        });

    let detailWindows = [];

    window.openDetail = function (index) {
        const item = data.items[index];
        const newWindow = window.open(`detail.html?index=${index}`, '_blank', 'width=600,height=800');

        detailWindows.push(newWindow);
        newWindow.addEventListener('DOMContentLoaded', () => {
            newWindow.document.getElementById('addToCartButton').addEventListener('click', () => {
                const quantity = newWindow.document.getElementById('quantity').value;
                item.quantity = parseInt(quantity, 10); // 商品の数量を設定
                myCart.addItem(item);
                sessionStorage.setItem('cartItems', JSON.stringify(myCart.getItems()));
                updateCartOutput();
            });
        });
    };

    buyItemButton.addEventListener('click', () => {
        window.location.href = '/webshop/user/confirm.html';

        detailWindows.forEach(windowObject => {
            if (windowObject && !windowObject.closed) {
                windowObject.close();
            }
        });

        detailWindows = [];
    });

    function updateCartOutput() {
        const items = myCart.getItems();

        if (items.length == 0) {
            cartItemsElement.innerHTML = '<li>カートに商品がありません。</li>';
            totalPriceElement.textContent = '合計金額: 0円';
            return;
        }

        let totalPrice = 0;
        cartItemsElement.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - 価格: ${item.price}円 × ${item.quantity}個`;
            cartItemsElement.appendChild(li);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = `合計金額: ${totalPrice}円`;
    }
};
