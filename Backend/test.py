from flask import Flask

app = Flask(__name__)

@app.route('/check_db')
def check_db():
    return "Database check endpoint"

if __name__ == '__main__':
    app.run(debug=True)
