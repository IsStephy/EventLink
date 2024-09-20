import flask
from flask import Flask, request, jsonify, abort
from validate import validate_event_data
from datetime import datetime, timedelta
import sqlite3
import os
from flask_cors import CORS

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
    data = request.get_json()  # Get JSON data from the request body

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
    # r.headers["Access-Control-Allow-Origin"] = '*'
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

            # Extract data from query parameters

            Titlu = data.get('titlu')
            Descriere = data.get('descriere')
            Data = data.get('data')
            Ora = data.get('ora')
            Raion = data.get('raion')
            Oras = data.get('oras')
            Strada = data.get('strada')
            Nume = data.get('nume')
            Domeniu = data.get('domeniu')

            # does not need validation because if any parameters are empty the function COALECE does not modify the value
            # Check if location needs updating
            if Raion or Oras or Strada:
                cur.execute('''
                    UPDATE loc
                    SET raion = COALESCE(?, raion), 
                        oras = COALESCE(?, oras), 
                        strada = COALESCE(?, strada)
                    WHERE id = (
                        SELECT loc_id FROM eveniment WHERE id = ?
                    )
                ''', (Raion, Oras, Strada, id))

            # Check if organizer needs updating
            if Nume or Domeniu:
                cur.execute('''
                    UPDATE organizator
                    SET nume = COALESCE(?, nume), 
                        domeniu = COALESCE(?, domeniu)
                    WHERE id = (
                        SELECT organizator_id FROM eveniment WHERE id = ?
                    )
                ''', (Nume, Domeniu, id))

            # Update event details
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
