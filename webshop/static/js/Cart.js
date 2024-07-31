// カート(買い物カゴ)クラスを作成=デフォルトクラス

// プロパティ:商品リスト(配列)
export default class Cart {
    constructor() {
        this.itemList = []; // 商品リストを管理する配列
    }

    // メソッド:商品追加
    addItem(item) {
        const existingItem = this.itemList.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            item.quantity = item.quantity || 1; // デフォルトの数量を1に設定
            this.itemList.push(item);
        }
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
