import flask
from flask import Flask, request, jsonify, abort
from validate import validate_event_data
from datetime import datetime, timedelta
import sqlite3
import os
from flask_cors import CORS
import hashlib

app = Flask(__name__)
current_directory = os.path.dirname(os.path.abspath(__file__))
database_path = os.path.join(current_directory, 'EventLink')
# CORS(app, resources={r'/*': {'origins': config['ORIGINS']}}, supports_credentials=True)
CORS(app, resources={r"*": {"origins": "*"}}, support_credentials=True)

def get_db_connection():
    conn = sqlite3.connect(database_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def admin():
    return 'First page'

#add new event to the database
#example http://127.0.0.1:5000/add?titlu=Event1&descriere=Description1&data=2024-09-15&ora=14:00:00&tip=conference&raion=Raion1&oras=Oras1&strada=Strada1&nume=OrganizerName&domeniu=IT
@app.route('/events/add', methods=['POST', 'OPTIONS'])
def add_event():
    data = request.get_json()  

    Titlu = data.get('titlu')
    Descriere = data.get('descriere')
    Data = data.get('data')
    Ora = data.get('ora')
    Tip = data.get('tip')
    
    Raion = data.get('raion')
    Oras = data.get('oras')
    Strada = data.get('strada')
    
    Nume = data.get('nume')
    Domeniu = data.get('domeniu')

    is_valid, message = validate_event_data(data)
    #is_valid = True
    if not is_valid:    
        print("hellow")
        return jsonify({'status': 'error', 'errors': message}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            cur.execute("INSERT INTO loc (raion, oras, strada) VALUES (?, ?, ?)", (Raion, Oras, Strada))
            loc_id = cur.lastrowid
        except sqlite3.Error as e:
            conn.rollback()
            return jsonify({'status': 'error', 'message': 'Failed to insert location data', 'error': str(e)}), 500
        
        time = datetime.now().strftime('%Y-%m-%d')
        
        try:
            cur.execute("INSERT INTO organizator (start_date, nume, domeniu) VALUES (?, ?, ?)", (time, Nume, Domeniu))
            organizator_id = cur.lastrowid
        except sqlite3.Error as e:
            conn.rollback()
            return jsonify({'status': 'error', 'message': 'Failed to insert organizer data', 'error': str(e)}), 500
        
        try:
            cur.execute(
                "INSERT INTO eveniment (titlu, descriere, data, ora, tip, organizator_id, loc_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (Titlu, Descriere, Data, Ora, Tip, organizator_id, loc_id)
            )
        except sqlite3.Error as e:
            conn.rollback()
            return jsonify({'status': 'error', 'message': 'Failed to insert event data', 'error': str(e)}), 500

        conn.commit()

    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Failed to process the request', 'error': str(e)}), 500

    finally:
        conn.close()
    return jsonify({
        'status': 'success',
        'message': 'Event added successfully',
        'data': {
            'titlu': Titlu,
            'descriere': Descriere,
            'data': Data,
            'ora': Ora,
            'tip': Tip,
            'raion': Raion,
            'oras': Oras,
            'strada': Strada,
            'nume': Nume,
            'domeniu': Domeniu
        }
    }), 200

@app.route('/user/utilizator', methods=['POST'])
def add_user():
    data = request.get_json() 

    prenume = data.get('prenume')
    nume = data.get('nume')
    parola = data.get('parola')
    statut = data.get('statut')
    liked_events = data.get('liked_events', []) 

    if not (prenume and nume and parola and statut):
        return jsonify({'status': 'error', 'message': 'Required fields are missing'}), 400

    hashed_password = hashlib.sha256(parola.encode()).hexdigest()

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO utilizator (prenume, nume, parola, statut, liked) VALUES (?, ?, ?, ?, ?)",
            (prenume, nume, hashed_password, statut, json.dumps(liked_events))
        )
        conn.commit()

    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({'status': 'error', 'message': 'Failed to add user', 'error': str(e)}), 500

    finally:
        conn.close()

    return jsonify({'status': 'success', 'message': 'User added successfully'}), 200

import hashlib

# Function to verify the password and return user status and liked events
@app.route('/user/authenticate', methods=['POST'])
def authenticate_user():
    data = request.get_json()

    name = data.get('name')
    surname = data.get('surname')
    password = data.get('password')

    if not name or not surname or not password:
        return jsonify({'status': 'error', 'message': 'Name, surname, and password are required'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT password_hash, status, liked FROM users WHERE name = ? AND surname = ?", (name, surname))
        user = cur.fetchone()

        if user is None:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        password_hash = hashlib.sha256(password.encode()).hexdigest()
        stored_password_hash = user['password_hash']
        
        if password_hash != stored_password_hash:
            return jsonify({'status': 'error', 'message': 'Invalid password'}), 403

        return jsonify({
            'status': 'Authentification passed successful',
            'data': {
                'user_status': user['status'],
                'liked_events': user['liked_events'] 
            }
        }), 200

    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': 'Database error', 'error': str(e)}), 500

    finally:
        conn.close()

import json

# Function to add a liked event to the liked_events field for a user
@app.route('/user/like_event', methods=['POST'])
def like_event():
    data = request.get_json()

    # Extract user ID and event ID from the request
    user_id = data.get('user_id')
    id_eveniment = data.get('id_eveniment')

    if not user_id or not id_eveniment:
        return jsonify({'status': 'error', 'message': 'User ID and event ID are required'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT liked_events FROM users WHERE id = ?", (user_id,))
        user = cur.fetchone()

        if user is None:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        liked_events = json.loads(user['liked_events']) if user['liked_events'] else {'data': {}}

        next_id = max(map(int, liked_events['data'].keys()), default=0) + 1

        liked_events['data'][str(next_id)] = id_eveniment

        cur.execute("UPDATE users SET liked = ? WHERE id = ?", (json.dumps(liked_events), user_id))
        conn.commit()

        return jsonify({
            'status': 'success',
            'message': 'Event liked successfully',
            'liked_events': liked_events
        }), 200

    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': 'Database error', 'error': str(e)}), 500

    finally:
        conn.close()

import json
from flask import jsonify, request

# Function to retrieve user profile and liked event details
@app.route('/user/<int:id>', methods=['GET'])
def get_user_profile(id):
    if not id:
        return jsonify({'status': 'error', 'message': 'User ID is required'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT name, surname, liked_events FROM users WHERE id = ?", (id,))
        user = cur.fetchone()

        if user is None:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        name, surname, liked_events_json = user['name'], user['surname'], user['liked_events']

        liked_events = json.loads(liked_events_json)['data'] if liked_events_json else {}
        event_ids = list(liked_events.values())

        liked_event_details = []
        if event_ids:
            cur.execute(f"""
                SELECT id, titlu, descriere, data, ora, tip 
                FROM eveniment 
                WHERE id IN ({','.join(['?'] * len(event_ids))})
            """, event_ids)
            liked_event_details = cur.fetchall()

        return jsonify({
            'status': 'success',
            'profile': {
                'name': name,
                'surname': surname,
                'liked_events': liked_event_details
            }
        }), 200

    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': 'Database error', 'error': str(e)}), 500

    finally:
        conn.close()

@app.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM users WHERE id = ?", (id,))
        user = cur.fetchone()

        if user is None:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        cur.execute("DELETE FROM users WHERE id = ?", (id,))
        conn.commit()

        return jsonify({'status': 'success', 'message': 'User deleted successfully'}), 200

    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': 'Database error', 'error': str(e)}), 500

    finally:
        conn.close()

#sent to frontend data about the event by id
#example http://127.0.0.1:5000/events/2
@app.route('/events/<int:id>', methods=['GET'])
def display_event_by_id(id):
    try:
        conn = get_db_connection()
        with conn:
            cur = conn.cursor()
            
            cur.execute('''
                SELECT eveniment.id, eveniment.titlu, eveniment.descriere, eveniment.data, eveniment.ora, eveniment.tip, 
                       loc.raion, loc.oras, loc.strada,
                       organizator.nume, organizator.domeniu
                FROM eveniment
                JOIN loc ON eveniment.loc_id = loc.id
                JOIN organizator ON eveniment.organizator_id = organizator.id
                WHERE eveniment.id = ?
            ''', (id,))
            
            event = cur.fetchone()
            #does not need validation because information was extracted from database 
            
            if event is None:
                abort(404, description="Event not found")
            
            return jsonify({
                
                'titlu': event[1],
                'descriere': event[2],
                'data': event[3],
                'ora': event[4],
                'tip': event[5],
                'loc': {
                    'raion': event[6],
                    'oras': event[7],
                    'strada': event[8]
                },
                'organizator': {
                    'nume': event[9],
                    'domeniu': event[10]
                }
            })
    
    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': 'Failed to fetch event', 'error': str(e)}), 500

#send to the frontend data about next events
# Example: http://127.0.0.1:5000/events/next_events?limit=3
@app.route('/events/next_events', methods=['GET'])
def display_next_events():
    try:
        conn = get_db_connection()
        with conn:
            cur = conn.cursor()
            
            # Get today's date
            today = datetime.now().strftime('%Y-%m-%d')
            # Extract the limit from query parameters or set it to be by default 2
            limit = request.args.get('limit', default=2, type=int)
            
            cur.execute('''
                SELECT eveniment.id, eveniment.titlu, eveniment.descriere, eveniment.data, eveniment.ora, eveniment.tip, 
                       loc.raion, loc.oras, loc.strada,
                       organizator.nume, organizator.domeniu
                FROM eveniment
                JOIN loc ON eveniment.loc_id = loc.id
                JOIN organizator ON eveniment.organizator_id = organizator.id
                WHERE eveniment.data >= ?
                ORDER BY eveniment.data, eveniment.ora
                LIMIT ?
            ''', (today, limit))
            
            events = cur.fetchall()
            #does not need validation because information was extracted from database
            
            events_list = [{
                'id': event[0],
                'titlu': event[1],
                'descriere': event[2],
                'data': event[3],
                'ora': event[4],
                'tip': event[5],
                'loc': {
                    'raion': event[6],
                    'oras': event[7],
                    'strada': event[8]
                },
                'organizator': {
                    'nume': event[9],
                    'domeniu': event[10]
                }
            } for event in events]
        
    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': 'Failed to fetch events', 'error': str(e)}), 500
    
    return jsonify(events_list)

#send informations to frontend about the event in the provided interval
#example http://127.0.0.1:5000/events/interval?start_date=2024-09-01&end_date=2024-09-30
@app.route('/events/interval', methods=['GET'])
def display_events_in_interval():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        today = datetime.now()
        if len(start_date) == 0:
            start_date = today.replace(day=1)

        if len(end_date) == 0:
            end_date = (today.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
        
        if not start_date or not end_date:
            return jsonify({'status': 'error', 'message': 'Start and end dates are required'}), 400
        
        try:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return jsonify({'status': 'error', 'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

        conn = get_db_connection()
        with conn:
            cur = conn.cursor()
            
            cur.execute('''
                SELECT eveniment.id, eveniment.titlu, eveniment.descriere, eveniment.data, eveniment.ora, eveniment.tip, 
                       loc.raion, loc.oras, loc.strada,
                       organizator.nume, organizator.domeniu
                FROM eveniment
                JOIN loc ON eveniment.loc_id = loc.id
                JOIN organizator ON eveniment.organizator_id = organizator.id
                WHERE eveniment.data BETWEEN ? AND ?
            ''', (start_date_obj.strftime('%Y-%m-%d'), end_date_obj.strftime('%Y-%m-%d')))
            
            events = cur.fetchall()
            #does not need validation because information was extracted from database
            
            events_list = [{
                'id': event[0],
                'titlu': event[1],
                'descriere': event[2],
                'data': event[3],
                'ora': event[4],
                'tip': event[5],
                'loc': {
                    'raion': event[6],
                    'oras': event[7],
                    'strada': event[8]
                },
                'organizator': {
                    'nume': event[9],
                    'domeniu': event[10]
                }
            } for event in events]
    
    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': 'Failed to fetch events', 'error': str(e)}), 500
    
    return jsonify(events_list)

    # TODO: add WHERE clause to return current month events by default
    # if there will be some date interval to use it instead

# modify data for the specified enent by ID 
#http://127.0.0.1:5000/events/patch/3?titlu=Updated%20Title&descriere=Updated%20Description&data=2024-09-15&ora=14:00&raion=Updated%20Raion&oras=Updated%20Oras&strada=Updated%20Strada&nume=Updated%20Organizator&domeniu=Updated%20Domain
@app.route('/events/patch/<int:id>', methods=['PATCH'])
def update_event(id):

    data = request.json
    try:
        conn = get_db_connection()
        with conn:
            cur = conn.cursor()
            
            Titlu = data.get('titlu')
            Descriere = data.get('descriere')
            Data = data.get('data')
            Ora = data.get('ora')
            Raion = data.get('raion')
            Oras = data.get('oras')
            Strada = data.get('strada')
            Nume = data.get('nume')
            Domeniu = data.get('domeniu')

            if Raion or Oras or Strada:

                cur.execute('SELECT loc_id FROM eveniment WHERE id = ?', (id,))
                loc_id = cur.fetchone()

                if loc_id:
                    loc_id = loc_id[0]

                    cur.execute('SELECT raion, oras, strada FROM loc WHERE id = ?', (loc_id,))
                    existing_loc = cur.fetchone()

                    if existing_loc:
                        existing_raion, existing_oras, existing_strada = existing_loc


                        if (existing_raion != Raion) or (existing_oras != Oras) or (existing_strada != Strada):
                            cur.execute('SELECT id FROM loc WHERE raion = ? AND oras = ? AND strada = ?', 
                                        (Raion, Oras, Strada))
                            loc_exists = cur.fetchone()

                            if loc_exists:
                                new_loc_id = loc_exists[0]
                            else:
                                cur.execute('''
                                    INSERT INTO loc (raion, oras, strada)
                                    VALUES (?, ?, ?)
                                ''', (Raion or existing_raion, Oras or existing_oras, Strada or existing_strada))
                                
                                new_loc_id = cur.lastrowid

                            cur.execute('''
                                UPDATE eveniment
                                SET loc_id = ?
                                WHERE id = ?
                            ''', (new_loc_id, id))
                        else:
                            cur.execute('''
                                UPDATE loc
                                SET raion = COALESCE(?, raion), 
                                    oras = COALESCE(?, oras), 
                                    strada = COALESCE(?, strada)
                                WHERE id = ?
                            ''', (Raion, Oras, Strada, loc_id))

            if Nume or Domeniu:
                cur.execute('SELECT organizator_id FROM eveniment WHERE id = ?', (id,))
                organizator_id = cur.fetchone()
                if organizator_id:
                    organizator_id = organizator_id[0]

                    cur.execute('SELECT nume, domeniu FROM organizator WHERE id = ?', (organizator_id,))
                    existing_org = cur.fetchone()

                    if existing_org:
                        existing_nume, existing_domeniu = existing_org

                        if (existing_nume != Nume) or (existing_domeniu != Domeniu):
                            cur.execute('SELECT id FROM organizator WHERE nume = ? AND domeniu = ?', 
                                        (Nume, Domeniu))
                            org_exists = cur.fetchone()

                            if org_exists:
                                new_org_id = org_exists[0]
                            else:
                                cur.execute('''
                                    INSERT INTO organizator (nume, domeniu)
                                    VALUES (?, ?)
                                ''', (Nume or existing_nume, Domeniu or existing_domeniu))
                                
                                new_org_id = cur.lastrowid

                            cur.execute('''
                                UPDATE eveniment
                                SET organizator_id = ?
                                WHERE id = ?
                            ''', (new_org_id, id))
                        else:
                            cur.execute('''
                                UPDATE organizator
                                SET nume = COALESCE(?, nume), 
                                    domeniu = COALESCE(?, domeniu)
                                WHERE id = ?
                            ''', (Nume, Domeniu, organizator_id))

            cur.execute('''
                UPDATE eveniment
                SET titlu = COALESCE(?, titlu),
                    descriere = COALESCE(?, descriere),
                    data = COALESCE(?, data),
                    ora = COALESCE(?, ora)
                WHERE id = ?
            ''', (Titlu, Descriere, Data, Ora, id))

            if cur.rowcount == 0:
                return jsonify({'status': 'error', 'message': 'Event not found'}), 404

            conn.commit()

    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({'status': 'error', 'message': 'Failed to update event', 'error': str(e)}), 500

    return jsonify({'status': 'success', 'message': 'Event updated successfully'}), 200


#delete an event from the database based on ID
#example http://127.0.0.1:5000/events/delete/1
@app.route('/events/delete/<int:id>', methods=['DELETE'])
def delete_event(id):
    try:
        conn = get_db_connection()
        with conn:
            cur = conn.cursor()
            
            cur.execute("DELETE FROM eveniment WHERE id = ?", (id,))
            
            if cur.rowcount == 0:
                return jsonify({'status': 'error', 'message': 'Event not found'}), 404
            
            conn.commit()
    
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({'status': 'error', 'message': 'Failed to delete event', 'error': str(e)}), 500
    
    return jsonify({'status': 'success', 'message': 'Event deleted successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
