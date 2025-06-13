from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)

CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({"message": "Server Flask rulează!", "status": "ok"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"message": "Content-Type trebuie să fie application/json"}), 400

    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username == 'test' and password == 'parola':
        return jsonify({"message": "Login reușit!", "token": "abc123def456", "username": username}), 200
    else:
        return jsonify({"message": "Credențiale invalide."}), 401

@app.route('/api/upload-foto', methods=['POST'])
def upload_foto():
    uploaded_image_urls = []

    if not request.files:
        return jsonify({"message": "Niciun fișier încărcat."}), 400

    for key, file in request.files.items():
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = str(uuid.uuid4()) + os.path.splitext(filename)[1]
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)

            try:
                file.save(file_path)
                image_url = f"/uploads/{unique_filename}"
                uploaded_image_urls.append(image_url)
            except Exception as e:
                print(f"Eroare la salvarea fișierului {unique_filename}: {e}")

        elif file:
            print(f"Fișierul '{file.filename}' (câmpul '{key}') nu este un tip de fișier permis.")

    if not uploaded_image_urls:
        return jsonify({"message": "Nicio imagine validă încărcată sau eroare la salvare."}), 400

    return jsonify({"message": "Imagini încărcate cu succes!", "imageUrls": uploaded_image_urls}), 200

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=3000)