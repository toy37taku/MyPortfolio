// カート(買い物カゴ)クラスを作成=デフォルトクラスにする

// プロパティ:商品リスト(配列)
export default class Cart {
    constructor() {
        this.itemList = []; // 商品リストを管理する配列
    }

    // メソッド:商品追加
    addItem(item) {
        this.itemList.push(item); // 引数で受け取った商品オブジェクトを商品リストに追加する
    }

    // メソッド:商品一覧取得
    getItems() {
        return this.itemList; // 現在の商品リストを返す
    }

    // メソッド:商品購入
    purchase() {
        // 今回は購入操作=カートを空にするだけ
        this.itemList = [];
    }
}