from flask import Flask
import json
from heapq import heappop, heappush
from collections import defaultdict, Counter
import heapq

app = Flask(__name__)

def load_data(file_name):
    with open(file_name) as f:
        return json.load(f)

# Quicksort for sorting speakers by name
def quicksort_speakers(speakers):
    if len(speakers) <= 1:
        return speakers
    pivot = speakers[len(speakers) // 2]['name']
    less = [x for x in speakers if x['name'] < pivot]
    equal = [x for x in speakers if x['name'] == pivot]
    greater = [x for x in speakers if x['name'] > pivot]
    return quicksort_speakers(less) + equal + quicksort_speakers(greater)

# Dijkstra's algorithm for optimizing session schedules
def dijkstra_schedule(speakers, sessions, time_slots, rooms):
    schedule = []
    session_map = {session['name']: session['name'] for session in sessions}
    available_time_slots = [(slot['start_time'], slot['end_time']) for slot in time_slots]
    
    # Initialize room availability
    room_availability = {room: set(available_time_slots) for room in rooms}
    
    # Track sessions already scheduled
    scheduled_sessions = set()
    
    # Sort speakers by name before scheduling
    speakers = quicksort_speakers(speakers)
    
    for speaker in speakers:
        found_slot = False
        session_name = speaker['expertise']
        if session_name not in session_map:
            print(f"Error: No session found for expertise '{session_name}'.")
            continue
        
        # Try to find an available time slot and room
        for time_slot in available_time_slots:
            if time_slot[0] in speaker['availability']:
                for room in rooms:
                    if time_slot in room_availability[room]:
                        # Schedule the session
                        schedule.append({
                            'Speaker': speaker['name'],
                            'Session': session_name,
                            'Time Slot': f"{time_slot[0]} - {time_slot[1]}",
                            'Room': room
                        })
                        room_availability[room].remove(time_slot)
                        found_slot = True
                        break
                if found_slot:
                    break
        if not found_slot:
            print(f"Warning: Speaker {speaker['name']} could not be scheduled.")
    
    return schedule

# Huffman coding for compressing schedule data
def huffman_coding(data):
    class Node:
        def __init__(self, char, freq):
            self.char = char
            self.freq = freq
            self.left = None
            self.right = None

        def __lt__(self, other):
            return self.freq < other.freq

    def build_huffman_tree(text):
        frequency = Counter(text)
        priority_queue = [Node(char, freq) for char, freq in frequency.items()]
        heapq.heapify(priority_queue)
        
        while len(priority_queue) > 1:
            left = heapq.heappop(priority_queue)
            right = heapq.heappop(priority_queue)
            merged = Node(None, left.freq + right.freq)
            merged.left = left
            merged.right = right
            heapq.heappush(priority_queue, merged)
        
        return priority_queue[0]

    def build_code_table(root):
        def generate_code(node, current_code=""):
            if node is None:
                return {}
            if node.char is not None:
                return {node.char: current_code}
            codes = {}
            codes.update(generate_code(node.left, current_code + "0"))
            codes.update(generate_code(node.right, current_code + "1"))
            return codes
        
        return generate_code(root)

    def compress(text, code_table):
        return ''.join(code_table[char] for char in text)
    
    def decompress(encoded_text, code_table):
        reverse_code_table = {v: k for k, v in code_table.items()}
        current_code = ""
        decoded_text = []
        for bit in encoded_text:
            current_code += bit
            if current_code in reverse_code_table:
                decoded_text.append(reverse_code_table[current_code])
                current_code = ""
        return ''.join(decoded_text)
    
    root = build_huffman_tree(data)
    code_table = build_code_table(root)
    encoded_text = compress(data, code_table)
    decoded_text = decompress(encoded_text, code_table)
    
    return encoded_text, code_table, decoded_text


# Schedule conference function with Dijkstra’s algorithm integration
def schedule_conference(speakers, sessions, time_slots, rooms):
    # Sort speakers before scheduling
    speakers = quicksort_speakers(speakers)
    schedule = dijkstra_schedule(speakers, sessions, time_slots, rooms)
    
    # Convert the schedule to a string for Huffman coding
    schedule_str = json.dumps(schedule)
    encoded_schedule, code_table, decoded_schedule = huffman_coding(schedule_str)
    
   # print("Huffman Encoded Schedule:")
   # print(encoded_schedule)
    #print("Huffman Code Table:")
    #print(code_table)
    
    return schedule

@app.route("/speakers")
def show_all_speakers():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    return sorted([speaker['name'] for speaker in data['speakers']])


@app.route("/sessions")
def show_all_sessions():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    return [session['name'] for session in data['sessions']]

@app.route("/time-slots")
def show_time_slots():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    return [f"{time_slot['start_time']} - {time_slot['end_time']}" for time_slot in data['time_slots']]

@app.route("/rooms")
def show_rooms():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    return data['rooms']

@app.route("/schedule-conference")
def schedule():
    file_name = 'conference_data.json'
    data = load_data(file_name)
    return schedule_conference(data['speakers'], data['sessions'], data['time_slots'], data['rooms'])
