from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/img'
app.secret_key = 'your_secret_key'

def get_db_connection():
    conn = sqlite3.connect('shop.db')
    conn.row_factory = sqlite3.Row
    return conn

# ユーザー側のルート
@app.route('/')
def index():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    return render_template('user/index.html', products=products)

# 管理者ログインページ
@app.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # ここでユーザー名とパスワードの確認を行います。これは例としてハードコードされています。
        if username == 'admin' and password == 'password':
            session['logged_in'] = True
            return redirect(url_for('admin_index'))
        else:
            return 'Invalid credentials'

    return render_template('login.html')

# ログアウト
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

# 管理者側のルート
@app.route('/admin')
def admin_index():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    return render_template('admin/index.html', products=products)

@app.route('/admin/add', methods=('GET', 'POST'))
def add_product():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    if request.method == 'POST':
        name = request.form['name']
        price = request.form['price']
        detail = request.form['detail']
        img = request.files['img']

        if not name or not price or not detail or not img:
            return 'All fields are required'

        filename = secure_filename(img.filename)
        img.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        conn = get_db_connection()
        conn.execute('INSERT INTO products (name, price, img, detail) VALUES (?, ?, ?, ?)',
                     (name, price, filename, detail))
        conn.commit()
        conn.close()

        return redirect(url_for('admin_index'))

    return render_template('admin/add.html')

if __name__ == '__main__':
    # 初期化のためにデータベースをセットアップ
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            img TEXT NOT NULL,
            detail TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

    app.run(debug=True)
