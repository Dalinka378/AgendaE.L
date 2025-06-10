from flask import Flask, request, Response, jsonify
import mysql.connector
import csv
import io

app = Flask(__name__)

# Configurația pentru conexiunea la MariaDB
DATABASE_CONFIG = {
    'user': 'Admin',  # înlocuiește cu utilizatorul tău
    'password': 'Admin123',  # înlocuiește cu parola ta
    'host': 'admin'@'localhost',
    'database': 'TaskManagerDB'  # înlocuiește cu numele bazei tale de date
}

def init_db():
    conn = mysql.connector.connect(**DATABASE_CONFIG)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            completed TINYINT NOT NULL DEFAULT 0
        )
    ''')
    # Inserare sarcini de exemplu
    cursor.executemany('''
        INSERT INTO tasks (title, description, completed) VALUES (%s, %s, %s)
    ''', [
        ('Task 1', 'Description 1', 0),
        ('Task 2', 'Description 2', 1),
        ('Task 3', 'Description 3', 0),
    ])
    conn.commit()
    conn.close()

@app.route('/tasks/export')
def export_tasks():
    fmt = request.args.get('format', 'json').lower()
    conn = mysql.connector.connect(**DATABASE_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM tasks')
    rows = cursor.fetchall()
    conn.close()

    if fmt == 'json':
        return jsonify(rows)
    elif fmt == 'csv':
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=rows[0].keys() if rows else ['id', 'title', 'description', 'completed'])
        writer.writeheader()
        for task in rows:
            writer.writerow(task)
        csv_data = output.getvalue()
        output.close()

        return Response(
            csv_data,
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=tasks.csv'}
        )
    else:
        return "Format not supported. Use json or csv.", 400

if __name__ == '__main__':
    init_db()
    app.run(debug=True)

