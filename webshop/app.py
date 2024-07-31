from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import json
from flask_cors import CORS
from dotenv import load_dotenv

# ローカル環境での .env ファイルの読み込み
load_dotenv()

app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app)

# デバッグモードを有効にする
app.config['DEBUG'] = True

# アップロードフォルダのパスを指定
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/img')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 最大アップロードサイズ

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 環境に応じてファイルパスを変更する
if os.getenv('ENV') == 'production':
    DATA_FILE = '/webshop/static/data/products.json'
else:
    DATA_FILE = 'static/data/products.json'

# JSONデータを読み込む関数
def get_json_data():
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return {'items': []}  # ファイルが存在しない場合は空のデータを返す
    except json.JSONDecodeError:
        return {'items': []}  # JSONのデコードに失敗した場合は空のデータを返す

# JSONデータを書き込む関数
def save_json_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# IDから商品を取得する関数
def get_product_by_id(product_id):
    products = get_json_data()
    return next((item for item in products['items'] if item['id'] == product_id), None)

# 商品を保存する関数
def save_product(product):
    products = get_json_data()
    for i, item in enumerate(products['items']):
        if item['id'] == product['id']:
            products['items'][i] = product
            break
    save_json_data(products)

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        data = get_json_data()
        return jsonify(data)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "サーバーエラー"}), 500

@app.route('/')
def home_page():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    user_id = request.form['user_id']
    password = request.form['password']

    if user_id == os.getenv('ADMIN_ID') and password == os.getenv('ADMIN_PASSWORD'):
        return redirect(url_for('admin_page'))
    else:
        error = "IDまたはパスワードが違います"
        return render_template('login.html', error=error)

@app.route('/admin')
def admin_page():
    products = get_json_data()['items']
    return render_template('admin.html', products=products)

@app.route('/admin/add', methods=['GET', 'POST'])
def add_product_page():
    if request.method == 'POST':
        products = get_json_data()
        new_product_id = len(products['items']) + 1

        new_product = {
            'id': new_product_id,
            'name': request.form['name'],
            'price': int(request.form['price']),
            'detail': request.form['detail'],
            'img': ""  # 画像ファイル名は後で設定する
        }

        # 画像ファイルの処理
        if 'img' in request.files:
            file = request.files['img']
            if file.filename != '' and allowed_file(file.filename):
                ext = file.filename.rsplit('.', 1)[1].lower()  # 拡張子を取得
                img_filename = f"{new_product_id}.{ext}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], img_filename))
                new_product['img'] = img_filename

        # 画像ファイル名を含めて保存
        products['items'].append(new_product)
        save_json_data(products)

        return redirect(url_for('admin_page'))
    return render_template('add.html')

@app.route('/admin/edit/<int:product_id>', methods=['GET', 'POST'])
def edit_product_page(product_id):
    product = get_product_by_id(product_id)

    if request.method == 'POST':
        name = request.form['name']
        price = int(request.form['price'])
        detail = request.form['detail']

        if 'img' in request.files:
            file = request.files['img']
            if file.filename != '' and allowed_file(file.filename):
                ext = file.filename.rsplit('.', 1)[1].lower()  # 拡張子を取得
                new_filename = f"{product_id}.{ext}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))
                product['img'] = new_filename

        product['name'] = name
        product['price'] = price
        product['detail'] = detail
        save_product(product)

        return redirect(url_for('admin_page'))

    return render_template('edit.html', product=product)

@app.route('/admin/delete/<int:product_id>')
def delete_product(product_id):
    products = get_json_data()
    product = next((item for item in products['items'] if item['id'] == product_id), None)
    if product:
        products['items'].remove(product)
        save_json_data(products)
    return redirect(url_for('admin_page'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
