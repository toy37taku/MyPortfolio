from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dogapp')
def dogapp():
    return render_template('dogapp.html')

@app.route('/webshop')
def webshop():
    return render_template('webshop.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

if __name__ == "__main__":
    app.run(debug=True)
