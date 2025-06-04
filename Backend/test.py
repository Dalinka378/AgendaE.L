@app.route('/check_db')
def check_db():
    try:
        conn = mysql.connector.connect(**DATABASE_CONFIG)
        if conn.is_connected():
            return "Conexiune reușită la baza de date!", 200
    except mysql.connector.Error as err:
        return f"Error: {err}", 500
    finally:
        if conn:
            conn.close()
