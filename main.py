from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('EventLink', check_same_thread=False)
    conn.row_factory = sqlite3.Row  
    return conn

@app.route('/')
def admin():
    return render_template('')

@app.route('', methods=['POST'])
def add_event():     
    Titlu = request.form['titlu']
    Descriere = request.form['descriere']
    Data = request.form['data']
    Tip = request.form['tip']
    
    Raion = request.form['raion']
    Oras = request.form['oras']
    Strada = request.form['strada']
    
    Nume = request.form['nume']
    Domeniu = request.form['domeniu']

    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("INSERT INTO loc (raion, oras, strada) VALUES (?, ?, ?)", (Raion, Oras, Strada))
    loc_id = cur.lastrowid  
    
    time = datetime.now().strftime('%Y-%m-%d')
    cur.execute("INSERT INTO organizator (start_date, nume, domeniu) VALUES (?, ?, ?)", (time, Nume, Domeniu))
    organizator_id = cur.lastrowid  
    
    cur.execute(
        "INSERT INTO eveniment (titlu, descriere, data, tip, organizator_id, loc_id) VALUES (?, ?, ?, ?, ?, ?)",
        (Titlu, Descriere, Data, Tip, organizator_id, loc_id)
    )

    conn.commit()
    conn.close()

    return render_template('')


@app.route('/events')
def display_events():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('''
        SELECT eveniment.titlu, eveniment.descriere, eveniment.data, eveniment.tip, 
               loc.raion, loc.oras, loc.strada,
               organizator.nume, organizator.domeniu
        FROM eveniment
        JOIN loc ON eveniment.loc_id = loc.id
        JOIN organizator ON eveniment.organizator_id = organizator.id
    ''')

    events = cur.fetchall()
    conn.close()

    return render_template('', events=events)

if __name__ == '__main__':
    app.run(debug=True)
