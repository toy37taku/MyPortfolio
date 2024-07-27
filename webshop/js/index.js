// Cart.jsからインポートしてくる
import Cart from './Cart.js';

// windowが開かれた時非同期通信でfunctionが実行される
window.onload = async function () {
    const output = document.getElementById('output');
    const cartItemsElement = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const buyItemButton = document.getElementById('buyItem');
    const myCart = new Cart();  // Cartの配列を作るファンクションをnewで実行→myCartに代入

    // sessionStorage からカートの内容を取得して myCart に追加
    // (confirmから戻るを押したときカートを再表示させる処理)
    const storedCartItems = sessionStorage.getItem('cartItems');
    //ここではまだ文字列(sessionStrageには文字列しか保存できない仕様のため)
    // if文=storedCartItemsがあったときの処理
    if (storedCartItems) {
        // JSONの文字列を解析し、オブジェクトに変換して[parseの機能で]itemsという変数に代入する
        const items = JSON.parse(storedCartItems);
        // 上でオブジェクト化したitemsたちをmyCart(配列)に入れていく
        items.forEach(item => myCart.addItem(item));
    }
    // ここでカートの内容を表示する
    updateCartOutput();

    // あとからjsonのデータをいれる変数(data)を作る
    let data = '';

    // fetchでjsonからデータを引っ張ってくる
    fetch('../data/data.json')
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            data = jsonData; // data変数にJSONデータを代入

            // 商品情報を1つずつカード(div)として表示する処理(商品一覧をoutputしている)
            // すべてのitems(index)を繰り返し処理→divでひとつずつ表示する
            data.items.forEach((item, index) => {
                // 各商品情報を表示するためのdiv要素を作成
                const itemDiv = document.createElement('div');
                itemDiv.innerHTML = `
                <h2>${item.name}</h2>
                <p>価格: ${item.price}円</p>
                <img src="../img/${item.img}" alt="${item.name}">
                <p>${item.detail}</p>
            `;
                // itemDiv(各商品)をクリックしたときの処理として、該当するdetailのページを開く
                itemDiv.addEventListener('click', () => {
                    //openDetailのファンクションにindex番号を渡して処理をする
                    openDetail(index);
                });
                // 作成したitemDivをoutput要素に追加
                output.appendChild(itemDiv);
            });
        })

    // 詳細画面を表示させる<=>閉じるを行うためにdetailWindowという変数を準備する
    // たくさん開いたことを想定して配列として管理する(バグ対策)
    let detailWindows = [];

    // 詳細画面を別ウインドウで開く処理
    window.openDetail = function (index) {
        const item = data.items[index];
        const newWindow = window.open(`detail.html?index=${index}`, '_blank', 'width=600,height=600');

        // 新しく開いたウィンドウを配列に追加
        detailWindows.push(newWindow);
        // カートにいれるを押されたときの処理(detailからpostMessageで伝えられる)
        newWindow.addEventListener('DOMContentLoaded', () => {
            newWindow.document.getElementById('addToCartButton').addEventListener('click', () => {
                myCart.addItem(item);
                alert(`${item.name}をカートに追加しました。`);
                // sessionStorageのsetItemにmyCartの中のgetItemsをJSONから文字列としてを保存しておく
                sessionStorage.setItem('cartItems', JSON.stringify(myCart.getItems()));
                updateCartOutput();
            });
        });
    };

    // 購入ボタンがクリックされたときの処理(confirmに遷移するだけ)
    buyItemButton.addEventListener('click', () => {
        window.location.href = '../html/confirm.html';

        // すべての詳細ウィンドウを閉じる処理
        // 上で開いたウィンドウをwindowObjectとして保存して、それがすべてclosedされてないときwindowObjectを閉じる処理をする
        detailWindows.forEach(windowObject => {
            if (windowObject && !windowObject.closed) {
                windowObject.close();
            }
        });

        // detailWindows配列をリセット(すべてのページを閉じる処理)
        detailWindows = [];
    });

    // updateCartOutputとして、カートの表示をアップデートする仕様にする(詳細画面でカート追加されたときのファンクション)
    function updateCartOutput() {
        const items = myCart.getItems();

        // もしitemsになにもなければ、カートになにもないことを表示
        if (items.length == 0) {
            cartItemsElement.innerHTML = '<li>カートに商品がありません。</li>';
            totalPriceElement.textContent = '合計金額: 0円';
            return;
        }

        // "カートの内容"としてカートに入れられたそれぞれのitemを代入して表示
        let totalPrice = 0;
        cartItemsElement.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - 価格: ${item.price}円`;
            cartItemsElement.appendChild(li);
            totalPrice += item.price;
        });

        totalPriceElement.textContent = `合計金額: ${totalPrice}円`;
    }
};