from flask import Flask, jsonify
from flask_cors import CORS
import json
from collections import defaultdict, Counter
import heapq

app = Flask(__name__)
CORS(app, support_credentials=True)

def load_data(file_name):
    with open(file_name) as f:
        return json.load(f)

# Function for sorting speakers by name
def quicksort_speakers(speakers):
    if len(speakers) <= 1:
        return speakers
    pivot = speakers[len(speakers) // 2]['name']
    less = [x for x in speakers if x['name'] < pivot]
    equal = [x for x in speakers if x['name'] == pivot]
    greater = [x for x in speakers if x['name'] > pivot]
    return quicksort_speakers(less) + equal + quicksort_speakers(greater)

# Function to build a bipartite graph
def build_bipartite_graph(speakers, sessions):
    speaker_sessions = defaultdict(list)
    session_speakers = defaultdict(list)

    for speaker in speakers:
        for session in sessions:
            if speaker['expertise'] == session['name']:
                speaker_sessions[speaker['name']].append(session['name'])
                session_speakers[session['name']].append(speaker['name'])

    return speaker_sessions, session_speakers

# Matching algorithm for speakers and sessions
def bipartite_matching(speaker_sessions, session_speakers):
    matches = {}
    for speaker, sessions in speaker_sessions.items():
        if sessions:
            matches[speaker] = sessions[0]  # Example: assign the first available session
    return matches

# Main function to schedule the conference
def schedule_conference(speakers, sessions, time_slots, rooms):
    if not (isinstance(speakers, list) and isinstance(sessions, list) and
            isinstance(time_slots, dict) and isinstance(rooms, list)):
        raise ValueError("Invalid data format. All inputs should be lists.")
    
    speaker_sessions, session_speakers = build_bipartite_graph(speakers, sessions)
    matches = bipartite_matching(speaker_sessions, session_speakers)
    
    schedule = []
    # Initialize room availability with time slots per day
    room_availability = {room['name']: {day: slots.copy() for day, slots in time_slots.items()} for room in rooms}

    # Assign sessions to speakers and rooms
    for speaker, session in matches.items():
        assigned = False
        speaker_availability = [a for s in speakers if s['name'] == speaker for a in s['availability']]
        
        for available_slot in speaker_availability:
            day = available_slot['day']
            time_slot = {'start_time': available_slot['start_time'], 'end_time': available_slot['end_time']}
            
            # Find an available room for the speaker's time slot
            for room in rooms:
                if day in room_availability[room['name']] and time_slot in room_availability[room['name']][day]:
                    schedule.append({
                        'Speaker': speaker,
                        'Session': session,
                        'Day': day,
                        'Time Slot': f"{time_slot['start_time']} - {time_slot['end_time']}",
                        'Room': room['name']
                    })
                    room_availability[room['name']][day].remove(time_slot)
                    assigned = True
                    break
            
            if assigned:
                break

    # Handle unmatched speakers
    unmatched_speakers = set(speaker_sessions.keys()) - set(matches.keys())
    unmatched_sessions = set(session_speakers.keys()) - set(matches.values())
    
    for speaker in unmatched_speakers:
        speaker_availability = [a for s in speakers if s['name'] == speaker for a in s['availability']]
        for available_slot in speaker_availability:
            day = available_slot['day']
            time_slot = {'start_time': available_slot['start_time'], 'end_time': available_slot['end_time']}
            for room in rooms:
                if day in room_availability[room['name']] and time_slot in room_availability[room['name']][day]:
                    if unmatched_sessions:
                        session = unmatched_sessions.pop()
                        schedule.append({
                            'Speaker': speaker,
                            'Session': session,
                            'Day': day,
                            'Time Slot': f"{time_slot['start_time']} - {time_slot['end_time']}",
                            'Room': room['name']
                        })
                        room_availability[room['name']][day].remove(time_slot)
                        break
    
    # Sort the schedule by Speaker's name for consistency
    sorted_schedule = sorted(schedule, key=lambda x: x['Speaker'])
    
    return sorted_schedule

#  Huffman coding implementation

def huffman_encoding(data):
    frequency = Counter(data)
    heap = [[weight, [symbol, ""]] for symbol, weight in frequency.items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    huffman_tree = sorted(heap[0][1:], key=lambda p: (len(p[1]), p))
    huffman_dict = {symbol: code for symbol, code in huffman_tree}
    encoded_data = ''.join(huffman_dict[symbol] for symbol in data)
    return encoded_data, huffman_dict

def huffman_decoding(encoded_data, huffman_dict):
    reverse_dict = {code: symbol for symbol, code in huffman_dict.items()}
    current_code = ""
    decoded_data = ""
    for bit in encoded_data:
        current_code += bit
        if current_code in reverse_dict:
            decoded_data += reverse_dict[current_code]
            current_code = ""
    return decoded_data

@app.route("/speakers")
def show_all_speakers():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    speakers = data['speakers']
    sorted_names = sorted([speaker['name'] for speaker in speakers])
    return jsonify(sorted_names)

@app.route("/sessions")
def show_all_sessions():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    return jsonify(data['sessions'])

@app.route("/time-slots")
def show_time_slots():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    response = {"time_slots": data.get('time_slots', {})}
    return jsonify(response)

@app.route("/rooms")
def show_rooms():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    rooms = data.get('rooms', [])
    return jsonify(rooms)

@app.route("/schedule-conference")
def schedule():
    try:
        file_name = 'conference_data.json'
        data = load_data(file_name)
        schedule_data = schedule_conference(data['speakers'], data['sessions'], data['time_slots'], data['rooms'])
        # Encode the schedule data
        encoded_schedule, huffman_tree = huffman_encoding(json.dumps(schedule_data))
        
        # Decode the schedule data 
        decodedData = huffman_decoding(encoded_schedule, huffman_tree)

        # Decoded data is string right now, so it should be json
        decodedData = json.loads(decodedData)
        
        return jsonify({
            'compressedData': encoded_schedule,
            'huffmanTree': huffman_tree,
            'decodedData': decodedData
        })
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500