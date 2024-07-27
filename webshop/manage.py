from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/img'

def get_db_connection():
    conn = sqlite3.connect('shop.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    return render_template('index.html', products=products)

@app.route('/add', methods=('GET', 'POST'))
def add_product():
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

        return redirect(url_for('index'))

    return render_template('add.html')

if __name__ == '__main__':
    app.run(debug=True)
