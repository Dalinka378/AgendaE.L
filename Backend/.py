from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS # Pentru a gestiona politicile CORS
import os # Pentru operații cu sistemul de fișiere
from werkzeug.utils import secure_filename # Pentru a securiza numele fișierelor
import uuid # Pentru a genera nume unice de fișiere

# Inițializarea aplicației Flask
app = Flask(__name__)

# Configurare CORS: Permite cereri din toate originile (pentru dezvoltare).
# În producție, ar trebui să specifici domeniile frontend-ului tău
CORS(app)

# Definește folderul unde vor fi salvate imaginile încărcate
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Asigură-te că folderul de încărcare există
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Funcție pentru a verifica dacă tipul de fișier este permis (ex: doar imagini)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# RUTA pentru login (echivalent cu app.post('/api/login', ...) din Node.js)
@app.route('/api/login', methods=['POST'])
def login():
    # Verifică dacă cererea este JSON
    if not request.is_json:
        return jsonify({"message": "Content-Type trebuie să fie application/json"}), 400

    data = request.json # Accesează datele JSON din corpul cererii
    username = data.get('username')
    password = data.get('password')

    # Aici vei face logica de verificare în baza de date
    # print(f"Încercare login: {username}, {password}")

    if username == 'test' and password == 'parola':
        # Un răspuns de succes
        return jsonify({"message": "Login reușit!", "token": "abc123def456"}), 200
    else:
        # Un răspuns de eroare
        return jsonify({"message": "Credențiale invalide."}), 401

# RUTA pentru încărcare imagini (echivalent cu app.post('/api/upload-foto', ...) din Node.js)
@app.route('/api/upload-foto', methods=['POST'])
def upload_foto():
    # Verifică dacă există fișiere în cerere
    if 'image0' not in request.files: # 'image0' este numele câmpului FormData din frontend
        return jsonify({"message": "Nicio imagine încărcată."}), 400

    uploaded_files = []
    file_paths = []

    # Flask gestionează upload-ul de fișiere prin request.files
    # Acesta este un obiect ImmutableMultiDict, poate conține mai multe fișiere cu același nume de câmp
    # În cazul nostru, frontend-ul trimite image0, image1, etc.
    # Trebuie să parcurgem toate fișierele trimise
    for key, file in request.files.items():
        if file and allowed_file(file.filename):
            # Generează un nume de fișier unic și securizat
            filename = secure_filename(file.filename)
            unique_filename = str(uuid.uuid4()) + os.path.splitext(filename)[1]
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Salvează fișierul pe server
            file.save(file_path)
            uploaded_files.append(unique_filename)
            file_paths.append(file_path) # Stocăm căile complete pe server

        elif file: # Dacă fișierul există, dar nu este permis
            print(f"Fișierul '{file.filename}' nu este un tip de fișier permis.")
            # Poți alege să returnezi o eroare sau să ignori fișierul

    if not uploaded_files:
        return jsonify({"message": "Nicio imagine validă încărcată."}), 400

    # print("Imagini încărcate:", uploaded_files)
    # Aici vei salva informații despre fișiere în baza de date (ex: calea către fișier)
    return jsonify({"message": "Imagini încărcate cu succes!", "files": file_paths}), 200

# Pentru a servi fișiere statice (cum ar fi imaginile încărcate)
# Acesta va permite accesarea imaginilor la adrese de forma http://localhost:3000/uploads/nume_fisier.jpg
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Pornirea serverului Flask
if __name__ == '__main__':
    # Serverul backend va rula pe http://localhost:3000
    # Asigură-te că ai folderul 'uploads' creat în directorul rădăcină al backend-ului,
    # unde se află acest fișier Python.
    app.run(debug=True, port=3000) # 'debug=True' ajută la dezvoltare, dar dezactivează-l în producție
